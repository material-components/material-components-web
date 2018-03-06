<!--docs:
title: "Notched Outline"
layout: detail
section: components
excerpt: "The notched outline is a border around either a text field or select element"
iconId: text_field
path: /catalog/input-controls/notched-outline
-->

# Notched Outline

The outline is a border around all sides of either a text field or select component. This is used for the Outlined variant of either a Text Field or Select.

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

> For usage within a text field [see](../mdc-textfield/README.md#outlined/).

### CSS Classes

CSS Class | Description
--- | ---
`mdc-notched-outline` | Mandatory. Container for the SVG of the notched outline path.
`mdc-notched-outline--notched` | Class to activate notch outline.
`mdc-notched-outline__path` | Mandatory. The path of the SVG of the notched outline.
`mdc-notched-outline__idle` | Mandatory. The full outline when the notch is hidden.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-notched-outline-color($color)` | Customizes the border color of the notched outlined.
`mdc-notched-outline-idle-color($color)` | Customizes the border color of the idle outline.
`mdc-notched-outline-stroke-width($width)` | Changes notched outline width to a specified pixel value.

### `MDCNotchedOutline`

Method Signature | Description
--- | ---
`notch(activateNotch: boolean)` | Updates outline to activate/deactivate notch in outline path.
`updateSvgPath(notchWidth: number, isRtl: boolean) => void` | Updates the SVG of the outline element with a notch calculated based off of the notchWidth. The notch will appear left justified, unless isRtl is true.

### `MDCNotchedOutlineAdapter`

Method Signature | Description
--- | ---
`getWidth() => number` | Returns the width of the outline element.
`getHeight() => number` | Returns the height of the outline element.
`addClass(className: string) => void` | Adds a class to the notched outline element.
`removeClass(className: string) => void` | Removes a class from the notched outline element.
`setOutlinePathAttr(value: string) => void` | Sets the "d" attribute of the outline element's SVG path.
`getIdleOutlineStyleValue(propertyName: string) => string` | Returns the idle outline element's computed style value of a given css `propertyName`.

### `MDCNotchedOutlineFoundation`

Method Signature | Description
--- | ---
`notch(activateNotch: boolean)` | Adds remove the outline notched selector if activateNotch is true. Updates the component to activate/deactivate notch outline.
`updateSvgPath(notchWidth: number, isRtl: boolean) => void` | Updates the SVG path of the focus outline element based on the given notchWidth and the RTL context.
