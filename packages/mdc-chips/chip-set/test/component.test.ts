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

import {DATA_MDC_DOM_ANNOUNCE} from '../../../mdc-dom/announce';
import {createFixture, html} from '../../../../testing/dom';
import {createKeyboardEvent, emitEvent} from '../../../../testing/dom/events';
import {createMockFoundation} from '../../../../testing/helpers/foundation';
import {setUpMdcTestEnvironment} from '../../../../testing/helpers/setup';
import {MDCChipActionType} from '../../action/constants';
import {MDCChipAnimation, MDCChipCssClasses, MDCChipEvents} from '../../chip/constants';
import {MDCChipAnimationEventDetail} from '../../chip/types';
import {MDCChipSet, MDCChipSetFoundation} from '../index';

interface ActionOptions {
  readonly isFocusable: boolean;
  readonly isSelectable: boolean;
  readonly isSelected: boolean;
}

interface ChipOptions {
  readonly primary: ActionOptions;
  readonly trailing?: ActionOptions;
  readonly id: string;
}

interface TestOptions {
  readonly isMultiselectable: boolean;
  readonly chips: ChipOptions[];
}

function actionFixture(
    {isFocusable, isSelectable, isSelected}: ActionOptions,
    isTrailing: boolean = false): string {
  return `<button class="mdc-evolution-chip__action ${
      isTrailing ? 'mdc-evolution-chip__action--trailing' : ''}"
      ${isFocusable ? '' : 'aria-hidden="true"'}
      ${isSelectable ? 'role="option"' : ''}
      ${isSelected ? 'aria-selected="true"' : ''}>Label</button>`;
}

function chipFixture({primary, trailing, id}: ChipOptions): string {
  return `
  <div class="mdc-evolution-chip" id="${id}">
    ${actionFixture(primary)}
    ${trailing === undefined ? '' : actionFixture(trailing, true)}
  </div>`;
}

function getFixture({chips, isMultiselectable}: TestOptions): HTMLElement {
  return createFixture(html`
  <div ${isMultiselectable ? 'aria-multiselectable="true"' : ''}>
    ${chips.map((chip) => chipFixture(chip))}
  </div>`);
}

function setupTest(options: TestOptions) {
  const root = getFixture(options);
  const component = new MDCChipSet(root);
  return {root, component};
}

function setupTestWithMocks(options: TestOptions) {
  const root = getFixture(options);
  const mockFoundation = createMockFoundation(MDCChipSetFoundation);
  const component = new MDCChipSet(root, mockFoundation);
  return {root, component, mockFoundation};
}

function actionChip(id: string): ChipOptions {
  return {
    primary: {isFocusable: true, isSelectable: false, isSelected: false},
    id,
  };
}

function disabledActionChip(id: string): ChipOptions {
  return {
    primary: {isFocusable: false, isSelectable: false, isSelected: false},
    id,
  };
}

function filterChip(id: string, isSelected: boolean): ChipOptions {
  return {
    primary: {isFocusable: true, isSelectable: true, isSelected},
    id,
  };
}

function multiActionInputChip(id: string): ChipOptions {
  return {
    primary: {isFocusable: true, isSelectable: false, isSelected: false},
    trailing: {isFocusable: true, isSelectable: false, isSelected: false},
    id,
  };
}

describe('MDCChipSet', () => {
  setUpMdcTestEnvironment();

  it('attachTo initializes and returns an MDCChipSet instance', () => {
    const chipset = MDCChipSet.attachTo(getFixture({
      chips: [
        actionChip('c0'),
        actionChip('c1'),
      ],
      isMultiselectable: false,
    }));
    expect(chipset instanceof MDCChipSet).toBeTruthy();
  });

  it('#initialSyncWithDOM sets up event handlers', () => {
    const {root, component, mockFoundation} = setupTestWithMocks({
      chips: [
        actionChip('c0'),
        actionChip('c1'),
      ],
      isMultiselectable: false,
    });

    const primaryActionEl =
        root.querySelector<HTMLElement>('.mdc-evolution-chip__action')!;
    emitEvent(primaryActionEl, 'click', {
      bubbles: true,
    });
    expect(mockFoundation.handleChipInteraction).toHaveBeenCalled();

    primaryActionEl.dispatchEvent(createKeyboardEvent('keydown', {
      key: 'ArrowLeft',
    }));
    expect(mockFoundation.handleChipNavigation).toHaveBeenCalled();

    emitEvent(
        root.querySelector<HTMLElement>('#c0')!, MDCChipEvents.ANIMATION, {
          bubbles: true,
          cancelable: false,
        });
    expect(mockFoundation.handleChipAnimation).toHaveBeenCalled();
    component.destroy();
  });

  it('#destroy removes event handlers', () => {
    const {root, component, mockFoundation} = setupTestWithMocks({
      chips: [
        actionChip('c0'),
        actionChip('c1'),
      ],
      isMultiselectable: false,
    });
    component.destroy();

    const primaryActionEl =
        root.querySelector<HTMLElement>('.mdc-evolution-chip__action')!;
    emitEvent(primaryActionEl, 'click', {
      bubbles: true,
    });
    expect(mockFoundation.handleChipInteraction).not.toHaveBeenCalled();

    primaryActionEl.dispatchEvent(createKeyboardEvent('keydown', {
      key: 'ArrowLeft',
    }));
    expect(mockFoundation.handleChipNavigation).not.toHaveBeenCalled();

    emitEvent(
        root.querySelector<HTMLElement>('#c0')!, MDCChipEvents.ANIMATION, {
          bubbles: true,
          cancelable: false,
        });
    expect(mockFoundation.handleChipAnimation).not.toHaveBeenCalled();
  });

  it('#getChipIndexByID() returns the index of the chip when it exists', () => {
    const {component} = setupTestWithMocks({
      chips: [
        actionChip('c0'),
        actionChip('c1'),
      ],
      isMultiselectable: false,
    });

    expect(component.getChipIndexByID('c1')).toBe(1);
  });

  it('#getChipIndexByID() returns -1 when the chip does not exist', () => {
    const {component} = setupTestWithMocks({
      chips: [
        actionChip('c0'),
        actionChip('c1'),
      ],
      isMultiselectable: false,
    });

    expect(component.getChipIndexByID('foo')).toBe(-1);
  });

  it('#getChipIdAtIndex() the id when the index is in bounds', () => {
    const {component} = setupTestWithMocks({
      chips: [
        actionChip('c0'),
        actionChip('c1'),
      ],
      isMultiselectable: false,
    });

    expect(component.getChipIdAtIndex(1)).toBe('c1');
  });

  it('#getChipIdAtIndex() returns an empty string when the index is out of bounds',
     () => {
       const {component} = setupTestWithMocks({
         chips: [
           actionChip('c0'),
           actionChip('c1'),
         ],
         isMultiselectable: false,
       });

       expect(component.getChipIdAtIndex(9)).toBe('');
     });

  it('#getSelectedChipIndexes() returns the indexs of selected chips', () => {
    const {component} = setupTest({
      chips: [
        filterChip('c0', true),
        filterChip('c1', false),
        filterChip('c2', true),
      ],
      isMultiselectable: true,
    });

    const selectedIndexes = component.getSelectedChipIndexes();
    expect(selectedIndexes.size).toBe(2);
    expect(selectedIndexes.has(0)).toBe(true);
    expect(selectedIndexes.has(1)).toBe(false);
    expect(selectedIndexes.has(2)).toBe(true);
  });

  it('#setChipSelected() updates the selection state of the chip', () => {
    const {component, root} = setupTest({
      chips: [
        filterChip('c0', true),
        filterChip('c1', false),
        filterChip('c2', true),
      ],
      isMultiselectable: true,
    });

    component.setChipSelected(1, MDCChipActionType.PRIMARY, true);

    expect(root.querySelector<HTMLElement>('#c1 .mdc-evolution-chip__action')!
               .getAttribute('aria-selected'))
        .toBe('true');
  });

  it('#isChipSelected() returns true if the chip is selected', () => {
    const {component} = setupTest({
      chips: [
        filterChip('c0', true),
        filterChip('c1', false),
        filterChip('c2', true),
      ],
      isMultiselectable: true,
    });

    expect(component.isChipSelected(0, MDCChipActionType.PRIMARY)).toBe(true);
  });

  it('#isChipSelected() returns false if the chip is not selected', () => {
    const {component} = setupTest({
      chips: [
        filterChip('c0', true),
        filterChip('c1', false),
        filterChip('c2', true),
      ],
      isMultiselectable: true,
    });

    expect(component.isChipSelected(1, MDCChipActionType.PRIMARY)).toBe(false);
  });

  it('#removeChip() proxies to the foundation', () => {
    const {component, mockFoundation} = setupTestWithMocks({
      chips: [
        filterChip('c0', true),
        filterChip('c1', false),
        filterChip('c2', true),
      ],
      isMultiselectable: true,
    });

    component.removeChip(1);
    expect(mockFoundation.removeChip).toHaveBeenCalledWith(1);
  });

  it('on click, focuses the source action if focusable', () => {
    const {root} = setupTest({
      chips: [
        multiActionInputChip('c0'),
        multiActionInputChip('c1'),
      ],
      isMultiselectable: false,
    });

    const primaryActionEl =
        root.querySelector<HTMLElement>('#c1 .mdc-evolution-chip__action')!;
    emitEvent(primaryActionEl, 'click', {
      bubbles: true,
    });

    expect(root.querySelector<HTMLElement>(
                   '#c1 .mdc-evolution-chip__action')!.getAttribute('tabindex'))
        .toBe('0');
  });

  it('on click, unfocuses all other actions', () => {
    const {root} = setupTest({
      chips: [
        multiActionInputChip('c0'),
        multiActionInputChip('c1'),
      ],
      isMultiselectable: false,
    });

    const primaryActionEl =
        root.querySelector<HTMLElement>('#c1 .mdc-evolution-chip__action')!;
    emitEvent(primaryActionEl, 'click', {
      bubbles: true,
    });

    expect(root.querySelector<HTMLElement>(
                   '#c0 .mdc-evolution-chip__action')!.getAttribute('tabindex'))
        .toBe('-1');
    expect(root.querySelector<HTMLElement>(
                   '#c0 .mdc-evolution-chip__action--trailing')!
               .getAttribute('tabindex'))
        .toBe('-1');
    expect(root.querySelector<HTMLElement>(
                   '#c1 .mdc-evolution-chip__action--trailing')!
               .getAttribute('tabindex'))
        .toBe('-1');
  });

  it('on click, does not focuses the source action if unfocusable', () => {
    const {root} = setupTest({
      chips: [
        actionChip('c0'),
        disabledActionChip('c1'),
      ],
      isMultiselectable: false,
    });

    const primaryActionEl =
        root.querySelector<HTMLElement>('#c1 .mdc-evolution-chip__action')!;
    emitEvent(primaryActionEl, 'click', {
      bubbles: true,
    });

    expect(root.querySelector<HTMLElement>(
                   '#c1 .mdc-evolution-chip__action')!.getAttribute('tabindex'))
        .not.toBe('0');
  });

  it('on click, selects the newly selected chip if selectable', () => {
    const {root} = setupTest({
      chips: [
        filterChip('c0', false),
        filterChip('c1', false),
      ],
      isMultiselectable: false,
    });

    const primaryActionEl =
        root.querySelector<HTMLElement>('#c0 .mdc-evolution-chip__action')!;
    emitEvent(primaryActionEl, 'click', {
      bubbles: true,
    });

    expect(root.querySelector<HTMLElement>('#c0 .mdc-evolution-chip__action')!
               .getAttribute('aria-selected'))
        .toBe('true');
  });

  it('on click, deselects the previously selected chip when not multiselectable',
     () => {
       const {root} = setupTest({
         chips: [
           filterChip('c0', true),
           filterChip('c1', false),
         ],
         isMultiselectable: false,
       });

       const primaryActionEl =
           root.querySelector<HTMLElement>('#c1 .mdc-evolution-chip__action')!;
       emitEvent(primaryActionEl, 'click', {
         bubbles: true,
       });

       expect(
           root.querySelector<HTMLElement>('#c0 .mdc-evolution-chip__action')!
               .getAttribute('aria-selected'))
           .toBe('false');
     });

  it('on click, does not deselect the previously selected chip when multiselectable',
     () => {
       const {root} = setupTest({
         chips: [
           filterChip('c0', true),
           filterChip('c1', false),
         ],
         isMultiselectable: true,
       });

       const primaryActionEl =
           root.querySelector<HTMLElement>('#c1 .mdc-evolution-chip__action')!;
       emitEvent(primaryActionEl, 'click', {
         bubbles: true,
       });

       expect(
           root.querySelector<HTMLElement>('#c0 .mdc-evolution-chip__action')!
               .getAttribute('aria-selected'))
           .toBe('true');
     });

  it('on keyboard navigation, focuses the next focusable action', () => {
    const {root} = setupTest({
      chips: [
        multiActionInputChip('c0'),
        multiActionInputChip('c1'),
      ],
      isMultiselectable: false,
    });

    const primaryActionEl =
        root.querySelector<HTMLElement>('#c1 .mdc-evolution-chip__action')!;
    primaryActionEl.dispatchEvent(createKeyboardEvent('keydown', {
      key: 'ArrowLeft',
    }));

    expect(root.querySelector<HTMLElement>(
                   '#c0 .mdc-evolution-chip__action--trailing')!
               .getAttribute('tabindex'))
        .toBe('0');
  });

  it('on keyboard navigation, unfocuses all other actions', () => {
    const {root} = setupTest({
      chips: [
        multiActionInputChip('c0'),
        multiActionInputChip('c1'),
      ],
      isMultiselectable: false,
    });

    const primaryActionEl =
        root.querySelector<HTMLElement>('#c1 .mdc-evolution-chip__action')!;
    primaryActionEl.dispatchEvent(createKeyboardEvent('keydown', {
      key: 'ArrowLeft',
    }));

    expect(root.querySelector<HTMLElement>(
                   '#c0 .mdc-evolution-chip__action')!.getAttribute('tabindex'))
        .toBe('-1');
    expect(root.querySelector<HTMLElement>(
                   '#c1 .mdc-evolution-chip__action')!.getAttribute('tabindex'))
        .toBe('-1');
    expect(root.querySelector<HTMLElement>(
                   '#c1 .mdc-evolution-chip__action--trailing')!
               .getAttribute('tabindex'))
        .toBe('-1');
  });

  it('announces chip addition when enter animation is complete' +
         ' and addition announcement is present',
     () => {
       const {root} = setupTest({
         chips: [
           multiActionInputChip('c0'),
           multiActionInputChip('c1'),
         ],
         isMultiselectable: false,
       });

       const detail: MDCChipAnimationEventDetail = {
         isComplete: true,
         addedAnnouncement: 'Added a chip',
         animation: MDCChipAnimation.ENTER,
         chipID: 'c0',
       };

       emitEvent(
           root.querySelector<HTMLElement>('#c0')!, MDCChipEvents.ANIMATION, {
             bubbles: true,
             cancelable: false,
             detail,
           });

       // Tick clock forward to account for setTimeout inside "announce".
       jasmine.clock().tick(1);
       const liveRegion = document.querySelector<HTMLElement>(
           `[${DATA_MDC_DOM_ANNOUNCE}="true"]`)!;
       expect(liveRegion.textContent).toEqual('Added a chip');
       // Clean up the live region.
       liveRegion.parentNode!.removeChild(liveRegion);
     });

  it('removes the chip from the DOM when removal animation is complete', () => {
    const {component, root} = setupTest({
      chips: [
        multiActionInputChip('c0'),
        multiActionInputChip('c1'),
      ],
      isMultiselectable: false,
    });

    const detail: MDCChipAnimationEventDetail = {
      isComplete: true,
      removedAnnouncement: 'Removed a chip',
      animation: MDCChipAnimation.EXIT,
      chipID: 'c0',
    };

    emitEvent(
        root.querySelector<HTMLElement>('#c0')!, MDCChipEvents.ANIMATION, {
          bubbles: true,
          cancelable: false,
          detail,
        });

    expect(component.getChipIndexByID('c0')).toBe(-1);
  });

  it('animates chip addition', () => {
    const {component, root} = setupTest({
      chips: [
        multiActionInputChip('c0'),
        multiActionInputChip('c1'),
      ],
      isMultiselectable: false,
    });

    const chip0 = root.querySelector<HTMLElement>('#c0')!;
    component.addChip(0);
    expect(chip0).toHaveClass(MDCChipCssClasses.ENTER);
  });
});
