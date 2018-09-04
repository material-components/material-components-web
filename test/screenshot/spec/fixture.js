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

import 'url-search-params-polyfill';

window.mdc = window.mdc || {};

class TestFixture {
  constructor() {
    /**
     * @type {number}
     * @private
     */
    this.fontFaceObserverTimeoutMs_ = this.getUrlParamInt_('font_face_observer_timeout_ms', 3000);

    /**
     * @type {number}
     * @private
     */
    this.fontsLoadedReflowDelayMs_ = this.getUrlParamInt_('fonts_loaded_reflow_delay_ms', 100);

    /**
     * @type {!Promise<void>}
     */
    this.fontsLoaded = this.createFontObserver_();

    this.fontsLoaded.then(() => {
      console.log('Fonts loaded!');
      this.measureMobileViewport_();
      this.autoFocus_();
      this.notifyWebDriver_();
    });
  }

  /**
   * @return {!Promise<void>}
   * @private
   */
  createFontObserver_() {
    return new Promise((resolve) => {
      /* eslint-disable max-len */
      // `FontFaceObserver.load()` accepts an optional `text` argument, which defaults to "BESbswy".
      // It creates a temporary DOM node with the given text and measures it to see if the dimensions change.
      // The default value is sufficient for most Latin-based language fonts, but the Material Icons font only renders
      // icon glyphs if a specific sequence of characters is entered (e.g., `star_border`).
      // As a result, we need to override the default text for Material Icons.
      // See:
      // https://github.com/bramstein/fontfaceobserver/blob/111670b895c338bed371ad5feb95d8573ce3d0c9/src/observer.js#L186
      /* eslint-enable max-len */
      /** @type {!Promise<void>} */
      const materialIconsFontPromise = new FontFaceObserver('Material Icons').load('star_border');

      // The default `load()` text works fine for Roboto.
      /** @type {!Promise<void>} */
      const robotoFontPromise = new FontFaceObserver('Roboto').load();

      Promise.all([robotoFontPromise, materialIconsFontPromise]).then(() => {
        // Give Microsoft Edge enough time to reflow and repaint `.mdc-text-field__input` elements after the page loads.
        setTimeout(resolve, this.fontsLoadedReflowDelayMs_);
      });

      // Fallback in case one or more fonts don't load.
      setTimeout(resolve, this.fontFaceObserverTimeoutMs_);
    });
  }

  /** @private */
  measureMobileViewport_() {
    /** @type {?HTMLMainElement} */
    const mainEl = document.querySelector('.test-viewport');
    if (!mainEl || !mainEl.classList.contains('test-viewport--mobile')) {
      return;
    }

    requestAnimationFrame(() => {
      this.warnIfMobileViewportIsOverflowing_(mainEl);
    });
  }

  /**
   * @param {!HTMLMainElement} mainEl
   * @private
   */
  warnIfMobileViewportIsOverflowing_(mainEl) {
    const fixedHeight = mainEl.offsetHeight;
    mainEl.style.height = 'auto';
    const autoHeight = mainEl.offsetHeight;
    mainEl.style.height = '';

    if (autoHeight > fixedHeight) {
      mainEl.classList.add('test-viewport--overflowing');
      console.error(`
Page content overflows a mobile viewport!
Consider splitting this page into two separate pages.
If you are trying to create a test page for a fullscreen component like drawer or top-app-bar,
remove the 'test-viewport--mobile' class from the '<main class="test-viewport">' element.
          `.trim());
    }
  }

  /**
   * Edge doesn't always set focus on `<select autofocus>` elements on the first page load.
   * E.g.: https://storage.googleapis.com/mdc-web-screenshot-tests/advorak/2018/09/02/19_24_47_468/report/report.html
   *
   * This sounds suspiciously similar to an issue that was supposedly fixed in Edge 15:
   * https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/101198/
   *
   * @private
   */
  autoFocus_() {
    const autoFocusEls = [].filter.call(document.querySelectorAll('[autofocus]'), (el) => {
      const style = getComputedStyle(el);
      if (style.visibility === 'hidden' || style.display === 'none' || style.opacity < 0.1) {
        return false;
      }
      const rect = el.getBoundingClientRect();
      if (rect.height === 0 || rect.width === 0) {
        return false;
      }
      return true;
    });
    const autoFocusEl = autoFocusEls[0];
    if (autoFocusEl && document.activeElement !== autoFocusEl) {
      autoFocusEl.focus();
    }
  }

  /** @private */
  notifyWebDriver_() {
    document.body.setAttribute('data-fonts-loaded', '');
  }

  /**
   * @param {string} name
   * @param {number=} defaultValue
   * @return {number}
   * @private
   */
  getUrlParamInt_(name, defaultValue = 0) {
    const qs = new URLSearchParams(window.location.search);
    const val = parseInt(qs.get(name), 10);
    return isFinite(val) ? val : defaultValue;
  }
}

window.mdc.testFixture = new TestFixture();
