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
export class MDCSegmentedButton {
    private root: HTMLElement;
    private mdcSegmentedButtonSegments: MDCSegmentedButtonSegment[] = [];

    constructor(root: HTMLElement) {
        this.root = root;
        this.createMDCSegButtonSegments();
    }

    createMDCSegButtonSegments() {
        this.root.querySelectorAll<HTMLElement>('.mdc-segmented-button__segment').forEach((el, index) => {
            const mdcSegmentedButtonSegment = new MDCSegmentedButtonSegment(el, index, this.root);
            this.mdcSegmentedButtonSegments.push(mdcSegmentedButtonSegment);
        });
    }

    getElement() {
        return this.root;
    }

}

export class MDCSegmentedButtonSingle {
    private root: HTMLElement;
    private mdcSegmentedButtonSegments: MDCSegmentedButtonSegment[] = [];

    constructor(root: HTMLElement) {
        this.root = root;
        this.createMDCSegButtonSegments();
        this.root.addEventListener('selected', (event) => {this.handleSelected(event)});
    }

    createMDCSegButtonSegments() {
        this.root.querySelectorAll<HTMLElement>('.mdc-segmented-button__segment').forEach((el, index) => {
            const mdcSegmentedButtonSegment = new MDCSegmentedButtonSegment(el, index, this.root);
            this.mdcSegmentedButtonSegments.push(mdcSegmentedButtonSegment);
        });
        if (this.mdcSegmentedButtonSegments.length > 0) {
            this.mdcSegmentedButtonSegments[0].setSelected(true);
        }
    }


    handleSelected(event) {
        const selected = event.detail.selected;
        const id = event.detail.id;
        const otherSegmentsSelected = this.mdcSegmentedButtonSegments.filter(segment => segment.isSelected() && segment.getId() != id);
        if (selected) {
            otherSegmentsSelected.forEach(segment => segment.setSelected(false));
        } else {
            if (otherSegmentsSelected.length === 0) {
                this.mdcSegmentedButtonSegments[id].setSelected(true);
            }
        }
    }
    
    getElement() {
        return this.root;
    }
}


export class MDCSegmentedButtonSegment {
    private root: HTMLElement;
    private id: number;
    private parentElement: HTMLElement;

    constructor(root: HTMLElement, id: number, parentElement: HTMLElement) {
        this.root = root;
        this.id = id;
        this.parentElement = parentElement;
        this.root.addEventListener('click', this.handleClick);
    }


    isSelected(): boolean {
        return this.root.classList.contains('mdc-segmented-button__segment--selected');
    }

    setSelected(selected: boolean) {
        if (selected) {
            this.addClass('mdc-segmented-button__segment--selected');
        } else {
            this.removeClass('mdc-segmented-button__segment--selected');
        }
    }

    handleClick = () => {
        this.setSelected(!this.isSelected());
        // Avoids race conditions
        this.parentElement.dispatchEvent(new CustomEvent('selected', {detail: {selected: this.isSelected(), id: this.id}}));
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
