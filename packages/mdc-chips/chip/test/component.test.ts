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
import {setUpMdcTestEnvironment} from '../../../../testing/helpers/setup';
import {MDCChipActionFocusBehavior, MDCChipActionType} from '../../action/constants';
import {MDCChipAnimationEvents} from '../constants';
import {MDCChip, MDCChipAnimation, MDCChipCssClasses, MDCChipEvents} from '../index';

interface ActionOptions {
  readonly isFocusable: boolean;
  readonly isSelectable: boolean;
  readonly isDisabled: boolean;
}

interface TestOptions {
  readonly primary: ActionOptions;
  readonly trailing?: ActionOptions;
  readonly id: string;
}

function actionFixture(
    {isFocusable, isSelectable, isDisabled}: ActionOptions,
    isTrailing: boolean = false): string {
  return `<button class="mdc-evolution-chip__action ${
      isTrailing ? 'mdc-evolution-chip__action--trailing' : ''}"
      ${isFocusable ? '' : 'aria-hidden="true"'}
      ${isSelectable ? 'role="option"' : ''}
      ${
      isDisabled ? (isSelectable ? 'aria-disabled="true"' : 'disabled') :
                   ''}>Label</button>`;
}

function getFixture({primary, trailing, id}: TestOptions): HTMLElement {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
  <div>
    ${actionFixture(primary)}
    ${trailing === undefined ? '' : actionFixture(trailing, true)}
  </div>`;
  const el = wrapper.firstElementChild as HTMLElement;
  el.id = id;
  wrapper.removeChild(el);
  return el;
}

function setupTest(options: TestOptions) {
  const root = getFixture(options);
  const component = new MDCChip(root);
  return {root, component};
}

describe('MDCChipAction', () => {
  setUpMdcTestEnvironment();

  it('attachTo initializes and returns a MDCChipAction instance', () => {
    const chip = MDCChip.attachTo(getFixture({
      primary: {isFocusable: true, isSelectable: false, isDisabled: false},
      trailing: {isFocusable: true, isSelectable: false, isDisabled: false},
      id: 'c0',
    }));
    expect(chip instanceof MDCChip).toBeTruthy();
  });

  it('#initialSyncWithDOM sets up event handlers', () => {
    const {component, root} = setupTest({
      primary: {isFocusable: true, isSelectable: false, isDisabled: false},
      trailing: {isFocusable: true, isSelectable: false, isDisabled: false},
      id: 'c0',
    });

    const primaryActionEl = root.querySelector('.mdc-evolution-chip__action')!;
    const interactionHandler = jasmine.createSpy('emitInteractionHandler');
    component.listen(MDCChipEvents.INTERACTION, interactionHandler);
    emitEvent(primaryActionEl, 'click', {
      bubbles: true,
    });
    component.unlisten(MDCChipEvents.INTERACTION, interactionHandler);
    expect(interactionHandler).toHaveBeenCalled();

    const navigationHandler = jasmine.createSpy('emitNavigationHandler');
    component.listen(MDCChipEvents.NAVIGATION, navigationHandler);
    primaryActionEl.dispatchEvent(createKeyboardEvent('keydown', {
      key: 'ArrowLeft',
    }));
    component.unlisten(MDCChipEvents.NAVIGATION, navigationHandler);
    expect(navigationHandler).toHaveBeenCalled();

    const animationEndHandler = jasmine.createSpy('emitAnimationEndHandler');
    component.listen(MDCChipAnimationEvents.ANIMATION_END, animationEndHandler);
    emitEvent(primaryActionEl, 'animationend', { bubbles: true });
    component.unlisten(MDCChipAnimationEvents.ANIMATION_END, animationEndHandler);
    expect(animationEndHandler).toHaveBeenCalled();

    const transitionEndHandler = jasmine.createSpy('emitTransitionEndHandler');
    component.listen(MDCChipAnimationEvents.TRANSITION_END, transitionEndHandler);
    emitEvent(primaryActionEl, 'transitionend',  { bubbles: true });
    component.unlisten(MDCChipAnimationEvents.TRANSITION_END, transitionEndHandler);
    expect(transitionEndHandler).toHaveBeenCalled();
  });

  it('#destroy removes event handlers', () => {
    const {component, root} = setupTest({
      primary: {isFocusable: true, isSelectable: false, isDisabled: false},
      trailing: {isFocusable: true, isSelectable: false, isDisabled: false},
      id: 'c0',
    });
    component.destroy();

    const primaryActionEl = root.querySelector('.mdc-evolution-chip__action')!;
    const interactionHandler = jasmine.createSpy('emitInteractionHandler');
    component.listen(MDCChipEvents.INTERACTION, interactionHandler);
    emitEvent(primaryActionEl, 'click', {
      bubbles: true,
    });
    component.unlisten(MDCChipEvents.INTERACTION, interactionHandler);
    expect(interactionHandler).not.toHaveBeenCalled();

    const navigationHandler = jasmine.createSpy('emitNavigationHandler');
    component.listen(MDCChipEvents.NAVIGATION, navigationHandler);
    primaryActionEl.dispatchEvent(createKeyboardEvent('keydown', {
      key: 'ArrowLeft',
    }));
    component.unlisten(MDCChipEvents.NAVIGATION, navigationHandler);
    expect(navigationHandler).not.toHaveBeenCalled();

    const animationEndHandler = jasmine.createSpy('emitAnimationEndHandler');
    component.listen(MDCChipAnimationEvents.ANIMATION_END, animationEndHandler);
    emitEvent(primaryActionEl, 'animationend');
    component.unlisten(MDCChipAnimationEvents.ANIMATION_END, animationEndHandler);
    expect(animationEndHandler).not.toHaveBeenCalled();

    const transitionEndHandler = jasmine.createSpy('emitTransitionEndHandler');
    component.listen(MDCChipAnimationEvents.TRANSITION_END, transitionEndHandler);
    emitEvent(primaryActionEl, 'transitionend');
    component.unlisten(MDCChipAnimationEvents.TRANSITION_END, transitionEndHandler);
    expect(transitionEndHandler).not.toHaveBeenCalled();
  });

  it('#getActions() returns the included actions', () => {
    const {component} = setupTest({
      primary: {isFocusable: true, isSelectable: false, isDisabled: false},
      trailing: {isFocusable: true, isSelectable: false, isDisabled: false},
      id: 'c0',
    });

    expect(component.getActions()).toEqual([
      MDCChipActionType.PRIMARY, MDCChipActionType.TRAILING
    ]);
  });

  it('#getElementID() returns the root ID', () => {
    const {component} = setupTest({
      primary: {isFocusable: true, isSelectable: false, isDisabled: false},
      trailing: {isFocusable: true, isSelectable: false, isDisabled: false},
      id: 'foo',
    });

    expect(component.getElementID()).toBe('foo');
  });

  it(`#isActionFocusable() returns true when configured`, () => {
    const {component} = setupTest({
      primary: {isFocusable: true, isSelectable: false, isDisabled: false},
      trailing: {isFocusable: true, isSelectable: false, isDisabled: false},
      id: 'c0',
    });

    expect(component.isActionFocusable(MDCChipActionType.PRIMARY)).toBe(true);
  });

  it(`#isActionSelectable() returns true when configured`, () => {
    const {component} = setupTest({
      primary: {isFocusable: true, isSelectable: true, isDisabled: false},
      trailing: {isFocusable: true, isSelectable: false, isDisabled: false},
      id: 'c0',
    });

    expect(component.isActionSelectable(MDCChipActionType.PRIMARY)).toBe(true);
  });

  it(`#isActionSelected() returns true when configured`, () => {
    const {component} = setupTest({
      primary: {isFocusable: true, isSelectable: true, isDisabled: false},
      trailing: {isFocusable: true, isSelectable: false, isDisabled: false},
      id: 'c0',
    });

    component.setActionSelected(MDCChipActionType.PRIMARY, true);
    expect(component.isActionSelected(MDCChipActionType.PRIMARY)).toBe(true);
  });

  it(`#setActionFocus() updates the focus when configured`, () => {
    const {component, root} = setupTest({
      primary: {isFocusable: true, isSelectable: false, isDisabled: false},
      id: 'c0',
    });

    component.setActionFocus(MDCChipActionType.PRIMARY, MDCChipActionFocusBehavior.FOCUSABLE);
    expect(root.querySelector('.mdc-evolution-chip__action')!.getAttribute(
               'tabindex'))
        .toBe('0');
  });

  it(`#setActionSelected() updates selection when configured`, () => {
    const {component, root} = setupTest({
      primary: {isFocusable: true, isSelectable: true, isDisabled: false},
      id: 'c0',
    });

    component.setActionSelected(MDCChipActionType.PRIMARY, true);
    expect(root.querySelector('.mdc-evolution-chip__action')!.getAttribute(
               'aria-selected'))
        .toBe('true');
  });

  it(`#setDisabled(true) updates the disabled state of all controls`, () => {
    const {component, root} = setupTest({
      primary: {isFocusable: true, isSelectable: false, isDisabled: false},
      id: 'c0',
    });

    component.setDisabled(true);
    expect(root.querySelector<HTMLButtonElement>(
                   '.mdc-evolution-chip__action')!.disabled)
        .toBeTrue();
  });

  it(`#setDisabled(false) updates the disabled state of all controls`, () => {
    const {component, root} = setupTest({
      primary: {isFocusable: true, isSelectable: false, isDisabled: true},
      id: 'c0',
    });

    component.setDisabled(false);
    expect(root.querySelector<HTMLButtonElement>(
                   '.mdc-evolution-chip__action')!.disabled)
        .toBeFalse();
  });

  it(`#isDisabled() returns false when configured`, () => {
    const {component} = setupTest({
      primary: {isFocusable: true, isSelectable: false, isDisabled: false},
      id: 'c0',
    });

    expect(component.isDisabled()).toBeFalse();
  });

  it(`#isDisabled() returns true when configured`, () => {
    const {component} = setupTest({
      primary: {isFocusable: true, isSelectable: false, isDisabled: true},
      id: 'c0',
    });

    expect(component.isDisabled()).toBeTrue();
  });

  it(`#handleAnimationEnd() sets width on exit animation completion`, () => {
    const {component, root} = setupTest({
      primary: {isFocusable: true, isSelectable: true, isDisabled: false},
      id: 'c0',
    });

    const width = root.offsetWidth;
    // tslint:disable-next-line:no-any
    (component as any).foundation.handleAnimationEnd({
      animationName: MDCChipAnimation.EXIT,
    });
    expect(root.style.getPropertyValue('width')).toBe(`${width}px`);
  });

  it(`#startMDCChipAnimation() starts the animation`, () => {
    const {component, root} = setupTest({
      primary: {isFocusable: true, isSelectable: true, isDisabled: false},
      id: 'c0',
    });

    component.startAnimation(MDCChipAnimation.ENTER);
    expect(root.classList.contains(MDCChipCssClasses.ENTER)).toBeTrue();
  });
});
