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

import {KEY} from '../../../mdc-dom/keyboard';
import {setUpFoundationTest, setUpMdcTestEnvironment} from '../../../../testing/helpers/setup';
import {ActionType, FocusBehavior, InteractionTrigger} from '../../action/constants';
import {Animation, Attributes, CssClasses, Events} from '../constants';
import {MDCChipFoundation} from '../foundation';
import {ActionInteractionEvent, ActionNavigationEvent} from '../types';

describe('MDCChipFoundation', () => {
  setUpMdcTestEnvironment();

  const setupTest = () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCChipFoundation);
    return {foundation, mockAdapter};
  };

  it(`#getElementID() returns the adapter's return value`, () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getElementID.and.returnValue('foo');
    expect(foundation.getElementID()).toBe('foo');
  });

  it(`#getActions() returns the adapter's return value`, () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getActions.and.returnValue([ActionType.UNSPECIFIED]);
    expect(foundation.getActions()).toEqual([ActionType.UNSPECIFIED]);
  });

  it(`#isActionFocusable() returns the adapter's return value`, () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.isActionFocusable.and.returnValue(true);
    expect(foundation.isActionFocusable(ActionType.UNSPECIFIED)).toBe(true);
  });

  it(`#isActionSelectable() returns the adapter's return value`, () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.isActionSelectable.and.returnValue(true);
    expect(foundation.isActionSelectable(ActionType.UNSPECIFIED)).toBe(true);
  });

  it(`#isActionSelected() returns the adapter's return value`, () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.isActionSelected.and.returnValue(true);
    expect(foundation.isActionSelected(ActionType.UNSPECIFIED)).toBe(true);
  });

  it(`#setActionFocus(` +
         `${ActionType.UNSPECIFIED}, ${FocusBehavior.FOCUSABLE_AND_FOCUSED})` +
         ` updates the action focus`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setActionFocus(ActionType.UNSPECIFIED, FocusBehavior.FOCUSABLE_AND_FOCUSED);
       expect(mockAdapter.setActionFocus)
           .toHaveBeenCalledWith(ActionType.UNSPECIFIED, FocusBehavior.FOCUSABLE_AND_FOCUSED);
     });

  it(`#setActionSelected(${ActionType.UNSPECIFIED}, true) updates` +
         ` the action selection`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setActionSelected(ActionType.UNSPECIFIED, true);
       expect(mockAdapter.setActionSelected)
           .toHaveBeenCalledWith(ActionType.UNSPECIFIED, true);
     });

  it(`sequential calls to #setActionSelected() only modify the DOM once`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setActionSelected(ActionType.UNSPECIFIED, true);
       foundation.setActionSelected(ActionType.UNSPECIFIED, false);
       foundation.setActionSelected(ActionType.UNSPECIFIED, true);
       jasmine.clock().tick(3);
       expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.SELECTING);
       expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.SELECTED);
       expect(mockAdapter.addClass).toHaveBeenCalledTimes(2);
     });

  it('#destroy() cancels selection animation frames', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setActionSelected(ActionType.UNSPECIFIED, true);
    foundation.destroy();
    jasmine.clock().tick(3);
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(CssClasses.SELECTING);
    expect(mockAdapter.addClass).not.toHaveBeenCalledWith(CssClasses.SELECTED);
  });

  it(`#setActionSelected(${
         ActionType.UNSPECIFIED}, true) adds the selected class`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setActionSelected(ActionType.UNSPECIFIED, true);
       jasmine.clock().tick(3);
       expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.SELECTED);
     });

  it(`#setActionSelected(${
         ActionType.UNSPECIFIED}, false) removes the selected class`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setActionSelected(ActionType.UNSPECIFIED, false);
       jasmine.clock().tick(3);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.SELECTED);
     });

  it(`#setActionSelected(${
         ActionType.UNSPECIFIED}, true) removes all animating classes`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setActionSelected(ActionType.UNSPECIFIED, true);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.SELECTING);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.DESELECTING);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.SELECTING_WITH_PRIMARY_ICON);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(CssClasses.DESELECTING_WITH_PRIMARY_ICON);
     });

  it(`#setActionSelected(${
         ActionType
             .UNSPECIFIED}, true) adds the selecting class when no primary icon is present`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(CssClasses.WITH_PRIMARY_ICON)
           .and.returnValue(false);
       foundation.setActionSelected(ActionType.UNSPECIFIED, true);
       jasmine.clock().tick(2);
       expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.SELECTING);
     });

  it(`#setActionSelected(${
         ActionType
             .UNSPECIFIED}, true) adds the selecting with icon class when the primary icon is present`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(CssClasses.WITH_PRIMARY_ICON)
           .and.returnValue(true);
       foundation.setActionSelected(ActionType.UNSPECIFIED, true);
       jasmine.clock().tick(2);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(CssClasses.SELECTING_WITH_PRIMARY_ICON);
     });

  it(`#setActionSelected(${
         ActionType
             .UNSPECIFIED}, false) adds the deselecting class when no primary icon is present`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(CssClasses.WITH_PRIMARY_ICON)
           .and.returnValue(false);
       foundation.setActionSelected(ActionType.UNSPECIFIED, false);
       jasmine.clock().tick(2);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(CssClasses.DESELECTING);
     });

  it(`#setActionSelected(${
         ActionType
             .UNSPECIFIED}, false) adds the deelecting with icon class when the primary icon is present`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(CssClasses.WITH_PRIMARY_ICON)
           .and.returnValue(true);
       foundation.setActionSelected(ActionType.UNSPECIFIED, false);
       jasmine.clock().tick(2);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(CssClasses.DESELECTING_WITH_PRIMARY_ICON);
     });

  it('#setDisabled(true) makes each action disabled', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getActions.and.returnValue([ActionType.UNSPECIFIED]);
    foundation.setDisabled(true);
    expect(mockAdapter.setActionDisabled)
        .toHaveBeenCalledWith(ActionType.UNSPECIFIED, true);
  });

  it('#setDisabled(true) adds the disabled class', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getActions.and.returnValue([ActionType.UNSPECIFIED]);
    foundation.setDisabled(true);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.DISABLED);
  });

  it('#setDisabled(false) makes each action enabled', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getActions.and.returnValue([ActionType.UNSPECIFIED]);
    foundation.setDisabled(false);
    expect(mockAdapter.setActionDisabled)
        .toHaveBeenCalledWith(ActionType.UNSPECIFIED, false);
  });

  it('#setDisabled(false) removes the disabled class', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getActions.and.returnValue([ActionType.UNSPECIFIED]);
    foundation.setDisabled(false);
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.DISABLED);
  });

  it(`#handleActionInteraction() emits ${Events.INTERACTION}`, () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getElementID.and.returnValue('foo');
    mockAdapter.isActionSelected.withArgs(ActionType.UNSPECIFIED)
        .and.returnValue(true);
    mockAdapter.isActionSelectable.withArgs(ActionType.UNSPECIFIED)
        .and.returnValue(true);

    foundation.handleActionInteraction({
      detail: {
        actionID: 'bar',
        source: ActionType.UNSPECIFIED,
        trigger: InteractionTrigger.CLICK,
      },
    } as ActionInteractionEvent);

    expect(mockAdapter.emitEvent).toHaveBeenCalledWith(Events.INTERACTION, {
      actionID: 'bar',
      chipID: 'foo',
      shouldRemove: false,
      isSelectable: true,
      isSelected: true,
      source: ActionType.UNSPECIFIED,
    });
  });

  it(`#handleActionInteraction() emits ${Events.INTERACTION} with` +
         ` {shouldRemove: true} when from action "${ActionType.TRAILING}"`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.handleActionInteraction({
         detail: {
           actionID: 'bar',
           source: ActionType.TRAILING,
           trigger: InteractionTrigger.CLICK,
         },
       } as ActionInteractionEvent);

       expect(mockAdapter.emitEvent).toHaveBeenCalledWith(Events.INTERACTION, {
         actionID: 'bar',
         chipID: '',
         shouldRemove: true,
         isSelectable: false,
         isSelected: false,
         source: ActionType.TRAILING,
       });
     });

  it(`#handleActionInteraction() emits ${Events.INTERACTION} with` +
         ` {shouldRemove: true} when from` +
         ` trigger "${InteractionTrigger.BACKSPACE_KEY}"`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.handleActionInteraction({
         detail: {
           actionID: 'bar',
           source: ActionType.UNSPECIFIED,
           trigger: InteractionTrigger.BACKSPACE_KEY,
         },
       } as ActionInteractionEvent);

       expect(mockAdapter.emitEvent).toHaveBeenCalledWith(Events.INTERACTION, {
         actionID: 'bar',
         chipID: '',
         shouldRemove: true,
         isSelectable: false,
         isSelected: false,
         source: ActionType.UNSPECIFIED,
       });
     });

  describe('#handleActionNavigation', () => {
    describe('ArrowRight', () => {
      // Use the same key for all tests
      const key = KEY.ARROW_RIGHT;

      it(`from primary action focuses trailing action if focusable`, () => {
        const {foundation, mockAdapter} = setupTest();
        mockAdapter.isActionFocusable.withArgs(ActionType.TRAILING)
            .and.returnValue(true);

        foundation.handleActionNavigation({
          detail: {
            source: ActionType.PRIMARY,
            key,
          },
        } as ActionNavigationEvent);

        expect(mockAdapter.setActionFocus)
            .toHaveBeenCalledWith(
                ActionType.TRAILING, FocusBehavior.FOCUSABLE_AND_FOCUSED);
        expect(mockAdapter.setActionFocus)
            .toHaveBeenCalledWith(
                ActionType.PRIMARY, FocusBehavior.NOT_FOCUSABLE);
      });

      it(`from primary action emits ${Events.NAVIGATION}` +
             ` if trailing action is not focusable`,
         () => {
           const {foundation, mockAdapter} = setupTest();
           mockAdapter.getElementID.and.returnValue('foo');
           mockAdapter.isActionFocusable.withArgs(ActionType.TRAILING)
               .and.returnValue(false);

           foundation.handleActionNavigation({
             detail: {
               source: ActionType.PRIMARY,
               key,
             },
           } as ActionNavigationEvent);

           expect(mockAdapter.emitEvent)
               .toHaveBeenCalledWith(Events.NAVIGATION, {
                 chipID: 'foo',
                 source: ActionType.PRIMARY,
                 isRTL: false,
                 key,
               });
         });

      it(`from primary action in RTL emits ${Events.NAVIGATION}`, () => {
        const {foundation, mockAdapter} = setupTest();
        mockAdapter.isRTL.and.returnValue(true);
        mockAdapter.getElementID.and.returnValue('foo');

        foundation.handleActionNavigation({
          detail: {
            source: ActionType.PRIMARY,
            key,
          },
        } as ActionNavigationEvent);

        expect(mockAdapter.emitEvent).toHaveBeenCalledWith(Events.NAVIGATION, {
          chipID: 'foo',
          source: ActionType.PRIMARY,
          isRTL: true,
          key,
        });
      });
    });

    describe('ArrowLeft', () => {
      // Use the same key for all tests
      const key = KEY.ARROW_LEFT;

      it(`from trailing action focuses primary action if focusable`, () => {
        const {foundation, mockAdapter} = setupTest();
        mockAdapter.isActionFocusable.withArgs(ActionType.PRIMARY)
            .and.returnValue(true);

        foundation.handleActionNavigation({
          detail: {
            source: ActionType.TRAILING,
            key,
          },
        } as ActionNavigationEvent);

        expect(mockAdapter.setActionFocus)
            .toHaveBeenCalledWith(
                ActionType.PRIMARY, FocusBehavior.FOCUSABLE_AND_FOCUSED);
        expect(mockAdapter.setActionFocus)
            .toHaveBeenCalledWith(
                ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
      });

      it(`from trailing action emits ${Events.NAVIGATION}` +
             ` if primary action is not focusable`,
         () => {
           const {foundation, mockAdapter} = setupTest();
           mockAdapter.getElementID.and.returnValue('foo');
           mockAdapter.isActionFocusable.withArgs(ActionType.PRIMARY)
               .and.returnValue(false);

           foundation.handleActionNavigation({
             detail: {
               source: ActionType.TRAILING,
               key,
             },
           } as ActionNavigationEvent);

           expect(mockAdapter.emitEvent)
               .toHaveBeenCalledWith(Events.NAVIGATION, {
                 chipID: 'foo',
                 source: ActionType.TRAILING,
                 isRTL: false,
                 key,
               });
         });

      it(`from trailing action in RTL emits ${Events.NAVIGATION}`, () => {
        const {foundation, mockAdapter} = setupTest();
        mockAdapter.isRTL.and.returnValue(true);
        mockAdapter.getElementID.and.returnValue('foo');

        foundation.handleActionNavigation({
          detail: {
            source: ActionType.TRAILING,
            key,
          },
        } as ActionNavigationEvent);

        expect(mockAdapter.emitEvent).toHaveBeenCalledWith(Events.NAVIGATION, {
          chipID: 'foo',
          source: ActionType.TRAILING,
          isRTL: true,
          key,
        });
      });
    });

    const emittingKeys = [
      KEY.ARROW_UP,
      KEY.ARROW_DOWN,
      KEY.HOME,
      KEY.END,
    ];

    for (const key of emittingKeys) {
      it(`${key} emits ${Events.NAVIGATION}`, () => {
        const {foundation, mockAdapter} = setupTest();
        mockAdapter.getElementID.and.returnValue('foo');

        foundation.handleActionNavigation({
          detail: {
            source: ActionType.UNSPECIFIED,
            key,
          },
        } as ActionNavigationEvent);

        expect(mockAdapter.emitEvent).toHaveBeenCalledWith(Events.NAVIGATION, {
          chipID: 'foo',
          source: ActionType.UNSPECIFIED,
          isRTL: false,
          key,
        });
      });
    }
  });

  it(`#startAnimation(${Animation.ENTER}) adds the enter class`, () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.startAnimation(Animation.ENTER);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.ENTER);
  });

  it(`#startAnimation(${Animation.EXIT}) adds the exit class`, () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.startAnimation(Animation.EXIT);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.EXIT);
  });

  it(`#handleAnimationEnd() for enter removes the enter class`, () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.handleAnimationEnd(
        {animationName: 'mdc-evolution-chip-enter'} as AnimationEvent);
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.ENTER);
  });

  it(`#handleAnimationEnd() for enter emits an event`, () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getElementID.and.returnValue('foo');
    mockAdapter.getAttribute.withArgs(Attributes.DATA_ADDED_ANNOUNCEMENT)
        .and.returnValue('Added foo');
    foundation.handleAnimationEnd(
        {animationName: 'mdc-evolution-chip-enter'} as AnimationEvent);
    expect(mockAdapter.emitEvent).toHaveBeenCalledWith(Events.ANIMATION, {
      chipID: 'foo',
      addedAnnouncement: 'Added foo',
      animation: Animation.ENTER,
      isComplete: true,
    });
  });

  it(`#handleAnimationEnd() for exit removes the exit class`, () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.handleAnimationEnd(
        {animationName: 'mdc-evolution-chip-exit'} as AnimationEvent);
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(CssClasses.EXIT);
  });

  it(`#handleAnimationEnd() for exit adds the hidden class`, () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.handleAnimationEnd(
        {animationName: 'mdc-evolution-chip-exit'} as AnimationEvent);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(CssClasses.HIDDEN);
  });

  it(`#handleAnimationEnd() sets the computed width on the root`, () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getOffsetWidth.and.returnValue(123);
    foundation.handleAnimationEnd(
        {animationName: 'mdc-evolution-chip-exit'} as AnimationEvent);
    expect(mockAdapter.setStyleProperty).toHaveBeenCalledWith('width', '123px');
  });

  it(`#handleAnimationEnd() sets the width on the root to 0`, () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.handleAnimationEnd(
        {animationName: 'mdc-evolution-chip-exit'} as AnimationEvent);
    jasmine.clock().tick(2);
    expect(mockAdapter.setStyleProperty).toHaveBeenCalledWith('width', '0');
  });

  it(`#handleTransitionEnd() emits an event when the root has the hidden class`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getElementID.and.returnValue('foo');
       mockAdapter.getAttribute.withArgs(Attributes.DATA_REMOVED_ANNOUNCEMENT)
           .and.returnValue('Removed foo');
       mockAdapter.hasClass.withArgs(CssClasses.HIDDEN).and.returnValue(true);
       foundation.handleTransitionEnd();
       expect(mockAdapter.emitEvent).toHaveBeenCalledWith(Events.ANIMATION, {
         chipID: 'foo',
         removedAnnouncement: 'Removed foo',
         animation: Animation.EXIT,
         isComplete: true,
       });
     });

  it(`#handleTransitionEnd() does not emit an event when the root does not have the hidden class`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(CssClasses.HIDDEN).and.returnValue(false);
       foundation.handleTransitionEnd();
       expect(mockAdapter.emitEvent).not.toHaveBeenCalled();
     });
});
