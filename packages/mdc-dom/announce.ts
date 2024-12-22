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
 * Priorities for the announce function.
 */
export enum AnnouncerPriority {
  POLITE = 'polite',
  ASSERTIVE = 'assertive',
}

/**
 * Options for the announce function.
 */
export interface AnnouncerMessageOptions {
  priority?: AnnouncerPriority;
  ownerDocument?: Document;
}

/**
 * Data attribute added to live region element.
 */
export const DATA_MDC_DOM_ANNOUNCE = 'data-mdc-dom-announce';
const NBSP = String.fromCharCode(0xa0);

/**
 * Announces the given message with optional priority, defaulting to "polite"
 */
export function announce(message: string, options?: AnnouncerMessageOptions) {
  Announcer.getInstance().say(message, options);
}

class Announcer {
  private static instance: Announcer;
  private readonly liveRegions: Map<Document, Map<AnnouncerPriority, Element>>;

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

  say(message: string, options?: AnnouncerMessageOptions) {
    const priority = options?.priority ?? AnnouncerPriority.POLITE;
    const ownerDocument = options?.ownerDocument ?? document;
    const liveRegion = this.getLiveRegion(priority, ownerDocument);
    // Tweak the message if it's identical to what was last announced, to
    // ensure it is announced.
    const lastMessageAnnounced = liveRegion.textContent;
    const announceMessage =
        lastMessageAnnounced && lastMessageAnnounced === message ?
        message + NBSP :
        message;

    // Timeout is necessary for screen readers like NVDA and VoiceOver.
    setTimeout(() => {
      liveRegion.textContent = announceMessage;
      ownerDocument.addEventListener('click', clearLiveRegion);
    }, 1);

    function clearLiveRegion() {
      liveRegion.textContent = '';
      ownerDocument.removeEventListener('click', clearLiveRegion);
    }
  }

  private getLiveRegion(priority: AnnouncerPriority, ownerDocument: Document):
      Element {
    let documentLiveRegions = this.liveRegions.get(ownerDocument);
    if (!documentLiveRegions) {
      documentLiveRegions = new Map();
      this.liveRegions.set(ownerDocument, documentLiveRegions);
    }

    const existingLiveRegion = documentLiveRegions.get(priority);
    if (existingLiveRegion && ownerDocument.body.contains(existingLiveRegion)) {
      return existingLiveRegion;
    }

    const liveRegion = this.createLiveRegion(priority, ownerDocument);
    documentLiveRegions.set(priority, liveRegion);
    return liveRegion;
  }

  private createLiveRegion(
      priority: AnnouncerPriority, ownerDocument: Document): HTMLDivElement {
    const el = ownerDocument.createElement('div');
    el.style.position = 'absolute';
    el.style.top = '-9999px';
    el.style.left = '-9999px';
    el.style.height = '1px';
    el.style.overflow = 'hidden';
    el.setAttribute('aria-atomic', 'true');
    el.setAttribute('aria-live', priority);
    el.setAttribute(DATA_MDC_DOM_ANNOUNCE, 'true');
    ownerDocument.body.appendChild(el);
    return el;
  }
}
