import {Documentalist, TypescriptPlugin} from '@documentalist/compiler';
import * as fs from 'fs';
import * as Handlebars from 'handlebars';
import * as path from 'path';
import * as util from 'util';
const readFile = util.promisify(fs.readFile);

interface MarkdownBuffer {[s: string]: {
  [c: string]: ModuleMarkdown[]};
}

interface ModuleMarkdown {
  methods?: ModuleMethod[];
  events?: ModuleEvent[];
  properties?: ModuleProperty[];
  moduleName: string;
  readmeDirectoryPath: string;
}

interface ModuleDocumentation {
  events: ModuleEvent[];
}

interface ModuleEvent {
  documentation: string;
}

interface ModuleMethod {
  methodSignature: string;
  documentation: string;
}

interface ModuleProperty {
  name: string;
  type: string;
  documentation: string;
}

interface DocumentationContent {
  tag?: string;
  value?: string;
}

const FOUNDATION = 'foundation';
const ADAPTER = 'adapter';
const README_FILE = 'README.md';

class TypeScriptDocumentationGenerator {
  docData?: {}; // Documentalist representation of methods/properties/events
  templateFunction: Handlebars.TemplateDelegate<{
    componentModules: ModuleMarkdown[],
    nonComponentModules: ModuleMarkdown[],
  }>;

  constructor() {
    this.docData = {};
    this.setupTemplates();
  }

  /**
   * Generates JSON from source files TypeScript documentation.
   * This contains all the esmodule classes (ie. foundations, adapters, components) in JSON format.
   * @returns Promise<{}>
   */
  async generateJSONFromFiles() {
    if (!this.templateFunction) console.log('AHHHHHH MEOW')
    return await new Documentalist()
      .use(/\.ts$/, new TypescriptPlugin({
        excludePaths: ['node_modules'],
        includeDeclarations: true,
      }))
      .documentGlobs('packages/**/*')
      .catch((error) => console.error(error)); // tslint:disable-line
  }

  /**
   * The main function of this class. Iterates through all modules found in docData (json).
   * This should already be generated from this.generateJSONFromFiles().
   * @param docData json containing documentation from documentalist
   */
  generateDocs(docData) {
    if (!docData) {
      console.error('FAILURE: Documentation generation did not compile correctly.'); // tslint:disable-line
    }
    const markdownBuffer: MarkdownBuffer = {};

    this.docData = docData.typescript;
    Object.keys(this.docData).forEach((module) => {
      console.log(`-- generating docs for ${module}`); // tslint:disable-line
      const docs = this.generateDocsForModule(module);
      if (docs) {
        const {readmeDirectoryPath, moduleName} = docs;
        const markdownComponentBuffer = markdownBuffer[readmeDirectoryPath];
        const isComponent =
          !moduleName.toLowerCase().includes(FOUNDATION) && !moduleName.toLowerCase().includes(ADAPTER);

        if (markdownComponentBuffer) {
          if (isComponent) {
            markdownComponentBuffer.component.push(docs);
          } else {
            markdownComponentBuffer.nonComponent.push(docs);
          }
        } else {
          if (isComponent) {
            markdownBuffer[readmeDirectoryPath] = {component: [docs], nonComponent: []};
          } else {
            markdownBuffer[readmeDirectoryPath] = {component: [], nonComponent: [docs]};
          }
        }
      }
    });

    this.generateMarkdownFileFromBuffer(markdownBuffer);
  }

  /**
   * Creates documentation for a specified `esmodule`.
   * @param esmodule module name (ie. MDCSelectIconFoundation)
   */
  generateDocsForModule(esmodule: string): ModuleMarkdown | undefined {
    const {kind, fileName} = this.docData[esmodule];
    const readmeDirectoryPath = this.getFilePathName(fileName);

    if (kind === 'type alias') {
      // ignore types and interfaces
      return;
    }
    return {
      events: this.getDocumentationForModule(esmodule).events,
      methods: this.getDocumentationForMethods(esmodule),
      moduleName: esmodule,
      properties: this.getDocumentationProperties(esmodule),
      readmeDirectoryPath,
    };
  }

  /**
   * This is higher level documentation from the class.
   * Currently this should only include events documentation.
   * @returns documentation of the esmodule.
   * @param esmodule module name (ie. MDCSelectIconFoundation)
   */
  getDocumentationForModule(esmodule: string): ModuleDocumentation {
    if (!this.docData
      || !this.docData[esmodule].documentation
      || !this.docData[esmodule].documentation.contents) {
      return {events: []};
    }
    // this only returns event data
    return {
      events: this.getDocumentationForEvents(esmodule),
    };
  }

  /**
   * Iterates through all events documented in the specified `esmodule`.
   * @returns list of events in the esmodule.
   * @param esmodule module name (ie. MDCSelectIconFoundation)
   */
  getDocumentationForEvents(esmodule: string): ModuleEvent[] {
    return (this.docData[esmodule].documentation.contents as DocumentationContent[])
      .filter((content) => content.tag && content.tag === 'events')
      .map((content) => ({documentation: content.value}));
  }

  /**
   * Iterates through all methods of a specified `esmodule`.
   * @returns list of method documentation of the esmodule.
   * @param esmodule module name (ie. MDCSelectIconFoundation)
   */
  getDocumentationForMethods(esmodule: string): ModuleMethod[] {
    if (!this.docData || !this.docData[esmodule].methods) {
      return [];
    }
    return this.docData[esmodule].methods
      .filter((method) => this.shouldIgnoreDocumentationItem(method, {
        hasDocumentation: method.signatures[0].documentation,
      }))
      .map((method) => {
        const {name, signatures} = method;
        const methodSignature = signatures[0].type;
        const documentation = signatures[0].documentation.contentsRaw;
        return {
          documentation: this.cleanComment(documentation),
          methodSignature: `${name}${methodSignature}`,
        };
      });
  }

  /**
   * Iterates through all properties of a specified `esmodule`.
   * @returns list of property documentation of the esmodule.
   * @param esmodule module name (ie. MDCSelectIconFoundation)
   */
  getDocumentationProperties(esmodule: string): ModuleProperty[] {
    if (!this.docData || !this.docData[esmodule].properties) {
      return [];
    }
    return this.docData[esmodule].properties
      .filter((property) => this.shouldIgnoreDocumentationItem(property, {
        hasDocumentation: property.documentation,
      }))
      .map((property) => {
        const {name, type} = property;
        const documentation = this.cleanComment(property.documentation.contentsRaw);
        return {
          documentation,
          name,
          type,
        };
      });
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
      const relativePathToReadme = path.resolve('packages', directoryPath, README_FILE);
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
   * Generates Markdown file for each entry in `this.markdownBuffer`,
   * which is populated from `this.generateDocsForModule()`.
   * @param markdownBuffer object where keys are the module name, and
   * value is the module documentation in json format, ready to be
   * formatted into markdown.
   */
  async generateMarkdownFileFromBuffer(markdownBuffer: MarkdownBuffer) {
    for (const readmeDirectoryPath in markdownBuffer) {
      /**
       * This currently only has been tested on mdc-drawer.
       * TODO: remove this if condition once all READMEs are generated
       */
      const allowList = [
        'mdc-drawer',
        'mdc-form-field',
        'mdc-grid-list',
        'mdc-icon-button',
        'mdc-line-ripple',
      ];

      if (allowList.some((allowed) => readmeDirectoryPath.includes(allowed))) {
        const readmeDestinationPath = `./packages/${readmeDirectoryPath}/${README_FILE}`;
        const finalReadmeMarkdown = await this.insertMethodDescriptionTable(markdownBuffer, readmeDirectoryPath);
        fs.writeFile(readmeDestinationPath, finalReadmeMarkdown, (error) => {
          console.log(`~~ generated ${readmeDestinationPath}`); // tslint:disable-line
          if (error) {
            console.error('error ', error); //tslint:disable-line
          }
        });
      }
    }
  }

  private setupTemplates() {
    const tablesTemplate = fs.readFileSync('./scripts/documentation/ts-api-tables.hbs', 'utf8');
    const tableTemplate = fs.readFileSync('./scripts/documentation/ts-api-table.hbs', 'utf8');
    Handlebars.registerPartial('tsApiTable', tableTemplate);
    this.templateFunction = Handlebars.compile(tablesTemplate, {noEscape: true});
  }

  /**
   * Returns a promise, that resolves with the finalized markdown with
   * inserted documentation in markdown table format.
   * @param markdownBuffer object where keys are the module name, and
   * value is the module documentation in json format, ready to be
   * formatted into markdown.
   * @param readmeDirectoryPath directory path to readme file
   * (ie. mdc-textfield/character-counter or mdc-drawer)
   * @return Promise<{string}>
   */
  private async insertMethodDescriptionTable(
    markdownBuffer: MarkdownBuffer,
    readmeDirectoryPath: string,
  ) {
    const readmeMarkdownPath = `./packages/${readmeDirectoryPath}/${README_FILE}`;
    const readmeMd = await readFile(readmeMarkdownPath, 'utf8');
    const componentModules = markdownBuffer[readmeDirectoryPath].component
      .filter((module) => module.methods.length || module.properties.length || module.events.length)
      .sort(this.sortByModuleType);
    const nonComponentModules = markdownBuffer[readmeDirectoryPath].nonComponent
      .filter((module) => module.methods.length || module.properties.length || module.events.length)
      .sort(this.sortByModuleType);
    const apiMarkdownTable =
      this.templateFunction({
        componentModules,
        nonComponentModules
      });

    const startReplacerToken
      = '<!-- docgen-tsdoc-replacer:start __DO NOT EDIT, This section is automatically generated__ -->';
    const endReplacerToken = '<!-- docgen-tsdoc-replacer:end -->';
    const regexString = `^${startReplacerToken}\\n(.|\\n)*${endReplacerToken}$`;
    const regex = new RegExp(regexString, 'gm');
    const insertedData = readmeMd.replace(
      regex,
      `${startReplacerToken}\n${apiMarkdownTable}\n${endReplacerToken}`,
    );

    return insertedData;
  }

  /** Sorts modules by the following rules:
   * 1. Components
   * 2. Adapters
   * 3. Foundations
   * 4. Alphabetized
   * @param a 1st module of comparison
   * @param b 2nd module of comparison
   */
  private sortByModuleType(a: ModuleMarkdown, b: ModuleMarkdown): number {
    const moduleA = a.moduleName.toLowerCase();
    const moduleB = b.moduleName.toLowerCase();
    if (!moduleA.includes(FOUNDATION) && !moduleA.includes(ADAPTER)) {
      return -1;
    } else if (moduleA.includes(FOUNDATION) && !moduleB.includes(FOUNDATION)) {
      return 1;
    } else if (moduleA.includes(FOUNDATION) && moduleB.includes(FOUNDATION)
      || moduleA.includes(ADAPTER) && moduleB.includes(ADAPTER)) {
      // alphabetize
      return moduleA > moduleB ? 1 : -1;
    }
    return 0;
  }

  /**
   * A filter function to strip out methods and properties that should not
   * appear in the Readme tables.
   * @param item Documentalist object representation of a method/event/property
   * @param opts object of different booleans - currently only has `hasDocumentation`
   */
  private shouldIgnoreDocumentationItem(item, opts = {hasDocumentation: true}) {
    // isState ignores cssClasses, defaultAdapter, strings
    const {isPrivate, isStatic} = item.flags;
    return !isPrivate && !isStatic && opts.hasDocumentation;
  }

  /**
   * Removes new lines from raw comment string
   * @param comment raw comment string
   */
  private cleanComment(comment) {
    const r = new RegExp(/\n/gm);
    return comment.replace(r, ' ');
  }
}

const docGenerator = new TypeScriptDocumentationGenerator();
docGenerator.generateJSONFromFiles()
  .then((json) => docGenerator.generateDocs(json));
