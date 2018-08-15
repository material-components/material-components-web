
declare class MDCCheckbox extends MDCComponent {
    private ripple_: MDCRipple;
    private get nativeCb_(): Object | null;
    private initRipple(): MDCRipple;
    public getDefaultFoundation(): MDCCheckboxFoundation;
    public get ripple(): MDCRipple;
    public get checked(): boolean;
    public set checked(isChecked: boolean);
    public get indeterminate(): boolean;
    public set indeterminate(isIndeterminate: boolean);
    public get disabled(): boolean;
    public set disabled(isDisabled: boolean);
    public get value(): boolean;
    public set value(value: boolean);
}

declare class MDCCheckboxFoundation extends MDCFoundation<MDCCheckboxAdapter> {
    public static get defaultAdapter(): MDCCheckboxAdapter;
    constructor(MDCCheckboxAdapter);
    public init();
    public destroy();
    public isChecked(): boolean;
    public setChecked(isChecked: boolean): void;
    public isIndeterminate(): boolean;
    public setIndeterminate(isIndeterminate: boolean): void;
    public isDisabled(): boolean;
    public setDisabled(isDisabled: boolean): void;
    public getValue(): string | null;
    public setValue(value?: string): void;
    public handleAnimationEnd(): void;
    public handleChange(): void;
    private installPropertyChangeHooks_(): void;
    private uninstallPropertyChangeHooks_(): void;
    private transitionCheckState_(): void
    private determineCheckState_(nativeCb: Object): string;
    private getTransitionAnimationClass_(oldState: string, newState: string): string;
    private updateAriaChecked_(): void;
    private getNativeControl_(): Object;
    validDescriptor(inputPropDesc: Object): boolean;
}

declare interface MDCCheckboxAdapter {
    addClass(className: string): void;
    removeClass(className: string): void;
    setNativeControlAttr(attr: string, value: string): void;
    removeNativeControlAttr(attr: string): void;
    registerAnimationEndHandler(handler: EventHandlerNonNull): void;
    deregisterAnimationEndHanlder(handler: EventHandlerNonNull): void;
    registerChangeHandler(handler: EventHandlerNonNull): void;
    deregisterChangeHandler(handleR: EventHandlerNonNull): void;
    getNativeControl(): Element;
    forceLayout(): void;
    isAttachedToDOM(): boolean;
}
