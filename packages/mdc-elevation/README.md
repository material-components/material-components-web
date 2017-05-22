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

MDC Elevation provides Sass mixins and CSS classes which are used to provide [shadows and
elevation](https://material.io/guidelines/what-is-material/elevation-shadows.html) to our material
components.

The elevation values are mapped out in a "z-space" and range from `0` to `24`.
Our implementation is based on [Scott Hyndman's work](http://codepen.io/shyndman/full/ojxmdY/),
which was created in collaboration with the designers on the Material Design team.

> **A note about "z-space"**: Within the spec, elevation is normally referred to as having a `dp`
> value. In other words, how many "pixels" above the base material is a piece of material elevated.
> On a computer, this is normally represented by a 3-d coordinate system. We like `z-space` (or
> just "z" for short) because it aligns with the technical definition of, and nomenclature for,
> a 3-d coordinate system. Therefore, we feel it makes more sense than `dp`. However, when we refer
> to `z-space` (or `z`), that can be used interchangeably with the spec's `dp`.

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

### Sass Mixin

MDC Elevation exports an `mdc-elevation` mixin which can be used to set the elevation on a selector.
It works by assigning the correct elevation value to a selector's `box-shadow` property.

`mdc-elevation` takes one `$z-value` argument which represents the z-space for that given elevation. For example, [cards](https://material.io/guidelines/components/cards.html) have a resting elevation of `2dp`. Implementing that using MDC Elevation looks like the following:

```scss
@import "@material/elevation/mixins";

.mdc-card {
  @include mdc-elevation(2);
  // ...
}
```

It is also quite simple to alias common elevations throughout your application by leveraging this
mixin to export classes:

```scss
$elevations: (low, medium-low, medium, medium-high, high);

@for $i from 1 through length($elevations) {
  $elev: nth($elevations, $i);
  $z: $i * 2;
  .my-app-elevation--#{$elev} {
    @include mdc-elevation($z);
  }
}
```

Note that importing `mdc-elevation/mixins` does not output any CSS.

### CSS Classes

MDC Elevation also includes a CSS file that exports all z values as `mdc-elevation--z<N>` modifier
classes that can be easily used within HTML.

> NOTE: dist/ dir will be available post-alpha in the distributed npm package.

```html
<!-- in <head> -->
<link rel="stylesheet" href="/path/to/mdc-elevation/dist/mdc-elevation.css">
<!-- ... -->
<!-- in <body> -->
<p class="mdc-elevation--z2">Text that floats near the material surface</p>
<p class="mdc-elevation--z18">Text that floats far away from the material surface</p>
```

### Handling elevation transitions

MDC Elevation includes utilities for transitioning between elevations.

#### Sass functions/mixins

The `mdc-elevation-transition-rule` function takes an optional duration and optional easing curve and
spits out a `transition` property value shorthand with `box-shadow` specified as the property, and
either the supplied or default durations / easings for the transition.

You can also use the `mdc-elevation-transition` mixin - which takes the same arguments as the above
function - to output a `transition` property with the correct values as well as a `will-change`
property with `box-shadow` set.

```scss
@import "@material/animation/variables";
@import "@material/elevation/mixins";

.my-component {
  @include mdc-elevation(2);
  @include mdc-elevation-transition;

  &--fast-transitions {
    transition: mdc-elevation-transition-rule(180ms);
  }

  &--default-ease-transitions {
    transition: mdc-elevation-transition-rule($mdc-elevation-transition-duration, ease);
  }

  &:focus {
    @include mdc-elevation(4);
  }

  &:active {
    @include mdc-elevation(8);
  }
}
```

If you need more configurability over your transitions, you can easily accomplish this by using
the `mdc-elevation-transition-rule` function in conjunctions with the exported sass variables that
mdc-elevation exposes for purposes of transitioning.

```scss
.my-component-with-custom-transitions {
  @include mdc-elevation(2);

  transition:
    mdc-elevation-transition-rule(),
    /* Configure opacity to use same duration and easing values as elevation */
    opacity $mdc-elevation-transition-duration $mdc-elevation-transition-timing-function;
  opacity: .7;
  will-change: $mdc-elevation-property, opacity;

  &:hover {
    opacity: 1;
  }

  &:active {
    @include mdc-elevation(6);
  }
}
```

#### CSS Classes

MDC Elevation also exports an `mdc-elevation-transition` CSS class which can be used within HTML.

```html
<p class="mdc-elevation-transition mdc-elevation--z2">My elevation will change at some point...</p>
```
