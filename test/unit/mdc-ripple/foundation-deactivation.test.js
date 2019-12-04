/**
 * @license
 * Copyright 2016 Google Inc.
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

import td from 'testdouble';

import {captureHandlers} from '../helpers/foundation';
import {testFoundation} from './helpers';
import {cssClasses, numbers} from '../../../packages/mdc-ripple/constants';

const {DEACTIVATION_TIMEOUT_MS} = numbers;

suite('MDCRippleFoundation - Deactivation logic');

testFoundation('runs deactivation UX on touchend after touchstart', ({foundation, adapter, clock}) => {
  const handlers = captureHandlers(adapter, 'registerInteractionHandler');
  const documentHandlers = captureHandlers(adapter, 'registerDocumentInteractionHandler');
  foundation.init();
  clock.runToFrame();

  handlers.touchstart({changedTouches: [{pageX: 0, pageY: 0}]});
  clock.runToFrame();

  documentHandlers.touchend();
  clock.runToFrame();
  clock.tick(DEACTIVATION_TIMEOUT_MS);

  // NOTE: here and below, we use {times: 2} as these classes are removed during activation
  // as well in order to support re-triggering the ripple. We want to test that this is called a *second*
  // time when deactivating.
  td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION), {times: 2});
  td.verify(adapter.addClass(cssClasses.FG_DEACTIVATION));

  clock.tick(numbers.FG_DEACTIVATION_MS);
  td.verify(adapter.removeClass(cssClasses.FG_DEACTIVATION));
});

testFoundation('runs deactivation UX on pointerup after pointerdown', ({foundation, adapter, clock}) => {
  const handlers = captureHandlers(adapter, 'registerInteractionHandler');
  const documentHandlers = captureHandlers(adapter, 'registerDocumentInteractionHandler');
  foundation.init();
  clock.runToFrame();

  handlers.pointerdown({pageX: 0, pageY: 0});
  clock.runToFrame();

  documentHandlers.pointerup();
  clock.runToFrame();
  clock.tick(DEACTIVATION_TIMEOUT_MS);

  td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION), {times: 2});
  td.verify(adapter.addClass(cssClasses.FG_DEACTIVATION));

  clock.tick(numbers.FG_DEACTIVATION_MS);
  td.verify(adapter.removeClass(cssClasses.FG_DEACTIVATION));
});

testFoundation('runs deactivation UX on contextmenu after pointerdown', ({foundation, adapter, clock}) => {
  const handlers = captureHandlers(adapter, 'registerInteractionHandler');
  const documentHandlers = captureHandlers(adapter, 'registerDocumentInteractionHandler');
  foundation.init();
  clock.runToFrame();

  handlers.pointerdown({pageX: 0, pageY: 0});
  clock.runToFrame();

  documentHandlers.contextmenu();
  clock.runToFrame();
  clock.tick(DEACTIVATION_TIMEOUT_MS);

  td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION), {times: 2});
  td.verify(adapter.addClass(cssClasses.FG_DEACTIVATION));

  clock.tick(numbers.FG_DEACTIVATION_MS);
  td.verify(adapter.removeClass(cssClasses.FG_DEACTIVATION));
});

testFoundation('runs deactivation on keyup after keydown when keydown makes surface active',
  ({foundation, adapter, clock}) => {
    const handlers = captureHandlers(adapter, 'registerInteractionHandler');
    td.when(adapter.isSurfaceActive()).thenReturn(true);

    foundation.init();
    clock.runToFrame();

    handlers.keydown({key: 'Space'});
    clock.runToFrame();

    handlers.keyup({key: 'Space'});
    clock.runToFrame();
    clock.tick(DEACTIVATION_TIMEOUT_MS);

    td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION), {times: 2});
    td.verify(adapter.addClass(cssClasses.FG_DEACTIVATION));

    clock.tick(numbers.FG_DEACTIVATION_MS);
    td.verify(adapter.removeClass(cssClasses.FG_DEACTIVATION));
  });

testFoundation('does not run deactivation on keyup after keydown if keydown did not make surface active',
  ({foundation, adapter, clock}) => {
    const handlers = captureHandlers(adapter, 'registerInteractionHandler');
    td.when(adapter.isSurfaceActive()).thenReturn(false);

    foundation.init();
    clock.runToFrame();

    handlers.keydown({key: 'Space'});
    clock.runToFrame();

    handlers.keyup({key: 'Space'});
    clock.runToFrame();
    clock.tick(DEACTIVATION_TIMEOUT_MS);

    // Note that all of these should be called 0 times since a keydown that does not make a surface active should never
    // activate it in the first place.
    td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION), {times: 0});
    td.verify(adapter.addClass(cssClasses.FG_DEACTIVATION), {times: 0});
  });

testFoundation('runs deactivation UX on public deactivate() call', ({foundation, adapter, clock}) => {
  foundation.init();
  clock.runToFrame();

  foundation.activate();
  clock.runToFrame();

  foundation.deactivate();
  clock.runToFrame();
  clock.tick(DEACTIVATION_TIMEOUT_MS);

  td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION), {times: 2});
  td.verify(adapter.addClass(cssClasses.FG_DEACTIVATION));

  clock.tick(numbers.FG_DEACTIVATION_MS);
  td.verify(adapter.removeClass(cssClasses.FG_DEACTIVATION));
});

testFoundation('runs deactivation UX when activation UX timer finishes first (activation held for a long time)',
  ({foundation, adapter, clock}) => {
    const handlers = captureHandlers(adapter, 'registerInteractionHandler');
    const documentHandlers = captureHandlers(adapter, 'registerDocumentInteractionHandler');
    foundation.init();
    clock.runToFrame();

    handlers.pointerdown({pageX: 0, pageY: 0});
    clock.runToFrame();

    clock.tick(DEACTIVATION_TIMEOUT_MS);
    documentHandlers.pointerup();
    clock.runToFrame();

    td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION), {times: 2});
    td.verify(adapter.addClass(cssClasses.FG_DEACTIVATION));

    clock.tick(numbers.FG_DEACTIVATION_MS);
    td.verify(adapter.removeClass(cssClasses.FG_DEACTIVATION));
  });

testFoundation('clears any pending deactivation UX timers when re-triggered', ({foundation, adapter, clock}) => {
  const handlers = captureHandlers(adapter, 'registerInteractionHandler');
  const documentHandlers = captureHandlers(adapter, 'registerDocumentInteractionHandler');
  foundation.init();
  clock.runToFrame();

  // Trigger the first interaction
  handlers.pointerdown({pageX: 0, pageY: 0});
  clock.runToFrame();
  documentHandlers.pointerup();
  clock.runToFrame();
  // Simulate certain amount of delay between first and second interaction
  clock.tick(20);

  // Trigger the second interaction
  handlers.pointerdown({pageX: 0, pageY: 0});
  clock.runToFrame();
  documentHandlers.pointerup();
  clock.runToFrame();

  clock.tick(DEACTIVATION_TIMEOUT_MS);

  // Verify that deactivation timer was called 3 times:
  // - Once during the initial activation
  // - Once again during the second activation when the ripple was re-triggered
  // - A third and final time when the deactivation UX timer runs
  td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION), {times: 3});
  td.verify(adapter.addClass(cssClasses.FG_DEACTIVATION), {times: 1});
});

testFoundation('clears any pending foreground deactivation class removal timers when re-triggered',
  ({foundation, adapter, clock}) => {
    const handlers = captureHandlers(adapter, 'registerInteractionHandler');
    const documentHandlers = captureHandlers(adapter, 'registerDocumentInteractionHandler');
    foundation.init();
    clock.runToFrame();

    // Trigger the first interaction
    handlers.pointerdown({pageX: 0, pageY: 0});
    clock.runToFrame();
    documentHandlers.pointerup();
    clock.runToFrame();

    // Tick the clock such that the deactivation UX gets run, but _not_ so the foreground deactivation removal
    // timer gets run
    clock.tick(DEACTIVATION_TIMEOUT_MS);

    // Sanity check that the foreground deactivation class removal was only called once within
    // the activation code.
    td.verify(adapter.removeClass(cssClasses.FG_DEACTIVATION), {times: 1});

    // Trigger another activation
    handlers.pointerdown({pageX: 0, pageY: 0});
    clock.runToFrame();

    // Tick the clock past the time when the initial foreground deactivation timer would have ran.
    clock.tick(numbers.FG_DEACTIVATION_MS);

    // Verify that the foreground deactivation class removal was only called twice: once within the
    // original activation, and again within this subsequent activation; NOT by means of any timers firing.
    td.verify(adapter.removeClass(cssClasses.FG_DEACTIVATION), {times: 2});
  });

testFoundation('waits until activation UX timer runs before removing active fill classes',
  ({foundation, adapter, clock}) => {
    const handlers = captureHandlers(adapter, 'registerInteractionHandler');
    const documentHandlers = captureHandlers(adapter, 'registerDocumentInteractionHandler');

    foundation.init();
    clock.runToFrame();

    handlers.pointerdown({pageX: 0, pageY: 0});
    clock.runToFrame();

    documentHandlers.pointerup();
    // Test conditions slightly before the timeout lapses (subtracting ~2 frames due to runToFrame above)
    clock.tick(DEACTIVATION_TIMEOUT_MS - 32);
    td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION), {times: 1});
    td.verify(adapter.addClass(cssClasses.FG_DEACTIVATION), {times: 0});

    clock.tick(32);
    td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION), {times: 2});
    td.verify(adapter.addClass(cssClasses.FG_DEACTIVATION), {times: 1});
  });

testFoundation('waits until actual deactivation UX is needed if animation finishes before deactivating',
  ({foundation, adapter, clock}) => {
    const handlers = captureHandlers(adapter, 'registerInteractionHandler');

    foundation.init();
    clock.runToFrame();

    handlers.pointerdown({pageX: 0, pageY: 0});
    clock.runToFrame();
    clock.tick(DEACTIVATION_TIMEOUT_MS);

    td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION), {times: 1});
    td.verify(adapter.addClass(cssClasses.FG_DEACTIVATION), {times: 0});
  });

testFoundation('only re-activates when there are no additional pointer events to be processed',
  ({foundation, adapter, clock}) => {
    const handlers = captureHandlers(adapter, 'registerInteractionHandler');
    const documentHandlers = captureHandlers(adapter, 'registerDocumentInteractionHandler');

    foundation.init();
    clock.runToFrame();

    // Simulate Android 6 / Chrome latest event flow.
    handlers.pointerdown({pageX: 0, pageY: 0});
    clock.runToFrame();
    handlers.touchstart({changedTouches: [{pageX: 0, pageY: 0}]});
    clock.runToFrame();

    clock.tick(DEACTIVATION_TIMEOUT_MS);
    documentHandlers.pointerup();
    clock.runToFrame();

    // At this point, the deactivation UX should have run, since the initial activation was triggered by
    // a pointerdown event.
    td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION), {times: 2});
    td.verify(adapter.addClass(cssClasses.FG_DEACTIVATION), {times: 1});

    // Also at this point, all of the document event handlers should have been deregistered so no more will be called.
    ['pointerup', 'touchend'].forEach((type) => {
      td.verify(adapter.deregisterDocumentInteractionHandler(type, td.matchers.isA(Function)), {times: 1});
    });

    handlers.touchstart({changedTouches: [{pageX: 0, pageY: 0}]});
    clock.runToFrame();

    // Verify that activation only happened once, at pointerdown
    td.verify(adapter.addClass(cssClasses.FG_ACTIVATION), {times: 1});

    documentHandlers.touchend();
    clock.runToFrame();
    clock.tick(numbers.TAP_DELAY_MS);

    // Finally, verify that since touchend happened, we can re-activate the ripple.
    handlers.touchstart({changedTouches: [{pageX: 0, pageY: 0}]});
    clock.runToFrame();
    td.verify(adapter.addClass(cssClasses.FG_ACTIVATION), {times: 2});
  });
