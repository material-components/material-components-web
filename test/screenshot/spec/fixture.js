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
import bel from 'bel';
import {ponyfill} from '../../../packages/mdc-dom/index';

window.mdc = window.mdc || {};

/**
 * @typedef {{
 *   name: string,
 *   fromEl: ?Element,
 *   fromSide: string,
 *   toEl: ?Element,
 *   toSide: string,
 *   orientation: ?string,
 *   specDistancePx: number,
 *   displayOffsetPx: number,
 *   displayAlignment: string,
 *   displayTargetEl: ?Element,
 *   lineEl: ?Element,
 *   labelEl: ?Element,
 *   flipLabel: ?boolean,
 *   conditionFn: ?function(): boolean,
 * }} RedlineConfig
 */

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
     * @type {!Array<!RedlineConfig>}
     * @private
     */
    this.redlineConfigs_ = [];

    /**
     * @type {!HTMLElement}
     * @private
     */
    this.redlineContainerEl_ = bel`<div id="test-redlines"></div>`;

    /**
     * @type {!Promise<void>}
     */
    this.fontsLoaded = this.createFontObserver_();

    this.fontsLoaded.then(() => {
      console.log('Fonts loaded!');
      this.measureMobileViewport_();
      this.autoFocus_();
      this.renderRedlines_();
      this.notifyWebDriver_();
    });

    this.detectRtl_();
    this.listenForAnimationEvents_();
    this.listenForResizeEvents_();
    this.preventEmptyHashLinkNavigation_();
  }

  listenForAnimationEvents_() {
    let timer = null;

    const handleAnimationEvent = () => {
      console.log('Waiting for animations to settle...');
      document.body.removeAttribute('data-animations-settled');
      clearTimeout(timer);
      timer = setTimeout(() => {
        console.log('Animations settled!');
        document.body.setAttribute('data-animations-settled', '');
      }, this.fontsLoadedReflowDelayMs_);
    };

    window.addEventListener('animationstart', handleAnimationEvent);
    window.addEventListener('transitionstart', handleAnimationEvent);
    window.addEventListener('animationend', handleAnimationEvent);
    window.addEventListener('transitionend', handleAnimationEvent);
    window.addEventListener('load', handleAnimationEvent);
  }

  listenForResizeEvents_() {
    window.addEventListener('resize', () => {
      this.renderRedlines_();
    });

    window.addEventListener('orientationchange', () => {
      this.renderRedlines_();
    });
  }

  preventEmptyHashLinkNavigation_() {
    document.addEventListener('click', (evt) => {
      if (ponyfill.closest(evt.target, 'a[href="#"]')) {
        evt.preventDefault();
      }
    });
  }

  notifyDomReady() {
    setTimeout(() => {
      console.log('DOM ready!');
      document.body.setAttribute('data-dom-ready', '');
    });
  }

  /** @param {!Array<!RedlineConfig>} configs */
  addRedlines(configs) {
    configs.forEach((config) => this.addRedline(config, /* renderNow */ false));
    this.renderRedlines_();
  }

  /**
   * @param {!RedlineConfig} config
   * @param {boolean=} renderNow
   */
  addRedline(config, renderNow = true) {
    const {fromEl, toEl, name} = config;
    if (!fromEl || !toEl) {
      return;
    }

    const lineEl = bel`
<div class="test-redline" title="${name}">
  <div class="test-redline__tick test-redline__tick--start"></div>
  <div class="test-redline__tick test-redline__tick--end"></div>
  <div class="test-redline__label"></div>
</div>
`;
    const labelEl = lineEl.querySelector('.test-redline__label');

    this.redlineContainerEl_.appendChild(lineEl);

    /** @type {!RedlineConfig} */
    const mergedConfig = Object.assign({
      lineEl,
      labelEl,
      displayOffsetPx: 0,
      displayAlignment: 'center',
      flipLabel: false,
    }, config);

    mergedConfig.orientation = this.getOrientation_(mergedConfig);

    this.redlineConfigs_.push(mergedConfig);

    if (renderNow) {
      this.renderRedlines_();
    }
  }

  removeRedlines() {
    this.redlineConfigs_.length = 0;
    this.redlineContainerEl_.innerHTML = '';
  }

  /** @private */
  renderRedlines_() {
    requestAnimationFrame(() => {
      if (!this.redlineContainerEl_.parentElement) {
        document.body.appendChild(this.redlineContainerEl_);
      }

      this.redlineConfigs_.forEach((config) => {
        const {lineEl, orientation, flipLabel, conditionFn} = config;

        // Remove all modifier classes
        lineEl.className = 'test-redline';

        if (conditionFn && !conditionFn()) {
          lineEl.classList.add('test-redline--hidden');
        }

        if (flipLabel) {
          lineEl.classList.add('test-redline--flipped');
        }

        if (orientation === 'vertical') {
          this.drawVerticalRedline_(config);
        } else if (orientation === 'horizontal') {
          this.drawHorizontalRedline_(config);
        } else {
          throw new Error(`Unsupported 'orientation' value: "${orientation}"`);
        }
      });
    });
  }

  /**
   * @param {!RedlineConfig} config
   * @private
   */
  drawVerticalRedline_(config) {
    const {lineEl, labelEl, fromEl, toEl, fromSide, toSide} = config;
    const {specDistancePx, displayOffsetPx, displayAlignment} = config;

    lineEl.classList.add('test-redline--vertical');

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();
    const fromViewportY = this.getViewportCoordinate_(fromEl, fromSide);
    const toViewportY = this.getViewportCoordinate_(toEl, toSide);

    const actualStartY = Math.min(fromViewportY, toViewportY);
    const actualEndY = Math.max(fromViewportY, toViewportY);
    const actualDistancePx = Math.floor(actualEndY - actualStartY);

    const lineStartX = Math.min(fromRect.left, toRect.left);
    const lineEndX = Math.min(fromRect.right, toRect.right);

    let leftPos;
    if (displayAlignment === 'center') {
      const leftMost = Math.min(fromRect.left, toRect.left);
      const rightMost = Math.max(fromRect.right, toRect.right);
      const half = (rightMost - leftMost) / 2;
      leftPos = lineStartX + half + displayOffsetPx;
    } else if (displayAlignment === 'right') {
      leftPos = lineEndX - displayOffsetPx;
    } else {
      leftPos = lineStartX + displayOffsetPx;
    }

    lineEl.style.top = `${Math.round(actualStartY)}px`;
    lineEl.style.left = `${Math.round(leftPos)}px`;
    lineEl.style.height = `${Math.round(actualDistancePx)}px`;

    if (actualDistancePx === specDistancePx) {
      labelEl.innerHTML = `${actualDistancePx}px`;
      lineEl.classList.add('test-redline--pass');
    } else if (Math.abs(actualDistancePx - specDistancePx) <= 1) {
      labelEl.innerHTML = `${actualDistancePx}px`;
      lineEl.classList.add('test-redline--warn');
    } else {
      labelEl.innerHTML = `Spec: ${specDistancePx}px<br>Actual: ${actualDistancePx}px`;
      lineEl.classList.add('test-redline--fail');
    }

    if (actualDistancePx < labelEl.offsetHeight + 2) {
      lineEl.classList.add('test-redline--small');
    }
  }

  /**
   * @param {!RedlineConfig} config
   * @private
   */
  drawHorizontalRedline_(config) {
    const {lineEl, labelEl, fromEl, fromSide, toEl, toSide, specDistancePx, displayOffsetPx, displayAlignment} = config;
    const {displayTargetEl} = config;
    lineEl.classList.add('test-redline--horizontal');

    const fromRect = fromEl.getBoundingClientRect();
    const toRect = toEl.getBoundingClientRect();
    const fromViewportX = this.getViewportCoordinate_(fromEl, fromSide);
    const toViewportX = this.getViewportCoordinate_(toEl, toSide);

    const actualStartX = Math.min(fromViewportX, toViewportX);
    const actualEndX = Math.max(fromViewportX, toViewportX);
    const actualDistancePx = Math.floor(actualEndX - actualStartX);

    const lineStartY = Math.min(fromRect.top, toRect.top);
    const lineEndY = Math.min(fromRect.bottom, toRect.bottom);

    let topPos;
    if (displayAlignment === 'center') {
      let topMost;
      let bottomMost;

      if (displayTargetEl) {
        topMost = displayTargetEl.getBoundingClientRect().top;
        bottomMost = displayTargetEl.getBoundingClientRect().bottom;
      } else {
        topMost = Math.min(fromRect.top, toRect.top);
        bottomMost = Math.max(fromRect.bottom, toRect.bottom);
      }
      const half = (bottomMost - topMost) / 2;
      topPos = lineStartY + half + displayOffsetPx;
    } else if (displayAlignment === 'bottom') {
      topPos = lineEndY - displayOffsetPx;
    } else {
      topPos = lineStartY + displayOffsetPx;
    }

    lineEl.style.top = `${Math.round(topPos)}px`;
    lineEl.style.left = `${Math.round(actualStartX)}px`;
    lineEl.style.width = `${Math.round(actualDistancePx)}px`;

    if (actualDistancePx === specDistancePx) {
      labelEl.innerHTML = `${actualDistancePx}px`;
      lineEl.classList.add('test-redline--pass');
    } else if (Math.abs(actualDistancePx - specDistancePx) <= 1) {
      labelEl.innerHTML = `${actualDistancePx}px`;
      lineEl.classList.add('test-redline--warn');
    } else {
      labelEl.innerHTML = `Spec: ${specDistancePx}px<br>Actual: ${actualDistancePx}px`;
      lineEl.classList.add('test-redline--fail');
    }

    if (actualDistancePx < labelEl.offsetWidth + 2) {
      lineEl.classList.add('test-redline--small');
    }
  }

  /**
   * @param {!Element} el
   * @param {string} side
   * @return {number}
   * @private
   */
  getViewportCoordinate_(el, side) {
    const rect = el.getBoundingClientRect();
    const borderBottomWidth = parseInt(getComputedStyle(el).borderBottomWidth, 10);
    const borderTopWidth = parseInt(getComputedStyle(el).borderTopWidth, 10);
    const borderLeftWidth = parseInt(getComputedStyle(el).borderLeftWidth, 10);
    const borderRightWidth = parseInt(getComputedStyle(el).borderRightWidth, 10);
    const scrollbarWidth = this.getScrollbarWidth_(el);

    if (side === 'top') {
      return rect.top + borderTopWidth;
    }
    if (side === 'bottom') {
      return rect.bottom - borderBottomWidth;
    }
    if (side === 'left') {
      return rect.left + borderLeftWidth - (this.isRtl_() ? scrollbarWidth : 0);
    }
    if (side === 'right') {
      return rect.right - borderRightWidth + (this.isRtl_() ? 0 : scrollbarWidth);
    }

    if (side === 'first-baseline' || side === 'last-baseline') {
      const bl = document.createElement('span');
      bl.classList.add('test-baseline-probe');

      if (side === 'last-baseline') {
        el.appendChild(bl);
      } else {
        el.insertBefore(bl, el.firstChild);
      }

      const pos = bl.getBoundingClientRect().top;
      el.removeChild(bl);
      return pos - borderTopWidth;
    }

    throw new Error(`Unsupported \`side\` value: "${side}"`);
  }

  /**
   * @param {!Element} el
   * @private
   */
  getScrollbarWidth_(el) {
    while (el) {
      const scrollbarWidth = el.offsetWidth - el.clientWidth;
      if (scrollbarWidth > 0) {
        return scrollbarWidth;
      }
      el = el.parentElement;
    }
    return 0;
  }

  /**
   * @param {!RedlineConfig} config
   * @return {string}
   * @private
   */
  getOrientation_(config) {
    const {fromSide} = config;
    if (fromSide === 'top' || fromSide === 'bottom' ||
      fromSide === 'first-baseline' || fromSide === 'last-baseline') {
      return 'vertical';
    } else if (fromSide === 'left' || fromSide === 'right') {
      return 'horizontal';
    } else {
      throw new Error(`Unsupported 'fromSide' value: "${fromSide}"`);
    }
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

  detectRtl_() {
    if (this.isRtl_()) {
      document.documentElement.setAttribute('dir', 'rtl');
    }
  }

  /**
   * @return {boolean}
   * @private
   */
  isRtl_() {
    const params = new URLSearchParams(window.location.search);
    return params.get('dir') === 'rtl';
  }
}

window.mdc.testFixture = new TestFixture();
