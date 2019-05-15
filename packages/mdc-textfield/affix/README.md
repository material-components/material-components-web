<!--docs:
title: "Text Field Prefix/Suffix"
layout: detail
section: components
excerpt: "Prefix/Suffix displays a prefix or a suffix in a text field"
iconId: text_field
path: /catalog/input-controls/text-field/affix/
-->

# Text Field Prefix/Suffix

Prefix/Suffix is used to display static text within a text field. Examples include currency symbols, or units of measure.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-text-fields">Material Design guidelines: Text Fields</a>
  </li>
</ul>

## Basic Usage

### HTML Structure

```html
<div class="mdc-text-field">
  <span class="mdc-text-field__prefix">$&nbsp;</div>
  <input type="text" id="my-text-field" class="mdc-text-field__input">
  <label class="mdc-floating-label" for="my-text-field">Hint text</label>
  <div class="mdc-line-ripple"></div>
</div>
```

### Styles

```scss
@import "@material/textfield/affix/mdc-text-field-affix";
```

### JavaScript Instantiation

```js
import {MDCTextFieldAffix} from '@material/textfield/affix';

const prefix = new MDCTextFieldAffix(document.querySelector('.mdc-text-field__prefix'));
const suffix = new MDCTextFieldAffix(document.querySelector('.mdc-text-field__suffix'));
```

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-text-field__prefix` | Mandatory for prefixes.
`mdc-text-field__suffix` | Mandatory for suffixes.

## `MDCTextFieldAffix` Properties and Methods

Property | Value Type | Description
--- | --- | ---
`foundation` | `MDCTextFieldAffixFoundation` | Returns the prefix/suffix's foundation. This allows the parent `MDCTextField` component to access the public methods on the `MDCTextFieldAffixFoundation` class.

## Usage Within Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Character Counter for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../../docs/integrating-into-frameworks.md).

### `MDCTextFieldCAffixAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the affix element.
`removeClass(className: string) => void` | Removes a class from the affix element.
`getWidth() => number` | Returns the width of the prefix/sufix.
`hasClass(className: string) => boolean` | Returns whether or not the affix element contains the given class.
`isRtl() => boolean` | Returns whether or not the document is RTL.

### `MDCTextFieldAffixFoundation`

Method Signature | Description
--- | ---
`getInputPadding() => {property: string, value: string}` | Returns the padding property and value to apply to the input.
`setVisible(visible: boolean) => void` | Sets visiblilty of the affix element.
