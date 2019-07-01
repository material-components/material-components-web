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
            var esmodules = jsDocSection.children; // tslint:disable-line
            if (!esmodules) {
                return;
            }
            if (filepath !== 'mdc-drawer/component') {
                return;
            }
            console.log("-- generating docs for " + filepath); // tslint:disable-line
            esmodules.forEach(function (esmodule) { return _this.generateDocsForModule(esmodule, componentPath); });
        });
        this.generateMarkdownFile();
    };
    /**
     * Creates a documentation for a specified `esmodule`, and creates a markdown string
     * to be inserted into the main README.md.
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
        var markdownString = this.getClassDocumentationFromModule(esmodule)
            + this.getFunctionAndPropertiesFromModule(esmodule);
        this.setMarkdownBuffer(componentPath, markdownString);
    };
    /**
     * Generates higher level documentation markdown for specified `esmodule`
     * @param esmodule Generate Typedoc object
     * @returns generated markdown string containing higher level documentation of the `esmodule`
     */
    TypeScriptDocumentationGenerator.prototype.getClassDocumentationFromModule = function (esmodule) {
        var commentsByType = {};
        if (!esmodule.comment || !esmodule.comment.tags || esmodule.comment.tags.length <= 0) {
            return '';
        }
        esmodule.comment.tags.forEach(function (tag) {
            var commentType = tag.tag;
            if (commentsByType[commentType]) {
                commentsByType[commentType].push(tag);
            }
            else {
                commentsByType[commentType] = [tag];
            }
        });
        var markdownString = '';
        if (commentsByType.fires) {
            // @fires describes events that are emitted
            // https://jsdoc.app/tags-fires.html
            markdownString = this.generateEventComments(commentsByType.fires);
        }
        return markdownString;
    };
    /**
     * Generates method description table markdown for specified `esmodule
     * @param esmodule Generate Typedoc object
     * @returns generated markdown string containing documentation of the `esmodule`
     */
    TypeScriptDocumentationGenerator.prototype.getFunctionAndPropertiesFromModule = function (esmodule) {
        var markdownString = "### " + esmodule.name + "\n\n";
        markdownString += 'Method Signature | Description \n --- | --- \n';
        var functionAndProperties = esmodule.children;
        functionAndProperties.forEach(function (func) {
            if (!func.signatures
                || !func.signatures[0]
                || !func.signatures[0].comment
                || !func.signatures[0].comment.shortText) {
                // If no comment provided, do not record.
                return;
            }
            var comment = func.signatures[0].comment.shortText.replace('\n', ' ');
            markdownString += func.name + " | " + comment + " \n";
        });
        return markdownString;
    };
    /**
     * Generates markdown of events emited by esmodule
     * @param eventCommentTags {tag: 'fires', text: string} text is description of event emitted.
     */
    TypeScriptDocumentationGenerator.prototype.generateEventComments = function (eventCommentTags) {
        var markdownString = '### Events\n\n';
        // @todo convert to reduce method
        eventCommentTags.forEach(function (eventComment) {
            markdownString += "- " + eventComment.text.replace('\n', ' ') + "\n";
        });
        return markdownString + "\n";
    };
    /**
     * Generates Markdown file for each entry in `this.markdownBuffer`,
     * which is populated from `this.generateDocsForModule()`.
     */
    TypeScriptDocumentationGenerator.prototype.generateMarkdownFile = function () {
        var _loop_1 = function (componentName) {
            var markdown = this_1.markdownBuffer[componentName].join('\n');
            var markdownFilePath = "./packages/" + componentName + "/methodDescriptionTable.md";
            fs.writeFile(markdownFilePath, markdown, function (error) {
                console.log("~~ generated " + markdownFilePath); // tslint:disable-line
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
