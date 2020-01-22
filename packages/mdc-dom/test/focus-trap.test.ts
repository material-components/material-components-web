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

import {FocusTrap} from '../focus-trap';
import {emitEvent} from '../../../testing/dom/events';

function getFixture() {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div id="root">
      <button>Hello</button>
      <div id="container1">
        <div id="con1a" tabindex="0">a</div>
        <div id="inner_container">
          <div id="con1b" tabindex="0">b</div>
        </div>
      </div>
      <div id="container2">
        <div id="con2a" tabindex="0">c</div>
        <div id="con2b" tabindex="0">d</div>
      </div>
      <div id="container3">
        <div id="con3a" tabindex="0" style="display: none">c</div>
        <div id="con3b" tabindex="0">d</div>
      </div>
      <div id="container4">
        <input id="con4a" disabled>
        <input id="con4b" aria-disabled="true">
        <input id="con4c" disabled="false">
        <input id="con4d" hidden>
        <input id="con4d" aria-hidden="true">
        <input id="con4e" aria-disabled="false">
      </div>
    </div>`;
  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
}

function setUp() {
  const root = getFixture();
  document.body.appendChild(root);
  const button = root.querySelector('button') as HTMLElement;
  const container1 = root.querySelector('#container1') as HTMLElement;
  const container2 = root.querySelector('#container2') as HTMLElement;
  const container3 = root.querySelector('#container3') as HTMLElement;
  const container4 = root.querySelector('#container4') as HTMLElement;
  return {button, container1, container2, container3, container4};
}

describe('FocusTrap', () => {
  afterEach(() => {
    [].slice.call(document.querySelectorAll('#root')).forEach((el) => {
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
    expect(container1.querySelectorAll('.mdc-focus-sentinel').length).toBe(0);
    // Since no previously focused element, focus should remain on the first
    // child of `container1`.
    expect(document.activeElement!.id).toBe('con1a');
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
    expect(document.activeElement!.id).toBe('con3b');
  });

  it('sets initial focus to first non-hidden/non-disabled focusable element', () => {
    const {container4} = setUp();
    const focusTrap = new FocusTrap(container4);
    focusTrap.trapFocus();
    expect(document.activeElement!.id).toBe('con4e');
  });

  it('sets initial focus to initialFocusEl', () => {
    const {container1} = setUp();
    const initialFocusEl = container1.querySelector('#con1b') as HTMLElement;
    const focusTrap = new FocusTrap(container1, { initialFocusEl });
    focusTrap.trapFocus();
    expect(document.activeElement!.id).toBe('con1b');
  });

  it('does not set initial focus when skipInitialFocus=true', () => {
    const {button, container1} = setUp();
    const focusTrap = new FocusTrap(container1, { skipInitialFocus: true });

    // First, set focus to button.
    button.focus();
    expect(document.activeElement).toBe(button);

    focusTrap.trapFocus();
    // Focus should remain on button.
    expect(document.activeElement).toBe(button);
  });
});

function expectFocusTrapped(
    el: HTMLElement, firstElementId: string, lastElementId: string) {
  expect(document.activeElement!.id).toBe(firstElementId);
  const focusSentinels = el.querySelectorAll('.mdc-focus-sentinel');
  const startFocusSentinel = focusSentinels[0] as HTMLElement;
  const endFocusSentinel = focusSentinels[1] as HTMLElement;
  // Sentinels are in the right part of the DOM tree.
  expect(el.firstElementChild as HTMLElement).toBe(startFocusSentinel);
  expect(el.lastElementChild as HTMLElement).toBe(endFocusSentinel);

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
