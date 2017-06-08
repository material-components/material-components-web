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
 
import { Component } from '@angular/core';

@Component({
	selector: 'home',
	templateUrl: './home.component.html'
})
export class Home {
	username = null;
	password = null;
	comments = null;
	subject = null;
	message = null;
	submitEventText = null;
	inputHasFocus = false;
	inputKeysPressed = 0;
	inputCount = 0;

	handleFocus($event) {
		this.inputHasFocus = true;
	}
	handleBlur($event) {
		this.inputHasFocus = false;
	}
	handleInput($event) {
		this.inputCount++;
	}
	handleKeyDown($event) {
		this.inputKeysPressed++;
	}
	onSubmit(message): void {
		this.submitEventText = message;
	}
}
