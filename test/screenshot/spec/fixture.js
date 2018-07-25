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

window.mdc = window.mdc || {};

window.mdc.testFixture = {
  onPageLoad() {
    this.attachFontObserver_();
    this.measureMobileViewport_();
  },

  /** @private */
  attachFontObserver_() {
    const fontsLoadedPromise = new Promise((resolve) => {
      const robotoFont = new FontFaceObserver('Roboto');
      const materialIconsFont = new FontFaceObserver('Material Icons');

      // The `load()` method accepts an optional string of text to ensure that those specific glyphs are available.
      // For the Material Icons font, we need to pass it one of the icon names.
      Promise.all([robotoFont.load(), materialIconsFont.load('star_border')]).then(function() {
        resolve();
      });

      setTimeout(() => {
        resolve();
      }, 3000); // TODO(acdvorak): Create a constant for font loading timeout values
    });

    fontsLoadedPromise.then(() => {
      document.body.setAttribute('data-fonts-loaded', '');
    });
  },

  measureMobileViewport_() {
    const mainEl = document.querySelector('.test-main');
    if (!mainEl || !mainEl.classList.contains('test-main--mobile-viewport')) {
      return;
    }

    window.requestAnimationFrame(() => {
      const setHeight = mainEl.offsetHeight;
      mainEl.style.height = 'auto';
      const autoHeight = mainEl.offsetHeight;
      mainEl.style.height = '';

      if (autoHeight > setHeight) {
        mainEl.classList.add('test-main--overflowing');
        console.error(`
Page content overflows a mobile viewport!
Consider splitting this page into two separate pages.
If you are trying to create a test page for a fullscreen component like drawer or top-app-bar,
remove the 'test-main--mobile-viewport' class from the '<main class="test-main">' element.
          `.trim());
      }
    });
  },
};

window.addEventListener('load', () => {
  window.mdc.testFixture.onPageLoad();
});
