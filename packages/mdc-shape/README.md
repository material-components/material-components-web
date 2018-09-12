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

> Currently shape system for web only supports rounded corners.

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

## Usage

### Shapes for fixed height components

Styles for applying shape to button component looks like this.

```scss
@include mdc-shape-radius(mdc-shape-resolve-percentage-radius($mdc-button-height, $radius));
```

Where, `$mdc-button-height` is the height of standard button and `$radius` is the size of shape. `mdc-shape-resolve-percentage-radius` function is used to resolve percentage unit value to absolute `$radius` value based on component height.

### Shapes for dynamic height components

Styles for applying shapes to dynamic height component like card looks like this:

```scss
@include mdc-shape-radius($radius);
```

Where, `$radius` is absolute value only.

### Shapes for components on specific corners

Styles for applying shapes for specific corners such as drawer looks like this:

```scss
@include mdc-shape-radius((0, $radius, $radius, 0), $rtl-reflexive: true);
```

Where, only top-right & bottom-right corners are customizable and it automatically flips radius values based on RTL context when `$rtl-reflexive` is set to true.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-shape-radius($radius, $rtl-reflexive)` | Shape API used by all other components to apply radius to appropriate corners. `$radius` can be single value or list of 4 radius corner values. Set `$rtl-reflexive` to true to flip the radius in RTL case, `false` by default.

> Use `mdc-shape-resolve-percentage-radius` sass function to resolve percentage unit value to absolute radius value.

### Sass Functions

Function | Description
--- | ---
`mdc-shape-flip-radius($radius)` | Function that flips the radius in RTL context. $radius is list of corner values it can be length of 4, 3 or 2.
`mdc-shape-resolve-percentage-radius($component-height, $radius)` | Function that calculates the absolute radius value based on its component height. Use this for fixed height components only.
`mdc-shape-prop-value($radius)` | Returns radius value of shape category - `large`, `medium` or `small`. Otherwise, it returns the `$radius` itself if valid. `$radius` can be a single value or list of 4.
