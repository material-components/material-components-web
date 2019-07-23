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

MDC Select provides Material Design single-option select menus. It supports using the browser's native `<select>`
element, or a MDC Menu. It is fully accessible, and fully RTL-aware.

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

This section documents how to use a MDC Select with a native `<select>` element. For information on using
MDC Select with a MDC Menu, see the [Variants](#variants) section below.

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

### Styles

For the native select, you can simply include the `mdc-select` Sass file.

```scss
@import "@material/select/mdc-select";
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

### Enhanced Select

The enhanced select uses an [`MDCMenu`](../mdc-menu) component instance to contain the list of options, but uses the
`data-value` attribute instead of `value` to represent the options' values.

> Note: The `data-value` attribute _must_ be present on each option.

The enhanced select requires that you set the `width` of the root element (containing the
`mdc-select` class) as well as setting the width of the `mdc-select__menu` element to match. This is best done
through the use of another class (e.g. `demo-width-class` in the example HTML and CSS below).

If you are using the enhanced select within an HTML form, you can include a hidden `<input>` element under the root
`mdc-select` element, and it will be synchronized when the value is updated via user interaction or programmatically.

```html
<div class="mdc-select demo-width-class">
  <input type="hidden" name="enhanced-select">
  <i class="mdc-select__dropdown-icon"></i>
  <div class="mdc-select__selected-text"></div>
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
  <span class="mdc-floating-label">Pick a Food Group</span>
  <div class="mdc-line-ripple"></div>
</div>
```

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

#### Usability Notes

The enhanced select provides a look and feel more consistent with the rest of Material Design, but there are some
trade-offs to consider when choosing it over the native `<select>` element.

* **Keyboard type-ahead:** Native selects typically benefit from OS-implemented keyboard type-ahead support
  (i.e. they will automatically select an item starting with the letters typed). This is not present in the enhanced select.
* **Mobile UI:** Mobile OSes implement native selects as a modal dialog or bottom sheet. The enhanced select always uses
  an MDC Menu, which may not provide an optimal experience for small screens.

#### Accessibility (a11y)

In order to have an accessible component for users, it's recommended that you follow the WAI-ARIA example for
[Collapsible Dropdown Listbox](https://www.w3.org/TR/wai-aria-practices/examples/listbox/listbox-collapsible.html).
The following is an example of the enhanced select component with all of the necessary aria attributes.

```html
<div class="mdc-select">
  <input type="hidden" name="enhanced-select">
  <i class="mdc-select__dropdown-icon"></i>
  <div id="demo-selected-text" class="mdc-select__selected-text" role="button" aria-haspopup="listbox" aria-labelledby="demo-label demo-selected-text">Vegetables</div>
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
  <span id="demo-label" class="mdc-floating-label mdc-floating-label--float-above">Pick a Food Group</span>
  <div class="mdc-line-ripple"></div>
</div>
```

### Outlined Select

The Select Outlined variant uses the `mdc-notched-outline` in place of the `mdc-line-ripple` element and adds the
`mdc-select--outlined` modifier class on the root element. All other elements for each type of select remain the
same.

```html
<div class="mdc-select mdc-select--outlined">
  <!-- Other elements from the native or enhanced select remain. -->
   <div class="mdc-notched-outline">
     <div class="mdc-notched-outline__leading"></div>
     <div class="mdc-notched-outline__notch">
       <label class="mdc-floating-label">Pick a Food Group</label>
     </div>
     <div class="mdc-notched-outline__trailing"></div>
   </div>
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

The enhanced select works in a similar way, but uses the `mdc-list-item--selected` class to set the selected item. The
enhanced select also needs the text from the selected element copied to the `mdc-select__selected-text` element.

```html
<div class="mdc-select demo-width-class">
  <input type="hidden" name="enhanced-select">
  <i class="mdc-select__dropdown-icon"></i>
  <div class="mdc-select__selected-text">Vegetables</div>
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
  <span class="mdc-floating-label mdc-floating-label--float-above">Pick a Food Group</span>
  <div class="mdc-line-ripple"></div>
</div>
```

#### Using the floating label as the placeholder

By default, `<select>` elements will select their first enabled option. In order to initially display a placeholder
instead, add an initial `<option>` element with the `selected` attribute set (and optionally `disabled`, if the field is
required), and with `value` set to `""`.

```html
<option value="" disabled selected></option>
```

For the enhanced select, simply leave the `mdc-select__selected-text` element empty and don't specify an element as
selected. If leaving the field empty should be a valid option, include an `mdc-list-item` element at the beginning of
the list with an empty `data-value` attribute.

```html
<li class="mdc-list-item mdc-list-item--selected" aria-selected="true" role="option" data-value=""></li>
```

#### Disabled select

To initially render a MDC Select in a disabled state, add the `mdc-select--disabled` class to the `mdc-select` element,
and add the `disabled` attribute to the `<select>` element.

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

For the enhanced select, add the `mdc-select--disabled` class to the `mdc-select` element, and add the `disabled`
attribute to the hidden `<input>` element if present.

```html
<div class="mdc-select mdc-select--disabled">
  <input type="hidden" name="enhanced-select" disabled>
  <i class="mdc-select__dropdown-icon"></i>
  <div class="mdc-select__selected-text"></div>
  <div class="mdc-select__menu mdc-menu mdc-menu-surface">
    ...
  </div>
  <span class="mdc-floating-label">Pick a Food Group</span>
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
  <input type="hidden" name="enhanced-select">
  <i class="mdc-select__dropdown-icon"></i>
  <div class="mdc-select__selected-text">Vegetables</div>
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
  <span class="mdc-floating-label mdc-floating-label--float-above">Pick a Food Group</span>
  <div class="mdc-line-ripple"></div>
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
| `mdc-select__native-control` | Mandatory for the native select. The native `<select>` element. |
| `mdc-select__selected-text` | Mandatory for the enhanced select. This class should be placed on a `div` within the `mdc-select` element. |
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

<!-- docgen-tsdoc-replacer:start __DO NOT EDIT, This section is automatically generated__ -->
### MDCSelect
#### Methods

Signature | Description
--- | ---
`emit(evtType: string, evtData: T, shouldBubble?: boolean) => void` | Fires a cross-browser-compatible custom event from the component root of the given type, with the given data.
`initialSyncWithDOM() => void` | Initializes the select's event listeners and internal state based on the environment's state.
`layout() => void` | Recomputes the outline SVG path for the outline element.
`listen(evtType: K, handler: SpecificEventListener<K>, options?: AddEventListenerOptions | boolean) => void` | Wrapper method to add an event listener to the component's root element. This is most useful when listening for custom events.
`unlisten(evtType: K, handler: SpecificEventListener<K>, options?: AddEventListenerOptions | boolean) => void` | Wrapper method to remove an event listener to the component's root element. This is most useful when unlistening for custom events.

#### Properties

Name | Type | Description
--- | --- | ---
required | `boolean` | Returns whether the select is required.
disabled | `boolean` | Whether or not the component is disabled. Setting this sets the disabled state on the component.
helperTextContent | `string` | Sets the text content of the helper text. Proxies to the foundation's `setHelperTextContent` method when set.
leadingIconAriaLabel | `string` | Proxies to the foundation's `setLeadingIconAriaLabel` method.
leadingIconContent | `string` | Sets the text content of the leading icon. Proxies to the foundation's `setLeadingIconContent` method.
ripple | `MDCRipple | null` | Ripple instance attached to outlined select variant, or `null` for all other variants.
selectedIndex | `number` | The index of the currently selected option. Set to -1 if no option is currently selected. Changing this property will update the select element.
valid | `boolean` | Checks if the select is in a valid state.
value | `string` | The `value`/`data-value` of the currently selected option.

#### Events
- `MDCSelect:change {value: string, index: number}` Used to indicate when an element has been selected. This event also includes the value of the item and the index.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create this component for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### MDCSelectAdapter
#### Methods

Signature | Description
--- | ---
`hasOutline() => boolean` | Returns true if outline element exists, false if it doesn't.
`activateBottomLine() => void` | Activates the bottom line, showing a focused state.
`checkValidity() => boolean` | Returns whether the component is currently valid, using the native select's `checkValidity` or equivalent logic for the enhanced select.
`closeMenu() => void` | Causes the menu element in the enhanced select to close.
`closeOutline() => void` | Closes notch in outline element, if the outline exists.
`deactivateBottomLine() => void` | Deactivates the bottom line.
`floatLabel(shouldFloat: boolean) => void` | Floats label determined based off of the shouldFloat argument.
`getLabelWidth() => number` | Returns width of label in pixels, if the label exists.
`getValue() => string` | Returns the value selected `option` on the `select` element and the `data-value` of the selected list item on the enhanced select.
`hasClass(className: string) => boolean` | Returns true if the root element contains the given class name.
`addClass(className: string) => void` | Adds class to root element.
`isMenuOpen() => boolean` | Returns true if the menu is currently opened in the enhanced select.
`notchOutline(labelWidth: number) => void` | Switches the notched outline element to its "notched state". Only implement if outline element exists.
`notifyChange(value: string) => void` | Emits the `MDCSelect:change` event when an element is selected.
`openMenu() => void` | Causes the menu element in the enhanced select to open.
`removeClass(className: string) => void` | Removes a class from the root element.
`setDisabled(isDisabled: boolean) => void` | Enables or disables the native or enhanced select.
`setRippleCenter(normalizedX: number) => void` | Sets the line ripple center to the provided normalizedX value.
`setSelectedIndex(index: number) => void` | Selects the option or list item at the specified index.
`setValid(isValid: boolean) => void` | Adds/Removes the invalid class.
`setValue(value: string) => void` | Sets the value of the select or text content of the selected-text element.

### MDCSelectFoundation
#### Methods

Signature | Description
--- | ---
`isValid() => boolean` | Gets the valid state through the adapter's `checkValidity` API.
`handleBlur() => void` | Handles a blur event on the `select` element.
`handleChange(didChange?: undefined | false | true) => void` | Handles a change to the `select` element's value. This must be called both for `change` events and programmatic changes requested via the component API.
`handleClick(normalizedX: number) => void` | Sets the line ripple center to the normalizedX for the line ripple.
`handleFocus() => void` | Handles a focus event on the `select` element.
`handleKeydown(event: KeyboardEvent) => void` | Handles opening the menu (enhanced select) when the `mdc-select__selected-text` element is focused and the user presses the `Enter` or `Space` key.
`handleMenuClosed() => void` | Handles menu or menu surface closed event.
`handleMenuOpened() => void` | Handles menu or menu surface opened event.
`getValue() => string` | Handles getting the value through the adapter.
`layout() => void` | Handles determining if the notched outline should be notched.
`notchOutline(openNotch: boolean) => void` | Opens/closes the notched outline.
`setDisabled(isDisabled: boolean) => void` | Updates appearance based on disabled state. This must be called whenever the `disabled` state changes.
`setHelperTextContent(content: string) => void` | Sets the content of the helper text.
`setLeadingIconAriaLabel(label: string) => void` | Sets the aria label of the leading icon.
`setLeadingIconContent(content: string) => void` | Sets the text content of the leading icon.
`setSelectedIndex(index: number) => void` | Handles setting the `mdc-select__selected-text` element and closing the menu (enhanced select only). Also causes the label to float and outline to notch if needed.
`setValid(isValid: boolean) => void` | Sets the valid state through the adapter.
`setValue(value: string) => void` | Handles setting the value through the adapter and causes the label to float and outline to notch if needed.


<!-- docgen-tsdoc-replacer:end -->

`MDCSelectFoundation` supports multiple optional sub-elements: helper text and icon. The foundations of these sub-elements must be passed in as constructor arguments to `MDCSelectFoundation`.
