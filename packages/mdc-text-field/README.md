<!--docs:
title: "Text Fields"
layout: detail
section: components
iconId: text_field
path: /catalog/input-controls/text-fields/
-->

# Text Fields

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/text-field.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/textfields.png" width="240" alt="Text fields screenshot">
  </a>
</div>-->

The MDC Text Field component provides a textual input field adhering to the [Material Design Specification](https://material.io/guidelines/components/text-fields.html).
It is fully accessible, ships with RTL support, and includes a gracefully-degraded version that does
not require any javascript.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/text-fields.html">Material Design guidelines: Text Fields</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/text-field.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install --save @material/text-field
```

## Usage

### Single-line - with Javascript

```html
<div class="mdc-text-field">
  <input type="text" id="my-text-field" class="mdc-text-field__input">
  <label class="mdc-text-field__label" for="my-text-field">Hint text</label>
</div>
```

It's also possible to wrap an input within a `<label>` to avoid dynamic id generation:

```html
<label class="mdc-text-field">
  <input type="text" class="mdc-text-field__input">
  <span class="mdc-text-field__label">Hint Text</span>
</label>
```

> _NOTE_: Only place an `mdc-text-field__label` inside of a text field _if you plan on using
> Javascript_. Otherwise, the label must go outside of the text-field, as shown below.

### Single-line - Gracefully degraded

```html
<label for="text-field-no-js">Text field with no JS: </label>
<div class="mdc-text-field">
  <input type="text" id="text-field-no-js" class="mdc-text-field__input" placeholder="Hint text">
</div>
```

### Disabled Text Fields

```html
<div class="mdc-text-field mdc-text-field--disabled">
  <input type="text" id="disabled-text-field" class="mdc-text-field__input" disabled>
  <label class="mdc-text-field__label" for="disabled-text-field">Disabled text field</label>
</div>
```

### Pre-filled text fields

When dealing with JS-driven text fields that already have values, you'll want to ensure that you
render the text field label with the `mdc-text-field__label--float-above` modifier class. This will
ensure that the label moves out of the way of the text field's value and prevents a Flash Of
Un-styled Content (**FOUC**). You'll also want to add the `mdc-text-field--upgraded` modifier class
on the text-field root element. The JS component does for you automatically on initialization, but
since it won't be added until that JS runs, adding it manually will prevent an initial FOUC.

```html
<div class="mdc-text-field mdc-text-field--upgraded">
  <input type="text" id="pre-filled" class="mdc-text-field__input" value="Pre-filled value">
  <label class="mdc-text-field__label mdc-text-field__label--float-above" for="pre-filled">
    Label in correct place
  </label>
</div>
```

### Using help text

MDC Text Fields can include help text that is useful for providing supplemental
information to users, as well for validation messages (covered below).

```html
<div class="mdc-text-field">
  <input type="text" id="username" class="mdc-text-field__input" aria-controls="username-helptext">
  <label for="username" class="mdc-text-field__label">Username</label>
</div>
<p id="username-helptext" class="mdc-text-field-helptext" aria-hidden="true">
  This will be displayed on your public profile
</p>
```

Help text appears on input field focus and disappears on input field blur by default when using
the text-field JS component.

#### Persistent help text

If you'd like the help text to always be visible, add the
`mdc-text-field-helptext--persistent` modifier class to the element.

```html
<div class="mdc-text-field">
  <input type="email" id="email" class="mdc-text-field__input">
  <label for="email" class="mdc-text-field__label">Email address</label>
</div>
<p class="mdc-text-field-helptext mdc-text-field-helptext--persistent">
  We will <em>never</em> share your email address with third parties
</p>
```

#### Help text and accessibility

Note that in every example where the help text is dependent on the state of the input element, we
assign an id to the `mdc-text-field-helptext` element and set that id to the value of the
`aria-controls` attribute on the input element. We recommend doing this as well as it will help
indicate to assistive devices that the display of the help text is dependent on the interaction with
the input element.

When using our vanilla JS component, if it sees that the input element has an `aria-controls`
attribute, it will look for an element with the id specified and treat it as the text field's help
text element, taking care of adding/removing `aria-hidden` and other a11y attributes. This can also
be done programmatically, which is described below.

### Validation

MDC Text field provides validity styling by using the `:invalid` and `:required` attributes provided
by HTML5's form validation API.

```html
<div class="mdc-text-field">
  <input type="password" id="pw" class="mdc-text-field__input" required minlength=8>
  <label for="pw" class="mdc-text-field__label">Password</label>
</div>
```

By default an input's validity is checked via `checkValidity()` on blur, and the styles are updated
accordingly. Set the MDCTextField.valid variable to set the input's validity explicitly. MDC TextField
automatically appends an asterisk to the label text if the required attribute is set.

Help text can be used to provide additional validation messages. Use
`mdc-text-field-helptext--validation-msg` to provide styles for using the help text as a validation
message. This can be easily combined with `mdc-text-field-helptext--persistent` to provide a robust
UX for client-side form field validation.

```html
<div class="mdc-text-field">
  <input required minlength=8 type="password" class="mdc-text-field__input" id="pw"
         aria-controls="pw-validation-msg">
  <label for="pw" class="mdc-text-field__label">Choose password</label>
</div>
<p class="mdc-text-field-helptext
          mdc-text-field-helptext--persistent
          mdc-text-field-helptext--validation-msg"
   id="pw-validation-msg">
  Must be at least 8 characters long
</p>
```

### Multi-line - With Javascript

```html
<div class="mdc-text-field mdc-text-field--multiline">
  <textarea id="multi-line" class="mdc-text-field__input" rows="8" cols="40"></textarea>
  <label for="multi-line" class="mdc-text-field__label">Multi-line Label</label>
</div>
```

### Multi-line - Gracefully Degraded

```html
<label for="css-only-multiline">Multi-line label: </label>
<div class="mdc-text-field mdc-text-field--multiline">
  <textarea class="mdc-text-field__input"
            id="css-only-multiline"
            rows="8" cols="40"
            placeholder="Tell the world something about yourself!"></textarea>
</div>
```

### Full-width

```html
<div class="mdc-text-field mdc-text-field--fullwidth">
  <input class="mdc-text-field__input"
         type="text"
         placeholder="Full-Width Text field"
         aria-label="Full-Width Text field">
</div>
<div class="mdc-text-field mdc-text-field--multiline mdc-text-field--fullwidth">
  <textarea class="mdc-text-field__input"
            placeholder="Full-Width multiline text-field"
            rows="8" cols="40"
            aria-label="Full-Width multiline text-field"></textarea>
</div>
```

Note that **full-width text fields do not support floating labels**. Labels should not be
included as part of the DOM structure for full-width text fields.

### Text Field Boxes

```html
<div class="mdc-text-field mdc-text-field--box">
  <input type="text" id="tf-box" class="mdc-text-field__input">
  <label for="tf-box" class="mdc-text-field__label">Your Name</label>
  <div class="mdc-text-field__bottom-line"></div>
</div>
```

Note that Text field boxes support all of the same features as normal text-fields, including help
text, validation, and dense UI.

#### CSS-only text field boxes

```html
<label for="css-only-text-field-box">Your name:</label>
<div class="mdc-text-field mdc-text-field--box">
  <input type="text" class="mdc-text-field__input" id="css-only-text-field-box" placeholder="Name">
</div>
```

### Using the JS component

MDC Text field ships with Component / Foundation classes which are used to provide a full-fidelity
Material Design text field component.

#### Including in code

##### ES2015

```javascript
import {MDCTextField, MDCTextFieldFoundation} from '@material/text-field';
```

##### CommonJS

```javascript
const mdcTextField = require('mdc-text-field');
const MDCTextField = mdcTextField.MDCTextField;
const MDCTextFieldFoundation = mdcTextField.MDCTextFieldFoundation;
```

##### AMD

```javascript
require(['path/to/mdc-text-field'], mdcTextField => {
  const MDCTextField = mdcTextField.MDCTextField;
  const MDCTextFieldFoundation = mdcTextField.MDCTextFieldFoundation;
});
```

##### Global

```javascript
const MDCTextField = mdc.textField.MDCTextField;
const MDCTextFieldFoundation = mdc.textField.MDCTextFieldFoundation;
```

#### Automatic Instantiation

```javascript
mdc.textField.MDCTextField.attachTo(document.querySelector('.mdc-text-field'));
```

#### Manual Instantiation

```javascript
import {MDCTextField} from '@material/text-field';

const textfield = new MDCTextField(document.querySelector('.mdc-text-field'));
```

#### Controlling ripple instantiation

When `MDCTextField` is instantiated with a root element containing the `mdc-text-field--box` class,
it instantiates an `MDCRipple` instance on the element in order to facilitate the correct
interaction UX for text field boxes as outlined in the spec. The way this ripple is instantiated
can be controlled by passing a ripple factory argument to the constructor.

```js
const textfieldBoxEl = document.querySelector('.mdc-text-field--box');
const textfield = new MDCTextField(textfieldBoxEl, /* foundation */ undefined, (el) => {
  // do something with el...
  return new MDCRipple(el);
});
```

By default the ripple factory simply calls `new MDCRipple(el)` and returns the result.

#### MDCTextField API

Similar to regular DOM elements, the `MDCTextField` functionality is exposed through accessor
methods.

##### MDCTextField.helptextElement

HTMLLabelElement. This is a normal property (non-accessor) that holds a reference to the element
being used as the text field's "help text". It defaults to `null`. If the text field's input element
contains an `aria-controls` attribute on instantiation of the component, it will look for an element
with the corresponding id within the document and automatically assign it to this property.

##### MDCTextField.disabled

Boolean. Proxies to the foundation's `isDisabled/setDisabled` methods when retrieved/set
respectively.

##### MDCTextField.valid

Boolean setter. Proxies to the foundation's `setValid` method when set.

##### MDCTextField.ripple

`MDCRipple` instance. Set to the `MDCRipple` instance for the root element that `MDCTextField`
initializes when given an `mdc-text-field--box` root element. Otherwise, the field is set to `null`.

### Using the foundation class

Because MDC TextField is a feature-rich and relatively complex component, its adapter is a bit more
complicated.

| Method Signature | Description |
| --- | --- |
| addClass(className: string) => void | Adds a class to the root element |
| removeClass(className: string) => void | Removes a class from the root element |
| addClassToLabel(className: string) => void | Adds a class to the label element. We recommend you add a conditional check here, and in `removeClassFromLabel` for whether or not the label is present so that the JS component could be used with text fields that don't require a label, such as the full-width text field. |
| removeClassFromLabel(className: string) => void | Removes a class from the label element |
| addClassToHelptext(className: string) => void | Adds a class to the help text element. Note that in our code we check for whether or not we have a help text element and if we don't, we simply return. |
| removeClassFromHelptext(className: string) => void | Removes a class from the help text element. |
| helptextHasClass(className: string) => boolean | Returns whether or not the help text element contains the current class |
| setHelptextAttr(name: string, value: string) => void | Sets an attribute on the help text element |
| removeHelptextAttr(name: string) => void | Removes an attribute on the help text element |
| registerInputFocusHandler(handler: EventListener) => void | Registers an event listener on the native input element for a "focus" event |
| deregisterInputFocusHandler(handler: EventListener) => void | Un-registers an event listener on the native input element for a "focus" event |
| registerInputBlurHandler(handler: EventListener) => void | Registers an event listener on the native input element for a "blur" event |
| deregisterInputBlurHandler(handler: EventListener) => void | Un-registers an event listener on the native input element for a "blur" event |
| registerInputInputHandler(handler: EventListener) => void | Registers an event listener on the native input element for an "input" event |
| deregisterInputInputHandler(handler: EventListener) => void | Un-registers an event listener on the native input element for an "input" event |
| registerInputKeydownHandler(handler: EventListener) => void | Registers an event listener on the native input element for a "keydown" event |
| deregisterInputKeydownHandler(handler: EventListener) => void | Un-registers an event listener on the native input element for a "keydown" event |
| getNativeInput() => {value: string, disabled: boolean, badInput: boolean, checkValidity: () => boolean}? | Returns an object representing the native text input element, with a similar API shape. The object returned should include the `value`, `disabled` and `badInput` properties, as well as the `checkValidity()` function. We _never_ alter the value within our code, however we _do_ update the disabled property, so if you choose to duck-type the return value for this method in your implementation it's important to keep this in mind. Also note that this method can return null, which the foundation will handle gracefully. |

#### The full foundation API

##### MDCTextFieldFoundation.isDisabled() => boolean

Returns a boolean specifying whether or not the input is disabled.

##### MDCTextFieldFoundation.setDisabled(disabled: boolean)

Updates the input's disabled state.

### Theming

MDC TextField components use the configured theme's primary color for its underline and label text
when the input is focused.

MDC TextField components support dark themes.
