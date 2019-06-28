// import {ParserContext, TSDocParser} from '@microsoft/tsdoc';
import * as fs from 'fs';

// // import {sync as glob} from 'glob';

// function buildTsDocs() {
//   console.log('Building JS Docs'); //tslint:disable-line
//   // const tsFiles = glob('packages/**/*.ts', {
//   //   ignore: ['**/node_modules/**'],
//   // });

//   const tsFile = 'packages/mdc-textfield/adapter.ts';

//   // tsFiles.forEach((tsFile) => {
//   console.log(`\n parsing ${tsFile}`); //tslint:disable-line
//   const inputBuffer: string = readFileSync(tsFile).toString();
//   const tsdocParser: TSDocParser = new TSDocParser();
//   const parserContext: ParserContext = tsdocParser.parseString(inputBuffer);
//   const t = parserContext.docComment.params;
//   console.log(t); //tslint:disable-line
//   // });
// }

// buildTsDocs();

import * as jsDocJson from '../../jsDoc.json';

jsDocJson.children.forEach((file) => {
  const filepath = file.name.replace(/\"/g, '');
  const componentPath = filepath.split('/')[0];
  const layers = file.children;
  let markdownString = '';
  layers.forEach((layer) => {
    // only do foundation, adapter, component methods
    if (!filepath.endsWith('/adapter')) {
      return;
    }
    // create title
    const title = `### ${layer.name}`;
    markdownString += title;
    // add table layout header
    markdownString += 'Method Signature | Description \n --- | --- \n';
    // create function table
    const functions = layer.children;
    functions.forEach((func) => {
      markdownString += `${func.name} | ${func.signatures[0].comment.shortText} \n`;
    });

    console.log(componentPath, '\n'); //tslint:disable-line
    fs.writeFile(`./packages/${componentPath}/markdown.md`, markdownString, (err) => {
      console.log('error ', err); //tslint:disable-line
    });
  });
  // console.log(filepath, '\n'); //tslint:disable-line
  // console.log(file.children); //tslint:disable-line
});
