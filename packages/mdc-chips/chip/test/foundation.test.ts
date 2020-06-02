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
      'addClassToLeadingIcon',
      'eventTargetHasClass',
      'focusPrimaryAction',
      'focusTrailingAction',
      'getAttribute',
      'getCheckmarkBoundingClientRect',
      'getComputedStyleValue',
      'getRootBoundingClientRect',
      'hasClass',
      'hasLeadingIcon',
      'isRTL',
      'isTrailingActionNavigable',
      'notifyEditFinish',
      'notifyEditStart',
      'notifyInteraction',
      'notifyNavigation',
      'notifyRemoval',
      'notifySelection',
      'notifyTrailingIconInteraction',
      'removeClass',
      'removeClassFromLeadingIcon',
      'removeTrailingActionFocus',
      'setPrimaryActionAttr',
      'setStyleProperty',
    ]);
  });

  const setupTest = () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCChipFoundation);

    mockAdapter.eventTargetHasClass.and.returnValue(false);
    mockAdapter.hasClass.and.returnValue(false);

    return {foundation, mockAdapter};
  };

  it('#isSelected returns true if mdc-chip--selected class is present', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.SELECTED).and.returnValue(true);
    expect(foundation.isSelected()).toBe(true);
  });

  it('#isSelected returns false if mdc-chip--selected class is not present',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.SELECTED)
           .and.returnValue(false);
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

  it('#isEditable returns true if mdc-chip--editable class is present', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.EDITABLE).and.returnValue(true);
    expect(foundation.isEditable()).toBe(true);
  });

  it('#isEditable returns false if mdc-chip--editable class is not present',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.EDITABLE)
           .and.returnValue(false);
       expect(foundation.isEditable()).toBe(false);
     });

  it('#isEditing returns true if mdc-chip--editing class is present', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.EDITING).and.returnValue(true);
    expect(foundation.isEditing()).toBe(true);
  });

  it('#isEditing returns false if mdc-chip--editing class is not present',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.EDITING).and.returnValue(false);
       expect(foundation.isEditing()).toBe(false);
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

  it('#handleKeydown does not emit event on invalid key', () => {
    const {foundation, mockAdapter} = setupTest();
    const mockEvt = {
      type: 'keydown',
      key: 'Shift',
    };

    foundation.handleKeydown(mockEvt);
    expect(mockAdapter.notifyInteraction).not.toHaveBeenCalled();
    expect(mockAdapter.notifyNavigation).not.toHaveBeenCalled();
  });

  it(`#handleClick() notifies interaction`, () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.handleClick();
    expect(mockAdapter.notifyInteraction).toHaveBeenCalled();
  });

  it('#handleClick() focuses the primary action by default', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.handleClick();
    expect(mockAdapter.setPrimaryActionAttr)
        .toHaveBeenCalledWith(strings.TAB_INDEX, '0');
    expect(mockAdapter.removeTrailingActionFocus).toHaveBeenCalled();
    expect(mockAdapter.focusPrimaryAction).toHaveBeenCalled();
  });

  it('#handleclick() does not focus the primary action when configured', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setShouldFocusPrimaryActionOnClick(false);

    foundation.handleClick();
    expect(mockAdapter.focusPrimaryAction).not.toHaveBeenCalled();
  });

  it('#handleDoubleClick() begins editing when editable', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.EDITABLE).and.returnValue(true);
    foundation.handleDoubleClick();
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.EDITING);
    expect(mockAdapter.notifyEditStart).toHaveBeenCalled();
  });

  it('#handleDoubleClick() does nothing when not editable', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.EDITABLE).and.returnValue(false);
    foundation.handleDoubleClick();
    expect(mockAdapter.addClass).not.toHaveBeenCalled();
    expect(mockAdapter.notifyEditStart).not.toHaveBeenCalled();
  });

  const validKeyDownTable = [
    {
      type: 'keydown',
      key: 'Enter',
    },
    {
      type: 'keydown',
      key: ' ',  // Space bar
    },
  ];

  for (const evt of validKeyDownTable) {
    it(`#handleKeydown(${evt.key}) notifies interaction`, () => {
      const {foundation, mockAdapter} = setupTest();

      foundation.handleKeydown(evt);
      expect(mockAdapter.notifyInteraction).toHaveBeenCalled();
    });

    it(`#handleKeydown(${evt.key}) focuses the primary action`, () => {
      const {foundation, mockAdapter} = setupTest();

      foundation.handleKeydown(evt);
      expect(mockAdapter.setPrimaryActionAttr)
          .toHaveBeenCalledWith(strings.TAB_INDEX, '0');
      expect(mockAdapter.removeTrailingActionFocus).toHaveBeenCalled();
      expect(mockAdapter.focusPrimaryAction).toHaveBeenCalled();
    });

    it(`#handleKeydown(${
           evt.key}) does not focus the primary action when configured`,
       () => {
         const {foundation, mockAdapter} = setupTest();
         foundation.setShouldFocusPrimaryActionOnClick(false);

         foundation.handleKeydown(evt);
         expect(mockAdapter.focusPrimaryAction).not.toHaveBeenCalled();
       });
  }

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

  it('#handleTrailingActionInteraction emits custom event', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.handleTrailingActionInteraction();
    expect(mockAdapter.notifyTrailingIconInteraction).toHaveBeenCalled();
  });

  it(`#handleTrailingActionInteraction adds ${
         cssClasses.CHIP_EXIT} class by default on click in trailing icon`,
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.handleTrailingActionInteraction();
       expect(foundation.getShouldRemoveOnTrailingIconClick()).toBe(true);
       expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.CHIP_EXIT);
     });

  it(`#handleTrailingActionInteraction does not add ${
         cssClasses.CHIP_EXIT} class on click in trailing icon ` +
         'if shouldRemoveOnTrailingIconClick_ is false',
     () => {
       const {foundation, mockAdapter} = setupTest();

       foundation.setShouldRemoveOnTrailingIconClick(false);
       foundation.handleTrailingActionInteraction();
       expect(foundation.getShouldRemoveOnTrailingIconClick()).toBe(false);
       expect(mockAdapter.addClass)
           .not.toHaveBeenCalledWith(cssClasses.CHIP_EXIT);
     });

  const navigationKeyTable = [
    strings.ARROW_UP_KEY,
    strings.IE_ARROW_UP_KEY,
    strings.HOME_KEY,
    strings.ARROW_DOWN_KEY,
    strings.IE_ARROW_DOWN_KEY,
    strings.END_KEY,
  ];

  for (const key of navigationKeyTable) {
    it(`#handleKeydown emits custom event for key ${key}`, () => {
      const {foundation, mockAdapter} = setupTest();
      const mockEvt = {
        type: 'keydown',
        preventDefault: jasmine.createSpy('.preventDefault'),
        key,
      };
      foundation.handleKeydown(mockEvt);
      expect(mockAdapter.notifyNavigation)
          .toHaveBeenCalledWith(key, EventSource.PRIMARY);
    });
  }

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

  function setupFocusOutTest(
      {isEventFromPrimaryAction = false, isEditing = false} = {}) {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.eventTargetHasClass.and.returnValue(isEventFromPrimaryAction);
    mockAdapter.hasClass.withArgs(cssClasses.EDITING)
        .and.returnValue(isEditing);
    return {mockAdapter, foundation};
  }

  it(`#handleFocusOut removes class ${
         cssClasses
             .PRIMARY_ACTION_FOCUSED} when the event comes from the primary action`,
     () => {
       const {mockAdapter, foundation} =
           setupFocusOutTest({isEventFromPrimaryAction: true});
       foundation.handleFocusOut({type: 'focusout'});
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(cssClasses.PRIMARY_ACTION_FOCUSED);
     });

  it(`#handleFocusOut finishes editing when the chip is being edited and the event comes from the primary action`,
     () => {
       const {mockAdapter, foundation} =
           setupFocusOutTest({isEventFromPrimaryAction: true, isEditing: true});
       foundation.handleFocusOut({type: 'focusout'});
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.EDITING);
       expect(mockAdapter.notifyEditFinish).toHaveBeenCalled();
     });

  it(`#handleFocusOut does not finish editing when the chip is not being edited`,
     () => {
       const {mockAdapter, foundation} = setupFocusOutTest(
           {isEventFromPrimaryAction: true, isEditing: false});
       foundation.handleFocusOut({type: 'focusout'});
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(cssClasses.EDITING);
       expect(mockAdapter.notifyEditFinish).not.toHaveBeenCalled();
     });

  it('#handleFocusOut does nothing when the event does not come from the primary action',
     () => {
       const {mockAdapter, foundation} =
           setupFocusOutTest({isEventFromPrimaryAction: false});
       foundation.handleFocusOut({type: 'focusout'});
       expect(mockAdapter.removeClass)
           .not.toHaveBeenCalledWith(cssClasses.PRIMARY_ACTION_FOCUSED);
     });

  function setupNavigationTest({
    isTrailingActionNavigable = false,
    isRTL = false,
    isDeletable = false,
    isEditable = false,
    isEditing = false,
    isEventFromPrimaryAction = false
  } = {}) {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.isTrailingActionNavigable.and.returnValue(
        isTrailingActionNavigable);
    mockAdapter.isRTL.and.returnValue(isRTL);
    mockAdapter.hasClass.withArgs(cssClasses.DELETABLE)
        .and.returnValue(isDeletable);
    mockAdapter.hasClass.withArgs(cssClasses.EDITABLE)
        .and.returnValue(isEditable);
    mockAdapter.hasClass.withArgs(cssClasses.EDITING)
        .and.returnValue(isEditing);
    mockAdapter.eventTargetHasClass.and.returnValue(isEventFromPrimaryAction);
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

  const rightKeyNavigationTable = [
    strings.ARROW_RIGHT_KEY,
    strings.IE_ARROW_RIGHT_KEY,
  ];

  const leftKeyNavigationTable = [
    strings.ARROW_LEFT_KEY,
    strings.IE_ARROW_LEFT_KEY,
  ];

  const removeKeyNavigationTable = [
    strings.BACKSPACE_KEY,
    strings.DELETE_KEY,
    strings.IE_DELETE_KEY,
  ];

  const startEditingNavigationTable = [
    strings.ENTER_KEY,
  ];

  const finishEditingNavigationTable = [
    strings.ENTER_KEY,
  ];

  for (const key of leftKeyNavigationTable) {
    it(`#handleKeydown ${key} emits appropriate event`, () => {
      const {foundation, mockAdapter} = setupNavigationTest();
      foundation.handleKeydown(mockKeyboardEvent(key));
      expect(mockAdapter.notifyNavigation)
          .toHaveBeenCalledWith(key, EventSource.PRIMARY);
    });

    it(`#handleKeydown ${key} emits appropriate event in RTL`, () => {
      const {foundation, mockAdapter} = setupNavigationTest({
        isRTL: true,
      });
      foundation.handleKeydown(mockKeyboardEvent(key));
      expect(mockAdapter.notifyNavigation)
          .toHaveBeenCalledWith(key, EventSource.PRIMARY);
    });

    it(`#handleTrailingActionNavigation ${key} emits appropriate event in RTL`,
       () => {
         const {foundation, mockAdapter} = setupNavigationTest({
           isRTL: true,
         });
         foundation.handleTrailingActionNavigation({detail: {key}});
         expect(mockAdapter.notifyNavigation)
             .toHaveBeenCalledWith(key, EventSource.TRAILING);
       });

    it(`#handleKeydown ${
           key} with navigable trailing action focuses trailing action in RTL`,
       () => {
         const {foundation, mockAdapter} = setupNavigationTest({
           isRTL: true,
           isTrailingActionNavigable: true,
         });
         foundation.handleKeydown(mockKeyboardEvent(key));
         expect(mockAdapter.setPrimaryActionAttr)
             .toHaveBeenCalledWith('tabindex', '-1');
         expect(mockAdapter.focusTrailingAction).toHaveBeenCalled();
       });

    it(`#handleTrailingActionNavigation ${
           key} from navigable trailing action focuses primary action`,
       () => {
         const {foundation, mockAdapter} = setupNavigationTest({
           isTrailingActionNavigable: true,
         });
         foundation.handleTrailingActionNavigation({detail: {key}});
         expect(mockAdapter.removeTrailingActionFocus).toHaveBeenCalled();
         expect(mockAdapter.setPrimaryActionAttr)
             .toHaveBeenCalledWith('tabindex', '0');
         expect(mockAdapter.focusPrimaryAction).toHaveBeenCalled();
       });
  }

  for (const key of rightKeyNavigationTable) {
    it(`#handleKeydown ${key} emits appropriate event`, () => {
      const {foundation, mockAdapter} = setupNavigationTest();
      foundation.handleKeydown(mockKeyboardEvent(key));
      expect(mockAdapter.notifyNavigation)
          .toHaveBeenCalledWith(key, EventSource.PRIMARY);
    });

    it(`#handleKeydown ${key} emits appropriate event in RTL`, () => {
      const {foundation, mockAdapter} = setupNavigationTest({
        isRTL: true,
      });
      foundation.handleKeydown(mockKeyboardEvent(key));
      expect(mockAdapter.notifyNavigation)
          .toHaveBeenCalledWith(key, EventSource.PRIMARY);
    });

    it(`#handleTrailingActionNavigation ${key} emits appropriate event`, () => {
      const {foundation, mockAdapter} = setupNavigationTest();
      foundation.handleTrailingActionNavigation({detail: {key}});
      expect(mockAdapter.notifyNavigation)
          .toHaveBeenCalledWith(key, EventSource.TRAILING);
    });

    it(`#handleKeydown ${
           key} with navigable trailing action focuses trailing action`,
       () => {
         const {foundation, mockAdapter} = setupNavigationTest({
           isTrailingActionNavigable: true,
         });
         foundation.handleKeydown(mockKeyboardEvent(key));
         expect(mockAdapter.setPrimaryActionAttr)
             .toHaveBeenCalledWith('tabindex', '-1');
         expect(mockAdapter.focusTrailingAction).toHaveBeenCalled();
       });

    it(`#handleTrailingActionNavigation ${
           key} from navigable trailing action focuses primary action in RTL`,
       () => {
         const {foundation, mockAdapter} = setupNavigationTest({
           isTrailingActionNavigable: true,
           isRTL: true,
         });
         foundation.handleTrailingActionNavigation({detail: {key}});
         expect(mockAdapter.removeTrailingActionFocus).toHaveBeenCalled();
         expect(mockAdapter.setPrimaryActionAttr)
             .toHaveBeenCalledWith('tabindex', '0');
         expect(mockAdapter.focusPrimaryAction).toHaveBeenCalled();
       });
  }

  for (const key of removeKeyNavigationTable) {
    /**
     * Verify deletability when class is present
     */
    it(`#handleKeydown ${
           key} adds the chip exit class when deletable class is present on root`,
       () => {
         const {foundation, mockAdapter} =
             setupNavigationTest({isDeletable: true});
         foundation.handleKeydown(mockKeyboardEvent(key));
         expect(mockAdapter.addClass)
             .toHaveBeenCalledWith(cssClasses.CHIP_EXIT);
       });

    /**
     * Verify no deletability when class is absent
     */
    it(`#handleKeydown ${key} does not add the chip exit class` +
           ` when deletable class is absent from root`,
       () => {
         const {foundation, mockAdapter} = setupNavigationTest();
         foundation.handleKeydown(mockKeyboardEvent(key));
         expect(mockAdapter.addClass)
             .not.toHaveBeenCalledWith(cssClasses.CHIP_EXIT);
       });
  }

  for (const key of startEditingNavigationTable) {
    it(`#handleKeydown ${key} starts editing if editable and on primary action`,
       () => {
         const {foundation, mockAdapter} = setupNavigationTest({
           isEditable: true,
           isEventFromPrimaryAction: true,
         });
         foundation.handleKeydown(mockKeyboardEvent(key));
         expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.EDITING);
         expect(mockAdapter.notifyEditStart).toHaveBeenCalled();
       });

    it(`#handleKeydown ${key} does nothing if not editable`, () => {
      const {foundation, mockAdapter} = setupNavigationTest({
        isEventFromPrimaryAction: true,
      });
      foundation.handleKeydown(mockKeyboardEvent(key));
      expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.EDITING);
      expect(mockAdapter.notifyEditStart).not.toHaveBeenCalled();
    });

    it(`#handleKeydown ${key} does nothing if not on the primary action`,
       () => {
         const {foundation, mockAdapter} = setupNavigationTest({
           isEditable: true,
         });
         foundation.handleKeydown(mockKeyboardEvent(key));
         expect(mockAdapter.addClass)
             .not.toHaveBeenCalledWith(cssClasses.EDITING);
         expect(mockAdapter.notifyEditStart).not.toHaveBeenCalled();
       });
  }

  for (const key of finishEditingNavigationTable) {
    it(`#handleKeydown ${key} finishes editing if editing`, () => {
      const {foundation, mockAdapter} = setupNavigationTest({
        isEditing: true,
      });
      foundation.handleKeydown(mockKeyboardEvent(key));
      expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.EDITING);
      expect(mockAdapter.notifyEditFinish).toHaveBeenCalled();
    });

    it(`#handleKeydown ${key} does not finish editing if not editing`, () => {
      const {foundation, mockAdapter} = setupNavigationTest();
      foundation.handleKeydown(mockKeyboardEvent(key));
      expect(mockAdapter.removeClass)
          .not.toHaveBeenCalledWith(cssClasses.EDITING);
      expect(mockAdapter.notifyEditFinish).not.toHaveBeenCalled();
    });

    it(`#handleKeydown ${key} does not start editing after finishing`, () => {
      const {foundation, mockAdapter} = setupNavigationTest({
        isEditable: true,
        isEditing: true,
        isEventFromPrimaryAction: true,
      });
      foundation.handleKeydown(mockKeyboardEvent(key));
      expect(mockAdapter.addClass).not.toHaveBeenCalledWith(cssClasses.EDITING);
      expect(mockAdapter.notifyEditStart).not.toHaveBeenCalled();
    });
  }

  it('#focusPrimaryAction() gives focus to the primary action', () => {
    const {foundation, mockAdapter} = setupNavigationTest();
    foundation.focusPrimaryAction();
    expect(mockAdapter.removeTrailingActionFocus).toHaveBeenCalled();
    expect(mockAdapter.setPrimaryActionAttr)
        .toHaveBeenCalledWith('tabindex', '0');
    expect(mockAdapter.focusPrimaryAction).toHaveBeenCalled();
  });

  it('#focusTrailingAction() gives focus to the primary action when the trailing action is absent',
     () => {
       const {foundation, mockAdapter} = setupNavigationTest();
       mockAdapter.isTrailingActionNavigable.and.returnValue(false);
       foundation.focusTrailingAction();
       expect(mockAdapter.removeTrailingActionFocus).toHaveBeenCalled();
       expect(mockAdapter.setPrimaryActionAttr)
           .toHaveBeenCalledWith('tabindex', '0');
       expect(mockAdapter.focusPrimaryAction).toHaveBeenCalled();
     });

  it('#focusTrailingAction() gives focus to the trailing action when the trailing action is present',
     () => {
       const {foundation, mockAdapter} = setupNavigationTest();
       mockAdapter.isTrailingActionNavigable.and.returnValue(true);
       foundation.focusTrailingAction();
       expect(mockAdapter.setPrimaryActionAttr)
           .toHaveBeenCalledWith('tabindex', '-1');
       expect(mockAdapter.focusTrailingAction).toHaveBeenCalled();
     });

  it('#removeFocus() sets tabindex -1 on the primary and trailing action',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.removeFocus();
       expect(mockAdapter.setPrimaryActionAttr)
           .toHaveBeenCalledWith(strings.TAB_INDEX, '-1');
       expect(mockAdapter.removeTrailingActionFocus).toHaveBeenCalled();
     });
});
