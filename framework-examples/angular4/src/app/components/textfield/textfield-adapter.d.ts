interface MDCTextfieldAdapter {
	addClass: (string) => void
	removeClass: (string) => void
	addClassToLabel: (string) => void
	removeClassFromLabel: (string) => void
	addClassToHelptext: (string) => void
	removeClassFromHelptext: (string) => void
	helptextHasClass: (string) => boolean
	registerInputFocusHandler: (EventListener) => void
	deregisterInputFocusHandler: (EventListener) => void
	registerInputBlurHandler: (EventListener) => void
	deregisterInputBlurHandler: (EventListener) => void
	registerInputInputHandler: (EventListener) => void
	deregisterInputInputHandler: (EventListener) => void
	registerInputKeydownHandler: (EventListener) => void
	deregisterInputKeydownHandler: (EventListener) => void
	setHelptextAttr: (name: string, value: string) => void
	removeHelptextAttr: (string) => void
	getNativeInput: () => void
}