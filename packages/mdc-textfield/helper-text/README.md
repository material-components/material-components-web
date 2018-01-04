<!--docs:
title: "Text Field Helper Text"
layout: detail
section: components
excerpt: "The helper text provides supplemental information and/or validation messages to users"
iconId: text_field
path: /catalog/input-controls/text-fields/helper-text/
-->

# Text Field Helper Text

The helper text provides supplemental information and/or validation messages to users. It appears on input field focus and disappears on input field blur by default, or it can be persistent.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/text-fields.html#text-fields-layout">Material Design guidelines: Text Fields Layout</a>
  </li>
</ul>


## Usage

### Using helper text

MDC Text Fields can include helper text that is useful for providing supplemental information to users.

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

### Validation

Helper text can be used to provide validation messages in addition to the validity styling provided by
MDC TextField. Use `mdc-text-field-helper-text--validation-msg` to provide styles for using the helper
text as a validation message. This can be combined with `mdc-text-field-helper-text--persistent` to
provide a robust UX for client-side form field validation.

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
removeAttr(attr: string) => void | Removes an attribute on the helper text element
setContent(attr: string) => void | Sets the text content for the helper text element

#### The full foundation API

##### MDCTextFieldHelperTextFoundation.setContent()

Sets the content of the helper text.

##### MDCTextFieldHelperTextFoundation.showToScreenReader()

Makes the helper text visible to the screen reader.

##### MDCTextFieldHelperTextFoundation.setValidity(inputIsValid)

Sets the validity of the helper text based on the input validity.
