<!--docs:
title: "Select Menus"
layout: detail
section: components
iconId: menu
path: /catalog/input-controls/select-menus/
-->

# Select Menus

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/select.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/selects.png" width="376" alt="Select screenshot">
  </a>
</div>-->

MDC Select provides Material Design single-option select menus. It functions as a wrapper around the
browser's native `<select>` element. It is fully accessible, and fully RTL-aware.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/text-fields.html">Material Design guidelines: Text Fields</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/select.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/select
```

## Usage

### Using the full-fidelity JS component

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

Then with JS

```js
const select = new mdc.select.MDCSelect(document.querySelector('.mdc-select'));
select.listen('change', () => {
  alert(`Selected option at index ${select.selectedIndex} with value "${select.value}"`);
});
```

See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

#### Select with pre-selected option

When dealing with the select component that has pre-selected values, you'll want to ensure that you
render `mdc-floating-label` with the `mdc-floating-label--float-above` modifier class and the selected
option with the `selected` attribute. This will ensure that the label moves out
of the way of the select's value and prevents a Flash Of Unstyled Content (**FOUC**).

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

#### Select with floating label as the placeholder

By default, `<select>` elements will select their first enabled option. In order to initially display a placeholder
instead, add an initial `<option>` element with the `disabled` *and* `selected` attributes set, and with `value` set to `""`.

```html
<option value="" disabled selected></option>
```

#### Disabled select

Add the `mdc-select--disabled` class to the `mdc-select` element and the `disabled` attribute to the
`<select>` element.

```html
<div class="mdc-select mdc-select--disabled">
  <select class="mdc-select__native-control" disabled>
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

#### CSS Classes

| Class                    | Description                                     |
| ------------------------ | ----------------------------------------------- |
| `mdc-select`             | Mandatory.                                      |
| `mdc-select--box`        | Styles the select as a box select.              |

### Sass Mixins

To customize the colors of any part of the select, use the following mixins. We recommend you use
these mixins within CSS selectors like `.foo-select` to apply styling.

Mixin | Description
--- | ---
`mdc-select-ink-color($color)` | Customizes the color of the selected item displayed in the select.
`mdc-select-container-fill-color($color)` | Customizes the background color of the select.
`mdc-select-label-color($color)` | Customizes the label color of the select in the unfocused state.
`mdc-select-focused-label-color($color)` | Customizes the label color of the select when focused.
`mdc-select-bottom-line-color($color)` | Customizes the color of the default bottom line of the select.
`mdc-select-focused-bottom-line-color($color)` | Customizes the color of the bottom line of the select when focused.
`mdc-select-hover-bottom-line-color($color)` | Customizes the color of the bottom line when select is hovered.

> NOTE: To further customize label color please see the [floating label readme](./../mdc-floating-label/README.md).

### MDC Select Component API

The MDC Select component API is modeled after a subset of the `HTMLSelectElement` functionality, and
is outlined below.

#### Properties

| Property Name | Type | Description |
| --- | --- | --- |
| `value` | `string` | The `value` of the currently selected option. |
| `selectedIndex` | `number` | The index of the currently selected option. Set to -1 if no option is currently selected. Changing this property will update the select element. |
| `disabled` | `boolean` | Whether or not the component is disabled. Settings this sets the disabled state on the component. |

#### Events

The MDC Select JS component emits a `change` event when the selected option changes as
the result of a user action.

### `MDCSelectAdapter`

| Method Signature | Description |
| --- | --- |
| `addClass(className: string) => void` | Adds a class to the root element. |
| `removeClass(className: string) => void` | Removes a class from the root element. |
| `floatLabel(value: boolean) => void` | Floats or defloats label. |
| `activateBottomLine() => void` | Activates the bottom line component. |
| `deactivateBottomLine() => void` | Deactivates the bottom line component. |
| `setDisabled(disabled: boolean) => void` | Sets the `disabled` property of the `<select>` element. |
| `registerInteractionHandler(type: string, handler: EventListener) => void` | Adds an event listener `handler` for event type `type` on the `<select>` element. |
| `deregisterInteractionHandler(type: string, handler: EventListener) => void` | Removes an event listener `handler` for event type `type` on the `<select>` element. |
| `getSelectedIndex() => number` | Returns the selected index of the `<select>` element. |
| `setSelectedIndex(index: number) => void` | Sets the selected index of the `<select>` element. |
| `getValue() => string` | Returns the value selected on the `<select>` element. |
| `setValue(value: string) => void` | Sets the value of the `<select>` element. |

### `MDCSelectFoundation`

| Method Signature | Description |
| --- | --- |
| `setValue(value: string) => void` | Sets the value of the component. |
| `setDisabled(disabled: boolean) => void` | Adds/removes disabled class, and sets disabled attribute on the component. |
| `setSelectedIndex(selectedIndex: number) => void` | Sets the selected index of the component. |
