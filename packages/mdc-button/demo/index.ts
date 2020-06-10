import './index.scss';

//TODO: have list of currently active buttons
class SegButtonVanilla {
    private root: HTMLElement;
    private segButtonElements: SegButtonElement[] = [];

    constructor(root: HTMLElement) {
        this.root = root;
        this.createSegButtonElements();
    }

    createSegButtonElements() {
        this.root.querySelectorAll<HTMLElement>('.seg-button__element').forEach((el, index) => {
            const segButtonElement = new SegButtonElement(el, index, this.root);
            this.segButtonElements.push(segButtonElement);
        });
    }

    getElement() {
        return this.root;
    }

}

class SegButtonVanillaSingle {
    private root: HTMLElement;
    private segButtonElements: SegButtonElement[] = [];

    constructor(root: HTMLElement) {
        this.root = root;
        this.createSegButtonElements();
        this.root.addEventListener('toggled', (event) => {this.handleToggle(event)});
    }

    createSegButtonElements() {
        this.root.querySelectorAll<HTMLElement>('.seg-button__element').forEach((el, index) => {
            const segButtonElement = new SegButtonElement(el, index, this.root);
            this.segButtonElements.push(segButtonElement);
        });
        if (this.segButtonElements.length > 0) {
            this.segButtonElements[0].setOn(true);
        }
    }


    handleToggle(event) {
        const on = event.detail.on;
        const id = event.detail.id;
        const otherElementsOn = this.segButtonElements.filter(element => element.isOn && element.getId() != id);
        if (on) {
            otherElementsOn.forEach(element => element.setOn(false));
        } else {
            if (otherElementsOn.length === 0) {
                this.segButtonElements[id].setOn(true);
            }
        }
    }
    
    getElement() {
        return this.root;
    }
}

class SegButtonAuto {
    private root: HTMLElement;
    private segButtonElements: SegButtonElement[] = [];

    constructor(root: HTMLElement) {
        this.root = root;
        this.createSegButtonElements();
    }

    createSegButtonElements() {
        this.root.querySelectorAll<HTMLElement>('.seg-button__element').forEach((el, index) => {
            const segButtonElement = new SegButtonElement(el, index, this.root);
            segButtonElement.addClass('mdc-button');
            segButtonElement.addClass('mdc-button--outlined');
            this.segButtonElements.push(segButtonElement);
        });
        for (let i = 0; i < this.segButtonElements.length; i++) {
            if (i == 0) {
                this.segButtonElements[i].setPosition('LEFT');
            } else if (i == this.segButtonElements.length - 1) {
                this.segButtonElements[i].setPosition('RIGHT');
            } else {
                this.segButtonElements[i].setPosition('INNER');
            }
        }
    }

    getElement() {
        return this.root;
    }

}



class SegButtonElement {
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
        return this.root.classList.contains('seg-button__element--on');
    }

    set isOn(on: boolean) {
        if (on) {
            this.addClass('seg-button__element--on');
        } else {
            this.removeClass('seg-button__element--on');
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

    // TODO: don't use string
    setPosition(pos: string) {
        this.removeClass('seg-button__element--left');
        this.removeClass('seg-button__element--right');
        this.removeClass('seg-button__element--inner');

        if (pos == 'LEFT') {
            this.addClass('seg-button__element--left');
        } else if (pos == 'RIGHT') {
            this.addClass('seg-button__element--right');
        } else if (pos == 'INNER') {
            this.addClass('seg-button__element--inner');
        } else {
            throw new Error('No class for ' + pos);
        }
    }

    getElement() {
        return this.root;
    }

}


/*
    The below section is what instantiates the buttons groups.
*/


const segButtonVanillaEls = document.querySelectorAll<HTMLElement>('.seg-button-vanilla');

if (segButtonVanillaEls) {
    segButtonVanillaEls.forEach((segButtonEl) => {
        if (segButtonEl.classList.contains('seg-button--single')) {
            new SegButtonVanillaSingle(segButtonEl);
        } else {
            new SegButtonVanilla(segButtonEl);
        }
    });
}


const segButtonAutoEls = document.querySelectorAll<HTMLElement>('.seg-button-auto');

if (segButtonAutoEls) {
    segButtonAutoEls.forEach(segButtonEl => new SegButtonAuto(segButtonEl));
}