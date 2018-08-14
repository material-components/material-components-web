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
