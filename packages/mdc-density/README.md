<!--docs:
title: "Density"
layout: detail
section: components
excerpt: "Density subsystem provides adaptive layout to components."
path: /catalog/density/
-->

# Density

Density subsystem provides adaptive layout to components.

## Installation

```
npm install @material/density
```

## Basic Usage

### Styles

This package is used as utility for other components' density mixins. Mixin provided by this package is not intended to
be consumed directly by developers, use component's density mixin instead.

The styles for applying density to button component instance looks like this:

```scss
@import "@material/button/mixins";

.my-custom-button {
  @include mdc-button-density(-3);
}
```

This would apply `-3` (high density) to button component instance.

> You would indirectly use the Density API through respective component's mixin which takes care of setting appropriate
> component height.

## Style Customization

### Sass Variables

Variable | Description
--- | ---
`$mdc-density-interval` | Density interval between each dense scale. This interval is used for numbered density scale to calculate dense height based on baseline component height.
`$mdc-density-minimum-scale` | Minimum scale supported by density subsystem. This scale always maps to highest dense scale.
`$mdc-density-maximum-scale` | Maximum scale supported by density subsystem. This scale always maps to lowest dense scale.
`$mdc-density-supported-scales` | Supported density scale when density literal is used (For example, `minimum`).

### Sass Functions

Function | Description
--- | ---
`mdc-density-prop-value($density-config, $density-scale, $property-name)` | Returns component property value based on given density config and density scale.
