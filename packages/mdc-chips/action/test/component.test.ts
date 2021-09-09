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


import {createKeyboardEvent, emitEvent} from '../../../../testing/dom/events';
import {MDCChipAction, MDCChipActionAttributes, MDCChipActionEvents, MDCChipActionFocusBehavior, MDCChipActionType} from '../index';

interface TestOptions {
  readonly isDisabled?: boolean;
  readonly isFocusable?: boolean;
  readonly isSelectable?: boolean;
  readonly isTrailing?: boolean;
}

function getFixture({
  isDisabled,
  isTrailing,
  isFocusable,
  isSelectable,
}: TestOptions): HTMLButtonElement {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
  <button class="mdc-evolution-chip-action
      ${isTrailing ? 'mdc-evolution-chip__action--trailing' : ''}"
      ${isFocusable ? '' : 'aria-hidden="true"'}
      ${isSelectable ? 'role="option"' : ''}
      ${isDisabled ? 'disabled' : ''}>Label</button> `;
  const el = wrapper.firstElementChild as HTMLButtonElement;
  wrapper.removeChild(el);
  return el;
}

function setupTest(options: TestOptions = {
  isDisabled: false,
  isTrailing: false,
  isFocusable: false,
  isSelectable: false
}) {
  const root = getFixture(options);
  const component = new MDCChipAction(root);
  return {root, component};
}

describe('MDCChipAction', () => {
  it('attachTo initializes and returns a MDCChipAction instance', () => {
    expect(
        MDCChipAction.attachTo(getFixture({
          isFocusable: true,
        })) instanceof
        MDCChipAction)
        .toBeTruthy();
  });

  it('#setDisabled(true) disables the root', () => {
    const {component, root} = setupTest({
      isFocusable: true,
    });

    document.body.appendChild(root);
    component.setDisabled(true);
    expect(root.disabled).toBeTrue();
  });

  it('#setDisabled(false) enables the root', () => {
    const {component, root} = setupTest({
      isFocusable: true,
      isDisabled: true,
    });

    document.body.appendChild(root);
    component.setDisabled(false);
    expect(root.disabled).toBeFalse();
  });

  it('#isDisabled() returns true when configured', () => {
    const {component} = setupTest({
      isDisabled: true,
    });

    expect(component.isDisabled()).toBeTrue();
  });

  it('#isDisabled() returns false when configured', () => {
    const {component} = setupTest({
      isDisabled: false,
    });

    expect(component.isDisabled()).toBeFalse();
  });

  it(`#setFocus(${MDCChipActionFocusBehavior.FOCUSABLE_AND_FOCUSED}) gives` +
         ` focus to the root`,
     () => {
       const {component, root} = setupTest({
         isFocusable: true,
       });

       document.body.appendChild(root);
       component.setFocus(MDCChipActionFocusBehavior.FOCUSABLE_AND_FOCUSED);
       expect(root.getAttribute('tabindex')).toBe('0');
       expect(document.activeElement).toBe(root);
       document.body.removeChild(root);
     });

  it(`#setFocus(${MDCChipActionFocusBehavior.FOCUSABLE}) makes the` +
         ` root focusable`,
     () => {
       const {component, root} = setupTest({
         isFocusable: true,
       });

       component.setFocus(MDCChipActionFocusBehavior.FOCUSABLE);
       expect(root.getAttribute('tabindex')).toBe('0');
     });

  it(`#setFocus(${MDCChipActionFocusBehavior.NOT_FOCUSABLE}) makes the` +
         ` root unfocusable`,
     () => {
       const {component, root} = setupTest({
         isFocusable: true,
       });

       component.setFocus(MDCChipActionFocusBehavior.NOT_FOCUSABLE);
       expect(root.getAttribute('tabindex')).toBe('-1');
     });

  it('#isFocusable() returns true when configured', () => {
    const {component} = setupTest({
      isFocusable: true,
    });

    expect(component.isFocusable()).toBe(true);
  });

  it('#isFocusable() returns false when configured', () => {
    const {component} = setupTest();

    expect(component.isFocusable()).toBe(false);
  });

  it('#setSelected(true) updates the selected state when selectable', () => {
    const {root, component} = setupTest({
      isSelectable: true,
      isFocusable: true,
    });

    component.setSelected(true);
    expect(root.getAttribute(MDCChipActionAttributes.ARIA_SELECTED))
        .toBe('true');
  });

  it('#setSelected(false) updates the selected state when selectable', () => {
    const {root, component} = setupTest({
      isSelectable: true,
      isFocusable: true,
    });

    component.setSelected(false);
    expect(root.getAttribute(MDCChipActionAttributes.ARIA_SELECTED))
        .toBe('false');
  });

  it('#isSelected() returns true when selected', () => {
    const {component} = setupTest({
      isSelectable: true,
      isFocusable: true,
    });

    component.setSelected(true);
    expect(component.isSelected()).toBe(true);
  });

  it('#isSelected() returns false when not selected', () => {
    const {component} = setupTest({
      isSelectable: true,
      isFocusable: true,
    });

    component.setSelected(false);
    expect(component.isSelected()).toBe(false);
  });

  it('#isSelectable() returns true when selectable', () => {
    const {component} = setupTest({
      isSelectable: true,
      isFocusable: true,
    });

    expect(component.isSelectable()).toBe(true);
  });

  it('#isSelectable() returns false when not selectable', () => {
    const {component} = setupTest({
      isFocusable: true,
    });

    expect(component.isSelectable()).toBe(false);
  });

  it(`#actionType() returns ${MDCChipActionType.TRAILING} for trailing action`,
     () => {
       const {component} = setupTest({
         isTrailing: true,
         isFocusable: true,
       });

       expect(component.actionType()).toBe(MDCChipActionType.TRAILING);
     });

  it(`#actionType() returns ${MDCChipActionType.PRIMARY} for primary action`,
     () => {
       const {component} = setupTest({
         isFocusable: true,
       });

       expect(component.actionType()).toBe(MDCChipActionType.PRIMARY);
     });

  it(`click on root emits ${MDCChipActionEvents.INTERACTION}`, () => {
    const {root, component} = setupTest();

    const handler = jasmine.createSpy('emitInteractionHandler');
    component.listen(MDCChipActionEvents.INTERACTION, handler);
    emitEvent(root, 'click', {bubbles: true});
    component.unlisten(MDCChipActionEvents.INTERACTION, handler);
    expect(handler).toHaveBeenCalled();
  });

  it(`click on root does not emit ${
         MDCChipActionEvents.INTERACTION} when disabled`,
     () => {
       const {root, component} = setupTest({
         isDisabled: true,
       });

       const handler = jasmine.createSpy('emitInteractionHandler');
       component.listen(MDCChipActionEvents.INTERACTION, handler);
       emitEvent(root, 'click', {bubbles: true});
       component.unlisten(MDCChipActionEvents.INTERACTION, handler);
       expect(handler).not.toHaveBeenCalled();
     });

  it(`keydown on root emits ${MDCChipActionEvents.INTERACTION}`, () => {
    const {root, component} = setupTest();

    const handler = jasmine.createSpy('emitInteractionHandler');
    component.listen(MDCChipActionEvents.INTERACTION, handler);
    root.dispatchEvent(createKeyboardEvent('keydown', {
      key: 'Enter',
    }));
    component.unlisten(MDCChipActionEvents.INTERACTION, handler);
    expect(handler).toHaveBeenCalled();
  });

  it(`keydown on root emits ${MDCChipActionEvents.NAVIGATION}`, () => {
    const {root, component} = setupTest();

    const handler = jasmine.createSpy('emitInteractionHandler');
    component.listen(MDCChipActionEvents.NAVIGATION, handler);
    root.dispatchEvent(createKeyboardEvent('keydown', {
      key: 'ArrowLeft',
    }));
    component.unlisten(MDCChipActionEvents.NAVIGATION, handler);
    expect(handler).toHaveBeenCalled();
  });

  it('#destroy removes event handlers', () => {
    const {root, component} = setupTest();
    component.destroy();

    const handler = jasmine.createSpy('handler');
    component.listen(MDCChipActionEvents.INTERACTION, handler);
    component.listen(MDCChipActionEvents.NAVIGATION, handler);
    emitEvent(root, 'click', {bubbles: true});
    root.dispatchEvent(createKeyboardEvent('keydown', {
      key: 'Spacebar',
    }));
    root.dispatchEvent(createKeyboardEvent('keydown', {
      key: 'ArrowLeft',
    }));
    expect(handler).not.toHaveBeenCalled();
  });
});
