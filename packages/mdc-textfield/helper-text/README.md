<!--docs:
title: "Text Field Helper Text"
layout: detail
section: components
excerpt: "The helper text provides supplemental information and/or validation messages to users"
iconId: text_field
path: /catalog/input-controls/text-field/helper-text/
-->

# Text Field Helper Text

Helper text gives context about a field’s input, such as how the input will be used. It should be visible either persistently or only on focus.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/text-fields.html#text-fields-layout">Material Design guidelines: Text Fields Layout</a>
  </li>
</ul>

## Usage

### HTML Structure

```html
<p class="mdc-text-field-helper-text" aria-hidden="true">
```

### Usage within `mdc-text-field`

```html
<div class="mdc-text-field">
  <input type="text" id="username" class="mdc-text-field__input">
  <label for="username" class="mdc-text-field__label">Username</label>
  <div class="mdc-text-field__bottom-line"></div>
</div>
<p class="mdc-text-field-helper-text" aria-hidden="true">
  This will be displayed on your public profile
</p>
```

#### Accessibility

Note that in every example where the helper text is dependent on the state of the input element, we
assign an id to the `mdc-text-field-helper-text` element and set that id to the value of the
`aria-controls` attribute on the input element. We recommend doing this as well as it will help
indicate to assistive devices that the display of the helper text is dependent on the interaction with
the input element.

```html
<div class="mdc-text-field">
  <input type="text" id="username" class="mdc-text-field__input" aria-controls="username-helper-text">
  <label for="username" class="mdc-text-field__label">Username</label>
  <div class="mdc-text-field__bottom-line"></div>
</div>
<p id="username-helper-text" class="mdc-text-field-helper-text" aria-hidden="true">
  This will be displayed on your public profile
</p>
```

When using our vanilla JS component, if the browser sees that the input element has an `aria-controls`
attribute, it will look for an element with the id specified and treat it as the text field's helper
text element, taking care of adding/removing `aria-hidden` and other accessibility attributes. Adding
and removing classes and attributes to the helper text element can also be done using the
MDCTextFieldHelperText API, which is described below.

### CSS Classes

CSS Class | Description
--- | ---
`mdc-text-field-helper-text` | Mandatory
`mdc-text-field-helper-text--persistent` | Makes the helper text permanently visible
`mdc-text-field-helper-text--validation-msg` | Indicates the helper text is a validation message

### `MDCTextFieldHelperText`

##### `MDCTextFieldHelperText.foundation`

This allows the parent `MDCTextField` component to access the public methods on the `MDCTextFieldHelperTextFoundation` class.

### `MDCTextFieldHelperTextAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the helper text element
`removeClass(className: string) => void` | Removes a class from the helper text element
`hasClass(className: string) => boolean` | Returns true if classname exists for the helper text element
`setAttr(attr: string, value: string) => void` | Sets an attribute with a given value on the helper text element
`removeAttr(attr: string) => void` | Removes an attribute on the helper text element
`setContent(attr: string) => void` | Sets the text content for the helper text element

### `MDCTextFieldHelperTextFoundation`

Method Signature | Description
--- | ---
`setContent(content: string) => void` | Sets the content of the helper text
`showToScreenReader() => void` | Makes the helper text visible to the screen reader
`setValidity(inputIsValid: boolean) => void` | Sets the validity of the helper text based on the input validity
