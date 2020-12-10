/**
 * @license
 * Copyright 2020 Google Inc.
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

/**
 * AnimationFrame provides a user-friendly abstraction around requesting
 * and canceling animation frames.
 */
export class AnimationFrame {
  private readonly rafIDs = new Map<string, number>();

  /**
   * Requests an animation frame. Cancels any existing frame with the same key.
   * @param {string} key The key for this callback.
   * @param {FrameRequestCallback} callback The callback to be executed.
   */
  request(key: string, callback: FrameRequestCallback) {
    this.cancel(key);
    const frameID = requestAnimationFrame((frame) => {
      this.rafIDs.delete(key);
      // Callback must come *after* the key is deleted so that nested calls to
      // request with the same key are not deleted.
      callback(frame);
    });
    this.rafIDs.set(key, frameID);
  }

  /**
   * Cancels a queued callback with the given key.
   * @param {string} key The key for this callback.
   */
  cancel(key: string) {
    const rafID = this.rafIDs.get(key);
    if (rafID) {
      cancelAnimationFrame(rafID);
      this.rafIDs.delete(key);
    }
  }

  /**
   * Cancels all queued callback.
   */
  cancelAll() {
    // Need to use forEach because it's the only iteration method supported
    // by IE11. Suppress the underscore because we don't need it.
    // tslint:disable-next-line:enforce-name-casing
    this.rafIDs.forEach((_, key) => {
      this.cancel(key);
    });
  }

  /**
   * Returns the queue of unexecuted callback keys.
   */
  getQueue(): string[] {
    const queue: string[] = [];
    // Need to use forEach because it's the only iteration method supported
    // by IE11. Suppress the underscore because we don't need it.
    // tslint:disable-next-line:enforce-name-casing
    this.rafIDs.forEach((_, key) => {
      queue.push(key);
    });
    return queue;
  }
}
