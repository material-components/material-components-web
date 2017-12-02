/**
 * @license
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

class MockTextFieldInputFoundation {
  constructor(isBadInput, isValid) {
    this.isBadInput_ = isBadInput;
    this.isValid_ = isValid;
    this.value_ = '';
    this.disabled_ = false;
  }

  isBadInput() {
    return this.isBadInput_;
  }

  getValue() {
    return this.value_;
  }

  setValue(value) {
    this.value_ = value;
  }

  checkValidity() {
    return this.isValid_;
  }

  isDisabled() {
    return this.disabled_;
  }

  setDisabled(disabled) {
    this.disabled_ = disabled;
  }

  handleTextFieldInteraction() {}
}

export default MockTextFieldInputFoundation;
