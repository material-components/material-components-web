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

import {emitEvent} from '../../../testing/dom/events';
import {FocusTrap} from '../focus-trap';

const FOCUS_SENTINEL_CLASS = 'mdc-dom-focus-sentinel';

function getFixture() {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div id="root">
      <button>Hello</button>
      <div id="container1_innerDiv">
        <div id="con1a" tabindex="0">1a</div>
        <div id="inner_container">
          <div id="con1b" tabindex="0">1b</div>
        </div>
      </div>
      <div id="container2_standard">
        <div id="con2a" tabindex="0">2a</div>
        <div id="con2b" tabindex="0">2b</div>
      </div>
      <div id="container3_notVisibleElements">
        <div id="con3a" tabindex="0" style="display: none">3a</div>
        <div id="con3b" tabindex="0" style="visibility: hidden">3b</div>
        <div id="con3c" tabindex="0">3c</div>
      </div>
      <div id="container4_disabledOrHiddenElements">
        <input id="con4a" disabled>
        <input id="con4b" aria-disabled="true">
        <input id="con4c" disabled="false">
        <input id="con4d" hidden>
        <input id="con4d" aria-hidden="true">
        <input id="con4e" aria-disabled="false">
      </div>
      <div id="container5_noFocusableChild">
        <div id="con5a">5a</div>
      </div>
    </div>`;
  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
}

function setUp() {
  const root = getFixture();
  document.body.appendChild(root);
  const button = root.querySelector('button')!;
  const container1 = root.querySelector<HTMLElement>('#container1_innerDiv')!;
  const container2 = root.querySelector<HTMLElement>('#container2_standard')!;
  const container3 =
      root.querySelector<HTMLElement>('#container3_notVisibleElements')!;
  const container4 =
      root.querySelector<HTMLElement>('#container4_disabledOrHiddenElements')!;
  const container5 =
      root.querySelector<HTMLElement>('#container5_noFocusableChild')!;
  return {button, container1, container2, container3, container4, container5};
}

describe('FocusTrap', () => {
  afterEach(() => {
    Array.from(document.querySelectorAll('#root')).forEach((el) => {
      document.body.removeChild(el);
    });
  });

  it('traps focus in the given container element', () => {
    const {container1, container2} = setUp();
    const focusTrap1 = new FocusTrap(container1);
    focusTrap1.trapFocus();
    expectFocusTrapped(container1, 'con1a', 'con1b');

    const focusTrap2 = new FocusTrap(container2);
    focusTrap2.trapFocus();
    expectFocusTrapped(container2, 'con2a', 'con2b');
  });

  it('releases focus from the given container element', () => {
    const {container1} = setUp();
    const focusTrap1 = new FocusTrap(container1);
    focusTrap1.trapFocus();
    expectFocusTrapped(container1, 'con1a', 'con1b');

    focusTrap1.releaseFocus();
    expect(container1.querySelectorAll(`.${FOCUS_SENTINEL_CLASS}`).length)
        .toBe(0);
  });

  it('restores focus to previously focused element', () => {
    const {button, container2} = setUp();
    const focusTrap = new FocusTrap(container2);

    // First, set focus to button.
    button.focus();
    expect(document.activeElement).toBe(button);
    // Trap focus in `container2`.
    focusTrap.trapFocus();
    expect(document.activeElement!.id).toBe('con2a');
    // Expect focus to be restored to button.
    focusTrap.releaseFocus();
    expect(document.activeElement).toBe(button);
  });

  it('sets initial focus to first visible focusable element', () => {
    const {container3} = setUp();
    const focusTrap = new FocusTrap(container3);
    focusTrap.trapFocus();
    expect(document.activeElement!.id).toBe('con3c');
  });

  it('sets initial focus to first non-hidden/non-disabled focusable element',
     () => {
       const {container4} = setUp();
       const focusTrap = new FocusTrap(container4);
       focusTrap.trapFocus();
       expect(document.activeElement!.id).toBe('con4e');
     });

  it('sets initial focus to initialFocusEl', () => {
    const {container1} = setUp();
    const initialFocusEl = container1.querySelector<HTMLElement>('#con1b')!;
    const focusTrap = new FocusTrap(container1, {initialFocusEl});
    focusTrap.trapFocus();
    expect(document.activeElement!.id).toBe('con1b');
  });

  it('does not set initial focus when skipInitialFocus=true', () => {
    const {button, container1} = setUp();
    const focusTrap = new FocusTrap(container1, {skipInitialFocus: true});

    // First, set focus to button.
    button.focus();
    expect(document.activeElement).toBe(button);

    focusTrap.trapFocus();
    // Focus should remain on button.
    expect(document.activeElement).toBe(button);
  });

  it('does not restore focus when skipRestoreFocus=true', () => {
    const {button, container2} = setUp();
    const focusTrap = new FocusTrap(container2, {skipRestoreFocus: true});

    // First, set focus to button.
    button.focus();
    expect(document.activeElement).toBe(button);
    // Trap focus in `container2`.
    focusTrap.trapFocus();
    expect(document.activeElement!.id).toBe('con2a');
    // Expect focus not to have changed.
    focusTrap.releaseFocus();
    expect(document.activeElement!.id).toBe('con2a');
  });

  it('throws an error when trapping focus in an element with 0 focusable elements',
     () => {
       const {container5} = setUp();
       const focusTrap = new FocusTrap(container5);
       expect(() => {
         focusTrap.trapFocus();
       })
           .toThrow(jasmine.stringMatching(
               /Element must have at least one focusable child/));
     });
});

function expectFocusTrapped(
    el: HTMLElement, firstElementId: string, lastElementId: string) {
  expect(document.activeElement!.id).toBe(firstElementId);
  const focusSentinels = el.querySelectorAll(`.${FOCUS_SENTINEL_CLASS}`);
  const startFocusSentinel = focusSentinels[0] as HTMLElement;
  const endFocusSentinel = focusSentinels[1] as HTMLElement;

  // Patch #addEventListener to make it synchronous for `focus` events.
  const fakeFocusHandler = (eventName: string, eventHandler: any) => {
    if (eventName === 'focus') {
      eventHandler();
    }
  };
  startFocusSentinel.addEventListener = fakeFocusHandler;
  endFocusSentinel.addEventListener = fakeFocusHandler;

  // Focus on sentinels gets trapped inside the scope.
  // Note that we use `emitEvent` here as calling #focus does not seem to
  // execute the handler synchronously in IE11.
  emitEvent(startFocusSentinel, 'focus');
  expect(document.activeElement!.id).toBe(lastElementId);
  emitEvent(endFocusSentinel, 'focus');
  expect(document.activeElement!.id).toBe(firstElementId);
}
