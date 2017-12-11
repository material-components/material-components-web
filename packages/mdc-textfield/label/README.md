<!--docs:
title: "Text Field Label"
layout: detail
section: components
excerpt: "The label is a text caption or description for the text field."
iconId: text_field
path: /catalog/input-controls/text-fields/label/
-->

# Text Field Label

The label is a text caption or description for the text field.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/text-fields.html#text-fields-layout">Material Design guidelines: Text Fields Layout</a>
  </li>
</ul>


## Usage

#### MDCTextFieldLabel API

##### MDCTextFieldLabel.foundation

MDCTextFieldLabelFoundation. This allows the parent MDCTextField component to access the public methods on the MDCTextFieldLabelFoundation class.

### Using the foundation class

Method Signature | Description
--- | ---
addClass(className: string) => void | Adds a class to the label element
removeClass(className: string) => void | Removes a class from the label element

#### The full foundation API

##### MDCTextFieldLabelFoundation.floatAbove()

Makes the label float above the text field.

##### MDCTextFieldLabelFoundation.deactivateFocus(shouldRemoveLabelFloat: boolean)

Deactivates the label's focus state. `shouldRemoveLabelFloat` indicates whether to also reset the label's position and size.

##### MDCTextFieldLabelFoundation.setValidity(isValid: boolean)

Updates the label's valid state based on the supplied validity.
