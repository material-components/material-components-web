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
 
import {
	ElementRef,
	Injectable,
	Renderer2
} from '@angular/core';

import '@material/ripple/mdc-ripple.scss';

export function getMatchesProperty(HTMLElementPrototype) {
  return [
    'webkitMatchesSelector', 'msMatchesSelector', 'matches',
  ].filter((p) => p in HTMLElementPrototype).pop();
}

const MATCHES = getMatchesProperty(HTMLElement.prototype);
const {MDCRipple, MDCRippleFoundation} = require('@material/ripple');

@Injectable()
export class Ripple  {
	rippleFoundation = new MDCRippleFoundation(Object.assign(MDCRipple.createAdapter(this),
		{
			isUnbounded: () => true,
			isSurfaceActive: () => this._root[MATCHES](':active'),
			addClass: (className: string) => {
				const {_renderer: renderer, _root: root} = this;
				renderer.addClass(root.nativeElement, className);
			},
			removeClass: (className: string) => {
				const {_renderer: renderer, _root: root} = this;
				renderer.removeClass(root.nativeElement, className);
			},
 			registerInteractionHandler: (evtType: string, handler: EventListener) => {
 				if(this._root) {
      		this._root.nativeElement.addEventListener(evtType, handler);
      	}
    	},
    	deregisterInteractionHandler: (evtType: string, handler: EventListener) => {
 				if(this._root) {
      		this._root.nativeElement.addEventListener(evtType, handler);
      	}
    	},
			updateCssVariable: (varName: string, value: string) => {
 				if(this._root) {
      		this._root.nativeElement.style.setProperty(varName, value);
      	}
    	},
    	computeBoundingRect: () => {
				const {left, top, height, width} = this._root.nativeElement.getBoundingClientRect();
				return {
					top,
					left,
					right: left,
					bottom: top,
					width: width,
					height: height,
				};
			},
		}));

	constructor(private _renderer: Renderer2, private _root: ElementRef) { }
}
