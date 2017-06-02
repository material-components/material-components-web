import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { TextfieldComponent } from './textfield';

const TEXTFIELD_COMPONENTS = [
	TextfieldComponent
];

@NgModule({
	imports: [FormsModule, CommonModule],
	exports: [TEXTFIELD_COMPONENTS],
	declarations: [TEXTFIELD_COMPONENTS],
})
export class TextfieldModule { }