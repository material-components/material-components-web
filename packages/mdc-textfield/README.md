<!--docs:
title: "Text Field"
layout: detail
section: components
iconId: text_field
path: /catalog/input-controls/text-field/
-->

## Important - Default Style Deprecation Notice

The existing default text field style will be changed in an upcoming release. The Material spec indicates that
the default style will be the filled variant (currently referred to as the box variant). This will become the  
default style. Continuing to add the `mdc-text-field--box` class to the text field will
result in no change. 

# Text Field

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components.github.io/material-components-web-catalog/#/component/text-field">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/textfields.png" width="240" alt="Text fields screenshot">
  </a>
</div>-->

Text fields allow users to input, edit, and select text.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-text-fields">Material Design guidelines: Text Fields</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/text-field">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/textfield
```

## Basic Usage

### HTML Structure

```html
<div class="mdc-text-field">
  <input type="text" id="my-text-field" class="mdc-text-field__input">
  <label class="mdc-floating-label" for="my-text-field">Hint text</label>
  <div class="mdc-line-ripple"></div>
</div>
```

> NOTE: Text field supports `text`, `number`, and `password` input types (e.g., `<input type="password" class="mdc-text-field__input">`).
>
> Other input types (such as `date`) are not currently supported.

> NOTE: For more details, see [MDC Line Ripple](../mdc-line-ripple/README.md)
> and [MDC Floating Label](../mdc-floating-label/README.md).

### Styles

```scss
@import "@material/textfield/mdc-text-field";
```

### JavaScript Instantiation

```js
import {MDCTextField} from '@material/textfield';

const textField = new MDCTextField(document.querySelector('.mdc-text-field'));
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

## Variants

### Full Width

Full width text fields are useful for in-depth tasks or entering complex information.

```html
<div class="mdc-text-field mdc-text-field--fullwidth">
  <input class="mdc-text-field__input"
         type="text"
         placeholder="Full-Width Text Field"
         aria-label="Full-Width Text Field">
</div>
```

> _NOTE_: Do not use `mdc-text-field--box` or `mdc-text-field--outlined` to style a full width text field.

> _NOTE_: Do not use `mdc-floating-label` within `mdc-text-field--fullwidth`. Labels should not be
included as part of the DOM structure of a full width text field.

### Textarea

```html
<div class="mdc-text-field mdc-text-field--textarea">
  <textarea id="textarea" class="mdc-text-field__input" rows="8" cols="40"></textarea>
  <label for="textarea" class="mdc-floating-label">Textarea Label</label>
</div>
```

### Outlined

```html
<div class="mdc-text-field mdc-text-field--outlined">
  <input type="text" id="tf-outlined" class="mdc-text-field__input">
  <label for="tf-outlined" class="mdc-floating-label">Your Name</label>
  <div class="mdc-notched-outline">
    <svg>
      <path class="mdc-notched-outline__path"/>
    </svg>
  </div>
  <div class="mdc-notched-outline__idle"></div>
</div>
```

See [here](../mdc-notched-outline/) for more information on using the notched outline sub-component.

> _NOTE_: Do not use `mdc-line-ripple` inside of `mdc-text-field` _if you plan on using `mdc-text-field--outlined`_. Line Ripple should not be included as part of the DOM structure of an outlined text field.

### Disabled

To disable the text field, add the `disabled` attribute to the `<input>` element and add the `mdc-text-field--disabled` class to the `mdc-text-field` element.

```html
<div class="mdc-text-field mdc-text-field--disabled">
  <input type="text" id="disabled-text-field" class="mdc-text-field__input" disabled>
  <label class="mdc-floating-label" for="disabled-text-field">Disabled text field</label>
  <div class="mdc-line-ripple"></div>
</div>
```

### Text Field with Helper Text

The helper text provides supplemental information and/or validation messages to users. It appears on input field focus
and disappears on input field blur by default, or it can be persistent.
See [here](helper-text/) for more information on using helper text.

### Text Field with Leading and Trailing Icons

Leading and trailing icons can be added within the box or outlined variants of MDC Text Field as visual indicators as
well as interaction targets. See [here](icon/) for more information on using icons.


### HTML5 Validation

`MDCTextFieldFoundation` provides validity styling by using the `:invalid` and `:required` attributes provided
by HTML5's form validation API.

```html
<div class="mdc-text-field">
  <input type="password" id="pw" class="mdc-text-field__input" required minlength=8>
  <label for="pw" class="mdc-floating-label">Password</label>
  <div class="mdc-line-ripple"></div>
</div>
```

`MDCTextFieldFoundation` automatically appends an asterisk to the label text if the required attribute is set.

### Pre-filled

When dealing with JS-driven text fields that already have values, you'll want to ensure that you
render `mdc-floating-label` with the `mdc-floating-label--float-above` modifier class, and `mdc-text-field` with the `mdc-text-field--upgraded` modifier class. This will
ensure that the label moves out of the way of the text field's value and prevents a Flash Of
Un-styled Content (**FOUC**).

```html
<div class="mdc-text-field mdc-text-field--upgraded">
  <input type="text" id="pre-filled" class="mdc-text-field__input" value="Pre-filled value">
  <label class="mdc-floating-label mdc-floating-label--float-above" for="pre-filled">
    Label in correct place
  </label>
  <div class="mdc-line-ripple"></div>
</div>
```

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-text-field` | Mandatory.
`mdc-text-field--upgraded` | Indicates the text field is upgraded, using JavaScript.
`mdc-text-field--box` | Styles the text field as a box text field.
`mdc-text-field--outlined` | Styles the text field as an outlined text field.
`mdc-text-field--fullwidth` | Styles the text field as a full width text field.
`mdc-text-field--textarea` | Indicates the text field is a `<textarea>`.
`mdc-text-field--disabled` | Styles the text field as a disabled text field.
`mdc-text-field--dense` | Styles the text field as a dense text field.
`mdc-text-field--with-leading-icon` | Styles the text field as a text field with a leading icon.
`mdc-text-field--with-trailing-icon` | Styles the text field as a text field with a trailing icon.
`mdc-text-field--focused` | Styles the text field as a text field in focus.

### Sass Mixins

To customize the colors of any part of the text-field, use the following mixins. We recommend you apply
these mixins within CSS selectors like `.foo-text-field:not(.mdc-text-field--focused)` to select your unfocused text fields,
and `.foo-text-field.mdc-text-field--focused` to select your focused text-fields. To change the invalid state of your text fields,
apply these mixins with CSS selectors such as `.foo-text-field.mdc-text-field--invalid`.

> _NOTE_: the `mdc-line-ripple-color` mixin should be applied from the not focused class `foo-text-field:not(.mdc-text-field--focused)`).

#### Mixins for Text Field Box

Mixin | Description
--- | ---
`mdc-text-field-box-corner-radius($radius)` | Customizes the border radius for the text field box variant.
`mdc-text-field-box-fill-color($color)` | Customizes the background color of the text field box.

#### Mixins for Outlined Text Field

Mixin | Description
--- | ---
`mdc-text-field-focused-outline-color($color)` | Customizes the outline border color when the text field is focused.
`mdc-text-field-hover-outline-color($color)` | Customizes the outline border color when the text field is hovered.
`mdc-text-field-outline-color($color)` | Customizes the border color of the outlined text field.
`mdc-text-field-outline-corner-radius($radius)` | Sets the border radius of of the outlined text field variant.

#### Mixins for Textarea

Mixin | Description
--- | ---
`mdc-text-field-textarea-corner-radius($radius)` | Customizes the border radius for a `<textarea>` variant.
`mdc-text-field-textarea-fill-color($color)` | Customizes the color of the background of the textarea.
`mdc-text-field-textarea-stroke-color($color)` | Customizes the color of the border of the textarea.


#### Mixins for Text Field Fullwidth

Mixin | Description
--- | ---
`mdc-text-field-fullwidth-bottom-line-color($color)` | Customizes the fullwidth text field variant bottom line color.

#### Other Mixins

Mixin | Description
--- | ---
`mdc-text-field-bottom-line-color($color)` | Customizes the text field bottom line color except the outlined and textarea variants.
`mdc-text-field-hover-bottom-line-color($color)` | Customizes the hover text field bottom line color except the outlined and textarea variants.
`mdc-text-field-ink-color($color)` | Customizes the text entered into the text field.
`mdc-text-field-label-color($color)` | Customizes the text color of the label.
`mdc-text-field-line-ripple-color($color)` | Customizes the color of the default line ripple of the text field.
`mdc-text-field-caret-color($color)` | Customizes the color of the cursor caret of the text field.

## `MDCTextField` Properties and Methods

Property | Value Type | Description
--- | --- | ---
`value` | String | Proxies to the foundation's `getValue`/`setValue` methods.
`disabled` | Boolean | Proxies to the foundation's `isDisabled`/`setDisabled` methods.
`valid` | Boolean | Proxies to the foundation's `isValid`/`setValid` methods.
`required` | Boolean | Proxies to the foundation's `isRequired`/`setRequired` methods.
`helperTextContent` | String | Proxies to the foundation's `setHelperTextContent` method when set.
`ripple` | `MDCRipple` | The `MDCRipple` instance for the root element that `MDCTextField` initializes; this only applies to Text Field Box, and is `null` for other variants.

Method Signature | Description
--- | ---
`layout() => void` | Adjusts the dimensions and positions for all sub-elements.

## Usage Within Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Text Field for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).


### `MDCTextFieldAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element.
`removeClass(className: string) => void` | Removes a class from the root element.
`hasClass(className: string) => boolean` | Returns true if the root element contains the given class name.
`registerTextFieldInteractionHandler(evtType: string, handler: EventListener) => void` | Registers an event handler on the root element for a given event.
`deregisterTextFieldInteractionHandler(evtType: string, handler: EventListener) => void` | Deregisters an event handler on the root element for a given event.
`registerInputInteractionHandler(evtType: string, handler: EventListener) => void` | Registers an event listener on the native input element for a given event.
`deregisterInputInteractionHandler(evtType: string, handler: EventListener) => void` | Deregisters an event listener on the native input element for a given event.
`registerValidationAttributeChangeHandler(handler: function(!Array<string>) => undefined) => !MutationObserver` | Registers a validation attribute change listener on the input element. Handler accepts list of attribute changes.
`deregisterValidationAttributeChangeHandler(!MutationObserver) => void` | Disconnects a validation attribute observer on the input element.
`getNativeInput() => {value: string, disabled: boolean, badInput: boolean, checkValidity: () => boolean}?` | Returns an object representing the native text input element, with a similar API shape.
`isFocused() => boolean` | Returns whether the input is focused.
`isRtl() => boolean` | Returns whether the direction of the root element is set to RTL.
`hasOutline() => boolean` | Returns whether there is an outline element.
`notchOutline(labelWidth: number, isRtl: boolean) => void` | Updates the notched outline path to open the notch and update the notch width for the label element.
`closeOutline() => void` | Closes the notch in the notched outline element.

#### `MDCTextFieldAdapter.getNativeInput()`

Returns an object representing the native text input element, with a similar API shape. The object returned should include the `value`, `disabled` and `badInput` properties, as well as the `checkValidity()` function. We _never_ alter the value within our code, however we _do_ update the disabled property, so if you choose to duck-type the return value for this method in your implementation it's important to keep this in mind. Also note that this method can return null, which the foundation will handle gracefully.

#### `MDCTextFieldAdapter.getIdleOutlineStyleValue(propertyName: string)`

Returns the idle outline element's computed style value of the given css property `propertyName`. The vanilla implementation achieves this via `getComputedStyle(...).getPropertyValue(propertyName)`.

### `MDCTextFieldFoundation`

Method Signature | Description
--- | ---
`getValue() => string` | Returns the input's value.
`setValue(value: string)` | Sets the input's value.
`isValid() => boolean` | If a custom validity is set, returns that value. Otherwise, returns the result of native validity checks.
`setValid(isValid: boolean)` | Sets custom validity. Once set, native validity checking is ignored.
`isDisabled() => boolean` | Returns whether or not the input is disabled.
`setDisabled(disabled: boolean) => void` | Updates the input's disabled state.
`isRequired() => boolean` | Returns whether the input is required.
`setRequired(isRequired: boolean)` | Sets whether the input is required.
`handleTextFieldInteraction(evt: Event) => void` | Handles click and keydown events originating from inside the Text Field component.
`handleValidationAttributeChange(attributesList: !Array<string>) => void` | Handles validation attribute changes.
`activateFocus() => void` | Activates the focus state of the Text Field. Normally called in response to the input focus event.
`deactivateFocus() => void` | Deactivates the focus state of the Text Field. Normally called in response to the input blur event.
`setHelperTextContent(content: string) => void` | Sets the content of the helper text.
`setIconAriaLabel(label: string) => void` | Sets the aria label of the icon.
`setIconContent(content: string) => void` | Sets the text content of the icon.
`notchOutline(openNotch: boolean) => void` | Opens/closes the notched outline.

`MDCTextFieldFoundation` supports multiple optional sub-elements: helper text and icon. The foundations of these sub-elements must be passed in as constructor arguments to `MDCTextFieldFoundation`.
