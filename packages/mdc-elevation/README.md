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
     href="https://material-components.github.io/material-components-web-catalog/#/component/elevation">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/elevation.png" width="247" alt="Elevation screenshot">
  </a>
</div>-->

Shadows provide important visual cues about objects’ depth and directional movement. They are the only visual cue indicating the amount of separation between surfaces. An object’s elevation determines the appearance of its shadow. The elevation values are mapped out in a "z-space" and range from `0` to `24`.

> **A note about "z-space"**: Within the spec, elevation is normally referred to as having a `dp` value. In other words, how many "pixels" above the base material is a piece of material elevated. On a computer, this is normally represented by a 3-d coordinate system. We like `z-space` (or just "z" for short) because it aligns with the technical definition of, and nomenclature for, a 3-d coordinate system. Therefore, we feel it makes more sense than `dp`. However, when we refer to `z-space` (or `z`), that can be used interchangeably with the spec's `dp`.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-elevation">Material Design guidelines: Shadows & elevation</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/elevation">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/elevation
```

## Basic Usage

### HTML

Elevation is often already included within the baseline styles of other components (e.g. raised buttons, elevated cards).

However, you can also apply elevation to specific components using `mdc-elevation--z<N>` classes:

```html
  <div class="mdc-elevation--z1">
    <!-- ... content ... -->
  </div>
```

#### Elevation Overlay

The elevation overlay should appear *above* the component container in the stacking context but *below* the ripple. To accomplish this, the `.mdc-elevation-overlay` element should appear *before* the `.mdc-<component>__ripple` element in the DOM context.  Here's sample markup for a button with a touch target.

```html
<button class="mdc-button mdc-button--raised">
  <div class="mdc-elevation-overlay"></div>
  <div class="mdc-button__ripple"></div>
  <i class="material-icons mdc-button__icon" aria-hidden="true">favorite</i>
  <span class="mdc-button__label">Font Icon</span>
</button>
```

This ensures the ripple parts are rendered *above* the overlay.

### Styles

```scss
@import "@material/elevation/mdc-elevation";
```

## Style Customization

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
`mdc-elevation-overlay-common` | Called once per application to setup the universal elevation overlay styles
`mdc-elevation-shadow($box-shadow)` | Sets the `box-shadow` of the closest parent selector
`mdc-elevation-overlay-parent` | Sets the positioning of the overlay's parent element so that the overlay can be appropriately centered
`mdc-elevation-overlay-size($width, $height: $width)` | Sets the width and height of the elevation overlay
`mdc-elevation-overlay-fill-color($color)` | Sets the color of the elevation overlay
`mdc-elevation-overlay-opacity($opacity)` | Sets the opacity of the elevation overlay


Function | Description
--- | ---
`mdc-elevation-transition-value($duration, $easing)` | Returns a value for the `transition` property to transition an element between elevations
`mdc-elevation-overlay-transition-value($duration, $easing)` | Returns a value for the `transition` property to transition the elevation overlay between elevations

Variable | Description
--- | ---
`$mdc-elevation-property` | Default property for elevation transitions
`$mdc-elevation-transition-duration` | Default duration value for elevation transitions
`$mdc-elevation-transition-timing-function` | Default easing value for elevation transitions
`$mdc-elevation-overlay-color` | Default color for the elevation overlay
`$mdc-elevation-overlay-property` | Default property for the elevation overlay transitions

If you need more configurability over your transitions, use the `mdc-elevation-transition-value` function in conjunction with the exported sass variables.

```scss
.my-component-with-custom-transitions {

  transition:
    mdc-elevation-transition-value(),
    /* Configure opacity to use same duration and easing values as elevation */
    opacity $mdc-elevation-transition-duration $mdc-elevation-transition-timing-function;
  opacity: .7;
  will-change: $mdc-elevation-property, opacity;
}
```
