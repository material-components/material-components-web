import {MDCCheckboxAdapter} from './adapter';

export class MDCCheckboxDefaultAdapter implements MDCCheckboxAdapter<{}> {
  static getAdapter(): MDCCheckboxAdapter<{}> {
    if (!MDCCheckboxDefaultAdapter.instance) {
      MDCCheckboxDefaultAdapter.instance = new MDCCheckboxDefaultAdapter();
    }

    return MDCCheckboxDefaultAdapter.instance;
  }

  private static instance: MDCCheckboxDefaultAdapter;

  setInputChecked() {}

  isInputChecked() {
    return false;
  };

  isInputIndeterminate() {
    return false;
  }

  setInputIndeterminate() {}

  isInputDisabled() {
    return false;
  }

  setInputDisabled() {}

  getInputValue() {
    return '';
  }

  setInputValue() {}

  addClass() {}

  forceLayout() {}

  isAttachedToDOM() {
    return false;
  }

  removeClass() {}

  removeAttributeFromInput() {}

  setAttributeToInput() {}
}
