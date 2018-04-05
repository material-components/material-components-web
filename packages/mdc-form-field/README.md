<!--docs:
title: "Form Fields"
layout: detail
section: components
path: /catalog/input-controls/form-fields/
-->

# Form Fields

MDC Form Field provides an `mdc-form-field` helper class for easily making theme-aware, RTL-aware
form field + label combos. It also provides an `MDCFormField` class for easily making input ripples
respond to label events.

## Installation

```
npm install @material/form-field
```

## CSS Usage

The `mdc-form-field` class can be used as a parent element, with any combination of adjacent `input` and `label` as
immediate children:

```html
<div class="mdc-form-field">
  <input type="checkbox" id="input">
  <label for="input">Input Label</label>
</div>
```

By default, this will position the label after the input. You can change this behavior using the
`align-end` modifier class.

```html
<div class="mdc-form-field mdc-form-field--align-end">
  <input type="checkbox" id="input">
  <label for="input">Input Label</label>
</div>
```

Now the label will be positioned before the checkbox.

### Usage with MDC Web Components

`mdc-form-field` works not just with `input` elements, but with _any_ immediate child element as long as its
successive sibling is a `label` element. This means it will work for MDC Web form controls such as Checkbox and Radio:

```html
<div class="mdc-form-field">
  <div class="mdc-checkbox">
    <input type="checkbox"
           id="my-checkbox"
           class="mdc-checkbox__native-control"/>
    <div class="mdc-checkbox__background">
      <svg class="mdc-checkbox__checkmark"
           viewBox="0 0 24 24">
        <path class="mdc-checkbox__checkmark-path"
              fill="none"
              stroke="white"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
      </svg>
      <div class="mdc-checkbox__mixedmark"></div>
    </div>
  </div>
  <label for="my-checkbox" id="my-checkbox-label">This is my checkbox</label>
</div>
```

> Note that MDC Form Field is **not** intended for cases where a label and input are already handled together by
> another component's styles and logic. For example, JavaScript-enhanced instances of MDC Text Field already manage
> a label and input together under their own root element.

### RTL Support

`mdc-form-field` is automatically RTL-aware, and will re-position elements within an RTL context.
`mdc-form-field` will apply RTL styles whenever it, or its ancestors, has a `dir="rtl"` attribute.


## JS Usage

### Including in code

#### ES2015

```javascript
import {MDCFormField, MDCFormFieldFoundation} from '@material/form-field';
```

#### CommonJS

```javascript
const mdcFormField = require('mdc-form-field');
const MDCFormField = mdcFormField.MDCFormField;
const MDCFormFieldFoundation = mdcFormField.MDCFormFieldFoundation;
```

#### AMD

```javascript
require(['path/to/mdc-form-field'], mdcFormField => {
  const MDCFormField = mdcFormField.MDCFormField;
  const MDCFormFieldFoundation = mdcFormField.MDCFormFieldFoundation;
});
```

#### Global

```javascript
const MDCFormField = mdc.formField.MDCFormField;
const MDCFormFieldFoundation = mdc.formField.MDCFormFieldFoundation;
```

### Instantiation

```javascript
import {MDCFormField} from '@material/form-field';

const formField = new MDCFormField(document.querySelector('.mdc-form-field'));
```

### MDCFormField API

The `MDCFormField` functionality is exposed through a single accessor method.

#### MDCFormField.input

Read-write property that works with an instance of an MDC Web input element.

In order for the label ripple integration to work correctly, this property needs to be set to a
valid instance of an MDC Web input element which exposes a `ripple` getter.

```javascript
const formField = new MDCFormField(document.querySelector('.mdc-form-field'));
const radio = new MDCRadio(document.querySelector('.mdc-radio'));

formField.input = radio;
```

No action is taken if the `input` property is not set or the input instance doesn't expose a
`ripple` getter.


### Adapter

| Method Signature | Description |
| --- | --- |
| `registerInteractionHandler(type: string, handler: EventListener) => void` | Adds an event listener `handler` for event type `type` to the label. |
| `deregisterInteractionHandler(type: string, handler: EventListener) => void` | Removes an event listener `handler` for event type `type` to the label. |
| `activateInputRipple() => void` | Activates the ripple on the input element. Should call `activate` on the input element's `ripple` property. |
| `deactivateInputRipple() => void` | Deactivates the ripple on the input element. Should call `deactivate` on the input element's `ripple` property. |
