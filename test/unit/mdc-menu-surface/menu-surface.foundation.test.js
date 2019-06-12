/**
 * @license
 * Copyright 2018 Google Inc.
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
import {verifyDefaultAdapter} from '../helpers/foundation';
import {setupFoundationTest} from '../helpers/setup';
import {install as installClock} from '../helpers/clock';
import {MDCMenuSurfaceFoundation} from '../../../packages/mdc-menu-surface/foundation';
import {cssClasses, strings, numbers, Corner} from '../../../packages/mdc-menu-surface/constants';

/**
 * @return {{mockAdapter: !MDCMenuSurfaceAdapter, foundation: !MDCMenuSurfaceFoundation}}
 */
function setupTest() {
  const {foundation, mockAdapter} = setupFoundationTest(MDCMenuSurfaceFoundation);
  const size = {width: 500, height: 200};
  td.when(mockAdapter.hasClass(cssClasses.ROOT)).thenReturn(true);
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(false);
  td.when(mockAdapter.getWindowDimensions()).thenReturn({width: window.innerWidth, height: window.innerHeight});

  td.when(mockAdapter.getInnerDimensions()).thenReturn(size);

  return {foundation, mockAdapter};
}

// Various anchor dimensions.
const smallTopLeft = {height: 20, width: 40, top: 20, bottom: 40, left: 20, right: 60};
const smallTopRight = {height: 20, width: 40, top: 20, bottom: 40, left: 920, right: 960};
const smallBottomLeft = {height: 20, width: 40, top: 920, bottom: 940, left: 20, right: 60};
const smallBottomRight = {height: 20, width: 40, top: 920, bottom: 940, left: 920, right: 960};
const smallCenter = {height: 20, width: 40, top: 490, bottom: 510, left: 480, right: 520};
const smallAboveMiddleLeft = {height: 20, width: 40, top: 400, bottom: 420, left: 20, right: 60};
const smallBelowMiddleLeft = {height: 20, width: 40, top: 600, bottom: 620, left: 20, right: 60};
const wideCenter = {height: 20, width: 150, top: 490, bottom: 510, left: 450, right: 600};
const wideTopLeft = {height: 20, width: 150, top: 20, bottom: 40, left: 20, right: 170};

/**
 * Initializes viewport, anchor and menu surface dimensions. Viewport is 1000x1000. Default surface size is 100x200.
 * @param {!MDCMenuSurfaceAdapter} mockAdapter Mock double for the adapter.
 * @param {!ClientRect} anchorDimensions Approximate viewport corner where anchor is located.
 * @param {boolean=} isRtl Indicates whether layout is RTL.
 * @param {number=} menuSurfaceHeight Optional height of the menu surface.
 * @param {!MDCMenuPoint=} scrollValue Optional scroll values of the page.
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

/**
 * @param {string} desc
 * @param {function({
 *   mockAdapter: !MDCMenuSurfaceAdapter,
 *   foundation: !MDCMenuSurfaceFoundation,
 *   clock: {runToFrame: function(), tick: function(ms: number)},
 * })} runTests
 */
function testFoundation(desc, runTests) {
  test(desc, () => {
    const {mockAdapter, foundation} = setupTest();
    const clock = installClock();
    runTests({mockAdapter, foundation, clock});
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

test('exports Corner', () => {
  assert.deepEqual(MDCMenuSurfaceFoundation.Corner, Corner);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCMenuSurfaceFoundation, [
    'addClass', 'removeClass', 'hasClass', 'hasAnchor', 'notifyClose', 'notifyOpen', 'isElementInContainer',
    'isRtl', 'setTransformOrigin', 'isFocused', 'saveFocus', 'restoreFocus', 'getInnerDimensions',
    'getAnchorDimensions', 'getWindowDimensions', 'getBodyDimensions', 'getWindowScroll', 'setPosition',
    'setMaxHeight',
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

testFoundation('#open does not add the animation class to start an animation when setQuickOpen is true',
  ({foundation, mockAdapter}) => {
    foundation.setQuickOpen(true);
    foundation.open();
    td.verify(mockAdapter.addClass(cssClasses.ANIMATING_OPEN), {times: 0});
    td.verify(mockAdapter.removeClass(cssClasses.ANIMATING_OPEN), {times: 0});
  });

testFoundation('#open adds the open class to the menu surface', ({foundation, mockAdapter, clock}) => {
  foundation.open();
  clock.runToFrame();
  clock.runToFrame();
  td.verify(mockAdapter.addClass(cssClasses.OPEN));
});

testFoundation('#open removes the animation class at the end of the animation',
  ({foundation, mockAdapter, clock}) => {
    foundation.open();
    td.verify(mockAdapter.addClass(cssClasses.ANIMATING_OPEN));
    clock.runToFrame();
    td.verify(mockAdapter.addClass(cssClasses.OPEN));
    clock.tick(numbers.TRANSITION_OPEN_DURATION);
    clock.runToFrame();
    td.verify(mockAdapter.removeClass(cssClasses.ANIMATING_OPEN));
  });

testFoundation('#open emits the open event at the end of the animation', ({foundation, mockAdapter, clock}) => {
  foundation.open();
  clock.runToFrame();
  clock.runToFrame();
  clock.tick(numbers.TRANSITION_OPEN_DURATION);
  clock.runToFrame();
  td.verify(mockAdapter.notifyOpen());
});

testFoundation('#open emits the open event when setQuickOpen is true', ({foundation, mockAdapter, clock}) => {
  foundation.setQuickOpen(true);
  foundation.open();
  clock.runToFrame();
  clock.runToFrame();
  td.verify(mockAdapter.notifyOpen());
});

/** Testing various layout cases for autopositioning */
testFoundation('#open from small anchor in center of viewport, default (TOP_START) anchor corner, RTL',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallCenter, true);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('right top'));
    td.verify(mockAdapter.setPosition({right: 0, top: 0}));
  });

testFoundation('#open from small anchor in center of viewport, TOP_END anchor corner, RTL',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallCenter, true);
    foundation.setAnchorCorner(Corner.TOP_END);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('right top'));
    td.verify(mockAdapter.setPosition({right: 40, top: 0}));
  });

testFoundation('#open from small anchor in center of viewport, BOTTOM_START anchor corner, RTL',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallCenter, true);
    foundation.setAnchorCorner(Corner.BOTTOM_START);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('right top'));
    td.verify(mockAdapter.setPosition({right: 0, top: 20}));
  });

testFoundation('#open from small anchor in center of viewport, BOTTOM_END anchor corner, RTL',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallCenter, true);
    foundation.setAnchorCorner(Corner.BOTTOM_END);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('right top'));
    td.verify(mockAdapter.setPosition({right: 40, top: 20}));
  });

testFoundation('#open from small anchor in top left of viewport, default (TOP_START) anchor corner, LTR',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallTopLeft);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: 0, top: 0}));
  });

testFoundation('#open from small anchor in top left of viewport, TOP_END anchor corner, LTR',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallTopLeft);
    foundation.setAnchorCorner(Corner.TOP_END);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: 40, top: 0}));
  });

testFoundation('#open from small anchor in top left of viewport, BOTTOM_START anchor corner, LTR',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallTopLeft);
    foundation.setAnchorCorner(Corner.BOTTOM_START);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: 0, top: 20}));
  });

testFoundation('#open from small anchor in top left of viewport, BOTTOM_END anchor corner, LTR',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallTopLeft);
    foundation.setAnchorCorner(Corner.BOTTOM_END);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: 40, top: 20}));
  });

testFoundation('#open from small anchor in right bottom of viewport, default (TOP_START) anchor corner, LTR',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallBottomRight);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('right bottom'));
    td.verify(mockAdapter.setPosition({right: 0, bottom: 0}));
  });

testFoundation('#open from small anchor in right bottom of viewport, TOP_END anchor corner, LTR',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallBottomRight);
    foundation.setAnchorCorner(Corner.TOP_END);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('right bottom'));
    td.verify(mockAdapter.setPosition({right: 40, bottom: 0}));
  });

testFoundation('#open from small anchor in right bottom of viewport, BOTTOM_START anchor corner, LTR',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallBottomRight);
    foundation.setAnchorCorner(Corner.BOTTOM_START);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('right bottom'));
    td.verify(mockAdapter.setPosition({right: 0, bottom: 20}));
  });

testFoundation('#open from small anchor in right bottom of viewport, BOTTOM_END anchor corner, LTR',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallBottomRight);
    foundation.setAnchorCorner(Corner.BOTTOM_END);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('right bottom'));
    td.verify(mockAdapter.setPosition({right: 40, bottom: 20}));
  });

testFoundation('#open from small anchor in top left of viewport, fixed position, no scroll',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallTopLeft, true);
    foundation.setFixedPosition(true);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: 20, top: 20}));
  });

testFoundation('#open from small anchor in top left of viewport, absolute position, no scroll',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallTopLeft, true);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: 0, top: 0}));
  });

testFoundation('#open from anchor in top left of viewport, absolute position, hoisted menu surface, no scroll',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallTopLeft, true);
    foundation.setIsHoisted(true);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: 20, top: 20}));
  });

testFoundation('#open from small anchor in top left of viewport, fixed position, scrollX/scrollY 5px/10px',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallTopLeft, true, 200, {x: 5, y: 10});
    foundation.setFixedPosition(true);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: 20, top: 20}));
  });

testFoundation('#open from small anchor in top left of viewport, absolute position, scrollX/scrollY 5px/10px',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallTopLeft, true, 200, {x: 5, y: 10});
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: 0, top: 0}));
  });

testFoundation('#open from anchor in top left of viewport, absolute position, hoisted menu surface, scrollX/scrollY ' +
  '5px/10px', ({foundation, mockAdapter, clock}) => {
  initAnchorLayout(mockAdapter, smallTopLeft, true, 200, {x: 5, y: 10});
  foundation.setIsHoisted(true);
  foundation.open();
  clock.runToFrame();
  td.verify(mockAdapter.setTransformOrigin('left top'));
  td.verify(mockAdapter.setPosition({left: 25, top: 30}));
});

testFoundation('#open in absolute position at x/y=100, absolute position, hoisted menu surface, scrollX/scrollY ' +
  '5px/10px', ({foundation, mockAdapter, clock}) => {
  initAnchorLayout(mockAdapter, smallTopLeft, true, 200, {x: 5, y: 10});
  td.when(mockAdapter.hasAnchor()).thenReturn(false);
  td.when(mockAdapter.getAnchorDimensions()).thenReturn(undefined);
  foundation.setIsHoisted(true);
  foundation.setAbsolutePosition(100, 100);
  foundation.open();
  clock.runToFrame();
  td.verify(mockAdapter.setTransformOrigin('left top'));
  td.verify(mockAdapter.setPosition({left: 105, top: 110}));
});

testFoundation('#open in absolute position at x/y=100, fixed position, hoisted menu surface, scrollY/scrollY 5px/10px',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallTopLeft, true, 200, {x: 5, y: 10});
    td.when(mockAdapter.hasAnchor()).thenReturn(false);
    td.when(mockAdapter.getAnchorDimensions()).thenReturn(undefined);
    foundation.setIsHoisted(true);
    foundation.setFixedPosition(true);
    foundation.setAbsolutePosition(100, 100);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: 100, top: 100}));
  });

testFoundation('#open in absolute position at x/y=INF, fixed position, hoisted menu surface, scrollY/scrollY 5px/10px',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallTopLeft, true, 200, {x: 5, y: 10});
    td.when(mockAdapter.hasAnchor()).thenReturn(false);
    td.when(mockAdapter.getAnchorDimensions()).thenReturn(undefined);
    foundation.setIsHoisted(true);
    foundation.setFixedPosition(true);
    foundation.setAbsolutePosition(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: 0, top: 0}));
  });

testFoundation('#open from small anchor in left bottom of viewport, default (TOP_START) anchor corner, RTL',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallBottomLeft, true);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('left bottom'));
    td.verify(mockAdapter.setPosition({left: 0, bottom: 0}));
  });

testFoundation('#open from small anchor in left bottom of viewport, TOP_END anchor corner, RTL',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallBottomLeft, true);
    foundation.setAnchorCorner(Corner.TOP_END);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('left bottom'));
    td.verify(mockAdapter.setPosition({left: 40, bottom: 0}));
  });

testFoundation('#open from small anchor in left bottom of viewport, BOTTOM_START anchor corner, RTL',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallBottomLeft, true);
    foundation.setAnchorCorner(Corner.BOTTOM_START);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('left bottom'));
    td.verify(mockAdapter.setPosition({left: 0, bottom: 20}));
  });

testFoundation('#open from small anchor in left bottom of viewport, BOTTOM_END anchor corner, RTL',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallBottomLeft, true);
    foundation.setAnchorCorner(Corner.BOTTOM_END);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('left bottom'));
    td.verify(mockAdapter.setPosition({left: 40, bottom: 20}));
  });

testFoundation('#open tall surface from small anchor in left above middle of viewport, BOTTOM_START anchor corner, LTR',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallAboveMiddleLeft, false, 700);
    foundation.setAnchorCorner(Corner.BOTTOM_START);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: 0, top: 20}));
    td.verify(mockAdapter.setMaxHeight('548px'));
  });

testFoundation('#open tall surface from small anchor in left below middle of viewport, BOTTOM_START anchor corner, LTR',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallBelowMiddleLeft, false, 700);
    foundation.setAnchorCorner(Corner.BOTTOM_START);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('left bottom'));
    td.verify(mockAdapter.setPosition({left: 0, bottom: 20}));
    td.verify(mockAdapter.setMaxHeight('568px'));
  });

testFoundation('#open from wide anchor center of viewport, TOP_START anchor corner, LTR',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, wideCenter);
    foundation.setAnchorCorner(Corner.TOP_START);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('center top'));
    td.verify(mockAdapter.setPosition({left: 0, top: 0}));
  });

testFoundation('#open from wide anchor center of viewport, TOP_END anchor corner, LTR',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, wideCenter);
    foundation.setAnchorCorner(Corner.TOP_END);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('center top'));
    td.verify(mockAdapter.setPosition({left: 150, top: 0}));
  });

testFoundation('#open from wide anchor center of viewport, BOTTOM_START anchor corner, RTL',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, wideCenter, true);
    foundation.setAnchorCorner(Corner.BOTTOM_START);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('center top'));
    td.verify(mockAdapter.setPosition({right: 0, top: 20}));
  });

testFoundation('#open from wide anchor center of viewport, BOTTOM_END anchor corner, RTL',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, wideCenter, true);
    foundation.setAnchorCorner(Corner.BOTTOM_END);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('center top'));
    td.verify(mockAdapter.setPosition({right: 150, top: 20}));
  });

testFoundation('#open from wide anchor top left of viewport, TOP_END anchor corner, RTL',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, wideTopLeft, true);
    foundation.setAnchorCorner(Corner.TOP_END);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('center top'));
    td.verify(mockAdapter.setPosition({left: 150, top: 0}));
  });

testFoundation('#open anchors the surface to the bottom left in LTR when not close to the bottom edge with margin',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallTopLeft);
    foundation.setAnchorCorner(Corner.BOTTOM_START);
    foundation.setAnchorMargin({left: 7, bottom: 10});
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('left top'));
    td.verify(mockAdapter.setPosition({left: 7, top: 30}));
  });

testFoundation('#open anchors the surface to the bottom left in LTR when close to the bottom edge with margin',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallBottomLeft);
    foundation.setAnchorCorner(Corner.BOTTOM_START);
    foundation.setAnchorMargin({top: 5, left: 7, bottom: 10});
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('left bottom'));
    td.verify(mockAdapter.setPosition({left: 7, bottom: 15}));
  });

testFoundation('#open anchors the surface to the bottom left in RTL when close to the bottom & right edge with margin',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallBottomRight, true);
    foundation.setAnchorCorner(Corner.BOTTOM_START);
    foundation.setAnchorMargin({top: 5, bottom: 10, right: 7});
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setTransformOrigin('right bottom'));
    td.verify(mockAdapter.setPosition({right: 7, bottom: 15}));
  });

testFoundation('#open anchors the surface to the top right in RTL when close to the top & right edge with margin',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallTopRight, true);
    foundation.setAnchorCorner(Corner.TOP_START);
    foundation.setAnchorMargin({right: 7, top: 5});
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setPosition({right: 7, top: 5}));
    td.verify(mockAdapter.setTransformOrigin('right top'));
  });

testFoundation('#open anchors hoisted surface to top right in RTL when near top right edge w/ margin',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallTopRight, true);
    foundation.setAnchorCorner(Corner.TOP_START);
    foundation.setAnchorMargin({right: 7, top: 5});
    foundation.setIsHoisted(true);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setPosition({right: 47, top: 25}));
    td.verify(mockAdapter.setTransformOrigin('right top'));
  });

testFoundation('#open anchors hoisted surface to bottom left in RTL when near bottom left edge w/ margin',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallBottomLeft, true);
    foundation.setAnchorCorner(Corner.BOTTOM_START);
    foundation.setAnchorMargin({left: 7, bottom: 5});
    foundation.setIsHoisted(true);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setPosition({left: 27, bottom: 80}));
    td.verify(mockAdapter.setTransformOrigin('left bottom'));
  });

testFoundation('#open anchors fixed-position surface to top right in RTL when near top right edge w/ margin',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallTopRight, true);
    foundation.setAnchorCorner(Corner.TOP_START);
    foundation.setAnchorMargin({right: 7, top: 5});
    foundation.setFixedPosition(true);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setPosition({right: 47, top: 25}));
    td.verify(mockAdapter.setTransformOrigin('right top'));
  });

testFoundation('#open anchors absolutely-position surface to top right in RTL when near top right edge w/ margin',
  ({foundation, mockAdapter, clock}) => {
    initAnchorLayout(mockAdapter, smallTopRight, true);
    foundation.setAnchorCorner(Corner.TOP_START);
    foundation.setAnchorMargin({right: 7, top: 5});
    foundation.setIsHoisted(false);
    foundation.setFixedPosition(false);
    foundation.setAbsolutePosition(0, 0);
    foundation.open();
    clock.runToFrame();
    td.verify(mockAdapter.setPosition({right: 7, top: 5}));
    td.verify(mockAdapter.setTransformOrigin('right top'));
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

testFoundation('#close removes the open class from the menu surface', ({foundation, mockAdapter, clock}) => {
  foundation.close();
  clock.runToFrame();
  clock.runToFrame();
  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
});

testFoundation('#close removes the animation class at the end of the animation',
  ({foundation, mockAdapter, clock}) => {
    foundation.close();
    clock.runToFrame();
    clock.runToFrame();
    td.verify(mockAdapter.addClass(cssClasses.ANIMATING_CLOSED));
    clock.tick(numbers.TRANSITION_CLOSE_DURATION);
    clock.runToFrame();
    td.verify(mockAdapter.removeClass(cssClasses.ANIMATING_CLOSED));
    td.verify(mockAdapter.notifyClose());
  });

testFoundation('#close emits the close event at the end of the animation', ({foundation, mockAdapter, clock}) => {
  foundation.close();
  clock.runToFrame();
  clock.runToFrame();
  clock.tick(numbers.TRANSITION_CLOSE_DURATION);
  clock.runToFrame();
  td.verify(mockAdapter.notifyClose());
});

testFoundation('#close emits the close event when quickOpen is true', ({foundation, mockAdapter, clock}) => {
  foundation.setQuickOpen(true);
  foundation.close();
  clock.runToFrame();
  clock.runToFrame();
  td.verify(mockAdapter.notifyClose());
});

testFoundation('#close causes restoreFocus to be called if the menu-surface has focus',
  ({foundation, mockAdapter, clock}) => {
    td.when(mockAdapter.isFocused()).thenReturn(true);
    foundation.setQuickOpen(true);
    foundation.close();
    clock.runToFrame();
    td.verify(mockAdapter.restoreFocus());
  });

testFoundation('#close causes restoreFocus to be called if an element within the menu-surface has focus',
  ({foundation, mockAdapter, clock}) => {
    td.when(mockAdapter.isFocused()).thenReturn(false);
    td.when(mockAdapter.isElementInContainer(td.matchers.anything())).thenReturn(true);
    foundation.setQuickOpen(true);
    foundation.close();
    clock.runToFrame();
    td.verify(mockAdapter.restoreFocus());
  });

testFoundation('#close does not cause restoreFocus to be called if the active element is not within the menu-surface',
  ({foundation, mockAdapter, clock}) => {
    td.when(mockAdapter.isFocused()).thenReturn(false);
    td.when(mockAdapter.isElementInContainer(td.matchers.anything())).thenReturn(false);
    foundation.setQuickOpen(true);
    foundation.close();
    clock.runToFrame();
    td.verify(mockAdapter.restoreFocus(), {times: 0});
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

test('#handleKeydown with Escape key closes the menu surface and sends close event', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = installClock();
  const target = {};
  const event = {target, key: 'Escape'};

  foundation.init();
  foundation.handleKeydown(event);
  clock.runToFrame();
  clock.tick(numbers.TRANSITION_CLOSE_DURATION);
  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
  td.verify(mockAdapter.notifyClose());
});

test('#handleKeydown on any other key, do not prevent default on the event', () => {
  const {foundation} = setupTest();
  const clock = installClock();
  const target = {};
  const preventDefault = td.func('event.preventDefault');
  const event = {target, key: 'Foo', preventDefault};

  foundation.init();
  foundation.handleKeydown(event);
  clock.tick(numbers.SELECTED_TRIGGER_DELAY);
  clock.runToFrame();
  td.verify(preventDefault(), {times: 0});
});

test('#handleBodyClick event closes the menu surface', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = installClock();

  const mockEvt = {
    target: {},
  };

  td.when(mockAdapter.hasClass(MDCMenuSurfaceFoundation.cssClasses.OPEN)).thenReturn(true);
  td.when(mockAdapter.isElementInContainer(td.matchers.anything())).thenReturn(false);

  foundation.init();
  foundation.open();
  clock.tick(numbers.TRANSITION_OPEN_DURATION);
  clock.runToFrame();

  foundation.handleBodyClick(mockEvt);
  clock.runToFrame();

  td.verify(mockAdapter.removeClass(cssClasses.OPEN));
});

test('on menu surface click does not emit close', () => {
  const {foundation, mockAdapter} = setupTest();
  const clock = installClock();
  const mockEvt = {
    target: {},
  };
  td.when(mockAdapter.isElementInContainer(td.matchers.anything())).thenReturn(true);
  foundation.init();
  foundation.open();
  clock.runToFrame();
  foundation.handleBodyClick(mockEvt);
  clock.runToFrame();
  td.verify(mockAdapter.notifyClose(), {times: 0});
});

testFoundation('should cancel animation after destroy', ({foundation, mockAdapter, clock}) => {
  foundation.init();
  clock.runToFrame();
  foundation.open();
  foundation.destroy();
  clock.runToFrame();
  clock.runToFrame();

  td.verify(
    mockAdapter.setPosition(td.matchers.anything()),
    {times: 0}
  );
});
