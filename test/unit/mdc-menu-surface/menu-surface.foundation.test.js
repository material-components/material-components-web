/**
 * @license
 * Copyright 2018 Google Inc. All Rights Reserved.
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
import {MDCMenuSurfaceFoundation} from '../../../packages/mdc-menu-surface/foundation';
import {cssClasses, strings, numbers, MenuSurfaceCorner} from '../../../packages/mdc-menu-surface/constants';

function setupTest() {
  const {foundation, mockAdapter} = setupFoundationTest(MDCMenuSurfaceFoundation);
  const size = {width: 500, height: 200};
  td.when(mockAdapter.hasClass(cssClasses.ROOT)).thenReturn(true);
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(false);

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
 * Initializes viewport, anchor and menu surface dimensions. Viewport is 1000x1000. Default surface size is 100x200.
 * @param {Object} mockAdapter Mock double for the adapter.
 * @param {{height:number, width: number, top: number, bottom: number, left: number, right: number}} anchorDimensions
 *   Approximate viewport corner where anchor is located.
 * @param {boolean=} isRtl Indicates whether layout is RTL.
 * @param {number=} menuSurfaceHeight Optional height of the menu surface.
 * @param {{x: number, y: number}} scrollValue Optional scroll values of the page.
 */
function initAnchorLayout(mockAdapter, anchorDimensions, isRtl = false,
  menuSurfaceHeight = 200, scrollValue = {x: 0, y: 0}) {
  td.when(mockAdapter.hasAnchor()).thenReturn(true);
  td.when(mockAdapter.getWindowDimensions()).thenReturn({height: 1000, width: 1000});
  td.when(mockAdapter.getAnchorDimensions()).thenReturn(anchorDimensions);
  td.when(mockAdapter.isRtl()).thenReturn(isRtl);
  td.when(mockAdapter.getInnerDimensions()).thenReturn({height: menuSurfaceHeight, width: 100});
  td.when(mockAdapter.getBodyDimensions()).thenReturn({height: 1000, width: 1000});
  td.when(mockAdapter.getWindowScroll()).thenReturn(scrollValue);
}

function testFoundation(desc, runTests) {
  test(desc, () => {
    const {mockAdapter, foundation} = setupTest();
    const mockRaf = createMockRaf();
    runTests({mockAdapter, foundation, mockRaf});
    mockRaf.restore();
  });
}

suite('MDCMenuSurfaceFoundation');

test('exports strings', () => {
  assert.deepEqual(MDCMenuSurfaceFoundation.strings, strings);
});

test('exports cssClasses', () => {
  assert.deepEqual(MDCMenuSurfaceFoundation.cssClasses, cssClasses);
});

test('exports numbers', () => {
  assert.deepEqual(MDCMenuSurfaceFoundation.numbers, numbers);
});

test('exports MenuSurfaceCorner', () => {
  assert.deepEqual(MDCMenuSurfaceFoundation.MenuSurfaceCorner, MenuSurfaceCorner);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCMenuSurfaceFoundation, [
    'addClass', 'removeClass', 'hasClass', 'hasAnchor', 'registerInteractionHandler', 'deregisterInteractionHandler',
    'registerBodyClickHandler', 'deregisterBodyClickHandler', 'notifyClose', 'isElementInContainer', 'isRtl',
    'setTransformOrigin', 'isFocused', 'saveFocus', 'restoreFocus', 'isFirstElementFocused', 'isLastElementFocused',
    'focusFirstElement', 'focusLastElement', 'getInnerDimensions', 'getAnchorDimensions', 'getWindowDimensions',
    'getBodyDimensions', 'getWindowScroll', 'setPosition', 'setMaxHeight',
  ]);
});

test('#init throws error when the root class is not present', () => {
  const mockAdapter = td.object(MDCMenuSurfaceFoundation.defaultAdapter);
  td.when(mockAdapter.hasClass(cssClasses.ROOT)).thenReturn(false);

  const foundation = new MDCMenuSurfaceFoundation(mockAdapter);
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

testFoundation('#open adds the open class to the menu surface', ({foundation, mockAdapter, mockRaf}) => {
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
    foundation.setAnchorCorner(MenuSurfaceCorner.TOP_END);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('right top'));
    td.verify(mockAdapter.setPosition({right: '40px', top: '0'}));
  });

testFoundation('#open from small anchor in center of viewport, BOTTOM_START anchor corner, RTL',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallCenter, true);
    foundation.setAnchorCorner(MenuSurfaceCorner.BOTTOM_START);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('right top'));
    td.verify(mockAdapter.setPosition({right: '0', top: '20px'}));
  });

testFoundation('#open from small anchor in center of viewport, BOTTOM_END anchor corner, RTL',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallCenter, true);
    foundation.setAnchorCorner(MenuSurfaceCorner.BOTTOM_END);
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
    foundation.setAnchorCorner(MenuSurfaceCorner.TOP_END);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: '40px', top: '0'}));
  });

testFoundation('#open from small anchor in top left of viewport, BOTTOM_START anchor corner, LTR',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallTopLeft);
    foundation.setAnchorCorner(MenuSurfaceCorner.BOTTOM_START);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: '0', top: '20px'}));
  });

testFoundation('#open from small anchor in top left of viewport, BOTTOM_END anchor corner, LTR',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallTopLeft);
    foundation.setAnchorCorner(MenuSurfaceCorner.BOTTOM_END);
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
    foundation.setAnchorCorner(MenuSurfaceCorner.TOP_END);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('right bottom'));
    td.verify(mockAdapter.setPosition({right: '40px', bottom: '0'}));
  });

testFoundation('#open from small anchor in right bottom of viewport, BOTTOM_START anchor corner, LTR',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallBottomRight);
    foundation.setAnchorCorner(MenuSurfaceCorner.BOTTOM_START);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('right bottom'));
    td.verify(mockAdapter.setPosition({right: '0', bottom: '20px'}));
  });

testFoundation('#open from small anchor in right bottom of viewport, BOTTOM_END anchor corner, LTR',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallBottomRight);
    foundation.setAnchorCorner(MenuSurfaceCorner.BOTTOM_END);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('right bottom'));
    td.verify(mockAdapter.setPosition({right: '40px', bottom: '20px'}));
  });

testFoundation('#open from small anchor in top right of viewport, fixed position, no scroll',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallTopLeft, true);
    foundation.setFixedPosition(true);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: '20px', top: '20px'}));
  });

testFoundation('#open from small anchor in top right of viewport, absolute position, no scroll',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallTopLeft, true);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: '0', top: '0'}));
  });

testFoundation('#open from anchor in top right of viewport, absolute position, hoisted menu surface, no scroll',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallTopLeft, true);
    foundation.setIsHoisted(true);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: '20px', top: '20px'}));
  });


testFoundation('#open from small anchor in top right of viewport, fixed position, scrollY 10 px',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallTopLeft, true, 200, {x: 0, y: 10});
    foundation.setFixedPosition(true);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: '20px', top: '20px'}));
  });

testFoundation('#open from small anchor in top right of viewport, absolute position, scrollY 10 px',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallTopLeft, true, 200, {x: 0, y: 10});
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: '0', top: '0'}));
  });

testFoundation('#open from anchor in top right of viewport, absolute position, hoisted menu surface, scrollY 10 px',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallTopLeft, true, 200, {x: 0, y: 10});
    foundation.setIsHoisted(true);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: '20px', top: '30px'}));
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
    foundation.setAnchorCorner(MenuSurfaceCorner.TOP_END);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left bottom'));
    td.verify(mockAdapter.setPosition({left: '40px', bottom: '0'}));
  });

testFoundation('#open from small anchor in left bottom of viewport, BOTTOM_START anchor corner, RTL',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallBottomLeft, true);
    foundation.setAnchorCorner(MenuSurfaceCorner.BOTTOM_START);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left bottom'));
    td.verify(mockAdapter.setPosition({left: '0', bottom: '20px'}));
  });

testFoundation('#open from small anchor in left bottom of viewport, BOTTOM_END anchor corner, RTL',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallBottomLeft, true);
    foundation.setAnchorCorner(MenuSurfaceCorner.BOTTOM_END);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left bottom'));
    td.verify(mockAdapter.setPosition({left: '40px', bottom: '20px'}));
  });

testFoundation('#open tall surface from small anchor in left above middle of viewport, BOTTOM_START anchor corner, LTR',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallAboveMiddleLeft, false, 700);
    foundation.setAnchorCorner(MenuSurfaceCorner.BOTTOM_START);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: '0', top: '20px'}));
    td.verify(mockAdapter.setMaxHeight('548px'));
  });

testFoundation('#open tall surface from small anchor in left below middle of viewport, BOTTOM_START anchor corner, LTR',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallBelowMiddleLeft, false, 700);
    foundation.setAnchorCorner(MenuSurfaceCorner.BOTTOM_START);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left bottom'));
    td.verify(mockAdapter.setPosition({left: '0', bottom: '20px'}));
    td.verify(mockAdapter.setMaxHeight('568px'));
  });

testFoundation('#open from wide anchor center of viewport, TOP_START anchor corner, LTR',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, wideCenter);
    foundation.setAnchorCorner(MenuSurfaceCorner.TOP_START);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('center top'));
    td.verify(mockAdapter.setPosition({left: '0', top: '0'}));
  });

testFoundation('#open from wide anchor center of viewport, TOP_END anchor corner, LTR',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, wideCenter);
    foundation.setAnchorCorner(MenuSurfaceCorner.TOP_END);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('center top'));
    td.verify(mockAdapter.setPosition({left: '150px', top: '0'}));
  });

testFoundation('#open from wide anchor center of viewport, BOTTOM_START anchor corner, RTL',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, wideCenter, true);
    foundation.setAnchorCorner(MenuSurfaceCorner.BOTTOM_START);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('center top'));
    td.verify(mockAdapter.setPosition({right: '0', top: '20px'}));
  });

testFoundation('#open from wide anchor center of viewport, BOTTOM_END anchor corner, RTL',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, wideCenter, true);
    foundation.setAnchorCorner(MenuSurfaceCorner.BOTTOM_END);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('center top'));
    td.verify(mockAdapter.setPosition({right: '150px', top: '20px'}));
  });

testFoundation('#open from wide anchor top left of viewport, TOP_END anchor corner, RTL',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, wideTopLeft, true);
    foundation.setAnchorCorner(MenuSurfaceCorner.TOP_END);
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('center top'));
    td.verify(mockAdapter.setPosition({left: '150px', top: '0'}));
  });

testFoundation('#open anchors the surface to the bottom left in LTR when not close to the bottom edge with margin',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallTopLeft);
    foundation.setAnchorCorner(MenuSurfaceCorner.BOTTOM_START);
    foundation.setAnchorMargin({left: 7, bottom: 10});
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: '7px', top: '30px'}));
  });

testFoundation('#open anchors the surface to the bottom left in LTR when close to the bottom edge with margin',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallBottomLeft);
    foundation.setAnchorCorner(MenuSurfaceCorner.BOTTOM_START);
    foundation.setAnchorMargin({top: 5, left: 7, bottom: 10});
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('left bottom'));
    td.verify(mockAdapter.setPosition({left: '7px', bottom: '15px'}));
  });

testFoundation('#open anchors the surface to the bottom left in RTL when close to the bottom & right edge with margin',
  ({foundation, mockAdapter, mockRaf}) => {
    initAnchorLayout(mockAdapter, smallBottomRight, true);
    foundation.setAnchorCorner(MenuSurfaceCorner.BOTTOM_START);
    foundation.setAnchorMargin({top: 5, bottom: 10, right: 7});
    foundation.open();
    mockRaf.flush();
    td.verify(mockAdapter.setTransformOrigin('right bottom'));
    td.verify(mockAdapter.setPosition({right: '7px', bottom: '15px'}));
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

testFoundation('#close removes the open class from the menu surface', ({foundation, mockAdapter, mockRaf}) => {
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
    clock.tick(numbers.TRANSITION_CLOSE_DURATION);
    mockRaf.flush();
    td.verify(mockAdapter.removeClass(cssClasses.ANIMATING_CLOSED));
    td.verify(mockAdapter.notifyClose());
  });

testFoundation('#close emits the close event at the end of the animation',
  ({foundation, mockAdapter, mockRaf}) => {
    const clock = lolex.install();
    foundation.close();
    mockRaf.flush();
    mockRaf.flush();
    clock.tick(numbers.TRANSITION_CLOSE_DURATION);
    mockRaf.flush();
    td.verify(mockAdapter.notifyClose());
  });

test('#isOpen returns true when the menu surface is open', () => {
  const {foundation} = setupTest();

  foundation.open();
  assert.isOk(foundation.isOpen());
});

test('#isOpen returns false when the menu surface is closed', () => {
  const {foundation} = setupTest();

  foundation.close();
  assert.isNotOk(foundation.isOpen());
});

test('#isOpen returns true when the menu surface is initiated with the open class present', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(true);

  foundation.init();
  assert.isOk(foundation.isOpen());
});

test('#isOpen returns false when the menu surface is initiated without the open class present', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(false);

  foundation.init();
  assert.isNotOk(foundation.isOpen());
});

test('on escape keydown closes the menu surface and sends close event', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const raf = createMockRaf();
  const target = {};

  foundation.init();
  handlers.keydown({target, key: 'Escape'});
  raf.flush();
  clock.tick(numbers.TRANSITION_CLOSE_DURATION);
  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
  td.verify(mockAdapter.notifyClose());

  raf.restore();
  clock.uninstall();
});


test('on Tab keydown on the last element, it moves to the first', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const raf = createMockRaf();
  const target = {};
  td.when(mockAdapter.isLastElementFocused()).thenReturn(true);

  foundation.init();
  handlers.keydown({target, key: 'Tab', preventDefault: () => {}});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  raf.flush();
  td.verify(mockAdapter.focusFirstElement());

  raf.restore();
  clock.uninstall();
});

test('on Shift+Tab keydown on the first element, it moves to the last', () => {
  const {foundation, mockAdapter} = setupTest();
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const clock = lolex.install();
  const raf = createMockRaf();
  const target = {};
  td.when(mockAdapter.isFirstElementFocused()).thenReturn(true);

  foundation.init();
  handlers.keydown({target, key: 'Tab', shiftKey: true, preventDefault: () => {}});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  raf.flush();
  td.verify(mockAdapter.focusLastElement(), {times: 1});

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

  foundation.init();
  handlers.keydown({target, key: 'Foo', preventDefault});
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  raf.flush();
  td.verify(preventDefault(), {times: 0});

  raf.restore();
  clock.uninstall();
});

test('on document click closes the menu surface', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockRaf = createMockRaf();

  const mockEvt = {
    target: {},
  };
  const clock = lolex.install();
  let documentClickHandler;
  td.when(mockAdapter.registerBodyClickHandler(td.matchers.isA(Function))).thenDo((handler) => {
    documentClickHandler = handler;
  });

  td.when(mockAdapter.hasClass(MDCMenuSurfaceFoundation.cssClasses.OPEN)).thenReturn(true);
  td.when(mockAdapter.isElementInContainer(td.matchers.anything())).thenReturn(false);

  foundation.init();
  foundation.open();
  clock.tick(numbers.TRANSITION_OPEN_DURATION);
  mockRaf.flush();

  documentClickHandler(mockEvt);
  mockRaf.flush();

  td.verify(mockAdapter.removeClass(cssClasses.OPEN));

  clock.uninstall();
  mockRaf.restore();
});

test('on menu surface click does not emit close', () => {
  const {foundation, mockAdapter} = setupTest();
  const mockRaf = createMockRaf();
  const mockEvt = {
    target: {},
  };
  let documentClickHandler;
  td.when(mockAdapter.registerBodyClickHandler(td.matchers.isA(Function))).thenDo((handler) => {
    documentClickHandler = handler;
  });
  td.when(mockAdapter.isElementInContainer(td.matchers.anything())).thenReturn(true);

  foundation.init();
  foundation.open();
  mockRaf.flush();

  documentClickHandler(mockEvt);
  mockRaf.flush();

  td.verify(mockAdapter.notifyClose(), {times: 0});

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
