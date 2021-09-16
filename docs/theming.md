<!--docs:
title: "Theming Guide"
layout: landing
section: docs
path: /docs/theming/
-->

# Theming Guide

## Overview

MDC Web includes a theming system designed to make it easy to change your application's colors. It provides multiple options
for implementing themes, allowing for maximum flexibility. At the moment, MDC Web supports theming with Sass and with CSS
Custom Property, with plans for CDN support as well, once that service is available.

## Colors

MDC Web theming, like Material Design theming, uses two main colors: **primary** and **secondary**. The primary color is used
throughout most of the application and components, as the main color for your application. The secondary color is used
for floating action buttons and other interactive elements, serving as visual contrast to the primary.

In addition to the primary and secondary colors, MDC Web also defines a _surface_ color, which is used as a background in
components.

Finally, MDC Web has a number of text colors, which are used for rendering text and other shapes on top of the primary,
secondary and background colors. These are specified as either dark or light, in order to provide sufficient contrast to
what's behind them, and have
[different levels of opacity depending on usage](https://material.io/go/design-theming#color-color-schemes):

- Primary, used for most text.
- Secondary, used for text which is lower in the visual hierarchy.
- Hint, used for text hints (such as those in text fields and labels).
- Disabled, used for text in disabled components and content.
- Icon, used for icons.
- On-surface, used for text that is on top of a surface background.
- On-secondary, used for text that is on top of a secondary background.
- On-primary, used for text that is on top of a primary background.

## Building a themed application

Let's start with a simple application, which displays several cards for different categories. We ultimately want each
card to have a color scheme that matches its category, but we'll start with the default theming provided by MDC Web.

You can [take a look at the end result here](https://plnkr.co/edit/jeBSvWC8mAIhUmUQvHSA?p=preview), but let's start from
scratch.

> Note: We won't cover the basics of starting an MDC Web project in this guide, so please take a look at the
[getting started guide](./getting-started.md) if you need more information.

### Step 1: No theming

Here's the markup:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width,initial-scale=1" />
    <title>Elements</title>
    <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet" />
    <link rel="stylesheet" href="material-components-web.min.css" />
    <style>
      .cards {
        display: flex;
        flex-wrap: wrap;
      }

      .element-card {
        width: 20em;
        margin: 16px;
      }

      .element-card > .mdc-card__media {
        height: 9em;
      }

      #demo-absolute-fab {
        position: fixed;
        bottom: 1rem;
        right: 1rem;
        z-index: 1;
      }
    </style>
  </head>
  <body class="mdc-typography">
    <h1>Choose your element</h1>
    <div class="cards">
      <div class="mdc-card element-card earth">
        <div class="mdc-card__media">
          <div class="mdc-card__media-content">
            <h1 class="mdc-typography--headline4">Earth</h1>
            <h2 class="mdc-typography--headline6">A solid decision.</h2>
          </div>
        </div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>
      <div class="mdc-card element-card wind">
        <div class="mdc-card__media">
          <h1 class="mdc-typography--headline4">Wind</h1>
          <h2 class="mdc-typography--headline6">Stormy weather ahead.</h2>
        </div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>
      <div class="mdc-card element-card fire">
        <div class="mdc-card__media">
          <h1 class="mdc-typography--headline4">Fire</h1>
          <h2 class="mdc-typography--headline6">Hot-headed much?</h2>
        </div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>
      <div class="mdc-card element-card water">
        <div class="mdc-card__media">
          <h1 class="mdc-typography--headline4">Water</h1>
          <h2 class="mdc-typography--headline6">Go with the flow.</h2>
        </div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>
    </div>
    <button class="mdc-fab" id="demo-absolute-fab" aria-label="Favorite">
      <div class="mdc-fab__ripple"></div>
      <span class="mdc-fab__icon material-icons">favorite</span>
    </button>
  </body>
</html>
```

You'll see that we have a number of pretty empty looking cards, with black text on a white background. The only hint of
color comes from the FAB, which adopts the secondary color by default.

### Step 2: Use the MDC Web colors in your own markup

Not everything has a `--primary` option, though, particularly where it comes to your own markup.

Let's make things look a bit more interesting, by using the primary color as a background to the cards' media area.
One way of doing this would be to write your own custom CSS rules, and set the background to the same color that's being
used as the primary:

```css
/* Bad approach */
.element-card > .mdc-card__media {
  background-color: #3f51b5;
}
```

However, that would not take advantage of MDC Web's theming and would thus be brittle; changes to theming would need to be
copied to your CSS rules, adding a maintenance cost.

MDC Web provides a number of CSS classes as part of the `mdc-theme` module to help you tackle this problem in a more
maintainable way. Here are the classes that deal with primary, secondary and background colors:

| Class                           | Description                                                                  |
| ------------------------------- | -----------------------------------------------------------------------      |
| `mdc-theme--primary`            | Sets the text color to the theme primary color.                              |
| `mdc-theme--primary-bg`         | Sets the background color to the theme primary color.                        |
| `mdc-theme--on-primary`         | Sets the text color to the color configured for text on the primary color.   |
| `mdc-theme--secondary`          | Sets the text color to the theme secondary color.                            |
| `mdc-theme--secondary-bg`       | Sets the background color to the theme secondary color.                      |
| `mdc-theme--on-secondary`       | Sets the text color to the color configured for text on the secondary color. |
| `mdc-theme--surface`            | Sets the background color to the surface background color.                   |
| `mdc-theme--on-surface`       | Sets the text color to the color configured for text on the surface color.     |
| `mdc-theme--background`         | Sets the background color to the theme background color.                     |

From here, we can see that we want to apply `mdc-theme--primary-bg` to the cards' media areas:

```html
<div class="mdc-card element-card earth">
  <div class="mdc-card__media mdc-theme--primary-bg">
    <div class="mdc-card__media-content">
      <h1 class="mdc-typography--headline4">Earth</h1>
      <h2 class="mdc-typography--headline6">A solid decision.</h2>
    </div>
  </div>
  <p>
    Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
    Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
  </p>
</div>
```

All the cards now use the default primary color (Indigo 500 from the Material palette) as the background for the media
area.

However, you'll notice that the text in the media area is still black, which provides very little contrast to the
default primary color. Not all primary colors are dark, though, so you can't just switch the text color to white and
call it a day. Ideally, we want a solution which is as maintainable as the `mdc-theme--primary-bg` class, and which
takes into account the primary color, in order to determine whether to overlay white or black text on top.

`mdc-theme` provides utility classes for that purpose as well. Namely, for overlaying text on a primary color
background, there are:

| Class                        | Description                                                                         |
| -----------------------------| ------------------------------------------------------------------------------------|
| `mdc-theme--on-primary`      | Set text to suitable color for text on top of a theme primary color background.     |
| `mdc-theme--on-secondary`    | Set text to suitable color for text on top of a theme secondary color background.   |
| `mdc-theme--on-surface`      | Set text to suitable color for text on top of a theme surface color background.     |

From here, we can see the right choice is `mdc-theme--on-primary`. Let's apply that class to the media area :

```html
      <div class="mdc-card element-card earth">
        <div class="mdc-card__media mdc-theme--primary-bg mdc-theme--on-primary">
          <div class="mdc-card__media-content">
            <h1 class="mdc-typography--headline4">Earth</h1>
            <h2 class="mdc-typography--headline6">A solid decision.</h2>
          </div>
        </div>
        <p>
          Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
      </div>
```

The text is now white, which provides much better contrast. If we were to change the primary color to a light color,
however, the text would be dark again, for the same reason. So how _do_ we change the primary color?


### Step 3: Changing the theme with Sass

The application-wide theme colors that are used as the default across your entire application can be set in Sass.
This is as easy as defining three variables (`$primary`, `$secondary` and `$background`) in
your Sass file, before importing any MDC Web modules.

```scss
@use "@material/theme" with (
  $primary: #9c27b0,
  $secondary: #76ff03,
  $background: #fff,
);
@use "material-components-web";
```

These definitions will override the defaults included in the `mdc-theme` module, which every themeable component depends
on. As for the text colors, these will all be automatically calculated from the primary, secondary and background you
provide, as part of the Sass definitions in `mdc-theme`. Pretty simple!

> Note: theme colors don't have to be part of the Material palette; you can use any valid color. You may want to read
the [color section](https://material.io/go/design-theming) in the Material Design spec to inform your pick of an
alternative palette.

If you want to go a step further with your theming then you can override any SASS variable throughout the codebase by
redefining it in your application's SASS file. Exercise caution when doing this, however, as modifying internal variables
may have unintended consequences.


### Step 4: Changing the theme with CSS Custom Properties

Changing the theme colors with Sass affects the whole application, which is great if you want consistency across the
board. What we want here is slightly different, though: we want each card to have its own internally consistent theme.

So how do we keep all the current theme color "plumbing" for maintainability, while having different themes in different
places? CSS Custom properties to the rescue!

The generated MDC Web CSS uses CSS Custom Properties with hardcoded fallbacks, which are set to the colors provided in Sass.
This means that you can define your default theme in Sass (like we did above), but override it in CSS, dependent on
context or user preference.

Let's take a closer look at how MDC Web does things. Here's an excerpt of a compiled MDC Web CSS rule:

```css
.mdc-fab {
  background-color: #ff4081;
  background-color: var(--mdc-theme-secondary, #ff4081);
}
```

Here, you can see that MDC Web sets a fallback for the color, for browsers that don't support CSS Custom Properties. If
they do, however, that declaration gets overriden by a `var()` lookup, using the same fallback as the default value
(in case the custom property definition isn't found).

As such, you can easily override the colors that get used in MDC Web components by simply redefining the custom property at
some level. So if we want to apply it to our cards, we can take advantage of the element classes we had set up:

```css
.element-card.earth {
  --mdc-theme-primary: #795548;
}

.element-card.wind {
  --mdc-theme-primary: #9e9e9e;
}

.element-card.fire {
  --mdc-theme-primary: #f44336;
}

.element-card.water {
  --mdc-theme-primary: #00bcd4;
}
```

It works! You can see that the colors get applied to the backgrounds. If the cards had any other
components, they'd use the correct colors as well.

The custom properties used by MDC Web follow a similar naming convention to the Sass variables and CSS classes:

| Custom property               | Description                                 |
| ----------------------------- | ------------------------------------------- |
| `--mdc-theme-primary`         | The theme primary color.                    |
| `--mdc-theme-secondary`       | The theme secondary color.                  |
| `--mdc-theme-surface`         | The theme surface color.                    |
| `--mdc-theme-background`      | The theme background color.                 |

However, if you look closely at the page, we're not quite done yet. The text colors are incorrect: the wind and water
cards should have dark text, rather than white. So what's happening?

The problem is that we only set the `--mdc-theme-primary` custom property. Whereas setting `$mdc-theme-primary` in Sass
allows for calculating all the related text colors, it's currently not possible to perform those complex contrast
calculations in CSS. This means you'll also have to set all the related text colors:

| Custom property                               | Description                                                                |
| --------------------------------------------- | -------------------------------------------------------------------------- |
| `--mdc-theme-on-primary`                      | Primary text on top of a theme primary color background.                   |
| `--mdc-theme-on-secondary`                    | Secondary text on top of a theme primary color background.                 |
| `--mdc-theme-on-surface`                      | Hint text on top of a theme primary color background.                      |

The same pattern is followed for text colors on _background_:

| Custom property                            | Description                                                |
| ------------------------------------------ | ---------------------------------------------------------- |
| `--mdc-theme-text-high-on-background`      | High emphasis text on top of the theme background color.   |
| `--mdc-theme-text-medium-on-background`    | Medium emphasis text on top of the theme background color. |
| `--mdc-theme-text-hint-on-background`      | Hint text on top of the theme background color.            |
| `--mdc-theme-text-disabled-on-background`  | Disabled text on top of the theme background color.        |
| `--mdc-theme-text-icon-on-background`      | Icons on top of the theme background color.                |

In addition, we also define custom properties for known dark and light backgrounds:

| Custom property                            | Description                                                |
| ------------------------------------------ | ---------------------------------------------------------- |
| `--mdc-theme-text-high-on-light`           | High emphasis text on top of a light-colored background.   |
| `--mdc-theme-text-medium-on-light`         | Medium emphasis text on top of a light-colored background. |
| `--mdc-theme-text-hint-on-light`           | Hint text on top of a light-colored background.            |
| `--mdc-theme-text-disabled-on-light`       | Disabled text on top of a light-colored background.        |
| `--mdc-theme-text-icon-on-light`           | Icons on top of a light-colored background.                |

| Custom property                            | Description                                                |
| ------------------------------------------ | ---------------------------------------------------------- |
| `--mdc-theme-text-high-on-dark`            | High emphasis text on top of a dark-colored background.    |
| `--mdc-theme-text-medium-on-dark`          | Medium emphasis text on top of a dark-colored background.  |
| `--mdc-theme-text-hint-on-dark`            | Hint text on top of a dark-colored background.             |
| `--mdc-theme-text-disabled-on-dark`        | Disabled text on top of a dark-colored background.         |
| `--mdc-theme-text-icon-on-dark`            | Icons on top of a dark-colored background.                 |


Ideally, we should set all of the text colors on primary, since we never know which one an MDC Web component might use.
Since our cards only contain text and no components, let's keep it simple for now:

```css
.element-card.earth {
  --mdc-theme-primary: #795548;
  --mdc-theme-on-primary: var(--mdc-theme-text-high-on-dark);
}

.element-card.wind {
  --mdc-theme-primary: #9e9e9e;
  --mdc-theme-on-primary: var(--mdc-theme-text-high-on-light);
}

.element-card.fire {
  --mdc-theme-primary: #f44336;
  --mdc-theme-on-primary: var(--mdc-theme-text-high-on-dark);
}

.element-card.water {
  --mdc-theme-primary: #00bcd4;
  --mdc-theme-on-primary: var(--mdc-theme-text-high-on-light);
}
```

Let's see how it looks with another component inside it. Add the following code to each card just after the `p`
tag:

```html
<button class="mdc-button mdc-card__actions">
  <i class="material-icons mdc-button__icon">favorite</i>
  Look At My Color
</button>
```
## Custom Themes

Most MDC Web components provide a set of Sass mixins to customize their appearance,
such as changing the fill color, ink color, stroke width, etc.
These mixins are documented in each component's README file
(e.g., the [Button readme](../packages/mdc-button/README.md#advanced-sass-mixins)).

For example, to change the fill color of a button and automatically select an accessible ink color,
simply call the `button.filled-accessible` mixin inside a custom CSS class:

```scss
@use "@material/button";

.accessible-button {
  @include button.filled-accessible(blue);
}
```

Then apply the custom class to the button elements:

```html
<button class="mdc-button accessible-button">
  <div class="mdc-button__ripple"></div>
  <i class="material-icons mdc-button__icon" aria-hidden="true">favorite</i>
  <div class="mdc-button__label">Button</div>
</button>
```
