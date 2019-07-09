import {Documentalist, TypescriptPlugin} from '@documentalist/compiler';
import * as fs from 'fs';

class TypeScriptDocumentationGenerator {
  markdownBuffer: {};
  docData?: {};

  constructor() {
    this.docData = {};
    this.markdownBuffer = {};
  }

  /**
   * Generates JSON from source files TypeScript documentation.
   * This contains all the esmodule classes (ie. foundations, adapters, components) in JSON format.
   * @returns Promise(json)
   */
  generateJSONFromFiles() {
    return new Promise((resolve, reject) => {
      new Documentalist()
        .use(/\.ts$/, new TypescriptPlugin({
          excludePaths: ['node_modules'],
          includeDeclarations: true,
        }))
        .documentGlobs('packages/**/*') // ← async operation, returns a Promise
        .then((docs) => {
          resolve(docs);
          // TODO - remove when all docs are complete
          // return JSON.stringify(docs, null, 2);
        })
        /*
        .then((json) => {
          // TODO: comment out - just for debugging purposes.
          fs.writeFileSync('docs.json', json);
        })
        */
        .catch((error) => console.error(error)); // tslint:disable-line
    });
  }

  /**
   * The main function of this class. Iterates through all modules found in docData (json).
   * This should already be generated from this.generateJSONFromFiles().
   * @param docData json containing documentation from documentalist
   */
  generateDocs(docData) {
    this.docData = docData.typescript;
    Object.keys(this.docData).forEach((module) => {
      console.log(`-- generating docs for ${module}`); // tslint:disable-line
      this.generateDocsForModule(module);
    });

    this.generateMarkdownFileFromBuffer();
  }

  /**
   * Creates documentation for a specified `esmodule`.
   * @param esmodule module name (ie. MDCSelectIconFoundation)
   */
  generateDocsForModule(esmodule: string) {
    const markdownString =
      this.getDocumentationForModule(esmodule)
      + this.getDocumentationForMethods(esmodule)
      + this.getDocumentationProperties(esmodule);
    if (this.docData[esmodule].kind === 'type alias') {
      return;
    }

    this.setMarkdownBuffer(this.docData[esmodule].fileName, markdownString);
  }

  /**
   * This is higher level documentation from the class.
   * @returns documentation markdown table in string format.
   * @param esmodule module name (ie. MDCSelectIconFoundation)
   */
  getDocumentationForModule(esmodule: string): string {
    const title = `### ${esmodule}\n\n`;
    if (!this.docData || !this.docData[esmodule].documentation) {
      return title;
    }
    const documentation = this.cleanComment(this.docData[esmodule].documentation.contentsRaw);
    return `${title}${documentation}\n\n`;
  }

  /**
   * Iterates through all methods of a specified `esmodule`.
   * @returns documentation markdown table in string format.
   * @param esmodule module name (ie. MDCSelectIconFoundation)
   */
  getDocumentationForMethods(esmodule: string): string {
    if (!this.docData) {
      return '';
    }
    const {methods} = this.docData[esmodule];
    if (!methods || !methods.length) {
      return '';
    }
    const title = `#### Methods\n\n`;
    const tableHeader = 'Name | Signature | Description\n--- | --- | --- \n';
    const methodDocs = methods.reduce((markdownString, method) =>
      this.getDocumentationFromItem(markdownString, method, {isMethod: true}), '');
    if (!methodDocs.length) {
      return '';
    }
    return `${title}${tableHeader}${methodDocs}\n`;
  }

  /**
   * Iterates through all properties of a specified `esmodule`.
   * @returns documentation markdown table in string format.
   * @param esmodule module name (ie. MDCSelectIconFoundation)
   */
  getDocumentationProperties(esmodule: string): string {
    if (!this.docData) {
      return '';
    }
    const {properties} = this.docData[esmodule];
    if (!properties || !properties.length) {
      return '';
    }

    const title = `#### Properties\n\n`;
    const tableHeader = 'Name | Type | Description\n--- | --- | --- \n';
    const propertyDocs = properties.reduce((markdownString, property) =>
      this.getDocumentationFromItem(markdownString, property), '');
    if (!propertyDocs.length) {
      return '';
    }
    return `${title}${tableHeader}${propertyDocs}\n`;
  }

  getDocumentationFromItem(markdownString, item, opts = {isMethod: false}) {
    // isState ignores cssClasses, defaultAdapter, strings
    const {isProtected, isStatic} = item.flags;
    if (isProtected || isStatic) {
      return markdownString;
    }

    const itemName = item.name;
    const itemSignature = opts.isMethod ? item.signatures[0].type : item.type;
    let documentation;
    if (opts.isMethod && item.signatures[0].documentation) {
      documentation = item.signatures[0].documentation.contentsRaw;
    } else if (item.documentation) {
      documentation = item.documentation.contentsRaw;
    }
    documentation = documentation && documentation.length ? this.cleanComment(documentation) : 'n/a';
    return `${markdownString}${itemName} | ${this.cleanType(itemSignature)} | ${documentation}\n`;
  }

  /**
   * Sets Markdown Documentation into markdownBuffer under the `component` name.
   * @param component Component that the `markdownString` describes
   * @param markdownString Markdown documentation source to be placed into README.md file
   */
  private setMarkdownBuffer(filePath: string, markdownString: string) {
    const component = filePath.split('/')[1]; // ie. mdc-ripple, mdc-textfield
    const markdownComponentBuffer = this.markdownBuffer[component];
    if (markdownComponentBuffer) {
      markdownComponentBuffer.push(markdownString);
    } else {
      this.markdownBuffer[component] = [markdownString];
    }
  }

  /**
   * Generates Markdown file for each entry in `this.markdownBuffer`,
   * which is populated from `this.generateDocsForModule()`.
   */
  async generateMarkdownFileFromBuffer() {
    for (const componentName in this.markdownBuffer) {
      /**
       * This currently only has been tested on mdc-drawer.
       * TODO: remove this if condition once all READMEs are generated
       */
      const allowList = [
        'mdc-drawer',
        // 'mdc-textfield',
      ];

      if (allowList.includes(componentName)) {
        const readmeDestinationPath = `./packages/${componentName}/README.md`;
        const finalReadmeMarkdown = await this.insertMethodDescriptionTable(componentName);
        fs.writeFile(readmeDestinationPath, finalReadmeMarkdown, (error) => {
          console.log(`~~ generated ${readmeDestinationPath}`); // tslint:disable-line
          if (error) {
            console.error('error ', error); //tslint:disable-line
          }
        });
      }
    }
  }

  private insertMethodDescriptionTable(componentName: string) {
    const methodDescriptionTableMarkdown = this.markdownBuffer[componentName].join('\n');
    const readmeMarkdownPath = `./packages/${componentName}/README.md`;
    return new Promise((resolve, reject) => {
      fs.readFile(readmeMarkdownPath, 'utf8', (error, data) => {
        if (error) {
          return reject(error);
        }
        const startReplacerToken = '<!-- docgen-tsdoc-replacer:start -->';
        const endReplacerToken = '<!-- docgen-tsdoc-replacer:end -->';
        const regexString = `^${startReplacerToken}\\n(.|\n)*${endReplacerToken}$`;
        const regex = new RegExp(regexString, 'gm');
        const insertedData = data.replace(
          regex,
          `${startReplacerToken}\n${methodDescriptionTableMarkdown}\n${endReplacerToken}`,
        );
        resolve(insertedData);
      });
    });
  }

  private cleanComment(comment) {
    return comment.replace('\n', ' ');
  }

  private cleanType(typing) {
    // do not break markdown table format
    return typing.replace(' | ', ' \\| ');
  }
}

const docGenerator = new TypeScriptDocumentationGenerator();
docGenerator.generateJSONFromFiles()
  .then((json) => docGenerator.generateDocs(json));
