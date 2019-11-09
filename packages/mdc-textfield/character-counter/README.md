<!--docs:
title: "Text Field Character Counter"
layout: detail
section: components
excerpt: "Character counter displays the ratio of characters used and the total character limit"
iconId: text_field
path: /catalog/input-controls/text-field/character-counter/
-->

# Text Field Character Counter

Character counter is used if there is a character limit. It displays the ratio of characters used and the total character limit.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-text-fields#text-fields-layout">Material Design guidelines: Text Fields Layout</a>
  </li>
</ul>

## Basic Usage

### HTML Structure

```html
<div class="mdc-text-field-character-counter">0 / 140</div>
```

> NOTE: Place this inside `.mdc-text-field-helper-line` for single line mdc text field which is an immediate sibling of `.mdc-text-field` and
> place it as first element of `.mdc-text-field` for multi-line text field variant (textarea).

### Styles

```scss
@import "@material/textfield/character-counter/mdc-text-field-character-counter";
```

### JavaScript Instantiation

```js
import {MDCTextFieldCharacterCounter} from '@material/textfield/character-counter';

const characterCounter = new MDCTextFieldCharacterCounter(document.querySelector('.mdc-text-field-character-counter'));
```

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-text-field-character-counter` | Mandatory.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-text-field-character-counter-color($color)` | Customizes the color of the character counter associated with an enabled text field.
`mdc-text-field-character-disabled-counter-color($color)` | Customizes the color of the character counter associated with a disabled text field.
`mdc-text-field-character-counter-position($xOffset, $yOffset)` | Positions the character counter element inside text field. Used only for textarea variant.

## `MDCTextFieldCharacterCounter` Properties and Methods

Property | Value Type | Description
--- | --- | ---
`foundation` | `MDCTextFieldCharacterCounterFoundation` | Returns the character counter's foundation. This allows the parent `MDCTextField` component to access the public methods on the `MDCTextFieldCharacterCounterFoundation` class.

## Usage Within Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Character Counter for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../../docs/integrating-into-frameworks.md).

### `MDCTextFieldCharacterCounterAdapter`

Method Signature | Description
--- | ---
`setContent(content: string) => void` | Sets the text content of character counter element.

### `MDCTextFieldCharacterCounterFoundation`

Method Signature | Description
--- | ---
`setCounterValue(currentLength: number, maxLength: number) => void` | Sets the character counter values including characters used and total character limit.
