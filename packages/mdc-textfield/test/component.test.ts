/**
 * @license
 * Copyright 2016 Google Inc.
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

import {MDCFloatingLabel} from '../../mdc-floating-label/index';
import {MDCLineRipple} from '../../mdc-line-ripple/index';
import {MDCNotchedOutline} from '../../mdc-notched-outline/index';
import {MDCRipple} from '../../mdc-ripple/index';
import {emitEvent} from '../../../testing/dom/events';
import {createMockFoundation} from '../../../testing/helpers/foundation';
import {cssClasses as characterCounterCssClasses} from '../../mdc-textfield/character-counter/constants';
import {cssClasses as helperTextCssClasses} from '../../mdc-textfield/helper-text/constants';
import {MDCTextField, MDCTextFieldCharacterCounter, MDCTextFieldFoundation, MDCTextFieldHelperText, MDCTextFieldIcon,} from '../../mdc-textfield/index';

const {cssClasses} = MDCTextFieldFoundation;

const getFixture = () => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <label class="mdc-text-field mdc-text-field--with-leading-icon">
      <i class="material-icons mdc-text-field__icon mdc-text-field__icon--leading" tabindex="0" role="button">event</i>
      <input type="text" class="mdc-text-field__input" aria-labelledby="my-label">
      <span class="mdc-floating-label" id="my-label">My Label</span>
      <span class="mdc-line-ripple"></span>
    </label>
  `;
  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
};

const getHelperLineWithHelperText = () => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="${cssClasses.HELPER_LINE}">
      <div class="${helperTextCssClasses.ROOT}">helper text</div>
    </div>
  `;
  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
};

const getHelperLineWithCharacterCounter = () => {
  const wrapper = document.createElement('div');
  wrapper.innerHTML = `
    <div class="${cssClasses.HELPER_LINE}">
      <div class="${characterCounterCssClasses.ROOT}">helper text</div>
    </div>
  `;
  const el = wrapper.firstElementChild as HTMLElement;
  wrapper.removeChild(el);
  return el;
};

describe('MDCTextField', () => {
  it('attachTo returns an MDCTextField instance', () => {
    expect(MDCTextField.attachTo(getFixture()) instanceof MDCTextField)
        .toBeTruthy();
  });

  class FakeRipple {
    readonly destroy: jasmine.Spy;

    constructor(readonly root_: HTMLElement) {
      this.destroy = jasmine.createSpy('.destroy');
    }
  }

  class FakeLineRipple {
    readonly listen: jasmine.Spy;
    readonly unlisten: jasmine.Spy;
    readonly destroy: jasmine.Spy;
    readonly activate: jasmine.Spy;
    readonly deactivate: jasmine.Spy;
    readonly setRippleCenter: jasmine.Spy;

    constructor() {
      this.listen = jasmine.createSpy('.listen');
      this.unlisten = jasmine.createSpy('.unlisten');
      this.destroy = jasmine.createSpy('.destroy');
      this.activate = jasmine.createSpy('.activate');
      this.deactivate = jasmine.createSpy('.deactivate');
      this.setRippleCenter = jasmine.createSpy('.setRippleCenter');
    }
  }

  class FakeHelperText {
    readonly destroy: jasmine.Spy;
    constructor() {
      this.destroy = jasmine.createSpy('.destroy');
    }
  }

  class FakeCharacterCounter {
    readonly destroy: jasmine.Spy;
    constructor() {
      this.destroy = jasmine.createSpy('.destroy');
    }
  }

  class FakeIcon {
    readonly destroy: jasmine.Spy;
    constructor() {
      this.destroy = jasmine.createSpy('.destroy');
    }
  }

  class FakeLabel {
    readonly destroy: jasmine.Spy;
    readonly shake: jasmine.Spy;
    constructor() {
      this.destroy = jasmine.createSpy('.destroy');
      this.shake = jasmine.createSpy('.shake');
    }
  }

  class FakeOutline {
    readonly destroy: jasmine.Spy;
    constructor() {
      this.destroy = jasmine.createSpy('.destroy');
    }
  }

  it('#constructor instantiates a ripple on the root element by default',
     () => {
       const root = getFixture();
       const component = new MDCTextField(
           root, undefined, (el: HTMLElement) => new FakeRipple(el));
       expect(component.ripple!.root_).toEqual(root);
     });

  it('#constructor does not instantiate a ripple when ${cssClasses.OUTLINED} class is present',
     () => {
       const root = getFixture();
       root.classList.add(cssClasses.OUTLINED);
       const component = new MDCTextField(root);
       expect(component.ripple).toEqual(null);
     });

  it('#constructor does not instantiate a ripple when ${cssClasses.TEXTAREA} class is present',
     () => {
       const root = getFixture();
       root.classList.add(cssClasses.TEXTAREA);
       const component = new MDCTextField(root);
       expect(component.ripple).toEqual(null);
     });

  it('#constructor when given a `mdc-text-field--box` element, initializes a default ripple when no ' +
         'ripple factory given',
     () => {
       const root = getFixture();
       const component = new MDCTextField(root);
       expect(component.ripple).toEqual(jasmine.any(MDCRipple));
     });

  it('#constructor instantiates a line ripple on the `.mdc-line-ripple` element if present',
     () => {
       const root = getFixture();
       const component = new MDCTextField(root);
       expect(component['lineRipple_']).toEqual(jasmine.any(MDCLineRipple));
     });

  it('#constructor instantiates a helper text if present', () => {
    const root = getFixture();
    const helperText = getHelperLineWithHelperText();
    document.body.appendChild(root);
    document.body.appendChild(helperText);
    const component = new MDCTextField(root);
    expect(component['helperText_'])
        .toEqual(jasmine.any(MDCTextFieldHelperText));
    document.body.removeChild(root);
    document.body.removeChild(helperText);
  });

  it('#constructor instantiates a character counter if present', () => {
    const root = getFixture();
    const characterCounter = getHelperLineWithCharacterCounter();
    document.body.appendChild(root);
    root.querySelector('input')!.maxLength = 12;
    document.body.appendChild(characterCounter);
    const component = new MDCTextField(root);
    expect(component['characterCounter_'])
        .toEqual(jasmine.any(MDCTextFieldCharacterCounter));
    document.body.removeChild(root);
    document.body.removeChild(characterCounter);
  });

  it('#constructor instantiates a leading icon if an icon element is present',
     () => {
       const root = getFixture();
       const component = new MDCTextField(root);
       expect(component['leadingIcon_']).toEqual(jasmine.any(MDCTextFieldIcon));
       expect(component['trailingIcon_']).toEqual(null);
     });

  it('#constructor instantiates an icon for both icon elements if present',
     () => {
       const root = getFixture();
       root.classList.add('mdc-text-field--with-trailing-icon');

       const wrapper = document.createElement('div');
       wrapper.innerHTML =
           `<i class="mdc-text-field__icon mdc-text-field__icon--trailing material-icons">3d_rotations</i>`;
       const el = wrapper.firstElementChild as HTMLElement;
       wrapper.removeChild(el);
       root.appendChild(el);
       const component = new MDCTextField(root);
       expect(component['leadingIcon_']).toEqual(jasmine.any(MDCTextFieldIcon));
       expect(component['trailingIcon_'])
           .toEqual(jasmine.any(MDCTextFieldIcon));
     });

  it('#constructor instantiates a trailing icon if the icon is present', () => {
    const root = getFixture();
    const leadingIcon = root.querySelector('.mdc-text-field__icon');
    root.removeChild(leadingIcon as HTMLElement);
    const wrapper = document.createElement('div');
    wrapper.innerHTML =
        `<i class="mdc-text-field__icon mdc-text-field__icon--trailing material-icons">3d_rotations</i>`;
    const trailingIcon = wrapper.firstElementChild as HTMLElement;
    root.appendChild(trailingIcon);
    root.classList.add('mdc-text-field--with-trailing-icon');
    root.classList.remove('mdc-text-field--with-leading-icon');
    const component = new MDCTextField(root);
    expect(component['leadingIcon_']).toEqual(null);
    expect(component['trailingIcon_']).toEqual(jasmine.any(MDCTextFieldIcon));
  });

  it('#constructor instantiates a label on the `.mdc-floating-label` element if present',
     () => {
       const root = getFixture();
       const component = new MDCTextField(root);
       expect(component['label_']).toEqual(jasmine.any(MDCFloatingLabel));
     });

  it('#constructor instantiates an outline on the `.mdc-notched-outline` element if present',
     () => {
       const wrapper = document.createElement('div');
       wrapper.innerHTML = `<span class="mdc-notched-outline"></span>`;
       const child = wrapper.firstElementChild as HTMLElement;
       wrapper.removeChild(child);

       const root = getFixture();
       root.appendChild(child);
       const component = new MDCTextField(root);
       expect(component['outline_']).toEqual(jasmine.any(MDCNotchedOutline));
     });

  it('#constructor handles undefined optional sub-elements gracefully', () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="mdc-text-field">
        <input type="text" class="mdc-text-field__input" id="my-text-field">
      </div>
    `;
    const root = wrapper.firstElementChild as HTMLElement;
    wrapper.removeChild(root);

    expect(() => new MDCTextField(root)).not.toThrow();
  });

  it('default adapter methods handle sub-elements when present', () => {
    const root = getFixture();
    const component = new MDCTextField(root);
    const adapter = (component.getDefaultFoundation() as any).adapter_;
    expect(adapter.hasClass('foo')).toBe(false);
    expect(adapter.getLabelWidth()).toBeGreaterThan(0);
    expect(() => adapter.floatLabel).not.toThrow();
  });

  it('default adapter methods handle undefined optional sub-elements gracefully',
     () => {
       const wrapper = document.createElement('div');
       wrapper.innerHTML = `
         <div class="mdc-text-field">
           <input type="text" class="mdc-text-field__input" id="my-text-field">
         </div>
       `;
       const root = wrapper.firstElementChild as HTMLElement;
       wrapper.removeChild(root);

       const component = new MDCTextField(root);
       const adapter = (component.getDefaultFoundation() as any).adapter_;
       expect(adapter.getLabelWidth()).toEqual(0);
       expect(adapter.hasLabel()).toBe(false);
       expect(adapter.hasOutline()).toBe(false);
       expect(() => adapter.floatLabel).not.toThrow();
       expect(() => adapter.shakeLabel).not.toThrow();
       expect(() => adapter.activateLineRipple).not.toThrow();
       expect(() => adapter.deactivateLineRipple).not.toThrow();
       expect(() => adapter.setLineRippleTransformOrigin).not.toThrow();
       expect(() => adapter.closeOutline).not.toThrow();
       expect(() => adapter.notchOutline).not.toThrow();
     });

  /**
   * @param {!HTMLElement=} root
   * @return {{
   *   root: HTMLElement,
   *   component: MDCTextField,
   *   foundation: MDCTextFieldFoundation,
   *   adapter: MDCTextFieldAdapter,
   *   outline: MDCNotchedOutline,
   *   icon: MDCTextFieldIcon,
   *   lineRipple: MDCLineRipple,
   *   label: MDCFloatingLabel,
   *   helperText: MDCTextFieldHelperText,
   *   characterCounter: MDCTextFieldCharacterCounter,
   * }}
   */
  function setupTest(root = getFixture()) {
    const lineRipple = new FakeLineRipple();
    const helperText = new FakeHelperText();
    const characterCounter = new FakeCharacterCounter();
    const icon = new FakeIcon();
    const label = new FakeLabel();
    const outline = new FakeOutline();

    const component = new MDCTextField(
        root, undefined, (el: HTMLElement) => new FakeRipple(el),
        () => lineRipple, () => helperText, () => characterCounter, () => icon,
        () => label, () => outline);

    const foundation = component['foundation_'];
    const adapter = foundation['adapter_'];

    return {
      root,
      component,
      foundation,
      adapter,
      lineRipple,
      helperText,
      characterCounter,
      icon,
      label,
      outline
    };
  }

  it('#destroy cleans up the ripple if present', () => {
    const root = getFixture();
    const component = new MDCTextField(
        root, undefined, (el: HTMLElement) => new FakeRipple(el));
    component.destroy();
    expect(component.ripple!.destroy).toHaveBeenCalled();
  });

  it('#destroy cleans up the line ripple if present', () => {
    const {component, lineRipple} = setupTest();
    component.destroy();
    expect(lineRipple.destroy).toHaveBeenCalled();
  });

  it('#destroy cleans up the helper text if present', () => {
    const root = getFixture();
    const helperTextElement = getHelperLineWithHelperText();
    document.body.appendChild(root);
    document.body.appendChild(helperTextElement);
    const {component, helperText} = setupTest(root);
    component.destroy();
    expect(helperText.destroy).toHaveBeenCalled();
    document.body.removeChild(root);
    document.body.removeChild(helperTextElement);
  });

  it('#destroy cleans up the character counter if present', () => {
    const root = getFixture();
    const characterCounterElement = getHelperLineWithCharacterCounter();
    document.body.appendChild(root);
    document.body.appendChild(characterCounterElement);
    const {component, characterCounter} = setupTest(root);
    component.destroy();
    expect(characterCounter.destroy).toHaveBeenCalled();
    document.body.removeChild(root);
    document.body.removeChild(characterCounterElement);
  });

  it('#destroy cleans up the icon if present', () => {
    const {component, icon} = setupTest();
    component.destroy();
    expect(icon.destroy).toHaveBeenCalled();
  });

  it('#destroy cleans up the label if present', () => {
    const {component, label} = setupTest();
    component.destroy();
    expect(label.destroy).toHaveBeenCalled();
  });

  it('#destroy cleans up the outline if present', () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `<span class="mdc-notched-outline"></span>`;
    const child = wrapper.firstElementChild as HTMLElement;
    wrapper.removeChild(child);

    const root = getFixture();
    root.appendChild(child);
    const {component, outline} = setupTest(root);
    component.destroy();
    expect(outline.destroy).toHaveBeenCalled();
  });

  it('#destroy handles undefined optional sub-elements gracefully', () => {
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <div class="mdc-text-field">
        <input type="text" class="mdc-text-field__input" id="my-text-field">
      </div>
    `;
    const root = wrapper.firstElementChild as HTMLElement;
    wrapper.removeChild(root);

    const component = new MDCTextField(root);
    expect(() => component.destroy).not.toThrow();
  });

  it('#destroy handles undefined optional ripple gracefully', () => {
    const root = getFixture();
    const component = new MDCTextField(root);
    component.ripple = null;
    expect(() => component.destroy).not.toThrow();
  });

  it('#destroy calls destroy for both icon elements if present', () => {
    const root = getFixture();
    root.classList.add('mdc-text-field--with-trailing-icon');

    const wrapper = document.createElement('div');
    wrapper.innerHTML =
        `<i class="mdc-text-field__icon mdc-text-field__icon--trailing material-icons">3d_rotations</i>`;
    const child = wrapper.firstElementChild as HTMLElement;
    wrapper.removeChild(child);
    root.appendChild(child);

    const component = new MDCTextField(root);
    // The non-null assertion is deemed unnecessary, but without it tests on
    // GitHub side fail to compile with error `Object is possibly 'null'`
    // tslint:disable:no-unnecessary-type-assertion
    component['leadingIcon_']!.destroy =
        jasmine.createSpy('leadingIcon_.destroy');
    component['trailingIcon_']!.destroy =
        jasmine.createSpy('trailingIcon_.destroy');
    component.destroy();
    expect(component['leadingIcon_']!.destroy).toHaveBeenCalled();
    expect(component['trailingIcon_']!.destroy).toHaveBeenCalled();
    // tslint:enable:no-unnecessary-type-assertion
  });

  it('#initialSyncWithDOM sets disabled if input element is not disabled',
     () => {
       const {component} = setupTest();
       component.initialSyncWithDOM();
       expect(component.disabled).toBeFalsy();
     });

  it('#focus calls focus on the input element', () => {
    const {root, component} = setupTest();
    const input =
        root.querySelector('.mdc-text-field__input') as HTMLInputElement;
    input.focus = jasmine.createSpy('focus');
    component.focus();

    expect(input.focus).toHaveBeenCalledTimes(1);
  });

  it('get/set disabled updates the input element', () => {
    const {root, component} = setupTest();
    const input =
        root.querySelector('.mdc-text-field__input') as HTMLInputElement;
    component.disabled = true;
    expect(input.disabled).toBeTruthy();
    component.disabled = false;
    expect(input.disabled).toBeFalsy();
  });

  it('get/set disabled updates the component styles', () => {
    const {root, component} = setupTest();
    component.disabled = true;
    expect(root.classList.contains(cssClasses.DISABLED)).toBeTruthy();
    component.disabled = false;
    expect(root.classList.contains(cssClasses.DISABLED)).toBeFalsy();
  });

  it('set valid updates the component styles', () => {
    const {root, component} = setupTest();
    component.valid = false;
    expect(root.classList.contains(cssClasses.INVALID)).toBeTruthy();
    component.valid = true;
    expect(root.classList.contains(cssClasses.INVALID)).toBeFalsy();
  });

  it('set helperTextContent has no effect when no helper text element is present',
     () => {
       const {component} = setupTest();
       expect(() => {
         component.helperTextContent = 'foo';
       }).not.toThrow();
     });

  it('set leadingIconAriaLabel has no effect when no icon element is present',
     () => {
       const {component} = setupTest();
       expect(() => {
         component.leadingIconAriaLabel = 'foo';
       }).not.toThrow();
     });

  it('set trailingIconAriaLabel has no effect when no icon element is present',
     () => {
       const {component} = setupTest();
       expect(() => {
         component.trailingIconAriaLabel = 'foo';
       }).not.toThrow();
     });

  it('set leadingIconContent has no effect when no icon element is present',
     () => {
       const {component} = setupTest();
       expect(() => {
         component.leadingIconContent = 'foo';
       }).not.toThrow();
     });

  it('set trailingIconContent has no effect when no icon element is present',
     () => {
       const {component} = setupTest();
       expect(() => {
         component.trailingIconContent = 'foo';
       }).not.toThrow();
     });

  it('#adapter.addClass adds a class to the root element', () => {
    const {root, component} = setupTest();
    (component.getDefaultFoundation() as any).adapter_.addClass('foo');
    expect(root.classList.contains('foo')).toBeTruthy();
  });

  it('layout calls foundation notchOutline', () => {
    const {component, foundation} = setupTest();
    foundation.notchOutline = jasmine.createSpy('notchOutline');
    component.layout();
    expect(foundation.notchOutline).toHaveBeenCalledWith(false);
  });

  it('#adapter.removeClass removes a class from the root element', () => {
    const {root, component} = setupTest();
    root.classList.add('foo');
    (component.getDefaultFoundation() as any).adapter_.removeClass('foo');
    expect(root.classList.contains('foo')).toBeFalsy();
  });

  it('#adapter.registerInputInteractionHandler adds a handler to the input element for a given event',
     () => {
       const {root, component} = setupTest();
       const input =
           root.querySelector('.mdc-text-field__input') as HTMLInputElement;
       const handler = jasmine.createSpy('eventHandler');
       (component.getDefaultFoundation() as any)
           .adapter_.registerInputInteractionHandler('click', handler);
       emitEvent(input, 'click');
       expect(handler).toHaveBeenCalledWith(jasmine.anything());
     });

  it('#adapter.deregisterInputInteractionHandler removes a handler from the input element for a given event',
     () => {
       const {root, component} = setupTest();
       const input =
           root.querySelector('.mdc-text-field__input') as HTMLInputElement;
       const handler = jasmine.createSpy('eventHandler');

       input.addEventListener('click', handler);
       (component.getDefaultFoundation() as any)
           .adapter_.deregisterInputInteractionHandler('click', handler);
       emitEvent(input, 'click');
       expect(handler).not.toHaveBeenCalled();
     });

  it('#adapter.registerTextFieldInteractionHandler adds an event handler for a given event on the root',
     () => {
       const {root, component} = setupTest();
       const handler = jasmine.createSpy('TextFieldInteractionHandler');
       (component.getDefaultFoundation() as any)
           .adapter_.registerTextFieldInteractionHandler('click', handler);
       emitEvent(root, 'click');
       expect(handler).toHaveBeenCalledWith(jasmine.anything());
     });

  it('#adapter.deregisterTextFieldInteractionHandler removes an event handler for a given event from the root',
     () => {
       const {root, component} = setupTest();
       const handler = jasmine.createSpy('TextFieldInteractionHandler');
       root.addEventListener('click', handler);
       (component.getDefaultFoundation() as any)
           .adapter_.registerTextFieldInteractionHandler('click', handler);
       emitEvent(root, 'click');
       expect(handler).toHaveBeenCalledWith(jasmine.anything());
     });

  it('#adapter.registerValidationAttributeChangeHandler creates a working mutation observer',
     (done) => {
       const {root, component} = setupTest();
       const handler = jasmine.createSpy('ValidationAttributeChangeHandler');
       handler.withArgs(jasmine.any(Array)).and.callFake((arr) => {
         if (arr.indexOf('required') !== -1) {
           done();
         }
       });

       component['foundation_']['adapter_']
           .registerValidationAttributeChangeHandler(handler);
       (root.querySelector('.mdc-text-field__input') as HTMLInputElement)
           .required = true;
     });

  it('#adapter.deregisterValidationAttributeChangeHandler disconnects the passed observer',
     () => {
       const {component} = setupTest();
       const disconnect = jasmine.createSpy('ValidationDisconnect');
       const observer = new MutationObserver(() => undefined);
       observer.disconnect = disconnect;

       component['foundation_']['adapter_']
           .deregisterValidationAttributeChangeHandler(observer);
       expect(disconnect).toHaveBeenCalled();
     });

  it('#adapter.getNativeInput returns the component input element', () => {
    const {root, component} = setupTest();
    expect((component.getDefaultFoundation() as any).adapter_.getNativeInput())
        .toEqual(root.querySelector('.mdc-text-field__input'));
  });

  it('#adapter.activateLineRipple calls the activate method on the line ripple',
     () => {
       const {component, lineRipple} = setupTest();
       (component.getDefaultFoundation() as any).adapter_.activateLineRipple();
       expect(lineRipple.activate).toHaveBeenCalled();
     });

  it('#adapter.deactivateLineRipple calls the deactivate method on the line ripple',
     () => {
       const {component, lineRipple} = setupTest();
       (component.getDefaultFoundation() as any)
           .adapter_.deactivateLineRipple();
       expect(lineRipple.deactivate).toHaveBeenCalled();
     });

  it('#adapter.setLineRippleTransformOrigin calls the setRippleCenter method on the line ripple',
     () => {
       const {component, lineRipple} = setupTest();
       (component.getDefaultFoundation() as any)
           .adapter_.setLineRippleTransformOrigin(100);
       expect(lineRipple.setRippleCenter).toHaveBeenCalledWith(100);
     });

  it('should not focus input when clicking icon', () => {
    const root = getFixture();
    const icon = root.querySelector('.mdc-text-field__icon') as HTMLElement;
    const component = new MDCTextField(root);
    document.body.appendChild(root);
    component.root_.click();
    const input = (component as any).input_ as HTMLInputElement;
    expect(document.activeElement).toBe(input, 'input should be focused');
    input.blur();
    expect(document.activeElement).not.toBe(input, 'ensure input was blurred');
    icon.click();
    expect(document.activeElement)
        .not.toBe(input, 'input should not be focused');
    document.body.removeChild(root);
  });

  function setupMockFoundationTest(root = getFixture()) {
    const mockFoundation = createMockFoundation(MDCTextFieldFoundation);
    const component = new MDCTextField(root, mockFoundation);
    return {root, component, mockFoundation};
  }

  it('get/set value', () => {
    const {component, mockFoundation} = setupMockFoundationTest();
    component.value;
    expect(mockFoundation.getValue).toHaveBeenCalled();
    component.value = 'foo';
    expect(mockFoundation.setValue).toHaveBeenCalledWith('foo');
  });

  it('set leadingIconAriaLabel', () => {
    const {component, mockFoundation} = setupMockFoundationTest();
    component.leadingIconAriaLabel = 'label';
    expect(mockFoundation.setLeadingIconAriaLabel)
        .toHaveBeenCalledWith('label');
  });

  it('set leadingIconContent', () => {
    const {component, mockFoundation} = setupMockFoundationTest();
    component.leadingIconContent = 'label';
    expect(mockFoundation.setLeadingIconContent).toHaveBeenCalledWith('label');
  });

  it('set trailingIconAriaLabel', () => {
    const {component, mockFoundation} = setupMockFoundationTest();
    component.trailingIconAriaLabel = 'label';
    expect(mockFoundation.setTrailingIconAriaLabel)
        .toHaveBeenCalledWith('label');
  });

  it('set trailingIconContent', () => {
    const {component, mockFoundation} = setupMockFoundationTest();
    component.trailingIconContent = 'label';
    expect(mockFoundation.setTrailingIconContent).toHaveBeenCalledWith('label');
  });

  it('get/set valid', () => {
    const {component, mockFoundation} = setupMockFoundationTest();
    component.valid;
    expect(mockFoundation.isValid).toHaveBeenCalled();
    component.valid = true;
    expect(mockFoundation.setValid).toHaveBeenCalledWith(true);
  });

  it('get/set required', () => {
    const {component} = setupMockFoundationTest();
    component.required = true;
    expect(component.required).toBe(true);
    component.required = false;
    expect(component.required).toBe(false);
  });

  it('set useNativeValidation', () => {
    const {component, mockFoundation} = setupMockFoundationTest();
    component.useNativeValidation = true;
    expect(mockFoundation.setUseNativeValidation).toHaveBeenCalledWith(true);
  });

  it('get/set pattern', () => {
    const {component} = setupMockFoundationTest();
    component.pattern = '.{8,}';
    expect(component.pattern).toEqual('.{8,}');
    component.pattern = '.*';
    expect(component.pattern).toEqual('.*');
  });

  it('get/set minLength', () => {
    const {component} = setupMockFoundationTest();
    component.minLength = 8;
    expect(component.minLength).toEqual(8);
    component.minLength = 0;
    expect(component.minLength).toEqual(0);
  });

  it('get/set maxLength', () => {
    const {component} = setupMockFoundationTest();
    component.maxLength = 10;
    expect(component.maxLength).toEqual(10);
    component.maxLength = -1;
    // IE11 has a different value for no maxLength property
    expect(component.maxLength).not.toEqual(10);
  });

  it('get/set min', () => {
    const {component} = setupMockFoundationTest();
    component.min = '8';
    expect(component.min).toEqual('8');
    component.min = '0';
    expect(component.min).toEqual('0');
  });

  it('get/set max', () => {
    const {component} = setupMockFoundationTest();
    expect(component.max).toEqual('');
    component.max = '10';
    expect(component.max).toEqual('10');
    component.max = '';
    expect(component.max).toEqual('');
  });

  it('get/set step', () => {
    const {component} = setupMockFoundationTest();
    component.step = '8';
    expect(component.step).toEqual('8');
    component.step = '10';
    expect(component.step).toEqual('10');
  });
});
