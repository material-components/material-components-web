<!--docs:
title: "Theme"
layout: detail
section: components
excerpt: "Color theming for MDC Web components."
iconId: theme
path: /catalog/theme/
-->

# Theme

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/theme/index.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/themes.png" width="241" alt="Themes screenshot">
  </a>
</div>-->

This color palette comprises primary and secondary colors that can be used for illustration or to develop your brand colors.

MDC Theme is a foundational module that themes MDC Web components. The colors in this module are derived from three theme colors:

* Primary: the primary color used in your application, applies to a number of UI elements.
* Secondary: the secondary color used in your application, applies to a number of UI elements. (Previously called "accent".)
* Background: the background color for your application, aka the color on top of which your UI is drawn.

and five text styles:

* Primary: used for most text
* Secondary: used for text which is lower in the visual hierarchy
* Hint: used for text hints, such as those in text fields and labels
* Disabled: used for text in disabled components and content
* Icon: used for icons

> **A note about Primary and Secondary**, don't confuse primary/secondary _color_ with primary/secondary _text_. The former refers to the primary/secondary _theme_ color that is used to establish a visual identity and color many parts of your application. The latter refers to the style of text that is most prominent (low opacity, high contrast), and used to display most content.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/style/color.html">Material Design guidelines: Color</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/theme/index.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install --save @material/theme
```

## Usage

### Change Theme Colors

MDC Theme makes it easy to develop your brand colors. You override the default theme color through Sass variables or CSS custom properties. CSS custom properties enables runtime theming.

> **A note about Sass variables**, you need to define the three theme color variables before importing mdc-theme or any MDC Web components that rely on it, like following:

```scss
$mdc-theme-primary: #9c27b0; // Purple 500
$mdc-theme-secondary: #ffab40; // Orange A200
$mdc-theme-background: #fff; // White

@import "@material/theme/mdc-theme";
```

> **A note about `$mdc-theme-secondary`**: This variable was previously named `$mdc-theme-accent`.
> For backward compatibility, `$mdc-theme-accent` still exists, but it is **deprecated**.
> Apps that previously customized `$mdc-theme-accent` will continue to work, but new apps should use
> `$mdc-theme-secondary` instead.

MDC Theme also exposes _light_ and _dark_ variants of the primary and secondary colors. By default, these values are
computed by lightening and darkening the main primary/secondary colors in Sass, but you can override them if desired:

```scss
$mdc-theme-primary-light: #ce93d8; // Purple 200
$mdc-theme-primary-dark: #6a1b9a; // Purple 800
$mdc-theme-secondary-light: #ffd180; // Orange A100
$mdc-theme-secondary-dark: #ff6d00; // Orange A700

@import "@material/theme/mdc-theme";
```

The text color, for text placed on top of these selected theme colors, is programmatically computed based on color contrast. We follow the Web Content Accessibility Guidelines 2.0.

https://www.w3.org/TR/WCAG20

#### CSS Custom Properties

> **A note about `<TEXT_STYLE>` and `<THEME_COLOR>`**, `<TEXT_STYLE>` represents the lowercase name of the text styles listed above, e.g. `hint`. `<THEME_COLOR>` represents the lowercase name of the theme colors listed above, e.g. `secondary`. When you put it all together it would be `--mdc-theme-text-hint-on-secondary`.

CSS Custom property | Description
--- | ---
`--mdc-theme-primary` | The theme primary color
`--mdc-theme-primary-light` | The theme primary color (light variant)
`--mdc-theme-primary-dark` | The theme primary color (dark variant)
`--mdc-theme-secondary` | The theme secondary color
`--mdc-theme-secondary-light` | The theme secondary color (light variant)
`--mdc-theme-secondary-dark` | The theme secondary color (dark variant)
`--mdc-theme-background` | The theme background color
`--mdc-theme-text-<TEXT_STYLE>-on-<THEME_COLOR>` | Text color for TEXT_STYLE on top of THEME_COLOR background
`--mdc-theme-text-<TEXT_STYLE>-on-light` | Text color for TEXT_STYLE on top of light background
`--mdc-theme-text-<TEXT_STYLE>-on-dark` | Text color for TEXT_STYLE on top of dark background

### CSS Classes

MDC Web provides SASS mixins, such as `mdc-button-filled-accessible`, to facilitate customization of some components. For more information, consult the documentation for each component.

If you want to modify an element, which is not a Material Design component, you can apply the following modifier CSS classes.

> **A note about `<TEXT_STYLE>` and `<THEME_COLOR>`**, `<TEXT_STYLE>` represents the lowercase name of the text styles listed above, e.g. `hint`. `<THEME_COLOR>` represents the lowercase name of the theme colors listed above, e.g. `secondary`. When you put it all together it would be `mdc-theme--text-hint-on-secondary`.

CSS Class | Description
--- | ---
`mdc-theme--primary` | Sets the text color to the theme primary color
`mdc-theme--primary-light` | Sets the text color to the theme primary color (light variant)
`mdc-theme--primary-dark` | Sets the text color to the theme primary color (dark variant)
`mdc-theme--secondary` | Sets the text color to the theme secondary color
`mdc-theme--secondary-light` | Sets the text color to the theme secondary color (light variant)
`mdc-theme--secondary-dark` | Sets the text color to the theme secondary color (dark variant)
`mdc-theme--background` | Sets the background color to the theme background color
`mdc-theme--primary-bg` | Sets the background color to the theme primary color
`mdc-theme--primary-light-bg` | Sets the background color to the theme primary color (light variant)
`mdc-theme--primary-dark-bg` | Sets the background color to the theme primary color (dark variant)
`mdc-theme--secondary-bg` | Sets the background color to the theme secondary color
`mdc-theme--secondary-light-bg` | Sets the background color to the theme secondary color (light variant)
`mdc-theme--secondary-dark-bg` | Sets the background color to the theme secondary color (dark variant)
`mdc-theme--text-<TEXT_STYLE>-on-<THEME_COLOR>` | Sets text to a suitable color for TEXT_STYLE on top of THEME_COLOR background
`mdc-theme--text-<TEXT_STYLE>-on-light` | Sets text to a suitable color for TEXT_STYLE on top of light background
`mdc-theme--text-<TEXT_STYLE>-on-dark` | Sets text to a suitable color for TEXT_STYLE on top of dark background

### Sass Mixins, Variables, and Functions

Mixin | Description
--- | ---
`mdc-theme-prop($property, $style, $important, $edgeOptOut)` | Applies a theme color or a custom color to a CSS property, optionally with `!important`. If `$edgeOptOut` is `true` and a theme color is passed, the style will be wrapped in a `@supports` clause to exclude the style in Edge to avoid issues with its buggy CSS variable support.

#### `mdc-theme-prop` Properties

The properties below can be used as the `$style` argument for the `mdc-theme-prop` mixin. Literal color values (e.g., `rgba(0, 0, 0, .75)`) may also be used instead.

> **A note about `<TEXT_STYLE>` and `<THEME_COLOR>`**, `<TEXT_STYLE>` represents the lowercase name of the text styles listed above, e.g. `hint`. `<THEME_COLOR>` represents the lowercase name of the theme colors listed above, e.g. `secondary`. When you put it all together it would be `text-hint-on-secondary`.

Property Name | Description
--- | ---
`primary` | The theme primary color
`primary-light` | The theme primary color (light variant)
`primary-dark` | The theme primary color (dark variant)
`secondary` | The theme secondary color
`secondary-light` | The theme secondary color (light variant)
`secondary-dark` | The theme secondary color (dark variant)
`background` | The theme background color
`text-<TEXT_STYLE>-on-<THEME_COLOR>` | TEXT_STYLE on top of THEME_COLOR background
`text-<TEXT_STYLE>-on-light` | TEXT_STYLE on top of a light background
`text-<TEXT_STYLE>-on-dark` | TEXT_STYLE on top of a dark background

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

#### `mdc-theme-light-variant($color)` and `mdc-theme-dark-variant($color)`

Function | Description
--- | ---
`mdc-theme-dark-variant($color, $num-indexes)` | Darken a color by a certain number of indexes within its tonal palette
`mdc-theme-light-variant($color, $num-indexes)` | Lighten a color by a certain number of indexes within its tonal palette

Both functions are luminance-aware, and will always return a color that is visually distinct from both the input color
_and_ the other function.

That is, if the color passed to `mdc-theme-dark-variant()` is already so dark that darkening it by the requested amount
would return `#000000`, the function will _lighten_ the color instead.

Similarly, if the color passed to `mdc-theme-light-variant()` is already so light that lightening it by the requested
amount would return `#ffffff`, the function will _darken_ the color instead.

To avoid having both functions return the same color in cases of extremely high or low input luminance,
`mdc-theme-dark-variant()` will return a color that is _twice_ (×2) as dark as requested when the input is already very
light. Likewise, `mdc-theme-light-variant()` will return a color that is _twice_ (×2) as light as requested when the
input is already very dark. This ensures that the _light_ variant will always be lighter than the _dark_ variant.

#### `mdc-theme-prop-value($property)`

If `$property` is a literal color value (e.g., `blue`, `#fff`), it is returned verbatim. Otherwise, the value of the
corresponding theme property (from `$mdc-theme-property-values`) is returned. If `$property` is not a color and no
such theme property exists, an error is thrown.

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
