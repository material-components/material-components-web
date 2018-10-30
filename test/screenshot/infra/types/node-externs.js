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

/*
 * Node.js API
 */


/**
 * @typedef {{
 *   cwd: ?string,
 *   env: ?Object,
 *   argv0: ?string,
 *   stdio: ?Array<string>,
 *   detached: ?boolean,
 *   uid: ?number,
 *   gid: ?number,
 *   shell: ?boolean,
 *   windowsVerbatimArguments: ?boolean,
 *   windowsHide: ?boolean,
 * }} ChildProcessSpawnOptions
 */


/*
 * Resemble.js API
 */


/**
 * @typedef {{
 *   rawMisMatchPercentage: number,
 *   misMatchPercentage: string,
 *   diffBounds: !ResembleApiBoundingBox,
 *   analysisTime: number,
 *   getImageDataUrl: function(text: string): string,
 *   getBuffer: function(includeOriginal: boolean): !Buffer,
 * }} ResembleApiComparisonResult
 */

/**
 * @typedef {{
 *   top: number,
 *   left: number,
 *   bottom: number,
 *   right: number,
 * }} ResembleApiBoundingBox
 */

/**
 * @typedef {{
 *   r: number, g: number, b: number, a: number
 * }} RGBA
 */


/*
 * ps-node API
 */


/**
 * @typedef {{
 *   pid: number,
 *   ppid: number,
 *   command: string,
 *   arguments: !Array<string>,
 * }} PsNodeProcess
 */


/*
 * colors API
 */


/**
 * @typedef {(function(string):string|!AnsiColorProps)} AnsiColor
 */

/**
 * @typedef {{
 *   enable: !AnsiColor,
 *   disable: !AnsiColor,
 *   strip: !AnsiColor,
 *   strip: !AnsiColor,
 *   black: !AnsiColor,
 *   red: !AnsiColor,
 *   green: !AnsiColor,
 *   yellow: !AnsiColor,
 *   blue: !AnsiColor,
 *   magenta: !AnsiColor,
 *   cyan: !AnsiColor,
 *   white: !AnsiColor,
 *   gray: !AnsiColor,
 *   grey: !AnsiColor,
 *   bgBlack: !AnsiColor,
 *   bgRed: !AnsiColor,
 *   bgGreen: !AnsiColor,
 *   bgYellow: !AnsiColor,
 *   bgBlue: !AnsiColor,
 *   bgMagenta: !AnsiColor,
 *   bgCyan: !AnsiColor,
 *   bgWhite: !AnsiColor,
 *   reset: !AnsiColor,
 *   bold: !AnsiColor,
 *   dim: !AnsiColor,
 *   italic: !AnsiColor,
 *   underline: !AnsiColor,
 *   inverse: !AnsiColor,
 *   hidden: !AnsiColor,
 *   strikethrough: !AnsiColor,
 *   rainbow: !AnsiColor,
 *   zebra: !AnsiColor,
 *   america: !AnsiColor,
 *   random: !AnsiColor,
 * }} AnsiColorProps
 */
