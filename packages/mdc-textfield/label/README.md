<!--docs:
title: "Text Field Label"
layout: detail
section: components
excerpt: "The label is a text caption or description for the text field."
iconId: text_field
path: /catalog/input-control/text-field/label/
-->

# Text Field Label

Text field labels display the type of input a field requires. Every text field should have a label. Labels are aligned with the input line and always visible. They can be resting (when a field is inactive and empty) or floating. The label is a text caption or description for the text field.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/text-fields.html#text-fields-layout">Material Design guidelines: Text Fields Layout</a>
  </li>
</ul>

## Usage

### HTML Structure

```html
<label class="mdc-text-field__label" for="my-text-field-id">Hint text</label>
```

### Usage within `mdc-text-field`

```html
<div class="mdc-text-field">
  <input type="text" id="my-text-field-id" class="mdc-text-field__input">
  <label class="mdc-text-field__label" for="my-text-field-id">Hint text</label>
  <div class="mdc-text-field__bottom-line"></div>
</div>
```

#### Avoid Dynamic ID Generation

It's also possible to wrap `mdc-text-field__input` within a `<label>` to avoid dynamic id generation:

```html
<label class="mdc-text-field">
  <input type="text" class="mdc-text-field__input">
  <span class="mdc-text-field__label">Hint Text</span>
  <div class="mdc-text-field__bottom-line"></div>
</label>
```

> _NOTE_: Only place an `mdc-text-field__label` inside of a text field _if you plan on using
> Javascript_. Otherwise, the label must go outside of the text-field, as shown below.

#### Single Line, CSS Only

```html
<label for="text-field-no-js">TextField with no JS: </label>
<div class="mdc-text-field">
  <input type="text" id="text-field-no-js" class="mdc-text-field__input" placeholder="Hint text">
  <div class="mdc-text-field__bottom-line"></div>
</div>
```

### CSS Classes

CSS Class | Description
--- | ---
`mdc-text-field__label` | Mandatory
`mdc-text-field__label--float-above` | Indicates the label is floating above the text field
`mdc-text-field__label--shake` | Shakes the label

### `MDCTextFieldLabel`

##### `MDCTextFieldLabel.foundation`

This allows the parent `MDCTextField` component to access the public methods on the `MDCTextFieldLabelFoundation` class.

### `MDCTextFieldLabelAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the label element
`removeClass(className: string) => void` | Removes a class from the label element


### `MDCTextFieldLabelFoundation`

Method Signature | Description
--- | ---
`floatAbove() => void` | Makes the label float above the text field
`deactivateFocus(shouldRemoveLabelFloat: boolean) => void` | Deactivates the label's focus state. `shouldRemoveLabelFloat` indicates whether to also reset the label's position and size.
`setValidity(isValid: boolean)` | Updates the label's valid state based on the supplied validity
