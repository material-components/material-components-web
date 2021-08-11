<!--docs:
title: "Select Menus"
layout: detail
section: components
iconId: menu
path: /catalog/input-controls/select-menus/
-->

# Select Menus

MDC Select provides Material Design single-option select menus, using the MDC menu.
The Select component is fully accessible, and supports RTL rendering.

## Important Changes

Select is currently being updated to use the new List implementation. For now,
please continue to use the old implementation (`mdc-deprecated-list` and
associated DOM/classes) instead of the new one (`mdc-list`).

See the [List documentation](../mdc-list/README.md) for more information.

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

The select uses an [`MDCMenu`](../mdc-menu) component instance to contain the list of options, but uses the
`data-value` attribute instead of `value` to represent the options' values.

> _NOTE_: The `data-value` attribute _must_ be present on each option.

The select requires that you set the `width` of the `mdc-select` element. This is best done through the use of another class (e.g. `demo-width-class` in the example HTML and CSS below).

### HTML

The HTML for the select component follows the WAI-ARIA recommendations for
[Collapsible Dropdown Listboxes](https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html) in order to meet WCAG and ARIA accessibility standards, and to be compatible with assistive technology like screen readers.

The following example applies ARIA attributes that provide the semantic structure required for assistive technology:

```html
<div class="mdc-select mdc-select--filled demo-width-class">
  <div class="mdc-select__anchor"
       role="button"
       aria-haspopup="listbox"
       aria-expanded="false"
       aria-labelledby="demo-label demo-selected-text">
    <span class="mdc-select__ripple"></span>
    <span id="demo-label" class="mdc-floating-label">Pick a Food Group</span>
    <span class="mdc-select__selected-text-container">
      <span id="demo-selected-text" class="mdc-select__selected-text"></span>
    </span>
    <span class="mdc-select__dropdown-icon">
      <svg
          class="mdc-select__dropdown-icon-graphic"
          viewBox="7 10 10 5" focusable="false">
        <polygon
            class="mdc-select__dropdown-icon-inactive"
            stroke="none"
            fill-rule="evenodd"
            points="7 10 12 15 17 10">
        </polygon>
        <polygon
            class="mdc-select__dropdown-icon-active"
            stroke="none"
            fill-rule="evenodd"
            points="7 15 12 10 17 15">
        </polygon>
      </svg>
    </span>
    <span class="mdc-line-ripple"></span>
  </div>

  <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">
    <ul class="mdc-deprecated-list" role="listbox" aria-label="Food picker listbox">
      <li class="mdc-deprecated-list-item mdc-deprecated-list-item--selected" aria-selected="true" data-value="" role="option">
        <span class="mdc-deprecated-list-item__ripple"></span>
      </li>
      <li class="mdc-deprecated-list-item" aria-selected="false" data-value="grains" role="option">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <span class="mdc-deprecated-list-item__text">
          Bread, Cereal, Rice, and Pasta
        </span>
      </li>
      <li class="mdc-deprecated-list-item mdc-deprecated-list-item--disabled" aria-selected="false" data-value="vegetables" aria-disabled="true" role="option">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <span class="mdc-deprecated-list-item__text">
          Vegetables
        </span>
      </li>
      <li class="mdc-deprecated-list-item" aria-selected="false" data-value="fruit" role="option">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <span class="mdc-deprecated-list-item__text">
          Fruit
        </span>
      </li>
    </ul>
  </div>
</div>
```

> _NOTE_: The menu width matches the width of the select by default. To set
menu to its natural width, remove `mdc-menu-surface--fullwidth` from the menu
surface.

### Styles

When using the select, you will also need to load the Menu and List components' styles.

```scss
@use "@material/list/mdc-list";
@use "@material/menu-surface/mdc-menu-surface";
@use "@material/menu/mdc-menu";
@use "@material/select/styles";

.demo-width-class {
  width: 400px;
}
```

### Theming

```scss
@use '@material/select';

.my-demo-select {
  @include select.filled-density(-2);
}
```

### JavaScript Instantiation

```js
import {MDCSelect} from '@material/select';

const select = new MDCSelect(document.querySelector('.mdc-select'));

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
  <div class="mdc-select__anchor" aria-labelledby="outlined-select-label">
    <span class="mdc-notched-outline">
      <span class="mdc-notched-outline__leading"></span>
      <span class="mdc-notched-outline__notch">
        <span id="outlined-select-label" class="mdc-floating-label">Pick a Food Group</span>
      </span>
      <span class="mdc-notched-outline__trailing"></span>
    </span>
    <span class="mdc-select__selected-text-container">
      <span id="demo-selected-text" class="mdc-select__selected-text"></span>
    </span>
    <span class="mdc-select__dropdown-icon">
      <svg
          class="mdc-select__dropdown-icon-graphic"
          viewBox="7 10 10 5" focusable="false">
        <polygon
            class="mdc-select__dropdown-icon-inactive"
            stroke="none"
            fill-rule="evenodd"
            points="7 10 12 15 17 10">
        </polygon>
        <polygon
            class="mdc-select__dropdown-icon-active"
            stroke="none"
            fill-rule="evenodd"
            points="7 15 12 10 17 15">
        </polygon>
      </svg>
    </span>
  </div>

  <!-- Other elements from the select remain. -->
  <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">...</div>
</div>
```

### Additional Information

#### Select with hidden input (for HTML forms)

For convenient submission of Select's value in HTML forms, a hidden input
element may be added under the root element. The component will synchronize its
value with that of the hidden input.

```html
<div class="mdc-select mdc-select--filled demo-width-class">
  <input type="hidden" name="demo-input">
  <div class="mdc-select__anchor">
    <!-- Rest of component omitted for brevity -->
  </div>
</div>

```

#### Select with pre-selected option

To indicate a select component that has a pre-selected value, use the `mdc-deprecated-list-item--selected` class
to set the selected item. The select also needs the text from the selected element copied to the
`mdc-select__selected-text` element.

```html
<div class="mdc-select mdc-select--filled demo-width-class">
  <div class="mdc-select__anchor">
    <span class="mdc-select__ripple"></span>
    <span class="mdc-floating-label mdc-floating-label--float-above">Pick a Food Group</span>
    <span class="mdc-select__selected-text-container">
      <span class="mdc-select__selected-text">Vegetables</span>
    </span>
    <span class="mdc-select__dropdown-icon">
      <svg
          class="mdc-select__dropdown-icon-graphic"
          viewBox="7 10 10 5" focusable="false">
        <polygon
            class="mdc-select__dropdown-icon-inactive"
            stroke="none"
            fill-rule="evenodd"
            points="7 10 12 15 17 10">
        </polygon>
        <polygon
            class="mdc-select__dropdown-icon-active"
            stroke="none"
            fill-rule="evenodd"
            points="7 15 12 10 17 15">
        </polygon>
      </svg>
    </span>
    <span class="mdc-line-ripple"></span>
  </div>

  <div class="mdc-select__menu demo-width-class mdc-menu mdc-menu-surface">
    <ul class="mdc-deprecated-list">
      <li class="mdc-deprecated-list-item" data-value="">
        <span class="mdc-deprecated-list-item__ripple"></span>
      </li>
      <li class="mdc-deprecated-list-item" data-value="grains">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <span class="mdc-deprecated-list-item__text">Bread, Cereal, Rice, and Pasta</span>
      </li>
      <li class="mdc-deprecated-list-item mdc-deprecated-list-item--selected" data-value="vegetables" aria-selected="true">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <span class="mdc-deprecated-list-item__text">Vegetables</span>
      </li>
      <li class="mdc-deprecated-list-item" data-value="fruit">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <span class="mdc-deprecated-list-item__text">Fruit</span>
      </li>
    </ul>
  </div>
</div>
```

#### Using the floating label as the placeholder

Leave the `mdc-select__selected-text` element empty and don't specify an element as selected.
If leaving the field empty should be a valid option, include an `mdc-deprecated-list-item` element at the beginning of
the list with an empty `data-value` attribute.

```html
<li class="mdc-deprecated-list-item mdc-deprecated-list-item--selected" aria-selected="true" role="option" data-value=""></li>
```

#### Required select

To style a select menu as required and enable validation, add the `mdc-select--required` class to the `mdc-select` element
and set the `aria-required` attribute on the `mdc-select__anchor` element to be `"true"`.

```html
<div class="mdc-select mdc-select--filled mdc-select--required">
  <div class="mdc-select__anchor" aria-required="true">
    <span class="mdc-select__ripple"></span>
    <span class="mdc-floating-label">Pick a Food Group</span>
    <span class="mdc-select__selected-text-container">
      <span class="mdc-select__selected-text"></span>
    </span>
    <span class="mdc-select__dropdown-icon">
      <svg
          class="mdc-select__dropdown-icon-graphic"
          viewBox="7 10 10 5" focusable="false">
        <polygon
            class="mdc-select__dropdown-icon-inactive"
            stroke="none"
            fill-rule="evenodd"
            points="7 10 12 15 17 10">
        </polygon>
        <polygon
            class="mdc-select__dropdown-icon-active"
            stroke="none"
            fill-rule="evenodd"
            points="7 15 12 10 17 15">
        </polygon>
      </svg>
    </span>
    <span class="mdc-line-ripple"></span>
  </div>

  <div class="mdc-select__menu mdc-menu mdc-menu-surface">
    ...
  </div>
</div>
```

> _NOTE_: To programmatically set a select as required, use the `required` property in the `MDCSelect` API.

#### Disabled select

Add the `mdc-select--disabled` class to the `mdc-select` element, set the
`aria-disabled` attribute on the `mdc-select__selected-text` element to
be `"true"`, and set the disabled attribute any hidden input element.

```html
<div class="mdc-select mdc-select--filled mdc-select--disabled">
  <div class="mdc-select__anchor" aria-disabled="true">
    <span class="mdc-select__ripple"></span>
    <span class="mdc-floating-label">Pick a Food Group</span>
    <span class="mdc-select__selected-text-container">
      <span class="mdc-select__selected-text"></span>
    </span>
    <span class="mdc-select__dropdown-icon">
      <svg
          class="mdc-select__dropdown-icon-graphic"
          viewBox="7 10 10 5" focusable="false">
        <polygon
            class="mdc-select__dropdown-icon-inactive"
            stroke="none"
            fill-rule="evenodd"
            points="7 10 12 15 17 10">
        </polygon>
        <polygon
            class="mdc-select__dropdown-icon-active"
            stroke="none"
            fill-rule="evenodd"
            points="7 15 12 10 17 15">
        </polygon>
      </svg>
    </span>
    <span class="mdc-line-ripple"></span>
  </div>

  <div class="mdc-select__menu mdc-menu mdc-menu-surface">
    ...
  </div>
</div>
```

> _NOTE_: To programmatically set a select as disabled, use the `disabled` property in the `MDCSelect` API.

#### Disabled options

Add the `mdc-deprecated-list-item--disabled` class to list items that are disabled.
Disabled list items are removed from the list items index and are ignored entirely. You cannot
programmatically select a disabled list item.

```html
<div class="mdc-select mdc-select--filled">
  <div class="mdc-select__anchor">
    ...
  </div>

  <div class="mdc-select__menu mdc-menu mdc-menu-surface">
    <ul class="mdc-deprecated-list">
      <li class="mdc-deprecated-list-item" data-value="">
        <span class="mdc-deprecated-list-item__ripple"></span>
      </li>
      <li class="mdc-deprecated-list-item" data-value="grains">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <span class="mdc-deprecated-list-item__text">Bread, Cereal, Rice, and Pasta</span>
      </li>
      <li class="mdc-deprecated-list-item mdc-deprecated-list-item--selected mdc-deprecated-list-item--disabled" data-value="vegetables">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <span class="mdc-deprecated-list-item__text">Vegetables</span>
      </li>
      <li class="mdc-deprecated-list-item" data-value="fruit">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <span class="mdc-deprecated-list-item__text">Fruit</span>
      </li>
    </ul>
  </div>
</div>
```

### Select with Helper Text

The helper text provides supplemental information and/or validation messages to users. It appears when the select
element is focused and disappears on blur by default, or it can be persistent.
See [here](helper-text/) for more information on using helper text.

### Select with Leading  Icons

Leading icons can be added within the default or outlined variant of MDC Select as visual indicators as
well as interaction targets. See [here](icon/) for more information on using icons.

### Select with No Label

A label is not required if a separate, adjacent label is provided elsewhere. To correctly style
MDC Select without a label, add the class `mdc-select--no-label` and remove the label from the
structure.

#### Filled

```html
<div class="mdc-select mdc-select--filled mdc-select--no-label demo-width-class">
  <div class="mdc-select__anchor">
    <span class="mdc-select__ripple"></span>
    <span class="mdc-select__selected-text-container">
      <span class="mdc-select__selected-text"></span>
    </span>
    <span class="mdc-select__dropdown-icon">
      <svg
          class="mdc-select__dropdown-icon-graphic"
          viewBox="7 10 10 5" focusable="false">
        <polygon
            class="mdc-select__dropdown-icon-inactive"
            stroke="none"
            fill-rule="evenodd"
            points="7 10 12 15 17 10">
        </polygon>
        <polygon
            class="mdc-select__dropdown-icon-active"
            stroke="none"
            fill-rule="evenodd"
            points="7 15 12 10 17 15">
        </polygon>
      </svg>
    </span>
    <span class="mdc-line-ripple"></span>
  </div>

  <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">
    <ul class="mdc-deprecated-list">
      <li class="mdc-deprecated-list-item mdc-deprecated-list-item--selected" data-value="" aria-selected="true">
        <span class="mdc-deprecated-list-item__ripple"></span>
      </li>
      <li class="mdc-deprecated-list-item" data-value="grains">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <span class="mdc-deprecated-list-item__text">Bread, Cereal, Rice, and Pasta</span>
      </li>
      <li class="mdc-deprecated-list-item" data-value="vegetables">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <span class="mdc-deprecated-list-item__text">Vegetables</span>
      </li>
      <li class="mdc-deprecated-list-item" data-value="fruit">
        <span class="mdc-deprecated-list-item__ripple"></span>
        <span class="mdc-deprecated-list-item__text">Fruit</span>
      </li>
    </ul>
  </div>
</div>
```

#### Outlined

```html
<div class="mdc-select mdc-select--outlined mdc-select--no-label demo-width-class">
  <div class="mdc-select__anchor">
    <span class="mdc-notched-outline">
      <span class="mdc-notched-outline__leading"></span>
      <span class="mdc-notched-outline__trailing"></span>
    </span>
    <span class="mdc-select__selected-text-container">
      <span class="mdc-select__selected-text"></span>
    </span>
    <span class="mdc-select__dropdown-icon">
      <svg
          class="mdc-select__dropdown-icon-graphic"
          viewBox="7 10 10 5" focusable="false">
        <polygon
            class="mdc-select__dropdown-icon-inactive"
            stroke="none"
            fill-rule="evenodd"
            points="7 10 12 15 17 10">
        </polygon>
        <polygon
            class="mdc-select__dropdown-icon-active"
            stroke="none"
            fill-rule="evenodd"
            points="7 15 12 10 17 15">
        </polygon>
      </svg>
    </span>
  </div>

  <!-- Other elements from the select remain. -->
  <div class="mdc-select__menu mdc-menu mdc-menu-surface mdc-menu-surface--fullwidth">...</div>
</div>
```

## Style Customization

#### CSS Classes

| Class | Description |
| --- | --- |
| `mdc-select` | Mandatory. |
| `mdc-select__anchor` | Mandatory. This element should be placed within the `mdc-select` element. |
| `mdc-select__menu` | Mandatory. This class should be placed on the `mdc-menu` element within the `mdc-select` element. |
| `mdc-select__dropdown-icon` | Mandatory. Should be placed on an `i` element within the `mdc-select__anchor` element. Used for the dropdown arrow svg and animation.
| `mdc-select__selected-text-container` | Mandatory. This class wraps the `mdc-select__selected-text` and facilitates `text-overflow: ellipsis` on it. |
| `mdc-select__selected-text` | Mandatory. This class should be placed on a `span` within the `mdc-select__anchor` element. |
| `mdc-select__icon` | Optional. Should be placed on an `i` or `svg` element within the `mdc-select__anchor` element. Used for the leading icon.
| `mdc-select--activated` | Optional. Styles the activated state of select. This class will be added automatically when menu is opened.
| `mdc-select--disabled` | Optional. Styles the select as disabled. This class should be applied to the root element when the `disabled` attribute is applied to the `<select>` element. |
| `mdc-select--outlined` | Optional. Styles the select as outlined select. |
| `mdc-select--with-leading-icon` | Styles the select as a select with a leading icon. |
| `mdc-select--no-label` | Styles the select as a select without a label. |
> _NOTE_: To further customize the [MDCMenu](./../mdc-menu) or the [MDCList](./../mdc-list) component contained within the select, please refer to their respective documentation.

### Sass Mixins

Mixins should be included in the context of a custom class applied to the component's root element, e.g. `.my-select`.

Mixin | Description
--- | ---
`ink-color($state)` | Customizes the color of the selected item displayed in the select. Accepts a Map for `default` and `disabled` states.
`container-fill-color($state)` | Customizes the background color of the select. Accepts a Map for `default` and `disabled` states.
`dropdown-icon-color($state)` | Customizes the dropdown icon color of the select. Accepts a Map for `default`, `hover`, `focus`, and `disabled` states.
`label-color($state)` | Customizes the label color of the select. Accepts a Map for `default`, `hover`, `focus`, and `disabled` states.
`label-floating-color($state)` | Customizes the label color of the select when the label is floating. Accepts a Map for `default` and `hover` states.
`bottom-line-color($state)` | Customizes the color of the bottom line of the select. Accepts a Map for `default`, `hover`, `focus`, and `disabled` states.
`filled-shape-radius($radius, $density-scale, $rtl-reflexive)` | Sets rounded shape to filled select variant with given radius size. Set `$rtl-reflexive` to true to flip radius values in RTL context, defaults to false.
`outline-color($state)` | Customizes the color of the notched outline. Accepts a Map for `default`, `hover`, `focus`, and `disabled` states.
`outline-shape-radius($radius, $density-scale, $rtl-reflexive)` | Sets the border radius of the outlined select variant. Set `$rtl-reflexive` to true to flip radius values in RTL context, defaults to false.
`filled-density($density-scale)` | Sets density scale for the filled select variant (Excluding filled select with leading icon).
`filled-with-leading-icon-density($density-scale)` | Sets density scale for filled select with leading icon.
`outlined-density($density-scale)` | Sets density scale for outlined select (Excluding outlined select with leading icon).
`outlined-with-leading-icon-density($density-scale)` | Sets density scale for outlined select with leading icon.
`filled-height($height)` | Sets height of the filled select variant (Excluding filled select with leading icon).
`filled-with-leading-icon-height($height)` | Sets height of filled select with leading icon variant.
`outlined-height($height)` | Sets height of outlined select variant (Excluding outlined select with leading icon).
`outlined-with-leading-icon-height($height)` | Sets height of outlined select with leading icon variant.
`variable-width($min-width)` | Sets the select behavior to change width dynamically based on content.

> _NOTE_: To further customize the floating label, please see the [floating label documentation](./../mdc-floating-label/README.md).

## `MDCSelect` API

The `MDCSelect` component API is modeled after a subset of the `HTMLSelectElement` functionality.

Property | Type | Description
--- | --- | ---
`value` | `string` | The `value`/`data-value` of the currently selected option.
`selectedIndex` | `number` | The index of the currently selected option. Set to -1 if no option is currently selected. Changing this property will update the select element.
`disabled` | `boolean` | Whether or not the component is disabled. Setting this sets the disabled state on the component.
`useDefaultValidation` | `boolean` | Whether or not to use the default validation scheme where a required select must be non-empty. Set to false for custom validation.
`valid` | `boolean` | Whether or not the component is in a valid state. Setting this updates styles on the component, but does not affect the native validity state.
`required` | `boolean` | Whether or not the component is required. Setting this updates the `required` or `aria-required` attribute on the component and enables validation.
`leadingIconAriaLabel` | `string` (write-only) | Proxies to the foundation's `setLeadingIconAriaLabel` method.
`leadingIconContent` | `string` (write-only) | Proxies to the foundation's `setLeadingIconContent` method.
`helperTextContent` | `string` (write-only)| Proxies to the foundation's `setHelperTextContent` method when set.
`ripple` | `MDCRipple` | Ripple instance attached to outlined select variant, or `null` for all other variants.

Method Signature | Description
--- | ---
`layout() => void` | Re-calculates if the notched outline should be notched and if the label should float. Proxies to the foundation's `layout()` method.
`layoutOptions() => void` | Synchronizes the list of options with the state of the foundation. Proxies to the foundation's `layoutOptions()` method. Call this whenever menu options are dynamically updated.

### Events

Event Name | Data | Description
--- | --- | ---
`MDCSelect:change` | `{value: string, index: number}` | Used to indicate when an element has been selected. This event also includes the value of the item and the index.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Select for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCSelectAdapter`

| Method Signature | Description |
| --- | --- |
| `addClass(className: string) => void` | Adds a class to the select element. |
| `removeClass(className: string) => void` | Removes a class from the select element. |
| `hasClass(className: string) => boolean` | Returns true if the select element has the className in its classList. |
| `activateBottomLine() => void` | Activates the bottom line component. |
| `deactivateBottomLine() => void` | Deactivates the bottom line component. |
| `hasLabel() => boolean` | Returns true if the select contains a label. |
| `floatLabel(value: boolean) => void` | Floats or defloats label. |
| `getLabelWidth() => number` | Returns the offsetWidth of the label element. |
| `hasOutline() => boolean` | Returns true if the `select` has the notched outline element. |
| `notchOutline(labelWidth: number) => void` | Switches the notched outline element to its "notched state." |
| `closeOutline() => void` | Switches the notched outline element to its closed state. |
| `setDisabled(isDisabled: boolean) => void` | Enables or disables the select. |
| `openMenu() => void` | Opens the menu and applies activated styling. |
| `setRippleCenter(normalizedX: number) => void` | Sets the line ripple center to the provided normalizedX value. |
| `notifyChange(value: string) => void` | Emits the `MDCSelect:change` event when an element is selected. |
| `setSelectedText(text: string) => void` | Sets the text content of the selectedText element to the given string. |
| `isSelectAnchorFocused() => boolean` | Returns whether the select anchor element is focused. |
| `getSelectAnchorAttr(attr: string) => string` | Gets the given attribute on the select anchor element. |
| `setSelectAnchorAttr(attr: string, value: string) => void` | Sets the given attribute on the select anchor element. |
| `removeSelectAnchorAttr(attr: string) => void` | Removes the given attribute on the select anchor element. |
| `openMenu() => void` | Causes the menu element in the select to open. |
| `closeMenu() => void` | Causes the menu element in the select to close. |
| `getAnchorElement() => Element` | Returns the select anchor element. |
| `setMenuAnchorElement(anchorEl: Element) => void` | Sets the menu anchor element. |
| `setMenuAnchorCorner(anchorCorner: Corner) => void` | Sets the menu anchor corner. |
| `setMenuWrapFocus(wrapFocus: boolean) => void` | Sets whether the menu should wrap focus. |
| `focusMenuItemAtIndex(index: number) => void` | Focuses the menu item at the given index. |
| `getMenuItemValues() => string[]` | Returns an array representing the VALUE_ATTR attributes of each menu item. |
| `getMenuItemCount() => number` | Returns the number of menu items. |
| `getMenuItemTextAtIndex(index: number) => string` | Gets the text content of the menu item element at the given index. |
| `getSelectedIndex() => number` | Returns the selected index in the menu. |
| `setSelectedIndex() => number` | Sets the selected index in the menu. |
| `isTypeaheadInProgress() => boolean` | Returns whether typeahead is in progress in the menu. |
| `typeaheadMatchItem: (nextChar: string, startingIndex: number) => number` | Adds a character to the list typeahead buffer and returns index of the next item in the list matching the buffer. |
### `MDCSelectFoundation`

| Method Signature | Description |
| --- | --- |
| `notchOutline(openNotch: boolean) => void` | Opens/closes the notched outline. |
| `getDisabled() => boolean` | Gets the disabled state. |
| `setDisabled(isDisabled: boolean) => void` | Updates the disabled state. |
| `handleFocus() => void` | Handles a focus event on the `select` element. |
| `handleBlur() => void` | Handles a blur event on the `select` element. |
| `handleClick(normalizedX: number) => void` | Sets the line ripple center to the normalizedX for the line ripple. |
| `handleMenuOpened() => void` | Handles menu or menu surface opened event.
| `handleMenuClosed() => void` | Handles menu or menu surface closed event.
| `handleMenuItemAction() => void` | Handles menu selected event.
| `handleChange() => void` | Handles a change to the `select` element's value. This must be called both for `change` events and programmatic changes requested via the component API. |
| `handleKeydown(event: KeyboardEvent) => void` | Handles opening the menu when the `mdc-select__selected-text` element is focused and the user presses the `Enter` or `Space` key. |
| `getSelectedIndex() => number` | Returns the index of the currently selected menu item. |
| `setSelectedIndex(index: number) => void` | Handles setting the `mdc-select__selected-text` element and closing the menu. Also causes the label to float and outline to notch if needed. |
| `getValue() => string` | Handles getting the value through the adapter. |
| `setValue() => string` | Sets the selected index to the index of the menu item with the given value. |
| `setUseDefaultValidation(useDefaultValidation: boolean) => void` | Enables or disables the default validation scheme where a required select must be non-empty. Set to false for custom validation.|
| `setValid(isValid: boolean) => void` | Sets the valid state through the adapter. Note that default validation scheme where a required select is invalid if empty will still be honored subsequently unless `setUseDefaultValidation(false)` is also called.|
| `isValid() => boolean` | Gets the valid state through the adapter's `checkValidity` API. |
| `setRequired(isRequired: boolean) => void` | Sets the required state through the adapter. |
| `getRequired() => boolean` | Gets the required state through the adapter. |
| `init() => void` | Initializes the foundation. |
| `layout() => void` | Re-calculates if the notched outline should be notched and if the label should float. |
| `layoutOptions() => void` | Synchronizes the list of options with the state of the foundation. Call this whenever menu options are dynamically updated. |
| `setLeadingIconAriaLabel(label: string) => void` | Sets the aria label of the leading icon. |
| `setLeadingIconContent(content: string) => void` | Sets the text content of the leading icon. |
| `setHelperTextContent(content: string) => void` | Sets the content of the helper text. |

`MDCSelectFoundation` supports multiple optional sub-elements: helper text and icon. The foundations of these sub-elements must be passed in as constructor arguments to `MDCSelectFoundation`.
