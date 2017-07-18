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
import lolex from 'lolex';
import td from 'testdouble';
import {captureHandlers, verifyDefaultAdapter} from '../helpers/foundation';
import {setupFoundationTest} from '../helpers/setup';
import {createMockRaf} from '../helpers/raf';
import MDCSimpleMenuFoundation from '../../../packages/mdc-menu/simple/foundation';
import {cssClasses, strings, numbers} from '../../../packages/mdc-menu/simple/constants';

function setupTest() {
  const {foundation, mockAdapter} = setupFoundationTest(MDCSimpleMenuFoundation);
  const size = {width: 500, height: 200};
  const itemYParams = {top: 100, height: 20};
  td.when(mockAdapter.hasClass('mdc-simple-menu')).thenReturn(true);
  td.when(mockAdapter.hasClass('mdc-simple-menu--open')).thenReturn(false);
  td.when(mockAdapter.hasNecessaryDom()).thenReturn(true);
  td.when(mockAdapter.getNumberOfItems()).thenReturn(1);
  td.when(mockAdapter.getInnerDimensions()).thenReturn(size);
  td.when(mockAdapter.getYParamsForItemAtIndex(0)).thenReturn(itemYParams);

  return {foundation, mockAdapter};
}

function testFoundation(desc, runTests) {
  test(desc, () => {
    const {mockAdapter, foundation} = setupTest();
    const mockRaf = createMockRaf();
    runTests({mockAdapter, foundation, mockRaf});
    mockRaf.restore();
  });
}

suite('MDCSimpleMenuFoundation');

test('exports strings', () => {
  assert.deepEqual(MDCSimpleMenuFoundation.strings, strings);
});

test('exports cssClasses', () => {
  assert.deepEqual(MDCSimpleMenuFoundation.cssClasses, cssClasses);
});

test('exports numbers', () => {
  assert.deepEqual(MDCSimpleMenuFoundation.numbers, numbers);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCSimpleMenuFoundation, [
    'addClass', 'removeClass', 'hasClass', 'hasNecessaryDom', 'getAttributeForEventTarget', 'getInnerDimensions',
    'hasAnchor', 'getAnchorDimensions', 'getWindowDimensions', 'setScale', 'setInnerScale', 'getNumberOfItems',
    'registerInteractionHandler', 'deregisterInteractionHandler', 'registerBodyClickHandler',
    'deregisterBodyClickHandler', 'getYParamsForItemAtIndex', 'setTransitionDelayForItemAtIndex',
    'getIndexForEventTarget', 'notifySelected', 'notifyCancel', 'saveFocus', 'restoreFocus', 'isFocused', 'focus',
    'getFocusedItemIndex', 'focusItemAtIndex', 'isRtl', 'setTransformOrigin', 'setPosition', 'getAccurateTime',
  ]);
});

test('#init throws error when the root class is not present', () => {
  const mockAdapter = td.object(MDCSimpleMenuFoundation.defaultAdapter);
  td.when(mockAdapter.hasClass('mdc-simple-menu')).thenReturn(false);

  const foundation = new MDCSimpleMenuFoundation(mockAdapter);
  assert.throws(() => foundation.init());
});

test('#init throws error when the necessary DOM is not present', () => {
  const mockAdapter = td.object(MDCSimpleMenuFoundation.defaultAdapter);
  td.when(mockAdapter.hasClass('mdc-simple-menu')).thenReturn(true);
  td.when(mockAdapter.hasNecessaryDom()).thenReturn(false);

  const foundation = new MDCSimpleMenuFoundation(mockAdapter);
  assert.throws(() => foundation.init());
});

testFoundation('#open adds the animation class to start an animation', ({foundation, mockAdapter, mockRaf}) => {
  foundation.open();
  mockRaf.flush();
  mockRaf.flush();
  td.verify(mockAdapter.addClass('mdc-simple-menu--animating'));
});

testFoundation('#open adds the open class to the menu', ({foundation, mockAdapter, mockRaf}) => {
  td.when(mockAdapter.hasClass('mdc-simple-menu--open-from-bottom-right')).thenReturn(true);

  foundation.open();
  mockRaf.flush();
  mockRaf.flush();
  td.verify(mockAdapter.addClass('mdc-simple-menu--open'));
});

testFoundation('#open removes the animation class at the end of the animation',
  ({foundation, mockAdapter, mockRaf}) => {
    td.when(mockAdapter.getAccurateTime()).thenReturn(0);
    td.when(mockAdapter.hasClass('mdc-simple-menu--open-from-top-right')).thenReturn(true);

    foundation.open();
    mockRaf.flush();
    mockRaf.flush();
    td.verify(mockAdapter.addClass('mdc-simple-menu--animating'));

    td.when(mockAdapter.getAccurateTime()).thenReturn(500);
    mockRaf.flush();
    mockRaf.flush();
    td.verify(mockAdapter.removeClass('mdc-simple-menu--animating'));
  });

testFoundation('#open focuses the menu at the end of the animation', ({foundation, mockAdapter, mockRaf}) => {
  td.when(mockAdapter.getAccurateTime()).thenReturn(0);

  foundation.open();
  mockRaf.flush();
  mockRaf.flush();

  td.when(mockAdapter.getAccurateTime()).thenReturn(500);
  mockRaf.flush();
  td.verify(mockAdapter.focus());
});

testFoundation('#open on a not focused menu does not focust at index 0', ({foundation, mockAdapter, mockRaf}) => {
  td.when(mockAdapter.isFocused()).thenReturn(true);
  td.when(mockAdapter.getAccurateTime()).thenReturn(0);

  foundation.open();
  mockRaf.flush();
  mockRaf.flush();

  td.when(mockAdapter.getAccurateTime()).thenReturn(500);
  mockRaf.flush();
  td.verify(mockAdapter.focusItemAtIndex(0), {times: 0});
});

testFoundation('#open anchors the menu on the top left in LTR, given enough room',
  ({foundation, mockAdapter, mockRaf}) => {
    td.when(mockAdapter.hasAnchor()).thenReturn(true);
    td.when(mockAdapter.isRtl()).thenReturn(false);
    td.when(mockAdapter.getInnerDimensions()).thenReturn({height: 200, width: 100});
    td.when(mockAdapter.getWindowDimensions()).thenReturn({height: 1000, width: 1000});
    td.when(mockAdapter.getAnchorDimensions()).thenReturn({
      height: 20, width: 40, top: 20, bottom: 40, left: 20, right: 60,
    });
    td.when(mockAdapter.getAccurateTime()).thenReturn(0);

    foundation.open();
    mockRaf.flush();
    mockRaf.flush();

    td.when(mockAdapter.getAccurateTime()).thenReturn(500);
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('top left'));
    td.verify(mockAdapter.setPosition({left: '0', top: '0'}));
  });

testFoundation('#open anchors the menu on the top right in LTR when close to the right edge',
  ({foundation, mockAdapter, mockRaf}) => {
    td.when(mockAdapter.hasAnchor()).thenReturn(true);
    td.when(mockAdapter.isRtl()).thenReturn(false);
    td.when(mockAdapter.getInnerDimensions()).thenReturn({height: 200, width: 100});
    td.when(mockAdapter.getWindowDimensions()).thenReturn({height: 1000, width: 1000});
    td.when(mockAdapter.getAnchorDimensions()).thenReturn({
      height: 20, width: 40, top: 20, bottom: 40, left: 950, right: 990,
    });
    td.when(mockAdapter.getAccurateTime()).thenReturn(0);

    foundation.open();
    mockRaf.flush();
    mockRaf.flush();

    td.when(mockAdapter.getAccurateTime()).thenReturn(500);
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('top right'));
    td.verify(mockAdapter.setPosition({right: '0', top: '0'}));
  });

testFoundation('#open anchors the menu on the top right in RTL, given enough room',
  ({foundation, mockAdapter, mockRaf}) => {
    td.when(mockAdapter.hasAnchor()).thenReturn(true);
    td.when(mockAdapter.isRtl()).thenReturn(true);
    td.when(mockAdapter.getInnerDimensions()).thenReturn({height: 200, width: 100});
    td.when(mockAdapter.getWindowDimensions()).thenReturn({height: 1000, width: 1000});
    td.when(mockAdapter.getAnchorDimensions()).thenReturn({
      height: 20, width: 40, top: 20, bottom: 40, left: 500, right: 540,
    });
    td.when(mockAdapter.getAccurateTime()).thenReturn(0);

    foundation.open();
    mockRaf.flush();
    mockRaf.flush();

    td.when(mockAdapter.getAccurateTime()).thenReturn(500);
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('top right'));
    td.verify(mockAdapter.setPosition({right: '0', top: '0'}));
  });

testFoundation('#open anchors the menu on the top left in RTL when close to the left edge',
  ({foundation, mockAdapter, mockRaf}) => {
    td.when(mockAdapter.hasAnchor()).thenReturn(true);
    td.when(mockAdapter.isRtl()).thenReturn(true);
    td.when(mockAdapter.getInnerDimensions()).thenReturn({height: 200, width: 100});
    td.when(mockAdapter.getWindowDimensions()).thenReturn({height: 1000, width: 1000});
    td.when(mockAdapter.getAnchorDimensions()).thenReturn({
      height: 20, width: 40, top: 20, bottom: 40, left: 10, right: 50,
    });
    td.when(mockAdapter.getAccurateTime()).thenReturn(0);

    foundation.open();
    mockRaf.flush();
    mockRaf.flush();

    td.when(mockAdapter.getAccurateTime()).thenReturn(500);
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('top left'));
    td.verify(mockAdapter.setPosition({left: '0', top: '0'}));
  });

testFoundation('#open anchors the menu on the bottom left in LTR when close to the bottom edge',
  ({foundation, mockAdapter, mockRaf}) => {
    td.when(mockAdapter.hasAnchor()).thenReturn(true);
    td.when(mockAdapter.isRtl()).thenReturn(false);
    td.when(mockAdapter.getInnerDimensions()).thenReturn({height: 200, width: 100});
    td.when(mockAdapter.getWindowDimensions()).thenReturn({height: 1000, width: 1000});
    td.when(mockAdapter.getAnchorDimensions()).thenReturn({
      height: 20, width: 40, top: 900, bottom: 920, left: 10, right: 50,
    });
    td.when(mockAdapter.getAccurateTime()).thenReturn(0);

    foundation.open();
    mockRaf.flush();
    mockRaf.flush();

    td.when(mockAdapter.getAccurateTime()).thenReturn(500);
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('bottom left'));
    td.verify(mockAdapter.setPosition({left: '0', bottom: '0'}));
  });

testFoundation('#open anchors the menu on the top left in LTR when not close to the bottom edge',
  ({foundation, mockAdapter, mockRaf}) => {
    td.when(mockAdapter.hasAnchor()).thenReturn(true);
    td.when(mockAdapter.isRtl()).thenReturn(false);
    td.when(mockAdapter.getInnerDimensions()).thenReturn({height: 200, width: 100});
    td.when(mockAdapter.getWindowDimensions()).thenReturn({height: 1000, width: 1000});
    td.when(mockAdapter.getAnchorDimensions()).thenReturn({
      height: 20, width: 40, top: 900, bottom: 20, left: 10, right: 50,
    });
    td.when(mockAdapter.getAccurateTime()).thenReturn(0);

    foundation.open();
    mockRaf.flush();
    mockRaf.flush();

    td.when(mockAdapter.getAccurateTime()).thenReturn(500);
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('top left'));
    td.verify(mockAdapter.setPosition({left: '0', top: '0'}));
  });

testFoundation('#close does nothing if event target has aria-disabled set to true',
  ({foundation, mockAdapter}) => {
    const mockEvt = {
      target: {},
      stopPropagation: td.func('stopPropagation'),
    };

    td.when(mockAdapter.getAttributeForEventTarget(td.matchers.anything(), strings.ARIA_DISABLED_ATTR))
      .thenReturn('true');

    foundation.close(mockEvt);

    td.verify(mockAdapter.deregisterBodyClickHandler(td.matchers.anything()), {times: 0});
  });

testFoundation('#close adds the animation class to start an animation', ({foundation, mockAdapter, mockRaf}) => {
  foundation.close();
  mockRaf.flush();
  mockRaf.flush();
  td.verify(mockAdapter.addClass('mdc-simple-menu--animating'));
});

testFoundation('#close removes the open class from the menu', ({foundation, mockAdapter, mockRaf}) => {
  td.when(mockAdapter.hasClass('mdc-simple-menu--open')).thenReturn(true);
  td.when(mockAdapter.hasClass('mdc-simple-menu--open-from-bottom-left')).thenReturn(true);

  foundation.close();
  mockRaf.flush();
  mockRaf.flush();
  td.verify(mockAdapter.removeClass('mdc-simple-menu--open'));
});

testFoundation('#close removes the animation class at the end of the animation',
  ({foundation, mockAdapter, mockRaf}) => {
    td.when(mockAdapter.getAccurateTime()).thenReturn(0);
    td.when(mockAdapter.hasClass('mdc-simple-menu--open')).thenReturn(true);
    td.when(mockAdapter.hasClass('mdc-simple-menu--open-from-bottom-right')).thenReturn(true);

    foundation.close();
    mockRaf.flush();
    mockRaf.flush();
    td.verify(mockAdapter.addClass('mdc-simple-menu--animating'));

    td.when(mockAdapter.getAccurateTime()).thenReturn(500);
    mockRaf.flush();
    td.verify(mockAdapter.removeClass('mdc-simple-menu--animating'));
  });

test('#isOpen returns true when the menu is open', () => {
  const {foundation} = setupTest();

  foundation.open();
  assert.isOk(foundation.isOpen());
});

test('#isOpen returns false when the menu is closed', () => {
  const {foundation} = setupTest();

  foundation.close();
  assert.isNotOk(foundation.isOpen());
});

test('#isOpen returns true when the menu is initiated with the open class present', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass('mdc-simple-menu--open')).thenReturn(true);

  foundation.init();
  assert.isOk(foundation.isOpen());
});

test('#isOpen returns false when the menu is initiated without the open class present', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass('mdc-simple-menu--open')).thenReturn(false);

  foundation.init();
  assert.isNotOk(foundation.isOpen());
});

test('on click notifies user of selection after allowing time for selection UX to run', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const target = {};
  const expectedIndex = 2;
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(expectedIndex);

  foundation.init();
  handlers.click({target});
  td.verify(mockAdapter.notifySelected(td.matchers.anything()), {times: 0});

  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  td.verify(mockAdapter.notifySelected({index: expectedIndex}));

  clock.uninstall();
});

test('on click closes the menu', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const raf = createMockRaf();
  const target = {};
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(0);

  foundation.init();
  handlers.click({target});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  raf.flush();
  td.verify(mockAdapter.removeClass(cssClasses.OPEN));

  raf.restore();
  clock.uninstall();
});

test('on click does not trigger event target has aria-disabled set to true', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');

  td.when(mockAdapter.getAttributeForEventTarget(td.matchers.anything(), strings.ARIA_DISABLED_ATTR))
    .thenReturn('true');
  const clock = lolex.install();
  const mockEvt = {
    target: {},
    stopPropagation: td.func('stopPropagation'),
  };

  foundation.init();
  handlers.click(mockEvt);
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  td.verify(mockAdapter.notifySelected(td.matchers.anything()), {times: 0});

  clock.uninstall();
});

test('on click does not trigger selected if non menu item clicked', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const target = {};
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(-1);

  foundation.init();
  handlers.click({target});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  td.verify(mockAdapter.notifySelected(td.matchers.anything()), {times: 0});

  clock.uninstall();
});

test('on click does not trigger selected if selection is already queued up', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const target = {};
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(0, 1);

  foundation.init();
  handlers.click({target});
  handlers.click({target});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  td.verify(mockAdapter.notifySelected({index: 0}), {times: 1});

  clock.uninstall();
});

test('on ctrl+spacebar keyup does nothing', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const target = {};
  const expectedIndex = 2;
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(expectedIndex);

  foundation.init();
  handlers.keyup({target, key: 'Space', ctrlKey: true});
  td.verify(mockAdapter.notifySelected({index: expectedIndex}), {times: 0});
});

test('on spacebar keyup notifies user of selection after allowing time for selection UX to run', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const target = {};
  const expectedIndex = 2;
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(expectedIndex);

  foundation.init();
  handlers.keyup({target, key: 'Space'});
  td.verify(mockAdapter.notifySelected(td.matchers.anything()), {times: 0});

  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  td.verify(mockAdapter.notifySelected({index: expectedIndex}));

  clock.uninstall();
});

test('on spacebar keyup closes the menu', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const raf = createMockRaf();
  const target = {};
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(0);

  foundation.init();
  handlers.keyup({target, key: 'Space'});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  raf.flush();
  td.verify(mockAdapter.removeClass(cssClasses.OPEN));

  raf.restore();
  clock.uninstall();
});

test('on spacebar keyup does not trigger selected if non menu item clicked', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const target = {};
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(-1);

  foundation.init();
  handlers.keyup({target, key: 'Space'});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  td.verify(mockAdapter.notifySelected(td.matchers.anything()), {times: 0});

  clock.uninstall();
});

test('on spacebar keyup does not trigger selected if selection is already queued up', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const target = {};
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(0, 1);

  foundation.init();
  handlers.keyup({target, key: 'Space'});
  handlers.keyup({target, key: 'Space'});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  td.verify(mockAdapter.notifySelected({index: 0}), {times: 1});

  clock.uninstall();
});

test('on spacebar keyup does works if DOM3 keyboard events are not supported', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const target = {};
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(0);

  foundation.init();
  handlers.keyup({target, keyCode: 32});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  td.verify(mockAdapter.notifySelected({index: 0}));

  clock.uninstall();
});

test('on enter keyup notifies user of selection after allowing time for selection UX to run', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const target = {};
  const expectedIndex = 2;
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(expectedIndex);

  foundation.init();
  handlers.keyup({target, key: 'Enter'});
  td.verify(mockAdapter.notifySelected(td.matchers.anything()), {times: 0});

  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  td.verify(mockAdapter.notifySelected({index: expectedIndex}));

  clock.uninstall();
});

test('on enter keyup closes the menu', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const raf = createMockRaf();
  const target = {};
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(0);

  foundation.init();
  handlers.keyup({target, key: 'Enter'});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  raf.flush();
  td.verify(mockAdapter.removeClass(cssClasses.OPEN));

  raf.restore();
  clock.uninstall();
});

test('on enter keyup does not trigger selected if non menu item clicked', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const target = {};
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(-1);

  foundation.init();
  handlers.keyup({target, key: 'Enter'});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  td.verify(mockAdapter.notifySelected(td.matchers.anything()), {times: 0});

  clock.uninstall();
});

test('on enter keyup does not trigger selected if selection is already queued up', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const target = {};
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(0, 1);

  foundation.init();
  handlers.keyup({target, key: 'Enter'});
  handlers.keyup({target, key: 'Enter'});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  td.verify(mockAdapter.notifySelected({index: 0}), {times: 1});

  clock.uninstall();
});

test('on enter keyup does works if DOM3 keyboard events are not supported', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const target = {};
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(0);

  foundation.init();
  handlers.keyup({target, keyCode: 13});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  td.verify(mockAdapter.notifySelected({index: 0}));

  clock.uninstall();
});

test('on escape keyup closes the menu and sends cancel event', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const raf = createMockRaf();
  const target = {};
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(0);

  foundation.init();
  handlers.keyup({target, key: 'Escape'});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  raf.flush();
  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
  td.verify(mockAdapter.notifyCancel());

  raf.restore();
  clock.uninstall();
});

test('on Ctrl+Tab keydown does nothing', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const target = {};
  td.when(mockAdapter.getNumberOfItems()).thenReturn(3);
  td.when(mockAdapter.getFocusedItemIndex()).thenReturn(2);

  foundation.init();
  handlers.keydown({target, key: 'Tab', ctrlKey: true, preventDefault: () => {}});
  td.verify(mockAdapter.getIndexForEventTarget(target), {times: 0});
});

test('on Tab keydown on the last element, it moves to the first', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const raf = createMockRaf();
  const target = {};
  td.when(mockAdapter.getNumberOfItems()).thenReturn(3);
  td.when(mockAdapter.getFocusedItemIndex()).thenReturn(2);

  foundation.init();
  handlers.keydown({target, key: 'Tab', preventDefault: () => {}});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  raf.flush();
  td.verify(mockAdapter.focusItemAtIndex(0));

  raf.restore();
  clock.uninstall();
});

test('on Shift+Tab keydown on the first element, it moves to the last', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const raf = createMockRaf();
  const target = {};
  td.when(mockAdapter.getNumberOfItems()).thenReturn(3);
  td.when(mockAdapter.getFocusedItemIndex()).thenReturn(0);

  foundation.init();
  handlers.keydown({target, key: 'Tab', shiftKey: true, preventDefault: () => {}});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  raf.flush();
  td.verify(mockAdapter.focusItemAtIndex(2));

  raf.restore();
  clock.uninstall();
});

test('on ArrowDown keydown on the last element, it moves to the first', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const raf = createMockRaf();
  const target = {};
  td.when(mockAdapter.getNumberOfItems()).thenReturn(3);
  td.when(mockAdapter.getFocusedItemIndex()).thenReturn(2);

  foundation.init();
  handlers.keydown({target, key: 'ArrowDown', preventDefault: () => {}});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  raf.flush();
  td.verify(mockAdapter.focusItemAtIndex(0));

  raf.restore();
  clock.uninstall();
});

test('on ArrowDown keydown on the first element, it moves to the second', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const raf = createMockRaf();
  const target = {};
  td.when(mockAdapter.getNumberOfItems()).thenReturn(3);
  td.when(mockAdapter.getFocusedItemIndex()).thenReturn(0);

  foundation.init();
  handlers.keydown({target, key: 'ArrowDown', preventDefault: () => {}});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  raf.flush();
  td.verify(mockAdapter.focusItemAtIndex(1));

  raf.restore();
  clock.uninstall();
});

test('on ArrowDown keydown prevents default on the event', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const raf = createMockRaf();
  const target = {};
  const preventDefault = td.func('event.preventDefault');
  td.when(mockAdapter.getNumberOfItems()).thenReturn(3);
  td.when(mockAdapter.getFocusedItemIndex()).thenReturn(0);

  foundation.init();
  handlers.keydown({target, key: 'ArrowDown', preventDefault});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  raf.flush();
  td.verify(preventDefault());

  raf.restore();
  clock.uninstall();
});

test('on ArrowUp keydown on the first element, it moves to the last', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const raf = createMockRaf();
  const target = {};
  td.when(mockAdapter.getNumberOfItems()).thenReturn(3);
  td.when(mockAdapter.getFocusedItemIndex()).thenReturn(0);

  foundation.init();
  handlers.keydown({target, key: 'ArrowUp', preventDefault: () => {}});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  raf.flush();
  td.verify(mockAdapter.focusItemAtIndex(2));

  raf.restore();
  clock.uninstall();
});

test('on ArrowUp keydown on the last element, it moves to the previous', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const raf = createMockRaf();
  const target = {};
  td.when(mockAdapter.getNumberOfItems()).thenReturn(3);
  td.when(mockAdapter.getFocusedItemIndex()).thenReturn(2);

  foundation.init();
  handlers.keydown({target, key: 'ArrowUp', preventDefault: () => {}});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  raf.flush();
  td.verify(mockAdapter.focusItemAtIndex(1));

  raf.restore();
  clock.uninstall();
});

test('on ArrowUp keydown prevents default on the event', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const raf = createMockRaf();
  const target = {};
  const preventDefault = td.func('event.preventDefault');
  td.when(mockAdapter.getNumberOfItems()).thenReturn(3);
  td.when(mockAdapter.getFocusedItemIndex()).thenReturn(2);

  foundation.init();
  handlers.keydown({target, key: 'ArrowUp', preventDefault});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  raf.flush();
  td.verify(preventDefault());

  raf.restore();
  clock.uninstall();
});

test('on any other keydown event, do not prevent default on the event', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const raf = createMockRaf();
  const target = {};
  const preventDefault = td.func('event.preventDefault');
  td.when(mockAdapter.getNumberOfItems()).thenReturn(3);
  td.when(mockAdapter.getFocusedItemIndex()).thenReturn(2);

  foundation.init();
  handlers.keydown({target, key: 'Foo', preventDefault});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  raf.flush();
  td.verify(preventDefault(), {times: 0});

  raf.restore();
  clock.uninstall();
});

test('on spacebar keydown prevents default on the event', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const raf = createMockRaf();
  const target = {};
  const preventDefault = td.func('event.preventDefault');
  td.when(mockAdapter.getNumberOfItems()).thenReturn(3);
  td.when(mockAdapter.getFocusedItemIndex()).thenReturn(2);

  foundation.init();
  handlers.keydown({target, key: 'Space', preventDefault});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  raf.flush();
  td.verify(preventDefault());

  raf.restore();
  clock.uninstall();
});

testFoundation('on document click cancels and closes the menu', ({foundation, mockAdapter, mockRaf}) => {
  let documentClickHandler;
  td.when(mockAdapter.registerBodyClickHandler(td.matchers.isA(Function))).thenDo((handler) => {
    documentClickHandler = handler;
  });

  foundation.init();
  foundation.open();
  mockRaf.flush();

  documentClickHandler();
  mockRaf.flush();

  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
  td.verify(mockAdapter.notifyCancel());

  mockRaf.restore();
});

testFoundation('should cancel animation after destroy', ({foundation, mockAdapter, mockRaf}) => {
  foundation.init();
  mockRaf.flush();
  foundation.open();
  foundation.destroy();
  mockRaf.flush();
  mockRaf.flush();

  td.verify(
    mockAdapter.setScale(td.matchers.anything(), td.matchers.anything()),
    {times: 0}
  );
});
