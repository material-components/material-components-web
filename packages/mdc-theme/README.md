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

MDC Theme is a foundational module that provides theming to MDC-Web components. The module makes Sass functions, 
mixins, CSS custom properties, and a set of CSS classes available to developers.

The colors in this module are derived from the three theme colors in MDC-Web:
- Primary: the primary color used in your application. This applies to a number of UI elements, such as app bars.
- Accent: the accent color used in your application. This applies to UI elements such as FABs.
- Background: the background color for your application. This is the color on top of which your UI is drawn.

When using the theme colors as background, it becomes important to choose a text color with sufficient contrast.
In addition, it's important to consider the style of text:
- Primary, used for most text.
- Secondary, used for text which is lower in the visual hierarchy.
- Hint, used for text hints (such as those in text fields and labels).
- Disabled, used for text in disabled components and content.
- Icon, used for icons.

> Note: Don't confuse primary color with primary text. The former refers to the primary theme color, that is used
to establish a visual identity and color many parts of your application. The latter refers to the style of text
that is most prominent (low opacity, high contrast), and used to display most content.

## Installation

```
npm install --save @material/theme
```

## Usage

### Themeing

MDC Theme mixins use CSS custom properties for browsers that support it, with a fallback to a pre-processed 
static color if they don't. This enables runtime theming if CSS properties are available.

To set the theme colors for your application, simply define the three theme color variables before importing 
`mdc-theme` or any MDC-Web components that rely on it:

```scss
$mdc-theme-primary: #9c27b0;
$mdc-theme-accent: #ffab40;
$mdc-theme-background: #fff;

@import "@material/theme/mdc-theme";
```

The correct text colors will automatically be calculated based on the provided theme colors.

### CSS Custom properties

| CSS Custom property | Description |
| ------------------------------------------ | - |
| `--mdc-theme-primary` | The theme primary color. |
| `--mdc-theme-accent` | The theme accent color. |
| `--mdc-theme-background` | The theme background color. |
| `--mdc-theme-text-primary-on-primary` | Primary text on top of a theme primary color background. |
| `--mdc-theme-text-secondary-on-primary` | Secondary text on top of a theme primary color background. |
| `--mdc-theme-text-hint-on-primary` | Hint text on top of a theme primary color background. |
| `--mdc-theme-text-disabled-on-primary` | Disabled text on top of a theme primary color background. |
| `--mdc-theme-text-icon-on-primary` | Icons on top of a theme primary color background. |
| `--mdc-theme-text-primary-on-accent` | Primary text on top of a theme accent color background. |
| `--mdc-theme-text-secondary-on-accent` | Secondary text on top of a theme accent color background. |
| `--mdc-theme-text-hint-on-accent` | Hint text on top of a theme accent color background. |
| `--mdc-theme-text-disabled-on-accent` | Disabled text on top of a theme accent color background. |
| `--mdc-theme-text-icon-on-accent` | Icons on top of a theme accent color background. |
| `--mdc-theme-text-primary-on-background` | Primary text on top of the theme background. |
| `--mdc-theme-text-secondary-on-background` | Secondary text on top of the theme background. |
| `--mdc-theme-text-hint-on-background` | Hint text on top of the theme background. |
| `--mdc-theme-text-disabled-on-background` | Disabled text on top of the theme background. |
| `--mdc-theme-text-icon-on-background` | Icons on top of the theme background. |
| `--mdc-theme-text-primary-on-light` | Primary text on top of a light-colored background. |
| `--mdc-theme-text-secondary-on-light` | Secondary text on top of a light-colored background. |
| `--mdc-theme-text-hint-on-light` | Hint text on top of a light-colored background. |
| `--mdc-theme-text-disabled-on-light` | Disabled text on top of a light-colored background. |
| `--mdc-theme-text-icon-on-light` | Icons on top of a light-colored background. |
| `--mdc-theme-text-primary-on-dark` | Primary text on top of a dark-colored background. |
| `--mdc-theme-text-secondary-on-dark` | Secondary text on top of a dark-colored background. |
| `--mdc-theme-text-hint-on-dark` | Hint text on top of a dark-colored background. |
| `--mdc-theme-text-disabled-on-dark` | Disabled text on top of a dark-colored background. |
| `--mdc-theme-text-icon-on-dark` | Icons on top of a dark-colored background. |

### Sass Mixins, Variables, and Functions

| Mixin | Description |
| ----------------------------------------------- | - |
| `mdc-theme-prop($property, $style, $important)` | Applies a theme color to a property |
| `mdc-theme-dark($root-selector, $compound)` | Creates a rule that is applied when the root element is within an Dark Theme context. If using the mixin on anything other than the base selector, you need to specify the base selector as a parameter. If using the mixin with a modifier class, pass `true` for the second argument. |

#### Properties

| PropertyName                   | Description |
| ------------------------------ | - |
| `primary` | The theme primary color. |
| `accent` | The theme accent color. |
| `background` | The theme background color. |
| `text-primary-on-primary`      | Primary text on top of a theme primary color background.   |
| `text-secondary-on-primary`    | Secondary text on top of a theme primary color background. |
| `text-hint-on-primary`         | Hint text on top of a theme primary color background.      |
| `text-disabled-on-primary`     | Disabled text on top of a theme primary color background.  |
| `text-icon-on-primary`         | Icons on top of a theme primary color background.          |
| `text-primary-on-accent`       | Primary text on top of a theme accent color background.    |
| `text-secondary-on-accent`     | Secondary text on top of a theme accent color background.  |
| `text-hint-on-accent`          | Hint text on top of a theme accent color background.       |
| `text-disabled-on-accent`      | Disabled text on top of a theme accent color background.   |
| `text-icon-on-accent`          | Icons on top of a theme accent color background.           |
| `text-primary-on-background`   | Primary text on top of the theme background.               |
| `text-secondary-on-background` | Secondary text on top of the theme background.             |
| `text-hint-on-background`      | Hint text on top of the theme background.                  |
| `text-disabled-on-background`  | Disabled text on top of the theme background.              |
| `text-icon-on-background`      | Icons on top of the theme background.                      |
| `text-primary-on-light`        | Primary text on top of a light-colored background.         |
| `text-secondary-on-light`      | Secondary text on top of a light-colored background.       |
| `text-hint-on-light`           | Hint text on top of a light-colored background.            |
| `text-disabled-on-light`       | Disabled text on top of a light-colored background.        |
| `text-icon-on-light`           | Icons on top of a light-colored background.                |
| `text-primary-on-dark`         | Primary text on top of a dark-colored background.          |
| `text-secondary-on-dark`       | Secondary text on top of a dark-colored background.        |
| `text-hint-on-dark`            | Hint text on top of a dark-colored background.             |
| `text-disabled-on-dark`        | Disabled text on top of a dark-colored background.         |
| `text-icon-on-dark`            | Icons on top of a dark-colored background.                 |

#### mdc-theme-luminance

Calculates the luminance value (0 - 1) of a given color.

```scss
@debug mdc-theme-luminance(#9c27b0); // 0.11654
```

#### mdc-theme-contrast

Calculates the contrast ratio between two colors.

```scss
@debug mdc-theme-contrast(#9c27b0, #000); // 3.33071
```

#### mdc-theme-light-or-dark

Determines whether to use light or dark text on top of a given color.

```scss
@debug mdc-theme-light-or-dark(#9c27b0); // light
```

### CSS Classes

| CSS Class | Description |
| --------------------------------------- | - |
| `mdc-theme--primary` | Sets the text color to the theme primary color. |
| `mdc-theme--accent` | Sets the text color to the theme accent color. |
| `mdc-theme--background` | Sets the background color to the theme background color. |
| `mdc-theme--primary-bg` | Sets the background color to the theme primary color. |
| `mdc-theme--accent-bg` | Sets the background color to the theme accent color. |
| `mdc-theme--text-primary-on-primary` | Sets text to a suitable color for primary text on top of a theme primary color background. |
| `mdc-theme--text-secondary-on-primary` | Sets text to a suitable color for secondary text on top of a theme primary color background. |
| `mdc-theme--text-hint-on-primary` | Sets text to a suitable color for hint text on top of a theme primary color background. |
| `mdc-theme--text-disabled-on-primary` | Sets text to a suitable color for disabled text on top of a theme primary color background. |
| `mdc-theme--text-icon-on-primary` | Sets text to a suitable color for icons on top of a theme primary color background. |
| `mdc-theme--text-primary-on-accent` | Sets text to a suitable color for primary text on top of a theme accent color background. |
| `mdc-theme--text-secondary-on-accent` | Sets text to a suitable color for secondary text on top of a theme accent color background. |
| `mdc-theme--text-hint-on-accent` | Sets text to a suitable color for hint text on top of a theme accent color background. |
| `mdc-theme--text-disabled-on-accent` | Sets text to a suitable color for disabled text on top of a theme accent color background. |
| `mdc-theme--text-icon-on-accent` | Sets text to a suitable color for icons on top of a theme accent color background. |
| `mdc-theme--text-primary-on-background` | Sets text to a suitable color for primary text on top of the theme background. 
| `mdc-theme--text-secondary-on-background` | Sets text to a suitable color for secondary text on top of the theme background. |
| `mdc-theme--text-hint-on-background` | Sets text to a suitable color for hint text on top of the theme background. |
| `mdc-theme--text-disabled-on-background` | Sets text to a suitable color for disabled text on top of the theme background. |
| `mdc-theme--text-icon-on-background` | Sets text to a suitable color for icons on top of the theme background. |
| `mdc-theme--text-primary-on-light` | Sets text to a suitable color for primary text on top of a light-colored background. |
| `mdc-theme--text-secondary-on-light` | Sets text to a suitable color for secondary text on top of a light-colored background. |
| `mdc-theme--text-hint-on-light` | Sets text to a suitable color for hint text on top of a light-colored background. |
| `mdc-theme--text-disabled-on-light` | Sets text to a suitable color for disabled text on top of a light-colored background. |
| `mdc-theme--text-icon-on-light` | Sets text to a suitable color for icons on top of a light-colored background. |
| `mdc-theme--text-primary-on-dark` | Sets text to a suitable color for primary text on top of a dark-colored background. |
| `mdc-theme--text-secondary-on-dark` | Sets text to a suitable color for secondary text on top of a dark-colored background. |
| `mdc-theme--text-hint-on-dark` | Sets text to a suitable color for hint text on top of a dark-colored background. |
| `mdc-theme--text-disabled-on-dark` | Sets text to a suitable color for disabled text on top of a dark-colored background. |
| `mdc-theme--text-icon-on-dark` | Sets text to a suitable color for icons on top of a dark-colored background. |
