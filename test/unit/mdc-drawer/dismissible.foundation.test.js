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
import td from 'testdouble';

import MDCDismissibleDrawerFoundation from '../../../packages/mdc-drawer/dismissible/foundation';
import {createMockRaf} from '../helpers/raf';
import {strings, cssClasses} from '../../../packages/mdc-drawer/constants';
import {verifyDefaultAdapter} from '../helpers/foundation';

suite('MDCDismissibleDrawerFoundation');

const setupTest = () => {
  const mockAdapter = td.object(MDCDismissibleDrawerFoundation.defaultAdapter);

  const foundation = new MDCDismissibleDrawerFoundation(mockAdapter);

  return {foundation, mockAdapter};
};

test('exports strings', () => {
  assert.isTrue('strings' in MDCDismissibleDrawerFoundation);
  assert.deepEqual(MDCDismissibleDrawerFoundation.strings, strings);
});

test('exports cssClasses', () => {
  assert.isTrue('cssClasses' in MDCDismissibleDrawerFoundation);
  assert.deepEqual(MDCDismissibleDrawerFoundation.cssClasses, cssClasses);
});

test('defaultAdapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCDismissibleDrawerFoundation, [
    'hasClass', 'addClass', 'removeClass', 'computeBoundingRect', 'setStyleAppContent',
    'addClassAppContent', 'removeClassAppContent', 'isRtl', 'notifyClose', 'notifyOpen',
  ]);
});

test('#open does nothing if drawer is already open', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(true);
  foundation.open();
  td.verify(mockAdapter.addClass(td.matchers.isA(String)), {times: 0});
});

test('#open does nothing if drawer is already opening', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.ANIMATING_OPEN)).thenReturn(true);
  foundation.open();
  td.verify(mockAdapter.addClass(td.matchers.isA(String)), {times: 0});
});

test('#open does nothing if drawer is closing', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.ANIMATING_CLOSE)).thenReturn(true);
  foundation.open();
  td.verify(mockAdapter.addClass(td.matchers.isA(String)), {times: 0});
});

test('#open adds appropriate classes', () => {
  const {foundation, mockAdapter} = setupTest();
  const width = 250;
  td.when(mockAdapter.computeBoundingRect()).thenReturn({width});
  foundation.open();
  td.verify(mockAdapter.addClass(cssClasses.OPEN), {times: 1});
  td.verify(mockAdapter.addClass(cssClasses.ANIMATING_OPEN), {times: 1});
});

test('#open animates appContent element', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const width = 250;
  td.when(mockAdapter.computeBoundingRect()).thenReturn({width});
  foundation.open();
  td.verify(mockAdapter.setStyleAppContent('transform', 'translateX(-250px)'));
  raf.flush();
  td.verify(mockAdapter.addClassAppContent(cssClasses.APP_CONTENT_ANIMATE_OPEN));
  td.verify(mockAdapter.setStyleAppContent('transform', ''));
  raf.restore();
});

test('#open animates appContent element when isRtl returns true', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const width = 250;
  td.when(mockAdapter.isRtl()).thenReturn(true);
  td.when(mockAdapter.computeBoundingRect()).thenReturn({width});
  foundation.open();
  td.verify(mockAdapter.setStyleAppContent('transform', 'translateX(250px)'));
  raf.flush();
  td.verify(mockAdapter.addClassAppContent(cssClasses.APP_CONTENT_ANIMATE_OPEN));
  td.verify(mockAdapter.setStyleAppContent('transform', ''));
  raf.restore();
});

test('#close does nothing if drawer is already closed', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(false);
  foundation.close();
  td.verify(mockAdapter.addClass(td.matchers.isA(String)), {times: 0});
});

test('#close does nothing if drawer is opening', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.ANIMATING_OPEN)).thenReturn(true);
  foundation.close();
  td.verify(mockAdapter.addClass(td.matchers.isA(String)), {times: 0});
});

test('#close does nothing if drawer is closing', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.ANIMATING_CLOSE)).thenReturn(true);
  foundation.close();
  td.verify(mockAdapter.addClass(td.matchers.isA(String)), {times: 0});
});

test('#close adds appropriate classes', () => {
  const {foundation, mockAdapter} = setupTest();
  const width = 250;
  td.when(mockAdapter.computeBoundingRect()).thenReturn({width});
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(true);
  foundation.close();

  td.verify(mockAdapter.addClass(cssClasses.ANIMATING_CLOSE), {times: 1});
});

test('#close animates appContent element', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const width = 250;
  td.when(mockAdapter.computeBoundingRect()).thenReturn({width});
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(true);
  foundation.close();

  td.verify(mockAdapter.setStyleAppContent('transform', ''));
  raf.flush();
  td.verify(mockAdapter.addClassAppContent(cssClasses.APP_CONTENT_ANIMATE_CLOSE));
  td.verify(mockAdapter.setStyleAppContent('transform', 'translateX(-250px)'));
  raf.restore();
});

test('#close animates appContent element when isRtl returns true', () => {
  const {foundation, mockAdapter} = setupTest();
  const raf = createMockRaf();
  const width = 250;
  td.when(mockAdapter.isRtl()).thenReturn(true);
  td.when(mockAdapter.computeBoundingRect()).thenReturn({width});
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(true);
  foundation.close();

  td.verify(mockAdapter.setStyleAppContent('transform', ''));
  raf.flush();
  td.verify(mockAdapter.addClassAppContent(cssClasses.APP_CONTENT_ANIMATE_CLOSE));
  td.verify(mockAdapter.setStyleAppContent('transform', 'translateX(250px)'));
  raf.restore();
});

test(`#isOpen returns true when it has ${cssClasses.OPEN} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(true);
  assert.isTrue(foundation.isOpen());
});

test(`#isOpen returns false when it lacks ${cssClasses.OPEN} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(false);
  assert.isFalse(foundation.isOpen());
});

test(`#isOpening returns true when it has ${cssClasses.ANIMATING_OPEN} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.ANIMATING_OPEN)).thenReturn(true);
  assert.isTrue(foundation.isOpening());
});

test(`#isOpening returns false when it lacks ${cssClasses.ANIMATING_OPEN} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.ANIMATING_OPEN)).thenReturn(false);
  assert.isFalse(foundation.isOpening());
});

test(`#isClosing returns true when it has ${cssClasses.ANIMATING_CLOSE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.ANIMATING_CLOSE)).thenReturn(true);
  assert.isTrue(foundation.isClosing());
});

test(`#isClosing returns false when it lacks ${cssClasses.ANIMATING_CLOSE} class`, () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.ANIMATING_CLOSE)).thenReturn(false);
  assert.isFalse(foundation.isClosing());
});

test('#handleKeydown does nothing when event key is not the escape key', () => {
  const {foundation, mockAdapter} = setupTest();
  const width = 250;
  td.when(mockAdapter.computeBoundingRect()).thenReturn({width});
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(true);
  foundation.handleKeydown({key: 'Shift'});

  td.verify(mockAdapter.addClass(cssClasses.ANIMATING_CLOSE), {times: 0});
});

test('#handleKeydown does nothing when event keyCode is not 27', () => {
  const {foundation, mockAdapter} = setupTest();
  const width = 250;
  td.when(mockAdapter.computeBoundingRect()).thenReturn({width});
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(true);
  foundation.handleKeydown({keyCode: 11});

  td.verify(mockAdapter.addClass(cssClasses.ANIMATING_CLOSE), {times: 0});
});

test('#handleKeydown calls close when event key is the escape key', () => {
  const {foundation, mockAdapter} = setupTest();
  const width = 250;
  td.when(mockAdapter.computeBoundingRect()).thenReturn({width});
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(true);
  foundation.handleKeydown({key: 'Escape'});

  td.verify(mockAdapter.addClass(cssClasses.ANIMATING_CLOSE), {times: 1});
});

test('#handleKeydown calls close when event keyCode is 27', () => {
  const {foundation, mockAdapter} = setupTest();
  const width = 250;
  td.when(mockAdapter.computeBoundingRect()).thenReturn({width});
  td.when(mockAdapter.hasClass(cssClasses.OPEN)).thenReturn(true);
  foundation.handleKeydown({keyCode: 27});

  td.verify(mockAdapter.addClass(cssClasses.ANIMATING_CLOSE), {times: 1});
});

test('#handleTransitionEnd removes all animating classes', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.handleTransitionEnd();
  td.verify(mockAdapter.removeClassAppContent(cssClasses.APP_CONTENT_ANIMATE_OPEN), {times: 1});
  td.verify(mockAdapter.removeClassAppContent(cssClasses.APP_CONTENT_ANIMATE_CLOSE), {times: 1});
  td.verify(mockAdapter.removeClass(cssClasses.ANIMATING_OPEN), {times: 1});
  td.verify(mockAdapter.removeClass(cssClasses.ANIMATING_CLOSE), {times: 1});
});

test('#handleTransitionEnd removes open class after closing and calls notifyClose', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.ANIMATING_CLOSE)).thenReturn(true);
  foundation.handleTransitionEnd();
  td.verify(mockAdapter.removeClass(cssClasses.OPEN), {times: 1});
  td.verify(mockAdapter.setStyleAppContent('transform', ''), {times: 1});
  td.verify(mockAdapter.notifyClose(), {times: 1});
});

test('#handleTransitionEnd doesn\'t remove open class after closing and calls notifyOpen', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.hasClass(cssClasses.ANIMATING_CLOSE)).thenReturn(false);
  foundation.handleTransitionEnd();
  td.verify(mockAdapter.removeClass(cssClasses.OPEN), {times: 0});
  td.verify(mockAdapter.setStyleAppContent('transform', ''), {times: 0});
  td.verify(mockAdapter.notifyOpen(), {times: 1});
});
