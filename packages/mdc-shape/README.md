<!--docs:
title: "Shape"
layout: detail
section: components
excerpt: "Shapes direct attention, identify components, communicate state, and express brand."
path: /catalog/shape/
-->

# Shape

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/shape.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/shape.png" width="159" alt="Shape screenshot">
  </a>
</div>-->

Shapes direct attention, identify components, communicate state, and express brand.

Many MDC Web components include direct support for rounded corners; this package provides additional support for
applying angled corners to unelevated surfaces.

## Design

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/shape.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/shape
```

## Basic Usage

### HTML

The markup for angled corners involves a container element, and one element per angled corner.

The following example demonstrates angled corners applied to a MDC Button, but this technique may be applied to any
unelevated component.

```html
<div class="mdc-shape-container my-shape-container">
  <button class="mdc-button mdc-button--unelevated">Button</button>
  <div class="mdc-shape-container__corner mdc-shape-container__corner--top-left"></div>
  <div class="mdc-shape-container__corner mdc-shape-container__corner--top-right"></div>
  <div class="mdc-shape-container__corner mdc-shape-container__corner--bottom-right"></div>
  <div class="mdc-shape-container__corner mdc-shape-container__corner--bottom-left"></div>
</div>
```

> **Note:** Each angled corner should have its own `<div>` element. Any corner that will not be cut (i.e. its size is 0)
> does not need a dedicated element.

### Styles

```scss
@import "@material/shape/mixins";

.my-shape-container {
  @include mdc-shape-angled-corner(#fff, 10px);
}
```

## Variants

### Outlined Angled Corners

Outlined angled corners involve the same markup and styles as above, with the addition of including a mixin for outline:

```scss
@import "@material/shape/mixins";

.my-shape-container {
  @include mdc-shape-angled-corner(#fff, 10px);
  @include mdc-shape-angled-corner-outline(2px, blue);
}
```

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-shape-container` | Mandatory. Parent element containing the component to be masked.
`mdc-shape-container__corner` | Mandatory. Element for masking a specific corner; there may be up to 4.
`mdc-shape-container__corner--bottom-left` | Element for masking the bottom left corner of the component.
`mdc-shape-container__corner--bottom-right` | Element for masking the bottom right corner of the component.
`mdc-shape-container__corner--top-left` | Element for masking the top left corner of the component.
`mdc-shape-container__corner--top-right` | Element for masking the top right corner of the component.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-shape-angled-corner($background-color, $top-left-size[, $top-right-size, $bottom-right-size, $bottom-left-size])` | Applies styles for masking angled corners, using the given background color and corner sizes. If fewer than 4 corner sizes are specified, the mixin automatically determines the other corners similarly to CSS `border-radius`.
`mdc-shape-angled-corner-background($background-color)` | Sets the background color used to mask angled corners. Useful for styling a subset of components in a section with a different background color.
`mdc-shape-angled-corner-outline($outline-width, $outline-color[, $outline-style])` | Applies outline styles to angled corners. `$outline-style` defaults to `solid`.

> **Note:** When mentioned above, "background color" specifically refers to the color of the background behind the surface (_not_ the fill color of the surface). These mixins operate by masking the corners of the surface to match the background.

> **Note:** These mixins should be included in the context of the container element (or an ancestor) in order to apply styles to the corner elements.
