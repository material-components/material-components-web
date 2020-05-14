<!--docs:
title: "Select helper text"
layout: detail
section: components
excerpt: "The helper text provides supplemental information and/or validation messages to users"
iconId: menu
path: /catalog/input-controls/select-menus/helper-text/
-->

# Select helper text

Helper text gives context about a select, such as how the selection will be used. It should be visible either persistently or only on invalid state.

## Basic usage

### HTML structure

```html
<p class="mdc-select-helper-text" aria-hidden="true">
```

> NOTE: Make sure there are no white-space characters before helper text content.
### Styles

```scss
@use "@material/select/helper-text/mdc-select-helper-text";
```

### JavaScript instantiation

```js
import {MDCSelectHelperText} from '@material/select/helper-text';
const helperText = new MDCSelectHelperText(document.querySelector('.mdc-select-helper-text'));
```

#### Accessibility

Note that in every example where the helper text is dependent on the state of the `select` element, we
assign an id to the `mdc-select-helper-text` element and set that id to the value of the
`aria-controls` and `aria-describedby` attributes on the element with the `mdc-select__selected-text` class.
We recommend doing this as well as it will help indicate to assistive devices that
the display of the helper text is dependent on the interaction with the MDCSelect component.

```html
<div class="mdc-select">
  <div class="mdc-select__anchor"
       role="button"
       aria-haspopup="listbox"
       aria-labelledby="demo-label demo-selected-text"
       aria-controls="my-helper-text"
       aria-describedby="my-helper-text">
    <span class="mdc-select__ripple"></span>
    <input type="text" disabled readonly id="demo-selected-text" class="mdc-select__selected-text" value="Vegetables">
    <i class="mdc-select__dropdown-icon"></i>
    <span id="demo-label" class="mdc-floating-label mdc-floating-label--float-above">Pick a Food Group</span>
    <span class="mdc-line-ripple"></span>
  </div>

  <div class="mdc-select__menu mdc-menu mdc-menu-surface" role="listbox">
    <ul class="mdc-list">
      <li class="mdc-list-item mdc-list-item--selected" aria-selected="true" data-value="" role="option"></li>
      <li class="mdc-list-item" data-value="grains" role="option">
        <span class="mdc-list-item__text">
          Bread, Cereal, Rice, and Pasta
        </span>
      </li>
      <li class="mdc-list-item mdc-list-item--disabled" data-value="vegetables" aria-disabled="true" role="option">
        <span class="mdc-list-item__text">
          Vegetables
        </span>
      </li>
      <li class="mdc-list-item" data-value="fruit" role="option">
        <span class="mdc-list-item__text">
          Fruit
        </span>
      </li>
    </ul>
  </div>
</div>
<p id="my-helper-text" class="mdc-select-helper-text">Helper text</p>
```

When using our JS component, if the browser sees that the input element has an `aria-controls`
attribute, it will look for an element with the id specified and treat it as the Select's helper
text element, taking care of adding/removing `aria-hidden` and other accessibility attributes. Adding
and removing classes and attributes to the helper text element can also be done using the
MDCSelectHelperText API, which is described below.

## API

### CSS classes

CSS Class | Description
--- | ---
`mdc-select-helper-text` | Mandatory. By default non-validation helper text is always visible.
`mdc-select-helper-text--validation-msg` | Indicates the helper text is a validation message. By default validation message is hidden unless the select is invalid.
`mdc-select-helper-text--validation-msg-persistent` | When the helper text is serving as a validation message, make it permanently visible regardless of the select's validity.

### Sass mixins

Mixin | Description
--- | ---
`helper-text-color($color)` | Customizes the color of the helper text following a select.
`disabled-helper-text-color($color)` | Customizes the color of the helper text following a select when disabled.
`helper-text-validation-color($color)` | Customizes the color of the helper text validation message when the select is invalid.
`hover-helper-text-validation-color($color)` | Customizes the color of the helper text validation message when the select is invalid and hovered.

## `MDCSelectHelperText` properties and methods

Property | Value Type | Description
--- | --- | ---
`foundation` | `MDCSelectHelperTextFoundation` | Returns the helper text's foundation. This allows the parent `MDCSelect` component to access the public methods on the `MDCSelectHelperTextFoundation` class.

## Usage within frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Helper Text for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../../docs/integrating-into-frameworks.md).

### `MDCSelectHelperTextAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the helper text element.
`removeClass(className: string) => void` | Removes a class from the helper text element.
`hasClass(className: string) => boolean` | Returns true if classname exists for the helper text element.
`setAttr(attr: string, value: string) => void` | Sets an attribute with a given value on the helper text element.
`removeAttr(attr: string) => void` | Removes an attribute on the helper text element.
`setContent(attr: string) => void` | Sets the text content for the helper text element.

### `MDCSelectHelperTextFoundation`

Method Signature | Description
--- | ---
`setContent(content: string) => void` | Sets the content of the helper text.
`setValidation(isValidation: boolean) => void` | Sets the helper text as a validation message. By default, validation messages are hidden when the select is valid and visible when the select is invalid.
`setValidationMsgPersistent(isPersistent: boolean) => void` | This keeps the validation message visible even if the select is valid, though it will be displayed in the normal (grey) color.
`showToScreenReader() => void` | Makes the helper text visible to the screen reader.
`setValidity(inputIsValid: boolean) => void` | Sets the validity of the helper text based on the input validity.
