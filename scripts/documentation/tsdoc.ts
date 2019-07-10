import {Documentalist, TypescriptPlugin} from '@documentalist/compiler';
import * as fs from 'fs';
import * as path from 'path';

const markdownHeaderLevel = '###';
const markdownSubHeaderLevel = '####';

interface ModuleMarkdown {
  methods?: ModuleMethods[];
  moduleName: string;
  readmeDirectoryPath: string;
}
interface ModuleMethods {
  methodSignature: string;
  documentation: string;
}

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
   * @returns Promise<{}>
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
          return JSON.stringify(docs, null, 2);
        })
        .then((json) => {
          // TODO: comment out - just for debugging purposes.
          fs.writeFileSync('docs.json', json);
        })
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
    const {kind, fileName} = this.docData[esmodule];
    const readmeDirectoryPath = this.getFilePathName(fileName);

    if (kind === 'type alias') {
      // ignore types and interfaces
      return;
    }
    const markdownObject: ModuleMarkdown = {
      methods: this.getDocumentationForMethods(esmodule),
      moduleName: esmodule,
      readmeDirectoryPath,
    };
      // + this.getDocumentationProperties(esmodule)
      // + this.getDocumentationForModule(esmodule);

    this.setMarkdownBuffer(readmeDirectoryPath, markdownObject);
  }

  /**
   * This is higher level documentation from the class.
   * Currently this should only include events documentation.
   * @returns documentation markdown table in string format.
   * @param esmodule module name (ie. MDCSelectIconFoundation)
   */
  getDocumentationForModule(esmodule: string): string {
    const title = `${markdownSubHeaderLevel} Events\n`;
    const tableHeader = 'Name | Detail | Description\n--- | --- | --- \n';
    if (!this.docData || !this.docData[esmodule].documentation) {
      return '';
    }
    const {contents} = this.docData[esmodule].documentation;
    if (!contents || !contents.length) {
      return '';
    }
    const eventsTable = contents.reduce((markdownString: string, content: {tag?: string, value?: string}) => {
      if (!content.tag || content.tag !== 'events') {
        return markdownString;
      }
      const {value} = content;
      const separatedValue = value.split('%-%'); // created this separator
      const eventName = separatedValue[0];
      const eventDescription = separatedValue[1];
      const eventDetail = separatedValue[2];
      const eventRow = `${eventName} | \`${eventDetail}\`  | ${eventDescription}\n`;
      return `${markdownString}${eventRow}`;
    }, '');

    if (!eventsTable.length) {
      return '';
    }

    return `${title}${tableHeader}${eventsTable}\n\n`;
  }

  /**
   * Iterates through all methods of a specified `esmodule`.
   * @returns listof documentation for methods of the esmodule.
   * @param esmodule module name (ie. MDCSelectIconFoundation)
   */
  getDocumentationForMethods(esmodule: string): ModuleMethods[] {
    if (!this.docData || !this.docData[esmodule].methods) {
      return [];
    }
    return this.docData[esmodule].methods
      .filter((method) => {
        // isState ignores cssClasses, defaultAdapter, strings
        const {isProtected, isStatic} = method.flags;
        const hasDocumentation = method.signatures[0].documentation;
        return !isProtected && !isStatic && hasDocumentation;
      })
      .map((method) => {
        const methodName = method.name;
        const methodSignature = method.signatures[0].type;
        const documentation = method.signatures[0].documentation.contentsRaw;
        return {
          documentation: this.cleanComment(documentation),
          methodSignature: `${methodName}${methodSignature}`,
        };
      });
    // const title = `${markdownSubHeaderLevel} Methods\n\n`;
    // const tableHeader = 'Signature | Description\n--- | --- \n';
    // return `${title}${tableHeader}${methodDocs}\n`;
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

    const title = `${markdownSubHeaderLevel} Properties\n\n`;
    const tableHeader = 'Name | Type | Description\n--- | --- | --- \n';
    const propertyDocs = properties.reduce((markdownString, property) => {
      // isState ignores cssClasses, defaultAdapter, strings
      const {isProtected, isStatic} = property.flags;
      if (isProtected || isStatic) {
        return markdownString;
      }

      const propertyName = property.name;
      const propertySignature = property.type;
      let documentation;
      if (property.documentation) {
        documentation = property.documentation.contentsRaw;
      }
      if (!documentation) {
        // ignore methods without any documentation
        return markdownString;
      }
      return `${markdownString}${propertyName} | \`${propertySignature}\` | ${this.cleanComment(documentation)}\n`;
    }, '');
    if (!propertyDocs.length) {
      return '';
    }
    return `${title}${tableHeader}${propertyDocs}\n`;
  }

  /**
   * Returns relative file path to ./packages, and closest directory
   * with a README.md file (ie. mdc-textfield/helper-text, mdc-drawer).
   * @param filePath original file path
   */
  private getFilePathName(filePath: string): string {
    const startingIndex = filePath.indexOf('/mdc-') + 1; // +1 is to ignore leading '/'
    const endIndex = filePath.lastIndexOf('/');
    const directoryPath = filePath.substring(startingIndex, endIndex);
    try {
      const relativePathToReadme = path.resolve('packages', directoryPath, 'README.md');
      if (fs.existsSync(relativePathToReadme)) {
        return directoryPath;
      }
      // look one directory level up
      return this.getFilePathName(directoryPath);
    } catch (err) {
      console.error(err); //tslint:disable-line
    }
    return '';
  }

  /**
   * Sets Markdown Documentation into markdownBuffer under the `component` name.
   * @param component Component that the `markdownString` describes.
   * @param moduleMarkdown List of methods and properties with documentation from esmodule source.
   */
  private setMarkdownBuffer(readmeDirectoryPath: string, moduleMarkdown: ModuleMarkdown) {
    const markdownComponentBuffer = this.markdownBuffer[readmeDirectoryPath];
    if (markdownComponentBuffer) {
      markdownComponentBuffer.push(moduleMarkdown);
    } else {
      this.markdownBuffer[readmeDirectoryPath] = [moduleMarkdown];
    }
  }

  /**
   * Generates Markdown file for each entry in `this.markdownBuffer`,
   * which is populated from `this.generateDocsForModule()`.
   */
  async generateMarkdownFileFromBuffer() {
    for (const readmeDirectoryPath in this.markdownBuffer) {
      /**
       * This currently only has been tested on mdc-drawer.
       * TODO: remove this if condition once all READMEs are generated
       */
      const allowList = [
        'mdc-drawer',
        'mdc-textfield',
      ];

      if (allowList.some((allowed) => readmeDirectoryPath.includes(allowed))) {
        const readmeDestinationPath = `./packages/${readmeDirectoryPath}/test_README.md`;
        const finalReadmeMarkdown = await this.insertMethodDescriptionTable(readmeDirectoryPath);
        fs.writeFile(readmeDestinationPath, finalReadmeMarkdown, (error) => {
          console.log(`~~ generated ${readmeDestinationPath}`); // tslint:disable-line
          if (error) {
            console.error('error ', error); //tslint:disable-line
          }
        });
      }
    }
  }

  private insertMethodDescriptionTable(readmeDirectoryPath: string) {
    const methodDescriptionTableMarkdown = this.markdownBuffer[readmeDirectoryPath];
      // .sort(this.sortByModuleType)
      // .join('\n');
    const readmeMarkdownPath = `./packages/${readmeDirectoryPath}/test_README.md`;
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

  // private sortByModuleType(a: string, b: string) {
  //   const FOUNDATION = 'foundation';
  //   const ADAPTER = 'adapter';
  //   const moduleNameRegex = new RegExp(/^### (MDC[a-zA-Z]*)/g);
  //   const moduleA = a.match(moduleNameRegex)[0].toLowerCase();
  //   const moduleB = b.match(moduleNameRegex)[0].toLowerCase();
  //   if (!moduleA.includes(FOUNDATION) && !moduleA.includes(ADAPTER)) {
  //     return -1;
  //   } else if (moduleA.includes(FOUNDATION) && !moduleB.includes(FOUNDATION)) {
  //     return 1;
  //   } else if (moduleA.includes(FOUNDATION) && moduleB.includes(FOUNDATION)
  //     || moduleA.includes(ADAPTER) && moduleB.includes(ADAPTER)) {
  //     // alphabetize
  //     return moduleA > moduleB;
  //   }
  //   return 0;
  // }

  private cleanComment(comment) {
    const r = new RegExp(/\n/gm);
    return comment.replace(r, ' ');
  }
}

const docGenerator = new TypeScriptDocumentationGenerator();
docGenerator.generateJSONFromFiles()
  .then((json) => docGenerator.generateDocs(json));
