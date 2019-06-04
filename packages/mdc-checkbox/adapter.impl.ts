import {MDCCheckboxAdapter} from './adapter';
import {MDCCheckbox} from './component';
import {strings} from './constants';

export class MDCCheckboxAdapterImpl implements MDCCheckboxAdapter<MDCCheckbox> {
  static getAdapter(): MDCCheckboxAdapter<MDCCheckbox> {
    if (!MDCCheckboxAdapterImpl.instance) {
      MDCCheckboxAdapterImpl.instance = new MDCCheckboxAdapterImpl();
    }

    return MDCCheckboxAdapterImpl.instance;
  }

  private static instance: MDCCheckboxAdapterImpl;

  setInputChecked(checked: boolean, component: MDCCheckbox) {
    this.getNativeInput(component).checked = checked;
  }

  isInputChecked(component: MDCCheckbox): boolean {
    return this.getNativeInput(component).checked;
  }

  isInputIndeterminate(component: MDCCheckbox): boolean {
    return this.getNativeInput(component).indeterminate;
  }

  setInputIndeterminate(indeterminate: boolean, component: MDCCheckbox) {
    this.getNativeInput(component).indeterminate = indeterminate;
  }

  isInputDisabled(component: MDCCheckbox): boolean {
    return this.getNativeInput(component).disabled;
  }

  setInputDisabled(disabled: boolean, component: MDCCheckbox) {
    this.getNativeInput(component).disabled = disabled;
  }

  getInputValue(component: MDCCheckbox): string {
    return this.getNativeInput(component).value;
  }

  setInputValue(value: string, component: MDCCheckbox) {
    return this.getNativeInput(component).value = value;
  }

  addClass(className: string, component: MDCCheckbox) {
    component.getRoot().classList.add(className);
  }

  forceLayout(component: MDCCheckbox) {
    // tslint:disable-next-line: no-unused-expression
    (component.getRoot() as HTMLElement).offsetWidth;
  }

  isAttachedToDOM(component: MDCCheckbox) {
    return Boolean(component.getRoot().parentNode);
  }

  removeClass(className: string, component: MDCCheckbox) {
    component.getRoot().classList.remove(className);
  }

  removeAttributeFromInput(attr: string, component: MDCCheckbox) {
    this.getNativeInput(component).removeAttribute(attr);
  }

  setAttributeToInput(attr: string, value: string, component: MDCCheckbox) {
    this.getNativeInput(component).setAttribute(attr, value);
  }

  private getNativeInput(component: MDCCheckbox) {
    return component.root_.querySelector(strings.NATIVE_CONTROL_SELECTOR) as HTMLInputElement;
  }
}
