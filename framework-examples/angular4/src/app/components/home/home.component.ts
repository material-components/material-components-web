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
