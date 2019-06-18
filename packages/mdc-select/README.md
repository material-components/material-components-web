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

MDC Select provides Material Design single-option select menus, using the MDC menu.
The Select component is fully accessible, and supports RTL rendering.

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

> Note: The `data-value` attribute _must_ be present on each option.

The enhanced select requires that you set the `width` of the root element (containing the
`mdc-select` class) as well as setting the width of the `mdc-select__menu` element to match. This is best done
through the use of another class (e.g. `demo-width-class` in the example HTML and CSS below).

If you are using the enhanced select within an HTML form, you can include a hidden `<input>` element under the root
`mdc-select` element, and it will be synchronized when the value is updated via user interaction or programmatically.

### HTML

```html
<div class="mdc-select">
  <div class="mdc-select__anchor demo-width-class">
    <i class="mdc-select__dropdown-icon"></i>
    <div class="mdc-select__selected-text"></div>
    <span class="mdc-floating-label">Pick a Food Group</span>
    <div class="mdc-line-ripple"></div>
  </div>

  <div class="mdc-select__menu mdc-menu mdc-menu-surface demo-width-class">
    <ul class="mdc-list">
      <li class="mdc-list-item mdc-list-item--selected" data-value="" aria-selected="true"></li>
      <li class="mdc-list-item" data-value="grains">
        Bread, Cereal, Rice, and Pasta
      </li>
      <li class="mdc-list-item" data-value="vegetables">
        Vegetables
      </li>
      <li class="mdc-list-item" data-value="fruit">
        Fruit
      </li>
    </ul>
  </div>
</div>
```

### Styles

When using the enhanced select, you will also need to load the Menu and List components' styles.

```scss
@import "@material/list/mdc-list";
@import "@material/menu-surface/mdc-menu-surface";
@import "@material/menu/mdc-menu";
@import "@material/select/mdc-select";

.demo-width-class {
  width: 400px;
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

#### Accessibility (a11y)

In order to have an accessible component for users, it's recommended that you follow the WAI-ARIA example for
[Collapsible Dropdown Listbox](https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html).
The following is an example of the enhanced select component with all of the necessary aria attributes.

```html
<div class="mdc-select">
  <div class="mdc-select__anchor">
    <i class="mdc-select__dropdown-icon"></i>
    <div id="demo-selected-text" class="mdc-select__selected-text" role="button" aria-haspopup="listbox" aria-labelledby="demo-label demo-selected-text">Vegetables</div>
    <span id="demo-label" class="mdc-floating-label mdc-floating-label--float-above">Pick a Food Group</span>
    <div class="mdc-line-ripple"></div>
  </div>

  <div class="mdc-select__menu mdc-menu mdc-menu-surface" role="listbox">
    <ul class="mdc-list">
      <li class="mdc-list-item mdc-list-item--selected" data-value="" role="option"></li>
      <li class="mdc-list-item" data-value="grains" role="option">
        Bread, Cereal, Rice, and Pasta
      </li>
      <li class="mdc-list-item mdc-list-item--disabled" data-value="vegetables" aria-selected="true" aria-disabled="true" role="option">
        Vegetables
      </li>
      <li class="mdc-list-item" data-value="fruit" role="option">
        Fruit
      </li>
    </ul>
  </div>
</div>
```

## Variants

### Outlined Select

The Select Outlined variant uses the `mdc-notched-outline` in place of the `mdc-line-ripple` element and adds the
`mdc-select--outlined` modifier class on the root element. All other elements for each type of select remain the
same.

```html
<div class="mdc-select">
  <div class="mdc-select mdc-select--outlined">
    <div class="mdc-notched-outline">
      <div class="mdc-notched-outline__leading"></div>
      <div class="mdc-notched-outline__notch">
        <label class="mdc-floating-label">Pick a Food Group</label>
      </div>
      <div class="mdc-notched-outline__trailing"></div>
    </div>
    <!-- Other elements from the select remain. -->
  </div>
</div>
```

### Additional Information

#### Select with pre-selected option

To indicate a select component that has a pre-selected value, use the `mdc-list-item--selected` class
to set the selected item. The select also needs the text from the selected element copied to the
`mdc-select__selected-text` element.

```html
<div class="mdc-select">
  <div class="mdc-select__anchor demo-width-class">
    <input type="hidden" name="enhanced-select">
    <i class="mdc-select__dropdown-icon"></i>
    <div class="mdc-select__selected-text">Vegetables</div>
    <span class="mdc-floating-label mdc-floating-label--float-above">Pick a Food Group</span>
    <div class="mdc-line-ripple"></div>
  </div>

  <div class="mdc-select__menu demo-width-class mdc-menu mdc-menu-surface">
    <ul class="mdc-list">
      <li class="mdc-list-item" data-value=""></li>
      <li class="mdc-list-item" data-value="grains">
        Bread, Cereal, Rice, and Pasta
      </li>
      <li class="mdc-list-item mdc-list-item--selected" data-value="vegetables" aria-selected="true">
        Vegetables
      </li>
      <li class="mdc-list-item" data-value="fruit">
        Fruit
      </li>
    </ul>
  </div>
</div>
```

#### Using the floating label as the placeholder

Leave the `mdc-select__selected-text` element empty and don't specify an element as selected.
If leaving the field empty should be a valid option, include an `mdc-list-item` element at the beginning of
the list with an empty `data-value` attribute.

```html
<li class="mdc-list-item mdc-list-item--selected" aria-selected="true" role="option" data-value=""></li>
```

#### Disabled select

Add the `mdc-select--disabled` class to the `mdc-select` element, and add the `disabled`
attribute to the hidden `<input>` element if present.

```html
<div class="mdc-select">
  <div class="mdc-select__anchor mdc-select--disabled">
    <input type="hidden" name="enhanced-select" disabled>
    <i class="mdc-select__dropdown-icon"></i>
    <div class="mdc-select__selected-text"></div>
    <span class="mdc-floating-label">Pick a Food Group</span>
    <div class="mdc-line-ripple"></div>
  </div>

  <div class="mdc-select__menu mdc-menu mdc-menu-surface">
    ...
  </div>
</div>
```

#### Disabled options

Add the `mdc-list-item--disabled` class to list items that are disabled.
Disabled list items are removed from the list items index and are ignored entirely. You cannot
programmatically select a disabled list item.

```html
<div class="mdc-select">
  <div class="mdc-select__anchor">
    <input type="hidden" name="enhanced-select">
    <i class="mdc-select__dropdown-icon"></i>
    <div class="mdc-select__selected-text">Vegetables</div>
    <span class="mdc-floating-label mdc-floating-label--float-above">Pick a Food Group</span>
    <div class="mdc-line-ripple"></div>
  </div>

  <div class="mdc-select__menu mdc-menu mdc-menu-surface">
    <ul class="mdc-list">
      <li class="mdc-list-item" data-value=""></li>
      <li class="mdc-list-item" data-value="grains">
        Bread, Cereal, Rice, and Pasta
      </li>
      <li class="mdc-list-item mdc-list-item--selected mdc-list-item--disabled" data-value="vegetables">
        Vegetables
      </li>
      <li class="mdc-list-item" data-value="fruit">
        Fruit
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

## Style Customization

#### CSS Classes

| Class | Description |
| --- | --- |
| `mdc-select` | Mandatory. |
| `mdc-select__menu` | Mandatory when using the enhanced select. This class should be placed on the `mdc-menu` element within the `mdc-select` element. |
| `mdc-select__dropdown-icon` | Mandatory. Should be placed on an `i` element within the `mdc-select` element. Used for the dropdown arrow svg and animation.
| `mdc-select__icon` | Optional. Should be placed on an `i` or `svg` element within the `mdc-select` element. Used for the leading icon.
| `mdc-select--activated` | Optional. Styles the activated state of select. This class will be added automatically when menu is opened.
| `mdc-select--disabled` | Optional. Styles the select as disabled. This class should be applied to the root element when the `disabled` attribute is applied to the `<select>` element. |
| `mdc-select--outlined` | Optional. Styles the select as outlined select. |
| `mdc-select__selected-text` | Mandatory. This class should be placed on a `div` within the `mdc-select` element. |
| `mdc-select--with-leading-icon` | Styles the select as a select with a leading icon. |

> Note: To further customize the [MDCMenu](./../mdc-menu) or the [MDCList](./../mdc-list) component contained within the select, please refer to their respective documentation.

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

Property | Type | Description
--- | --- | ---
`value` | `string` | The `value`/`data-value` of the currently selected option.
`selectedIndex` | `number` | The index of the currently selected option. Set to -1 if no option is currently selected. Changing this property will update the select element.
`disabled` | `boolean` | Whether or not the component is disabled. Setting this sets the disabled state on the component.
`valid` | `boolean` | Whether or not the component is in a valid state. Setting this updates styles on the component, but does not affect the native validity state.
`required` | `boolean` | Whether or not the component is required. Setting this updates the `required` or `aria-required` attribute on the component and enables validation.
`leadingIconAriaLabel` | `string` (write-only) | Proxies to the foundation's `setLeadingIconAriaLabel` method.
`leadingIconContent` | `string` (write-only) | Proxies to the foundation's `setLeadingIconContent` method.
`helperTextContent` | `string` (write-only)| Proxies to the foundation's `setHelperTextContent` method when set.
`ripple` | `MDCRipple` | Ripple instance attached to outlined select variant, or `null` for all other variants.

### Events

Event Name | Data | Description
--- | --- | ---
`MDCSelect:change` | `{value: string, index: number}` | Used to indicate when an element has been selected. This event also includes the value of the item and the index.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Select for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCSelectAdapter`

| Method Signature | Description |
| --- | --- |
| `addClass(className: string) => void` | Adds a class to the select anchor element. |
| `removeClass(className: string) => void` | Removes a class from the select anchor element. |
| `hasClass(className: string) => boolean` | Returns true if the select anchor element has the className in its classList. |
| `activateBottomLine() => void` | Activates the bottom line component. |
| `deactivateBottomLine() => void` | Deactivates the bottom line component. |
| `getValue() => string` | Returns the value selected `option` on the `select` element and the `data-value` of the selected list item on the enhanced select. |
| `floatLabel(value: boolean) => void` | Floats or defloats label. |
| `getLabelWidth() => number` | Returns the offsetWidth of the label element. |
| `hasOutline() => boolean` | Returns true if the `select` has the notched outline element. |
| `notchOutline(labelWidth: number) => void` | Switches the notched outline element to its "notched state." |
| `closeOutline() => void` | Switches the notched outline element to its closed state. |
| `openMenu() => void` | Causes the menu element in the enhanced select to open. |
| `closeMenu() => void` | Causes the menu element in the enhanced select to close. |
| `setValue(value: string) => void` | Sets the value of the select or text content of the selected-text element. |
| `isMenuOpen() => boolean` | Returns true if the menu is currently opened in the enhanced select. |
| `setSelectedIndex(index: number) => void` | Selects the option or list item at the specified index. |
| `getSelectedMenuItem() => Element|null` | Returns the currently selected menu element, if it exists. |
| `getMenuItems() => Element[]` | Returns the menu item elements. |
| `setDisabled(isDisabled: boolean) => void` | Enables or disables the select. |
| `setRippleCenter(normalizedX: number) => void` | Sets the line ripple center to the provided normalizedX value. |
| `notifyChange(value: string) => void` | Emits the `MDCSelect:change` event when an element is selected. |
| `checkValidity() => boolean` | Returns whether the component is currently valid, using the select's `checkValidity`. |
| `setValid(isValid: boolean) => void` | Adds or removes invalid styles. |

### `MDCSelectFoundation`

| Method Signature | Description |
| --- | --- |
| `notchOutline(openNotch: boolean) => void` | Opens/closes the notched outline. |
| `setDisabled(isDisabled: boolean) => void` | Updates appearance based on disabled state. This must be called whenever the `disabled` state changes. |
| `handleFocus() => void` | Handles a focus event on the `select` element. |
| `handleBlur() => void` | Handles a blur event on the `select` element. |
| `handleClick(normalizedX: number) => void` | Sets the line ripple center to the normalizedX for the line ripple. |
| `handleMenuOpened() => void` | Handles menu or menu surface opened event.
| `handleMenuClosed() => void` | Handles menu or menu surface closed event.
| `handleChange() => void` | Handles a change to the `select` element's value. This must be called both for `change` events and programmatic changes requested via the component API. |
| `handleKeydown(event: KeyboardEvent) => void` | Handles opening the menu (enhanced select) when the `mdc-select__selected-text` element is focused and the user presses the `Enter` or `Space` key. |
| `getSelectedIndex() => number` | Returns the index of the currently selected menu item. |
| `setSelectedIndex(index: number) => void` | Handles setting the `mdc-select__selected-text` element and closing the menu (enhanced select only). Also causes the label to float and outline to notch if needed. |
| `setValue(value: string) => void` | Handles setting the value through the adapter and causes the label to float and outline to notch if needed. |
| `getValue() => string` | Handles getting the value through the adapter. |
| `setValid(isValid: boolean) => void` | Sets the valid state through the adapter. |
| `isValid() => boolean` | Gets the valid state through the adapter's `checkValidity` API. |
| `layout() => void` | Handles determining if the notched outline should be notched. |
| `setLeadingIconAriaLabel(label: string) => void` | Sets the aria label of the leading icon. |
| `setLeadingIconContent(content: string) => void` | Sets the text content of the leading icon. |
| `setHelperTextContent(content: string) => void` | Sets the content of the helper text. |

`MDCSelectFoundation` supports multiple optional sub-elements: helper text and icon. The foundations of these sub-elements must be passed in as constructor arguments to `MDCSelectFoundation`.
