import './index.scss';


//TODO: have list of currently active buttons
class MDCSegButton {
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

class MDCSegButtonSingle {
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
            this.mdcSegButtonElements[0].setOn(true);
        }
    }


    handleToggle(event) {
        const on = event.detail.on;
        const id = event.detail.id;
        const otherElementsOn = this.mdcSegButtonElements.filter(element => element.isOn && element.getId() != id);
        if (on) {
            otherElementsOn.forEach(element => element.setOn(false));
        } else {
            if (otherElementsOn.length === 0) {
                this.mdcSegButtonElements[id].setOn(true);
            }
        }
    }
    
    getElement() {
        return this.root;
    }
}


class MDCSegButtonElement {
    private root: HTMLElement;
    private id: number;
    private parentElement: HTMLElement;

    constructor(root: HTMLElement, id: number, parentElement: HTMLElement) {
        this.root = root;
        this.id = id;
        this.parentElement = parentElement;
        this.root.addEventListener('click', this.toggleOn);
    }

    get isOn(): boolean {
        return this.root.classList.contains('mdc-seg-button__element--on');
    }

    set isOn(on: boolean) {
        if (on) {
            this.addClass('mdc-seg-button__element--on');
        } else {
            this.removeClass('mdc-seg-button__element--on');
        }
    }

    getOn(): boolean {
        return this.isOn;
    }

    setOn(on: boolean) {
        this.isOn = on;
    }

    toggleOn = () => {
        this.isOn = !this.isOn;
        // Avoids race conditions
        this.parentElement.dispatchEvent(new CustomEvent('toggled', {detail: {on: this.isOn, id: this.id}}));
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


/*
    The below section is what instantiates the buttons groups for demo
*/


const mdcSegButtonVanillaEls = document.querySelectorAll<HTMLElement>('.mdc-seg-button-vanilla');

if (mdcSegButtonVanillaEls) {
    mdcSegButtonVanillaEls.forEach((mdcSegButtonEl) => {
        if (mdcSegButtonEl.classList.contains('mdc-seg-button--single')) {
            new MDCSegButtonSingle(mdcSegButtonEl);
        } else {
            new MDCSegButton(mdcSegButtonEl);
        }
    });
}
