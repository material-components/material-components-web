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


import {cssClasses, numbers, strings} from '../../mdc-ripple/constants';
import {MDCRippleFoundation} from '../../mdc-ripple/foundation';
import {verifyDefaultAdapter} from '../../../testing/helpers/foundation';
import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';

import {testFoundation} from './helpers';

describe('MDCRippleFoundation', () => {
  setUpMdcTestEnvironment();

  it('cssClasses returns constants.cssClasses', () => {
    expect(MDCRippleFoundation.cssClasses).toEqual(cssClasses);
  });

  it('strings returns constants.strings', () => {
    expect(MDCRippleFoundation.strings).toEqual(strings);
  });

  it('numbers returns constants.numbers', () => {
    expect(MDCRippleFoundation.numbers).toEqual(numbers);
  });

  it('defaultAdapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCRippleFoundation, [
      'browserSupportsCssVars',
      'isUnbounded',
      'isSurfaceActive',
      'isSurfaceDisabled',
      'addClass',
      'removeClass',
      'containsEventTarget',
      'registerInteractionHandler',
      'deregisterInteractionHandler',
      'registerDocumentInteractionHandler',
      'deregisterDocumentInteractionHandler',
      'registerResizeHandler',
      'deregisterResizeHandler',
      'updateCssVariable',
      'computeBoundingRect',
      'getWindowPageOffset',
    ]);
  });

  testFoundation(
      `#init calls adapter.addClass("${cssClasses.ROOT}")`,
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        foundation.init();
        jasmine.clock().tick(1);

        expect(adapter.addClass).toHaveBeenCalledWith(cssClasses.ROOT);
      });

  testFoundation(
      '#init adds unbounded class when adapter indicates unbounded',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        adapter.isUnbounded.and.returnValue(true);
        foundation.init();
        jasmine.clock().tick(1);

        expect(adapter.addClass).toHaveBeenCalledWith(cssClasses.UNBOUNDED);
      });

  testFoundation(
      '#init does not add unbounded class when adapter does not indicate unbounded (default)',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        foundation.init();
        jasmine.clock().tick(1);

        expect(adapter.addClass).not.toHaveBeenCalledWith(cssClasses.UNBOUNDED);
      });

  testFoundation(
      '#init gracefully exits when css variables are not supported',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        foundation.init();
        jasmine.clock().tick(1);

        expect(adapter.addClass).not.toHaveBeenCalledWith(cssClasses.ROOT);
      },
      /* isCssVarsSupported*/ false);

  testFoundation(
      '#init registers events for interactions on root element',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        foundation.init();

        expect(adapter.registerInteractionHandler)
            .toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Function));
      });

  testFoundation(
      '#init registers a resize handler for unbounded ripple',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        adapter.isUnbounded.and.returnValue(true);
        foundation.init();

        expect(adapter.registerResizeHandler)
            .toHaveBeenCalledWith(jasmine.any(Function));
      });

  testFoundation(
      '#init does not register a resize handler for bounded ripple',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        adapter.isUnbounded.and.returnValue(false);
        foundation.init();

        expect(adapter.registerResizeHandler)
            .not.toHaveBeenCalledWith(jasmine.any(Function));
      });

  testFoundation(
      '#init only registers focus/blur if CSS custom properties not supported',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        adapter.browserSupportsCssVars.and.returnValue(false);
        foundation.init();

        expect(adapter.registerInteractionHandler).toHaveBeenCalledTimes(2);
        expect(adapter.registerInteractionHandler)
            .toHaveBeenCalledWith('focus', jasmine.any(Function));
        expect(adapter.registerInteractionHandler)
            .toHaveBeenCalledWith('blur', jasmine.any(Function));
      });

  testFoundation(
      '#destroy unregisters all bound interaction handlers',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers: {[key: string]: Function} = {};

        adapter.registerInteractionHandler
            .withArgs(jasmine.any(String), jasmine.any(Function))
            .and.callFake((type: string, handler: Function) => {
              handlers[type] = handler;
            });
        foundation.init();
        foundation.destroy();

        Object.keys(handlers).forEach((type) => {
          expect(adapter.deregisterInteractionHandler)
              .toHaveBeenCalledWith(type, handlers[type]);
        });

        expect(adapter.deregisterDocumentInteractionHandler)
            .toHaveBeenCalledWith(jasmine.any(String), jasmine.any(Function));
      });

  testFoundation(
      '#destroy unregisters the resize handler for unbounded ripple',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        let resizeHandler;
        adapter.isUnbounded.and.returnValue(true);
        adapter.registerResizeHandler.withArgs(jasmine.any(Function))
            .and.callFake((handler: Function) => {
              resizeHandler = handler;
            });
        foundation.init();
        foundation.destroy();

        expect(adapter.deregisterResizeHandler)
            .toHaveBeenCalledWith(resizeHandler);
      });

  testFoundation(
      '#destroy does not unregister resize handler for bounded ripple',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        adapter.isUnbounded.and.returnValue(false);
        foundation.init();
        foundation.destroy();

        expect(adapter.deregisterResizeHandler)
            .not.toHaveBeenCalledWith(jasmine.any(Function));
      });

  testFoundation(
      `#destroy removes ${cssClasses.ROOT}`,
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        foundation.destroy();
        jasmine.clock().tick(1);
        expect(adapter.removeClass).toHaveBeenCalledWith(cssClasses.ROOT);
      });

  testFoundation(
      `#destroy removes ${cssClasses.UNBOUNDED}`,
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        foundation.destroy();
        jasmine.clock().tick(1);
        expect(adapter.removeClass).toHaveBeenCalledWith(cssClasses.UNBOUNDED);
      });

  testFoundation(
      `#destroy removes ${
          cssClasses.FG_ACTIVATION} if activation is interrupted`,
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        foundation['activationTimer_'] = 1;
        foundation.destroy();
        jasmine.clock().tick(1);

        expect(foundation['activationTimer_']).toEqual(0);
        expect(adapter.removeClass)
            .toHaveBeenCalledWith(cssClasses.FG_ACTIVATION);
      });

  testFoundation(
      `#destroy removes ${
          cssClasses.FG_DEACTIVATION} if deactivation is interrupted`,
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        foundation['fgDeactivationRemovalTimer_'] = 1;
        foundation.destroy();
        jasmine.clock().tick(1);

        expect(foundation['fgDeactivationRemovalTimer_']).toEqual(0);
        expect(adapter.removeClass)
            .toHaveBeenCalledWith(cssClasses.FG_DEACTIVATION);
      });

  testFoundation(
      '#destroy removes all CSS variables',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const cssVars =
            Object.keys(strings)
                .filter((s) => s.indexOf('VAR_') === 0)
                .map((s) => (strings as {[key: string]: string})[s]);
        foundation.destroy();
        jasmine.clock().tick(1);
        cssVars.forEach((cssVar) => {
          expect(adapter.updateCssVariable).toHaveBeenCalledWith(cssVar, null);
        });
      });

  testFoundation(
      '#destroy clears the timer if activation is interrupted',
      ({foundation}: {foundation: MDCRippleFoundation}) => {
        foundation.init();
        jasmine.clock().tick(1);

        foundation['activationTimer_'] = 1;
        foundation.destroy();
        jasmine.clock().tick(1);

        expect(foundation['activationTimer_']).toEqual(0);
      });

  testFoundation(
      '#destroy when CSS custom properties are not supported',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        adapter.browserSupportsCssVars.and.returnValue(false);
        foundation.destroy();
        jasmine.clock().tick(1);

        // #destroy w/o CSS vars still calls event deregistration functions (to
        // deregister focus/blur; the rest are no-ops)
        expect(adapter.deregisterInteractionHandler)
            .toHaveBeenCalledWith('focus', jasmine.any(Function));
        expect(adapter.deregisterInteractionHandler)
            .toHaveBeenCalledWith('blur', jasmine.any(Function));
        // #destroy w/o CSS vars doesn't change any CSS classes or custom
        // properties
        expect(adapter.removeClass)
            .not.toHaveBeenCalledWith(jasmine.any(String));
        expect(adapter.updateCssVariable)
            .not.toHaveBeenCalledWith(jasmine.any(String), jasmine.any(String));
      });

  testFoundation(
      `#layout sets ${
          strings.VAR_FG_SIZE} to the circumscribing circle's diameter`,
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const width = 200;
        const height = 100;
        const maxSize = Math.max(width, height);
        const initialSize = maxSize * numbers.INITIAL_ORIGIN_SCALE;

        adapter.computeBoundingRect.and.returnValue({width, height});
        foundation.layout();
        jasmine.clock().tick(1);

        expect(adapter.updateCssVariable)
            .toHaveBeenCalledWith(strings.VAR_FG_SIZE, `${initialSize}px`);
      });

  testFoundation(
      `#layout always sets ${strings.VAR_FG_SIZE} to even number`,
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const width = 36;
        const height = 36;

        adapter.computeBoundingRect.and.returnValue({width, height});
        adapter.isUnbounded.and.returnValue(true);
        foundation.layout();
        jasmine.clock().tick(1);

        const isEvenNumber = () => {
          return {
            asymmetricMatch: function(compareTo: string) {
              return parseInt(compareTo, 10) % 2 === 0;
            },
            jasmineToString: function() {
              return 'is even number';
            }
          };
        };
        expect(adapter.updateCssVariable)
            .toHaveBeenCalledWith(strings.VAR_FG_SIZE, isEvenNumber());
      });

  testFoundation(
      `#layout sets ${
          strings.VAR_FG_SCALE} based on the difference between the ` +
          'proportion of the max radius and the initial size',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const width = 200;
        const height = 100;

        adapter.computeBoundingRect.and.returnValue({width, height});
        foundation.layout();
        jasmine.clock().tick(1);

        const maxSize = Math.max(width, height);
        const initialSize = maxSize * numbers.INITIAL_ORIGIN_SCALE;
        const surfaceDiameter =
            Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
        const maxRadius = surfaceDiameter + numbers.PADDING;
        const fgScale = `${maxRadius / initialSize}`;

        expect(adapter.updateCssVariable)
            .toHaveBeenCalledWith(strings.VAR_FG_SCALE, fgScale);
      });

  testFoundation(
      `#layout centers via ${strings.VAR_LEFT} and ${
          strings.VAR_TOP} when unbounded`,
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const width = 200;
        const height = 100;
        const maxSize = Math.max(width, height);
        const initialSize = maxSize * numbers.INITIAL_ORIGIN_SCALE;

        adapter.computeBoundingRect.and.returnValue({width, height});
        adapter.isUnbounded.and.returnValue(true);
        foundation.layout();
        jasmine.clock().tick(1);

        expect(adapter.updateCssVariable)
            .toHaveBeenCalledWith(
                strings.VAR_LEFT,
                `${Math.round((width / 2) - (initialSize / 2))}px`);
        expect(adapter.updateCssVariable)
            .toHaveBeenCalledWith(
                strings.VAR_TOP,
                `${Math.round((height / 2) - (initialSize / 2))}px`);
      });

  //   testFoundation(
  //       '#layout debounces calls within the same frame',
  //       ({foundation}) => {
  //         foundation.layout();
  //         foundation.layout();
  //         foundation.layout();
  //         expect(clock.countTimers()).toEqual(1);
  //       });
  //
  //   testFoundation(
  //       '#layout resets debounce latch when layout frame is run',
  //       ({foundation}: {foundation: MDCRippleFoundation}) => {
  //         foundation.layout();
  //         jasmine.clock().tick(1);
  //         foundation.layout();
  //         expect(clock.countTimers()).toEqual(1);
  //       });

  testFoundation(
      '#setUnbounded adds unbounded class when unbounded is truthy',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        foundation.setUnbounded(true);
        expect(adapter.addClass).toHaveBeenCalledWith(cssClasses.UNBOUNDED);
      });

  testFoundation(
      '#setUnbounded removes unbounded class when unbounded is falsy',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        foundation.setUnbounded(false);
        expect(adapter.removeClass).toHaveBeenCalledWith(cssClasses.UNBOUNDED);
      });
});
