<!--docs:
title: "Text field helper text"
layout: detail
section: components
excerpt: "The helper text provides supplemental information and/or validation messages to users"
iconId: text_field
path: /catalog/input-controls/text-field/helper-text/
-->

# Text field helper text

Helper text gives context about a field’s input, such as how the input will be used. It should be visible either persistently or only on focus.

## Basic usage

### HTML structure

```html
<div class="mdc-text-field-helper-text" aria-hidden="true">helper text</div>
```

> NOTE: Place this inside `.mdc-text-field-helper-line` element which is an immediate sibling of `.mdc-text-field`.

### Styles

```scss
@use "@material/textfield/helper-text";

@include helper-text.helper-text-core-styles;
```

### JavaScript instantiation

```js
import {MDCTextFieldHelperText} from '@material/textfield/helper-text';

const helperText = new MDCTextFieldHelperText(document.querySelector('.mdc-text-field-helper-text'));
```

#### Accessibility

Note that in every example where the helper text is dependent on the state of the input element, we
assign an id to the `mdc-text-field-helper-text` element and set that id to the value of the
`aria-controls` and `aria-describedby` attributes on the input element. We recommend doing this as well as it will help
indicate to assistive devices that the display of the helper text is dependent on the interaction with
the input element.

```html
<label class="mdc-text-field mdc-text-field--filled">
  <input class="mdc-text-field__input" type="text"
         aria-labelledby="my-label-id"
         aria-controls="username-helper-text"
         aria-describedby="username-helper-text">
  <span class="mdc-floating-label" id="my-label-id">Username</span>
  <div class="mdc-line-ripple"></div>
</label>
<div class="mdc-text-field-helper-line">
  <div id="username-helper-text" class="mdc-text-field-helper-text" aria-hidden="true">
    This will be displayed on your public profile
  </div>
</div>
```

## API

### CSS classes

CSS Class | Description
--- | ---
`mdc-text-field-helper-text` | Mandatory.
`mdc-text-field-helper-text--persistent` | Makes the helper text permanently visible.
`mdc-text-field-helper-text--validation-msg` | Indicates the helper text is a validation message.

### Sass mixins

Mixin | Description
--- | ---
`mdc-text-field-helper-text-color($color)` | Customizes the color of the helper text following an enabled text-field.
`mdc-text-field-disabled-helper-text-color($color)` | Customizes the color of the helper text following a disabled text-field.
`mdc-text-field-helper-text-validation-color($color)` | Customizes the color of the helper text when it's used as a validation message.

## `MDCTextFieldHelperText` properties and methods

Property | Value Type | Description
--- | --- | ---
`foundation` | `MDCTextFieldHelperTextFoundation` | Returns the helper text's foundation. This allows the parent `MDCTextField` component to access the public methods on the `MDCTextFieldHelperTextFoundation` class.

## Usage within frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Helper Text for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../../docs/integrating-into-frameworks.md).

### `MDCTextFieldHelperTextAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the helper text element.
`removeClass(className: string) => void` | Removes a class from the helper text element.
`hasClass(className: string) => boolean` | Returns true if classname exists for the helper text element.
`setAttr(attr: string, value: string) => void` | Sets an attribute with a given value on the helper text element.
`removeAttr(attr: string) => void` | Removes an attribute on the helper text element.
`setContent(attr: string) => void` | Sets the text content for the helper text element.

### `MDCTextFieldHelperTextFoundation`

Method Signature | Description
--- | ---
`setContent(content: string) => void` | Sets the content of the helper text.
`setPersistent(isPersistent: boolean) => void` | Sets the helper text as persistent.
`setValidation(isValidation: boolean) => void` | Sets the helper text as a validation message.
`showToScreenReader() => void` | Makes the helper text visible to the screen reader.
`setValidity(inputIsValid: boolean) => void` | Sets the validity of the helper text based on the input validity.
