/**
 * Copyright 2016 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
 
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