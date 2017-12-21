<!--docs:
title: "Text Field Bottom Line"
layout: detail
section: components
excerpt: "The bottom line indicates where to enter text, displayed below the label"
iconId: text_field
path: /catalog/input-controls/text-field/bottom-line/
-->

# Text Field Bottom Line

The bottom line indicates where to enter text, displayed below the label. When a text field is active or contains an error, the line’s color and thickness vary.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/text-fields.html#text-fields-layout">Material Design guidelines: Text Fields Layout</a>
  </li>
</ul>

## Usage

### HTML Structure

```html
<div class="mdc-text-field__bottom-line"></div>
```

### Usage within `mdc-text-field`

```html
<div class="mdc-text-field">
  <input type="text" id="my-text-field-id" class="mdc-text-field__input">
  <label class="mdc-text-field__label" for="my-text-field-id">Hint text</label>
  <div class="mdc-text-field__bottom-line"></div>
</div>
```

### CSS Classes

CSS Class | Description
--- | ---
`mdc-text-field-bottom-line` | Mandatory
`mdc-text-field-bottom-line--active` | Styles the bottom line as an active bottom line

### `MDCTextFieldBottomLine`

##### `MDCTextFieldBottomLine.foundation`

This allows the parent `MDCTextField` component to access the public methods on the `MDCTextFieldBottomLineFoundation` class.

### `MDCTextFieldBottomLineAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element
`removeClass(className: string) => void` | Removes a class from the root element
`setAttr(attr: string, value: string) => void` | Sets an attribute with a given value on the root element
`registerEventHandler(evtType: string, handler: EventListener) => void` | Registers an event listener on the root element for a given event
`deregisterEventHandler(handler: EventListener) => void` | Deregisters an event listener on the root element for a given event
`notifyAnimationEnd() => void` | Emits a custom event "MDCTextFieldBottomLine:animation-end" denoting the bottom line has finished its animation; either the activate or deactivate animation

### `MDCTextFieldBottomLineFoundation`

Method Signature | Description
--- | ---
`activate() => void` | Activates the bottom line
`deactivate => void` | Deactivates the bottom line
`setTransformOrigin(evt: Event) => void` | Sets the transform origin given a user's click location
`handleTransitionEnd(evt: Event) => void` | Handles a transition end event
