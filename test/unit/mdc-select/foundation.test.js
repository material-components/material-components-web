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

import {setupFoundationTest} from '../helpers/setup';
import {captureHandlers, verifyDefaultAdapter} from '../helpers/foundation';

import MDCSelectFoundation from '../../../packages/mdc-select/foundation';

suite('MDCSelectFoundation');

test('exports cssClasses', () => {
  assert.isOk('cssClasses' in MDCSelectFoundation);
});

test('exports strings', () => {
  assert.isOk('strings' in MDCSelectFoundation);
});

test('default adapter returns a complete adapter implementation', () => {
  verifyDefaultAdapter(MDCSelectFoundation, [
    'addClass', 'removeClass', 'setAttr', 'rmAttr', 'computeBoundingRect',
    'registerInteractionHandler', 'deregisterInteractionHandler', 'focus', 'makeTabbable',
    'makeUntabbable', 'getComputedStyleValue', 'setStyle', 'create2dRenderingContext',
    'setMenuElStyle', 'setMenuElAttr', 'rmMenuElAttr', 'getMenuElOffsetHeight', 'openMenu',
    'isMenuOpen', 'setSelectedTextContent', 'getNumberOfOptions', 'getTextForOptionAtIndex',
    'setAttrForOptionAtIndex', 'rmAttrForOptionAtIndex', 'getOffsetTopForOptionAtIndex',
    'registerMenuInteractionHandler', 'deregisterMenuInteractionHandler', 'notifyChange',
    'getWindowInnerHeight', 'getValueForOptionAtIndex',
  ]);

  const renderingContext = MDCSelectFoundation.defaultAdapter.create2dRenderingContext();
  const renderingContextMethods =
    Object.keys(renderingContext).filter((k) => typeof renderingContext[k] === 'function');
  assert.deepEqual(renderingContextMethods.slice().sort(), ['measureText'].slice().sort());
  renderingContextMethods.forEach((m) => assert.doesNotThrow(renderingContext[m]));
});

function setupTest() {
  return setupFoundationTest(MDCSelectFoundation);
}

test('#getSelectedIndex returns -1 if never set', () => {
  const {foundation} = setupTest();
  assert.equal(foundation.getSelectedIndex(), -1);
});

test('#setSelectedIndex updates the selected index', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNumberOfOptions()).thenReturn(2);
  td.when(mockAdapter.getTextForOptionAtIndex(1)).thenReturn('');
  foundation.setSelectedIndex(1);
  assert.equal(foundation.getSelectedIndex(), 1);
});

test('#setSelectedIndex sets the trimmed text content of the selected item as selected text content', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNumberOfOptions()).thenReturn(2);
  td.when(mockAdapter.getTextForOptionAtIndex(1)).thenReturn('   \nselected text ');
  foundation.setSelectedIndex(1);
  td.verify(mockAdapter.setSelectedTextContent('selected text'));
});

test('#setSelectedIndex sets aria-selected to "true" on the selected item', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNumberOfOptions()).thenReturn(2);
  td.when(mockAdapter.getTextForOptionAtIndex(1)).thenReturn('');
  foundation.setSelectedIndex(1);
  td.verify(mockAdapter.setAttrForOptionAtIndex(1, 'aria-selected', 'true'));
});

test('#setSelectedIndex removes aria-selected from the previously selected item, if any', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNumberOfOptions()).thenReturn(2);
  td.when(mockAdapter.getTextForOptionAtIndex(0)).thenReturn('');
  td.when(mockAdapter.getTextForOptionAtIndex(1)).thenReturn('');
  foundation.setSelectedIndex(0);
  foundation.setSelectedIndex(1);
  td.verify(mockAdapter.rmAttrForOptionAtIndex(0, 'aria-selected'));
});

test('#setSelectedIndex clears the select if given index is < 0', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNumberOfOptions()).thenReturn(2);
  foundation.setSelectedIndex(-15);
  td.verify(mockAdapter.setSelectedTextContent(''));
  assert.equal(foundation.getSelectedIndex(), -1);
});

test('#setSelectedIndex clears the select if given index is >= the number of options', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.getNumberOfOptions()).thenReturn(2);
  foundation.setSelectedIndex(2);
  td.verify(mockAdapter.setSelectedTextContent(''));
  assert.equal(foundation.getSelectedIndex(), -1);
});

test('#isDisabled returns false by default', () => {
  const {foundation} = setupTest();
  assert.isNotOk(foundation.isDisabled());
});

test('#setDisabled sets disabled to true when true', () => {
  const {foundation} = setupTest();
  foundation.setDisabled(true);
  assert.isOk(foundation.isDisabled());
});

test('#setDisabled adds the disabled class when true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(true);
  td.verify(mockAdapter.addClass(MDCSelectFoundation.cssClasses.DISABLED));
});

test('#setDisabled adds aria-disabled="true" when true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(true);
  td.verify(mockAdapter.setAttr('aria-disabled', 'true'));
});

test('#setDisabled makes the select unfocusable when true', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(true);
  td.verify(mockAdapter.makeUntabbable());
});

test('#setDisabled sets disabled to false when false', () => {
  const {foundation} = setupTest();
  foundation.setDisabled(false);
  assert.isNotOk(foundation.isDisabled());
});

test('#setDisabled removes the disabled class when false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(false);
  td.verify(mockAdapter.removeClass(MDCSelectFoundation.cssClasses.DISABLED));
});

test('#setDisabled removes the aria-disabled attr when false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(false);
  td.verify(mockAdapter.rmAttr('aria-disabled'));
});

test('#setDisabled makes the select focusable when false', () => {
  const {foundation, mockAdapter} = setupTest();
  foundation.setDisabled(false);
  td.verify(mockAdapter.makeTabbable());
});

test('#resize resizes the element to the longest-length option', () => {
  const {foundation, mockAdapter} = setupTest();
  const ctx = td.object({
    font: 'default font',
    measureText: () => {},
  });
  td.when(mockAdapter.create2dRenderingContext()).thenReturn(ctx);
  td.when(mockAdapter.getComputedStyleValue('font')).thenReturn('16px Roboto');
  td.when(mockAdapter.getComputedStyleValue('letter-spacing')).thenReturn('2.5px');

  // Add space on last option to test trimming
  const opts = ['longer', 'longest', '     short     '];
  const widths = [100, 200, 50];
  td.when(mockAdapter.getNumberOfOptions()).thenReturn(opts.length);
  opts.forEach((txt, i) => {
    td.when(mockAdapter.getTextForOptionAtIndex(i)).thenReturn(txt);
    td.when(ctx.measureText(txt.trim())).thenReturn({width: widths[i]});
  });

  foundation.init();
  foundation.resize();
  assert.equal(ctx.font, '16px Roboto');
  // ceil(letter-spacing * 'longest'.length + longest measured width)
  const expectedWidth = Math.ceil((2.5 * 7) + Math.max(...widths));
  td.verify(mockAdapter.setStyle('width', `${expectedWidth}px`));
});

test('#resize falls back to font-{family,size} if shorthand is not supported', () => {
  const {foundation, mockAdapter} = setupTest();
  const ctx = td.object({
    font: 'default font',
    measureText: () => {},
  });
  td.when(mockAdapter.create2dRenderingContext()).thenReturn(ctx);
  td.when(mockAdapter.getComputedStyleValue('font')).thenReturn(null);
  td.when(mockAdapter.getComputedStyleValue('font-size')).thenReturn('16px');
  td.when(mockAdapter.getComputedStyleValue('font-family')).thenReturn('Roboto,sans-serif');
  td.when(mockAdapter.getComputedStyleValue('letter-spacing')).thenReturn('2.5px');

  // Add space on last option to test trimming
  const opts = ['longer', 'longest', '     short     '];
  const widths = [100, 200, 50];
  td.when(mockAdapter.getNumberOfOptions()).thenReturn(opts.length);
  opts.forEach((txt, i) => {
    td.when(mockAdapter.getTextForOptionAtIndex(i)).thenReturn(txt);
    td.when(ctx.measureText(txt.trim())).thenReturn({width: widths[i]});
  });

  foundation.init();
  foundation.resize();
  assert.equal(ctx.font, '16px Roboto');
  // ceil(letter-spacing * 'longest'.length + longest measured width)
  const expectedWidth = Math.ceil((2.5 * 7) + Math.max(...widths));
  td.verify(mockAdapter.setStyle('width', `${expectedWidth}px`));
});

test('#destroy deregisters all events registered within init()', () => {
  const {foundation, mockAdapter} = setupTest();
  td.when(mockAdapter.create2dRenderingContext()).thenReturn({});
  td.when(mockAdapter.getComputedStyleValue('font')).thenReturn('16px Times');
  const handlers = captureHandlers(mockAdapter, 'registerInteractionHandler');
  const menuHandlers = captureHandlers(mockAdapter, 'registerMenuInteractionHandler');
  foundation.init();
  foundation.destroy();
  Object.keys(handlers).forEach((type) => {
    td.verify(mockAdapter.deregisterInteractionHandler(type, td.matchers.isA(Function)));
  });
  Object.keys(menuHandlers).forEach((type) => {
    td.verify(
      mockAdapter.deregisterMenuInteractionHandler(type, td.matchers.isA(Function))
    );
  });
});

test('#getValue() returns the value of the option at the selected index', () => {
  const {foundation, mockAdapter} = setupTest();
  const opts = ['a', 'SELECTED', 'b'];
  const selectedIndex = 1;
  td.when(mockAdapter.getNumberOfOptions()).thenReturn(opts.length);
  td.when(mockAdapter.getValueForOptionAtIndex(selectedIndex)).thenReturn(opts[selectedIndex]);
  td.when(mockAdapter.getTextForOptionAtIndex(selectedIndex)).thenReturn(`${opts[selectedIndex]} text`);

  foundation.setSelectedIndex(selectedIndex);
  assert.equal(foundation.getValue(), opts[selectedIndex]);
});

test('#getValue() returns an empty string if selected index < 0', () => {
  const {foundation} = setupTest();
  assert.equal(foundation.getValue(), '');
});
