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

import lolex from 'lolex';
import td from 'testdouble';

import {captureHandlers} from '../helpers/foundation';
import {testFoundation} from './helpers';
import {cssClasses, numbers} from '../../../packages/mdc-ripple/constants';

const {DEACTIVATION_TIMEOUT_MS} = numbers;

suite('MDCRippleFoundation - Deactivation logic');

testFoundation('runs deactivation UX on touchend after touchstart', ({foundation, adapter, mockRaf}) => {
  const handlers = captureHandlers(adapter, 'registerInteractionHandler');
  const documentHandlers = captureHandlers(adapter, 'registerDocumentInteractionHandler');
  const clock = lolex.install();
  foundation.init();
  mockRaf.flush();

  handlers.touchstart({changedTouches: [{pageX: 0, pageY: 0}]});
  mockRaf.flush();

  documentHandlers.touchend();
  mockRaf.flush();
  clock.tick(DEACTIVATION_TIMEOUT_MS);

  // NOTE: here and below, we use {times: 2} as these classes are removed during activation
  // as well in order to support re-triggering the ripple. We want to test that this is called a *second*
  // time when deactivating.
  td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION), {times: 2});
  td.verify(adapter.addClass(cssClasses.FG_DEACTIVATION));

  clock.tick(numbers.FG_DEACTIVATION_MS);
  td.verify(adapter.removeClass(cssClasses.FG_DEACTIVATION));

  clock.uninstall();
});

testFoundation('runs deactivation UX on pointerup after pointerdown', ({foundation, adapter, mockRaf}) => {
  const handlers = captureHandlers(adapter, 'registerInteractionHandler');
  const documentHandlers = captureHandlers(adapter, 'registerDocumentInteractionHandler');
  const clock = lolex.install();
  foundation.init();
  mockRaf.flush();

  handlers.pointerdown({pageX: 0, pageY: 0});
  mockRaf.flush();

  documentHandlers.pointerup();
  mockRaf.flush();
  clock.tick(DEACTIVATION_TIMEOUT_MS);

  td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION), {times: 2});
  td.verify(adapter.addClass(cssClasses.FG_DEACTIVATION));

  clock.tick(numbers.FG_DEACTIVATION_MS);
  td.verify(adapter.removeClass(cssClasses.FG_DEACTIVATION));

  clock.uninstall();
});

testFoundation('runs deactivation UX on mouseup after mousedown', ({foundation, adapter, mockRaf}) => {
  const handlers = captureHandlers(adapter, 'registerInteractionHandler');
  const documentHandlers = captureHandlers(adapter, 'registerDocumentInteractionHandler');
  const clock = lolex.install();
  foundation.init();
  mockRaf.flush();

  handlers.mousedown({pageX: 0, pageY: 0});
  mockRaf.flush();

  documentHandlers.mouseup();
  mockRaf.flush();
  clock.tick(DEACTIVATION_TIMEOUT_MS);

  td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION), {times: 2});
  td.verify(adapter.addClass(cssClasses.FG_DEACTIVATION));

  clock.tick(numbers.FG_DEACTIVATION_MS);
  td.verify(adapter.removeClass(cssClasses.FG_DEACTIVATION));

  clock.uninstall();
});

testFoundation('runs deactivation on keyup after keydown when keydown makes surface active',
  ({foundation, adapter, mockRaf}) => {
    const handlers = captureHandlers(adapter, 'registerInteractionHandler');
    const clock = lolex.install();
    td.when(adapter.isSurfaceActive()).thenReturn(true);

    foundation.init();
    mockRaf.flush();

    handlers.keydown({key: 'Space'});
    mockRaf.flush();

    handlers.keyup({key: 'Space'});
    mockRaf.flush();
    clock.tick(DEACTIVATION_TIMEOUT_MS);

    td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION), {times: 2});
    td.verify(adapter.addClass(cssClasses.FG_DEACTIVATION));

    clock.tick(numbers.FG_DEACTIVATION_MS);
    td.verify(adapter.removeClass(cssClasses.FG_DEACTIVATION));

    clock.uninstall();
  });

testFoundation('does not run deactivation on keyup after keydown if keydown did not make surface active',
  ({foundation, adapter, mockRaf}) => {
    const handlers = captureHandlers(adapter, 'registerInteractionHandler');
    const clock = lolex.install();
    td.when(adapter.isSurfaceActive()).thenReturn(false);

    foundation.init();
    mockRaf.flush();

    handlers.keydown({key: 'Space'});
    mockRaf.flush();

    handlers.keyup({key: 'Space'});
    mockRaf.flush();
    clock.tick(DEACTIVATION_TIMEOUT_MS);

    // Note that all of these should be called 0 times since a keydown that does not make a surface active should never
    // activate it in the first place.
    td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION), {times: 0});
    td.verify(adapter.addClass(cssClasses.FG_DEACTIVATION), {times: 0});
    clock.uninstall();
  });

testFoundation('runs deactivation UX on public deactivate() call', ({foundation, adapter, mockRaf}) => {
  const clock = lolex.install();

  foundation.init();
  mockRaf.flush();

  foundation.activate();
  mockRaf.flush();

  foundation.deactivate();
  mockRaf.flush();
  clock.tick(DEACTIVATION_TIMEOUT_MS);

  td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION), {times: 2});
  td.verify(adapter.addClass(cssClasses.FG_DEACTIVATION));

  clock.tick(numbers.FG_DEACTIVATION_MS);
  td.verify(adapter.removeClass(cssClasses.FG_DEACTIVATION));

  clock.uninstall();
});

testFoundation('runs deactivation UX when activation UX timer finishes first (activation held for a long time)',
  ({foundation, adapter, mockRaf}) => {
    const handlers = captureHandlers(adapter, 'registerInteractionHandler');
    const documentHandlers = captureHandlers(adapter, 'registerDocumentInteractionHandler');
    const clock = lolex.install();
    foundation.init();
    mockRaf.flush();

    handlers.mousedown({pageX: 0, pageY: 0});
    mockRaf.flush();

    clock.tick(DEACTIVATION_TIMEOUT_MS);
    documentHandlers.mouseup();
    mockRaf.flush();

    td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION), {times: 2});
    td.verify(adapter.addClass(cssClasses.FG_DEACTIVATION));

    clock.tick(numbers.FG_DEACTIVATION_MS);
    td.verify(adapter.removeClass(cssClasses.FG_DEACTIVATION));

    clock.uninstall();
  });

testFoundation('clears any pending deactivation UX timers when re-triggered', ({foundation, adapter, mockRaf}) => {
  const handlers = captureHandlers(adapter, 'registerInteractionHandler');
  const documentHandlers = captureHandlers(adapter, 'registerDocumentInteractionHandler');
  const clock = lolex.install();
  foundation.init();
  mockRaf.flush();

  // Trigger the first interaction
  handlers.mousedown({pageX: 0, pageY: 0});
  mockRaf.flush();
  documentHandlers.mouseup();
  mockRaf.flush();
  // Simulate certain amount of delay between first and second interaction
  clock.tick(20);

  // Trigger the second interaction
  handlers.mousedown({pageX: 0, pageY: 0});
  mockRaf.flush();
  documentHandlers.mouseup();
  mockRaf.flush();

  clock.tick(DEACTIVATION_TIMEOUT_MS);

  // Verify that deactivation timer was called 3 times:
  // - Once during the initial activation
  // - Once again during the second activation when the ripple was re-triggered
  // - A third and final time when the deactivation UX timer runs
  td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION), {times: 3});
  td.verify(adapter.addClass(cssClasses.FG_DEACTIVATION), {times: 1});

  clock.uninstall();
});

testFoundation('clears any pending foreground deactivation class removal timers when re-triggered',
  ({foundation, adapter, mockRaf}) => {
    const handlers = captureHandlers(adapter, 'registerInteractionHandler');
    const documentHandlers = captureHandlers(adapter, 'registerDocumentInteractionHandler');
    const clock = lolex.install();
    foundation.init();
    mockRaf.flush();

    // Trigger the first interaction
    handlers.mousedown({pageX: 0, pageY: 0});
    mockRaf.flush();
    documentHandlers.mouseup();
    mockRaf.flush();

    // Tick the clock such that the deactivation UX gets run, but _not_ so the foreground deactivation removal
    // timer gets run
    clock.tick(DEACTIVATION_TIMEOUT_MS);

    // Sanity check that the foreground deactivation class removal was only called once within
    // the activation code.
    td.verify(adapter.removeClass(cssClasses.FG_DEACTIVATION), {times: 1});

    // Trigger another activation
    handlers.mousedown({pageX: 0, pageY: 0});
    mockRaf.flush();

    // Tick the clock past the time when the initial foreground deactivation timer would have ran.
    clock.tick(numbers.FG_DEACTIVATION_MS);

    // Verify that the foreground deactivation class removal was only called twice: once within the
    // original activation, and again within this subsequent activation; NOT by means of any timers firing.
    td.verify(adapter.removeClass(cssClasses.FG_DEACTIVATION), {times: 2});
  });

testFoundation('waits until activation UX timer runs before removing active fill classes',
  ({foundation, adapter, mockRaf}) => {
    const handlers = captureHandlers(adapter, 'registerInteractionHandler');
    const documentHandlers = captureHandlers(adapter, 'registerDocumentInteractionHandler');
    const clock = lolex.install();

    foundation.init();
    mockRaf.flush();

    handlers.mousedown({pageX: 0, pageY: 0});
    mockRaf.flush();

    documentHandlers.mouseup();
    mockRaf.flush();
    clock.tick(DEACTIVATION_TIMEOUT_MS - 1);

    td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION), {times: 1});
    td.verify(adapter.addClass(cssClasses.FG_DEACTIVATION), {times: 0});
    clock.uninstall();
  });

testFoundation('waits until actual deactivation UX is needed if animation finishes before deactivating',
  ({foundation, adapter, mockRaf}) => {
    const handlers = captureHandlers(adapter, 'registerInteractionHandler');
    const clock = lolex.install();

    foundation.init();
    mockRaf.flush();

    handlers.mousedown({pageX: 0, pageY: 0});
    mockRaf.flush();
    clock.tick(DEACTIVATION_TIMEOUT_MS);

    td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION), {times: 1});
    td.verify(adapter.addClass(cssClasses.FG_DEACTIVATION), {times: 0});
    clock.uninstall();
  });

testFoundation('only re-activates when there are no additional pointer events to be processed',
  ({foundation, adapter, mockRaf}) => {
    const handlers = captureHandlers(adapter, 'registerInteractionHandler');
    const documentHandlers = captureHandlers(adapter, 'registerDocumentInteractionHandler');
    const clock = lolex.install();

    foundation.init();
    mockRaf.flush();

    // Simulate Android 6 / Chrome latest event flow.
    handlers.pointerdown({pageX: 0, pageY: 0});
    mockRaf.flush();
    handlers.touchstart({changedTouches: [{pageX: 0, pageY: 0}]});
    mockRaf.flush();

    clock.tick(DEACTIVATION_TIMEOUT_MS);
    documentHandlers.pointerup();
    mockRaf.flush();

    // At this point, the deactivation UX should have run, since the initial activation was triggered by
    // a pointerdown event.
    td.verify(adapter.removeClass(cssClasses.FG_ACTIVATION), {times: 2});
    td.verify(adapter.addClass(cssClasses.FG_DEACTIVATION), {times: 1});

    // Also at this point, all of the document event handlers should have been deregistered so no more will be called.
    ['mouseup', 'pointerup', 'touchend'].forEach((type) => {
      td.verify(adapter.deregisterDocumentInteractionHandler(type, td.matchers.isA(Function)), {times: 1});
    });

    handlers.mousedown({pageX: 0, pageY: 0});
    mockRaf.flush();

    // Verify that activation only happened once, at pointerdown
    td.verify(adapter.addClass(cssClasses.FG_ACTIVATION), {times: 1});

    documentHandlers.mouseup();
    mockRaf.flush();
    clock.tick(numbers.TAP_DELAY_MS);

    // Finally, verify that since mouseup happened, we can re-activate the ripple.
    handlers.mousedown({pageX: 0, pageY: 0});
    mockRaf.flush();
    td.verify(adapter.addClass(cssClasses.FG_ACTIVATION), {times: 2});
    clock.uninstall();
  });
