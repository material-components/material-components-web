<!--docs:
title: "Form Fields"
layout: detail
section: components
path: /catalog/input-controls/form-fields/
-->

# Form Fields

MDC Form Field aligns an MDC Web form field (for example, a checkbox) with its label and makes it RTL-aware. It also activates a [ripple](../mdc-ripple) effect upon interacting with the label.

## Installation

```
npm install @material/form-field
```

## Demos

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/radio">Demo with radio button</a>
  </li>
</ul>

## Basic Usage

### HTML Structure

Use the `mdc-form-field` element to wrap any combination of adjacent _input_ and _label_ elements of MDC Web form controls, such as [MDC Checkbox](../mdc-checkbox) or [MDC Radio](../mdc-radio). Here's an example with MDC Checkbox:

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

> _NOTE_: MDC Form Field is **not** intended for cases where a label and input are already handled together in a component's styles and logic. For example, [MDC Text Field](../mdc-textfield) already manages a label and input together under its own root element.

### JavaScript Instantiation

If you are using MDC Form Field with an MDC Web component that has a [ripple](../mdc-ripple) effect, you can instantiate `MDCFormField` and set its [`input` property](#mdcformfield-properties-and-methods) to activate the ripple effect upon interacting with the label. Here is an example with [MDC Checkbox](../mdc-checkbox):

```js
import {MDCFormField} from '@material/form-field';
import {MDCCheckbox} from '@material/checkbox';

const formField = new MDCFormField(document.querySelector('.mdc-form-field'));
const checkbox = new MDCCheckbox(document.querySelector('.mdc-checkbox'));
formField.input = checkbox;
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

### Nowrap

If the label text is too long for a single line, it will wrap the text by default. You can force the text to stay on a single line and ellipse the overflow text by adding the `mdc-form-field--nowrap` class:

```html
<div class="mdc-form-field mdc-form-field--nowrap">
  <div class="mdc-checkbox">
    <input type="checkbox" id="my-checkbox" class="mdc-checkbox__native-control"/>
    <div class="mdc-checkbox__background">
      ...
    </div>
  </div>
  <label for="my-checkbox">This some really really really long text</label>
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
