<!--docs:
title: "Floating Label"
layout: detail
section: components
excerpt: "An animated text caption for a Text Field or Select."
path: /catalog/input-controls/floating-label/
-->

# Floating Label

Floating labels display the type of input a field requires. Every Text Field and Select should have a label, except for full-width text fields, which use the input's `placeholder` attribute instead. Labels are aligned with the input line and always visible. They can be resting (when a field is inactive and empty) or floating. The label is a text caption or description for the Text Field.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-text-fields#text-fields-layout">Material Design guidelines: Text Fields Layout</a>
  </li>
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/text-field">Demo with Text Field</a>
  </li>
</ul>

## Installation

```
npm install @material/floating-label
```

## Basic Usage

### HTML Structure

```html
<label class="mdc-floating-label" for="my-text-field-id">Hint text</label>
```

### Styles

```scss
@import "@material/floating-label/mdc-floating-label";
```

### JavaScript Instantiation

```js
import {MDCFloatingLabel} from '@material/floating-label';

const floatingLabel = new MDCFloatingLabel(document.querySelector('.mdc-floating-label'));
```

## Variants

### Avoid Dynamic ID Generation

If you're using the JavaScript-enabled version of floating label, you can avoid needing to assign
a unique `id` to each `<input>` by wrapping `mdc-text-field__input` within a `<label>`:

```html
<label class="mdc-text-field">
  <input type="text" class="mdc-text-field__input">
  <span class="mdc-floating-label">Hint Text</span>
  <div class="mdc-text-field__bottom-line"></div>
</label>
```

> NOTE: This method also works with `<select>`.

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-floating-label` | Mandatory.
`mdc-floating-label--float-above` | Indicates the label is floating in the floating position.
`mdc-floating-label--shake` | Shakes the label.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-floating-label-ink-color($color)` | Customizes the ink color of the label.
`mdc-floating-label-floated-ink-color($color)` | Customizes the color of the label when floating.
`mdc-floating-label-fill-color($color)` | Customizes the fill color of the label.
`mdc-floating-label-floated-fill-color($color)` | Customizes the fill color of the label when floating.
`mdc-floating-label-shake-keyframes($modifier, $positionY, $positionX, $scale)` | Generates a CSS `@keyframes` at-rule for an invalid label shake. Used in conjunction with the `mdc-floating-label-shake-animation` mixin.
`mdc-floating-label-shake-animation($modifier)` | Applies shake keyframe animation to label.
`mdc-floating-label-float-position($positionY, $positionX, $scale)` | Sets position of label when floating.
`mdc-floating-label-max-width($max-width)` | Sets the max width of the label.

## `MDCFloatingLabel` Properties and Methods

Method Signature | Description
--- | ---
`shake(shouldShake: boolean) => void` | Proxies to the foundation's `shake()` method.
`float(shouldFloat: boolean) => void` | Proxies to the foundation's `float()` method.
`getWidth() => number` | Proxies to the foundation's `getWidth()` method.

## Usage Within Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Floating Label for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCFloatingLabelAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the label element.
`removeClass(className: string) => void` | Removes a class from the label element.
`getWidth() => number` | Returns the width of the label element.
`registerInteractionHandler(evtType: string, handler: EventListener) => void` | Registers an event listener for a given event.
`deregisterInteractionHandler(evtType: string, handler: EventListener) => void` | Deregisters an event listener for a given event.

### `MDCFloatingLabelFoundation`

Method Signature | Description
--- | ---
`shake(shouldShake: boolean)` | Shakes or stops shaking the label, depending on the value of `shouldShake`.
`float(shouldFloat: boolean)` | Floats or docks the label, depending on the value of `shouldFloat`.
`getWidth() => number` | Returns the width of the label element.
