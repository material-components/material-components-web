import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { appRoutes } from './app.routes';

import { ButtonModule } from './components/button';
import { TextfieldModule } from './components/textfield';

import { Home } from './components/home';

@NgModule({
	imports: [
		BrowserModule,
		FormsModule,
		HttpModule,
		RouterModule.forRoot(appRoutes),
		ButtonModule,
		TextfieldModule
	],
	declarations: [
		AppComponent,
		Home
	],
	bootstrap: [AppComponent]
})
export class AppModule { }