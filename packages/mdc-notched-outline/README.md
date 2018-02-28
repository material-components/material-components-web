<!--docs:
title: "Notched Outline"
layout: detail
section: components
excerpt: "The notched outline is a border around either a text field or select element"
iconId: text_field
path: /catalog/input-controls/notched-outline
-->

# Notched Outline

The outline is a border around all sides of the text field or select. This is used for the Outlined variation of Text Fields and Select.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/text-fields.html#text-fields-field-variations">Material Design guidelines: Text Field Variations</a>
  </li>
</ul>

## Usage

### HTML Structure

```html
<div class="mdc-notched-outline">
  <svg>
    <path class="mdc-notched-outline__path"/>
  </svg>
</div>
<div class="mdc-notched-outline__idle"></div>
```

### Usage within `mdc-text-field`

```html
<div class="mdc-text-field mdc-text-field--outlined">
  <input class="mdc-text-field__input" id="my-text-field-id" type="text">
  <label class="mdc-text-field__label" for="my-text-field-id">Label</label>
  <div class="mdc-notched-outline">
    <svg>
      <path class="mdc-notched-outline__path"/>
    </svg>
  </div>
  <div class="mdc-notched-outline__idle"></div>
</div>
```

### CSS Classes

CSS Class | Description
--- | ---
`mdc-notched-outline` | Mandatory. Container for the SVG of the outline when the label is floating above the input.
`mdc-notched-outline__path` | Mandatory. The SVG path in the outline when the label is floating above the input.
`mdc-notched-outline__idle` | Mandatory. The outline when the label is resting, in the docked position.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-text-field-outline-color($color)` | Customizes the color of the border of the outlined text-field.
`mdc-text-field-hover-outline-color($color)` | Customizes the hover color of the border of the outlined text-field.
`mdc-text-field-focused-outline-color($color)` | Customizes the outlined border color when the text-field is focused.

### `MDCNotchedOutline`
Method Signature | Description
--- | ---
`updateSvgPath(notchWidth: number, isRtl: boolean) => void` | Updates the SVG of the outline element with a notch calculated based off of the notchWidth. The notch will appear left justified, unless isRtl is true.

### `MDCNotchedOutlineAdapter`

Method Signature | Description
--- | ---
`getWidth() => number` | Returns the width of the outline element.
`getHeight() => number` | Returns the height of the outline element.
`setOutlinePathAttr(value: string) => void` | Sets the "d" attribute of the outline element's SVG path.
`getIdleOutlineStyleValue(propertyName: string) => string` | Returns the idle outline element's computed style value of a given css `propertyName`.

### `MDCNotchedOutlineFoundation`

Method Signature | Description
--- | ---
`updateSvgPath(labelWidth: number, isRtl: boolean) => void` | Updates the SVG path of the focus outline element based on the given width of the label element and the RTL context.
