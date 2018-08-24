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

import td from 'testdouble';

import {setupFoundationTest} from '../helpers/setup';
import MDCSlidingTabIndicatorFoundation from '../../../packages/mdc-tab-indicator/sliding-foundation';

suite('MDCSlidingTabIndicatorFoundation');

const setupTest = () => setupFoundationTest(MDCSlidingTabIndicatorFoundation);

test(`#activate adds the ${MDCSlidingTabIndicatorFoundation.cssClasses.ACTIVE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.computeContentClientRect()).thenReturn({width: 100, left: 10});

  foundation.activate({width: 90, left: 25});
  td.verify(mockAdapter.addClass(MDCSlidingTabIndicatorFoundation.cssClasses.ACTIVE));
});

test('#activate sets the transform property with no transition, then transitions it back', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.computeContentClientRect()).thenReturn({width: 100, left: 10});

  foundation.activate({width: 90, left: 25});
  td.verify(mockAdapter.addClass(MDCSlidingTabIndicatorFoundation.cssClasses.NO_TRANSITION));
  td.verify(mockAdapter.setContentStyleProperty('transform', 'translateX(15px) scaleX(0.9)'));
  td.verify(mockAdapter.removeClass(MDCSlidingTabIndicatorFoundation.cssClasses.NO_TRANSITION));
  td.verify(mockAdapter.setContentStyleProperty('transform', ''));
});

test('#activate does not modify transform and does not transition if no client rect is passed', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.activate();
  td.verify(mockAdapter.setContentStyleProperty('transform', td.matchers.isA(String)), {times: 0});
});

test(`#deactivate removes the ${MDCSlidingTabIndicatorFoundation.cssClasses.ACTIVE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.deactivate();
  td.verify(mockAdapter.removeClass(MDCSlidingTabIndicatorFoundation.cssClasses.ACTIVE));
});
