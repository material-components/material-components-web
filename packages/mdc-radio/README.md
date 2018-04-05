<!--docs:
title: "Radio Buttons"
layout: detail
section: components
iconId: radio_button
path: /catalog/input-controls/radio-buttons/
-->

# Radio Buttons

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/radio.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/radios.png" width="60" alt="Radio buttons screenshot">
  </a>
</div>-->

The MDC Radio Button component provides a radio button adhering to the [Material Design Specification](https://material.io/guidelines/components/selection-controls.html#selection-controls-radio-button).
It requires no Javascript out of the box, but can be enhanced with Javascript to provide better
interaction UX as well as a component-level API for state modification.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/selection-controls.html#selection-controls-radio-button">Material Design guidelines: Selection Controls – Radio buttons</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/radio.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/radio
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
elements intercept pointer events when using JS. When using the CSS-only variation, this is also
necessary to prevent hover states from activating.

### Using the JS Component

MDC Radio ships with Component / Foundation classes which provide enhanced interaction UX via
[mdc-ripple](../mdc-ripple), as well as APIs for programmatically altering the radio's state.

#### Including in code

##### ES2015

```javascript
import {MDCRadio, MDCRadioFoundation} from '@material/radio';
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
import {MDCRadio} from '@material/radio';

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

##### MDCRadio.value

String. Proxies to the foundation's `getValue/setValue` methods when retrieved/set
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

##### MDCRadioFoundation.getValue() => string

Returns the value of `adapter.getNativeControl().value`. Returns `null` if `getNativeControl()`
does not return an object.

##### MDCRadioFoundation.setValue(value: string) => void

Sets the value of `adapter.getNativeControl().value`. Does nothing if `getNativeControl()` does
not return an object.

## Theming

MDC Radios use the theme's secondary color by default for checked states.

### Sass Mixins

The following mixins apply only to _enabled_ radio buttons. It is not currently possible to customize the color of a _disabled_ radio button.

Mixin | Description
--- | ---
`mdc-radio-unchecked-stroke-color($color)` | Sets the stroke color of an unchecked radio
`mdc-radio-checked-stroke-color($color)` | Sets the stroke color of a checked radio
`mdc-radio-ink-color($color)` | Sets the ink color
`mdc-radio-focus-indicator-color($color)` | Sets the color of the focus indicator

The ripple effect for the Radio Button component is styled using [MDC Ripple](../mdc-ripple) mixins.

### Caveat: Edge and CSS Variables

In browsers that fully support CSS variables, MDC Radio references CSS variables wherever theme properties are used.
However, due to Edge's buggy CSS variable support, the `background-color` for `.mdc-radio__background::before` will not honor CSS variables in Edge.
This means you will need to override this style manually for Edge if you alter the CSS variable for the primary color.
