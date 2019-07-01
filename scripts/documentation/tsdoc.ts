import * as fs from 'fs';
import * as jsDocJson from '../../jsDoc.json';

class TypeScriptDocumentationGenerator {
  markdownBuffer: {};

  constructor() {
    this.markdownBuffer = {};
  }

  /**
   * Sets Markdown Documentation into markdownBuffer under the `component` name.
   * @param component Component that the `markdownString` describes
   * @param markdownString Markdown documentation source to be placed into README.md file
   */
  setMarkdownBuffer(component: string, markdownString: string) {
    let markdownComponentBuffer = this.markdownBuffer[component];
    if (markdownComponentBuffer) {
      markdownComponentBuffer.push(markdownString);
    } else {
      this.markdownBuffer[component] = [markdownString];
    }
  }

  /**
   * The main function of this class. Iterates through all classes/files
   * of the packages directory (already precompiled from `npm run build:docs:typescript`).
   * This then steps through all the esmodule classes (ie. foundations, adapters, components),
   * and iterates through all methods/properties.
   */
  generateDocs() {
    jsDocJson.children.forEach((jsDocSection) => {
      const filepath = jsDocSection.name.replace(/\"/g, '');
      const componentPath = filepath.split('/')[0];
      const esmodules = jsDocSection.children as any[];
      if (!esmodules) {
        return;
      }

      console.log(`-- generating docs for ${filepath}`);
      
      esmodules.forEach((esmodule) => this.generateDocsForModule(esmodule, componentPath));
    });

    this.generateMethodDescriptionTableMarkdown();
  }

  /**
   * 
   * @param esmodule Generated Typedoc object
   * @param componentPath string FilePath to the component esmodule (eg. mdc-drawer/adapter)
   */
  generateDocsForModule(esmodule, componentPath: string) {
    if (!esmodule.name.startsWith('MDC')) {
      // ignore util modules
      return;
    }
    if (esmodule.kindString === 'Variable' || esmodule.kindString === 'Type alias') {
      // 'Variable' === ignore cssClasses and Strings & util functions
      // 'Type alias' === TS Type declarations
      return;
    }

    const title = `### ${esmodule.name}\n`;
    let markdownString = `${title}\n`;
    markdownString += 'Method Signature | Description \n --- | --- \n';
    // create function table
    const functionAndProperties = esmodule.children;
    functionAndProperties.forEach((func) => {
      const {isPrivate, isProtected, isExported} = func.flags;
      if (isPrivate
        || isProtected
        || !isExported
        || !func.signatures
        || !func.signatures[0]
        || !func.signatures[0].comment
        || !func.signatures[0].comment.shortText) {
        // Ignore private/protected/non-exported methods and properties.
        // If no comment provided, do not record.
        return;
      }
      const comment = func.signatures[0].comment.shortText.replace('\n', ' ');
      markdownString += `${func.name} | ${comment} \n`;
    });

    this.setMarkdownBuffer(componentPath, markdownString);
  }

  /**
   * Generates Markdown file for each entry in `this.markdownBuffer`,
   * which is populated from `this.generateDocsForModule()`.
   */
  generateMethodDescriptionTableMarkdown() {
    for (let componentName in this.markdownBuffer) {
      const markdown = this.markdownBuffer[componentName].join('\n');
      const markdownFilePath = `./packages/${componentName}/methodDescriptionTable.md`;
      fs.writeFile(markdownFilePath, markdown, (error) => {
        console.log(`~~ generated ${markdownFilePath}`);
        if (error) {
          console.error('error ', error); //tslint:disable-line
        }
      });
    }
  }
}

/**
 * This currently only has been tested on mdc-drawer
 */
const docGenerator = new TypeScriptDocumentationGenerator();
docGenerator.generateDocs();