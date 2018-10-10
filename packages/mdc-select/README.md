<!--docs:
title: "Select Menus"
layout: detail
section: components
iconId: menu
path: /catalog/input-controls/select-menus/
-->

## Important - Default Style Deprecation Notice

The existing default select style will be changed in an upcoming release. The Material spec indicates that
the default style will be the filled variant (currently referred to as the box variant). This will become the
default style. Continuing to add the `mdc-select--box` class to the select will result in no change.

# Select Menus

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components.github.io/material-components-web-catalog/#/component/select">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/selects.png" width="376" alt="Select screenshot">
  </a>
</div>-->

MDC Select provides Material Design single-option select menus. It functions as a wrapper around the
browser's native `<select>` element. It is fully accessible, and fully RTL-aware.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-text-fields">Material Design guidelines: Text Fields</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/select">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/select
```

## Basic Usage

### HTML Structure

```html
<div class="mdc-select">
  <select class="mdc-select__native-control">
    <option value="" disabled selected></option>
    <option value="grains">
      Bread, Cereal, Rice, and Pasta
    </option>
    <option value="vegetables">
      Vegetables
    </option>
    <option value="fruit">
      Fruit
    </option>
  </select>
  <label class="mdc-floating-label">Pick a Food Group</label>
  <div class="mdc-line-ripple"></div>
</div>
```

### Styles

```scss
@import "@material/select/mdc-select";
```

### JavaScript Instantiation

```js
const select = new mdc.select.MDCSelect(document.querySelector('.mdc-select'));
select.listen('change', () => {
  alert(`Selected option at index ${select.selectedIndex} with value "${select.value}"`);
});
```

See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

## Variants

### Outlined Select

The Select Outlined variant uses the `mdc-notched-outline` in place of the `mdc-line-ripple` element and adds the
`mdc-select--outlined` modifier class on the root element.

```html
<div class="mdc-select mdc-select--outlined">
  <select class="mdc-select__native-control">
   ...
  </select>
  <label class="mdc-floating-label">Pick a Food Group</label>
   <div class="mdc-notched-outline">
     <svg>
       <path class="mdc-notched-outline__path"></path>
     </svg>
   </div>
   <div class="mdc-notched-outline__idle"></div>
</div>
```

### Additional Information

#### Select with pre-selected option

When dealing with a select component that has a pre-selected value, include the `mdc-floating-label--float-above`
modifier class on the `mdc-floating-label` element, and add the `selected` attribute to the selected option.
This will ensure that the label moves out of the way of the select's value and prevents a Flash Of Unstyled Content
(**FOUC**).

```html
<div class="mdc-select">
  <select class="mdc-select__native-control">
    <option value="vegetables">
      Vegetables
    </option>
    <option value="fruit">
      Fruit
    </option>
    <option value="dairy" selected>
      Milk, Yogurt, and Cheese
    </option>
  </select>
  <label class="mdc-floating-label mdc-floating-label--float-above">Pick a Food Group</label>
  <div class="mdc-line-ripple"></div>
</div>
```

#### Using the floating label as the placeholder

By default, `<select>` elements will select their first enabled option. In order to initially display a placeholder
instead, add an initial `<option>` element with the `disabled` *and* `selected` attributes set, and with `value` set to `""`.

```html
<option value="" disabled selected></option>
```

#### Disabled select

Add the `mdc-select--disabled` class to the `mdc-select` element, and add the `disabled` attribute to the
`<select>` element.

```html
<div class="mdc-select mdc-select--disabled">
  <select class="mdc-select__native-control" disabled>
    ...
  </select>
  <label class="mdc-floating-label">Pick a Food Group</label>
  <div class="mdc-line-ripple"></div>
</div>
```

#### Disabled options

Since MDC Select uses native `<select>` and `<option>` elements, simply add the `disabled` attribute to individual options to disable them.

```html
<div class="mdc-select">
  <select class="mdc-select__native-control">
    <option value="grains">
      Bread, Cereal, Rice, and Pasta
    </option>
    <option value="vegetables" disabled>
      Vegetables
    </option>
    <option value="fruit">
      Fruit
    </option>
  </select>
  <label class="mdc-floating-label">Pick a Food Group</label>
  <div class="mdc-line-ripple"></div>
</div>
```

## Style Customization

#### CSS Classes

| Class | Description |
| --- | --- |
| `mdc-select` | Mandatory. |
| `mdc-select--disabled` | Optional. Styles the select as disabled. This class should be applied to the root element when the `disabled` attribute is applied to the `<select>` element. |
| `mdc-select--outlined` | Optional. Styles the select as outlined select. |
| `mdc-select__native-control` | Mandatory. The native `<select>` element. |

### Sass Mixins

Mixins should be included in the context of a custom class applied to the component's root element, e.g. `.my-select`.

Mixin | Description
--- | ---
`mdc-select-ink-color($color)` | Customizes the color of the selected item displayed in the select.
`mdc-select-container-fill-color($color)` | Customizes the background color of the select.
`mdc-select-label-color($color)` | Customizes the label color of the select in the unfocused state.
`mdc-select-focused-label-color($color)` | Customizes the label color of the select when focused.
`mdc-select-bottom-line-color($color)` | Customizes the color of the default bottom line of the select.
`mdc-select-focused-bottom-line-color($color)` | Customizes the color of the bottom line of the select when focused.
`mdc-select-shape-radius($radius, $rtl-reflexive)` | Sets rounded shape to boxed select variant with given radius size. Set `$rtl-reflexive` to true to flip radius values in RTL context, defaults to false.
`mdc-select-hover-bottom-line-color($color)` | Customizes the color of the bottom line when the select is hovered.
`mdc-select-outline-color($color)` | Customizes the color of the notched outline.
`mdc-select-outline-shape-radius($radius, $rtl-reflexive)` | Sets the border radius of of the outlined select variant. Set `$rtl-reflexive` to true to flip radius values in RTL context, defaults to false.
`mdc-select-focused-outline-color($color)` | Customizes the color of the outline of the select when focused.
`mdc-select-hover-outline-color($color)` | Customizes the color of the outline when the select is hovered.

> NOTE: To further customize the floating label, please see the [floating label documentation](./../mdc-floating-label/README.md).

## `MDCSelect` API

The `MDCSelect` component API is modeled after a subset of the `HTMLSelectElement` functionality.

| Property | Type | Description |
| --- | --- | --- |
| `value` | `string` | The `value` of the currently selected option. |
| `selectedIndex` | `number` | The index of the currently selected option. Set to -1 if no option is currently selected. Changing this property will update the select element. |
| `disabled` | `boolean` | Whether or not the component is disabled. Settings this sets the disabled state on the component. |

### Events

The MDC Select JS component emits a `change` event when the selected option changes as the result of a user action.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Select for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCSelectAdapter`

| Method Signature | Description |
| --- | --- |
| `addClass(className: string) => void` | Adds a class to the root element. |
| `removeClass(className: string) => void` | Removes a class from the root element. |
| `hasClass(className: string) => boolean` | Returns true if the root element has the className in its classList. |
| `activateBottomLine() => void` | Activates the bottom line component. |
| `deactivateBottomLine() => void` | Deactivates the bottom line component. |
| `getValue() => string` | Returns the value selected on the `select` element. |
| `isRtl() => boolean` | Returns true if a parent of the root element is in RTL. |
| `hasLabel() => boolean` | Returns true if the `select` has a label associated with it. |
| `floatLabel(value: boolean) => void` | Floats or defloats label. |
| `getLabelWidth() => number` | Returns the offsetWidth of the label element. |
| `hasOutline() => boolean` | Returns true if the `select` has the notched outline element. |
| `notchOutline(labelWidth: number, isRtl, boolean) => void` | Switches the notched outline element to its "notched state." |
| `closeOutline() => void` | Switches the notched outline element to its closed state. |

### `MDCSelectFoundation`

| Method Signature | Description |
| --- | --- |
| `notchOutline(openNotch: boolean) => void` | Opens/closes the notched outline. |
| `updateDisabledStyle(disabled: boolean) => void` | Updates appearance based on disabled state. This must be called whenever the `disabled` state changes. |
| `handleFocus() => void` | Handles a focus event on the `select` element. |
| `handleBlur() => void` | Handles a blur event on the `select` element. |
| `handleChange() => void` | Handles a change to the `select` element's value. This must be called both for `change` events and programmatic changes requested via the component API. |
