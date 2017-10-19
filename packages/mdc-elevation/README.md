<!--docs:
title: "Elevation"
layout: detail
section: components
excerpt: "Shadows and elevation as Sass mixins and CSS classes."
iconId: shadow
path: /catalog/elevation/
-->

# Elevation

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/elevation.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/elevation.png" width="247" alt="Elevation screenshot">
  </a>
</div>-->

Shadows provide important visual cues about objects’ depth and directional movement. They are the only visual cue indicating the amount of separation between surfaces. An object’s elevation determines the appearance of its shadow. The elevation values are mapped out in a "z-space" and range from `0` to `24`.

> **A note about "z-space"**: Within the spec, elevation is normally referred to as having a `dp` value. In other words, how many "pixels" above the base material is a piece of material elevated. On a computer, this is normally represented by a 3-d coordinate system. We like `z-space` (or just "z" for short) because it aligns with the technical definition of, and nomenclature for, a 3-d coordinate system. Therefore, we feel it makes more sense than `dp`. However, when we refer to `z-space` (or `z`), that can be used interchangeably with the spec's `dp`.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/what-is-material/elevation-shadows.html">Material Design guidelines: Shadows & elevation</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/elevation.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install --save @material/elevation
```

## Usage

### CSS Classes

Some components have a set elevation. For example, a raised MDC Button has elevation 2.

If you want to set the elevation of an element, which is not a Material Design component, you
can apply the following CSS classes.

CSS Class | Description
--- | ---
`mdc-elevation--z<N>` | Sets the elevation to the (N)dp, where 1 <= N <= 24
`mdc-elevation-transition` | Applies the correct css rules to transition an element between elevations

### Sass Mixins, Variables, and Functions

Mixin | Description
--- | ---
`mdc-elevation($z-value, $color, $opacity-boost)` | Sets the elevation to the z-space for that given elevation, and optionally sets the color and/or boosts the opacity of the shadow
`mdc-elevation-transition($duration, $easing)` | Applies the correct css rules to transition an element between elevations

Variable | Description
--- | ---
`mdc-elevation-transition-duration` | Default duration value for elevation transitions
`mdc-elevation-transition-timing-function` | Default easing value for elevation transitions

If you need more configurability over your transitions, use the `mdc-elevation-transition-rule` function in conjunction with the exported sass variables.

```scss
.my-component-with-custom-transitions {

  transition:
    mdc-elevation-transition-rule(),
    /* Configure opacity to use same duration and easing values as elevation */
    opacity $mdc-elevation-transition-duration $mdc-elevation-transition-timing-function;
  opacity: .7;
  will-change: $mdc-elevation-property, opacity;
}
```
