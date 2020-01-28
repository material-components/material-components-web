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


import {cssClasses, strings} from '../../mdc-ripple/constants';
import {MDCRippleFoundation} from '../../mdc-ripple/foundation';
import {captureHandlers, checkNumTimesSpyCalledWithArgs} from '../../../testing/helpers/foundation';
import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';

import {testFoundation} from './helpers';

describe('MDCRippleFoundation - General Events', () => {
  setUpMdcTestEnvironment();
  testFoundation(
      're-lays out the component on resize event for unbounded ripple',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        adapter.isUnbounded.and.returnValue(true);
        adapter.computeBoundingRect.and.returnValues(
            {
              width: 100,
              height: 200,
            },
            {
              width: 50,
              height: 100,
            });
        let resizeHandler: Function|undefined;
        adapter.registerResizeHandler.withArgs(jasmine.any(Function))
            .and.callFake((handler: Function) => {
              resizeHandler = handler;
            });
        foundation.init();
        jasmine.clock().tick(1);

        expect(adapter.updateCssVariable)
            .toHaveBeenCalledWith(strings.VAR_FG_SIZE, '120px');

        (resizeHandler as Function)();

        jasmine.clock().tick(1);

        expect(adapter.updateCssVariable)
            .toHaveBeenCalledWith(strings.VAR_FG_SIZE, '60px');
      });

  testFoundation(
      'debounces layout within the same frame on resize',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        adapter.isUnbounded.and.returnValue(true);
        adapter.computeBoundingRect.and.returnValue(
            {
              width: 100,
              height: 200,
            },
            {
              width: 50,
              height: 100,
            });
        let resizeHandler: Function|undefined;
        adapter.registerResizeHandler.withArgs(jasmine.any(Function))
            .and.callFake((handler: Function) => {
              resizeHandler = handler;
            });
        foundation.init();
        jasmine.clock().tick(1);

        (resizeHandler as Function)();
        (resizeHandler as Function)();
        (resizeHandler as Function)();
        jasmine.clock().tick(1);
        checkNumTimesSpyCalledWithArgs(
            adapter.updateCssVariable, [strings.VAR_FG_SIZE, '120px'], 2);
      });

  testFoundation(
      'activates the background on focus',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        foundation.init();
        jasmine.clock().tick(1);

        handlers['focus']();
        jasmine.clock().tick(1);
        expect(adapter.addClass).toHaveBeenCalledWith(cssClasses.BG_FOCUSED);
      });

  testFoundation(
      'deactivates the background on blur',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        foundation.init();
        jasmine.clock().tick(1);

        handlers['blur']();
        jasmine.clock().tick(1);
        expect(adapter.removeClass).toHaveBeenCalledWith(cssClasses.BG_FOCUSED);
      });
});
