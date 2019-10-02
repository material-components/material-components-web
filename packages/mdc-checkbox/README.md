<!--docs:
title: "Checkboxes"
layout: detail
section: components
excerpt: "Checkboxes allow the user to select multiple options from a set."
iconId: selection_control
path: /catalog/input-controls/checkboxes/
-->

# Checkboxes

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components.github.io/material-components-web-catalog/#/component/checkbox">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/checkboxes.png"
    width="99" alt="Checkbox screenshot">
  </a>
</div>-->

Checkboxes allow the user to select one or more items from a set.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-checkboxes">Material Design guidelines: Selection Controls – Checkbox</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/checkbox">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/checkbox
```

## Basic Usage

We recommend using MDC Checkbox with [MDC Form Field](../mdc-form-field) for enhancements such as label alignment, label activation of the ripple interaction effect, and RTL-awareness.

```html
<div class="mdc-form-field">
  <div class="mdc-checkbox">
    <input type="checkbox"
           class="mdc-checkbox__native-control"
           id="checkbox-1"/>
    <div class="mdc-checkbox__background">
      <svg class="mdc-checkbox__checkmark"
           viewBox="0 0 24 24">
        <path class="mdc-checkbox__checkmark-path"
              fill="none"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
      </svg>
      <div class="mdc-checkbox__mixedmark"></div>
    </div>
    <div class="mdc-checkbox__ripple"></div>
  </div>
  <label for="checkbox-1">Checkbox 1</label>
</div>
```

> **Note**: If you are using IE, you need to include a closing `</path>` tag if you wish to avoid console warnings.

### Styles

```scss
@import "@material/form-field/mdc-form-field";
@import "@material/checkbox/mdc-checkbox";
```

### JavaScript Instantiation

The checkbox will work without JavaScript, but you can enhance it with a ripple interaction effect by instantiating `MDCCheckbox` on the `mdc-checkbox` element. To activate the ripple effect upon interacting with the label, you must also instantiate `MDCFormField` on the `mdc-form-field` element and set the `MDCCheckbox` instance as its `input`.

```js
import {MDCFormField} from '@material/form-field';
import {MDCCheckbox} from '@material/checkbox';

const checkbox = new MDCCheckbox(document.querySelector('.mdc-checkbox'));
const formField = new MDCFormField(document.querySelector('.mdc-form-field'));
formField.input = checkbox;
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

## Variants

### Disabled

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
            d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
    </svg>
    <div class="mdc-checkbox__mixedmark"></div>
  </div>
  <div class="mdc-checkbox__ripple"></div>
</div>
<label for="basic-disabled-checkbox" id="basic-disabled-checkbox-label">This is my disabled checkbox</label>
```

## Additional Information

### Accessibility

Material Design spec advises that touch targets should be at least 48 x 48 px.
To meet this requirement, add the `mdc-checkbox--touch` class to your checkbox as follows:

```html
<span>
  <div class="mdc-checkbox mdc-checkbox--touch">
    <input type="checkbox"
           class="mdc-checkbox__native-control"
           id="checkbox-1"/>
    <div class="mdc-checkbox__background">
      <svg class="mdc-checkbox__checkmark"
           viewBox="0 0 24 24">
        <path class="mdc-checkbox__checkmark-path"
              fill="none"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
      </svg>
      <div class="mdc-checkbox__mixedmark"></div>
    </div>
    <div class="mdc-checkbox__ripple"></div>
  </div>
</span>
```

Note that the wrapper `<span>` element is only necessary if you want to avoid potentially overlapping touch targets on adjacent elements (due to collapsing margins).

## Style Customization

MDC Checkbox uses [MDC Theme](../mdc-theme)'s `secondary` color by default for "marked" states (i.e., checked or indeterminate).

### Sass Mixins

The following mixins apply only to _enabled_ checkboxes. It is not currently possible to customize the color of a _disabled_ checkbox.

Mixin | Description
--- | ---
`mdc-checkbox-container-colors($unmarked-stroke-color, $unmarked-fill-color, $marked-stroke-color, $marked-fill-color, $generate-keyframes)` | Generates CSS classes to set and animate the stroke color and/or container fill color of a checkbox
`mdc-checkbox-ink-color($color)` | Sets the ink color of the checked and indeterminate icons
`mdc-checkbox-focus-indicator-color($color)` | Sets the color of the focus indicator (ripple) when checkbox is selected or is in indeterminate state.
`mdc-checkbox-ripple-size($ripple-size)` | Sets the ripple size of the checkbox.
`mdc-checkbox-density($density-scale)` | Sets density scale for checkbox, Supported density scales are `-3`, `-2`, `-1`, and `0` (default).

The ripple effect for the Checkbox component is styled using [MDC Ripple](../mdc-ripple) mixins.

#### `mdc-checkbox-container-colors($unmarked-stroke-color, $unmarked-fill-color, $marked-stroke-color, $marked-fill-color, $generate-keyframes)`

Stroke and fill color may be customized independently in both the marked and unmarked state.

All parameters are optional, and if left unspecified will use their default values.

If you plan to use CSS-only checkboxes, set `$generate-keyframes` to `false` to prevent the mixin from generating `@keyframes` and CSS classes used by the JavaScript component.

#### Caveat: Edge and CSS Variables

In browsers that fully support CSS variables, MDC Checkbox references CSS variables wherever theme properties are used.
However, due to Edge's buggy CSS variable support, the `background-color` for `.mdc-checkbox__background::before` will not honor CSS variables in Edge.
This means you will need to override this style manually for Edge if you alter the CSS variable for the primary color.

## `MDCCheckbox` Properties and Methods

Property Name | Type | Description
--- | --- | ---
`checked` | `boolean` | Setter/getter for the checkbox's checked state
`indeterminate` | `boolean` | Setter/getter for the checkbox's indeterminate state
`disabled` | `boolean` | Setter/getter for the checkbox's disabled state
`value` | `string` | Setter/getter for the checkbox's

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Checkbox for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCCheckboxAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element.
`removeClass(className: string) => void` | Removes a class from the root element.
`forceLayout() => void` | Force-trigger a layout on the root element. This is needed to restart animations correctly. If you find that you do not need to do this, you can simply make it a no-op.
`isAttachedToDOM() => boolean` | Returns true if the component is currently attached to the DOM, false otherwise.
`isIndeterminate() => boolean` | Returns true if the component is in the indeterminate state.
`isChecked() => boolean` | Returns true if the component is checked.
`hasNativeControl() => boolean` | Returns true if the input is present in the component.
`setNativeControlDisabled(disabled: boolean) => void` | Sets the input to disabled.
`setNativeControlAttr(attr: string, value: string) => void` | Sets an HTML attribute to the given value on the native input element.
`removeNativeControlAttr(attr: string) => void` | Removes an attribute from the native input element.

### `MDCCheckboxFoundation`

Method Signature | Description
--- | ---
`setDisabled(disabled: boolean) => void` | Updates the `disabled` property on the underlying input. Does nothing when the underlying input is not present.
`handleAnimationEnd() => void` | `animationend` event handler that should be applied to the root element.
`handleChange() => void` | `change` event handler that should be applied to the checkbox element.
