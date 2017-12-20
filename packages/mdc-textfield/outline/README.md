<!--docs:
title: "Text Field Outline"
layout: detail
section: components
excerpt: "The outline is a border around the text field"
iconId: text_field
path: /catalog/input-controls/text-fields/outline/
-->

# Text Field Outline

The outline is a border around all sides of the text field. This is used for the Outlined variation of Text Fields.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/text-fields.html#text-fields-field-variations">Material Design guidelines: Text Field Variations</a>
  </li>
</ul>

## Usage

### HTML Structure

```html
<div class="mdc-text-field__outline">
  <svg>
    <path class="mdc-text-field__outline-path"/>
  </svg>
</div>
<div class="mdc-text-field__idle-outline"></div>
```

### Usage within `mdc-text-field`

```html
<div class="mdc-text-field mdc-text-field--outlined">
  <input class="mdc-text-field__input" id="my-text-field-id" type="text">
  <label class="mdc-text-field__label" for="my-text-field-id">Label</label>
  <div class="mdc-text-field__outline">
    <svg>
      <path class="mdc-text-field__outline-path"/>
    </svg>
  </div>
  <div class="mdc-text-field__idle-outline"></div>
</div>
```

### CSS Classes

CSS Class | Description
--- | ---
`mdc-text-field__outline` | Mandatory. Container for the SVG in the outline when the label is floating above the input.
`mdc-text-field__outline-path` | Mandatory. The SVG path in the outline when the label is floating above the input.
`mdc-text-field__idle-outline` | Mandatory. The outline when the label is resting in the input position.

#### `MDCTextFieldOutline`

##### `MDCTextFieldOutline.foundation`

This allows the parent `MDCTextField` component to access the public methods on the `MDCTextFieldOutlineFoundation` class.

### `MDCTextFieldOutlineAdapter`

Method Signature | Description
--- | ---
`getWidth() => number` | Returns the width of the outline element
`getHeight() => number` | Returns the height of the outline element
`setOutlinePathAttr(value: string) => void` | Sets the "d" attribute of the outline element's SVG path

### `MDCTextFieldOutlineFoundation`

Method Signature | Description
--- | ---
`updateSvgPath(labelWidth: number, radius: number, isRtl: boolean) => void` | Updates the SVG path of the focus outline element based on the given the width of the label element, the corner radius, and the RTL context.
