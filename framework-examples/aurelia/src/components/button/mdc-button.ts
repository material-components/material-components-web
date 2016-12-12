import {bindable, customAttribute, inject, DOM} from 'aurelia-framework';

// Use webpack's require function to load the css
const MDC_BUTTON_STYLES = require('mdc-button-styles');
DOM.injectStyles(MDC_BUTTON_STYLES);

@customAttribute('mdc-button')
@inject(Element)
export class MdcButton {
    @bindable() accent = false;
    @bindable() raised = false;

    constructor(private element: Element) { }

    attached() {
        this.element.classList.add('mdc-button');
    }

    detached() {
        const classes = [
            'mdc-button',
            'mdc-button--accent',
            'mdc-button--raised'
        ];
        this.element.classList.remove(...classes);
    }

    accentChanged(newValue) {
        if (newValue) {
            this.element.classList.add('mdc-button--accent');
        } else {
            this.element.classList.remove('mdc-button--accent');
        }
    }

    raisedChanged(newValue) {
        if (newValue) {
            this.element.classList.add('mdc-button--raised');
        } else {
            this.element.classList.remove('mdc-button--raised');
        }
    }
}
