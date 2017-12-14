<!--docs:
title: "Text Field"
layout: detail
section: components
iconId: text_field
path: /catalog/input-controls/text-field/
-->

# Text Field

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/text-field.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/text-fields.png" width="240" alt="Text fields screenshot">
  </a>
</div>-->

Text fields allow users to input, edit, and select text.

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
npm install --save @material/textfield
```

## Usage

### HTML Structure

```html
<div class="mdc-text-field">
  <input type="text" id="my-text-field" class="mdc-text-field__input">
  <label class="mdc-text-field__label" for="my-text-field">Hint text</label>
  <div class="mdc-text-field__bottom-line"></div>
</div>
```

#### HTML5 Validation

`MDCTextFieldFoundation` provides validity styling by using the `:invalid` and `:required` attributes provided
by HTML5's form validation API.

```html
<div class="mdc-text-field">
  <input type="password" id="pw" class="mdc-text-field__input" required minlength=8>
  <label for="pw" class="mdc-text-field__label">Password</label>
  <div class="mdc-text-field__bottom-line"></div>
</div>
```

`MDCTextFieldFoundation` automatically appends an asterisk to the label text if the required attribute is set.

#### Pre-filled

When dealing with JS-driven text fields that already have values, you'll want to ensure that you
render `mdc-text-field__label` with the `mdc-text-field__label--float-above` modifier class, and `mdc-text-field` with the `mdc-text-field--upgraded` modifier class. This will
ensure that the label moves out of the way of the text field's value and prevents a Flash Of
Un-styled Content (**FOUC**).

```html
<div class="mdc-text-field mdc-text-field--upgraded">
  <input type="text" id="pre-filled" class="mdc-text-field__input" value="Pre-filled value">
  <label class="mdc-text-field__label mdc-text-field__label--float-above" for="pre-filled">
    Label in correct place
  </label>
  <div class="mdc-text-field__bottom-line"></div>
</div>
```
> _NOTE_: Only place an `mdc-text-field__label` inside of `mdc-text-field` _if you plan on using
> JavaScript_. Otherwise, the label must go outside of `mdc-text-field`, as shown below.

#### CSS Only

```html
<label for="text-field-no-js">TextField with no JS: </label>
<div class="mdc-text-field">
  <input type="text" id="text-field-no-js" class="mdc-text-field__input" placeholder="Hint text">
  <div class="mdc-text-field__bottom-line"></div>
</div>
```

##### Box Variant

### Using Helper Text

The helper text provides supplemental information and/or validation messages to users. It appears on input field focus
and disappears on input field blur by default, or it can be persistent. 
See [here](helper-text/) for more information on using helper text.

### Leading and Trailing Icons

Leading and trailing icons can be added to MDC Text Fields as visual indicators as well as interaction targets.
See [here](icon/) for more information on using icons.

### Textarea

```html
<div class="mdc-text-field mdc-text-field--textarea">
  <textarea id="textarea" class="mdc-text-field__input" rows="8" cols="40"></textarea>
  <label for="textarea" class="mdc-text-field__label">Textarea Label</label>
</div>
```

> _NOTE_: Only use `mdc-text-field__label` within `mdc-text-field--textarea` _if you plan on using
> Javascript_. Otherwise, use the `placeholder` attribute, as shown below.

##### CSS Only

```html
<div class="mdc-text-field mdc-text-field--textarea">
  <textarea id="textarea-css-only"
    class="mdc-text-field__input"
    rows="8"
    cols="40"
    placeholder="Enter something about yourself"></textarea>
</div>
```

#### Disabled

```html
<div class="mdc-text-field mdc-text-field--disabled">
  <input type="text" id="disabled-text-field" class="mdc-text-field__input" disabled>
  <label class="mdc-text-field__label" for="disabled-text-field">Disabled text field</label>
  <div class="mdc-text-field__bottom-line"></div>
</div>
```

#### Helper Text

The helper text provides supplemental information and/or validation messages to users. It appears on input field focus
and disappears on input field blur by default, or it can be persistent. 
See [here](helper-text/) for more information on using helper text.

#### Leading and Trailing Icons

Leading and trailing icons can be added to MDC Text Fields as visual indicators as well as interaction targets.
See [here](icon/) for more information on using icons.

### CSS Classes

CSS Class | Description
--- | ---
`mdc-text-field` | Mandatory
`mdc-text-field__input` | Mandatory
`mdc-text-field--upgraded` | Indicates the text field is upgraded, normally by JavaScript
`mdc-text-field--box` | Styles the text field as a box text field
`mdc-text-field--fullwidth` | Styles the text field as a full width text field
`mdc-text-field--textarea` | Indicates the text field is a `<textarea>`
`mdc-text-field--disabled` | Styles the text field as a disabled text field
`mdc-text-field--dense` | Styles the text field as a dense text field
`mdc-text-field--with-leading-icon` | Styles the text field as a text field with a leading icon
`mdc-text-field--with-trailing-icon` | Styles the text field as a text field with a trailing icon
`mdc-text-field--focused` | Styles the text field as a text field in focus

### Sass Mixins

Mixin | Description
--- | ---
`mdc-text-field-box-corner-radius($radius)` | Customizes the border radius for a box text field
`mdc-text-field-textarea-corner-radius($radius)` | Customizes the border radius for a `<textarea>` text field

### `MDCTextField`

#### MDCTextField.disabled

Boolean. Proxies to the foundation's `isDisabled/setDisabled` methods when retrieved/set
respectively.

#### MDCTextField.valid

Boolean setter. Proxies to the foundation's `setValid` method when set.

#### MDCTextField.helperTextContent

String setter. Proxies to the foundation's `setHelperTextContent` method when set.

##### MDCTextField.ripple

`MDCRipple` instance. Set to the `MDCRipple` instance for the root element that `MDCTextField`
initializes when given an `mdc-text-field--box` root element. Otherwise, the field is set to `null`.

### Using the foundation class

Because MDC Text Field is a feature-rich and relatively complex component, its adapter is a bit more
complicated.

| Method Signature | Description |
| --- | --- |
| addClass(className: string) => void | Adds a class to the root element |
| removeClass(className: string) => void | Removes a class from the root element |
| registerTextFieldInteractionHandler(evtType: string, handler: EventListener) => void | Registers an event handler on the root element for a given event |
| deregisterTextFieldInteractionHandler(evtType: string, handler: EventListener) => void | Deregisters an event handler on the root element for a given event |
| registerInputInteractionHandler(evtType: string, handler: EventListener) => void | Registers an event listener on the native input element for a given event |
| deregisterInputInteractionHandler(evtType: string, handler: EventListener) => void | Deregisters an event listener on the native input element for a given event |
| registerBottomLineEventHandler(evtType: string, handler: EventListener) => void | Registers an event listener on the bottom line element for a given event |
| deregisterBottomLineEventHandler(evtType: string, handler: EventListener) => void | Deregisters an event listener on the bottom line element for a given event |
| getNativeInput() => {value: string, disabled: boolean, badInput: boolean, checkValidity: () => boolean}? | Returns an object representing the native text input element, with a similar API shape. The object returned should include the `value`, `disabled` and `badInput` properties, as well as the `checkValidity()` function. We _never_ alter the value within our code, however we _do_ update the disabled property, so if you choose to duck-type the return value for this method in your implementation it's important to keep this in mind. Also note that this method can return null, which the foundation will handle gracefully. |

MDC Text Field has multiple optional sub-elements: bottom line and helper text. The foundations of these sub-elements must be passed in as constructor arguments for the `MDCTextField` foundation. Since the `MDCTextField` component takes care of creating its foundation, we need to pass sub-element foundations through the `MDCTextField` component. This is typically done in the component's implementation of `getDefaultFoundation()`.

#### The full foundation API

##### MDCTextFieldFoundation.isDisabled() => boolean

Returns a boolean specifying whether or not the input is disabled.

##### MDCTextFieldFoundation.setDisabled(disabled: boolean)

Updates the input's disabled state.

##### MDCTextFieldFoundation.setValid(isValid: boolean)

Sets the validity state of the Text Field. Triggers custom validity checking.

##### MDCTextFieldFoundation.handleTextFieldInteraction(evt: Event)

Handles click and keydown events originating from inside the Text Field component.

##### MDCTextFieldFoundation.activateFocus()

Activates the focus state of the Text Field. Normally called in response to the input focus event.

##### MDCTextFieldFoundation.deactivateFocus()

Deactivates the focus state of the Text Field. Normally called in response to the input blur event.

##### MDCTextFieldFoundation.handleBottomLineAnimationEnd(evt: Event)

Handles the end of the bottom line animation, performing actions that must wait for animations to
finish. Expects a transition-end event.

##### MDCTextFieldFoundation.setHelperTextContent(content)

Sets the content of the helper text, if it exists.

### Theming

MDC Text Field components use the configured theme's primary color for its underline and label text
when the input is focused.

MDC Text Field components support dark themes.
