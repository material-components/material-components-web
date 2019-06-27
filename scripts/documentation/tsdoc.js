"use strict";
exports.__esModule = true;
var tsdoc_1 = require("@microsoft/tsdoc");
var fs_1 = require("fs");
// import {sync as glob} from 'glob';
function buildTsDocs() {
    console.log('Building JS Docs'); //tslint:disable-line
    // const tsFiles = glob('packages/**/*.ts', {
    //   ignore: ['**/node_modules/**'],
    // });
    var tsFile = 'packages/mdc-textfield/adapter.ts';
    // tsFiles.forEach((tsFile) => {
    console.log("\n parsing " + tsFile); //tslint:disable-line
    var inputBuffer = fs_1.readFileSync(tsFile).toString();
    var tsdocParser = new tsdoc_1.TSDocParser();
    var parserContext = tsdocParser.parseString(inputBuffer);
    var t = parserContext.docComment.params;
    console.log(t); //tslint:disable-line
    // });
}
buildTsDocs();
