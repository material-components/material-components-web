/**
 * Copyright 2017 Google Inc. All Rights Reserved.
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

import {setupFoundationTest} from '../helpers/setup';
import {createMockRaf} from '../helpers/raf';
import {verifyDefaultAdapter} from '../helpers/foundation';


import MDCShapeFoundation from '../../../packages/mdc-shape/foundation';
import MockShapeFoundation from './mock-shape-foundation';

suite('MDCShapeFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCShapeFoundation);
});

test('exports strings', () => {
  assert.isOk('strings' in MDCShapeFoundation);
});

test('default adapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCShapeFoundation, [
    'setCanvasWidth', 'setCanvasHeight', 'getCanvasWidth', 'getCanvasHeight', 'getDevicePixelRatio',
    'create2dRenderingContext', 'createPath2D', 'setClipPathData',
  ]);

  const renderingContext = MDCShapeFoundation.defaultAdapter.create2dRenderingContext();
  const renderingContextMethods =
    Object.keys(renderingContext).filter((k) => typeof renderingContext[k] === 'function');
  assert.deepEqual(renderingContextMethods.slice().sort(), ['scale', 'clearRect', 'fill'].slice().sort());
  renderingContextMethods.forEach((m) => assert.doesNotThrow(renderingContext[m]));
});

function setupTest() {
  return setupFoundationTest(MockShapeFoundation);
}

function testFoundation(desc, runTests) {
  test(desc, () => {
    const {mockAdapter, foundation} = setupTest();
    const mockRaf = createMockRaf();
    runTests({mockAdapter, foundation, mockRaf});
    mockRaf.restore();
  });
}

test('#init sets up canvas', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getCanvasWidth()).thenReturn(100);
  td.when(mockAdapter.getCanvasHeight()).thenReturn(200);
  td.when(mockAdapter.getDevicePixelRatio()).thenReturn(2);
  const mockContext = td.object(MDCShapeFoundation.defaultAdapter.create2dRenderingContext());
  td.when(mockAdapter.create2dRenderingContext()).thenReturn(mockContext);

  foundation.init();

  td.verify(mockAdapter.setCanvasWidth(200));
  td.verify(mockAdapter.setCanvasHeight(400));
  td.verify(mockContext.scale(2, 2));
});

test('#redraw draws ambient, penumbra, umbra shadow, and the final shape', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getCanvasWidth()).thenReturn(200);
  td.when(mockAdapter.getCanvasHeight()).thenReturn(300);
  td.when(mockAdapter.getDevicePixelRatio()).thenReturn(2);
  const mockContext = td.object(MDCShapeFoundation.defaultAdapter.create2dRenderingContext());
  td.when(mockAdapter.create2dRenderingContext()).thenReturn(mockContext);
  let fillCount = 0;
  const fillStyles = [];
  const shadowColors = [];
  const shadowBlurs = [];
  const shadowOffsetYs = [];
  mockContext.fill = () => {
    fillCount++;
    fillStyles.push(mockContext.fillStyle);
    shadowColors.push(mockContext.shadowColor);
    shadowBlurs.push(mockContext.shadowBlur);
    shadowOffsetYs.push(mockContext.shadowOffsetY);
  };

  foundation.init();
  foundation.redraw();

  td.verify(mockContext.clearRect(0, 0, 200, 300));
  assert.equal(4, fillCount);
  assert.equal(fillStyles[0], '#FFF');
  assert.equal(fillStyles[1], '#FFF');
  assert.equal(fillStyles[2], '#FFF');
  assert.equal(shadowColors[0], 'rgba(0, 0, 0, 0.12)');
  assert.equal(shadowColors[1], 'rgba(0, 0, 0, 0.14)');
  assert.equal(shadowColors[2], 'rgba(0, 0, 0, 0.2)');
  assert.equal(shadowColors[3], 'rgba(0, 0, 0, 0)');
  assert.equal(shadowBlurs[0], 0);
  assert.equal(shadowBlurs[1], 0);
  assert.equal(shadowBlurs[2], 0);
  assert.equal(shadowBlurs[3], 0);
  assert.equal(shadowOffsetYs[0], 0);
  assert.equal(shadowOffsetYs[1], 0);
  assert.equal(shadowOffsetYs[2], 0);
  assert.equal(shadowOffsetYs[3], 0);
  td.verify(mockAdapter.createPath2D('m 56 56 h 200 v 300'), {times: 4});
  td.verify(mockAdapter.setClipPathData('m 0 0 h 88 v 188'));
});

test('#setBackground changes fillStyle when redrawing', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getCanvasWidth()).thenReturn(100);
  td.when(mockAdapter.getCanvasHeight()).thenReturn(200);
  td.when(mockAdapter.getDevicePixelRatio()).thenReturn(2);
  const mockContext = td.object(MDCShapeFoundation.defaultAdapter.create2dRenderingContext());
  td.when(mockAdapter.create2dRenderingContext()).thenReturn(mockContext);
  const fillStyles = [];
  mockContext.fill = () => {
    fillStyles.push(mockContext.fillStyle);
  };

  foundation.init();
  foundation.setBackground('#FF0000');
  foundation.redraw();

  assert.equal(fillStyles[3], '#FF0000');
});

test('#setElevation changes shadows when redrawing', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.generatePath_ = (width, height, padding) => {
    return 'm ' + padding + ' ' + padding + ' h ' + width + ' v ' + height;
  };
  td.when(mockAdapter.getCanvasWidth()).thenReturn(100);
  td.when(mockAdapter.getCanvasHeight()).thenReturn(200);
  td.when(mockAdapter.getDevicePixelRatio()).thenReturn(2);
  const mockContext = td.object(MDCShapeFoundation.defaultAdapter.create2dRenderingContext());
  td.when(mockAdapter.create2dRenderingContext()).thenReturn(mockContext);
  const shadowBlurs = [];
  const shadowOffsetYs = [];
  mockContext.fill = () => {
    shadowBlurs.push(mockContext.shadowBlur);
    shadowOffsetYs.push(mockContext.shadowOffsetY);
  };

  foundation.init();
  foundation.setElevation(2, false);
  foundation.redraw();

  assert.equal(shadowBlurs[0], 10);
  assert.equal(shadowBlurs[1], 4);
  assert.equal(shadowBlurs[2], 2);
  assert.equal(shadowOffsetYs[0], 2);
  assert.equal(shadowOffsetYs[1], 4);
  assert.equal(shadowOffsetYs[2], 6);
  td.verify(mockAdapter.createPath2D('m 58 58 h 100 v 200'));
});

testFoundation('#setElevation changes shadows when animating', ({foundation, mockAdapter, mockRaf}) => {
  foundation.generatePath_ = (width, height, padding) => {
    return 'm ' + padding + ' ' + padding + ' h ' + width + ' v ' + height;
  };
  td.when(mockAdapter.getCanvasWidth()).thenReturn(100);
  td.when(mockAdapter.getCanvasHeight()).thenReturn(200);
  td.when(mockAdapter.getDevicePixelRatio()).thenReturn(2);
  const mockContext = td.object(MDCShapeFoundation.defaultAdapter.create2dRenderingContext());
  td.when(mockAdapter.create2dRenderingContext()).thenReturn(mockContext);
  let fillCount = 0;
  const shadowBlurs = [];
  const shadowOffsetYs = [];
  mockContext.fill = () => {
    fillCount++;
    shadowBlurs.push(mockContext.shadowBlur);
    shadowOffsetYs.push(mockContext.shadowOffsetY);
  };

  foundation.init();
  foundation.setElevation(2, true);
  mockRaf.flush();

  assert.equal(fillCount, 4);
  assert.equal(shadowBlurs[0], 1);
  assert.equal(shadowBlurs[1], 0.4);
  assert.equal(shadowBlurs[2], 0.2);
  assert.equal(shadowOffsetYs[0], 0.2);
  assert.equal(shadowOffsetYs[1], 0.4);
  assert.equal(shadowOffsetYs[2], 0.6000000000000001);
  td.verify(mockAdapter.createPath2D('m 56.2 56.2 h 100 v 200'));

  // requires 9 frames to finish animation
  for (let i=0; i<9; i++) {
    mockRaf.flush();
  }

  assert.equal(fillCount, 4 * 9);
  assert.equal(shadowBlurs[8 * 4], 10);
  assert.equal(shadowBlurs[8 * 4 + 1], 4);
  assert.equal(shadowBlurs[8 * 4 + 2], 2);
  assert.equal(shadowOffsetYs[8 * 4], 2);
  assert.equal(shadowOffsetYs[8 * 4 + 1], 4);
  assert.equal(shadowOffsetYs[8 * 4 + 2], 6);
  td.verify(mockAdapter.createPath2D('m 58 58 h 100 v 200'));
});

testFoundation('#destroy cancels animation', ({foundation, mockAdapter, mockRaf}) => {
  foundation.generatePath_ = (width, height, padding) => {
    return 'm ' + padding + ' ' + padding + ' h ' + width + ' v ' + height;
  };
  td.when(mockAdapter.getCanvasWidth()).thenReturn(100);
  td.when(mockAdapter.getCanvasHeight()).thenReturn(200);
  td.when(mockAdapter.getDevicePixelRatio()).thenReturn(2);
  const mockContext = td.object(MDCShapeFoundation.defaultAdapter.create2dRenderingContext());
  td.when(mockAdapter.create2dRenderingContext()).thenReturn(mockContext);

  foundation.init();
  foundation.setElevation(2, true);
  mockRaf.flush();
  foundation.destroy();

  assert.equal(0, mockRaf.pendingFrames.length);
});
