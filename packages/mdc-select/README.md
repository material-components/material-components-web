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
  <select class="mdc-select__surface">
    <option class="mdc-select__option" value="" disabled selected></option>
    <option class="mdc-select__option" value="grains">
      Bread, Cereal, Rice, and Pasta
    </option>
    <option class="mdc-select__option" value="vegetables">
      Vegetables
    </option>
    <option class="mdc-select__option" value="fruit">
      Fruit
    </option>
    <option class="mdc-select__option" value="dairy">
      Milk, Yogurt, and Cheese
    </option>
    <option class="mdc-select__option" value="meat">
      Meat, Poultry, Fish, Dry Beans, Eggs, and Nuts
    </option>
    <option class="mdc-select__option" value="fats">
      Fats, Oils, and Sweets
    </option>
  </select>
  <div class="mdc-select__label">Pick a Food Group</div>
  <div class="mdc-select__bottom-line"></div>
</div>
```

Use the `<option disabled selected/>` element as a way to display the select having no value.

```html
<option class="mdc-select__option" value="" disabled selected></option>
```

Then with JS

```js
const select = new mdc.select.MDCSelect(document.querySelector('.mdc-select'));
select.listen('change', () => {
  alert(`Selected "${select.selectedOptions[0].textContent}" at index ${select.selectedIndex} ` +
        `with value "${select.value}"`);
});
```

See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

#### Select with pre-selected option

When dealing with the select component that has pre-selected values, you'll want to ensure that you
render `mdc-select__label` with the `mdc-select__label--float-above` modifier class and the selected
option with `aria-selected` and the `selected` attribute. This will ensure that the label moves out
of the way of the select's value and prevents a Flash Of Un-styled Content (**FOUC**).

```html
<div class="mdc-select">
  <select class="mdc-select__surface">
    <option class="mdc-select__option" value="grains">
      Bread, Cereal, Rice, and Pasta
    </option>
    <option class="mdc-select__option" value="vegetables">
      Vegetables
    </option>
    <option class="mdc-select__option" value="fruit">
      Fruit
    </option>
    <option class="mdc-select__option" value="dairy" aria-selected selected>
      Milk, Yogurt, and Cheese
    </option>
  </select>
  <div class="mdc-select__label mdc-select__label--float-above">Pick a Food Group</div>
  <div class="mdc-select__bottom-line"></div>
</div>
```

#### Disabled select

Add the `mdc-select--disabled` class and the `aria-disabled` attribute to the `mdc-select`
element. Also add the `disabled` attribute to the `<select />` element.

```html
<div class="mdc-select mdc-select--disabled" aria-disabled="true">
  <select class="mdc-select__surface" disabled>
    <option class="mdc-select__option" value="grains">
      Bread, Cereal, Rice, and Pasta
    </option>
    <option class="mdc-select__option" value="vegetables">
      Vegetables
    </option>
    <option class="mdc-select__option" value="fruit">
      Fruit
    </option>
  </select>
  <div class="mdc-select__label">Pick a Food Group</div>
  <div class="mdc-select__bottom-line"></div>
</div>
```

#### Disabled options

When used in components such as MDC Select, `mdc-select__option`s can be disabled.
To disable a list item, set `aria-disabled` to `"true"` and add the `disabled` attribute.

```html
<div class="mdc-select">
  <select class="mdc-select__surface">
    <option class="mdc-select__option" value="grains">
      Bread, Cereal, Rice, and Pasta
    </option>
    <option class="mdc-select__option" value="vegetables" aria-disabled="true" disabled>
      Vegetables
    </option>
    <option class="mdc-select__option" value="fruit">
      Fruit
    </option>
  </select>
  <div class="mdc-select__label">Pick a Food Group</div>
  <div class="mdc-select__bottom-line"></div>
</div>
```

#### CSS Classes

| Class                    | Description                                     |
| ------------------------ | ----------------------------------------------- |
| `mdc-select`             | Mandatory.                                      |
| `mdc-select--box`        | Styles the select as a box select.              |
| `mdc-select__option`     | A select option.                                |

### Sass Mixins

To customize the colors of any part of the select, use the following mixins. We recommend you use
these mixins within CSS selectors like `.foo-select` to apply styling.

Mixin | Description
--- | ---
`mdc-select-ink-color($color)` | Customizes the color of the selected item displayed in the select.
`mdc-select-container-fill-color($color)` | Customizes the background color of the select.
`mdc-select-focused-label-color($color, $opacity: 0.87)` | Customizes the label color of the select when focused. Changing opacity for the label when floating is optional.
`mdc-select-bottom-line-color($color)` | Customizes the color of the default bottom line of the select.
`mdc-select-focused-bottom-line-color($color)` | Customizes the color of the bottom line of the select when focused.

To customize the color of the list items, refer to the [List documentation](../mdc-list/README.md).

> NOTE: To customize label color please see [label readme](./label/README.md).

### MDC Select Component API

The MDC Select component API is modeled after a subset of the `HTMLSelectElement` functionality, and
is outlined below.

#### Properties

| Property Name | Type | Description |
| --- | --- | --- |
| `value` | `string` | The `value` of the currently selected option. |
| `options` | `[]` | _(read-only)_ An _array_ of `<options />` comprising the select's options. |
| `selectedIndex` | `number` | The index of the currently selected option. Set to -1 if no option is currently selected. Changing this property will update the select element. |
| `selectedOptions` | `[]` | _(read-only)_ An _array_ of `<options />` either the currently selected option, or no elements if nothing is selected. |
| `disabled` | `boolean` | Whether or not the component is disabled. Settings this sets the disabled state on the component. |

### `MDCSelect`

| Method Signature | Description |
| --- | --- |
| `item(index: number) => HTMLElement?` | Analogous to `HTMLSelectElement.prototype.item`. Returns the option at the specified index, or `null` if the index is out of bounds. }
| `nameditem(key: string) => HTMLElement?` | Analogous to `HTMLSelectElement.prototype.nameditem`. Returns the options either whose `id` equals the given `key`, or whose `name` attribute equals the given `key`. Returns `null` if no item with an `id` or `name` attribute of the specified key is found. |
| `initialSyncWithDOM() => void` | Syncs the component with the current state of the HTML markup. |

#### Events

The MDC Select JS component emits an `change` event when the selected option changes as
the result of a user action.

### `MDCSelectAdapter`

| Method Signature | Description |
| --- | --- |
| `addClass(className: string) => void` | Adds a class to the root element. |
| `removeClass(className: string) => void` | Removes a class from the root element. |
| `floatLabel(value: boolean) => void` | Float or defloats label as necessary. |
| `activateBottomLine() => void` | Activates bottom line as focused. |
| `deactivateBottomLine() => void` | Deactivates bottom line as root element loses focus. |
| `setAttr(attr: string, value: string) => void` | Sets attribute `attr` to value `value` on the root element. |
| `rmAttr(attr: string) => void` | Removes attribute `attr` from the root element. |
| `setDisabled(disabled: boolean) => void` | Sets the `<select />` element to disabled. |
| `registerInteractionHandler(type: string, handler: EventListener) => void` | Adds an event listener `handler` for event type `type` on the surface element. |
| `deregisterInteractionHandler(type: string, handler: EventListener) => void` | Removes an event listener `handler` for event type `type` on the surface element. |
| `getNumberOfOptions() => number` | Returns the number of options contained in the select. |
| `getIndexForOptionValue(value: string) => number` | Returns the index of the option that matches the specified value. Returns -1 if value is not found. |
| `getValueForOptionAtIndex(index: number) => string` | Returns the value for the option at the specified index within the select. |
| `setSelectedIndex(index: number) => void` | Sets the select's selectedValue to the option found at the provided index. If the index is out of the select's range, it will default to -1. |
| `getValue() => string` | Returns the selected value of the select. Returns empty string if no value is set. |
| `setValue(value: string) => void` | Sets the select's value. If no option has the provided value, it sets `value` to empty string. |
| `setAttrForOptionAtIndex(index: number, attr: string, value: string) => void` | Sets an attribute `attr` to value `value` for the option at the specified index within the select. |
| `rmAttrForOptionAtIndex(index: number, attr: string) => void` | Removes an attribute `attr` for the option at the specified index within the select. |

### `MDCSelectFoundation`

| Method Signature | Description |
| --- | --- |
| `getValue() => string` | Returns the value of the currently selected option, or an empty string if no option is selected. |
| `setValue(value: string) => void` | Sets the select's value. If value is not found within list of options, it will set it to empty string. |
| `getSelectedIndex() => number` | Returns the index of the currently selected option. Returns -1 if no option is currently selected. |
| `setSelectedIndex(selectedIndex: number) => void` | Sets the selected index of the component. |
