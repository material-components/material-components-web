<!--docs:
title: "Checkboxes"
layout: detail
section: components
iconId: selection_control
path: /catalog/input-controls/checkboxes/
-->

# Checkboxes

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/checkbox.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/checkboxes.png" width="99" alt="Checkboxes screenshot">
  </a>
</div>-->

The MDC Checkbox component is a spec-aligned checkbox component adhering to the
[Material Design checkbox requirements](https://material.io/guidelines/components/selection-controls.html#selection-controls-checkbox).
It works without JavaScript with basic functionality for all states. If you use the JavaScript object for a checkbox, it will add more intricate animation effects when switching between states.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/selection-controls.html#selection-controls-checkbox">Material Design guidelines: Selection Controls – Checkbox</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/checkbox.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/checkbox
```

## Usage

### Standalone Checkbox

```html
<div class="mdc-checkbox">
  <input type="checkbox"
         class="mdc-checkbox__native-control"/>
  <div class="mdc-checkbox__background">
    <svg class="mdc-checkbox__checkmark"
         viewBox="0 0 24 24">
      <path class="mdc-checkbox__checkmark-path"
            fill="none"
            stroke="white"
            d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
    </svg>
    <div class="mdc-checkbox__mixedmark"></div>
  </div>
</div>
```

The checkbox component is driven by an underlying native checkbox element. This element is sized and
positioned the same way as the checkbox component itself, allowing for proper behavior of assistive
devices.

Additionally, the checkbox can be used in conjunction with [mdc-form-field](../mdc-form-field) to
easily position checkboxes and their labels.

```html
<div class="mdc-form-field">
  <div class="mdc-checkbox">
    <input type="checkbox"
           id="my-checkbox"
           class="mdc-checkbox__native-control"/>
    <div class="mdc-checkbox__background">
      <svg class="mdc-checkbox__checkmark"
           viewBox="0 0 24 24">
        <path class="mdc-checkbox__checkmark-path"
              fill="none"
              stroke="white"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
      </svg>
      <div class="mdc-checkbox__mixedmark"></div>
    </div>
  </div>

  <label for="my-checkbox">My Checkbox Label</label>
</div>
```

> **Note**: If you are using IE, you need to include a closing `</path>` tag if you wish to avoid console warnings.

#### Disabled Checkboxes

Note that `mdc-checkbox--disabled` is necessary on the root element of CSS-only checkboxes to prevent hover states from activating. Checkboxes that use the JavaScript component do not need this class; a `disabled` attribute on the `<input>` element is sufficient.

```html
<div class="mdc-checkbox mdc-checkbox--disabled">
  <input type="checkbox"
         id="basic-disabled-checkbox"
         class="mdc-checkbox__native-control"
         disabled />
  <div class="mdc-checkbox__background">
    <svg class="mdc-checkbox__checkmark"
         viewBox="0 0 24 24">
      <path class="mdc-checkbox__checkmark-path"
            fill="none"
            stroke="white"
            d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
    </svg>
    <div class="mdc-checkbox__mixedmark"></div>
  </div>
</div>
<label for="basic-disabled-checkbox" id="basic-disabled-checkbox-label">This is my disabled checkbox</label>
```

### Using the JS Component

MDC Checkbox ships with a Component / Foundation combo which progressively enhances the checkbox
state transitions to achieve full parity with the Material Design motion for switching checkbox
states.

#### Including in code

##### ES2015

```javascript
import {MDCCheckbox, MDCCheckboxFoundation} from '@material/checkbox';
```

##### CommonJS

```javascript
const mdcCheckbox = require('mdc-checkbox');
const MDCCheckbox = mdcCheckbox.MDCCheckbox;
const MDCCheckboxFoundation = mdcCheckbox.MDCCheckboxFoundation;
```

##### AMD

```javascript
require(['path/to/mdc-checkbox'], mdcCheckbox => {
  const MDCCheckbox = mdcCheckbox.MDCCheckbox;
  const MDCCheckboxFoundation = mdcCheckbox.MDCCheckboxFoundation;
});
```

##### Global

```javascript
const MDCCheckbox = mdc.checkbox.MDCCheckbox;
const MDCCheckboxFoundation = mdc.checkbox.MDCCheckboxFoundation;
```

#### Automatic Instantiation

If you do not care about retaining the component instance for the checkbox, simply call `attachTo()`
and pass it a DOM element.

```javascript
mdc.checkbox.MDCCheckbox.attachTo(document.querySelector('.mdc-checkbox'));
```

#### Manual Instantiation

Checkboxes can easily be initialized using their default constructors as well, similar to `attachTo`.

```javascript
import {MDCCheckbox} from '@material/checkbox';

const checkbox = new MDCCheckbox(document.querySelector('.mdc-checkbox'));
```

#### MDCCheckbox API

The MDCCheckbox API provides accessor properties similar to those found on a native checkbox element.

##### MDCCheckbox.checked

Boolean. Returns whether or not the checkbox is checked. Setting this property will update the
underlying checkbox element.

##### MDCCheckbox.indeterminate

Boolean. Returns whether or not the checkbox is indeterminate. Setting this property will update the
underlying checkbox element.

##### MDCCheckbox.disabled

Boolean. Returns whether or not the checkbox is disabled. Setting this property will update the
underlying checkbox element.

##### MDCCheckbox.value

String. Returns the checkbox's value. Setting this property will update the underlying checkbox
element.

### Using the Foundation Class

MDC Checkbox ships with an `MDCCheckboxFoundation` class that external frameworks and libraries can
use to integrate the component. As with all foundation classes, an adapter object must be provided.
The adapter for checkboxes must provide the following functions, with correct signatures:

| Method Signature | Description |
| --- | --- |
| `addClass(className: string) => void` | Adds a class to the root element. |
| `removeClass(className: string) => void` | Removes a class from the root element. |
| `registerAnimationEndHandler(handler: EventListener) => void` | Registers an event handler to be called when an `animationend` event is triggered on the root element. Note that you must account for vendor prefixes in order for this to work correctly. |
| `deregisterAnimationEndHandler(handler: EventListener) => void` | Deregisters an event handler from an `animationend` event listener. This will only be called with handlers that have previously been passed to `registerAnimationEndHandler` calls. |
| `registerChangeHandler(handler: EventListener) => void` | Registers an event handler to be called when a `change` event is triggered on the native control (_not_ the root element). |
| `deregisterChangeHandler(handler: EventListener) => void` | Deregisters an event handler that was previously passed to `registerChangeHandler`. |
| `getNativeControl() => HTMLInputElement?` | Returns the native checkbox control, if available. Note that if this control is not available, the methods that rely on it will exit gracefully.|
| `forceLayout() => void` | Force-trigger a layout on the root element. This is needed to restart animations correctly. If you find that you do not need to do this, you can simply make it a no-op. |
| `isAttachedToDOM() => boolean` | Returns true if the component is currently attached to the DOM, false otherwise. |


#### MDCCheckboxFoundation API

##### MDCCheckboxFoundation.isChecked() => boolean

Returns whether or not the underlying input is checked. Returns false when no input is available.

##### MDCCheckboxFoundation.setChecked(checked: boolean)

Updates the `checked` property on the underlying input. Does nothing when the underlying input is
not present.

##### MDCCheckboxFoundation.isIndeterminate() => boolean

Returns whether or not the underlying input is indeterminate. Returns false when no input is
available.

##### MDCCheckboxFoundation.setIndeterminate(indeterminate: boolean)

Updates the `indeterminate` property on the underlying input. Does nothing when the underlying input
is not present.

##### MDCCheckboxFoundation.isDisabled() => boolean

Returns whether or not the underlying input is disabled. Returns false when no input is available.

##### MDCCheckboxFoundation.setDisabled(disabled: boolean)

Updates the `disabled` property on the underlying input. Does nothing when the underlying input is
not present.

##### MDCCheckboxFoundation.getValue() => string

Returns the value of `adapter.getNativeControl().value`. Returns `null` if `getNativeControl()`
does not return an object.

##### MDCCheckboxFoundation.setValue(value: string) => void

Sets the value of `adapter.getNativeControl().value`. Does nothing if `getNativeControl()` does
not return an object.

## Theming

MDC Checkboxes use the theme's secondary color by default for "marked" states (i.e., checked or indeterminate).

### Sass Mixins

The following mixins apply only to _enabled_ checkboxes. It is not currently possible to customize the color of a _disabled_ checkbox.

Mixin | Description
--- | ---
`mdc-checkbox-container-colors($unmarked-stroke-color, $unmarked-fill-color, $marked-fill-color, $generate-keyframes)` | Generates CSS classes to set and animate the stroke color and/or container fill color of a checkbox
`mdc-checkbox-ink-color($color)` | Sets the ink color of the checked and indeterminate icons
`mdc-checkbox-focus-indicator-color($color)` | Sets the color of the focus indicator

The ripple effect for the Checkbox component is styled using [MDC Ripple](../mdc-ripple) mixins.

#### `mdc-checkbox-container-colors($unmarked-stroke-color, $unmarked-fill-color, $marked-fill-color, $generate-keyframes)`

Generates CSS classes to set the container stroke color and/or fill color of a checkbox in its marked and unmarked states.
In the unmarked state, stroke and fill color may be customized independently; in the marked state, only the fill color
may be customized, and the stroke will automatically match the fill color.

All parameters are optional, and if left unspecified will use their default values.

If you plan to use CSS-only checkboxes, set `$generate-keyframes` to `false` to prevent the mixin from generating `@keyframes` and CSS classes used by the JavaScript component.

### Caveat: Edge and CSS Variables

In browsers that fully support CSS variables, MDC Checkbox references CSS variables wherever theme properties are used.
However, due to Edge's buggy CSS variable support, the `background-color` for `.mdc-checkbox__background::before` will not honor CSS variables in Edge.
This means you will need to override this style manually for Edge if you alter the CSS variable for the primary color.
