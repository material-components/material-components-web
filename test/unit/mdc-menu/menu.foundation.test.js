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
import {MDCMenuFoundation} from '../../../packages/mdc-menu/foundation';
import {cssClasses, strings, numbers, Corner} from '../../../packages/mdc-menu/constants';

function setupTest() {
  const {foundation, mockAdapter} = setupFoundationTest(MDCMenuFoundation);
  const size = {width: 500, height: 200};
  td.when(mockAdapter.hasClass(cssClasses.ROOT)).thenReturn(true);
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(false);
  td.when(mockAdapter.hasNecessaryDom()).thenReturn(true);
  td.when(mockAdapter.getNumberOfItems()).thenReturn(1);
  td.when(mockAdapter.getInnerDimensions()).thenReturn(size);

  return {foundation, mockAdapter};
}

// Various anchor dimensions.
const smallTopLeft = {height: 20, width: 40, top: 20, bottom: 40, left: 20, right: 60};
const smallBottomLeft = {height: 20, width: 40, top: 920, bottom: 940, left: 20, right: 60};
const smallBottomRight = {height: 20, width: 40, top: 920, bottom: 940, left: 920, right: 960};
const smallCenter = {height: 20, width: 40, top: 490, bottom: 510, left: 480, right: 520};
const smallAboveMiddleLeft = {height: 20, width: 40, top: 400, bottom: 420, left: 20, right: 60};
const smallBelowMiddleLeft = {height: 20, width: 40, top: 600, bottom: 620, left: 20, right: 60};
const wideCenter = {height: 20, width: 150, top: 490, bottom: 510, left: 450, right: 600};
const wideTopLeft = {height: 20, width: 150, top: 20, bottom: 40, left: 20, right: 170};

/**
 * Initializes viewport, anchor and menu dimensions. Viewport is 1000x1000. Default menu size is 100x200.
 * @param {Object} mockAdapter Mock double for the adapter.
 * @param {{height:number, width: number, top: number, bottom: number, left: number, right: number}} anchorDimensions
 *   Approximate viewport corner where anchor is located.
 * @param {boolean=} isRtl Indicates whether layout is RTL.
 * @param {number=} menuHeight Optional height of the menu.
 */
function initAnchorLayout(mockAdapter, anchorDimensions, isRtl = false, menuHeight = 200) {
  td.when(mockAdapter.hasAnchor()).thenReturn(true);
  td.when(mockAdapter.getWindowDimensions()).thenReturn({height: 1000, width: 1000});
  td.when(mockAdapter.getAnchorDimensions()).thenReturn(anchorDimensions);
  td.when(mockAdapter.isRtl()).thenReturn(isRtl);
  td.when(mockAdapter.getInnerDimensions()).thenReturn({height: menuHeight, width: 100});
}

function testFoundation(desc, runTests) {
  test(desc, () => {
    const {mockAdapter, foundation} = setupTest();
    const mockRaf = createMockRaf();
    runTests({mockAdapter, foundation, mockRaf});
    mockRaf.restore();
  });
}

suite('MDCMenuFoundation');

test('exports strings', () => {
  assert.deepEqual(MDCMenuFoundation.strings, strings);
});

test('exports cssClasses', () => {
  assert.deepEqual(MDCMenuFoundation.cssClasses, cssClasses);
});

test('exports numbers', () => {
  assert.deepEqual(MDCMenuFoundation.numbers, numbers);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCMenuFoundation, [
    'addClass', 'removeClass', 'hasClass', 'hasNecessaryDom', 'getAttributeForEventTarget',
    'getInnerDimensions', 'hasAnchor', 'getAnchorDimensions', 'getWindowDimensions',
    'getNumberOfItems', 'registerInteractionHandler', 'deregisterInteractionHandler', 'registerBodyClickHandler',
    'deregisterBodyClickHandler', 'getIndexForEventTarget', 'notifySelected', 'notifyCancel', 'saveFocus',
    'restoreFocus', 'isFocused', 'focus', 'getFocusedItemIndex', 'focusItemAtIndex', 'isRtl', 'setTransformOrigin',
    'setPosition', 'setMaxHeight', 'setAttrForOptionAtIndex', 'rmAttrForOptionAtIndex',
    'addClassForOptionAtIndex', 'rmClassForOptionAtIndex',
  ]);
});

test('#init throws error when the root class is not present', () => {
  const mockAdapter = td.object(MDCMenuFoundation.defaultAdapter);
  td.when(mockAdapter.hasClass(cssClasses.ROOT)).thenReturn(false);

  const foundation = new MDCMenuFoundation(mockAdapter);
  assert.throws(() => foundation.init());
});

test('#init throws error when the necessary DOM is not present', () => {
  const mockAdapter = td.object(MDCMenuFoundation.defaultAdapter);
  td.when(mockAdapter.hasClass(cssClasses.ROOT)).thenReturn(true);
  td.when(mockAdapter.hasNecessaryDom()).thenReturn(false);

  const foundation = new MDCMenuFoundation(mockAdapter);
  assert.throws(() => foundation.init());
});

testFoundation('#open adds the animation class to start an animation',
  ({foundation, mockAdapter}) => {
    foundation.open();
    td.verify(mockAdapter.addClass(cssClasses.ANIMATING_OPEN), {times: 1});
  });

testFoundation('#open does not add the animation class to start an animation when setQuickOpen is false',
  ({foundation, mockAdapter}) => {
    foundation.setQuickOpen(true);
    foundation.open();
    td.verify(mockAdapter.addClass(cssClasses.ANIMATING_OPEN), {times: 0});
    td.verify(mockAdapter.removeClass(cssClasses.ANIMATING_OPEN), {times: 0});
  });

testFoundation('#open adds the open class to the menu', ({foundation, mockAdapter, mockRaf}) => {
  foundation.open();
  mockRaf.flush();
  mockRaf.flush();
  td.verify(mockAdapter.addClass(cssClasses.OPEN));
});

testFoundation('#open removes the animation class at the end of the animation',
  ({foundation, mockAdapter, mockRaf}) => {
    const clock = lolex.install();
    foundation.open();
    td.verify(mockAdapter.addClass(cssClasses.ANIMATING_OPEN));
    mockRaf.flush();
    td.verify(mockAdapter.addClass(cssClasses.OPEN));
    clock.tick(numbers.TRANSITION_OPEN_DURATION);
    mockRaf.flush();
    td.verify(mockAdapter.removeClass(cssClasses.ANIMATING_OPEN));
  });

testFoundation('#open focuses the menu after open.', ({foundation, mockAdapter, mockRaf}) => {
  foundation.open();
  mockRaf.flush();
  td.verify(mockAdapter.focus());
});

testFoundation('#open on a not focused menu does not focust at index 0', ({foundation, mockAdapter, mockRaf}) => {
  td.when(mockAdapter.isFocused()).thenReturn(true);

  foundation.open();
  mockRaf.flush();
  td.verify(mockAdapter.focusItemAtIndex(0), {times: 0});
});

/** Testing various layout cases for autopositioning */
testFoundation('#open from small anchor in center of viewport, default (TOP_START) anchor corner, RTL',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallCenter, true);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('right top'));
    td.verify(mockAdapter.setPosition({right: '0', top: '0'}));
  });

testFoundation('#open from small anchor in center of viewport, TOP_END anchor corner, RTL',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallCenter, true);
    foundation.setAnchorCorner(Corner.TOP_END);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('right top'));
    td.verify(mockAdapter.setPosition({right: '40px', top: '0'}));
  });

testFoundation('#open from small anchor in center of viewport, BOTTOM_START anchor corner, RTL',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallCenter, true);
    foundation.setAnchorCorner(Corner.BOTTOM_START);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('right top'));
    td.verify(mockAdapter.setPosition({right: '0', top: '20px'}));
  });

testFoundation('#open from small anchor in center of viewport, BOTTOM_END anchor corner, RTL',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallCenter, true);
    foundation.setAnchorCorner(Corner.BOTTOM_END);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('right top'));
    td.verify(mockAdapter.setPosition({right: '40px', top: '20px'}));
  });

testFoundation('#open from small anchor in top left of viewport, default (TOP_START) anchor corner, LTR',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallTopLeft);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: '0', top: '0'}));
  });

testFoundation('#open from small anchor in top left of viewport, TOP_END anchor corner, LTR',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallTopLeft);
    foundation.setAnchorCorner(Corner.TOP_END);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: '40px', top: '0'}));
  });

testFoundation('#open from small anchor in top left of viewport, BOTTOM_START anchor corner, LTR',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallTopLeft);
    foundation.setAnchorCorner(Corner.BOTTOM_START);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: '0', top: '20px'}));
  });

testFoundation('#open from small anchor in top left of viewport, BOTTOM_END anchor corner, LTR',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallTopLeft);
    foundation.setAnchorCorner(Corner.BOTTOM_END);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: '40px', top: '20px'}));
  });

testFoundation('#open from small anchor in right bottom of viewport, default (TOP_START) anchor corner, LTR',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallBottomRight);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('right bottom'));
    td.verify(mockAdapter.setPosition({right: '0', bottom: '0'}));
  });

testFoundation('#open from small anchor in right bottom of viewport, TOP_END anchor corner, LTR',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallBottomRight);
    foundation.setAnchorCorner(Corner.TOP_END);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('right bottom'));
    td.verify(mockAdapter.setPosition({right: '40px', bottom: '0'}));
  });

testFoundation('#open from small anchor in right bottom of viewport, BOTTOM_START anchor corner, LTR',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallBottomRight);
    foundation.setAnchorCorner(Corner.BOTTOM_START);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('right bottom'));
    td.verify(mockAdapter.setPosition({right: '0', bottom: '20px'}));
  });

testFoundation('#open from small anchor in right bottom of viewport, BOTTOM_END anchor corner, LTR',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallBottomRight);
    foundation.setAnchorCorner(Corner.BOTTOM_END);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('right bottom'));
    td.verify(mockAdapter.setPosition({right: '40px', bottom: '20px'}));
  });

testFoundation('#open from small anchor in left bottom of viewport, default (TOP_START) anchor corner, RTL',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallBottomLeft, true);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left bottom'));
    td.verify(mockAdapter.setPosition({left: '0', bottom: '0'}));
  });

testFoundation('#open from small anchor in left bottom of viewport, TOP_END anchor corner, RTL',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallBottomLeft, true);
    foundation.setAnchorCorner(Corner.TOP_END);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left bottom'));
    td.verify(mockAdapter.setPosition({left: '40px', bottom: '0'}));
  });

testFoundation('#open from small anchor in left bottom of viewport, BOTTOM_START anchor corner, RTL',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallBottomLeft, true);
    foundation.setAnchorCorner(Corner.BOTTOM_START);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left bottom'));
    td.verify(mockAdapter.setPosition({left: '0', bottom: '20px'}));
  });

testFoundation('#open from small anchor in left bottom of viewport, BOTTOM_END anchor corner, RTL',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallBottomLeft, true);
    foundation.setAnchorCorner(Corner.BOTTOM_END);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left bottom'));
    td.verify(mockAdapter.setPosition({left: '40px', bottom: '20px'}));
  });

testFoundation('#open tall menu from small anchor in left above middle of viewport, BOTTOM_START anchor corner, LTR',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallAboveMiddleLeft, false, 700);
    foundation.setAnchorCorner(Corner.BOTTOM_START);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: '0', top: '20px'}));
    td.verify(mockAdapter.setMaxHeight('580px'));
  });

testFoundation('#open tall menu from small anchor in left above middle of viewport, TOP_START anchor corner, LTR',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallAboveMiddleLeft, false, 700);
    foundation.setAnchorCorner(Corner.TOP_START);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left 14.29%'));
    td.verify(mockAdapter.setPosition({left: '0', top: '-100px'}));
  });

testFoundation('#open tall menu from small anchor in left below middle of viewport, BOTTOM_START anchor corner, LTR',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallBelowMiddleLeft, false, 700);
    foundation.setAnchorCorner(Corner.BOTTOM_START);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left bottom'));
    td.verify(mockAdapter.setPosition({left: '0', bottom: '20px'}));
    td.verify(mockAdapter.setMaxHeight('600px'));
  });

testFoundation('#open tall menu from small anchor in left above middle of viewport, TOP_START anchor corner, LTR',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallBelowMiddleLeft, false, 700);
    foundation.setAnchorCorner(Corner.TOP_START);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left 88.57%'));
    td.verify(mockAdapter.setPosition({left: '0', bottom: '-80px'}));
  });

testFoundation('#open from wide anchor center of viewport, TOP_START anchor corner, LTR',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, wideCenter);
    foundation.setAnchorCorner(Corner.TOP_START);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('center top'));
    td.verify(mockAdapter.setPosition({left: '0', top: '0'}));
  });

testFoundation('#open from wide anchor center of viewport, TOP_END anchor corner, LTR',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, wideCenter);
    foundation.setAnchorCorner(Corner.TOP_END);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('center top'));
    td.verify(mockAdapter.setPosition({left: '150px', top: '0'}));
  });

testFoundation('#open from wide anchor center of viewport, BOTTOM_START anchor corner, RTL',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, wideCenter, true);
    foundation.setAnchorCorner(Corner.BOTTOM_START);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('center top'));
    td.verify(mockAdapter.setPosition({right: '0', top: '20px'}));
  });

testFoundation('#open from wide anchor center of viewport, BOTTOM_END anchor corner, RTL',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, wideCenter, true);
    foundation.setAnchorCorner(Corner.BOTTOM_END);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('center top'));
    td.verify(mockAdapter.setPosition({right: '150px', top: '20px'}));
  });

testFoundation('#open from wide anchor top left of viewport, TOP_END anchor corner, RTL',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, wideTopLeft, true);
    foundation.setAnchorCorner(Corner.TOP_END);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('center top'));
    td.verify(mockAdapter.setPosition({left: '150px', top: '0'}));
  });

testFoundation('#open anchors the menu to the bottom left in LTR when not close to the bottom edge with margin',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallTopLeft);
    foundation.setAnchorCorner(Corner.BOTTOM_START);
    foundation.setAnchorMargin({left: 7, bottom: 10});
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: '7px', top: '30px'}));
  });

testFoundation('#open anchors the menu to the bottom left in LTR when close to the bottom edge with margin',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallBottomLeft);
    foundation.setAnchorCorner(Corner.BOTTOM_START);
    foundation.setAnchorMargin({top: 5, left: 7, bottom: 10});
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left bottom'));
    td.verify(mockAdapter.setPosition({left: '7px', bottom: '15px'}));
  });

testFoundation('#open anchors the menu to the bottom left in RTL when close to the bottom and right edge with margin',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallBottomRight, true);
    foundation.setAnchorCorner(Corner.BOTTOM_START);
    foundation.setAnchorMargin({top: 5, bottom: 10, right: 7});
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('right bottom'));
    td.verify(mockAdapter.setPosition({right: '7px', bottom: '15px'}));
  });

testFoundation('opening menu should automatically select the last selected item if rememberSelection is true',
  ({foundation, mockAdapter, mockRaf}) => {
    const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
    const clock = lolex.install();
    const target = {};
    const expectedIndex = 2;
    td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(expectedIndex);
    td.when(mockAdapter.getNumberOfItems()).thenReturn(3);

    foundation.init();
    foundation.setRememberSelection(true);
    handlers.click({target});

    clock.tick(numbers.SELECTED_TRIGGER_DELAY);
    foundation.open();
    mockRaf.flush();

    td.verify(mockAdapter.focusItemAtIndex(expectedIndex), {times: 1});

    clock.uninstall();
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

testFoundation('#close adds the animation class to start an animation', ({foundation, mockAdapter}) => {
  foundation.close();
  td.verify(mockAdapter.addClass(cssClasses.ANIMATING_CLOSED));
});

testFoundation('#close does not add animation class if quickOpen is set to true', ({foundation, mockAdapter}) => {
  foundation.setQuickOpen(true);
  foundation.close();
  td.verify(mockAdapter.addClass(cssClasses.ANIMATING_CLOSED), {times: 0});
  td.verify(mockAdapter.removeClass(cssClasses.ANIMATING_CLOSED), {times: 0});
});

testFoundation('#close removes the open class from the menu', ({foundation, mockAdapter, mockRaf}) => {
  foundation.close();
  mockRaf.flush();
  mockRaf.flush();
  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
});

testFoundation('#close removes the animation class at the end of the animation',
  ({foundation, mockAdapter, mockRaf}) => {
    const clock = lolex.install();
    foundation.close();
    mockRaf.flush();
    mockRaf.flush();
    td.verify(mockAdapter.addClass(cssClasses.ANIMATING_CLOSED));
    clock.tick(numbers.TRANSITION_OPEN_DURATION);
    mockRaf.flush();
    td.verify(mockAdapter.removeClass(cssClasses.ANIMATING_CLOSED));
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
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(true);

  foundation.init();
  assert.isOk(foundation.isOpen());
});

test('#isOpen returns false when the menu is initiated without the open class present', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(false);

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
  const preventDefault = td.func('event.preventDefault');
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(expectedIndex);

  foundation.init();
  handlers.keydown({target, key: 'Space', ctrlKey: true, preventDefault});
  handlers.keyup({target, key: 'Space', ctrlKey: true});
  td.verify(mockAdapter.notifySelected({index: expectedIndex}), {times: 0});
});

test('on spacebar keyup notifies user of selection after allowing time for selection UX to run', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const target = {};
  const expectedIndex = 2;
  const preventDefault = td.func('event.preventDefault');
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(expectedIndex);

  foundation.init();
  handlers.keydown({target, key: 'Space', preventDefault});
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
  const preventDefault = td.func('event.preventDefault');
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(0);

  foundation.init();
  handlers.keydown({target, key: 'Space', preventDefault});
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
  const preventDefault = td.func('event.preventDefault');
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(-1);

  foundation.init();
  handlers.keydown({target, key: 'Space', preventDefault});
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
  const preventDefault = td.func('event.preventDefault');
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(0, 1);

  foundation.init();
  handlers.keydown({target, key: 'Space', preventDefault});
  handlers.keyup({target, key: 'Space'});
  handlers.keydown({target, key: 'Space', preventDefault});
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
  const preventDefault = td.func('event.preventDefault');
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(0);

  foundation.init();
  handlers.keydown({target, keyCode: 32, preventDefault});
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
  handlers.keydown({target, key: 'Enter'});
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
  handlers.keydown({target, key: 'Enter'});
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
  handlers.keydown({target, key: 'Enter'});
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
  handlers.keydown({target, key: 'Enter'});
  handlers.keyup({target, key: 'Enter'});
  handlers.keydown({target, key: 'Enter'});
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
  handlers.keydown({target, keyCode: 13});
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
  handlers.keyup({target, key: 'Space', preventDefault});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  raf.flush();
  td.verify(preventDefault());

  raf.restore();
  clock.uninstall();
});

test('on document click cancels and closes the menu', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockRaf = createMockRaf();
  const mockEvt = {
    target: {},
  };
  let documentClickHandler;
  td.when(mockAdapter.registerBodyClickHandler(td.matchers.isA(Function))).thenDo((handler) => {
    documentClickHandler = handler;
  });
  td.when(mockAdapter.getIndexForEventTarget(td.matchers.anything())).thenReturn(-1);

  td.when(mockAdapter.hasClass(MDCMenuFoundation.cssClasses.OPEN)).thenReturn(true);

  foundation.init();
  foundation.open();
  mockRaf.flush();

  documentClickHandler(mockEvt);
  mockRaf.flush();

  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
  td.verify(mockAdapter.notifyCancel());

  mockRaf.restore();
});

test('on menu item click does not emit cancel', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockRaf = createMockRaf();
  const mockEvt = {
    target: {},
  };
  let documentClickHandler;
  td.when(mockAdapter.registerBodyClickHandler(td.matchers.isA(Function))).thenDo((handler) => {
    documentClickHandler = handler;
  });
  td.when(mockAdapter.getIndexForEventTarget(td.matchers.anything())).thenReturn(0);

  foundation.init();
  foundation.open();
  mockRaf.flush();

  documentClickHandler(mockEvt);
  mockRaf.flush();

  td.verify(mockAdapter.notifyCancel(), {times: 0});

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
    mockAdapter.setPosition(td.matchers.anything()),
    {times: 0}
  );
});

test('should remember selected elements between menu openings', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const target = {};
  const expectedIndex = 2;
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(expectedIndex);
  td.when(mockAdapter.getNumberOfItems()).thenReturn(3);

  foundation.init();
  foundation.setRememberSelection(true);
  handlers.click({target});

  clock.tick(numbers.SELECTED_TRIGGER_DELAY);

  td.verify(mockAdapter.addClassForOptionAtIndex(expectedIndex, td.matchers.anything()),
    {times: 1});

  clock.uninstall();
});

test('should not remember selected elements between menu openings', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const target = {};
  const expectedIndex = 2;
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(expectedIndex);
  td.when(mockAdapter.getNumberOfItems()).thenReturn(3);

  foundation.init();
  handlers.click({target});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);

  td.verify(mockAdapter.addClassForOptionAtIndex(expectedIndex, td.matchers.anything()),
    {times: 0});

  clock.uninstall();
});

test('should remove previously selected elements when new elements are selected', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const target = {};
  const expectedIndex = 2;
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(expectedIndex);
  td.when(mockAdapter.getNumberOfItems()).thenReturn(3);

  foundation.init();
  foundation.setRememberSelection(true);
  handlers.click({target});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);

  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(expectedIndex - 1);

  handlers.click({target});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);

  td.verify(mockAdapter.rmClassForOptionAtIndex(expectedIndex, td.matchers.anything()),
    {times: 1});

  clock.uninstall();
});

test('should do nothing when the same item is selected twice in a row', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const target = {};
  const expectedIndex = 2;
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(expectedIndex);
  td.when(mockAdapter.getNumberOfItems()).thenReturn(3);

  foundation.init();
  foundation.setRememberSelection(true);
  handlers.click({target});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);

  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(expectedIndex);

  handlers.click({target});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);

  td.verify(mockAdapter.rmClassForOptionAtIndex(expectedIndex, td.matchers.anything()),
    {times: 0});
  td.verify(mockAdapter.addClassForOptionAtIndex(expectedIndex, td.matchers.anything()),
    {times: 1});

  clock.uninstall();
});

test('getSelectedIndex should return the last selected index', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const target = {};
  const expectedIndex = 2;
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(expectedIndex);
  td.when(mockAdapter.getNumberOfItems()).thenReturn(3);

  foundation.init();
  foundation.setRememberSelection(true);
  handlers.click({target});

  clock.tick(numbers.SELECTED_TRIGGER_DELAY);

  assert.isOk(foundation.getSelectedIndex() === expectedIndex);
  clock.uninstall();
});

test('getSelectedValue should return the last selected item', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const target = {};
  const expectedIndex = 2;
  td.when(mockAdapter.getIndexForEventTarget(target)).thenReturn(expectedIndex);
  td.when(mockAdapter.getNumberOfItems()).thenReturn(3);

  foundation.init();
  foundation.setRememberSelection(true);
  handlers.click({target});

  clock.tick(numbers.SELECTED_TRIGGER_DELAY);

  assert.isTrue(foundation.getSelectedIndex() === expectedIndex);
  clock.uninstall();
});
