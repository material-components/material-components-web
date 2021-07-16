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

import {verifyDefaultAdapter} from '../../../testing/helpers/foundation';
import {setUpFoundationTest} from '../../../testing/helpers/setup';
import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {Corner, cssClasses, numbers, strings} from '../constants';
import {MDCMenuSurfaceFoundation} from '../foundation';

function setupTest() {
  const {foundation, mockAdapter} =
      setUpFoundationTest(MDCMenuSurfaceFoundation);
  const size = {width: 500, height: 200};
  mockAdapter.hasClass.withArgs(cssClasses.ROOT).and.returnValue(true);
  mockAdapter.hasClass.withArgs(cssClasses.OPEN).and.returnValue(false);
  mockAdapter.getWindowDimensions.and.returnValue(
      {width: window.innerWidth, height: window.innerHeight});
  mockAdapter.getInnerDimensions.and.returnValue(size);

  return {foundation, mockAdapter};
}

interface WithIsSurfaceOpen {
  isSurfaceOpen: boolean;
}

// Various anchor dimensions.
interface AnchorDimension {
  height: number;
  width: number;
  top: number;
  bottom: number;
  left: number;
  right: number;
}
const smallTopLeft: AnchorDimension = {
  height: 20,
  width: 40,
  top: 20,
  bottom: 40,
  left: 20,
  right: 60
};
const smallTopRight: AnchorDimension = {
  height: 20,
  width: 40,
  top: 20,
  bottom: 40,
  left: 920,
  right: 960
};
const smallBottomLeft: AnchorDimension = {
  height: 20,
  width: 40,
  top: 920,
  bottom: 940,
  left: 20,
  right: 60
};
const smallBottomRight: AnchorDimension = {
  height: 20,
  width: 40,
  top: 920,
  bottom: 940,
  left: 920,
  right: 960
};
const smallCenter: AnchorDimension = {
  height: 20,
  width: 40,
  top: 490,
  bottom: 510,
  left: 480,
  right: 520
};
const smallAboveMiddleLeft: AnchorDimension = {
  height: 20,
  width: 40,
  top: 400,
  bottom: 420,
  left: 20,
  right: 60
};
const smallBelowMiddleLeft: AnchorDimension = {
  height: 20,
  width: 40,
  top: 600,
  bottom: 620,
  left: 20,
  right: 60
};
const wideCenter: AnchorDimension = {
  height: 20,
  width: 150,
  top: 490,
  bottom: 510,
  left: 450,
  right: 600
};
const wideTopLeft: AnchorDimension = {
  height: 20,
  width: 150,
  top: 20,
  bottom: 40,
  left: 20,
  right: 170
};
const closeToBottom: AnchorDimension = {
  height: 20,
  width: 40,
  top: 800,
  bottom: 820,
  left: 480,
  right: 520
};

/**
 * Initializes viewport, anchor and menu surface dimensions. Viewport is
 * 1000x1000. Default surface size is 100x200.
 * @param mockAdapter Mock double for the adapter.
 * @param anchorDimensions Approximate viewport corner where anchor is located.
 * @param isRtl Indicates whether layout is RTL.
 * @param menuSurfaceHeight Optional height of the menu surface.
 * @param scrollValue Optional scroll values of the page.
 */
function initAnchorLayout(
    mockAdapter: any, anchorDimensions: AnchorDimension, isRtl = false,
    menuSurfaceHeight = 200, scrollValue = {
      x: 0,
      y: 0
    }) {
  mockAdapter.hasAnchor.and.returnValue(true);
  mockAdapter.getWindowDimensions.and.returnValue({height: 1000, width: 1000});
  mockAdapter.getAnchorDimensions.and.returnValue(anchorDimensions);
  mockAdapter.isRtl.and.returnValue(isRtl);
  mockAdapter.getInnerDimensions.and.returnValue(
      {height: menuSurfaceHeight, width: 100});
  mockAdapter.getBodyDimensions.and.returnValue({height: 1000, width: 1000});
  mockAdapter.getWindowScroll.and.returnValue(scrollValue);
}

function testFoundation(desc: string, runTests: ({mockAdapter, foundation}: {
                                        mockAdapter: any,
                                        foundation: MDCMenuSurfaceFoundation,
                                      }) => void) {
  it(desc, () => {
    const {mockAdapter, foundation} = setupTest();
    runTests({mockAdapter, foundation});
  });
}

describe('MDCMenuSurfaceFoundation', () => {
  setUpMdcTestEnvironment();

  it('exports strings', () => {
    expect(MDCMenuSurfaceFoundation.strings).toEqual(strings);
  });

  it('exports cssClasses', () => {
    expect(MDCMenuSurfaceFoundation.cssClasses).toEqual(cssClasses);
  });

  it('exports numbers', () => {
    expect(MDCMenuSurfaceFoundation.numbers).toEqual(numbers);
  });

  it('exports Corner', () => {
    expect(MDCMenuSurfaceFoundation.Corner).toEqual(Corner);
  });

  it('defaultAdapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCMenuSurfaceFoundation, [
      'addClass',
      'removeClass',
      'hasClass',
      'hasAnchor',
      'notifyClose',
      'notifyClosing',
      'notifyOpen',
      'isElementInContainer',
      'isRtl',
      'setTransformOrigin',
      'isFocused',
      'saveFocus',
      'restoreFocus',
      'getInnerDimensions',
      'getAnchorDimensions',
      'getWindowDimensions',
      'getBodyDimensions',
      'getWindowScroll',
      'setPosition',
      'setMaxHeight',
    ]);
  });

  it('#init throws error when the root class is not present', () => {
    const {foundation, mockAdapter} =
        setUpFoundationTest(MDCMenuSurfaceFoundation);
    mockAdapter.hasClass.withArgs(cssClasses.ROOT).and.returnValue(false);
    expect(() => {
      foundation.init();
    }).toThrow();
  });

  testFoundation(
      '#open adds the animation class to start an animation',
      ({foundation, mockAdapter}) => {
        foundation.open();
        expect(mockAdapter.addClass)
            .toHaveBeenCalledWith(cssClasses.ANIMATING_OPEN);
        expect(mockAdapter.addClass).toHaveBeenCalledTimes(1);
      });

  testFoundation(
      '#open does not add the animation class to start an animation when setQuickOpen is true',
      ({foundation, mockAdapter}) => {
        foundation.setQuickOpen(true);
        foundation.open();
        expect(mockAdapter.addClass)
            .not.toHaveBeenCalledWith(cssClasses.ANIMATING_OPEN);
        expect(mockAdapter.removeClass)
            .not.toHaveBeenCalledWith(cssClasses.ANIMATING_OPEN);
      });

  testFoundation(
      '#open adds the open class to the menu surface',
      ({foundation, mockAdapter}) => {
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.OPEN);
      });

  testFoundation(
      '#open removes the animation class at the end of the animation',
      ({foundation, mockAdapter}) => {
        foundation.open();
        expect(mockAdapter.addClass)
            .toHaveBeenCalledWith(cssClasses.ANIMATING_OPEN);
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.OPEN);
        jasmine.clock().tick(numbers.TRANSITION_OPEN_DURATION);
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.removeClass)
            .toHaveBeenCalledWith(cssClasses.ANIMATING_OPEN);
      });

  testFoundation(
      '#open emits the open event at the end of the animation',
      ({foundation, mockAdapter}) => {
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        jasmine.clock().tick(1);  // Run to frame.
        jasmine.clock().tick(numbers.TRANSITION_OPEN_DURATION);
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.notifyOpen).toHaveBeenCalled();
      });

  testFoundation(
      '#open emits the open event when setQuickOpen is true',
      ({foundation, mockAdapter}) => {
        foundation.setQuickOpen(true);
        foundation.open();
        expect(mockAdapter.notifyOpen).toHaveBeenCalled();
      });

  testFoundation(
      '#open does not emit event when already closed',
      ({foundation, mockAdapter}) => {
        foundation.setQuickOpen(true);
        foundation.open();
        foundation.open();
        expect(mockAdapter.notifyOpen).toHaveBeenCalledTimes(1);
      });

  /** Testing various layout cases for autopositioning */
  testFoundation(
      '#open from small anchor in center of viewport, default (TOP_START) anchor corner, RTL',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallCenter, true);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('right top');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({right: 0, top: 0});
      });

  testFoundation(
      '#open from small anchor in center of viewport, TOP_END anchor corner, RTL',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallCenter, true);
        foundation.setAnchorCorner(Corner.TOP_END);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('right top');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({right: 40, top: 0});
      });

  testFoundation(
      '#open from small anchor in center of viewport, BOTTOM_START anchor corner, RTL',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallCenter, true);
        foundation.setAnchorCorner(Corner.BOTTOM_START);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('right top');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({right: 0, top: 20});
      });

  testFoundation(
      '#open from small anchor in center of viewport, BOTTOM_END anchor corner, RTL',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallCenter, true);
        foundation.setAnchorCorner(Corner.BOTTOM_END);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('right top');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({right: 40, top: 20});
      });

  testFoundation(
      '#open from small anchor in top left of viewport, default (TOP_START) anchor corner, LTR',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallTopLeft);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin).toHaveBeenCalledWith('left top');
        expect(mockAdapter.setPosition).toHaveBeenCalledWith({left: 0, top: 0});
      });

  testFoundation(
      '#open from small anchor in top left of viewport, TOP_END anchor corner, LTR',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallTopLeft);
        foundation.setAnchorCorner(Corner.TOP_END);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin).toHaveBeenCalledWith('left top');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({left: 40, top: 0});
      });

  testFoundation(
      '#open from small anchor in top left of viewport, BOTTOM_START anchor corner, LTR',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallTopLeft);
        foundation.setAnchorCorner(Corner.BOTTOM_START);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin).toHaveBeenCalledWith('left top');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({left: 0, top: 20});
      });

  testFoundation(
      '#open from small anchor in top left of viewport, BOTTOM_END anchor corner, LTR',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallTopLeft);
        foundation.setAnchorCorner(Corner.BOTTOM_END);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin).toHaveBeenCalledWith('left top');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({left: 40, top: 20});
      });

  testFoundation(
      '#open from small anchor in right bottom of viewport, default (TOP_START) anchor corner, LTR',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallBottomRight);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('right bottom');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({right: 0, bottom: -0});
      });

  testFoundation(
      '#open from small anchor in right bottom of viewport, TOP_END anchor corner, LTR',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallBottomRight);
        foundation.setAnchorCorner(Corner.TOP_END);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('right bottom');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({right: 40, bottom: -0});
      });

  testFoundation(
      '#open from small anchor in right bottom of viewport, BOTTOM_START anchor corner, LTR',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallBottomRight);
        foundation.setAnchorCorner(Corner.BOTTOM_START);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('right bottom');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({right: 0, bottom: 20});
      });

  testFoundation(
      '#open from small anchor in right bottom of viewport, BOTTOM_END anchor corner, LTR',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallBottomRight);
        foundation.setAnchorCorner(Corner.BOTTOM_END);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('right bottom');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({right: 40, bottom: 20});
      });

  testFoundation(
      '#open from small anchor in top left of viewport, fixed position, no scroll',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallTopLeft, true);
        foundation.setFixedPosition(true);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin).toHaveBeenCalledWith('left top');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({left: 20, top: 20});
      });

  testFoundation(
      '#open from small anchor in top left of viewport, absolute position, no scroll',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallTopLeft, true);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin).toHaveBeenCalledWith('left top');
        expect(mockAdapter.setPosition).toHaveBeenCalledWith({left: 0, top: 0});
      });

  testFoundation(
      '#open from anchor in top left of viewport, absolute position, hoisted menu surface, no scroll',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallTopLeft, true);
        foundation.setIsHoisted(true);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin).toHaveBeenCalledWith('left top');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({left: 20, top: 20});
      });

  testFoundation(
      '#open from small anchor in top left of viewport, fixed position, scrollX/scrollY 5px/10px',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallTopLeft, true, 200, {x: 5, y: 10});
        foundation.setFixedPosition(true);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin).toHaveBeenCalledWith('left top');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({left: 20, top: 20});
      });

  testFoundation(
      '#open from small anchor in top left of viewport, absolute position, scrollX/scrollY 5px/10px',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallTopLeft, true, 200, {x: 5, y: 10});
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin).toHaveBeenCalledWith('left top');
        expect(mockAdapter.setPosition).toHaveBeenCalledWith({left: 0, top: 0});
      });

  testFoundation(
      '#open from anchor in top left of viewport, absolute position, hoisted menu surface, scrollX/scrollY ' +
          '5px/10px',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallTopLeft, true, 200, {x: 5, y: 10});
        foundation.setIsHoisted(true);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin).toHaveBeenCalledWith('left top');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({left: 25, top: 30});
      });

  testFoundation(
      '#open from anchor in top left of viewport, absolute position, hoisted menu surface, horizontally centered on viewport ' +
          '5px/10px',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallTopLeft, true, 200, {x: 5, y: 10});
        foundation.setIsHoisted(true);
        foundation.setIsHorizontallyCenteredOnViewport(true);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin).toHaveBeenCalledWith('left top');
        expect(mockAdapter.setPosition).toHaveBeenCalledWith({
          left: (mockAdapter.getWindowDimensions().width - 100) / 2,
          top: 30
        });
      });

  testFoundation(
      '#open in absolute position at x/y=100, absolute position, hoisted menu surface, scrollX/scrollY ' +
          '5px/10px',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallTopLeft, true, 200, {x: 5, y: 10});
        mockAdapter.hasAnchor.and.returnValue(false);
        mockAdapter.getAnchorDimensions.and.returnValue(undefined);
        foundation.setIsHoisted(true);
        foundation.setAbsolutePosition(100, 100);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin).toHaveBeenCalledWith('left top');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({left: 105, top: 110});
      });

  testFoundation(
      '#open in absolute position at x/y=100, fixed position, hoisted menu surface, scrollY/scrollY 5px/10px',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallTopLeft, true, 200, {x: 5, y: 10});
        mockAdapter.hasAnchor.and.returnValue(false);
        mockAdapter.getAnchorDimensions.and.returnValue(undefined);
        foundation.setIsHoisted(true);
        foundation.setFixedPosition(true);
        foundation.setAbsolutePosition(100, 100);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin).toHaveBeenCalledWith('left top');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({left: 100, top: 100});
      });

  testFoundation(
      '#open in absolute position at x/y=INF, fixed position, hoisted menu surface, scrollY/scrollY 5px/10px',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallTopLeft, true, 200, {x: 5, y: 10});
        mockAdapter.hasAnchor.and.returnValue(false);
        mockAdapter.getAnchorDimensions.and.returnValue(undefined);
        foundation.setIsHoisted(true);
        foundation.setFixedPosition(true);
        foundation.setAbsolutePosition(
            Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin).toHaveBeenCalledWith('left top');
        expect(mockAdapter.setPosition).toHaveBeenCalledWith({left: 0, top: 0});
      });

  testFoundation(
      '#open from small anchor in left bottom of viewport, default (TOP_START) anchor corner, RTL',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallBottomLeft, true);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('left bottom');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({left: 0, bottom: -0});
      });

  testFoundation(
      '#open from small anchor in left bottom of viewport, TOP_END anchor corner, RTL',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallBottomLeft, true);
        foundation.setAnchorCorner(Corner.TOP_END);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('left bottom');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({left: 40, bottom: -0});
      });

  testFoundation(
      '#open from small anchor in left bottom of viewport, BOTTOM_START anchor corner, RTL',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallBottomLeft, true);
        foundation.setAnchorCorner(Corner.BOTTOM_START);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('left bottom');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({left: 0, bottom: 20});
      });

  testFoundation(
      '#open from small anchor in left bottom of viewport, BOTTOM_END anchor corner, RTL',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallBottomLeft, true);
        foundation.setAnchorCorner(Corner.BOTTOM_END);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('left bottom');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({left: 40, bottom: 20});
      });

  testFoundation(
      '#open tall surface restricts max height if set',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallAboveMiddleLeft, false, 700);
        foundation.setAnchorCorner(Corner.BOTTOM_START);
        foundation.setMaxHeight(150);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setMaxHeight).toHaveBeenCalledWith('150px');
      });

  testFoundation(
      '#open tall surface from small anchor in left above middle of viewport, BOTTOM_START anchor corner, LTR',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallAboveMiddleLeft, false, 700);
        foundation.setAnchorCorner(Corner.BOTTOM_START);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin).toHaveBeenCalledWith('left top');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({left: 0, top: 20});
        expect(mockAdapter.setMaxHeight).toHaveBeenCalledWith('548px');
      });

  testFoundation(
      '#open tall surface from small anchor in left below middle of viewport, BOTTOM_START anchor corner, LTR',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallBelowMiddleLeft, false, 700);
        foundation.setAnchorCorner(Corner.BOTTOM_START);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('left bottom');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({left: 0, bottom: 20});
        expect(mockAdapter.setMaxHeight).toHaveBeenCalledWith('568px');
      });

  testFoundation(
      '#open from wide anchor center of viewport, TOP_START anchor corner, LTR',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, wideCenter);
        foundation.setAnchorCorner(Corner.TOP_START);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('center top');
        expect(mockAdapter.setPosition).toHaveBeenCalledWith({left: 0, top: 0});
      });

  testFoundation(
      '#open from wide anchor center of viewport, TOP_END anchor corner, LTR',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, wideCenter);
        foundation.setAnchorCorner(Corner.TOP_END);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('center top');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({left: 150, top: 0});
      });

  testFoundation(
      '#open from wide anchor center of viewport, BOTTOM_START anchor corner, RTL',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, wideCenter, true);
        foundation.setAnchorCorner(Corner.BOTTOM_START);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('center top');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({right: 0, top: 20});
      });

  testFoundation(
      '#open from anchor center of viewport with large menu surface height, ' +
          'BOTTOM_START anchor corner',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, wideCenter, true, 500);
        foundation.setAnchorCorner(Corner.BOTTOM_START);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('center top');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({right: 0, top: 20});
      });

  testFoundation(
      '#open from wide anchor center of viewport, BOTTOM_END anchor corner, RTL',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, wideCenter, true);
        foundation.setAnchorCorner(Corner.BOTTOM_END);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('center top');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({right: 150, top: 20});
      });

  testFoundation(
      '#open from wide anchor top left of viewport, TOP_END anchor corner, RTL',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, wideTopLeft, true);
        foundation.setAnchorCorner(Corner.TOP_END);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('center top');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({left: 150, top: 0});
      });

  testFoundation(
      '#open anchors the surface to the bottom left in LTR when not close to the bottom edge with margin',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallTopLeft);
        foundation.setAnchorCorner(Corner.BOTTOM_START);
        foundation.setAnchorMargin({left: 7, bottom: 10});
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin).toHaveBeenCalledWith('left top');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({left: 7, top: 30});
      });

  testFoundation(
      '#open anchors the surface to the bottom left in LTR when close to the bottom edge with margin',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallBottomLeft);
        foundation.setAnchorCorner(Corner.BOTTOM_START);
        foundation.setAnchorMargin({top: 5, left: 7, bottom: 10});
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('left bottom');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({left: 7, bottom: 15});
      });

  testFoundation(
      '#open anchors the surface to the bottom left in RTL when close to the bottom & right edge with margin',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallBottomRight, true);
        foundation.setAnchorCorner(Corner.BOTTOM_START);
        foundation.setAnchorMargin({top: 5, bottom: 10, right: 7});
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('right bottom');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({right: 7, bottom: 15});
      });

  testFoundation(
      '#open anchors the surface to the top right in RTL when close to the top & right edge with margin',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallTopRight, true);
        foundation.setAnchorCorner(Corner.TOP_START);
        foundation.setAnchorMargin({right: 7, top: 5});
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({right: 7, top: 5});
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('right top');
      });

  testFoundation(
      '#open anchors hoisted surface to top right in RTL when near top right edge w/ margin',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallTopRight, true);
        foundation.setAnchorCorner(Corner.TOP_START);
        foundation.setAnchorMargin({right: 7, top: 5});
        foundation.setIsHoisted(true);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({right: 47, top: 25});
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('right top');
      });

  testFoundation(
      '#open anchors hoisted surface to bottom left in RTL when near bottom left edge w/ margin',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallBottomLeft, true);
        foundation.setAnchorCorner(Corner.BOTTOM_START);
        foundation.setAnchorMargin({left: 7, bottom: 5});
        foundation.setIsHoisted(true);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({left: 27, bottom: 80});
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('left bottom');
      });

  testFoundation(
      '#open anchors fixed-position surface to top right in RTL when near top right edge w/ margin',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallTopRight, true);
        foundation.setAnchorCorner(Corner.TOP_START);
        foundation.setAnchorMargin({right: 7, top: 5});
        foundation.setFixedPosition(true);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({right: 47, top: 25});
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('right top');
      });

  testFoundation(
      '#open anchors absolutely-position surface to top right in RTL when near top right edge w/ margin',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallTopRight, true);
        foundation.setAnchorCorner(Corner.TOP_START);
        foundation.setAnchorMargin({right: 7, top: 5});
        foundation.setIsHoisted(false);
        foundation.setFixedPosition(false);
        foundation.setAbsolutePosition(0, 0);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({right: 7, top: 5});
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('right top');
      });

  testFoundation(
      '#open from close to bottom of viewport, menu should autoposition to open upwards',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, closeToBottom);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('left bottom');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({left: 0, bottom: -0});
      });

  testFoundation(
      '#open Surface is positioned from right side in LTR when corner is flipped horizontally.',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallCenter);
        foundation.flipCornerHorizontally();
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('right top');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({right: 0, top: 0});
      });

  testFoundation(
      '#open Surface is positioned from right side in LTR when corner is flipped horizontally and anchor is wider than menu.',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, wideTopLeft);
        foundation.flipCornerHorizontally();
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('center top');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({right: 0, top: 0});
      });

  testFoundation(
      '#open Surface is positioned from left side in LTR when corner is flipped horizontally and space is not available on the left side.',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallTopLeft);
        foundation.flipCornerHorizontally();
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin).toHaveBeenCalledWith('left top');
        expect(mockAdapter.setPosition).toHaveBeenCalledWith({left: 0, top: 0});
      });

  testFoundation(
      '#open Surface is positioned from right side in LTR when corner is flipped horizontally and space is not available on the right side.',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallTopRight);
        foundation.flipCornerHorizontally();
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('right top');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({right: 0, top: 0});
      });

  testFoundation(
      '#open Surface is positioned from left side in RTL when corner is flipped horizontally.',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallCenter, /* isRtl */ true);
        foundation.flipCornerHorizontally();
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin).toHaveBeenCalledWith('left top');
        expect(mockAdapter.setPosition).toHaveBeenCalledWith({left: 0, top: 0});
      });

  testFoundation(
      '#open Surface is positioned from left side in RTL when corner is flipped horizontally and space is not available on the left side.',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallTopLeft, /* isRtl */ true);
        foundation.flipCornerHorizontally();
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin).toHaveBeenCalledWith('left top');
        expect(mockAdapter.setPosition).toHaveBeenCalledWith({left: 0, top: 0});
      });

  testFoundation(
      '#open Surface is positioned from right side in RTL when corner is flipped horizontally and space is not available on the right side.',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallTopRight, /* isRtl */ true);
        foundation.flipCornerHorizontally();
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setTransformOrigin)
            .toHaveBeenCalledWith('right top');
        expect(mockAdapter.setPosition)
            .toHaveBeenCalledWith({right: 0, top: 0});
      });

  testFoundation(
      '#open adds the open-below class to the menu surface, from small anchor in top of viewport',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallTopLeft);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.addClass)
            .toHaveBeenCalledWith(cssClasses.IS_OPEN_BELOW);
      });

  testFoundation(
      '#open does not add the open-below class to the menu surface, from small anchor in bottom of viewport',
      ({foundation, mockAdapter}) => {
        initAnchorLayout(mockAdapter, smallBottomLeft);
        foundation.open();
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.addClass)
            .not.toHaveBeenCalledWith(cssClasses.IS_OPEN_BELOW);
      });

  testFoundation(
      '#close adds the animation class to start an animation',
      ({foundation, mockAdapter}) => {
        (foundation as unknown as WithIsSurfaceOpen).isSurfaceOpen = true;
        foundation.close();
        expect(mockAdapter.addClass)
            .toHaveBeenCalledWith(cssClasses.ANIMATING_CLOSED);
      });

  testFoundation(
      '#close does not add animation class if quickOpen is set to true',
      ({foundation, mockAdapter}) => {
        foundation.setQuickOpen(true);
        foundation.close();
        expect(mockAdapter.addClass)
            .not.toHaveBeenCalledWith(cssClasses.ANIMATING_CLOSED);
        expect(mockAdapter.removeClass)
            .not.toHaveBeenCalledWith(cssClasses.ANIMATING_CLOSED);
      });

  testFoundation(
      '#close removes the open class from the menu surface',
      ({foundation, mockAdapter}) => {
        (foundation as unknown as WithIsSurfaceOpen).isSurfaceOpen = true;
        foundation.close();
        jasmine.clock().tick(1);  // Run to frame.
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.OPEN);
      });

  testFoundation(
      '#close removes the animation class at the end of the animation',
      ({foundation, mockAdapter}) => {
        (foundation as unknown as WithIsSurfaceOpen).isSurfaceOpen = true;
        foundation.close();
        jasmine.clock().tick(1);  // Run to frame.
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.addClass)
            .toHaveBeenCalledWith(cssClasses.ANIMATING_CLOSED);
        jasmine.clock().tick(numbers.TRANSITION_CLOSE_DURATION);
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.removeClass)
            .toHaveBeenCalledWith(cssClasses.ANIMATING_CLOSED);
        expect(mockAdapter.notifyClose).toHaveBeenCalled();
      });

  testFoundation(
      '#close emits the close event at the end of the animation',
      ({foundation, mockAdapter}) => {
        (foundation as unknown as WithIsSurfaceOpen).isSurfaceOpen = true;
        foundation.close();
        jasmine.clock().tick(1);  // Run to frame.
        jasmine.clock().tick(1);  // Run to frame.
        jasmine.clock().tick(numbers.TRANSITION_CLOSE_DURATION);
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.notifyClose).toHaveBeenCalled();
      });

  testFoundation(
      '#close emits the closing event immediately',
      ({foundation, mockAdapter}) => {
        (foundation as unknown as WithIsSurfaceOpen).isSurfaceOpen = true;
        foundation.close();
        expect(mockAdapter.notifyClosing).toHaveBeenCalled();
      });

  testFoundation(
      '#close emits the close event when quickOpen is true',
      ({foundation, mockAdapter}) => {
        (foundation as unknown as WithIsSurfaceOpen).isSurfaceOpen = true;
        foundation.setQuickOpen(true);
        foundation.close();
        expect(mockAdapter.notifyClose).toHaveBeenCalled();
      });

  testFoundation(
      '#close does not emit event when already closed',
      ({foundation, mockAdapter}) => {
        foundation.setQuickOpen(true);
        foundation.close();
        expect(mockAdapter.notifyClose).toHaveBeenCalledTimes(0);
      });

  testFoundation(
      '#close causes restoreFocus to be called if the menu-surface has focus',
      ({foundation, mockAdapter}) => {
        (foundation as unknown as WithIsSurfaceOpen).isSurfaceOpen = true;
        mockAdapter.isFocused.and.returnValue(true);
        foundation.setQuickOpen(true);
        foundation.close();
        expect(mockAdapter.restoreFocus).toHaveBeenCalled();
      });

  testFoundation(
      '#close causes restoreFocus to be called if an element within the menu-surface has focus',
      ({foundation, mockAdapter}) => {
        (foundation as unknown as WithIsSurfaceOpen).isSurfaceOpen = true;
        mockAdapter.isFocused.and.returnValue(false);
        mockAdapter.isElementInContainer.withArgs(jasmine.anything())
            .and.returnValue(true);
        foundation.setQuickOpen(true);
        foundation.close();
        expect(mockAdapter.restoreFocus).toHaveBeenCalled();
      });

  testFoundation(
      '#close does not cause restoreFocus to be called if the active element is not within the menu-surface',
      ({foundation, mockAdapter}) => {
        mockAdapter.isFocused.and.returnValue(false);
        mockAdapter.isElementInContainer.withArgs(jasmine.anything())
            .and.returnValue(false);
        foundation.setQuickOpen(true);
        foundation.close();
        expect(mockAdapter.restoreFocus).not.toHaveBeenCalled();
      });

  it('#isOpen returns true when the menu surface is open', () => {
    const {foundation} = setupTest();

    foundation.open();
    expect(foundation.isOpen()).toBeTruthy();
  });

  it('#isOpen returns false when the menu surface is closed', () => {
    const {foundation} = setupTest();

    foundation.close();
    expect(foundation.isOpen()).toBeFalsy();
  });

  it('#isOpen returns true when the menu surface is initiated with the open class present',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.OPEN).and.returnValue(true);

       foundation.init();
       expect(foundation.isOpen()).toBeTruthy();
     });

  it('#isOpen returns false when the menu surface is initiated without the open class present',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.OPEN).and.returnValue(false);

       foundation.init();
       expect(foundation.isOpen()).toBeFalsy();
     });

  it('#handleKeydown with Escape key closes the menu surface and sends close event',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const target = {};
       const event = {target, key: 'Escape'} as KeyboardEvent;

       (foundation as unknown as WithIsSurfaceOpen).isSurfaceOpen = true;
       foundation.init();
       foundation.handleKeydown(event);
       jasmine.clock().tick(1);  // Run to frame.
       jasmine.clock().tick(numbers.TRANSITION_CLOSE_DURATION);
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.OPEN);
       expect(mockAdapter.notifyClose).toHaveBeenCalled();
     });

  it('#handleKeydown on any other key, do not prevent default on the event',
     () => {
       const {foundation} = setupTest();
       const target = {};
       const preventDefault =
           jasmine.createSpy('event.preventDefault') as Function;
       const event = {target, key: 'Foo', preventDefault} as KeyboardEvent;

       foundation.init();
       foundation.handleKeydown(event);
       // jasmine.clock().tick(numbers.SELECTED_TRIGGER_DELAY);
       jasmine.clock().tick(1);  // Run to frame.
       expect(preventDefault).not.toHaveBeenCalled();
     });

  it('#handleBodyClick event closes the menu surface', () => {
    const {foundation, mockAdapter} = setupTest();
    const mockEvt = {
      target: {},
    } as MouseEvent;

    mockAdapter.hasClass.withArgs(MDCMenuSurfaceFoundation.cssClasses.OPEN)
        .and.returnValue(true);
    mockAdapter.isElementInContainer.withArgs(jasmine.anything())
        .and.returnValue(false);

    foundation.init();
    foundation.open();
    jasmine.clock().tick(numbers.TRANSITION_OPEN_DURATION);
    jasmine.clock().tick(1);  // Run to frame.

    foundation.handleBodyClick(mockEvt);
    jasmine.clock().tick(1);  // Run to frame.

    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.OPEN);
  });

  it('on menu surface click does not emit close', () => {
    const {foundation, mockAdapter} = setupTest();
    const mockEvt = {
      target: {},
    } as MouseEvent;
    mockAdapter.isElementInContainer.withArgs(jasmine.anything())
        .and.returnValue(true);
    foundation.init();
    foundation.open();
    jasmine.clock().tick(1);  // Run to frame.
    foundation.handleBodyClick(mockEvt);
    jasmine.clock().tick(1);  // Run to frame.
    expect(mockAdapter.notifyClose).not.toHaveBeenCalled();
  });

  testFoundation(
      'should cancel animation after destroy', ({foundation, mockAdapter}) => {
        foundation.init();
        jasmine.clock().tick(1);  // Run to frame.
        foundation.open();
        foundation.destroy();
        jasmine.clock().tick(1);  // Run to frame.
        jasmine.clock().tick(1);  // Run to frame.
        expect(mockAdapter.setPosition).not.toHaveBeenCalled();
      });
});
