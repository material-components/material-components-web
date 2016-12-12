import {inject, bindable, bindingMode, DOM} from 'aurelia-framework';

// Since we don't have typings (yet) we require mdc-checkbox manually.
// const MDCCheckboxModule = require('mdc-checkbox');
const {MDCCheckbox} = require('mdc-checkbox');
// Use webpack's require function to load the css
const MDC_CHECKBOX_STYLES = require('mdc-checkbox-styles');
DOM.injectStyles(MDC_CHECKBOX_STYLES);

@inject(Element)
export class MdcCheckbox {
    @bindable({ defaultBindingMode: bindingMode.twoWay }) isChecked = false;
    @bindable({ defaultBindingMode: bindingMode.twoWay }) isIndeterminate = false;
    @bindable() isDisabled = false;
    mdcCheckbox;

    constructor(private element: Element) { }

    bind() {
        this.mdcCheckbox = new MDCCheckbox(this.element);
    }

    handleChange(e: Event) {
        // stop propagation so we're able to fire our own event when data-binding changes checked value
        e.stopPropagation();
    }

    isCheckedChanged(newValue) {
        this.isIndeterminate = false;
        const event = new CustomEvent('change', { bubbles: true, detail: { value: newValue }});
        this.element.dispatchEvent(event);
    }

    isDisabledChanged(newValue) {
        this.mdcCheckbox.disabled = !!newValue;
    }

    isIndeterminateChanged(newValue) {
        this.mdcCheckbox.indeterminate = !!newValue;
    }
}
