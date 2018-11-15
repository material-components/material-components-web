<!--docs:
title: "Theme"
layout: detail
section: components
excerpt: "Color theming for MDC Web components."
iconId: theme
path: /catalog/theme/
-->

# Theme

The Material Design color system can be used to create a color scheme that reflects your brand or style.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-theming">Material Design guidelines: Color</a>
  </li>
</ul>

## Installation

```
npm install @material/theme
```

## Usage

### Color Scheme

You can define the theme color variables before importing any MDC Web components:

```scss
$mdc-theme-primary: #fcb8ab;
$mdc-theme-secondary: #feeae6;
$mdc-theme-on-primary: #442b2d;
$mdc-theme-on-secondary: #442b2d;

@import "@material/button/mdc-button";
```

We suggest you follow the Web Content Accessibility Guidelines 2.0 when picking the values for on-primary, on-secondary, etc. These values should be accessible on top of the corresponding value, e.g. primary and secondary.

https://www.w3.org/TR/WCAG20

### Advanced customization

Color scheme will only get you 80% of the way to a well-designed app. Inevitably there will be some components that do not work "out of the box". To fix problems with accessibility and design, we suggest you use our Sass mixins, such as `mdc-button-filled-accessible`. For more information, consult the documentation for each component.

### Non-Sass customization

Only a very limited number of Material Design color customization features are supported for non-Sass clients. They are a set of CSS custom properties, and a set of CSS classes.

#### CSS Custom Properties

**A note about `<TEXT_STYLE>`**, `<TEXT_STYLE>` represents the lowercase name of the text styles listed above, e.g. `hint`.

CSS Custom property | Description
--- | ---
`--mdc-theme-primary` | The theme primary color
`--mdc-theme-secondary` | The theme secondary color
`--mdc-theme-background` | The theme background color
`--mdc-theme-surface` | The theme surface color
`--mdc-theme-on-primary` | Text color on top of a primary background
`--mdc-theme-on-secondary` | Text color on top of a secondary background
`--mdc-theme-on-surface` | Text color on top of a surface background
`--mdc-theme-text-<TEXT_STYLE>-on-light` | Text color for TEXT_STYLE on top of light background
`--mdc-theme-text-<TEXT_STYLE>-on-dark` | Text color for TEXT_STYLE on top of dark background

#### CSS Classes

> **A note about `<TEXT_STYLE>`**, `<TEXT_STYLE>` represents the lowercase name of the text styles listed above, e.g. `hint`.

CSS Class | Description
--- | ---
`mdc-theme--primary` | Sets the text color to the theme primary color
`mdc-theme--secondary` | Sets the text color to the theme secondary color
`mdc-theme--background` | Sets the background color to the theme background color
`mdc-theme--surface` | Sets the surface color to the theme surface color
`mdc-theme--on-primary` | Sets the text color to the theme on-primary color
`mdc-theme--on-secondary` | Sets the text color to the theme on-secondary color
`mdc-theme--on-surface` | Sets the text color to the theme on-surface color
`mdc-theme--primary-bg` | Sets the background color to the theme primary color
`mdc-theme--secondary-bg` | Sets the background color to the theme secondary color
`mdc-theme--text-<TEXT_STYLE>-on-light` | Sets text to a suitable color for TEXT_STYLE on top of light background
`mdc-theme--text-<TEXT_STYLE>-on-dark` | Sets text to a suitable color for TEXT_STYLE on top of dark background

### Sass Mixins, Variables, and Functions

Mixin | Description
--- | ---
`mdc-theme-prop($property, $style, $important, $edgeOptOut)` | Applies a theme color or a custom color to a CSS property, optionally with `!important`. If `$edgeOptOut` is `true` and a theme color is passed, the style will be wrapped in a `@supports` clause to exclude the style in Edge to avoid issues with its buggy CSS variable support.

#### `mdc-theme-prop` Properties

The properties below can be used as the `$style` argument for the `mdc-theme-prop` mixin. Literal color values (e.g., `rgba(0, 0, 0, .75)`) may also be used instead.

**A note about `<TEXT_STYLE>`**, `<TEXT_STYLE>` represents the lowercase name of the text styles listed above, e.g. `hint`.

Property Name | Description
--- | ---
`primary` | The theme primary color
`secondary` | The theme secondary color
`background` | The theme background color
`surface` | The theme surface color
`text-<TEXT_STYLE>-on-light` | TEXT_STYLE on top of a light background
`text-<TEXT_STYLE>-on-dark` | TEXT_STYLE on top of a dark background
`on-primary` | A text/iconography color that is usable on top of primary color
`on-secondary` | A text/iconography color that is usable on top of secondary color
`on-surface` | A text/iconography color that is usable on top of surface color


#### `mdc-theme-luminance($color)`

Calculates the luminance value (0 - 1) of a given color.

```scss
@debug mdc-theme-luminance(#9c27b0); // 0.11654
```

#### `mdc-theme-contrast($back, $front)`

Calculates the contrast ratio between two colors.

```scss
@debug mdc-theme-contrast(#9c27b0, #000); // 3.33071
```

#### `mdc-theme-tone($color)`

Determines whether the given color is "light" or "dark".

If the input color is a string literal equal to `"light"` or `"dark"`, it will be returned verbatim.

```scss
@debug mdc-theme-tone(#9c27b0); // dark
@debug mdc-theme-tone(light);   // light
```

#### `mdc-theme-contrast-tone($color)`

Determines whether to use light or dark text on top of a given color.

```scss
@debug mdc-theme-contrast-tone(#9c27b0); // light
```

#### `mdc-theme-prop-value($style)`

If `$style` is a color (a literal color value, `currentColor`, or a CSS custom property), it is returned verbatim.
Otherwise, `$style` is treated as a theme property name, and the corresponding value from `$mdc-theme-property-values`
is returned. If this also fails, an error is thrown.

This is mainly useful in situations where `mdc-theme-prop` cannot be used directly (e.g., `box-shadow`).

Unlike the `mdc-theme-prop` mixin, this function does _not_ support CSS custom properties.
It only returns the raw color value of the specified theme property.

> NOTE: This function is defined in `_variables.scss` instead of `_functions.scss` to avoid circular imports.

```scss
@debug mdc-theme-prop-value(primary); // #3f51b5
@debug mdc-theme-prop-value(blue);    // blue
```

#### `mdc-theme-accessible-ink-color($fill-color, $text-style: primary)`

Returns an accessible ink color that has sufficient contrast against the given fill color.

Params:

- `$fill-color`: Supports the same values as `mdc-theme-prop-value`
- `$text-style`: Value must be one of `primary`, `secondary`, `hint`, `disabled`, `icon` (see `$mdc-theme-text-colors`)

> NOTE: This function is defined in `_variables.scss` instead of `_functions.scss` to avoid circular imports.

```scss
@debug mdc-theme-accessible-ink-color(secondary); // rgba(0, 0, 0, .87) (text-primary-on-light)
@debug mdc-theme-accessible-ink-color(blue);      // white              (text-primary-on-dark)
```
#### `mdc-theme-text-emphasis($emphasis)`

Returns opacity value for given emphasis.

Params:

- `$emphasis`: Type of emphasis such as `high`, `medium` & `disabled`.

```scss
@debug mdc-theme-text-emphasis(high); // .87
@debug mdc-theme-text-emphasis(disabled); // .38
```
