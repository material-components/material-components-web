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
  <svg>
    <path class="mdc-notched-outline__path"/>
  </svg>
</div>
<div class="mdc-notched-outline__idle"></div>
```

> For usage within a text field see [here](../mdc-textfield/README.md#outlined).

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
`mdc-notched-outline` | Mandatory. Container for the SVG of the notched outline path.
`mdc-notched-outline--notched` | Class to open notch outline.
`mdc-notched-outline__path` | Mandatory. The path of the SVG of the notched outline.
`mdc-notched-outline__idle` | Mandatory. The full outline when the notch is hidden.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-notched-outline-color($color)` | Customizes the border color of the notched outlined.
`mdc-notched-outline-idle-color($color)` | Customizes the border color of the idle outline.
`mdc-notched-outline-stroke-width($width)` | Changes notched outline width to a specified pixel value.
`mdc-notched-outline-shape-radius($radius, $rtl-reflexive)` | Sets the rounded shape to notched outline element with given radius size. Set `$rtl-reflexive` to true to flip radius values in RTL context, defaults to false.
`mdc-notched-outline-idle-shape-radius($radius, $rtl-reflexive)` | Sets the rounded shape to notched outline element in idle state with given radius size. Set `$rtl-reflexive` to true to flip radius values in RTL context, defaults to false.

#### Calling Mixins with Parent Selectors

Because notched-outline has sibling elements, you need to call the "idle" Sass mixins with parent selectors.
Consider the following example HTML:

```html
<div class="foo__parent">
  <div class="mdc-notched-outline foo__child">
    <svg>
      <path class="mdc-notched-outline__path"/>
    </svg>
  </div>
  <div class="mdc-notched-outline__idle"></div>
</div>
```
In order to customize any "non-idle" part of notched-outline, use the .foo__child CSS selector:
```scss
.foo__child {
  @include mdc-notched-outline-color($fooColor);
}
```
But in order to customize any "idle" part of the notched-outline, you must use the .foo__parent CSS selector:
```scss
.foo__parent {
  @include mdc-notched-outline-idle-color($fooColor);
}
```

## `MDCNotchedOutline` Properties and Methods

Method Signature | Description
--- | ---
`notch(notchWidth: number, isRtl: boolean) => void` | Updates notched outline to open notch in outline path.
`closeNotch() => void` | Updates the notched outline to close notch in outline path.

## Usage Within Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Notched Outline for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCNotchedOutlineAdapter`

Method Signature | Description
--- | ---
`getWidth() => number` | Returns the width of the notched outline element.
`getHeight() => number` | Returns the height of the notched outline element.
`addClass(className: string) => void` | Adds a class to the notched outline element.
`removeClass(className: string) => void` | Removes a class from the notched outline element.
`setOutlinePathAttr(value: string) => void` | Sets the "d" attribute of the notched outline element's SVG path.
`getIdleOutlineStyleValue(propertyName: string) => string` | Returns the idle outline element's computed style value of a given css `propertyName`.

### `MDCNotchedOutlineFoundation`

Method Signature | Description
--- | ---
`notch(notchWidth: number, isRtl: boolean) => void` | Adds the `mdc-notched-outline--notched` selector and updates the notched outline path based off notchWidth and isRtl.
`closeNotch() => void` | Removes the outline notched selector.
`updateSvgPath(notchWidth: number, isRtl: boolean) => void` | Updates the SVG path of the focus outline element calculated based off of the notchWidth. The notch will appear left justified, unless isRtl is true.
