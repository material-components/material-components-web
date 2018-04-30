<!--docs:
title: "Form Fields"
layout: detail
section: components
path: /catalog/input-controls/form-fields/
-->

# Form Fields

MDC Form Field aligns a form field (for example, a checkbox) with its label and makes it RTL-aware.
When used with JavaScript, it can activate a [ripple](../mdc-ripple) effect upon interacting with the label.

## Installation

```
npm install @material/form-field
```

## Demos

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/checkbox.html">Demo with checkbox</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/radio.html">Demo with radio button</a>
  </li>
</ul>

## Basic Usage

### HTML Structure

The `mdc-form-field` class is used as a parent element, with any combination of adjacent `input` and `label` elements as
immediate children:

```html
<div class="mdc-form-field">
  <input type="checkbox" id="input">
  <label for="input">Label</label>
</div>
```

MDC Form Field works with _any_ type of immediate child element as long as its successive sibling is a `label` element.
This means it will work for MDC Web form controls such as [MDC Checkbox](../mdc-checkbox) and [MDC Radio](../mdc-radio):

```html
<div class="mdc-form-field">
  <div class="mdc-checkbox">
    <input type="checkbox" id="my-checkbox" class="mdc-checkbox__native-control"/>
    <div class="mdc-checkbox__background">
      ...
    </div>
  </div>
  <label for="my-checkbox">This is my checkbox</label>
</div>
```

> _NOTE_: MDC Form Field is **not** intended for cases where a label and input are already handled together in a component's styles and logic. For example, [MDC Text Field](../mdc-text-field) already manages a label and input together under its own root element.

### JavaScript Instantiation

If you are using MDC Form Field with an MDC Web component that has a [ripple](../mdc-ripple) effect, you can instantiate `MDCFormField` and set its [`input` property](#MDCFormField-properties-and-methods) to activate the ripple effect upon interacting with the label. Here is an example using [MDC Radio](../mdc-radio):

```js
import {MDCFormField} from '@material/form-field';
import {MDCRadio} from '@material/radio';

const formField = new MDCFormField(document.querySelector('.mdc-form-field'));
const radio = new MDCRadio(document.querySelector('.mdc-radio'));
formField.input = radio;
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

## Variants

### Label position

By default, the input will be positioned before the label. You can position the input after the label by adding the `mdc-form-field--align-end` class:

```html
<div class="mdc-form-field mdc-form-field--align-end">
  <div class="mdc-checkbox">
    <input type="checkbox" id="my-checkbox" class="mdc-checkbox__native-control"/>
    <div class="mdc-checkbox__background">
      ...
    </div>
  </div>
  <label for="my-checkbox">This is my checkbox</label>
</div>
```

## `MDCFormField` Properties and Methods

Property | Value Type | Description
--- | --- | ---
`input` | String | Gets and sets the form field input. 

In order for the label ripple integration to work correctly, the `input` property needs to be set to a valid instance of an MDC Web input element which exposes a `ripple` getter. No action is taken if the `input` property is not set or the input instance doesn't expose a `ripple` getter.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Form Field for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCFormFieldAdapter`

| Method Signature | Description |
| --- | --- |
| `registerInteractionHandler(type: string, handler: EventListener) => void` | Adds an event listener `handler` for event type `type` to the label. |
| `deregisterInteractionHandler(type: string, handler: EventListener) => void` | Removes an event listener `handler` for event type `type` to the label. |
| `activateInputRipple() => void` | Activates the ripple on the input element. Should call `activate` on the input element's `ripple` property. |
| `deactivateInputRipple() => void` | Deactivates the ripple on the input element. Should call `deactivate` on the input element's `ripple` property. |
