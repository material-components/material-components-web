export default interface MDCTabAdapter {
    addClass(className: string): void;
    deregisterInteractionHandler(type: string, handler: EventListener): void;
    getOffsetLeft(): number;
    getOffsetWidth(): number;
    notifySelected(): void;
    registerInteractionHandler(type: string, handler: EventListener): void;
    removeClass(className: string): void;

}
