import {ParserContext, TSDocParser} from '@microsoft/tsdoc';
import {readFileSync} from 'fs';

// import {sync as glob} from 'glob';

function buildTsDocs() {
  console.log('Building JS Docs'); //tslint:disable-line
  // const tsFiles = glob('packages/**/*.ts', {
  //   ignore: ['**/node_modules/**'],
  // });

  const tsFile = 'packages/mdc-textfield/adapter.ts';

  // tsFiles.forEach((tsFile) => {
  console.log(`\n parsing ${tsFile}`); //tslint:disable-line
  const inputBuffer: string = readFileSync(tsFile).toString();
  const tsdocParser: TSDocParser = new TSDocParser();
  const parserContext: ParserContext = tsdocParser.parseString(inputBuffer);
  const t = parserContext.docComment.params;
  console.log(t); //tslint:disable-line
  // });
}

buildTsDocs();
