import { Directive, HostBinding, Input } from '@angular/core';

@Directive({
	selector: '[mdc-textfield-helptext]'
})
export class TextfieldHelptextDirective {
	@Input() id: string;
	@Input() persistent: boolean;
	@Input() validation: boolean;
	@HostBinding('class') className: string = 'mdc-textfield-helptext';
	@HostBinding('class.mdc-textfield-helptext--persistent') get classPersistent(): string {
		return this.persistent ? 'mdc-textfield-helptext--persistent' : '';
	}
	@HostBinding('class.mdc-textfield-helptext--validation-msg') get classValidation(): string {
		return this.validation ? 'mdc-textfield-helptext--validation-msg' : '';
	}
}