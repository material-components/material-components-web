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

import {emitEvent} from '../../../../testing/dom/events';
import {createMockFoundation} from '../../../../testing/helpers/foundation';
import {MDCChipFoundation} from '../../chip/index';
import {MDCChipSet, MDCChipSetFoundation} from '../index';

const getFixture = () => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
  <div class="mdc-chip-set">
    <div class="mdc-chip" id="chip1">
      <div class="mdc-chip__text">Chip content</div>
    </div>
    <div class="mdc-chip" id="chip2">
      <div class="mdc-chip__text">Chip content</div>
    </div>
    <div class="mdc-chip" id="chip3">
      <div class="mdc-chip__text">Chip content</div>
    </div>
  </div>`;

  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
};

describe('MDCChipSet', () => {
  it('attachTo returns an MDCChipSet instance', () => {
    expect(MDCChipSet.attachTo(getFixture()) instanceof MDCChipSet)
        .toBeTruthy();
  });

  class FakeChip {
    id: string;
    destroy: jasmine.Spy;
    focusPrimaryAction: jasmine.Spy;
    focusTrailingAction: jasmine.Spy;
    remove: jasmine.Spy;
    removeFocus: jasmine.Spy;
    setSelectedFromChipSet: jasmine.Spy;

    constructor(el: HTMLElement, readonly selected = false) {
      this.id = el.id;
      this.destroy = jasmine.createSpy('.destroy');
      this.focusPrimaryAction = jasmine.createSpy('.focusPrimaryAction');
      this.focusTrailingAction = jasmine.createSpy('.focusTrailingAction');
      this.remove = jasmine.createSpy('.remove');
      this.removeFocus = jasmine.createSpy('.removeFocus');
      this.setSelectedFromChipSet =
          jasmine.createSpy('.setSelectedFromChipSet');
    }
  }

  function setupTest() {
    const root = getFixture();
    const component =
        new MDCChipSet(root, undefined, (el: HTMLElement) => new FakeChip(el));
    return {root, component};
  }

  function setupMockFoundationTest({hasSelection = false} = {}) {
    const root = getFixture();
    const mockFoundation = createMockFoundation(MDCChipSetFoundation);

    if (!hasSelection) {
      const component = new MDCChipSet(root, mockFoundation);
      return {root, component, mockFoundation};
    } else {
      const component = new MDCChipSet(
          root, mockFoundation, (el: HTMLElement) => new FakeChip(el, true));
      return {root, component, mockFoundation};
    }
  }

  it('#constructor instantiates child chip components', () => {
    const {component} = setupTest();
    expect(component.chips.length).toEqual(3);
    expect(component.chips[0]).toEqual(jasmine.any(FakeChip));
    expect(component.chips[1]).toEqual(jasmine.any(FakeChip));
    expect(component.chips[2]).toEqual(jasmine.any(FakeChip));
  });

  it('#destroy cleans up child chip components', () => {
    const {component} = setupTest();
    component.destroy();
    expect(component.chips[0].destroy).toHaveBeenCalled();
    expect(component.chips[1].destroy).toHaveBeenCalled();
    expect(component.chips[2].destroy).toHaveBeenCalled();
  });

  it('#initialSyncWithDOM sets up event handlers', () => {
    const {root, mockFoundation} = setupMockFoundationTest();
    const {
      INTERACTION_EVENT,
      ARROW_LEFT_KEY,
      NAVIGATION_EVENT,
      REMOVAL_EVENT,
      SELECTION_EVENT
    } = MDCChipFoundation.strings;

    emitEvent(root, INTERACTION_EVENT, {
      bubbles: true,
      cancelable: true,
      detail: {
        chipId: 'chipA',
      },
    });

    expect(mockFoundation.handleChipInteraction).toHaveBeenCalledWith({
      chipId: 'chipA'
    });
    expect(mockFoundation.handleChipInteraction).toHaveBeenCalledTimes(1);

    emitEvent(root, SELECTION_EVENT, {
      bubbles: true,
      cancelable: true,
      detail: {
        chipId: 'chipA',
        selected: true,
        shouldIgnore: false,
      },
    });

    expect(mockFoundation.handleChipSelection).toHaveBeenCalledWith({
      chipId: 'chipA',
      selected: true,
      shouldIgnore: false,
    });
    expect(mockFoundation.handleChipSelection).toHaveBeenCalledTimes(1);

    emitEvent(root, REMOVAL_EVENT, {
      bubbles: true,
      cancelable: true,
      detail: {
        chipId: 'chipA',
        removedAnnouncement: 'Removed foo',
      },
    });

    expect(mockFoundation.handleChipRemoval).toHaveBeenCalledWith({
      chipId: 'chipA',
      removedAnnouncement: 'Removed foo'
    });
    expect(mockFoundation.handleChipRemoval).toHaveBeenCalledTimes(1);

    emitEvent(root, NAVIGATION_EVENT, {
      bubbles: true,
      cancelable: true,
      detail: {
        chipId: 'chipA',
        key: ARROW_LEFT_KEY,
        source: 1,
      },
    });

    expect(mockFoundation.handleChipNavigation).toHaveBeenCalledWith({
      chipId: 'chipA',
      key: ARROW_LEFT_KEY,
      source: 1,
    });
    expect(mockFoundation.handleChipNavigation).toHaveBeenCalledTimes(1);
  });

  it('#initialSyncWithDOM calls MDCChipSetFoundation#select on the selected chips',
     () => {
       const {mockFoundation} = setupMockFoundationTest({hasSelection: true});
       expect(mockFoundation.select).toHaveBeenCalledWith('chip1');
       expect(mockFoundation.select).toHaveBeenCalledWith('chip2');
       expect(mockFoundation.select).toHaveBeenCalledWith('chip3');
     });

  it('#destroy removes event handlers', () => {
    const {root, component, mockFoundation} = setupMockFoundationTest();
    component.destroy();

    emitEvent(root, MDCChipFoundation.strings.INTERACTION_EVENT);
    expect(mockFoundation.handleChipInteraction).not.toHaveBeenCalled();

    emitEvent(root, MDCChipFoundation.strings.SELECTION_EVENT);
    expect(mockFoundation.handleChipSelection).not.toHaveBeenCalled();

    emitEvent(root, MDCChipFoundation.strings.REMOVAL_EVENT);
    expect(mockFoundation.handleChipRemoval).not.toHaveBeenCalled();

    emitEvent(root, MDCChipFoundation.strings.NAVIGATION_EVENT);
    expect(mockFoundation.handleChipNavigation).not.toHaveBeenCalled();
  });

  it('get selectedChipIds proxies to foundation', () => {
    const {component, mockFoundation} = setupMockFoundationTest();
    component.selectedChipIds;
    expect(mockFoundation.getSelectedChipIds).toHaveBeenCalled();
  });

  it('#addChip adds a new chip to the chip set', () => {
    const {component} = setupTest();
    // component.initialSyncWithDOM(); // TODO: why is this here?

    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
    <div class="mdc-chip">
      <div class="mdc-chip__text">Hello world</div>
    </div>`;

    const chipEl = wrapper.firstElementChild as HTMLElement;
    wrapper.removeChild(chipEl);
    component.addChip(chipEl);

    expect(component.chips.length).toEqual(4);
    expect(component.chips[3]).toEqual(jasmine.any(FakeChip));
  });

  it('#adapter.hasClass returns true if class is set on chip set element',
     () => {
       const {root, component} = setupTest();
       root.classList.add('foo');
       expect(
           (component.getDefaultFoundation() as any).adapter.hasClass('foo'))
           .toBe(true);
     });

  it('#adapter.removeChipAtIndex removes the chip object from the chip set',
     () => {
       const {component} = setupTest();
       const chip = component.chips[0];
       (component.getDefaultFoundation() as any).adapter.removeChipAtIndex(0);
       expect(component.chips.length).toEqual(2);
       expect(chip.destroy).toHaveBeenCalled();
       expect(chip.remove).toHaveBeenCalled();
     });

  it('#adapter.removeChipAtIndex does nothing if the given object is not in the chip set',
     () => {
       const {component} = setupTest();
       (component.getDefaultFoundation() as any).adapter.removeChipAtIndex(-1);
       expect(component.chips.length).toEqual(3);
     });

  it('#adapter.selectChipAtIndex calls setSelectedFromChipSet on chip object',
     () => {
       const {component} = setupTest();
       const chip = component.chips[0];
       (component.getDefaultFoundation() as any)
           .adapter.selectChipAtIndex(0, true, true);
       expect(chip.setSelectedFromChipSet).toHaveBeenCalledWith(true, true);
     });

  it('#adapter.getChipListCount returns the number of chips', () => {
    const {component} = setupTest();
    expect(
        (component.getDefaultFoundation() as any).adapter.getChipListCount())
        .toEqual(3);
  });

  it('#adapter.getIndexOfChipById returns the index of the chip', () => {
    const {component} = setupTest();
    expect((component.getDefaultFoundation() as any)
               .adapter.getIndexOfChipById('chip1'))
        .toEqual(0);
  });

  it('#adapter.focusChipPrimaryActionAtIndex focuses the primary action of the chip at the given index',
     () => {
       const {component} = setupTest();
       (component.getDefaultFoundation() as any)
           .adapter.focusChipPrimaryActionAtIndex(0);
       expect(component.chips[0].focusPrimaryAction).toHaveBeenCalledTimes(1);
     });

  it('#adapter.focusChipTrailingActionAtIndex focuses the trailing action of the chip at the given index',
     () => {
       const {component} = setupTest();
       (component.getDefaultFoundation() as any)
           .adapter.focusChipTrailingActionAtIndex(0);
       expect(component.chips[0].focusTrailingAction).toHaveBeenCalledTimes(1);
     });

  it('#adapter.removeFocusFromChipAtIndex removes focus from the chip at the given index',
     () => {
       const {component} = setupTest();
       (component.getDefaultFoundation() as any)
           .adapter.removeFocusFromChipAtIndex(0);
       expect(component.chips[0].removeFocus).toHaveBeenCalledTimes(1);
     });

  it('#adapter.isRTL returns true if the text direction is RTL', () => {
    const {component, root} = setupTest();
    document.documentElement.appendChild(root);
    document.documentElement.setAttribute('dir', 'rtl');
    expect((component.getDefaultFoundation() as any).adapter.isRTL())
        .toBe(true);
    document.documentElement.removeAttribute('dir');
    document.documentElement.removeChild(root);
  });

  it('#adapter.isRTL returns false if the text direction is not RTL', () => {
    const {component, root} = setupTest();
    document.documentElement.appendChild(root);
    expect((component.getDefaultFoundation() as any).adapter.isRTL())
        .toBe(false);
    document.documentElement.removeChild(root);
  });
});
