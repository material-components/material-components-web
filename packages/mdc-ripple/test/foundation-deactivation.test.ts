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


import {cssClasses, numbers} from '../../mdc-ripple/constants';
import {MDCRippleFoundation} from '../../mdc-ripple/foundation';
import {captureHandlers, checkNumTimesSpyCalledWithArgs} from '../../../testing/helpers/foundation';
import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';

import {testFoundation} from './helpers';

const {DEACTIVATION_TIMEOUT_MS} = numbers;

describe('MDCRippleFoundation - Deactivation logic', () => {
  setUpMdcTestEnvironment();
  testFoundation(
      'runs deactivation UX on touchend after touchstart',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        const documentHandlers =
            captureHandlers(adapter, 'registerDocumentInteractionHandler');
        foundation.init();
        jasmine.clock().tick(1);

        handlers['touchstart']({changedTouches: [{pageX: 0, pageY: 0}]});
        jasmine.clock().tick(1);

        documentHandlers['touchend']();
        jasmine.clock().tick(1);
        jasmine.clock().tick(DEACTIVATION_TIMEOUT_MS);

        // NOTE: here and below, we use {times: 2} as these classes are removed
        // during activation as well in order to support re-triggering the
        // ripple. We want to test that this is called a *second* time when
        // deactivating.
        checkNumTimesSpyCalledWithArgs(
            adapter.removeClass, [cssClasses.FG_ACTIVATION], 2);
        expect(adapter.addClass)
            .toHaveBeenCalledWith(cssClasses.FG_DEACTIVATION);

        jasmine.clock().tick(numbers.FG_DEACTIVATION_MS);
        expect(adapter.removeClass)
            .toHaveBeenCalledWith(cssClasses.FG_DEACTIVATION);
      });

  testFoundation(
      'runs deactivation UX on pointerup after pointerdown',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        const documentHandlers =
            captureHandlers(adapter, 'registerDocumentInteractionHandler');
        foundation.init();
        jasmine.clock().tick(1);

        handlers['pointerdown']({pageX: 0, pageY: 0});
        jasmine.clock().tick(1);

        documentHandlers['pointerup']();
        jasmine.clock().tick(1);
        jasmine.clock().tick(DEACTIVATION_TIMEOUT_MS);

        checkNumTimesSpyCalledWithArgs(
            adapter.removeClass, [cssClasses.FG_ACTIVATION], 2);
        expect(adapter.addClass)
            .toHaveBeenCalledWith(cssClasses.FG_DEACTIVATION);

        jasmine.clock().tick(numbers.FG_DEACTIVATION_MS);
        expect(adapter.removeClass)
            .toHaveBeenCalledWith(cssClasses.FG_DEACTIVATION);
      });

  testFoundation(
      'runs deactivation UX on contextmenu after pointerdown',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        const documentHandlers =
            captureHandlers(adapter, 'registerDocumentInteractionHandler');
        foundation.init();
        jasmine.clock().tick(1);

        handlers['pointerdown']({pageX: 0, pageY: 0});
        jasmine.clock().tick(1);

        documentHandlers['contextmenu']();
        jasmine.clock().tick(1);
        jasmine.clock().tick(DEACTIVATION_TIMEOUT_MS);

        checkNumTimesSpyCalledWithArgs(
            adapter.removeClass, [cssClasses.FG_ACTIVATION], 2);
        expect(adapter.addClass)
            .toHaveBeenCalledWith(cssClasses.FG_DEACTIVATION);

        jasmine.clock().tick(numbers.FG_DEACTIVATION_MS);
        expect(adapter.removeClass)
            .toHaveBeenCalledWith(cssClasses.FG_DEACTIVATION);
      });

  testFoundation(
      'runs deactivation UX on mouseup after mousedown',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        const documentHandlers =
            captureHandlers(adapter, 'registerDocumentInteractionHandler');
        foundation.init();
        jasmine.clock().tick(1);

        handlers['mousedown']({pageX: 0, pageY: 0});
        jasmine.clock().tick(1);

        documentHandlers['mouseup']();
        jasmine.clock().tick(1);
        jasmine.clock().tick(DEACTIVATION_TIMEOUT_MS);

        checkNumTimesSpyCalledWithArgs(
            adapter.removeClass, [cssClasses.FG_ACTIVATION], 2);
        expect(adapter.addClass)
            .toHaveBeenCalledWith(cssClasses.FG_DEACTIVATION);

        jasmine.clock().tick(numbers.FG_DEACTIVATION_MS);
        expect(adapter.removeClass)
            .toHaveBeenCalledWith(cssClasses.FG_DEACTIVATION);
      });

  testFoundation(
      'runs deactivation UX on contextmenu after mousedown',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        const documentHandlers =
            captureHandlers(adapter, 'registerDocumentInteractionHandler');
        foundation.init();
        jasmine.clock().tick(1);

        handlers['mousedown']({pageX: 0, pageY: 0});
        jasmine.clock().tick(1);

        documentHandlers['contextmenu']();
        jasmine.clock().tick(1);
        jasmine.clock().tick(DEACTIVATION_TIMEOUT_MS);

        checkNumTimesSpyCalledWithArgs(
            adapter.removeClass, [cssClasses.FG_ACTIVATION], 2);
        expect(adapter.addClass)
            .toHaveBeenCalledWith(cssClasses.FG_DEACTIVATION);

        jasmine.clock().tick(numbers.FG_DEACTIVATION_MS);
        expect(adapter.removeClass)
            .toHaveBeenCalledWith(cssClasses.FG_DEACTIVATION);
      });

  testFoundation(
      'runs deactivation on keyup after keydown when keydown makes surface active',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        adapter.isSurfaceActive.and.returnValue(true);

        foundation.init();
        jasmine.clock().tick(1);

        handlers['keydown']({key: 'Space'});
        jasmine.clock().tick(1);

        handlers['keyup']({key: 'Space'});
        jasmine.clock().tick(1);
        jasmine.clock().tick(DEACTIVATION_TIMEOUT_MS);

        checkNumTimesSpyCalledWithArgs(
            adapter.removeClass, [cssClasses.FG_ACTIVATION], 2);
        expect(adapter.addClass)
            .toHaveBeenCalledWith(cssClasses.FG_DEACTIVATION);

        jasmine.clock().tick(numbers.FG_DEACTIVATION_MS);
        expect(adapter.removeClass)
            .toHaveBeenCalledWith(cssClasses.FG_DEACTIVATION);
      });

  testFoundation(
      'does not run deactivation on keyup after keydown if keydown did not make surface active',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        adapter.isSurfaceActive.and.returnValue(false);

        foundation.init();
        jasmine.clock().tick(1);

        handlers['keydown']({key: 'Space'});
        jasmine.clock().tick(1);

        handlers['keyup']({key: 'Space'});
        jasmine.clock().tick(1);
        jasmine.clock().tick(DEACTIVATION_TIMEOUT_MS);

        // Note that all of these should be called 0 times since a keydown that
        // does not make a surface active should never activate it in the first
        // place.
        expect(adapter.removeClass)
            .not.toHaveBeenCalledWith(cssClasses.FG_ACTIVATION);
        expect(adapter.addClass)
            .not.toHaveBeenCalledWith(cssClasses.FG_DEACTIVATION);
      });

  testFoundation(
      'runs deactivation UX on public deactivate() call',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        foundation.init();
        jasmine.clock().tick(1);

        foundation.activate();
        jasmine.clock().tick(1);

        foundation.deactivate();
        jasmine.clock().tick(1);
        jasmine.clock().tick(DEACTIVATION_TIMEOUT_MS);

        checkNumTimesSpyCalledWithArgs(
            adapter.removeClass, [cssClasses.FG_ACTIVATION], 2);
        expect(adapter.addClass)
            .toHaveBeenCalledWith(cssClasses.FG_DEACTIVATION);

        jasmine.clock().tick(numbers.FG_DEACTIVATION_MS);
        expect(adapter.removeClass)
            .toHaveBeenCalledWith(cssClasses.FG_DEACTIVATION);
      });

  testFoundation(
      'runs deactivation UX when activation UX timer finishes first (activation held for a long time)',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        const documentHandlers =
            captureHandlers(adapter, 'registerDocumentInteractionHandler');
        foundation.init();
        jasmine.clock().tick(1);

        handlers['mousedown']({pageX: 0, pageY: 0});
        jasmine.clock().tick(1);

        jasmine.clock().tick(DEACTIVATION_TIMEOUT_MS);
        documentHandlers['mouseup']();
        jasmine.clock().tick(1);

        checkNumTimesSpyCalledWithArgs(
            adapter.removeClass, [cssClasses.FG_ACTIVATION], 2);
        expect(adapter.addClass)
            .toHaveBeenCalledWith(cssClasses.FG_DEACTIVATION);

        jasmine.clock().tick(numbers.FG_DEACTIVATION_MS);
        expect(adapter.removeClass)
            .toHaveBeenCalledWith(cssClasses.FG_DEACTIVATION);
      });

  testFoundation(
      'clears any pending deactivation UX timers when re-triggered',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        const documentHandlers =
            captureHandlers(adapter, 'registerDocumentInteractionHandler');
        foundation.init();
        jasmine.clock().tick(1);

        // Trigger the first interaction
        handlers['mousedown']({pageX: 0, pageY: 0});
        jasmine.clock().tick(1);
        documentHandlers['mouseup']();
        jasmine.clock().tick(1);
        // Simulate certain amount of delay between first and second interaction
        jasmine.clock().tick(20);

        // Trigger the second interaction
        handlers['mousedown']({pageX: 0, pageY: 0});
        jasmine.clock().tick(1);
        documentHandlers['mouseup']();
        jasmine.clock().tick(1);

        jasmine.clock().tick(DEACTIVATION_TIMEOUT_MS);

        // Verify that deactivation timer was called 3 times:
        // - Once during the initial activation
        // - Once again during the second activation when the ripple was
        // re-triggered
        // - A third and final time when the deactivation UX timer runs
        checkNumTimesSpyCalledWithArgs(
            adapter.removeClass, [cssClasses.FG_ACTIVATION], 3);
        checkNumTimesSpyCalledWithArgs(
            adapter.addClass, [cssClasses.FG_DEACTIVATION], 1);
      });

  testFoundation(
      'clears any pending foreground deactivation class removal timers when re-triggered',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        const documentHandlers =
            captureHandlers(adapter, 'registerDocumentInteractionHandler');
        foundation.init();
        jasmine.clock().tick(1);

        // Trigger the first interaction
        handlers['mousedown']({pageX: 0, pageY: 0});
        jasmine.clock().tick(1);
        documentHandlers['mouseup']();
        jasmine.clock().tick(1);

        // Tick the clock such that the deactivation UX gets run, but _not_ so
        // the foreground deactivation removal timer gets run
        jasmine.clock().tick(DEACTIVATION_TIMEOUT_MS);

        // Sanity check that the foreground deactivation class removal was only
        // called once within the activation code.
        checkNumTimesSpyCalledWithArgs(
            adapter.removeClass, [cssClasses.FG_DEACTIVATION], 1);

        // Trigger another activation
        handlers['mousedown']({pageX: 0, pageY: 0});
        jasmine.clock().tick(1);

        // Tick the clock past the time when the initial foreground deactivation
        // timer would have ran.
        jasmine.clock().tick(numbers.FG_DEACTIVATION_MS);

        // Verify that the foreground deactivation class removal was only called
        // twice: once within the original activation, and again within this
        // subsequent activation; NOT by means of any timers firing.
        checkNumTimesSpyCalledWithArgs(
            adapter.removeClass, [cssClasses.FG_DEACTIVATION], 2);
      });

  testFoundation(
      'waits until activation UX timer runs before removing active fill classes',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        const documentHandlers =
            captureHandlers(adapter, 'registerDocumentInteractionHandler');

        foundation.init();
        jasmine.clock().tick(1);

        handlers['mousedown']({pageX: 0, pageY: 0});
        jasmine.clock().tick(1);

        documentHandlers['mouseup']();
        // Test conditions slightly before the timeout lapses (subtracting ~2
        // frames due to runToFrame above)
        jasmine.clock().tick(DEACTIVATION_TIMEOUT_MS - 32);
        checkNumTimesSpyCalledWithArgs(
            adapter.removeClass, [cssClasses.FG_ACTIVATION], 1);
        expect(adapter.addClass)
            .not.toHaveBeenCalledWith(cssClasses.FG_DEACTIVATION);

        jasmine.clock().tick(32);
        checkNumTimesSpyCalledWithArgs(
            adapter.removeClass, [cssClasses.FG_ACTIVATION], 2);
        checkNumTimesSpyCalledWithArgs(
            adapter.removeClass, [cssClasses.FG_DEACTIVATION], 1);
      });

  testFoundation(
      'waits until actual deactivation UX is needed if animation finishes before deactivating',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');

        foundation.init();
        jasmine.clock().tick(1);

        handlers['mousedown']({pageX: 0, pageY: 0});
        jasmine.clock().tick(1);
        jasmine.clock().tick(DEACTIVATION_TIMEOUT_MS);

        checkNumTimesSpyCalledWithArgs(
            adapter.removeClass, [cssClasses.FG_ACTIVATION], 1);
        expect(adapter.addClass)
            .not.toHaveBeenCalledWith(cssClasses.FG_DEACTIVATION);
      });

  testFoundation(
      'only re-activates when there are no additional pointer events to be processed',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        const documentHandlers =
            captureHandlers(adapter, 'registerDocumentInteractionHandler');

        foundation.init();
        jasmine.clock().tick(1);

        // Simulate Android 6 / Chrome latest event flow.
        handlers['pointerdown']({pageX: 0, pageY: 0});
        jasmine.clock().tick(1);
        handlers['touchstart']({changedTouches: [{pageX: 0, pageY: 0}]});
        jasmine.clock().tick(1);

        jasmine.clock().tick(DEACTIVATION_TIMEOUT_MS);
        documentHandlers['pointerup']();
        jasmine.clock().tick(1);

        // At this point, the deactivation UX should have run, since the initial
        // activation was triggered by a pointerdown event.
        checkNumTimesSpyCalledWithArgs(
            adapter.removeClass, [cssClasses.FG_ACTIVATION], 2);
        checkNumTimesSpyCalledWithArgs(
            adapter.addClass, [cssClasses.FG_DEACTIVATION], 1);

        // Also at this point, all of the document event handlers should have
        // been deregistered so no more will be called.
        ['mouseup', 'pointerup', 'touchend'].forEach((type) => {
          expect(adapter.deregisterDocumentInteractionHandler)
              .toHaveBeenCalledWith(type, jasmine.any(Function));
        });

        handlers['mousedown']({pageX: 0, pageY: 0});
        jasmine.clock().tick(1);

        // Verify that activation only happened once, at pointerdown
        checkNumTimesSpyCalledWithArgs(
            adapter.addClass, [cssClasses.FG_ACTIVATION], 1);

        documentHandlers['mouseup']();
        jasmine.clock().tick(1);
        jasmine.clock().tick(numbers.TAP_DELAY_MS);

        // Finally, verify that since mouseup happened, we can re-activate the
        // ripple.
        handlers['mousedown']({pageX: 0, pageY: 0});
        jasmine.clock().tick(1);
        checkNumTimesSpyCalledWithArgs(
            adapter.addClass, [cssClasses.FG_ACTIVATION], 2);
      });
});
