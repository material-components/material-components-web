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
     href="https://material-components.github.io/material-components-web-catalog/#/component/shape">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/shape.png" width="159" alt="Shape screenshot">
  </a>
</div>-->

Shapes direct attention, identify components, communicate state, and express brand.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-shape">Material Design guidelines: Shape</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/shape">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/shape
```

## Basic Usage

### Styles

The styles for applying custom shape to button component looks like this:

```scss
@import "@material/button/mixins";

.my-custom-button {
  @include mdc-button-shape-radius(pill);
}
```

In this example, the above styles applies `pill` shape to button. It can also be absolute value (e.g., `8px`);

> You would indirectly use the Shape API through respective component's mixin which takes care of applying radius all corners to all its component variants.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-shape-radius($radius, $rtl-reflexive)` | Shape API used by all other components to apply radius to appropriate corners. `$radius` can be single value or list of 4 radius corner values. Set `$rtl-reflexive` to true to flip the radius in RTL case, `false` by default.
`mdc-shape-flip-radius($radius)` | Flips the radius in RTL case. Where `$radius` is a list of 4 radius corner values.

> `$radius` value can be single radius or list of 4 radius corner values. Accepted unit type for radius: `px` or `pill`. Where `pill` is automatically calculated based on component's height.
