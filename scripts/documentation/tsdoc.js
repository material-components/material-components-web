"use strict";
exports.__esModule = true;
var fs = require("fs");
var jsDocJson = require("../../jsDoc.json");
var TypeScriptDocumentationGenerator = /** @class */ (function () {
    function TypeScriptDocumentationGenerator() {
        this.markdownBuffer = {};
    }
    /**
     * Sets Markdown Documentation into markdownBuffer under the `component` name.
     * @param component Component that the `markdownString` describes
     * @param markdownString Markdown documentation source to be placed into README.md file
     */
    TypeScriptDocumentationGenerator.prototype.setMarkdownBuffer = function (component, markdownString) {
        var markdownComponentBuffer = this.markdownBuffer[component];
        if (markdownComponentBuffer) {
            markdownComponentBuffer.push(markdownString);
        }
        else {
            this.markdownBuffer[component] = [markdownString];
        }
    };
    /**
     * The main function of this class. Iterates through all classes/files
     * of the packages directory (already precompiled from `npm run build:docs:typescript`).
     * This then steps through all the esmodule classes (ie. foundations, adapters, components),
     * and iterates through all methods/properties.
     */
    TypeScriptDocumentationGenerator.prototype.generateDocs = function () {
        var _this = this;
        jsDocJson.children.forEach(function (jsDocSection) {
            var filepath = jsDocSection.name.replace(/\"/g, '');
            var componentPath = filepath.split('/')[0];
            var esmodules = jsDocSection.children;
            if (!esmodules) {
                return;
            }
            console.log("-- generating docs for " + filepath);
            esmodules.forEach(function (esmodule) { return _this.generateDocsForModule(esmodule, componentPath); });
        });
        this.generateMarkdownFiles();
    };
    /**
     *
     * @param esmodule Generated Typedoc object
     * @param componentPath string FilePath to the component esmodule (eg. mdc-drawer/adapter)
     */
    TypeScriptDocumentationGenerator.prototype.generateDocsForModule = function (esmodule, componentPath) {
        if (!esmodule.name.startsWith('MDC')) {
            // ignore util modules
            return;
        }
        if (esmodule.kindString === 'Variable' || esmodule.kindString === 'Type alias') {
            // 'Variable' === ignore cssClasses and Strings & util functions
            // 'Type alias' === TS Type declarations
            return;
        }
        var title = "### " + esmodule.name + "\n";
        var markdownString = title + "\n";
        markdownString += 'Method Signature | Description \n --- | --- \n';
        // create function table
        var functionAndProperties = esmodule.children;
        functionAndProperties.forEach(function (func) {
            var _a = func.flags, isPrivate = _a.isPrivate, isProtected = _a.isProtected, isExported = _a.isExported;
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
            var comment = func.signatures[0].comment.shortText.replace('\n', ' ');
            markdownString += func.name + " | " + comment + " \n";
        });
        this.setMarkdownBuffer(componentPath, markdownString);
    };
    /**
     * Generates Markdown file for each entry in `this.markdownBuffer`,
     * which is populated from `this.generateDocsForModule()`.
     */
    TypeScriptDocumentationGenerator.prototype.generateMarkdownFiles = function () {
        var _loop_1 = function (componentName) {
            var markdown = this_1.markdownBuffer[componentName].join('\n');
            var markdownFilePath = "./packages/" + componentName + "/markdown.md";
            fs.writeFile(markdownFilePath, markdown, function (error) {
                console.log("~~ generated " + markdownFilePath);
                if (error) {
                    console.error('error ', error); //tslint:disable-line
                }
            });
        };
        var this_1 = this;
        for (var componentName in this.markdownBuffer) {
            _loop_1(componentName);
        }
    };
    return TypeScriptDocumentationGenerator;
}());
/**
 * This currently only has been tested on mdc-drawer
 */
var docGenerator = new TypeScriptDocumentationGenerator();
docGenerator.generateDocs();
