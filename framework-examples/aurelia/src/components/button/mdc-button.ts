import {bindable, customAttribute, inject, DOM} from 'aurelia-framework';
import '@material/button/dist/mdc.button.css';

@customAttribute('mdc-button')
@inject(Element)
export class MdcButton {
    @bindable() secondary = false;
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

    secondaryChanged(newValue) {
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
