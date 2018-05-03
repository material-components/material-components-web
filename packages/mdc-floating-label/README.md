<!--docs:
title: "Floating Label"
layout: detail
section: components
excerpt: "An animated text caption for a text field or select."
path: /catalog/input-controls/floating-label/
-->

# Floating Label

Floating labels display the type of input a field requires. Every text field and select should have a label. Labels are aligned with the input line and always visible. They can be resting (when a field is inactive and empty) or floating. The label is a text caption or description for the text field.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/text-fields.html#text-fields-layout">Material Design guidelines: Text Fields Layout</a>
  </li>
</ul>

## Usage

### HTML Structure

```html
<label class="mdc-floating-label" for="my-text-field-id">Hint text</label>
```

### Usage within `mdc-text-field`

```html
<div class="mdc-text-field">
  <input type="text" id="my-text-field-id" class="mdc-text-field__input">
  <label class="mdc-floating-label" for="my-text-field-id">Hint text</label>
  <div class="mdc-text-field__bottom-line"></div>
</div>
```

<!-- TODO(mattgoo): add ### Usage within `mdc-select` once select uses mdc-floating-label -->

#### Avoid Dynamic ID Generation

If you're using the JavaScript-enabled version of floating label, you can avoid needing to assign
a unique `id` to each `<input>` by wrapping `mdc-text-field__input` within a `<label>`:

```html
<label class="mdc-text-field">
  <input type="text" class="mdc-text-field__input">
  <span class="mdc-floating-label">Hint Text</span>
  <div class="mdc-text-field__bottom-line"></div>
</label>
```

### CSS Classes

CSS Class | Description
--- | ---
`mdc-floating-label` | Mandatory.
`mdc-floating-label--float-above` | Indicates the label is floating above the text field.
`mdc-floating-label--shake` | Shakes the label.

### SCSS Mixins

Mixin | Description
--- | ---
`mdc-floating-label-ink-color($color)` | Customizes the ink color of the label.
`mdc-floating-label-fill-color($color)` | Customizes the fill color of the label.
`mdc-floating-label-shake-keyframes($modifier, $positionY, $positionX, $scale)` | Generates a CSS `@keyframes` at-rule for an invalid label shake. Used in conjunction with the `mdc-floating-label-shake-animation` mixin.
`mdc-floating-label-shake-animation($modifier)` | Applies shake keyframe animation to label.
`mdc-floating-label-float-position($positionY, $positionX, $scale)` | Sets position of label when floating.

### `MDCFloatingLabel`

Method Signature | Description
--- | ---
`shake(shouldShake: boolean) => void` | Shakes or stops shaking the label, depending on the value of `shouldShake`. Proxies to the foundation method of the same name.
`float(shouldFloat: boolean) => void` | Floats or docks the label, depending on the value of `shouldFloat`. Proxies to the foundation method of the same name.
`getWidth() => number` | Returns the width of the label element.

### `MDCFloatingLabelAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the label element.
`removeClass(className: string) => void` | Removes a class from the label element.
`getWidth() => number` | Returns the width of the label element.

### `MDCFloatingLabelFoundation`

Method Signature | Description
--- | ---
`shake(shouldShake: boolean)` | Shakes or stops shaking the label, depending on the value of `shouldShake`.
`float(shouldFloat: boolean)` | Floats or docks the label, depending on the value of `shouldFloat`.
`getWidth() => number` | Returns the width of the label element.
