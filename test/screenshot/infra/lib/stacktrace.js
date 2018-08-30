/**
 * @license
 * Copyright 2018 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */

const CliColor = require('./logger').colors;

/**
 * @param {string} className
 * @return {function(methodName: string): string}
 */
module.exports = function(className) {
  /**
   * @param {string} methodName
   * @param {*=} infoData
   * @return {string}
   */
  function getStackTrace(methodName, infoData = undefined) {
    const infoStr = typeof infoData === 'object' ? '\n' + JSON.stringify(infoData, null, 2) : '';
    const fullStack = new Error(`${className}.${methodName}()`).stack;
    // Remove THIS function from the stack trace because it's not useful
    return fullStack.split('\n').filter((line, index) => index !== 1).join('\n') + infoStr;
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
    .replace(/^([^\n]+)/, (fullMatch, line) => CliColor.bold.red(line))
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
    return `${childStr}\n\n${CliColor.italic('↳  called from:')}\n\n${parentStr}`;
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
        return CliColor.dim(fullMatch);
      }
      rest = formatFileNameAndLineNumber(rest);
      return `${leadingSpaces}${atPrefix} ${CliColor.underline(className)}.${CliColor.bold(methodName)}${rest}`;
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
      return `${leadingSpaces}${atPrefix} ${CliColor.bold(functionName)}${rest}`;
    })
  ;
}

/**
 * @param {string} errorLine
 * @return {string}
 */
function formatAnonymousFunction(errorLine) {
  return errorLine.replace(/^ +at <anonymous>.*$/, (fullMatch) => {
    return CliColor.dim(fullMatch);
  });
}

/**
 * @param {string} errorLine
 * @return {string}
 */
function formatFileNameAndLineNumber(errorLine) {
  return errorLine.replace(/\/([^/]+\.\w+):(\d+):(\d+)(\).*)$/, (fullMatch, fileName, lineNumber, colNumber, rest) => {
    return `/${CliColor.underline(fileName)}:${CliColor.bold(lineNumber)}:${colNumber}${rest}`;
  });
}
