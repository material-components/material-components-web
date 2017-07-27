<!--docs:
title: "Theme"
layout: detail
section: components
excerpt: "Color theming for MDC-Web components."
iconId: theme
path: /catalog/theme/
-->

# Theme

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/theme.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/themes.png" width="241" alt="Themes screenshot">
  </a>
</div>-->

This color palette comprises primary and accent colors that can be used for illustration or to develop your brand colors.

MDC Theme is a foundational module that themes MDC Web components. The colors in this module are derived from three theme colors:

* Primary: the primary color used in your application, applies to a number of UI elements.
* Accent: the accent color used in your application, applies to a number of UI elements.
* Background: the background color for your application, aka the color on top of which your UI is drawn.

and five text styles:

* Primary: used for most text
* Secondary: used for text which is lower in the visual hierarchy
* Hint: used for text hints, such as those in text fields and labels
* Disabled: used for text in disabled components and content
* Icon: used for icons

> **A note about Primary**, don't confuse primary color with primary text. The former refers to the primary theme color, that is used to establish a visual identity and color many parts of your application. The latter refers to the style of text that is most prominent (low opacity, high contrast), and used to display most content.

Some components can change their appearance when in a Dark Theme context, aka placed on top of a dark background. There are two ways to specify if a component is in a Dark Theme context. The first is to add `mdc-theme--dark` to a *container* element, which holds the component. The second way is to add `<component_name>--theme-dark` modifier class to the actual component element. For example, `mdc-button--theme-dark` would put the MDC Button in a Dark Theme context.

> **A note about Dark Theme context**, don't confuse Dark Theme context with a component that has a dark color. Dark Theme context means the component sits on top of a dark background.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/style/color.html">Material Design guidelines: Color</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/theme.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install --save @material/theme
```

## Usage

### Change Theme Colors

MDC Theme makes it easy to develop your brand colors. You override the default theme color through Sass variables or CSS custom properties. CSS custom properties enables runtime theming.

> **A note about Sass variables**, you need to define the three theme color variables before importing mdc-theme or any MDC-Web components that rely on it, like following:

```scss
$mdc-theme-primary: #9c27b0;
$mdc-theme-accent: #ffab40;
$mdc-theme-background: #fff;

@import "@material/theme/mdc-theme";
```

The text color, for text placed on top of these selected theme colors, is programmatically computed based on color contrast. We follow the Web Content Accessibility Guidelines 2.0. 

https://www.w3.org/TR/WCAG20

#### CSS Custom Properties

> **A note about `<TEXT_STYLE>` and `<THEME_COLOR>`**, `<TEXT_STYLE>` represents the lowercase name of the text styles listed above, e.g. `hint`. `<THEME_COLOR>` represents the lowercase name of the theme colors listed above, e.g. `accent`. When you put it all together it would be `--mdc-theme-text-hint-on-accent`.

CSS Custom property | Description
--- | ---
`--mdc-theme-primary` | The theme primary color
`--mdc-theme-accent` | The theme accent color
`--mdc-theme-background` | The theme background color
`--mdc-theme-text-<TEXT_STYLE>-on-<THEME_COLOR>` | Text color for TEXT_STYLE on top of THEME_COLOR background
`--mdc-theme-text-<TEXT_STYLE>-on-light` | Text color for TEXT_STYLE on top of light background
`--mdc-theme-text-<TEXT_STYLE>-on-dark` | Text color for TEXT_STYLE on top of dark background

### CSS Classes

Some components can change their appearance when a theme-based modifier CSS class is applied. For example, `mdc-button--primary` will make the MDC Button the primary color. For more documentation on these modifier classes, consult the documentation for each component.

If you want to modify an element, which is not a Material Design component, you can apply the following modifier CSS classes.

> **A note about `<TEXT_STYLE>` and `<THEME_COLOR>`**, `<TEXT_STYLE>` represents the lowercase name of the text styles listed above, e.g. `hint`. `<THEME_COLOR>` represents the lowercase name of the theme colors listed above, e.g. `accent`. When you put it all together it would be `mdc-theme--text-hint-on-accent`.

CSS Class | Description
--- | ---
`mdc-theme--primary` | Sets the text color to the theme primary color
`mdc-theme--accent` | Sets the text color to the theme accent color
`mdc-theme--background` | Sets the background color to the theme background color
`mdc-theme--primary-bg` | Sets the background color to the theme primary color
`mdc-theme--accent-bg` | Sets the background color to the theme accent color
`mdc-theme--text-<TEXT_STYLE>-on-<THEME_COLOR>` | Sets text to a suitable color for TEXT_STYLE on top of THEME_COLOR background
`mdc-theme--text-<TEXT_STYLE>-on-light` | Sets text to a suitable color for TEXT_STYLE on top of light background
`mdc-theme--text-<TEXT_STYLE>-on-dark` | Sets text to a suitable color for TEXT_STYLE on top of dark background

### Sass Mixins, Variables, and Functions

Mixin | Description
--- | --- 
`mdc-theme-prop($property, $style, $important)` | Applies a theme color to a property
`mdc-theme-dark($root-selector, $compound)` | Creates a rule that is applied when the current selector is within an Dark Theme context

#### `mdc-theme-dark($root-selector, $compound)`

Creates a rule that is applied when the current selector is within an Dark Theme context. If you are using the mixin on anything other than the base selector of the component, e.g. `.mdc-button`, you need to specify `$root-selector` as the base selector as a parameter. You can also specify `$compound` to true if the the current selector is a compound selector with the base selector, e.g. a modifier class to the component root element.

#### `mdc-theme-prop` Properties

These properties can be used as the `$property` argument for `mdc-theme-prop` mixin.

> **A note about `<TEXT_STYLE>` and `<THEME_COLOR>`**, `<TEXT_STYLE>` represents the lowercase name of the text styles listed above, e.g. `hint`. `<THEME_COLOR>` represents the lowercase name of the theme colors listed above, e.g. `accent`. When you put it all together it would be `text-hint-on-accent`.

Property Name | Description
--- | ---
`primary` | The theme primary color
`accent` | The theme accent color
`background` | The theme background color
`text-<TEXT_STYLE>-on-<THEME_COLOR>` | TEXT_STYLE on top of THEME_COLOR background
`text-<TEXT_STYLE>-on-light` | TEXT_STYLE on top of a light background
`text-<TEXT_STYLE>-on-dark` | TEXT_STYLE on top of a dark background

#### `mdc-theme-luminance`

Calculates the luminance value (0 - 1) of a given color.

```scss
@debug mdc-theme-luminance(#9c27b0); // 0.11654
```

#### `mdc-theme-contrast`

Calculates the contrast ratio between two colors.

```scss
@debug mdc-theme-contrast(#9c27b0, #000); // 3.33071
```

#### `mdc-theme-light-or-dark`

Determines whether to use light or dark text on top of a given color.

```scss
@debug mdc-theme-light-or-dark(#9c27b0); // light
```
