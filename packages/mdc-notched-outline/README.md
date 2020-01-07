<!--docs:
title: "Notched Outline"
layout: detail
section: components
excerpt: "The notched outline is a border around either a Text Field or Select element"
iconId: text_field
path: /catalog/input-controls/notched-outline/
-->

# Notched Outline

The notched outline is a border around all sides of either a Text Field or Select component. This is used for the Outlined variant of either a Text Field or Select.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-text-fields#text-fields-field-variations">Material Design guidelines: Text Field Variations</a>
  </li>
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/text-field">Demo with Notched Outline on Text Field</a>
  </li>
</ul>

## Installation

```
npm install @material/notched-outline
```

## Basic Usage

### HTML Structure

```html
<div class="mdc-notched-outline">
  <div class="mdc-notched-outline__leading"></div>
  <div class="mdc-notched-outline__notch">
    <span class="mdc-floating-label">Label</span>
  </div>
  <div class="mdc-notched-outline__trailing"></div>
</div>
```

> Note that the [MDC Floating Label](../mdc-floating-label/README.md) component is placed inside the notch element when
> used together with MDC Notched Outline.

> See the [MDC Text Field](../mdc-textfield/README.md#outlined) and
> [MDC Select](../mdc-select/README.md#outlined-select) documentation for
> information on using Notched Outline in the context of those components.

### Styles

```scss
@import "@material/notched-outline/mdc-notched-outline";
```

### JavaScript Instantiation

```js
import {MDCNotchedOutline} from '@material/notched-outline';

const notchedOutline = new MDCNotchedOutline(document.querySelector('.mdc-notched-outline'));
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-notched-outline` | Mandatory. Container for the outline's sides and notch.
`mdc-notched-outline--notched` | Modifier class to open the notched outline.
`mdc-notched-outline--no-label` | Modifier class to use when the floating label is empty or not used.
`mdc-notched-outline__leading` | Mandatory. Element representing the leading side of the notched outline (before the notch).
`mdc-notched-outline__notch` | Mandatory. Element representing the notch.
`mdc-notched-outline__trailing` | Mandatory. Element representing the trailing side of the notched outline (after the notch).

### Sass Mixins

Mixin | Description
--- | ---
`mdc-notched-outline-color($color)` | Customizes the border color of the notched outline.
`mdc-notched-outline-stroke-width($width)` | Changes notched outline width to a specified pixel value.
`mdc-notched-outline-shape-radius($radius, $rtl-reflexive)` | Sets the rounded shape to notched outline element with given radius size. Set `$rtl-reflexive` to true to flip radius values in RTL context, defaults to false.
`mdc-notched-outline-floating-label-float-position($positionY, $positionX, $scale)` | Sets the position and scale of the floating label inside the notched outline.

## `MDCNotchedOutline` Properties and Methods

Method Signature | Description
--- | ---
`notch(notchWidth: number) => void` | Opens the notch with the specified width.
`closeNotch() => void` | Closes the notch, rendering a full outline.

## Usage Within Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Notched Outline for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCNotchedOutlineAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the notched outline element.
`removeClass(className: string) => void` | Removes a class from the notched outline element.
`setNotchWidthProperty(width: number) => void` | Sets the width of the notch in pixels.
`removeNotchWidthProperty() => void` | Removes the width property from the notch element.

### `MDCNotchedOutlineFoundation`

Method Signature | Description
--- | ---
`notch(notchWidth: number) => void` | Adds the `mdc-notched-outline--notched` class and updates the notch element's style based on `notchWidth`.
`closeNotch() => void` | Removes the `mdc-notched-outline--notched` class.
