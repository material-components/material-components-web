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
  <i class="mdc-select__dropdown-icon"></i>
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

The enhanced select uses an MDCMenu component to contain the list of options

```html
<div class="mdc-select">
  <i class="mdc-select__dropdown-icon"></i>
  <div class="mdc-select__selected-text"></div>
  <div class="mdc-select__menu mdc-menu mdc-menu-surface">
    <ul class="mdc-list">
      <li class="mdc-list-item mdc-list-item--selected" value="" aria-selected="true"></option>
      <li class="mdc-list" value="grains">
        Bread, Cereal, Rice, and Pasta
      </li>
      <li class="mdc-list" value="vegetables">
        Vegetables
      </li>
      <li class="mdc-list" value="fruit">
        Fruit
      </li>
    </ul> 
  </div>
  <label class="mdc-floating-label">Pick a Food Group</label>
  <div class="mdc-line-ripple"></div>
</div>
```

### Styles

```scss
@import "@material/list/mdc-list";
@import "@material/menu-surface/mdc-menu-surface";
@import "@material/menu/mdc-menu";
@import "@material/select/mdc-select";
```

### JavaScript Instantiation

```js
const select = new mdc.select.MDCSelect(document.querySelector('.mdc-select'));
select.listen('MDCSelect:change', () => {
  alert(`Selected option at index ${select.selectedIndex} with value "${select.value}"`);
});
```

See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

## Variants

### Outlined Select

The Select Outlined variant uses the `mdc-notched-outline` in place of the `mdc-line-ripple` element and adds the
`mdc-select--outlined` modifier class on the root element. All other elements for each type of select remain the 
same.

```html
<div class="mdc-select mdc-select--outlined">
  ... // Other elements from the basic examples remain.
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
  <i class="mdc-select__dropdown-icon"></i>
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

The enhanced select works in a similar way, but uses the `mdc-list-item--selected` class to set the selected. The
enhanced select also needs the text from the selected element moved to the `mdc-select__selected-text` element.

```html
<div class="mdc-select">
  <i class="mdc-select__dropdown-icon"></i>
  <div class="mdc-select__selected-text">Vegetables</div>
  <div class="mdc-select__menu mdc-menu mdc-menu-surface">
    <ul class="mdc-list">
      <li class="mdc-list-item" value=""></option>
      <li class="mdc-list" value="grains">
        Bread, Cereal, Rice, and Pasta
      </li>
      <li class="mdc-list mdc-list-item--selected" value="vegetables" aria-selected="true">
        Vegetables
      </li>
      <li class="mdc-list" value="fruit">
        Fruit
      </li>
    </ul> 
  </div>
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

For the enhanced select, simply leave the `mdc-select__selected-text` element empty and don't specify an element as 
selected.

#### Disabled select

Add the `mdc-select--disabled` class to the `mdc-select` element, and add the `disabled` attribute to the
`<select>` element.

```html
<div class="mdc-select mdc-select--disabled">
    <i class="mdc-select__dropdown-icon"></i>
  <select class="mdc-select__native-control" disabled>
    ...
  </select>
  <label class="mdc-floating-label">Pick a Food Group</label>
  <div class="mdc-line-ripple"></div>
</div>
```

For the enhanced select, you can simply add the `mdc-select--disabled` class to the `mdc-select` element. 

```html
<div class="mdc-select mdc-select--disabled">
  <i class="mdc-select__dropdown-icon"></i>
  <div class="mdc-select__selected-text"></div>  
  <div class="mdc-select__menu mdc-menu mdc-menu-surface">
    ...
  </div>
  <label class="mdc-floating-label">Pick a Food Group</label>
  <div class="mdc-line-ripple"></div>
</div>
```

#### Disabled options

For the native `select`, simply add the `disabled` attribute to individual options to disable them.

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

For the enhanced select, you should add the `mdc-list-item--disabled` class to list items that are disabled. Unlike the
native select, disabled list items are removed from the list items index, and are ignored entirely. You cannot 
programmatically select a disabled list item in the enhanced select. 

```html
<div class="mdc-select">
  <i class="mdc-select__dropdown-icon"></i>
  <div class="mdc-select__selected-text">Vegetables</div>
  <div class="mdc-select__menu mdc-menu mdc-menu-surface">
    <ul class="mdc-list">
      <li class="mdc-list-item" value=""></option>
      <li class="mdc-list" value="grains">
        Bread, Cereal, Rice, and Pasta
      </li>
      <li class="mdc-list mdc-list-item--selected mdc-list-item--disabled" value="vegetables">
        Vegetables
      </li>
      <li class="mdc-list" value="fruit">
        Fruit
      </li>
    </ul> 
  </div>
  <label class="mdc-floating-label mdc-floating-label--float-above">Pick a Food Group</label>
  <div class="mdc-line-ripple"></div>
</div>
```

## Style Customization

#### CSS Classes

| Class | Description |
| --- | --- |
| `mdc-select` | Mandatory. |
| `mdc-select__menu` | Mandatory when using the enhanced select. This class should be placed on the `mdc-menu` element within the `mdc-select` element. |
| `mdc-select__dropdown-icon` | Mandatory. Should be placed on an `i` element within the `mdc-select` element. Used for the dropdown arrow svg and animation.
| `mdc-select--disabled` | Optional. Styles the select as disabled. This class should be applied to the root element when the `disabled` attribute is applied to the `<select>` element. |
| `mdc-select--outlined` | Optional. Styles the select as outlined select. |
| `mdc-select__native-control` | Mandatory for the native select. The native `<select>` element. |
| `mdc-select__selected-text` | Mandatory for the enhanced select. This element should be placed on a `div` within the `mdc-select` element. |

> Note: To further customize the [MDCMenu](./../mdc-menu/README.md) or the [MDCList](./../mdc-list/README.md) component contained within the select, please refer to their respective documentation.

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

The MDC Select JS component emits a `MDCSelect:change` event when the selected option changes as the result of a user action.

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
| `floatLabel(value: boolean) => void` | Floats or defloats label. |
| `getLabelWidth() => number` | Returns the offsetWidth of the label element. |
| `hasOutline() => boolean` | Returns true if the `select` has the notched outline element. |
| `notchOutline(labelWidth: number, isRtl, boolean) => void` | Switches the notched outline element to its "notched state." |
| `closeOutline() => void` | Switches the notched outline element to its closed state. |
| `openMenu() => void` | Causes the menu element in the enhanced select to open. |
| `closeMenu() => void` | Causes the menu element in the enhanced select to close. |
| `setValue(value: string) => void` | Sets the value of the select or text content of the selected-text element. |
| `isMenuOpened() => boolean` | Returns true if the menu is currently opened. |
| `setSelectedIndex(index: number) => void` | Sets the select or selected list item to the element at the index specified. |
| `setDisabled(isDisabled: boolean) => void` | Sets the select or selected list item to the disabled state. |
| `setRippleCenter(normalizedX: number) => void` | Sets the line ripple center to the provided normalizedX value. |
| `changeEvent({value: string}: Object) => void` | Emits the `MDCSelect:change` event when an element is selected. |

### `MDCSelectFoundation`

| Method Signature | Description |
| --- | --- |
| `notchOutline(openNotch: boolean) => void` | Opens/closes the notched outline. |
| `setDisabled(isDisabled: boolean) => void` | Updates appearance based on disabled state. This must be called whenever the `disabled` state changes. |
| `handleFocus() => void` | Handles a focus event on the `select` element. |
| `handleBlur() => void` | Handles a blur event on the `select` element. |
| `handleClick(normalizedX: number) => void` | Sets the line ripple center to the normalizedX for the line ripple. |
| `handleChange() => void` | Handles a change to the `select` element's value. This must be called both for `change` events and programmatic changes requested via the component API. |
| `handleKeydown(event: Event) => void` | Handles opening the menu (enhanced select) when the `mdc-select__selected-text` element is focused and the user presses the `Enter` or `Space` key. |
| `setSelectedIndex(index: number) => void` | Handles setting the `mdc-select__selected-text` element and closing the menu (enhanced select only). Also causes the label to float and outline to notch if needed. |
| `setValue(value: string) => void` | Handles setting the value through the adapter and causes the label to float and outline to notch if needed. |
| `getValue() => string` | Handles getting the value through the adapter. |
| `layout() => void` | Handles determining if the notched outline should be notched. |

### Events

Event Name | Data | Description
--- | --- | ---
`MDCSelect:change` | `{value: string, index: number}` | Used to indicate when an element has been selected. This event also includes the value of the item and the index.
