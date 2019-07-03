import * as fs from 'fs';
import {ReflectionKind} from 'typedoc/dist/lib/models';
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
    const markdownComponentBuffer = this.markdownBuffer[component];
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
      const esmodules = jsDocSection.children as any[]; // tslint:disable-line
      if (!esmodules) {
        return;
      }
      console.log(`-- generating docs for ${filepath}`); // tslint:disable-line
      esmodules.forEach((esmodule) => this.generateDocsForModule(esmodule, componentPath));
    });

    this.generateMarkdownFile();
  }

  /**
   * Creates a documentation for a specified `esmodule`, and creates a markdown string
   * to be inserted into the main README.md.
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

    const markdownString = this.getClassDocumentationFromModule(esmodule)
      + this.getFunctionAndPropertiesFromModule(esmodule);

    this.setMarkdownBuffer(componentPath, markdownString);
  }

  /**
   * Generates higher level documentation markdown for specified `esmodule`
   * @param esmodule Generate Typedoc object
   * @returns generated markdown string containing higher level documentation of the `esmodule`
   */
  getClassDocumentationFromModule(esmodule): string {
    const commentsByType: {fires?: {}} = {};
    if (!esmodule.comment || !esmodule.comment.tags || esmodule.comment.tags.length <= 0) {
      return '';
    }
    esmodule.comment.tags.forEach((tag) => {
      const commentType = tag.tag;
      if (commentsByType[commentType]) {
        commentsByType[commentType].push(tag);
      } else {
        commentsByType[commentType] = [tag];
      }
    });
    let markdownString = '';
    if (commentsByType.fires) {
      // @fires describes events that are emitted
      // https://jsdoc.app/tags-fires.html
      markdownString = this.generateEventComments(commentsByType.fires);
    }
    return markdownString;
  }

  /**
   * Generates method description table markdown for specified `esmodule
   * @param esmodule Generate Typedoc object
   * @returns generated markdown string containing documentation of the `esmodule`
   */
  getFunctionAndPropertiesFromModule(esmodule): string {
    let markdownString = `### ${esmodule.name}\n\n`;
    markdownString += 'Method Signature | Description \n --- | --- \n';
    const functionAndProperties = esmodule.children;
    functionAndProperties.forEach((func) => {
      switch (func.kind) {
        case ReflectionKind.Function: {
          markdownString += this.getComment(func);
          break;
        }
        case ReflectionKind.Method: {
          markdownString += this.getComment(func);
          break;
        }
        case ReflectionKind.Accessor: {
          if (!func.comment) {
            return;
          }
          const comment = this.cleanComment(`${func.name} | ${func.comment.shortText} ${func.comment.shortText}`);
          markdownString += `\n`;
          break;
        }
        default: {
          // do nothing
        }
      }
    });
    return markdownString;
  }

  getComment(property) {
    if (!property.signatures
      || !property.signatures[0]
      || !property.signatures[0].comment
      || !property.signatures[0].comment.shortText) {
      // If no comment provided, do not record.
      return '';
    }
    const comment = this.cleanComment(property.signatures[0].comment.shortText);
    return `${property.name} | ${comment} \n`;
  }

  /**
   * Generates markdown of events emited by esmodule
   * @param eventCommentTags {tag: 'fires', text: string} text is description of event emitted.
   */
  generateEventComments(eventCommentTags) {
    let markdownString = '### Events\n\n';
    // @todo convert to reduce method
    eventCommentTags.forEach((eventComment) => {
      markdownString += `- ${this.cleanComment(eventComment.text)}\n`;
    });
    return `${markdownString}\n`;
  }

  /**
   * Generates Markdown file for each entry in `this.markdownBuffer`,
   * which is populated from `this.generateDocsForModule()`.
   */
  generateMarkdownFile(): void {
    for (const componentName in this.markdownBuffer) {
      const markdown = this.markdownBuffer[componentName].join('\n');
      const markdownFilePath = `./packages/${componentName}/methodDescriptionTable.md`;
      fs.writeFile(markdownFilePath, markdown, (error) => {
        console.log(`~~ generated ${markdownFilePath}`); // tslint:disable-line
        if (error) {
          console.error('error ', error); //tslint:disable-line
        }
      });
    }
  }

  cleanComment(comment) {
    return comment.replace('\n', ' ');
  }
}

/**
 * This currently only has been tested on mdc-drawer
 */
const docGenerator = new TypeScriptDocumentationGenerator();
docGenerator.generateDocs();
