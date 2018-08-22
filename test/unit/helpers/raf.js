/**
 * @license
 * Copyright 2016 Google Inc.
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

// Creates an object which stubs out window.{requestAnimationFrame,cancelAnimationFrame}, and returns an object
// that gives control over to when animation frames are executed. It works a lot like lolex, but for rAF.
//
// ```js
// const raf = createMockRaf(); // window.{rAF,cAF} are not stubbed out.
// const id1 = requestAnimationFrame(() => {
//   console.log('first frame')
//   requestAnimationFrame(() => console.log('first frame inner'));
// });
// const id2 = requestAnimationFrame(() => console.log('second frame'));
// cancelAnimationFrame(id2);
// raf.flush(); // logs "first frame"
// raf.flush(); // logs "first frame inner"
// raf.restore(); // window.{rAF,cAF} set back to normal.
// ```
export function createMockRaf() {
  const origRaf = window.requestAnimationFrame;
  const origCancel = window.cancelAnimationFrame;
  const mockRaf = {
    lastFrameId: 0,
    pendingFrames: [],
    flush() {
      const framesToRun = this.pendingFrames.slice();
      while (framesToRun.length) {
        const {id, fn} = framesToRun.shift();
        fn();
        // Short-cut to remove the frame from the actual pendingFrames array.
        cancelAnimationFrame(id);
      }
    },
    restore() {
      this.lastFrameId = 0;
      this.pendingFrames = [];
      window.requestAnimationFrame = origRaf;
      window.cancelAnimationFrame = origCancel;
    },
    requestAnimationFrame(fn) {
      const frameId = ++this.lastFrameId;
      this.pendingFrames.push({id: frameId, fn});
      return frameId;
    },
    cancelAnimationFrame(id) {
      for (let i = 0, frame; (frame = this.pendingFrames[i]); i++) {
        if (frame.id === id) {
          this.pendingFrames.splice(i, 1);
          return;
        }
      }
    },
  };

  window.requestAnimationFrame = (fn) => mockRaf.requestAnimationFrame(fn);
  window.cancelAnimationFrame = (id) => mockRaf.cancelAnimationFrame(id);

  return mockRaf;
}
