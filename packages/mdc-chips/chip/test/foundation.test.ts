/**
 * @license
 * Copyright 2017 Google Inc.
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
import {EventSource} from '../constants';
import {MDCChipFoundation} from '../foundation';

const {cssClasses, strings} = MDCChipFoundation;

describe('MDCChipFoundation', () => {
  setUpMdcTestEnvironment();

  it('exports strings', () => {
    expect('strings' in MDCChipFoundation).toBeTruthy();
  });

  it('exports cssClasses', () => {
    expect('cssClasses' in MDCChipFoundation).toBeTruthy();
  });

  it('defaultAdapter returns a complete adapter implementation', () => {
    verifyDefaultAdapter(MDCChipFoundation, [
      'addClass',
      'removeClass',
      'hasClass',
      'addClassToLeadingIcon',
      'removeClassFromLeadingIcon',
      'eventTargetHasClass',
      'notifyInteraction',
      'notifyTrailingIconInteraction',
      'notifyRemoval',
      'notifySelection',
      'getComputedStyleValue',
      'setStyleProperty',
      'hasLeadingIcon',
      'getRootBoundingClientRect',
      'getCheckmarkBoundingClientRect',
      'notifyNavigation',
      'focusPrimaryAction',
      'focusTrailingAction',
      'hasTrailingAction',
      'isRTL',
      'setPrimaryActionAttr',
      'setTrailingActionAttr',
      'getAttribute',
    ]);
  });

  const setupTest =
      () => {
        const {foundation, mockAdapter} =
            setUpFoundationTest(MDCChipFoundation);

        mockAdapter.eventTargetHasClass.and.returnValue(false);
        mockAdapter.hasClass.and.returnValue(false);

        return {foundation, mockAdapter};
      }

  it('#isSelected returns true if mdc-chip--selected class is present', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.and.returnValue(true);
    expect(foundation.isSelected()).toBe(true);
  });

  it('#isSelected returns false if mdc-chip--selected class is not present',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.and.returnValue(false);
       expect(foundation.isSelected()).toBe(false);
     });

  it('#setSelected adds mdc-chip--selected class if true', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setSelected(true);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.SELECTED);
  });

  it('#setSelected removes mdc-chip--selected class if false', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setSelected(false);
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.SELECTED);
  });

  it('#setSelected sets aria-checked="true" if true', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setSelected(true);
    expect(mockAdapter.setPrimaryActionAttr)
        .toHaveBeenCalledWith(strings.ARIA_CHECKED, 'true');
  });

  it('#setSelected sets aria-checked="false" if false', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setSelected(false);
    expect(mockAdapter.setPrimaryActionAttr)
        .toHaveBeenCalledWith(strings.ARIA_CHECKED, 'false');
  });

  it('#setSelected notifies of selection when selected is true', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setSelected(true);
    expect(mockAdapter.notifySelection).toHaveBeenCalledWith(true, false);
  });

  it('#setSelected notifies of unselection when selected is false', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setSelected(false);
    expect(mockAdapter.notifySelection).toHaveBeenCalledWith(false, false);
  });

  it('#setSelectedFromChipSet notifies of selection with shouldIgnore set to true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setSelectedFromChipSet(true, true);
       expect(mockAdapter.notifySelection).toHaveBeenCalledWith(true, true);
     });

  it('#getDimensions returns adapter.getRootBoundingClientRect when there is no checkmark bounding rect',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getCheckmarkBoundingClientRect.and.returnValue(null);
       const boundingRect = {width: 10, height: 10};
       mockAdapter.getRootBoundingClientRect.and.returnValue(boundingRect);

       expect(foundation.getDimensions() === boundingRect).toBe(true);
     });

  it('#getDimensions factors in the checkmark bounding rect when it exists and there is no leading icon',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const boundingRect = {width: 10, height: 10};
       const checkmarkBoundingRect = {width: 5, height: 5};
       mockAdapter.getCheckmarkBoundingClientRect.and.returnValue(
           checkmarkBoundingRect);
       mockAdapter.getRootBoundingClientRect.and.returnValue(boundingRect);
       mockAdapter.hasLeadingIcon.and.returnValue(false);

       const dimensions = foundation.getDimensions();
       expect(dimensions.height).toEqual(boundingRect.height);
       expect(dimensions.width)
           .toEqual(boundingRect.width + checkmarkBoundingRect.height);
     });

  it('#getDimensions returns adapter.getRootBoundingClientRect when there is a checkmark and a leading icon',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const checkmarkBoundingRect = {width: 5, height: 5};
       mockAdapter.getCheckmarkBoundingClientRect.and.returnValue(
           checkmarkBoundingRect);
       const boundingRect = {width: 10, height: 10};
       mockAdapter.getRootBoundingClientRect.and.returnValue(boundingRect);
       mockAdapter.hasLeadingIcon.and.returnValue(true);

       expect(foundation.getDimensions() === boundingRect).toBe(true);
     });

  it(`#beginExit adds ${cssClasses.CHIP_EXIT} class`, () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.beginExit();
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.CHIP_EXIT);
  });

  it('#handleInteraction does not emit event on invalid key', () => {
    const {foundation, mockAdapter} = setupTest();
    const mockEvt = {
      type: 'keydown',
      key: 'Shift',
    };

    foundation.handleInteraction(mockEvt);
    expect(mockAdapter.notifyInteraction).not.toHaveBeenCalled();
  });

  const validEvents = [
    {
      type: 'click',
    },
    {
      type: 'keydown',
      key: 'Enter',
    },
    {
      type: 'keydown',
      key: ' ',  // Space bar
    },
  ];

  validEvents.forEach((evt) => {
    it(`#handleInteraction(${evt}) notifies interaction`, () => {
      const {foundation, mockAdapter} = setupTest();

      foundation.handleInteraction(evt);
      expect(mockAdapter.notifyInteraction).toHaveBeenCalled();
    });

    it(`#handleInteraction(${evt}) focuses the primary action`, () => {
      const {foundation, mockAdapter} = setupTest();

      foundation.handleInteraction(evt);
      expect(mockAdapter.setPrimaryActionAttr)
          .toHaveBeenCalledWith(strings.TAB_INDEX, '0');
      expect(mockAdapter.setTrailingActionAttr)
          .toHaveBeenCalledWith(strings.TAB_INDEX, '-1');
      expect(mockAdapter.focusPrimaryAction).toHaveBeenCalled();
    });

    it(`#handleInteraction(${
           evt}) does not focus the primary action when configured`,
       () => {
         const {foundation, mockAdapter} = setupTest();
         foundation.setShouldFocusPrimaryActionOnClick(false);

         foundation.handleInteraction(evt);
         expect(mockAdapter.setPrimaryActionAttr)
             .toHaveBeenCalledWith(strings.TAB_INDEX, '0');
         expect(mockAdapter.setTrailingActionAttr)
             .toHaveBeenCalledWith(strings.TAB_INDEX, '-1');
         expect(mockAdapter.focusPrimaryAction).not.toHaveBeenCalled();
       });
  });

  it('#handleTransitionEnd notifies removal of chip on width transition end',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const mockEvt = {
         type: 'transitionend',
         target: {},
         propertyName: 'width',
       };
       mockAdapter.eventTargetHasClass.and.returnValue(true);

       foundation.handleTransitionEnd(mockEvt);

       expect(mockAdapter.notifyRemoval).toHaveBeenCalled();
     });

  it('#handleTransitionEnd notifies removal of chip with removal announcement if present',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const mockEvt = {
         type: 'transitionend',
         target: {},
         propertyName: 'width',
       };
       mockAdapter.eventTargetHasClass.and.returnValue(true);
       mockAdapter.getAttribute.and.returnValue('Removed foo');

       foundation.handleTransitionEnd(mockEvt);

       expect(mockAdapter.notifyRemoval).toHaveBeenCalledWith('Removed foo');
     });

  it('#handleTransitionEnd animates width if chip is exiting on chip opacity transition end',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const mockEvt = {
         type: 'transitionend',
         target: {},
         propertyName: 'opacity',
       };
       mockAdapter.eventTargetHasClass.and.returnValue(true);
       mockAdapter.getComputedStyleValue.and.returnValue('100px');

       foundation.handleTransitionEnd(mockEvt);

       jasmine.clock().tick(1);
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('width', '100px');
       expect(mockAdapter.setStyleProperty)
           .toHaveBeenCalledWith('padding', '0');
       expect(mockAdapter.setStyleProperty).toHaveBeenCalledWith('margin', '0');

       jasmine.clock().tick(1);
       expect(mockAdapter.setStyleProperty).toHaveBeenCalledWith('width', '0');
     });

  it(`#handleTransitionEnd adds ${
         cssClasses.HIDDEN_LEADING_ICON} class to leading icon ` +
         'on leading icon opacity transition end, if chip is selected',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const mockEvt = {
         type: 'transitionend',
         target: {},
         propertyName: 'opacity',
       };
       mockAdapter.eventTargetHasClass
           .withArgs(mockEvt.target, cssClasses.CHIP_EXIT)
           .and.returnValue(false);
       mockAdapter.eventTargetHasClass
           .withArgs(mockEvt.target, cssClasses.LEADING_ICON)
           .and.returnValue(true);
       mockAdapter.hasClass.withArgs(cssClasses.SELECTED).and.returnValue(true);

       foundation.handleTransitionEnd(mockEvt);

       expect(mockAdapter.addClassToLeadingIcon)
           .toHaveBeenCalledWith(cssClasses.HIDDEN_LEADING_ICON);
     });

  it('#handleTransitionEnd does nothing on leading icon opacity transition end,' +
         'if chip is not selected',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const mockEvt = {
         type: 'transitionend',
         target: {},
         propertyName: 'opacity',
       };
       mockAdapter.eventTargetHasClass.and.returnValue(true);

       foundation.handleTransitionEnd(mockEvt);

       expect(mockAdapter.addClassToLeadingIcon)
           .not.toHaveBeenCalledWith(cssClasses.HIDDEN_LEADING_ICON);
     });

  it(`#handleTransitionEnd removes ${
         cssClasses.HIDDEN_LEADING_ICON} class from leading icon ` +
         'on checkmark opacity transition end, if chip is not selected',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const mockEvt = {
         type: 'transitionend',
         target: {},
         propertyName: 'opacity',
       };
       mockAdapter.eventTargetHasClass
           .withArgs(mockEvt.target, cssClasses.CHECKMARK)
           .and.returnValue(true);

       foundation.handleTransitionEnd(mockEvt);

       expect(mockAdapter.removeClassFromLeadingIcon)
           .toHaveBeenCalledWith(cssClasses.HIDDEN_LEADING_ICON);
     });

  it('#handleTransitionEnd does nothing on checkmark opacity transition end, if chip is selected',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const mockEvt = {
         type: 'transitionend',
         target: {},
         propertyName: 'opacity',
       };
       mockAdapter.eventTargetHasClass.and.returnValue(true);
       mockAdapter.hasClass.and.returnValue(true);

       foundation.handleTransitionEnd(mockEvt);

       expect(mockAdapter.removeClassFromLeadingIcon)
           .not.toHaveBeenCalledWith(cssClasses.HIDDEN_LEADING_ICON);
     });

  it('#handleTransitionEnd does nothing for width property when not exiting',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const mockEvt = {
         type: 'transitionend',
         target: {},
         propertyName: 'width',
       };

       foundation.handleTransitionEnd(mockEvt);

       expect(mockAdapter.notifyRemoval).not.toHaveBeenCalled();
       expect(mockAdapter.addClassToLeadingIcon)
           .not.toHaveBeenCalledWith(cssClasses.HIDDEN_LEADING_ICON);
       expect(mockAdapter.removeClassFromLeadingIcon)
           .not.toHaveBeenCalledWith(cssClasses.HIDDEN_LEADING_ICON);
     });

  it('#handleTrailingIconInteraction emits no event on invalid keys', () => {
    const {foundation, mockAdapter} = setupTest();
    const mockEvt = {
      type: 'keydowb',
      key: 'Shift',
      stopPropagation: jasmine.createSpy('stopPropagation'),
    };

    foundation.handleTrailingIconInteraction(mockEvt);
    expect(mockAdapter.notifyTrailingIconInteraction).not.toHaveBeenCalled();
  });

  it('#handleTrailingIconInteraction emits custom event on click or enter key in trailing icon',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const mockEvt = {
         type: 'click',
         stopPropagation: jasmine.createSpy('stopPropagation'),
         preventDefault: jasmine.createSpy('preventDefault'),
         key: '',
       };

       foundation.handleTrailingIconInteraction(mockEvt);
       expect(mockAdapter.notifyTrailingIconInteraction)
           .toHaveBeenCalledTimes(1);
       expect(mockEvt.stopPropagation).toHaveBeenCalledTimes(1);
       expect(mockEvt.preventDefault).toHaveBeenCalledTimes(1);

       mockEvt.type = 'keydown';
       mockEvt.key = ' ';
       foundation.handleTrailingIconInteraction(mockEvt);
       expect(mockAdapter.notifyTrailingIconInteraction)
           .toHaveBeenCalledTimes(2);
       expect(mockEvt.stopPropagation).toHaveBeenCalledTimes(2);
       expect(mockEvt.preventDefault).toHaveBeenCalledTimes(2);

       mockEvt.type = 'keydown';
       mockEvt.key = 'Enter';
       foundation.handleTrailingIconInteraction(mockEvt);
       expect(mockAdapter.notifyTrailingIconInteraction)
           .toHaveBeenCalledTimes(3);
       expect(mockEvt.stopPropagation).toHaveBeenCalledTimes(3);
       expect(mockEvt.preventDefault).toHaveBeenCalledTimes(3);
     });

  it(`#handleTrailingIconInteraction adds ${
         cssClasses.CHIP_EXIT} class by default on click in trailing icon`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       const mockEvt = {
         type: 'click',
         stopPropagation: jasmine.createSpy('stopPropagation'),
         preventDefault: jasmine.createSpy('preventDefault'),
       };

       foundation.handleTrailingIconInteraction(mockEvt);

       expect(foundation.getShouldRemoveOnTrailingIconClick()).toBe(true);
       expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.CHIP_EXIT);
       expect(mockEvt.stopPropagation).toHaveBeenCalled();
       expect(mockEvt.preventDefault).toHaveBeenCalled();
     });

  it(`#handleTrailingIconInteraction does not add ${
         cssClasses.CHIP_EXIT} class on click in trailing icon ` +
         'if shouldRemoveOnTrailingIconClick_ is false',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const mockEvt = {
         type: 'click',
         stopPropagation: jasmine.createSpy('stopPropagation'),
         preventDefault: jasmine.createSpy('preventDefault'),
       };

       foundation.setShouldRemoveOnTrailingIconClick(false);
       foundation.handleTrailingIconInteraction(mockEvt);

       expect(foundation.getShouldRemoveOnTrailingIconClick()).toBe(false);
       expect(mockAdapter.addClass)
           .not.toHaveBeenCalledWith(cssClasses.CHIP_EXIT);
       expect(mockEvt.stopPropagation).toHaveBeenCalled();
       expect(mockEvt.preventDefault).toHaveBeenCalled();
     });

  it('#handleKeydown emits custom event with appropriate keys', () => {
    const {foundation, mockAdapter} = setupTest();

    [strings.ARROW_UP_KEY,
     strings.IE_ARROW_UP_KEY,
     strings.HOME_KEY,
     strings.ARROW_DOWN_KEY,
     strings.IE_ARROW_DOWN_KEY,
     strings.END_KEY,
    ].forEach((key) => {
      const mockEvt = {
        type: 'keydown',
        key,
        preventDefault: jasmine.createSpy('.preventDefault'),
      };

      foundation.handleKeydown(mockEvt);
      expect(mockAdapter.notifyNavigation).toHaveBeenCalledWith(key, 2);
    });
  });

  it('#handleKeydown calls preventDefault on navigation events', () => {
    const {foundation} = setupTest();
    const mockEvt = {
      type: 'keydown',
      key: strings.ARROW_LEFT_KEY,
      preventDefault: jasmine.createSpy('.preventDefault'),
    };

    foundation.handleKeydown(mockEvt);
    expect(mockEvt.preventDefault).toHaveBeenCalledTimes(1);
  });

  it('#handleKeydown does not emit a custom event for inappropriate keys',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const mockEvt = {
         type: 'keydown',
         key: ' ',
       };

       foundation.handleKeydown(mockEvt);
       expect(mockAdapter.notifyNavigation)
           .not.toHaveBeenCalledWith(jasmine.any(String));
     });

  it(`#handleFocusIn adds class ${
         cssClasses
             .PRIMARY_ACTION_FOCUSED} when the event comes from the primary action`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.eventTargetHasClass.and.returnValue(true);
       const mockFocusIn = {
         type: 'focusin',
       };

       foundation.handleFocusIn(mockFocusIn);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(cssClasses.PRIMARY_ACTION_FOCUSED);
     });

  it('#handleFocusIn adds no class when the event does not come from the primary action',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.eventTargetHasClass.and.returnValue(false);
       const mockFocusIn = {
         type: 'focusin',
       };

       foundation.handleFocusIn(mockFocusIn);
       expect(mockAdapter.addClass)
           .not.toHaveBeenCalledWith(cssClasses.PRIMARY_ACTION_FOCUSED);
     });

  it(`#handleFocusOut removes class ${
         cssClasses
             .PRIMARY_ACTION_FOCUSED} when the event comes from the primary action`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.eventTargetHasClass.and.returnValue(true);
       const mockFocusOut = {
         type: 'focusout',
       };

       foundation.handleFocusOut(mockFocusOut);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(cssClasses.PRIMARY_ACTION_FOCUSED);
     });

  it('#handleFocusOut removes no class when the event does not come from the primary action',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.eventTargetHasClass.and.returnValue(false);
       const mockFocusOut = {
         type: 'focusout',
       };

       foundation.handleFocusOut(mockFocusOut);
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(cssClasses.PRIMARY_ACTION_FOCUSED);
     });

  function setupNavigationTest({
    fromPrimaryAction = false,
    hasTrailingAction = false,
    fromTrailingAction = false,
    isRTL = false
  } = {}) {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasTrailingAction.and.returnValue(
        hasTrailingAction || fromTrailingAction);
    mockAdapter.isRTL.and.returnValue(isRTL);
    mockAdapter.eventTargetHasClass
        .withArgs(jasmine.anything(), cssClasses.PRIMARY_ACTION)
        .and.returnValue(fromPrimaryAction);
    mockAdapter.eventTargetHasClass
        .withArgs(jasmine.anything(), cssClasses.TRAILING_ACTION)
        .and.returnValue(fromTrailingAction);
    return {mockAdapter, foundation};
  }

  function mockKeyboardEvent(key: string) {
    return {
      type: 'keydown',
      preventDefault: jasmine.createSpy('.preventDefault'),
      stopPropagation: jasmine.createSpy('.stopPropagation'),
      target: jasmine.createSpy('.target'),
      key,
    };
  }

  [strings.ARROW_LEFT_KEY, strings.IE_ARROW_LEFT_KEY].forEach((key) => {
    it(`#handleKeydown ${key} from focused text emits appropriate event`,
       () => {
         const {foundation, mockAdapter} = setupNavigationTest({
           fromPrimaryAction: true,
         });
         foundation.handleKeydown(mockKeyboardEvent(key));
         expect(mockAdapter.notifyNavigation)
             .toHaveBeenCalledWith(key, EventSource.PRIMARY);
       });
  });

  [strings.ARROW_RIGHT_KEY, strings.IE_ARROW_RIGHT_KEY].forEach((key) => {
    it(`#handleKeydown ${key} from focused text emits appropriate event`,
       () => {
         const {foundation, mockAdapter} = setupNavigationTest({
           fromPrimaryAction: true,
         });
         foundation.handleKeydown(mockKeyboardEvent(key));
         expect(mockAdapter.notifyNavigation)
             .toHaveBeenCalledWith(key, EventSource.PRIMARY);
       });
  });

  [strings.ARROW_LEFT_KEY, strings.IE_ARROW_LEFT_KEY].forEach((key) => {
    it(`#handleKeydown ${key} from focused text emits appropriate event in RTL`,
       () => {
         const {foundation, mockAdapter} = setupNavigationTest({
           fromPrimaryAction: true,
           isRTL: true,
         });
         foundation.handleKeydown(mockKeyboardEvent(key));
         expect(mockAdapter.notifyNavigation)
             .toHaveBeenCalledWith(key, EventSource.PRIMARY);
       });
  });

  [strings.ARROW_RIGHT_KEY, strings.IE_ARROW_RIGHT_KEY].forEach((key) => {
    it(`#handleKeydown ${key} from focused text emits appropriate event in RTL`,
       () => {
         const {foundation, mockAdapter} = setupNavigationTest({
           fromPrimaryAction: true,
           isRTL: true,
         });
         foundation.handleKeydown(mockKeyboardEvent(key));
         expect(mockAdapter.notifyNavigation)
             .toHaveBeenCalledWith(key, EventSource.PRIMARY);
       });
  });

  [strings.ARROW_RIGHT_KEY, strings.IE_ARROW_RIGHT_KEY].forEach((key) => {
    it(`#handleKeydown ${
           key} from focused trailing action emits appropriate event`,
       () => {
         const {foundation, mockAdapter} = setupNavigationTest({
           fromTrailingAction: true,
         });
         foundation.handleKeydown(mockKeyboardEvent(key));
         expect(mockAdapter.notifyNavigation)
             .toHaveBeenCalledWith(key, EventSource.NONE);
       });
  });

  [strings.ARROW_LEFT_KEY, strings.IE_ARROW_LEFT_KEY].forEach((key) => {
    it(`#handleKeydown ${
           key} from focused trailing action emits appropriate event in RTL`,
       () => {
         const {foundation, mockAdapter} = setupNavigationTest({
           fromTrailingAction: true,
           isRTL: true,
         });
         foundation.handleKeydown(mockKeyboardEvent(key));
         expect(mockAdapter.notifyNavigation)
             .toHaveBeenCalledWith(key, EventSource.NONE);
       });
  });

  [strings.ARROW_RIGHT_KEY, strings.IE_ARROW_RIGHT_KEY].forEach((key) => {
    it(`#handleKeydown ${
           key} from focused text with trailing icon focuses trailing icon`,
       () => {
         const {foundation, mockAdapter} = setupNavigationTest(
             {fromPrimaryAction: true, hasTrailingAction: true});
         foundation.handleKeydown(mockKeyboardEvent(key));
         expect(mockAdapter.setTrailingActionAttr)
             .toHaveBeenCalledWith('tabindex', '0');
         expect(mockAdapter.setPrimaryActionAttr)
             .toHaveBeenCalledWith('tabindex', '-1');
         expect(mockAdapter.focusTrailingAction).toHaveBeenCalled();
       });
  });

  [strings.ARROW_LEFT_KEY, strings.IE_ARROW_LEFT_KEY].forEach((key) => {
    it(`#handleKeydown ${
           key} from focused text with trailing icon focuses trailing icon in RTL`,
       () => {
         const {foundation, mockAdapter} = setupNavigationTest({
           fromPrimaryAction: true,
           isRTL: true,
           hasTrailingAction: true,
         });
         foundation.handleKeydown(mockKeyboardEvent(key));
         expect(mockAdapter.setTrailingActionAttr)
             .toHaveBeenCalledWith('tabindex', '0');
         expect(mockAdapter.setPrimaryActionAttr)
             .toHaveBeenCalledWith('tabindex', '-1');
         expect(mockAdapter.focusTrailingAction).toHaveBeenCalled();
       });
  });

  [strings.ARROW_LEFT_KEY, strings.IE_ARROW_LEFT_KEY].forEach((key) => {
    it(`#handleKeydown ${key} from focused trailing icon focuses text`, () => {
      const {foundation, mockAdapter} = setupNavigationTest(
          {hasTrailingAction: true, fromTrailingAction: true});
      foundation.handleKeydown(mockKeyboardEvent(key));
      expect(mockAdapter.setTrailingActionAttr)
          .toHaveBeenCalledWith('tabindex', '-1');
      expect(mockAdapter.setPrimaryActionAttr)
          .toHaveBeenCalledWith('tabindex', '0');
      expect(mockAdapter.focusPrimaryAction).toHaveBeenCalled();
    });
  });

  [strings.ARROW_RIGHT_KEY, strings.IE_ARROW_RIGHT_KEY].forEach((key) => {
    it(`#handleKeydown ${key} from focused trailing icon focuses text in RTL`,
       () => {
         const {foundation, mockAdapter} = setupNavigationTest(
             {hasTrailingAction: true, fromTrailingAction: true, isRTL: true});
         foundation.handleKeydown(mockKeyboardEvent(key));
         expect(mockAdapter.setTrailingActionAttr)
             .toHaveBeenCalledWith('tabindex', '-1');
         expect(mockAdapter.setPrimaryActionAttr)
             .toHaveBeenCalledWith('tabindex', '0');
         expect(mockAdapter.focusPrimaryAction).toHaveBeenCalled();
       });
  });

  /**
   * Verify deletability when class is present
   */
  [strings.BACKSPACE_KEY,
   strings.DELETE_KEY,
   strings.IE_DELETE_KEY,
  ].forEach((key) => {
    it(`#handleKeydown ${
           key} adds the chip exit class when deletable class is present on root`,
       () => {
         const {foundation, mockAdapter} = setupTest();
         mockAdapter.hasClass.and.returnValue(true);
         foundation.handleKeydown(mockKeyboardEvent(key));
         expect(mockAdapter.addClass)
             .toHaveBeenCalledWith(cssClasses.CHIP_EXIT);
       });
  });

  /**
   * Verify no deletability when class is absent
   */
  [strings.BACKSPACE_KEY,
   strings.DELETE_KEY,
   strings.IE_DELETE_KEY,
  ].forEach((key) => {
    it(`#handleKeydown ${
           key} adds the chip exit class when deletable class is present on root`,
       () => {
         const {foundation, mockAdapter} = setupTest();
         mockAdapter.hasClass.and.returnValue(false);
         foundation.handleKeydown(mockKeyboardEvent(key));
         expect(mockAdapter.addClass)
             .not.toHaveBeenCalledWith(cssClasses.CHIP_EXIT);
       });
  });

  it('#focusPrimaryAction() gives focus to the primary action', () => {
    const {foundation, mockAdapter} = setupNavigationTest();
    foundation.focusPrimaryAction();
    expect(mockAdapter.setTrailingActionAttr)
        .toHaveBeenCalledWith('tabindex', '-1');
    expect(mockAdapter.setPrimaryActionAttr)
        .toHaveBeenCalledWith('tabindex', '0');
    expect(mockAdapter.focusPrimaryAction).toHaveBeenCalled();
  });

  it('#focusTrailingAction() gives focus to the primary action when the trailing action is absent',
     () => {
       const {foundation, mockAdapter} = setupNavigationTest();
       mockAdapter.hasTrailingAction.and.returnValue(false);
       foundation.focusTrailingAction();
       expect(mockAdapter.setTrailingActionAttr)
           .toHaveBeenCalledWith('tabindex', '-1');
       expect(mockAdapter.setPrimaryActionAttr)
           .toHaveBeenCalledWith('tabindex', '0');
       expect(mockAdapter.focusPrimaryAction).toHaveBeenCalled();
     });

  it('#focusTrailingAction() gives focus to the trailing action when the trailing action is present',
     () => {
       const {foundation, mockAdapter} = setupNavigationTest();
       mockAdapter.hasTrailingAction.and.returnValue(true);
       foundation.focusTrailingAction();
       expect(mockAdapter.setPrimaryActionAttr)
           .toHaveBeenCalledWith('tabindex', '-1');
       expect(mockAdapter.setTrailingActionAttr)
           .toHaveBeenCalledWith('tabindex', '0');
       expect(mockAdapter.focusTrailingAction).toHaveBeenCalled();
     });

  it('#removeFocus() sets tabindex -1 on the primary and trailing action',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.removeFocus();
       expect(mockAdapter.setPrimaryActionAttr)
           .toHaveBeenCalledWith(strings.TAB_INDEX, '-1');
       expect(mockAdapter.setTrailingActionAttr)
           .toHaveBeenCalledWith(strings.TAB_INDEX, '-1');
     });
});
