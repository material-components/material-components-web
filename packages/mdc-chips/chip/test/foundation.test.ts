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
import {MDCChipActionFocusBehavior, MDCChipActionInteractionTrigger, MDCChipActionType} from '../../action/constants';
import {MDCChipAnimation, MDCChipAttributes, MDCChipCssClasses, MDCChipEvents} from '../constants';
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
    mockAdapter.getActions.and.returnValue([MDCChipActionType.UNSPECIFIED]);
    expect(foundation.getActions()).toEqual([MDCChipActionType.UNSPECIFIED]);
  });

  it(`#isActionFocusable() returns the adapter's return value`, () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.isActionFocusable.and.returnValue(true);
    expect(foundation.isActionFocusable(MDCChipActionType.UNSPECIFIED))
        .toBe(true);
  });

  it(`#isActionSelectable() returns the adapter's return value`, () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.isActionSelectable.and.returnValue(true);
    expect(foundation.isActionSelectable(MDCChipActionType.UNSPECIFIED))
        .toBe(true);
  });

  it(`#isActionSelected() returns the adapter's return value`, () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.isActionSelected.and.returnValue(true);
    expect(foundation.isActionSelected(MDCChipActionType.UNSPECIFIED))
        .toBe(true);
  });

  it(`#setActionFocus(` +
         `${MDCChipActionType.UNSPECIFIED}, ${
             MDCChipActionFocusBehavior.FOCUSABLE_AND_FOCUSED})` +
         ` updates the action focus`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setActionFocus(
           MDCChipActionType.UNSPECIFIED,
           MDCChipActionFocusBehavior.FOCUSABLE_AND_FOCUSED);
       expect(mockAdapter.setActionFocus)
           .toHaveBeenCalledWith(
               MDCChipActionType.UNSPECIFIED,
               MDCChipActionFocusBehavior.FOCUSABLE_AND_FOCUSED);
     });

  it(`#setActionSelected(${MDCChipActionType.UNSPECIFIED}, true) updates` +
         ` the action selection`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setActionSelected(MDCChipActionType.UNSPECIFIED, true);
       expect(mockAdapter.setActionSelected)
           .toHaveBeenCalledWith(MDCChipActionType.UNSPECIFIED, true);
     });

  it(`sequential calls to #setActionSelected() only modify the DOM once`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setActionSelected(MDCChipActionType.UNSPECIFIED, true);
       foundation.setActionSelected(MDCChipActionType.UNSPECIFIED, false);
       foundation.setActionSelected(MDCChipActionType.UNSPECIFIED, true);
       jasmine.clock().tick(3);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(MDCChipCssClasses.SELECTING);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(MDCChipCssClasses.SELECTED);
       expect(mockAdapter.addClass).toHaveBeenCalledTimes(2);
     });

  it('#destroy() cancels selection animation frames', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setActionSelected(MDCChipActionType.UNSPECIFIED, true);
    foundation.destroy();
    jasmine.clock().tick(3);
    expect(mockAdapter.addClass)
        .not.toHaveBeenCalledWith(MDCChipCssClasses.SELECTING);
    expect(mockAdapter.addClass)
        .not.toHaveBeenCalledWith(MDCChipCssClasses.SELECTED);
  });

  it(`#setActionSelected(${
         MDCChipActionType.UNSPECIFIED}, true) adds the selected class`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setActionSelected(MDCChipActionType.UNSPECIFIED, true);
       jasmine.clock().tick(3);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(MDCChipCssClasses.SELECTED);
     });

  it(`#setActionSelected(${
         MDCChipActionType.UNSPECIFIED}, false) removes the selected class`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setActionSelected(MDCChipActionType.UNSPECIFIED, false);
       jasmine.clock().tick(3);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(MDCChipCssClasses.SELECTED);
     });

  it(`#setActionSelected(${
         MDCChipActionType.UNSPECIFIED}, true) removes all animating classes`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setActionSelected(MDCChipActionType.UNSPECIFIED, true);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(MDCChipCssClasses.SELECTING);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(MDCChipCssClasses.DESELECTING);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(MDCChipCssClasses.SELECTING_WITH_PRIMARY_ICON);
       expect(mockAdapter.removeClass)
           .toHaveBeenCalledWith(
               MDCChipCssClasses.DESELECTING_WITH_PRIMARY_ICON);
     });

  it(`#setActionSelected(${
         MDCChipActionType
             .UNSPECIFIED}, true) adds the selecting class when no primary icon is present`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(MDCChipCssClasses.WITH_PRIMARY_ICON)
           .and.returnValue(false);
       foundation.setActionSelected(MDCChipActionType.UNSPECIFIED, true);
       jasmine.clock().tick(2);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(MDCChipCssClasses.SELECTING);
     });

  it(`#setActionSelected(${
         MDCChipActionType
             .UNSPECIFIED}, true) adds the selecting with icon class when the primary icon is present`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(MDCChipCssClasses.WITH_PRIMARY_ICON)
           .and.returnValue(true);
       foundation.setActionSelected(MDCChipActionType.UNSPECIFIED, true);
       jasmine.clock().tick(2);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(MDCChipCssClasses.SELECTING_WITH_PRIMARY_ICON);
     });

  it(`#setActionSelected(${
         MDCChipActionType
             .UNSPECIFIED}, false) adds the deselecting class when no primary icon is present`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(MDCChipCssClasses.WITH_PRIMARY_ICON)
           .and.returnValue(false);
       foundation.setActionSelected(MDCChipActionType.UNSPECIFIED, false);
       jasmine.clock().tick(2);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(MDCChipCssClasses.DESELECTING);
     });

  it(`#setActionSelected(${
         MDCChipActionType
             .UNSPECIFIED}, false) adds the deelecting with icon class when the primary icon is present`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(MDCChipCssClasses.WITH_PRIMARY_ICON)
           .and.returnValue(true);
       foundation.setActionSelected(MDCChipActionType.UNSPECIFIED, false);
       jasmine.clock().tick(2);
       expect(mockAdapter.addClass)
           .toHaveBeenCalledWith(
               MDCChipCssClasses.DESELECTING_WITH_PRIMARY_ICON);
     });

  it('#setDisabled(true) makes each action disabled', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getActions.and.returnValue([MDCChipActionType.UNSPECIFIED]);
    foundation.setDisabled(true);
    expect(mockAdapter.setActionDisabled)
        .toHaveBeenCalledWith(MDCChipActionType.UNSPECIFIED, true);
  });

  it('#setDisabled(true) adds the disabled class', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getActions.and.returnValue([MDCChipActionType.UNSPECIFIED]);
    foundation.setDisabled(true);
    expect(mockAdapter.addClass)
        .toHaveBeenCalledWith(MDCChipCssClasses.DISABLED);
  });

  it('#setDisabled(false) makes each action enabled', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getActions.and.returnValue([MDCChipActionType.UNSPECIFIED]);
    foundation.setDisabled(false);
    expect(mockAdapter.setActionDisabled)
        .toHaveBeenCalledWith(MDCChipActionType.UNSPECIFIED, false);
  });

  it('#setDisabled(false) removes the disabled class', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getActions.and.returnValue([MDCChipActionType.UNSPECIFIED]);
    foundation.setDisabled(false);
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(MDCChipCssClasses.DISABLED);
  });

  it(`#handleActionInteraction() emits ${MDCChipEvents.INTERACTION}`, () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getElementID.and.returnValue('foo');
    mockAdapter.isActionSelected.withArgs(MDCChipActionType.UNSPECIFIED)
        .and.returnValue(true);
    mockAdapter.isActionSelectable.withArgs(MDCChipActionType.UNSPECIFIED)
        .and.returnValue(true);

    foundation.handleActionInteraction({
      detail: {
        actionID: 'bar',
        source: MDCChipActionType.UNSPECIFIED,
        trigger: MDCChipActionInteractionTrigger.CLICK,
      },
    } as ActionInteractionEvent);

    expect(mockAdapter.emitEvent)
        .toHaveBeenCalledWith(MDCChipEvents.INTERACTION, {
          actionID: 'bar',
          chipID: 'foo',
          shouldRemove: false,
          isSelectable: true,
          isSelected: true,
          source: MDCChipActionType.UNSPECIFIED,
        });
  });

  it(`#handleActionInteraction() emits ${MDCChipEvents.INTERACTION} with` +
         ` {shouldRemove: true} when from action "${
             MDCChipActionType.TRAILING}"`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.handleActionInteraction({
         detail: {
           actionID: 'bar',
           source: MDCChipActionType.TRAILING,
           trigger: MDCChipActionInteractionTrigger.CLICK,
         },
       } as ActionInteractionEvent);

       expect(mockAdapter.emitEvent)
           .toHaveBeenCalledWith(MDCChipEvents.INTERACTION, {
             actionID: 'bar',
             chipID: '',
             shouldRemove: true,
             isSelectable: false,
             isSelected: false,
             source: MDCChipActionType.TRAILING,
           });
     });

  it(`#handleActionInteraction() emits ${MDCChipEvents.INTERACTION} with` +
         ` {shouldRemove: true} when from` +
         ` trigger "${MDCChipActionInteractionTrigger.BACKSPACE_KEY}"`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.handleActionInteraction({
         detail: {
           actionID: 'bar',
           source: MDCChipActionType.UNSPECIFIED,
           trigger: MDCChipActionInteractionTrigger.BACKSPACE_KEY,
         },
       } as ActionInteractionEvent);

       expect(mockAdapter.emitEvent)
           .toHaveBeenCalledWith(MDCChipEvents.INTERACTION, {
             actionID: 'bar',
             chipID: '',
             shouldRemove: true,
             isSelectable: false,
             isSelected: false,
             source: MDCChipActionType.UNSPECIFIED,
           });
     });

  describe('#handleActionNavigation', () => {
    describe('ArrowRight', () => {
      // Use the same key for all tests
      const key = KEY.ARROW_RIGHT;

      it(`from primary action focuses trailing action if focusable`, () => {
        const {foundation, mockAdapter} = setupTest();
        mockAdapter.isActionFocusable.withArgs(MDCChipActionType.TRAILING)
            .and.returnValue(true);

        foundation.handleActionNavigation({
          detail: {
            source: MDCChipActionType.PRIMARY,
            key,
          },
        } as ActionNavigationEvent);

        expect(mockAdapter.setActionFocus)
            .toHaveBeenCalledWith(
                MDCChipActionType.TRAILING,
                MDCChipActionFocusBehavior.FOCUSABLE_AND_FOCUSED);
        expect(mockAdapter.setActionFocus)
            .toHaveBeenCalledWith(
                MDCChipActionType.PRIMARY,
                MDCChipActionFocusBehavior.NOT_FOCUSABLE);
      });

      it(`from primary action emits ${MDCChipEvents.NAVIGATION}` +
             ` if trailing action is not focusable`,
         () => {
           const {foundation, mockAdapter} = setupTest();
           mockAdapter.getElementID.and.returnValue('foo');
           mockAdapter.isActionFocusable.withArgs(MDCChipActionType.TRAILING)
               .and.returnValue(false);

           foundation.handleActionNavigation({
             detail: {
               source: MDCChipActionType.PRIMARY,
               key,
             },
           } as ActionNavigationEvent);

           expect(mockAdapter.emitEvent)
               .toHaveBeenCalledWith(MDCChipEvents.NAVIGATION, {
                 chipID: 'foo',
                 source: MDCChipActionType.PRIMARY,
                 isRTL: false,
                 key,
               });
         });

      it(`from primary action in RTL emits ${MDCChipEvents.NAVIGATION}`, () => {
        const {foundation, mockAdapter} = setupTest();
        mockAdapter.isRTL.and.returnValue(true);
        mockAdapter.getElementID.and.returnValue('foo');

        foundation.handleActionNavigation({
          detail: {
            source: MDCChipActionType.PRIMARY,
            key,
          },
        } as ActionNavigationEvent);

        expect(mockAdapter.emitEvent)
            .toHaveBeenCalledWith(MDCChipEvents.NAVIGATION, {
              chipID: 'foo',
              source: MDCChipActionType.PRIMARY,
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
        mockAdapter.isActionFocusable.withArgs(MDCChipActionType.PRIMARY)
            .and.returnValue(true);

        foundation.handleActionNavigation({
          detail: {
            source: MDCChipActionType.TRAILING,
            key,
          },
        } as ActionNavigationEvent);

        expect(mockAdapter.setActionFocus)
            .toHaveBeenCalledWith(
                MDCChipActionType.PRIMARY,
                MDCChipActionFocusBehavior.FOCUSABLE_AND_FOCUSED);
        expect(mockAdapter.setActionFocus)
            .toHaveBeenCalledWith(
                MDCChipActionType.TRAILING,
                MDCChipActionFocusBehavior.NOT_FOCUSABLE);
      });

      it(`from trailing action emits ${MDCChipEvents.NAVIGATION}` +
             ` if primary action is not focusable`,
         () => {
           const {foundation, mockAdapter} = setupTest();
           mockAdapter.getElementID.and.returnValue('foo');
           mockAdapter.isActionFocusable.withArgs(MDCChipActionType.PRIMARY)
               .and.returnValue(false);

           foundation.handleActionNavigation({
             detail: {
               source: MDCChipActionType.TRAILING,
               key,
             },
           } as ActionNavigationEvent);

           expect(mockAdapter.emitEvent)
               .toHaveBeenCalledWith(MDCChipEvents.NAVIGATION, {
                 chipID: 'foo',
                 source: MDCChipActionType.TRAILING,
                 isRTL: false,
                 key,
               });
         });

      it(`from trailing action in RTL emits ${MDCChipEvents.NAVIGATION}`,
         () => {
           const {foundation, mockAdapter} = setupTest();
           mockAdapter.isRTL.and.returnValue(true);
           mockAdapter.getElementID.and.returnValue('foo');

           foundation.handleActionNavigation({
             detail: {
               source: MDCChipActionType.TRAILING,
               key,
             },
           } as ActionNavigationEvent);

           expect(mockAdapter.emitEvent)
               .toHaveBeenCalledWith(MDCChipEvents.NAVIGATION, {
                 chipID: 'foo',
                 source: MDCChipActionType.TRAILING,
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
      it(`${key} emits ${MDCChipEvents.NAVIGATION}`, () => {
        const {foundation, mockAdapter} = setupTest();
        mockAdapter.getElementID.and.returnValue('foo');

        foundation.handleActionNavigation({
          detail: {
            source: MDCChipActionType.UNSPECIFIED,
            key,
          },
        } as ActionNavigationEvent);

        expect(mockAdapter.emitEvent)
            .toHaveBeenCalledWith(MDCChipEvents.NAVIGATION, {
              chipID: 'foo',
              source: MDCChipActionType.UNSPECIFIED,
              isRTL: false,
              key,
            });
      });
    }
  });

  it(`#startAnimation(${MDCChipAnimation.ENTER}) adds the enter class`, () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.startAnimation(MDCChipAnimation.ENTER);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(MDCChipCssClasses.ENTER);
  });

  it(`#startAnimation(${MDCChipAnimation.EXIT}) adds the exit class`, () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.startAnimation(MDCChipAnimation.EXIT);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(MDCChipCssClasses.EXIT);
  });

  it(`#handleAnimationEnd() for enter removes the enter class`, () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.handleAnimationEnd(
        {animationName: 'mdc-evolution-chip-enter'} as AnimationEvent);
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(MDCChipCssClasses.ENTER);
  });

  it(`#handleAnimationEnd() for enter emits an event`, () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getElementID.and.returnValue('foo');
    mockAdapter.getAttribute.withArgs(MDCChipAttributes.DATA_ADDED_ANNOUNCEMENT)
        .and.returnValue('Added foo');
    foundation.handleAnimationEnd(
        {animationName: 'mdc-evolution-chip-enter'} as AnimationEvent);
    expect(mockAdapter.emitEvent)
        .toHaveBeenCalledWith(MDCChipEvents.ANIMATION, {
          chipID: 'foo',
          addedAnnouncement: 'Added foo',
          animation: MDCChipAnimation.ENTER,
          isComplete: true,
        });
  });

  it(`#handleAnimationEnd() for exit removes the exit class`, () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.handleAnimationEnd(
        {animationName: 'mdc-evolution-chip-exit'} as AnimationEvent);
    expect(mockAdapter.removeClass)
        .toHaveBeenCalledWith(MDCChipCssClasses.EXIT);
  });

  it(`#handleAnimationEnd() for exit adds the hidden class`, () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.handleAnimationEnd(
        {animationName: 'mdc-evolution-chip-exit'} as AnimationEvent);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(MDCChipCssClasses.HIDDEN);
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
       mockAdapter.getAttribute
           .withArgs(MDCChipAttributes.DATA_REMOVED_ANNOUNCEMENT)
           .and.returnValue('Removed foo');
       mockAdapter.hasClass.withArgs(MDCChipCssClasses.HIDDEN)
           .and.returnValue(true);
       foundation.handleTransitionEnd();
       expect(mockAdapter.emitEvent)
           .toHaveBeenCalledWith(MDCChipEvents.ANIMATION, {
             chipID: 'foo',
             removedAnnouncement: 'Removed foo',
             animation: MDCChipAnimation.EXIT,
             isComplete: true,
           });
     });

  it(`#handleTransitionEnd() does not emit an event when the root does not have the hidden class`,
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(MDCChipCssClasses.HIDDEN)
           .and.returnValue(false);
       foundation.handleTransitionEnd();
       expect(mockAdapter.emitEvent).not.toHaveBeenCalled();
     });
});
