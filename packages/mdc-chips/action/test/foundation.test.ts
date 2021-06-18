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

import {setUpFoundationTest} from '../../../../testing/helpers/setup';
import {ActionType, Attributes, Events, FocusBehavior, InteractionTrigger} from '../constants';
import {MDCChipActionFoundation} from '../foundation';

class SelectableMDCChipActionFoundation extends MDCChipActionFoundation {
  actionType() {
    return ActionType.UNSPECIFIED;
  }

  isSelectable() {
    return true;
  }

  shouldEmitInteractionOnRemoveKey() {
    return false;
  }
}

class NonselectableMDCChipActionFoundation extends MDCChipActionFoundation {
  actionType() {
    return ActionType.UNSPECIFIED;
  }

  isSelectable() {
    return false;
  }

  shouldEmitInteractionOnRemoveKey() {
    return false;
  }
}

class SelectableDeletableMDCChipActionFoundation extends
    MDCChipActionFoundation {
  actionType() {
    return ActionType.UNSPECIFIED;
  }

  isSelectable() {
    return true;
  }

  shouldEmitInteractionOnRemoveKey() {
    return true;
  }
}

describe('MDCChipActionFoundation', () => {
  describe('[shared behavior]', () => {
    const setupTest = () => {
      const {foundation, mockAdapter} =
          setUpFoundationTest(SelectableMDCChipActionFoundation);
      return {foundation, mockAdapter};
    };

    it(`#actionType returns "${ActionType.UNSPECIFIED}"`, () => {
      const {foundation} = setupTest();
      expect(foundation.actionType()).toBe(ActionType.UNSPECIFIED);
    });

    it('#setFocus() does nothing when aria-hidden == true', () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getAttribute.withArgs(Attributes.ARIA_HIDDEN)
          .and.returnValue('true');
      foundation.setFocus(FocusBehavior.FOCUSABLE_AND_FOCUSED);
      foundation.setFocus(FocusBehavior.FOCUSABLE);
      foundation.setFocus(FocusBehavior.NOT_FOCUSABLE);
      expect(mockAdapter.setAttribute).not.toHaveBeenCalled();
      expect(mockAdapter.focus).not.toHaveBeenCalled();
    });

    it(`#setFocus(${FocusBehavior.FOCUSABLE_AND_FOCUSED}) sets tabindex="0"` +
           ` and focuses the root`,
       () => {
         const {foundation, mockAdapter} = setupTest();
         foundation.setFocus(FocusBehavior.FOCUSABLE_AND_FOCUSED);
         expect(mockAdapter.setAttribute).toHaveBeenCalledWith('tabindex', '0');
         expect(mockAdapter.focus).toHaveBeenCalled();
       });

    it(`#setFocus(${FocusBehavior.FOCUSABLE}) sets tabindex="0"`, () => {
      const {foundation, mockAdapter} = setupTest();
      foundation.setFocus(FocusBehavior.FOCUSABLE);
      expect(mockAdapter.setAttribute).toHaveBeenCalledWith('tabindex', '0');
      expect(mockAdapter.focus).not.toHaveBeenCalled();
    });

    it(`#setFocused(${FocusBehavior.NOT_FOCUSABLE}) sets tabindex="-1"`, () => {
      const {foundation, mockAdapter} = setupTest();
      foundation.setFocus(FocusBehavior.NOT_FOCUSABLE);
      expect(mockAdapter.setAttribute).toHaveBeenCalledWith('tabindex', '-1');
    });

    it('#isFocusable returns true if aria-hidden != true', () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getAttribute.withArgs(Attributes.ARIA_HIDDEN)
          .and.returnValue(null);
      expect(foundation.isFocusable()).toBe(true);
    });

    it('#isFocusable returns false if aria-hidden == true', () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getAttribute.withArgs(Attributes.ARIA_HIDDEN)
          .and.returnValue('true');
      expect(foundation.isFocusable()).toBe(false);
    });

    it('#isFocusable returns true if aria-disabled != true', () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getAttribute.withArgs(Attributes.ARIA_DISABLED)
          .and.returnValue('false');
      expect(foundation.isFocusable()).toBe(true);
    });

    it('#isFocusable returns false if aria-disabled == true', () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getAttribute.withArgs(Attributes.ARIA_DISABLED)
          .and.returnValue('true');
      expect(foundation.isFocusable()).toBe(false);
    });

    it('#isFocusable returns false if role="presentation"', () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getAttribute.withArgs(Attributes.ROLE)
          .and.returnValue('presentation');
      expect(foundation.isFocusable()).toBe(false);
    });

    it('#isSelected returns true if aria-checked == true', () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getAttribute.withArgs(Attributes.ARIA_SELECTED)
          .and.returnValue('true');
      expect(foundation.isSelected()).toBe(true);
    });

    it(`#isSelected returns false if ${Attributes.ARIA_SELECTED} != true`,
       () => {
         const {foundation, mockAdapter} = setupTest();
         mockAdapter.getAttribute.withArgs(Attributes.ARIA_SELECTED)
             .and.returnValue('false');
         expect(foundation.isSelected()).toBe(false);
       });

    it(`#handleClick does not emit ${Events.INTERACTION} when disabled`, () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getAttribute.withArgs(Attributes.ARIA_DISABLED)
          .and.returnValue('true');
      foundation.handleClick();
      expect(mockAdapter.emitEvent).not.toHaveBeenCalled();
    });

    it(`#handleClick does not emit ${Events.INTERACTION} when presentational`,
       () => {
         const {foundation, mockAdapter} = setupTest();
         mockAdapter.getAttribute.withArgs(Attributes.ROLE)
             .and.returnValue('presentation');
         foundation.handleClick();
         expect(mockAdapter.emitEvent).not.toHaveBeenCalled();
       });

    it(`#handleClick emits ${Events.INTERACTION} with detail`, () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getElementID.and.returnValue('foo');
      foundation.handleClick();
      expect(mockAdapter.emitEvent).toHaveBeenCalledWith(Events.INTERACTION, {
        actionID: 'foo',
        source: ActionType.UNSPECIFIED,
        trigger: InteractionTrigger.CLICK,
      });
    });

    const keys = [
      'Enter',
      'Spacebar',
    ];

    for (const key of keys) {
      it(`#handleKeydown("${key}") does not emit when disabled`, () => {
        const {foundation, mockAdapter} = setupTest();
        mockAdapter.getAttribute.withArgs(Attributes.ARIA_DISABLED)
            .and.returnValue('true');
        foundation.handleKeydown({key} as KeyboardEvent);
        expect(mockAdapter.emitEvent).not.toHaveBeenCalled();
      });

      it(`#handleKeydown("${key}") does not emit when presentational`, () => {
        const {foundation, mockAdapter} = setupTest();
        mockAdapter.getAttribute.withArgs(Attributes.ROLE)
            .and.returnValue('presentation');
        foundation.handleKeydown({key} as KeyboardEvent);
        expect(mockAdapter.emitEvent).not.toHaveBeenCalled();
      });
    }
  });

  describe('[non-deletable]', () => {
    const setupTest = () => {
      const {foundation, mockAdapter} =
          setUpFoundationTest(SelectableMDCChipActionFoundation);
      return {foundation, mockAdapter};
    };

    const emittingKeys = [
      {key: 'Enter', trigger: InteractionTrigger.ENTER_KEY},
      {key: 'Spacebar', trigger: InteractionTrigger.SPACEBAR_KEY},
    ];

    for (const {key, trigger} of emittingKeys) {
      it(`#handleKeydown(${key}) emits ${Events.INTERACTION} with detail`,
         () => {
           const {foundation, mockAdapter} = setupTest();
           const evt = {
             preventDefault: jasmine.createSpy('preventDefault') as Function,
             key,
           } as KeyboardEvent;
           foundation.handleKeydown(evt);
           expect(mockAdapter.emitEvent)
               .toHaveBeenCalledWith(Events.INTERACTION, {
                 actionID: '',
                 source: ActionType.UNSPECIFIED,
                 trigger,
               });
           expect(evt.preventDefault).toHaveBeenCalled();
         });
    }

    const nonemittingKeys = [
      'Delete',
      'Backspace',
    ];

    for (const key of nonemittingKeys) {
      it(`#handleKeydown(${key}) does not emit ${Events.INTERACTION}`, () => {
        const {foundation, mockAdapter} = setupTest();
        foundation.handleKeydown({key} as KeyboardEvent);
        expect(mockAdapter.emitEvent).not.toHaveBeenCalled();
      });
    }
  });

  describe('[deletable]', () => {
    const setupTest = () => {
      const {foundation, mockAdapter} =
          setUpFoundationTest(SelectableDeletableMDCChipActionFoundation);
      return {foundation, mockAdapter};
    };

    const emittingKeys = [
      {key: 'Enter', trigger: InteractionTrigger.ENTER_KEY},
      {key: 'Spacebar', trigger: InteractionTrigger.SPACEBAR_KEY},
      {key: 'Backspace', trigger: InteractionTrigger.BACKSPACE_KEY},
      {key: 'Delete', trigger: InteractionTrigger.DELETE_KEY},
    ];

    for (const {key, trigger} of emittingKeys) {
      it(`#handleKeydown(${key}) emits ${Events.INTERACTION} with detail`,
         () => {
           const {foundation, mockAdapter} = setupTest();
           const evt = {
             preventDefault: jasmine.createSpy('preventDefault') as Function,
             key,
           } as KeyboardEvent;
           foundation.handleKeydown(evt);
           expect(mockAdapter.emitEvent)
               .toHaveBeenCalledWith(Events.INTERACTION, {
                 actionID: '',
                 source: ActionType.UNSPECIFIED,
                 trigger,
               });
           expect(evt.preventDefault).toHaveBeenCalled();
         });
    }
  });

  describe('[selectable]', () => {
    const setupTest = () => {
      const {foundation, mockAdapter} =
          setUpFoundationTest(SelectableMDCChipActionFoundation);
      return {foundation, mockAdapter};
    };

    it(`#setSelected(true) sets ${Attributes.ARIA_SELECTED} to true`, () => {
      const {foundation, mockAdapter} = setupTest();
      foundation.setSelected(true);
      expect(mockAdapter.setAttribute)
          .toHaveBeenCalledWith(Attributes.ARIA_SELECTED, 'true');
    });

    it(`#setSelected(false) sets ${Attributes.ARIA_SELECTED} to false`, () => {
      const {foundation, mockAdapter} = setupTest();
      foundation.setSelected(false);
      expect(mockAdapter.setAttribute)
          .toHaveBeenCalledWith(Attributes.ARIA_SELECTED, 'false');
    });

    it(`#setDisabled(true) sets ${Attributes.ARIA_DISABLED} to true`, () => {
      const {foundation, mockAdapter} = setupTest();
      foundation.setDisabled(true);
      expect(mockAdapter.setAttribute)
          .toHaveBeenCalledWith(Attributes.ARIA_DISABLED, 'true');
    });

    it(`#setDisabled(false) sets aria-hidden="false"`, () => {
      const {foundation, mockAdapter} = setupTest();
      foundation.setDisabled(false);
      expect(mockAdapter.setAttribute)
          .toHaveBeenCalledWith(Attributes.ARIA_DISABLED, 'false');
    });

    it(`#setDisabled(true) sets aria-hidden="true"`, () => {
      const {foundation, mockAdapter} = setupTest();
      foundation.setDisabled(true);
      expect(mockAdapter.setAttribute)
          .toHaveBeenCalledWith(Attributes.ARIA_DISABLED, 'true');
    });

    it(`#isDisabled() return true when aria-hidden="true"`, () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getAttribute.withArgs(Attributes.ARIA_DISABLED)
          .and.returnValue('true');
      expect(foundation.isDisabled()).toBeTrue();
    });

    it(`#isDisabled() return false when aria-hidden="false"`, () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getAttribute.withArgs(Attributes.ARIA_DISABLED)
          .and.returnValue('false');
      expect(foundation.isDisabled()).toBeFalse();
    });
  });

  describe('[non-selectable]', () => {
    const setupTest = () => {
      const {foundation, mockAdapter} =
          setUpFoundationTest(NonselectableMDCChipActionFoundation);
      return {foundation, mockAdapter};
    };

    it(`#setSelected(true|false) does not set ${Attributes.ARIA_SELECTED}`,
       () => {
         const {foundation, mockAdapter} = setupTest();
         foundation.setSelected(true);
         foundation.setSelected(false);
         expect(mockAdapter.setAttribute).not.toHaveBeenCalled();
       });

    it(`#setDisabled(false) remove the disabled attribute`, () => {
      const {foundation, mockAdapter} = setupTest();
      foundation.setDisabled(false);
      expect(mockAdapter.removeAttribute)
          .toHaveBeenCalledWith(Attributes.DISABLED);
    });

    it(`#setDisabled(true) sets disabled="true"`, () => {
      const {foundation, mockAdapter} = setupTest();
      foundation.setDisabled(true);
      expect(mockAdapter.setAttribute)
          .toHaveBeenCalledWith(Attributes.DISABLED, 'true');
    });

    it(`#isDisabled() return true when the disabled attribute exists`, () => {
      const {foundation, mockAdapter} = setupTest();
      mockAdapter.getAttribute.withArgs(Attributes.DISABLED)
          .and.returnValue('');
      expect(foundation.isDisabled()).toBeTrue();
    });

    it(`#isDisabled() return false when the disabled attribute is absent`,
       () => {
         const {foundation, mockAdapter} = setupTest();
         mockAdapter.getAttribute.withArgs(Attributes.DISABLED)
             .and.returnValue(null);
         expect(foundation.isDisabled()).toBeFalse();
       });
  });
});
