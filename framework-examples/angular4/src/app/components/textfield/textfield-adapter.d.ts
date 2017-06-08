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