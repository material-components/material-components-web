/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {assert} from 'chai';
import td from 'testdouble';

import {captureHandlers, verifyDefaultAdapter} from '../helpers/foundation';
import {createMockRaf} from '../helpers/raf';
import {MDCSlidableDrawerFoundation} from '../../../packages/mdc-drawer/slidable';

function setupTest(isRootTransitioningEventTarget) {
  const mockAdapter = td.object(MDCSlidableDrawerFoundation.defaultAdapter);

  class MDCFakeSlideableDrawerFoundation extends MDCSlidableDrawerFoundation {
    isRootTransitioningEventTarget_() {
      return isRootTransitioningEventTarget;
    }
  }

  const foundation =
    new MDCFakeSlideableDrawerFoundation(
      mockAdapter, 'mdc-slidable-drawer', 'mdc-slidable-drawer--animating', 'mdc-slidable-drawer--open');

  td.when(mockAdapter.hasClass('mdc-slidable-drawer')).thenReturn(true);
  td.when(mockAdapter.hasNecessaryDom()).thenReturn(true);
  return {foundation, mockAdapter};
}

suite('MDCSlidableDrawerFoundation');

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCSlidableDrawerFoundation, [
    'addClass', 'removeClass', 'hasClass', 'hasNecessaryDom', 'registerInteractionHandler',
    'deregisterInteractionHandler', 'registerDrawerInteractionHandler', 'deregisterDrawerInteractionHandler',
    'registerTransitionEndHandler', 'deregisterTransitionEndHandler', 'registerDocumentKeydownHandler',
    'deregisterDocumentKeydownHandler', 'setTranslateX', 'getFocusableElements',
    'saveElementTabState', 'restoreElementTabState', 'makeElementUntabbable',
    'notifyOpen', 'notifyClose', 'isRtl', 'getDrawerWidth',
  ]);
});

test('#init throws error when the root class is not present', () => {
  const mockAdapter = td.object(MDCSlidableDrawerFoundation.defaultAdapter);
  td.when(mockAdapter.hasClass('mdc-slidable-drawer')).thenReturn(false);

  const foundation =
    new MDCSlidableDrawerFoundation(
      mockAdapter, 'mdc-slidable-drawer', 'mdc-slidable-drawer--animating', 'mdc-slidable-drawer--open');
  assert.throws(() => foundation.init());
});

test('#init throws error when the necessary DOM is not present', () => {
  const mockAdapter = td.object(MDCSlidableDrawerFoundation.defaultAdapter);
  td.when(mockAdapter.hasClass('mdc-slidable-drawer')).thenReturn(true);
  td.when(mockAdapter.hasNecessaryDom()).thenReturn(false);

  const foundation =
    new MDCSlidableDrawerFoundation(
      mockAdapter, 'mdc-slidable-drawer', 'mdc-slidable-drawer--animating', 'mdc-slidable-drawer--open');
  assert.throws(() => foundation.init());
});

test('#init calls component and drawer event registrations', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.init();
  td.verify(mockAdapter.registerDrawerInteractionHandler('click', isA(Function)));
  td.verify(mockAdapter.registerDrawerInteractionHandler('touchstart', isA(Function)));
  td.verify(mockAdapter.registerInteractionHandler('touchmove', isA(Function)));
  td.verify(mockAdapter.registerInteractionHandler('touchend', isA(Function)));
});

test('#destroy calls component and drawer event deregistrations', () => {
  const {foundation, mockAdapter} = setupTest();
  const {isA} = td.matchers;

  foundation.init();
  foundation.destroy();
  td.verify(mockAdapter.deregisterDrawerInteractionHandler('click', isA(Function)));
  td.verify(
    mockAdapter.deregisterDrawerInteractionHandler('touchstart', isA(Function))
  );
  td.verify(mockAdapter.deregisterInteractionHandler('touchmove', isA(Function)));
  td.verify(mockAdapter.deregisterInteractionHandler('touchend', isA(Function)));
});

test('#destroy ensures any currently attached document keydown handler is cleaned up', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  foundation.destroy();
  td.verify(mockAdapter.deregisterDocumentKeydownHandler(td.matchers.isA(Function)));
});

test('#open adds the animation class to start an animation', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();
  td.verify(mockAdapter.addClass('mdc-slidable-drawer--animating'));
});

test('#open adds the open class to show the open drawer', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();
  td.verify(mockAdapter.addClass('mdc-slidable-drawer--open'));
});

test('#open sends open event', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();
  td.verify(mockAdapter.notifyOpen());
});

test('repeated #open sends event just once', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.open();
  foundation.open();
  td.verify(mockAdapter.addClass('mdc-slidable-drawer--open'), {times: 2});
  td.verify(mockAdapter.notifyOpen(), {times: 1});
});

test('#open makes elements tabbable again', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass('mdc-slidable-drawer--open')).thenReturn(false);
  td.when(mockAdapter.getFocusableElements()).thenReturn(['foo', 'bar']);

  foundation.init();
  foundation.open();
  td.verify(mockAdapter.restoreElementTabState('foo'));
  td.verify(mockAdapter.restoreElementTabState('bar'));
});

test('#close adds the animation class to start an animation', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.close();
  td.verify(mockAdapter.addClass('mdc-slidable-drawer--animating'));
});

test('#close removes the open class to show the closed drawer', () => {
  const {foundation, mockAdapter} = setupTest();

  foundation.close();
  td.verify(mockAdapter.removeClass('mdc-slidable-drawer--open'));
});

test('#close sends close event', () => {
  const {foundation, mockAdapter} = setupTest();

  // Drawer needs to be opened, otherwise close event won't trigger on #close
  foundation.open();
  assert.isOk(foundation.isOpen());

  foundation.close();
  td.verify(mockAdapter.notifyClose());
});

test('#close does not send close event when drawer is not open', () => {
  const {foundation, mockAdapter} = setupTest();

  assert.isNotOk(foundation.isOpen());

  foundation.close();
  td.verify(mockAdapter.notifyClose(), {times: 0});
});

test('#close saves tab state and makes elements untabbable', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass('mdc-slidable-drawer--open')).thenReturn(true);
  td.when(mockAdapter.getFocusableElements()).thenReturn(['foo', 'bar']);

  foundation.init();
  foundation.close();
  td.verify(mockAdapter.saveElementTabState('foo'));
  td.verify(mockAdapter.makeElementUntabbable('foo'));
  td.verify(mockAdapter.saveElementTabState('bar'));
  td.verify(mockAdapter.makeElementUntabbable('bar'));
});

test('#close works when there are no elements to make untabbable', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass('mdc-slidable-drawer--open')).thenReturn(true);
  td.when(mockAdapter.getFocusableElements()).thenReturn(null);
  foundation.init();
  assert.doesNotThrow(() => foundation.close());
});

test('#close cleans up the document keydown handler', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.init();
  foundation.close();
  td.verify(mockAdapter.deregisterDocumentKeydownHandler(td.matchers.isA(Function)));
});

test('#isOpen returns true when the drawer is open', () => {
  const {foundation} = setupTest();

  foundation.open();
  assert.isOk(foundation.isOpen());
});

test('#isOpen returns false when the drawer is closed', () => {
  const {foundation} = setupTest();

  foundation.close();
  assert.isNotOk(foundation.isOpen());
});

test('#isOpen returns true when the drawer is initiated with the open class present', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass('mdc-slidable-drawer--open')).thenReturn(true);

  foundation.init();
  assert.isOk(foundation.isOpen());
});

test('#isOpen returns false when the drawer is initiated without the open class present', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass('mdc-slidable-drawer--open')).thenReturn(false);

  foundation.init();
  assert.isNotOk(foundation.isOpen());
});

test('on touch start updates the drawer to the touch target coordinates', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-slidable-drawer--open')).thenReturn(true);
  td.when(mockAdapter.getDrawerWidth()).thenReturn(500);
  foundation.init();

  handlers.touchstart({
    touches: [{pageX: 50}],
  });
  raf.flush();
  td.verify(mockAdapter.setTranslateX(0));

  raf.restore();
});

test('on touch start does not update the drawer when drawer not open', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-slidable-drawer--open')).thenReturn(false);
  td.when(mockAdapter.getDrawerWidth()).thenReturn(500);
  foundation.init();

  handlers.touchstart({
    touches: [{pageX: 50}],
  });
  raf.flush();
  td.verify(mockAdapter.setTranslateX(0), {times: 0});

  raf.restore();
});

test('on touch start works for pointer events', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-slidable-drawer--open')).thenReturn(true);
  td.when(mockAdapter.getDrawerWidth()).thenReturn(500);
  foundation.init();

  handlers.touchstart({
    pointerType: 'touch',
    pageX: 50,
  });
  raf.flush();
  td.verify(mockAdapter.setTranslateX(0));

  raf.restore();
});

test('on touch start does not update the drawer when pointertype != touch', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-slidable-drawer--open')).thenReturn(true);
  td.when(mockAdapter.getDrawerWidth()).thenReturn(500);
  foundation.init();

  handlers.touchstart({
    pointerType: 'not touch',
    pageX: 50,
  });
  raf.flush();
  td.verify(mockAdapter.setTranslateX(0), {times: 0});

  raf.restore();
});

test('on touch move updates currentX causing the drawer to update', () => {
  const {foundation, mockAdapter} = setupTest();
  const drawerHandlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-slidable-drawer--open')).thenReturn(true);
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

  td.verify(mockAdapter.setTranslateX(-10));

  handlers.touchmove({
    touches: [{pageX: 495}],
    preventDefault: () => {},
  });
  raf.flush();

  td.verify(mockAdapter.setTranslateX(-5));
  raf.restore();
});

test('on touch move does not allow the drawer to move past its width', () => {
  const {foundation, mockAdapter} = setupTest();
  const drawerHandlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-slidable-drawer--open')).thenReturn(true);
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

  td.verify(mockAdapter.setTranslateX(0));
  raf.restore();
});

test('on touch move does not allow the drawer to move past its width in RTL', () => {
  const {foundation, mockAdapter} = setupTest();
  const drawerHandlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-slidable-drawer--open')).thenReturn(true);
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

  td.verify(mockAdapter.setTranslateX(0));
  raf.restore();
});

test('on touch move works for pointer events', () => {
  const {foundation, mockAdapter} = setupTest();
  const drawerHandlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-slidable-drawer--open')).thenReturn(true);
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
  td.verify(mockAdapter.setTranslateX(-10));

  raf.restore();
});

test('on touch move does not update the drawer when pointertype != touch', () => {
  const {foundation, mockAdapter} = setupTest();
  const drawerHandlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-slidable-drawer--open')).thenReturn(true);
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
  td.verify(mockAdapter.setTranslateX(-10), {times: 0});

  raf.restore();
});

test('on touch end resets touch update styles', () => {
  const {foundation, mockAdapter} = setupTest();
  const drawerHandlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-slidable-drawer--open')).thenReturn(true);
  td.when(mockAdapter.getDrawerWidth()).thenReturn(500);
  foundation.init();

  drawerHandlers.touchstart({
    touches: [{pageX: 500}],
  });
  raf.flush();

  handlers.touchend({});
  td.verify(mockAdapter.setTranslateX(null));
  raf.restore();
});

test('on touch end does not update drawer', () => {
  const {foundation, mockAdapter} = setupTest();
  const drawerHandlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-slidable-drawer--open')).thenReturn(true);
  td.when(mockAdapter.getDrawerWidth()).thenReturn(500);
  foundation.init();

  drawerHandlers.touchstart({
    touches: [{pageX: 500}],
  });
  raf.flush();
  td.verify(mockAdapter.setTranslateX(0), {times: 1});

  handlers.touchend({});
  raf.flush();
  td.verify(mockAdapter.setTranslateX(0), {times: 1});

  raf.restore();
});

test('on touch end closes the drawer if moved more than 50% and sends close event', () => {
  const {foundation, mockAdapter} = setupTest();
  const drawerHandlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-slidable-drawer--open')).thenReturn(true);
  td.when(mockAdapter.getDrawerWidth()).thenReturn(500);
  foundation.init();

  drawerHandlers.touchstart({
    touches: [{pageX: 500}],
  });
  raf.flush();

  handlers.touchmove({
    touches: [{pageX: 100}],
    preventDefault: () => {},
  });

  handlers.touchend({});
  td.verify(mockAdapter.removeClass('mdc-slidable-drawer--open'));
  td.verify(mockAdapter.notifyClose());
  raf.restore();
});

test('on touch end keeps the drawer open if moved less than 50% but does not send open event', () => {
  const {foundation, mockAdapter} = setupTest();
  const drawerHandlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-slidable-drawer--open')).thenReturn(true);
  td.when(mockAdapter.getDrawerWidth()).thenReturn(500);
  foundation.init();

  drawerHandlers.touchstart({
    touches: [{pageX: 500}],
  });
  raf.flush();

  handlers.touchmove({
    touches: [{pageX: 300}],
    preventDefault: () => {},
  });

  handlers.touchend({});
  td.verify(mockAdapter.addClass('mdc-slidable-drawer--open'));
  td.verify(mockAdapter.notifyOpen(), {times: 0});
  raf.restore();
});

test('on touch end closes the drawer if moved more than 50% in RTL and sends close event', () => {
  const {foundation, mockAdapter} = setupTest();
  const drawerHandlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-slidable-drawer--open')).thenReturn(true);
  td.when(mockAdapter.getDrawerWidth()).thenReturn(500);
  td.when(mockAdapter.isRtl()).thenReturn(true);
  foundation.init();

  drawerHandlers.touchstart({
    touches: [{pageX: 100}],
  });
  raf.flush();

  handlers.touchmove({
    touches: [{pageX: 500}],
    preventDefault: () => {},
  });

  handlers.touchend({});
  td.verify(mockAdapter.removeClass('mdc-slidable-drawer--open'));
  td.verify(mockAdapter.notifyClose());
  raf.restore();
});

test('on touch end keeps the drawer open if moved less than 50% in RTL but does not send open event', () => {
  const {foundation, mockAdapter} = setupTest();
  const drawerHandlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-slidable-drawer--open')).thenReturn(true);
  td.when(mockAdapter.getDrawerWidth()).thenReturn(500);
  td.when(mockAdapter.isRtl()).thenReturn(true);
  foundation.init();

  drawerHandlers.touchstart({
    touches: [{pageX: 300}],
  });
  raf.flush();

  handlers.touchmove({
    touches: [{pageX: 500}],
    preventDefault: () => {},
  });

  handlers.touchend({});
  td.verify(mockAdapter.addClass('mdc-slidable-drawer--open'));
  td.verify(mockAdapter.notifyOpen(), {times: 0});
  raf.restore();
});

test('on touch end works with pointer events', () => {
  const {foundation, mockAdapter} = setupTest();
  const drawerHandlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-slidable-drawer--open')).thenReturn(true);
  td.when(mockAdapter.getDrawerWidth()).thenReturn(500);
  foundation.init();

  drawerHandlers.touchstart({
    pointerType: 'touch',
    pageX: 500,
  });
  raf.flush();

  handlers.touchmove({
    pointerType: 'touch',
    pageX: 300,
    preventDefault: () => {},
  });

  handlers.touchend({
    pointerType: 'touch',
  });
  td.verify(mockAdapter.addClass('mdc-slidable-drawer--open'));
  td.verify(mockAdapter.notifyOpen(), {times: 0});
  raf.restore();
});

test('on touch does nothing for non touch pointer events', () => {
  const {foundation, mockAdapter} = setupTest();
  const drawerHandlers = captureHandlers(mockAdapter, 'registerDrawerInteractionHandler');
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const raf = createMockRaf();
  td.when(mockAdapter.hasClass('mdc-slidable-drawer--open')).thenReturn(true);
  td.when(mockAdapter.getDrawerWidth()).thenReturn(500);
  foundation.init();

  drawerHandlers.touchstart({
    pointerType: 'touch',
    pageX: 500,
  });
  raf.flush();

  handlers.touchmove({
    pointerType: 'touch',
    pageX: 300,
    preventDefault: () => {},
  });

  handlers.touchend({
    pointerType: 'not touch',
  });
  td.verify(mockAdapter.addClass('mdc-slidable-drawer--open'), {times: 0});
  td.verify(mockAdapter.notifyOpen(), {times: 0});
  raf.restore();
});

test('on document keydown closes the drawer via the escape key', () => {
  const {foundation, mockAdapter} = setupTest();
  let keydown;
  td.when(mockAdapter.registerDocumentKeydownHandler(td.matchers.isA(Function))).thenDo((handler) => {
    keydown = handler;
  });
  foundation.init();
  foundation.open();

  keydown({
    key: 'Escape',
  });
  td.verify(mockAdapter.removeClass('mdc-slidable-drawer--open'));
});

test('on document keydown sends cancel event via the escape key', () => {
  const {foundation, mockAdapter} = setupTest();
  let keydown;
  td.when(mockAdapter.registerDocumentKeydownHandler(td.matchers.isA(Function))).thenDo((handler) => {
    keydown = handler;
  });
  foundation.init();
  foundation.open();

  keydown({
    key: 'Escape',
  });
  td.verify(mockAdapter.notifyClose());
});

test('on document keydown closes the drawer via the escape keyCode when key prop not available', () => {
  const {foundation, mockAdapter} = setupTest();
  let keydown;
  td.when(mockAdapter.registerDocumentKeydownHandler(td.matchers.isA(Function))).thenDo((handler) => {
    keydown = handler;
  });
  foundation.init();
  foundation.open();

  keydown({
    keyCode: 27,
  });
  td.verify(mockAdapter.removeClass('mdc-slidable-drawer--open'));
});

test('on document keydown sends cancel event via the escape keyCode when key prop not available', () => {
  const {foundation, mockAdapter} = setupTest();
  let keydown;
  td.when(mockAdapter.registerDocumentKeydownHandler(td.matchers.isA(Function))).thenDo((handler) => {
    keydown = handler;
  });
  foundation.init();
  foundation.open();

  keydown({
    keyCode: 27,
  });
  td.verify(mockAdapter.notifyClose());
});

test('on document keydown does nothing when key present but not "Escape"', () => {
  const {foundation, mockAdapter} = setupTest();
  let keydown;
  td.when(mockAdapter.registerDocumentKeydownHandler(td.matchers.isA(Function))).thenDo((handler) => {
    keydown = handler;
  });
  foundation.init();
  foundation.open();

  keydown({
    key: 'Enter',
  });
  td.verify(mockAdapter.removeClass('mdc-slidable-drawer--open'), {times: 0});
  td.verify(mockAdapter.notifyClose(), {times: 0});
});

test('on document keydown does nothing when key prop not present and keyCode is not 27', () => {
  const {foundation, mockAdapter} = setupTest();
  let keydown;
  td.when(mockAdapter.registerDocumentKeydownHandler(td.matchers.isA(Function))).thenDo((handler) => {
    keydown = handler;
  });
  foundation.init();
  foundation.open();

  keydown({
    keyCode: 32,
  });
  td.verify(mockAdapter.removeClass('mdc-slidable-drawer--open'), {times: 0});
  td.verify(mockAdapter.notifyClose(), {times: 0});
});

test('on document keydown does nothing if drawer is not opened', () => {
  const {foundation, mockAdapter} = setupTest();
  let keydown;
  td.when(mockAdapter.registerDocumentKeydownHandler(td.matchers.isA(Function))).thenDo((handler) => {
    keydown = handler;
  });
  foundation.init();

  assert.isOk(keydown === undefined);
});

test('should clean up transition handlers after drawer close', () => {
  const {foundation, mockAdapter} = setupTest(true);
  td.when(mockAdapter.registerTransitionEndHandler(td.callback)).thenCallback({target: {}});
  foundation.close();
  td.verify(mockAdapter.deregisterTransitionEndHandler(td.matchers.isA(Function)));
});

test('should not trigger bug #67', () => {
  const {foundation, mockAdapter} = setupTest(false);
  td.when(mockAdapter.registerTransitionEndHandler(td.callback)).thenCallback({target: null});
  foundation.close();
  td.verify(mockAdapter.removeClass('mdc-slidable-drawer--animating'), {times: 0});
  td.verify(
    mockAdapter.deregisterTransitionEndHandler(td.matchers.isA(Function)),
    {times: 0}
  );
});

test('isRootTransitioningEventTarget_ returns false', () => {
  const mockAdapter = td.object(MDCSlidableDrawerFoundation.defaultAdapter);
  const foundation =
    new MDCSlidableDrawerFoundation(
      mockAdapter, 'mdc-slidable-drawer', 'mdc-slidable-drawer--animating', 'mdc-slidable-drawer--open');

  td.when(mockAdapter.hasClass('mdc-slidable-drawer')).thenReturn(true);
  td.when(mockAdapter.hasNecessaryDom()).thenReturn(true);

  td.when(mockAdapter.registerTransitionEndHandler(td.callback)).thenCallback({target: null});
  foundation.close();
  td.verify(mockAdapter.removeClass('mdc-slidable-drawer--animating'), {times: 0});
  td.verify(
    mockAdapter.deregisterTransitionEndHandler(td.matchers.isA(Function)),
    {times: 0}
  );
});
