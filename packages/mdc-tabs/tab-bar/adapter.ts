export default interface MDCTabBarAdapter {
    addClass(className: string): void;
    removeClass(className: string): void;
    bindOnMDCTabSelectedEvent(): void;
    unbindOnMDCTabSelectedEvent(): void;
    registerResizeHandler(handler: EventListener): void;
    deregisterResizeHandler(handler: EventListener): void;
    getOffsetWidth(): number;
    setStyleForIndicator(propertyName: string, value: string): void;
    getOffsetWidthForIndicator(): number;
    notifyChange(evtData: {activeTabIndex: number}): void;
    getNumberOfTabs(): number;
    isTabActiveAtIndex(index: number): boolean;
    setTabActiveAtIndex(index: number, isActive: boolean): void;
    isDefaultPreventedOnClickForTabAtIndex(index: number): boolean;
    setPreventDefaultOnClickForTabAtIndex(index: number, preventDefaultOnClick: boolean): void;
    measureTabAtIndex(index: number): void;
    getComputedWidthForTabAtIndex(index: number): number;
    getComputedLeftForTabAtIndex(index: number): number;
}
