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


import {verifyDefaultAdapter} from '../../../../testing/helpers/foundation';
import {setUpFoundationTest, setUpMdcTestEnvironment} from '../../../../testing/helpers/setup';
import {strings as chipStrings} from '../../chip/constants';
import {InteractionTrigger, strings} from '../constants';
import {MDCChipTrailingActionFoundation} from '../foundation';

describe('MDCChipTrailingActionFoundation', () => {
  setUpMdcTestEnvironment();

  it('exports strings', () => {
    expect('strings' in MDCChipTrailingActionFoundation).toBeTruthy();
  });

  it('defaultAdapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCChipTrailingActionFoundation, [
      'focus',
      'getAttribute',
      'setAttribute',
      'notifyInteraction',
      'notifyNavigation',
    ]);
  });

  const setupTest = () => {
    const {foundation, mockAdapter} =
        setUpFoundationTest(MDCChipTrailingActionFoundation);
    return {foundation, mockAdapter};
  };

  it('#focus sets the tabindex to 0 and gives the action focus', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.focus();
    expect(mockAdapter.setAttribute)
        .toHaveBeenCalledWith(strings.TAB_INDEX, '0');
    expect(mockAdapter.focus).toHaveBeenCalled();
  });

  it('#removeFocus sets the tabindex to -1', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.removeFocus();
    expect(mockAdapter.setAttribute)
        .toHaveBeenCalledWith(strings.TAB_INDEX, '-1');
  });

  it('#isNavigable returns true if aria-hidden is absent', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getAttribute.and.returnValue(null);
    foundation.removeFocus();
    expect(foundation.isNavigable()).toBe(true);
  });

  it('#isNavigable returns false if aria-hidden is "true"', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getAttribute.and.returnValue('true');
    foundation.removeFocus();
    expect(foundation.isNavigable()).toBe(false);
  });

  it('#handleClick notifies interaction', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.handleClick(mockClick());
    expect(mockAdapter.notifyInteraction).toHaveBeenCalled();
  });

  it('#handleClick stops propagation', () => {
    const {foundation} = setupTest();
    const click = mockClick();
    foundation.handleClick(click);
    expect(click.stopPropagation).toHaveBeenCalled();
  });

  [{
    key: chipStrings.SPACEBAR_KEY,
    trigger: InteractionTrigger.SPACEBAR_KEY,
  },
   {
     key: chipStrings.ENTER_KEY,
     trigger: InteractionTrigger.ENTER_KEY,
   },
   {
     key: chipStrings.BACKSPACE_KEY,
     trigger: InteractionTrigger.BACKSPACE_KEY,
   },
   {
     key: chipStrings.DELETE_KEY,
     trigger: InteractionTrigger.DELETE_KEY,
   },
   {
     key: chipStrings.IE_DELETE_KEY,
     trigger: InteractionTrigger.DELETE_KEY,
   }].forEach(({key, trigger}) => {
    it(`#handleKeydown notifies interaction on "${key}" with "${trigger}"`,
       () => {
         const {foundation, mockAdapter} = setupTest();
         foundation.handleKeydown(mockKeyDown(key));
         expect(mockAdapter.notifyInteraction).toHaveBeenCalledWith(trigger);
       });
  });

  [chipStrings.ARROW_UP_KEY,
   chipStrings.ARROW_DOWN_KEY,
   chipStrings.ARROW_RIGHT_KEY,
   chipStrings.ARROW_LEFT_KEY,
   chipStrings.IE_ARROW_UP_KEY,
   chipStrings.IE_ARROW_DOWN_KEY,
   chipStrings.IE_ARROW_RIGHT_KEY,
   chipStrings.IE_ARROW_LEFT_KEY,
  ].forEach((key) => {
    it(`#handleKeydown notifies navigation on "${key}" key down`, () => {
      const {foundation, mockAdapter} = setupTest();
      foundation.handleKeydown(mockKeyDown(key));
      expect(mockAdapter.notifyNavigation).toHaveBeenCalledWith(key);
    });
  });

  it('#handleClick stops propagation', () => {
    const {foundation} = setupTest();
    const keydown = mockKeyDown('ArrowUp');
    foundation.handleKeydown(keydown);
    expect(keydown.stopPropagation).toHaveBeenCalled();
  });
});

function mockKeyDown(key: string) {
  const stopPropagation = jasmine.createSpy('stopPropagation');
  return {
    stopPropagation,
    key,
  };
}

function mockClick() {
  const stopPropagation = jasmine.createSpy('stopPropagation');
  return {
    stopPropagation,
  };
}
