# MDC Radio

The MDC Radio component provides a radio button adhering to the [Material Design Specification](https://material.google.com/components/selection-controls.html#selection-controls-radio-button).
It requires no Javascript out of the box, but can be enhanced with Javascript to provide better
interaction UX as well as a component-level API for state modification.

## Installation

```
npm install --save @material/radio
```

## Usage

```html
<div class="mdc-radio">
  <input class="mdc-radio__native-control" type="radio" id="radio-1" name="radios" checked>
  <div class="mdc-radio__background">
    <div class="mdc-radio__outer-circle"></div>
    <div class="mdc-radio__inner-circle"></div>
  </div>
</div>
<label id="radio-1-label" for="radio-1">Radio 1</label>

<div class="mdc-radio">
  <input class="mdc-radio__native-control" type="radio" id="radio-2" name="radios">
  <div class="mdc-radio__background">
    <div class="mdc-radio__outer-circle"></div>
    <div class="mdc-radio__inner-circle"></div>
  </div>
</div>
<label id="radio-2-label" for="radio-2">Radio 2</label>
```

> TODO(TK): Talk about `mdc-form-field` here.

#### Disabled Radios

```html
<div class="mdc-radio mdc-radio--disabled">
  <input class="mdc-radio__native-control" type="radio" id="radio-1" name="radios" disabled>
  <div class="mdc-radio__background">
    <div class="mdc-radio__outer-circle"></div>
    <div class="mdc-radio__inner-circle"></div>
  </div>
</div>
<label id="radio-1-label" for="radio-1">Disabled Radio 1</label>
```

Note that `mdc-radio--disabled` is necessary on the root element in order to avoid having the ripple
elements intercept pointer events when using JS.

### Using the JS Component

MDC Radio ships with Component / Foundation classes which provide enhanced interaction UX via
[mdc-ripple](../mdc-ripple), as well as APIs for programmatically altering the radio's state.

#### Including in code

##### ES2015

```javascript
import {MDCRadio, MDCRadioFoundation} from 'mdc-radio';
```

##### CommonJS

```javascript
const mdcRadio = require('mdc-radio');
const MDCRadio = mdcRadio.MDCRadio;
const MDCRadioFoundation = mdcRadio.MDCRadioFoundation;
```

##### AMD

```javascript
require(['path/to/mdc-radio'], mdcRadio => {
  const MDCRadio = mdcRadio.MDCRadio;
  const MDCRadioFoundation = mdcRadio.MDCRadioFoundation;
});
```

##### Global

```javascript
const MDCRadio = mdc.radio.MDCRadio;
const MDCRadioFoundation = mdc.radio.MDCRadioFoundation;
```

#### Automatic Instantiation

If you do not care about retaining the component instance for the radio, simply call `attachTo()`
and pass it a DOM element.  

```javascript
mdc.radio.MDCRadio.attachTo(document.querySelector('.mdc-radio'));
```

#### Manual Instantiation

Radios can easily be initialized using their default constructors as well, similar to `attachTo`.

```javascript
import {MDCRadio} from 'mdc-radio';

const radio = new MDCRadio(document.querySelector('.mdc-radio'));
```

#### MDCRadio API

Similar to regular DOM elements, the `MDCRadio` functionality is exposed through accessor
methods.

##### MDCRadio.checked

Boolean. Proxies to the foundation's `isChecked`/`setChecked` methods when retrieved/set
respectively.

##### MDCRadio.disabled

Boolean. Proxies to the foundation's `isDisabled/setDisabled` methods when retrieved/set
respectively.

### Using the Foundation Class

Since MDC Radio is primarily driven by its native control, the adapter API is extremely simple.

| Method Signature | Description |
| --- | --- |
| `getNativeControl() => HTMLInputElement?` | Returns the native radio control, if available. Note that if this control is not available, the methods that rely on it will exit gracefully.|
| `addClass(className: string) => void` | Adds a class to the root element. |
| `removeClass(className: string) => void` | Removes a class from the root element. |

#### The full foundation API

##### MDCRadioFoundation.isChecked() => boolean

Returns the value of `adapter.getNativeControl().checked`. Returns `false` if `getNativeControl()`
does not return an object.

##### MDCRadioFoundation.setChecked(checked: boolean) => void

Sets the value of `adapter.getNativeControl().checked`. Does nothing if `getNativeControl()` does
not return an object.

##### MDCRadioFoundation.isDisabled() => boolean

Returns the value of `adapter.getNativeControl().disabled`. Returns `false` if `getNativeControl()`
does not return an object.

##### MDCRadioFoundation.setDisabled(disabled: boolean) => void

Sets the value of `adapter.getNativeControl().disabled`. Also adds/removes the `mdc-radio--disabled`
class based whether or not `disabled` is true. Gracefully handles the absence of a return value of
`getNativeControl()`.

## Theming

MDC Radios use the theme's primary color by default for on states, and are completely dark theme
aware.
