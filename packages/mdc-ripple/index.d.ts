declare class MDCRipple extends MDCComponent<MDCRippleFoundation> {

}

declare class MDCRippleFoundation extends MDCFoundation<MDCRippleAdapter> {
    public static get defaultAdapter(): MDCRippleAdapter;

}

declare class MDCRippleAdapter {
    browserSupportsCssVars(): boolean;
    isUnbounded(): boolean;
    isSurfaceActive(): boolean;
    isSurfaceDisabled(): boolean;
    addClass(className: string): void;
    removeClass(className: string): void;
    containsEventTarget(target: EventTarget): void;
    registerInteractionHandler(evtType: string, handler: EventHandlerNonNull): void;
    deregisterInteractionHandler(evtType: string, handler: EventHandlerNonNull): void;
    registerDocumentInteractionHandler(evtType: string, handler: EventHandlerNonNull): void;
    deregisterDocumentInteractionHandler(evtType: string, handler: EventHandlerNonNull): void;
    registerResizeHandler(handler: EventHandlerNonNull): void
    deregisterResizeHandler(handler: EventHandlerNonNull): void;
    updateCssVariable(varName, value);
    computeBoundingRect(varName: string, value: number|string|null): void;
    getWindowPageOffset(): {x: number, y: number};
}