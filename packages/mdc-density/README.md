<!--docs:
title: "Density"
layout: detail
section: components
excerpt: "Density subsystem provides adaptive layout to components."
path: /catalog/density/
-->

# Density

Density subsystem provides adaptive layout to components. Material Design uses low-density space by default but offers high-density space when it improves the user experience. Components with high density enable users to process and take action against large amounts of information in a more manageable way. List, tables, and long forms are components that benefit from increased density.

## Installation

```
npm install @material/density
```

> NOTE: You do not need to directly depend on `@material/density`, Use component provided density Sass mixins instead.

## Basic Usage

The styles for applying density to button component instance looks like this:

```scss
@import "@material/button/mixins";

.my-custom-button {
  // Sets button density scale to `-3`, i.e. button height to `24px`.
  @include mdc-button-density(-3);
}
```

This would apply `-3` (high density) to button component instance.

> You would indirectly use the Density API through respective component's mixin which takes care of setting appropriate
> component height.

## Density Mixins

Components that supports density provides Sass mixins to customize density for that component. Each density mixin takes in a density scale number, e.g. 0 (the default) or -1 (higher density).

Currently, the density system only allows negative numbers to customize for high density. The lower the density scale, the higher the component density. The exact density scale range depends on the component. If the scale number is unsupported by the component density mixin, the compiler will report an error at build time.

The height or size of a component is calculated with the following formula:

```scss
$height: $mdc-button-height + $mdc-density-interval * $density-scale
/// @example 36px + 4px * (-3) => 24px
```

The density interval is set to 4px for visual consistency.

It is recommended to customize density via the provided density mixins, rather than arbitrarily applying component height.

NOTE: Touch targets are automatically disabled when density mixins are applied, since dense components should be optionally enabled and therefore do not have the same default accessibility requirements.

## Style Customization

This package is used as utility for other components' density mixins. Customizations provided by this package is not intended to
be consumed directly by developers, use component's density mixin instead.

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
