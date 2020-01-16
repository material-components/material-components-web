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
 * Priorities for the announce function
 */
export enum AnnouncerPriority {
  POLITE = 'polite',
  ASSERTIVE = 'assertive',
}

/**
 * Announces the given message with optional priority, defaulting to "polite"
 */
export function announce(message: string, priority?: AnnouncerPriority) {
  Announcer.getInstance().say(message, priority);
}

class Announcer {
  private static instance: Announcer;
  private readonly liveRegions: Map<AnnouncerPriority, Element>;

  static getInstance(): Announcer {
    if (!Announcer.instance) {
      Announcer.instance = new Announcer();
    }

    return Announcer.instance;
  }

  // Constructor made private to ensure only the singleton is used
  private constructor() {
    this.liveRegions = new Map();
  }

  say(message: string, priority: AnnouncerPriority = AnnouncerPriority.POLITE) {
    const liveRegion = this.getLiveRegion(priority);
    // Reset the region to pick up the message, even if the message is the
    // exact same as before.
    liveRegion.textContent = '';
    // Timeout is necessary for screen readers like NVDA and VoiceOver.
    setTimeout(() => {
      liveRegion.textContent = message;
    }, 1);
  }

  private getLiveRegion(priority: AnnouncerPriority): Element {
    if (this.liveRegions.has(priority)) {
      return this.liveRegions.get(priority)!;
    }

    const liveRegion = this.createLiveRegion(priority);
    this.liveRegions.set(priority, liveRegion);
    return liveRegion;
  }

  private createLiveRegion(priority: AnnouncerPriority): Element {
    const el = document.createElement('div');
    el.style.position = 'absolute';
    el.style.top = '-9999px';
    el.style.left = '-9999px';
    el.style.height = '1px';
    el.style.overflow = 'hidden';
    el.setAttribute('aria-atomic', 'true');
    el.setAttribute('aria-live', priority);
    document.body.appendChild(el);
    return el;
  }
}
