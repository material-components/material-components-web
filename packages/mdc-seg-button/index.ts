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

import './index.scss';


//TODO: have list of currently active buttons
export class MDCSegButton {
    private root: HTMLElement;
    private mdcSegButtonElements: MDCSegButtonElement[] = [];

    constructor(root: HTMLElement) {
        this.root = root;
        this.createMDCSegButtonElements();
    }

    createMDCSegButtonElements() {
        this.root.querySelectorAll<HTMLElement>('.mdc-seg-button__element').forEach((el, index) => {
            const mdcSegButtonElement = new MDCSegButtonElement(el, index, this.root);
            this.mdcSegButtonElements.push(mdcSegButtonElement);
        });
    }

    getElement() {
        return this.root;
    }

}

export class MDCSegButtonSingle {
    private root: HTMLElement;
    private mdcSegButtonElements: MDCSegButtonElement[] = [];

    constructor(root: HTMLElement) {
        this.root = root;
        this.createMDCSegButtonElements();
        this.root.addEventListener('toggled', (event) => {this.handleToggle(event)});
    }

    createMDCSegButtonElements() {
        this.root.querySelectorAll<HTMLElement>('.mdc-seg-button__element').forEach((el, index) => {
            const mdcSegButtonElement = new MDCSegButtonElement(el, index, this.root);
            this.mdcSegButtonElements.push(mdcSegButtonElement);
        });
        if (this.mdcSegButtonElements.length > 0) {
            this.mdcSegButtonElements[0].setToggled(true);
        }
    }


    handleToggle(event) {
        const toggled = event.detail.toggled;
        const id = event.detail.id;
        const otherElementsToggled = this.mdcSegButtonElements.filter(element => element.isToggled && element.getId() != id);
        if (toggled) {
            otherElementsToggled.forEach(element => element.setToggled(false));
        } else {
            if (otherElementsToggled.length === 0) {
                this.mdcSegButtonElements[id].setToggled(true);
            }
        }
    }
    
    getElement() {
        return this.root;
    }
}


export class MDCSegButtonElement {
    private root: HTMLElement;
    private id: number;
    private parentElement: HTMLElement;

    constructor(root: HTMLElement, id: number, parentElement: HTMLElement) {
        this.root = root;
        this.id = id;
        this.parentElement = parentElement;
        this.root.addEventListener('click', this.handleToggle);
    }

    get isToggled(): boolean {
        return this.root.classList.contains('mdc-seg-button__element--toggled');
    }

    set isToggled(toggled: boolean) {
        if (toggled) {
            this.addClass('mdc-seg-button__element--toggled');
        } else {
            this.removeClass('mdc-seg-button__element--toggled');
        }
    }

    getToggled(): boolean {
        return this.isToggled;
    }

    setToggled(toggled: boolean) {
        this.isToggled = toggled;
    }

    handleToggle = () => {
        this.isToggled = !this.isToggled;
        // Avoids race conditions
        this.parentElement.dispatchEvent(new CustomEvent('toggled', {detail: {toggled: this.isToggled, id: this.id}}));
    };

    getId(): number {
        return this.id;
    }

    addClass(className: string) {
        this.root.classList.add(className);
    }

    removeClass(className: string) {
        this.root.classList.remove(className);
    }

    getElement() {
        return this.root;
    }

}
