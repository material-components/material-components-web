/**
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

/* eslint-disable */

import React, {PureComponent, PropTypes} from 'react';

import Checkbox from './Checkbox';
import CheckboxLabel from './CheckboxLabel';
import FormField from './FormField';

export default class App extends PureComponent {
  state = {
    checked: false,
    disabled: false,
    indeterminate: false,
    changeEventCount: 0
  }

  render() {
    const {checked, disabled, indeterminate, status, changeEventCount} = this.state;
    return (
      <main>
        <h1>MDC-Web Checkbox - React Example</h1>
        <FormField>
          <Checkbox id="my-checkbox"
                    labelId="my-checkbox-label"
                    disabled={disabled}
                    indeterminate={indeterminate}
                    onChange={({target}) => this.setState({
                      changeEventCount: changeEventCount + 1,
                      checked: target.checked,
                      indeterminate: false
                    })}/>
          <CheckboxLabel id="my-checkbox-label" for="my-checkbox">
            The checkbox is currently {this.status()}
          </CheckboxLabel>
        </FormField>
        <div style={{paddingTop: '12px'}}>
          <button onClick={() => this.setState({indeterminate: true})}>Make Indeterminate</button>
          <button onClick={() => this.setState({disabled: !disabled})}>Toggle Disabled</button>
        </div>
        <p>{changeEventCount} change events so far</p>
      </main>
    );
  }

  status() {
    if (this.state.indeterminate) {
      return 'indeterminate';
    }
    return this.state.checked ? 'checked' : 'unchecked';
  }
}
