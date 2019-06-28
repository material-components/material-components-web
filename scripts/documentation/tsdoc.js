"use strict";
exports.__esModule = true;
// import {ParserContext, TSDocParser} from '@microsoft/tsdoc';
var fs = require("fs");
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
var jsDocJson = require("../../jsDoc.json");
jsDocJson.children.forEach(function (file) {
    var filepath = file.name.replace(/\"/g, '');
    var componentPath = filepath.split('/')[0];
    var layers = file.children;
    var markdownString = '';
    layers.forEach(function (layer) {
        // only do foundation, adapter, component methods
        if (!filepath.endsWith('/adapter')) {
            return;
        }
        // create title
        var title = "### " + layer.name;
        markdownString += title;
        // add table layout header
        markdownString += 'Method Signature | Description \n --- | --- \n';
        // create function table
        var functions = layer.children;
        functions.forEach(function (func) {
            markdownString += func.name + " | " + func.signatures[0].comment.shortText + " \n";
        });
        console.log(componentPath, '\n'); //tslint:disable-line
        fs.writeFile("./packages/" + componentPath + "/markdown.md", markdownString, function (err) {
            console.log('error ', err); //tslint:disable-line
        });
    });
    // console.log(filepath, '\n'); //tslint:disable-line
    // console.log(file.children); //tslint:disable-line
});
