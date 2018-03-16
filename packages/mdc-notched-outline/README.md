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

> For usage within a text field see [here](../mdc-textfield/README.md#outlined/).

### CSS Classes

CSS Class | Description
--- | ---
`mdc-notched-outline` | Mandatory. Container for the SVG of the notched outline path.
`mdc-notched-outline__path` | Mandatory. The path of the SVG of the notched outline.
`mdc-notched-outline__idle` | Mandatory. The full outline when the notch is hidden.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-notched-outline-color($color)` | Customizes the border color of the notched outlined.
`mdc-notched-outline-idle-color($color)` | Customizes the border color of the idle outline.
`mdc-notched-outline-stroke-width($width)` | Changes notched outline width to a specified pixel value.
`mdc-notched-outline-corner-radius($radius)` | Sets the corner radius of the notched outline element to the given number.
`mdc-notched-outline-idle-corner-radius($radius)` | Sets the corner radius of the notched outline element in idle state.
> NOTE:
> Because notched-outline has sibling elements, you need to call the "idle" Sass mixins with parent selectors.
> Consider the following example HTML:
>
> ```html
> <div class="foo-line-ripple-parent">
>   <div class="mdc-notched-outline foo-line-ripple">
>     <svg>
>       <path class="mdc-notched-outline__path"/>
>     </svg>
>   </div>
>   <div class="mdc-notched-outline__idle"></div>
> </div>
> ```
> In order to customize any "non-idle" part of notched-outline, use the .foo-line-ripple CSS selector:
> ```scss
> .foo-line-ripple {
>   @include mdc-notched-outline-color($fooColor);
> }
> ```
> But in order to customize any "idle" part of the notched-outline, you must use the .foo-line-ripple-parent CSS selector:
> ```scss
> .foo-line-ripple-parent {
>   @include mdc-notched-outline-idle-color($fooColor);
> }
> ```

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
`updateSvgPath(notchWidth: number, isRtl: boolean) => void` | Updates the SVG path of the focus outline element based on the given notchWidth and the RTL context.


[//]: <> (TODO(mattgoo): add how to hide/show notch in outline)
