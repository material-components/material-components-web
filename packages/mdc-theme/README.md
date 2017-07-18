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

MDC Theme is a foundational module that provides theming to MDC-Web components, and also makes it available to
developers as Sass functions and mixins, as CSS custom properties, and as a set of CSS classes.

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

The text contrast colors are automatically calculated at the Sass level and exposed as part of this module.

## Installation

```
npm install --save @material/theme
```

## Usage

### Sass

#### Changing the theme colors

MDC Theme makes it quite easy to change the theme colors for your application, and have the changes apply to all MDC-Web
components. Simply define the three theme color variables before importing `mdc-theme` or any MDC-Web components that rely
on it:

```scss
$mdc-theme-primary: #9c27b0;
$mdc-theme-accent: #ffab40;
$mdc-theme-background: #fff;

@import "@material/theme/mdc-theme";
```

The correct text colors will automatically be calculated based on the provided theme colors.


#### mdc-theme-prop mixin

MDC Theme exports an `mdc-theme-prop` mixin, which can be used to apply a theme color to a property. The mixin takes the
property name as the first parameter, and the desired color as the second one. It also has an optional boolean parameter
for whether `!important` should be applied to the value.

For example, if you wanted to set the background of `.foo` to the primary color, and the text color to suit primary text
on top of it:

```scss
@import "@material/theme/mixins";

.foo {
  @include mdc-theme-prop(background-color, primary);
  @include mdc-theme-prop(color, text-primary-on-primary);
}
```

This generates the following CSS:

```css
.foo {
  background-color: #9c27b0;
  background-color: var(--mdc-theme-primary);
  color: #fff;
  color: var(--mdc-theme-text-primary-on-primary);
}
```

The generated code uses CSS custom properties for browsers that support it, with a fallback to a pre-processed static
color if they don't. This enables runtime theming if CSS properties are available, in addition to the static theming
described in the "Changing the theme colors" section.

Here is the full list of colors available to the mixin:

##### Theme colors

| Class        | Description                 |
| ------------ | --------------------------- |
| `primary`    | The theme primary color.    |
| `accent`     | The theme accent color.     |
| `background` | The theme background color. |

##### Text on a theme primary color background

| Class                          | Description                                                |
| ------------------------------ | ---------------------------------------------------------- |
| `text-primary-on-primary`      | Primary text on top of a theme primary color background.   |
| `text-secondary-on-primary`    | Secondary text on top of a theme primary color background. |
| `text-hint-on-primary`         | Hint text on top of a theme primary color background.      |
| `text-disabled-on-primary`     | Disabled text on top of a theme primary color background.  |
| `text-icon-on-primary`         | Icons on top of a theme primary color background.          |

##### Text on a theme accent color background

| Class                          | Description                                                |
| ------------------------------ | ---------------------------------------------------------- |
| `text-primary-on-accent`       | Primary text on top of a theme accent color background.    |
| `text-secondary-on-accent`     | Secondary text on top of a theme accent color background.  |
| `text-hint-on-accent`          | Hint text on top of a theme accent color background.       |
| `text-disabled-on-accent`      | Disabled text on top of a theme accent color background.   |
| `text-icon-on-accent`          | Icons on top of a theme accent color background.           |

##### Text on the theme background

| Class                          | Description                                                |
| ------------------------------ | ---------------------------------------------------------- |
| `text-primary-on-background`   | Primary text on top of the theme background.               |
| `text-secondary-on-background` | Secondary text on top of the theme background.             |
| `text-hint-on-background`      | Hint text on top of the theme background.                  |
| `text-disabled-on-background`  | Disabled text on top of the theme background.              |
| `text-icon-on-background`      | Icons on top of the theme background.                      |

##### Text on a light-colored background (useful for custom backgrounds)

| Class                          | Description                                                |
| ------------------------------ | ---------------------------------------------------------- |
| `text-primary-on-light`        | Primary text on top of a light-colored background.         |
| `text-secondary-on-light`      | Secondary text on top of a light-colored background.       |
| `text-hint-on-light`           | Hint text on top of a light-colored background.            |
| `text-disabled-on-light`       | Disabled text on top of a light-colored background.        |
| `text-icon-on-light`           | Icons on top of a light-colored background.                |

##### Text on a dark-colored background (useful for custom backgrounds)

| Class                          | Description                                                |
| ------------------------------ | ---------------------------------------------------------- |
| `text-primary-on-dark`         | Primary text on top of a dark-colored background.          |
| `text-secondary-on-dark`       | Secondary text on top of a dark-colored background.        |
| `text-hint-on-dark`            | Hint text on top of a dark-colored background.             |
| `text-disabled-on-dark`        | Disabled text on top of a dark-colored background.         |
| `text-icon-on-dark`            | Icons on top of a dark-colored background.                 |


#### mdc-theme-dark mixin

This mixin is mostly used for MDC-Web component development, and provides a standard way of
applying dark themes to components. **Note that mdc-theme-dark does _not_ change any theme-wide
background colors**. Rather, `mdc-theme-dark` and its CSS classes are intended be used when certain
sections or treatments of a page use a darker color as its background, where the default colors we
use would not make sense.

`mdc-theme-dark` creates a suitable selector for a component, and applies the provided content
inside of it:

```scss
.mdc-foo {
  color: black;

  @include mdc-theme-dark {
    color: white;
  }

  &__bar {
    background: black;

    @include mdc-theme-dark(".mdc-foo") {
      background: white;
    }
  }
}

.mdc-foo--disabled {
  opacity: .38;

  @include mdc-theme-dark(".mdc-foo", /* $compound: */ true) {
    opacity: .5;
  }
}
```

> Note: If using the mixin on anything other than the base selector, you need to specify the base selector as a
parameter. This ensures that the `--theme-dark` option is appended to the right class.

> Note: If using the mixin with a modifier class, pass `true` for the second argument. This will tell the mixin to treat the selector it's being mixed into as a compound class rather than a descendant selector.

The above generates the following CSS:

```css
.mdc-foo {
  color: black;
}
.mdc-foo--theme-dark, .mdc-theme--dark .mdc-foo {
  color: white;
}
.mdc-foo__bar {
  background: black;
}
.mdc-foo--theme-dark .mdc-foo__bar, .mdc-theme--dark .mdc-foo__bar {
  background: white;
}

.mdc-foo--disabled {
  opacity: .38;
}
.mdc-foo--theme-dark.mdc-foo--disabled,
.mdc-theme--dark .mdc-foo--disabled {
  opacity: .5;
}
```

A user could thus apply a dark theme to a component by either targeting it specifically:

```html
<div class="mdc-foo mdc-foo--theme-dark"></div>
```

Or instead apply it to everything under a parent element, by using the `mdc-theme--dark` global modifier class:

```html
<body class="mdc-theme--dark">
  <div class="mdc-foo"></div>
</body>
```


#### Color functions

MDC Theme defines several functions, used in the process of determining the correct contrast color for a given
background.

##### mdc-theme-luminance

Calculates the luminance value (0 - 1) of a given color.

```scss
@debug mdc-theme-luminance(#9c27b0); // 0.11654
```

##### mdc-theme-contrast

Calculates the contrast ratio between two colors.

```scss
@debug mdc-theme-contrast(#9c27b0, #000); // 3.33071
```

##### mdc-theme-light-or-dark

Determines whether to use light or dark text on top of a given color.

```scss
@debug mdc-theme-light-or-dark(#9c27b0); // light
```

### CSS Classes

```html
<span class="mdc-theme--primary">
  Some text in the primary color.
</span>

<span class="mdc-theme--accent-bg mdc-theme--text-primary-on-accent">
  Some text on an accent color background.
</span>
```

> Note: These classes use `!important` on the values, since they're user-specified and are applied to ensure that a
particular color gets used.

There are a number of CSS classes available for taking advantage of theming.

#### Theme color classes

These classes set either the text color or the background color to one of the theme colors.

| Class                   | Description                                                 |
| ----------------------- | ----------------------------------------------------------- |
| `mdc-theme--primary`    | Sets the text color to the theme primary color.             |
| `mdc-theme--accent`     | Sets the text color to the theme accent color.              |
| `mdc-theme--background` | Sets the background color to the theme background color.    |
| `mdc-theme--primary-bg` | Sets the background color to the theme primary color.       |
| `mdc-theme--accent-bg`  | Sets the background color to the theme accent color.        |

#### Text colors for contrast

These classes set the text color to a suitable color to be used on top of a given background. The color to be used
depends on two criteria: the background color (namely, whether it's light or dark) and the text style.

##### Text on a theme primary color background

| Class                                     | Description                                                                               |
| ----------------------------------------- | ----------------------------------------------------------------------------------------- |
| `mdc-theme--text-primary-on-primary`      | Set text to suitable color for primary text on top of a theme primary color background.   |
| `mdc-theme--text-secondary-on-primary`    | Set text to suitable color for secondary text on top of a theme primary color background. |
| `mdc-theme--text-hint-on-primary`         | Set text to suitable color for hint text on top of a theme primary color background.      |
| `mdc-theme--text-disabled-on-primary`     | Set text to suitable color for disabled text on top of a theme primary color background.  |
| `mdc-theme--text-icon-on-primary`         | Set text to suitable color for icons on top of a theme primary color background.          |

##### Text on a theme accent color background

| Class                                     | Description                                                                               |
| ----------------------------------------- | ----------------------------------------------------------------------------------------- |
| `mdc-theme--text-primary-on-accent`       | Set text to suitable color for primary text on top of a theme accent color background.    |
| `mdc-theme--text-secondary-on-accent`     | Set text to suitable color for secondary text on top of a theme accent color background.  |
| `mdc-theme--text-hint-on-accent`          | Set text to suitable color for hint text on top of a theme accent color background.       |
| `mdc-theme--text-disabled-on-accent`      | Set text to suitable color for disabled text on top of a theme accent color background.   |
| `mdc-theme--text-icon-on-accent`          | Set text to suitable color for icons on top of a theme accent color background.           |

##### Text on the theme background

| Class                                     | Description                                                                               |
| ----------------------------------------- | ----------------------------------------------------------------------------------------- |
| `mdc-theme--text-primary-on-background`   | Set text to suitable color for primary text on top of the theme background.               |
| `mdc-theme--text-secondary-on-background` | Set text to suitable color for secondary text on top of the theme background.             |
| `mdc-theme--text-hint-on-background`      | Set text to suitable color for hint text on top of the theme background.                  |
| `mdc-theme--text-disabled-on-background`  | Set text to suitable color for disabled text on top of the theme background.              |
| `mdc-theme--text-icon-on-background`      | Set text to suitable color for icons on top of the theme background.                      |

##### Text on a light-colored background (useful for custom backgrounds)

| Class                                     | Description                                                                               |
| ----------------------------------------- | ----------------------------------------------------------------------------------------- |
| `mdc-theme--text-primary-on-light`        | Set text to suitable color for primary text on top of a light-colored background.         |
| `mdc-theme--text-secondary-on-light`      | Set text to suitable color for secondary text on top of a light-colored background.       |
| `mdc-theme--text-hint-on-light`           | Set text to suitable color for hint text on top of a light-colored background.            |
| `mdc-theme--text-disabled-on-light`       | Set text to suitable color for disabled text on top of a light-colored background.        |
| `mdc-theme--text-icon-on-light`           | Set text to suitable color for icons on top of a light-colored background.                |

##### Text on a dark-colored background (useful for custom backgrounds)

| Class                                     | Description                                                                               |
| ----------------------------------------- | ----------------------------------------------------------------------------------------- |
| `mdc-theme--text-primary-on-dark`         | Set text to suitable color for primary text on top of a dark-colored background.          |
| `mdc-theme--text-secondary-on-dark`       | Set text to suitable color for secondary text on top of a dark-colored background.        |
| `mdc-theme--text-hint-on-dark`            | Set text to suitable color for hint text on top of a dark-colored background.             |
| `mdc-theme--text-disabled-on-dark`        | Set text to suitable color for disabled text on top of a dark-colored background.         |
| `mdc-theme--text-icon-on-dark`            | Set text to suitable color for icons on top of a dark-colored background.                 |


### CSS Custom properties

MDC Theme defines a number of custom properties to make theming in pure CSS possible, if you have access to CSS custom
properties in your system.

> Note: Unfortunately, due to the limitations of custom CSS properties, it's not currently possible to automatically
calculate the correct text colors to use, based on the chosen theme colors. These will all need to be set manually.

#### Theme colors

| Custom property          | Description                 |
| ------------------------ | --------------------------- |
| `--mdc-theme-primary`    | The theme primary color.    |
| `--mdc-theme-accent`     | The theme accent color.     |
| `--mdc-theme-background` | The theme background color. |

#### Text on a theme primary color background

| Custom property                            | Description                                                |
| ------------------------------------------ | ---------------------------------------------------------- |
| `--mdc-theme-text-primary-on-primary`      | Primary text on top of a theme primary color background.   |
| `--mdc-theme-text-secondary-on-primary`    | Secondary text on top of a theme primary color background. |
| `--mdc-theme-text-hint-on-primary`         | Hint text on top of a theme primary color background.      |
| `--mdc-theme-text-disabled-on-primary`     | Disabled text on top of a theme primary color background.  |
| `--mdc-theme-text-icon-on-primary`         | Icons on top of a theme primary color background.          |

#### Text on a theme accent color background

| Custom property                            | Description                                                |
| ------------------------------------------ | ---------------------------------------------------------- |
| `--mdc-theme-text-primary-on-accent`       | Primary text on top of a theme accent color background.    |
| `--mdc-theme-text-secondary-on-accent`     | Secondary text on top of a theme accent color background.  |
| `--mdc-theme-text-hint-on-accent`          | Hint text on top of a theme accent color background.       |
| `--mdc-theme-text-disabled-on-accent`      | Disabled text on top of a theme accent color background.   |
| `--mdc-theme-text-icon-on-accent`          | Icons on top of a theme accent color background.           |

#### Text on the theme background

| Custom property                            | Description                                                |
| ------------------------------------------ | ---------------------------------------------------------- |
| `--mdc-theme-text-primary-on-background`   | Primary text on top of the theme background.               |
| `--mdc-theme-text-secondary-on-background` | Secondary text on top of the theme background.             |
| `--mdc-theme-text-hint-on-background`      | Hint text on top of the theme background.                  |
| `--mdc-theme-text-disabled-on-background`  | Disabled text on top of the theme background.              |
| `--mdc-theme-text-icon-on-background`      | Icons on top of the theme background.                      |

#### Text on a light-colored background (useful for custom backgrounds)

| Custom property                            | Description                                                |
| ------------------------------------------ | ---------------------------------------------------------- |
| `--mdc-theme-text-primary-on-light`        | Primary text on top of a light-colored background.         |
| `--mdc-theme-text-secondary-on-light`      | Secondary text on top of a light-colored background.       |
| `--mdc-theme-text-hint-on-light`           | Hint text on top of a light-colored background.            |
| `--mdc-theme-text-disabled-on-light`       | Disabled text on top of a light-colored background.        |
| `--mdc-theme-text-icon-on-light`           | Icons on top of a light-colored background.                |

#### Text on a dark-colored background (useful for custom backgrounds)

| Custom property                            | Description                                                |
| ------------------------------------------ | ---------------------------------------------------------- |
| `--mdc-theme-text-primary-on-dark`         | Primary text on top of a dark-colored background.          |
| `--mdc-theme-text-secondary-on-dark`       | Secondary text on top of a dark-colored background.        |
| `--mdc-theme-text-hint-on-dark`            | Hint text on top of a dark-colored background.             |
| `--mdc-theme-text-disabled-on-dark`        | Disabled text on top of a dark-colored background.         |
| `--mdc-theme-text-icon-on-dark`            | Icons on top of a dark-colored background.                 |
