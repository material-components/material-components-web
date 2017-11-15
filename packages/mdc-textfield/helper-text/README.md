<!--docs:
title: "Text Field Helper Text"
layout: detail
section: components
excerpt: "The helper text provides supplemental information and/or validation messages to users"
iconId: text_field
path: /catalog/input-controls/text-fields/helper-text/
-->

# Text Field Helper Text

The helper text provides supplemental information and/or validation messages to users. It appears and disappears on input field focus and blur respectively by default when using the TextField JS component. If you’d like the helper text to always be visible, add the `mdc-text-field-helptext--persistent` modifier class to the element.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/text-fields.html#text-fields-layout">Material Design guidelines: Text Fields Layout</a>
  </li>
</ul>


## Usage

### Using helper text

MDC Text Fields can include helper text that is useful for providing supplemental
information to users, as well for validation messages (covered below).

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

Helper text appears on input field focus and disappears on input field blur by default when using
the Text Field JS component.

#### Persistent helper text

If you'd like the helper text to always be visible, add the `mdc-text-field-helper-text--persistent` modifier class to the element.

```html
<div class="mdc-text-field">
  <input type="email" id="email" class="mdc-text-field__input">
  <label for="email" class="mdc-text-field__label">Email address</label>
  <div class="mdc-text-field__bottom-line"></div>
</div>
<p class="mdc-text-field-helper-text mdc-text-field-helper-text--persistent">
  We will <em>never</em> share your email address with third parties
</p>
```

#### Helper text and accessibility

Note that in every example where the helper text is dependent on the state of the input element, we
assign an id to the `mdc-text-field-helper-text` element and set that id to the value of the
`aria-controls` attribute on the input element. We recommend doing this as well as it will help
indicate to assistive devices that the display of the helper text is dependent on the interaction with
the input element.

When using our vanilla JS component, if it sees that the input element has an `aria-controls`
attribute, it will look for an element with the id specified and treat it as the text field's help
text element, taking care of adding/removing `aria-hidden` and other a11y attributes. This can also
be done programmatically, which is described below.

### Validation

MDC TextField provides validity styling by using the `:invalid` and `:required` attributes provided
by HTML5's form validation API.

```html
<div class="mdc-text-field">
  <input type="password" id="pw" class="mdc-text-field__input" required minlength=8>
  <label for="pw" class="mdc-text-field__label">Password</label>
  <div class="mdc-text-field__bottom-line"></div>
</div>
```

By default an input's validity is checked via `checkValidity()` on blur, and the styles are updated
accordingly. Set the MDCTextField.valid variable to set the input's validity explicitly. MDC TextField
automatically appends an asterisk to the label text if the required attribute is set.

Helper text can be used to provide additional validation messages. Use
`mdc-text-field-helper-text--validation-msg` to provide styles for using the helper text as a validation
message. This can be easily combined with `mdc-text-field-helper-text--persistent` to provide a robust
UX for client-side form field validation.

```html
<div class="mdc-text-field">
  <input required minlength=8 type="password" class="mdc-text-field__input" id="pw"
         aria-controls="pw-validation-msg">
  <label for="pw" class="mdc-text-field__label">Choose password</label>
  <div class="mdc-text-field__bottom-line"></div>
</div>
<p class="mdc-text-field-helper-text
          mdc-text-field-helper-text--persistent
          mdc-text-field-helper-text--validation-msg"
   id="pw-validation-msg">
  Must be at least 8 characters long
</p>
```

#### MDCTextFieldHelperText API

##### MDCTextFieldHelperText.foundation

MDCTextFieldHelperTextFoundation. This allows the parent MDCTextField component to access the public methods on the MDCTextFieldHelperTextFoundation class.

### Using the foundation class

Method Signature | Description
--- | ---
addClass(className: string) => void | Adds a class to the helper text element
removeClass(className: string) => void | Removes a class from the helper text element
hasClass(className: string) => boolean | Returns true if classname exists for the helper text element
setAttr(attr: string, value: string) => void | Sets an attribute with a given value on the helper text element
removeAttr(attr: string) => void | Removes an attribute on the helper text element |

#### The full foundation API

##### MDCTextFieldHelperTextFoundation.show()

Makes the helper text visible to screen readers.

##### MDCTextFieldHelperTextFoundation.update()

Updates the state of the helper text based on validity.
