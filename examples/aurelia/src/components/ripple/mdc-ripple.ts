import {bindable, customAttribute, inject, DOM} from 'aurelia-framework';

// Since we don't have typings (yet) we require mdc-ripple manually.
// const MDCRippleModule = require('mdc-ripple');
const {MDCRipple} = require('mdc-ripple');
// Use webpack's require function to load the css
const MDC_RIPPLE_STYLES = require('mdc-ripple-styles');
DOM.injectStyles(MDC_RIPPLE_STYLES);

@customAttribute('mdc-ripple')
@inject(Element)
export class MdcRipple {
    @bindable() unbounded = false;
    mdcRipple;

    constructor(private element: Element) { }

    bind() {
        this.mdcRipple = new MDCRipple(this.element);
    }

    attached() {
        this.element.classList.add('mdc-ripple-surface');
    }

    detached() {
        this.mdcRipple.destroy();
    }

    unboundedChanged(newValue) {
        this.mdcRipple.unbounded = (newValue === true || newValue === 'true');
    }
}
