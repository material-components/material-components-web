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

import {assert} from 'chai';
import td from 'testdouble';

import {captureHandlers, verifyDefaultAdapter} from '../helpers/foundation';
import {createMockRaf} from '../helpers/raf';
import {setupFoundationTest} from '../helpers/setup';
import MDCTemporaryDrawerFoundation from '../../../packages/mdc-drawer/temporary/foundation';
import {cssClasses, strings} from '../../../packages/mdc-drawer/temporary/constants';

function setupTest() {
  const {foundation, mockAdapter} = setupFoundationTest(MDCTemporaryDrawerFoundation);
  td.when(mockAdapter.hasClass('mdc-drawer--temporary')).thenReturn(true);
  td.when(mockAdapter.hasNecessaryDom()).thenReturn(true);
  return {foundation, mockAdapter};
}

suite('MDCTemporaryDrawerFoundation');

test('exports strings', () => {
  assert.deepEqual(MDCTemporaryDrawerFoundation.strings, strings);
});

test('exports cssClasses', () => {
  assert.deepEqual(MDCTemporaryDrawerFoundation.cssClasses, cssClasses);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCTemporaryDrawerFoundation, [
    'addClass', 'removeClass', 'hasClass', 'addBodyClass', 'removeBodyClass', 'eventTargetHasClass',
    'hasNecessaryDom', 'registerInteractionHandler',
    'deregisterInteractionHandler', 'registerDrawerInteractionHandler', 'deregisterDrawerInteractionHandler',
    'registerTransitionEndHandler', 'deregisterTransitionEndHandler', 'registerDocumentKeydownHandler',
    'deregisterDocumentKeydownHandler', 'setTranslateX', 'getFocusableElements',
    'saveElementTabState', 'restoreElementTabState', 'makeElementUntabbable',
    'notifyOpen', 'notifyClose', 'isRtl', 'getDrawerWidth', 'isDrawer',
    'updateCssVariable',
  ]);
});

test('#init calls component and drawer event registrations', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.init();
  td.verify(mockAdapter.registerInteractionHandler('click', isA(Function)));
});

test('#destroy calls component and drawer event deregistrations', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.init();
  foundation.destroy();
  td.verify(mockAdapter.deregisterInteractionHandler('click', isA(Function)));
});

test('on touch start updates the drawer to the touch target coordinates', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-drawer--open')).thenReturn(true);
  td.when(mockAdapter.getDrawerWidth()).thenReturn(500);
  foundation.init();

  handlers.touchstart({
    touches: [{pageX: 50}],
  });
  raf.flush();
  td.verify(mockAdapter.updateCssVariable(1));

  raf.restore();
});

test('on touch start does not update the drawer when drawer not open', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-drawer--open')).thenReturn(false);
  td.when(mockAdapter.getDrawerWidth()).thenReturn(500);
  foundation.init();

  handlers.touchstart({
    touches: [{pageX: 50}],
  });
  raf.flush();
  td.verify(mockAdapter.updateCssVariable(1), {times: 0});

  raf.restore();
});

test('on touch start works for pointer events', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-drawer--open')).thenReturn(true);
  td.when(mockAdapter.getDrawerWidth()).thenReturn(500);
  foundation.init();

  handlers.touchstart({
    pointerType: 'touch',
    pageX: 50,
  });
  raf.flush();
  td.verify(mockAdapter.updateCssVariable(1));

  raf.restore();
});

test('on touch start does not update the drawer when pointertype != touch', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-drawer--open')).thenReturn(true);
  td.when(mockAdapter.getDrawerWidth()).thenReturn(500);
  foundation.init();

  handlers.touchstart({
    pointerType: 'not touch',
    pageX: 50,
  });
  raf.flush();
  td.verify(mockAdapter.updateCssVariable(1), {times: 0});

  raf.restore();
});

test('on touch move updates currentX causing the drawer to update', () => {
  const {foundation, mockAdapter} = setupTest();
  const drawerHandlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-drawer--open')).thenReturn(true);
  td.when(mockAdapter.getDrawerWidth()).thenReturn(500);
  foundation.init();

  drawerHandlers.touchstart({
    touches: [{pageX: 500}],
  });
  raf.flush();

  handlers.touchmove({
    touches: [{pageX: 490}],
    preventDefault: () => {},
  });
  raf.flush();

  td.verify(mockAdapter.updateCssVariable(0.98));

  handlers.touchmove({
    touches: [{pageX: 495}],
    preventDefault: () => {},
  });
  raf.flush();

  td.verify(mockAdapter.updateCssVariable(0.99));
  raf.restore();
});

test('on touch move does not allow the drawer to move past its width', () => {
  const {foundation, mockAdapter} = setupTest();
  const drawerHandlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-drawer--open')).thenReturn(true);
  td.when(mockAdapter.getDrawerWidth()).thenReturn(500);
  foundation.init();

  drawerHandlers.touchstart({
    touches: [{pageX: 500}],
  });
  raf.flush();

  handlers.touchmove({
    touches: [{pageX: 510}],
    preventDefault: () => {},
  });
  raf.flush();

  td.verify(mockAdapter.updateCssVariable(1));
  raf.restore();
});

test('on touch move does not allow the drawer to move past its width in RTL', () => {
  const {foundation, mockAdapter} = setupTest();
  const drawerHandlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-drawer--open')).thenReturn(true);
  td.when(mockAdapter.getDrawerWidth()).thenReturn(500);
  td.when(mockAdapter.isRtl()).thenReturn(true);
  foundation.init();

  drawerHandlers.touchstart({
    touches: [{pageX: 500}],
  });
  raf.flush();

  handlers.touchmove({
    touches: [{pageX: 490}],
    preventDefault: () => {},
  });
  raf.flush();

  td.verify(mockAdapter.updateCssVariable(1));
  raf.restore();
});

test('on touch move works for pointer events', () => {
  const {foundation, mockAdapter} = setupTest();
  const drawerHandlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-drawer--open')).thenReturn(true);
  td.when(mockAdapter.getDrawerWidth()).thenReturn(500);
  foundation.init();

  drawerHandlers.touchstart({
    pointerType: 'touch',
    pageX: 500,
  });
  raf.flush();

  handlers.touchmove({
    pointerType: 'touch',
    pageX: 490,
    preventDefault: () => {},
  });
  raf.flush();
  td.verify(mockAdapter.updateCssVariable(0.98));

  raf.restore();
});

test('on touch move does not update the drawer when pointertype != touch', () => {
  const {foundation, mockAdapter} = setupTest();
  const drawerHandlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-drawer--open')).thenReturn(true);
  td.when(mockAdapter.getDrawerWidth()).thenReturn(500);
  foundation.init();

  drawerHandlers.touchstart({
    pointerType: 'touch',
    pageX: 500,
  });
  raf.flush();

  handlers.touchmove({
    pointerType: 'not touch',
    pageX: 490,
  });
  raf.flush();
  td.verify(mockAdapter.updateCssVariable(0.98), {times: 0});

  raf.restore();
});

test('on touch end resets touch update styles', () => {
  const {foundation, mockAdapter} = setupTest();
  const drawerHandlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-drawer--open')).thenReturn(true);
  td.when(mockAdapter.getDrawerWidth()).thenReturn(500);
  foundation.init();

  drawerHandlers.touchstart({
    touches: [{pageX: 500}],
  });
  raf.flush();

  handlers.touchend({});
  td.verify(mockAdapter.updateCssVariable(''));
  raf.restore();
});

test('on touch end does not update drawer', () => {
  const {foundation, mockAdapter} = setupTest();
  const drawerHandlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-drawer--open')).thenReturn(true);
  td.when(mockAdapter.getDrawerWidth()).thenReturn(500);
  foundation.init();

  drawerHandlers.touchstart({
    touches: [{pageX: 500}],
  });
  raf.flush();
  td.verify(mockAdapter.updateCssVariable(1), {times: 1});

  handlers.touchend({});
  raf.flush();
  td.verify(mockAdapter.updateCssVariable(1), {times: 1});

  raf.restore();
});

test('#isRootTransitioningEventTarget_ returns true if the element is the drawer element', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.init();
  const fakeEl = 'fake element';
  td.when(mockAdapter.isDrawer(fakeEl)).thenReturn(true);
  assert.isTrue(foundation.isRootTransitioningEventTarget_(fakeEl));
});

test('#open adds scroll lock class to the body', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();

  td.verify(mockAdapter.addBodyClass(cssClasses.SCROLL_LOCK));
});

test('#close removes the scroll lock class from the body', () => {
  const {foundation, mockAdapter} = setupTest();

  td.when(mockAdapter.registerTransitionEndHandler(td.callback)).thenCallback({target: {}});
  td.when(mockAdapter.isDrawer(td.matchers.isA(Object))).thenReturn(true);
  foundation.open();
  td.when(mockAdapter.registerTransitionEndHandler(td.callback)).thenCallback({target: {}});
  td.when(mockAdapter.isDrawer(td.matchers.isA(Object))).thenReturn(true);
  foundation.close();

  td.verify(mockAdapter.removeBodyClass(cssClasses.SCROLL_LOCK));
});
