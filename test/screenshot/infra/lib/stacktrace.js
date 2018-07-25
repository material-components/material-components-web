/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/** @type {!CliColor} */
const colors = require('colors');

/**
 * @param {string} className
 * @return {function(methodName: string): string}
 */
module.exports = function(className) {
  /**
   * @param {string} methodName
   * @return {string}
   */
  function getStackTrace(methodName) {
    const fullStack = new Error(`${className}.${methodName}()`).stack;
    // Remove THIS function from the stack trace because it's not useful
    return fullStack.split('\n').filter((line, index) => index !== 1).join('\n');
  }

  return getStackTrace;
};

module.exports.formatError = formatError;

/**
 * @param {!Error|!VError|*} err
 * @return {string}
 */
function formatError(err) {
  return formatErrorInternal(err)
    .replace(/^([^\n]+)/, (fullMatch, line) => colors.bold.red(line))
  ;
}

/**
 * @param {!Error|!VError|*} err
 * @return {string}
 */
function formatErrorInternal(err) {
  const parentStr = stringifyError(err);
  if (err.jse_cause) {
    const childStr = formatError(err.jse_cause);
    return `${childStr}\n\n${colors.italic('called from:')}\n\n${parentStr}`;
  }
  return parentStr;
}

/**
 * @param {!Error|!VError|*} err
 * @return {string}
 */
function stringifyError(err) {
  if (err.toString !== Error.prototype.toString) {
    return sanitizeErrorString(err.toString());
  }

  const lines = [err.code, err.message, err.stack].filter((str) => Boolean(str));
  return sanitizeErrorString(lines.join('\n'));
}

/**
 * @param {string} errorStr
 * @return {string}
 */
function sanitizeErrorString(errorStr) {
  const lines = errorStr.replace(/^((VError|Error|):\s*)+/i, '').split('\n');
  if (lines[1] && lines[1].includes(lines[0].replace(/\(\):?$/, ''))) {
    lines.splice(0, 1);
  }
  return lines
    .map((line) => {
      let formatted = line;
      formatted = formatClassMethod(formatted);
      formatted = formatNamedFunction(formatted);
      formatted = formatAnonymousFunction(formatted);
      return formatted;
    })
    .join('\n')
    .replace(/^ +at +/, '')
  ;
}

/**
 * @param {string} errorLine
 * @return {string}
 */
function formatClassMethod(errorLine) {
  return errorLine
    .replace(/^( +)(at) (\w+)\.(\w+)(.+)$/, (fullMatch, leadingSpaces, atPrefix, className, methodName, rest) => {
      if (className === 'process' && methodName === '_tickCallback') {
        return colors.dim(fullMatch);
      }
      rest = formatFileNameAndLineNumber(rest);
      return `${leadingSpaces}${atPrefix} ${colors.underline(className)}.${colors.bold(methodName)}${rest}`;
    })
  ;
}

/**
 * @param {string} errorLine
 * @return {string}
 */
function formatNamedFunction(errorLine) {
  return errorLine
    .replace(/^( +)(at) (\w+)([^.].+)$/, (fullMatch, leadingSpaces, atPrefix, functionName, rest) => {
      rest = formatFileNameAndLineNumber(rest);
      return `${leadingSpaces}${atPrefix} ${colors.bold(functionName)}${rest}`;
    })
  ;
}

/**
 * @param {string} errorLine
 * @return {string}
 */
function formatAnonymousFunction(errorLine) {
  return errorLine.replace(/^ +at <anonymous>.*$/, (fullMatch) => {
    return colors.dim(fullMatch);
  });
}

/**
 * @param {string} errorLine
 * @return {string}
 */
function formatFileNameAndLineNumber(errorLine) {
  return errorLine.replace(/\/([^/]+\.\w+):(\d+):(\d+)(\).*)$/, (fullMatch, fileName, lineNumber, colNumber, rest) => {
    return `/${colors.underline(fileName)}:${colors.bold(lineNumber)}:${colNumber}${rest}`;
  });
}
