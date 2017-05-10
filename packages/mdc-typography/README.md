<!--docs:
title: "Typography"
layout: detail
section: components
excerpt: "Material Design typography guidelines implemented via CSS."
iconId: typography
path: /catalog/typography/
-->

# Typography

MDC typography is a CSS-only component that implements the
[Material Design typography guidelines](https://material.io/guidelines/style/typography.html), and makes them available to
developers as CSS classes.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/style/typography.html">Material Design guidelines: Typography</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/typography.html">Demo</a>
  </li>
</ul>

## Installation

> Note: Installation via the npm registry will be available after alpha.


## CSS class usage

```html
<head>
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
</head>
<body class="mdc-typography">
  <h1 class="mdc-typography--display4">Big header</h1>
</body>
```

Material Design typography uses the Roboto font, which we're loading from Google Fonts in the example above.

> Note: You can load more font weights and styles if you wish, but `mdc-typography` only uses 300, 400 and 500.

The `mdc-typography` class defines basic properties for text, such as the typeface and antialiasing settings.

### Formatting your text

#### Style

Simply add the corresponding style class to format your text:

```html
<body class="mdc-typography">
  <h1 class="mdc-typography--display4">Big header</h1>

  <p class="mdc-typography--body1">
    A paragraph with <span class="mdc-typography--body2">emphasis</span>.
  </p>
</body>
```

The full list of styles:

- `mdc-typography--display4`
- `mdc-typography--display3`
- `mdc-typography--display2`
- `mdc-typography--display1`
- `mdc-typography--headline`
- `mdc-typography--title`
- `mdc-typography--subheading2`
- `mdc-typography--subheading1`
- `mdc-typography--body2`
- `mdc-typography--body1`
- `mdc-typography--caption`

#### Margins and positioning

In order to minimize unexpected behavior, the style classes only specify font properties, such as size, weight and line
height.

This means that while text will be correctly styled, it may not be correctly positioned. If you include the
`mdc-typography--adjust-margin` class, though, positioning will be adjusted according to the style:

```html
<body class="mdc-typography">
  <h1 class="mdc-typography--display4 mdc-typography--adjust-margin">
    Big header
  </h1>

  <p class="mdc-typography--body1 mdc-typography--adjust-margin">
    A paragraph with
    <span class="mdc-typography--body2 mdc-typography--adjust-margin">
      emphasis
    </span>.
  </p>
</body>
```

> Note: as the name implies, `mdc-typography--adjust-margin` will change the margin properties of the element it's
applied to, in order to align text correctly. Because of this, it should only be used in a text context; using this
property on UI elements such as buttons may cause them to be positioned incorrectly.


## Sass mixin usage

### mdc-typography-base

```scss
@include mdc-typography-base;
```

`mdc-typography-base` defines the basic properties for Material Design typography, namely the font and aliasing
settings, without defining any particular font size or style.


### mdc-typography

```scss
@include mdc-typography(display4);
```

Applies one of the typography styles. Note that this includes the font family and aliasing definitions; you don't need
to include `mdc-typography-base` as well.

The full list of styles:
- `display4`
- `display3`
- `display2`
- `display1`
- `headline`
- `title`
- `subheading2`
- `subheading1`
- `body2`
- `body1`
- `caption`


### mdc-typography-adjust-margin

```scss
@include mdc-typography(display4);
@include mdc-typography-adjust-margin(display4);
```

In order to minimize unexpected behavior, the style mixins only specify font properties, such as size, weight and line
height.

This means that while text will be correctly styled, it may not be correctly positioned. If you include the
`mdc-typography-adjust-margin` mixin as well, though, positioning will be adjusted according to the style.

> Note: as the name implies, `mdc-typography-adjust-margin` will change the margin properties of the element it's
applied to, in order to align text correctly. Because of this, it should only be used in a text context; using this
property on UI elements such as buttons may cause them to be positioned incorrectly.

The list of styles is the same as for the `mdc-typography` mixin:
- `display4`
- `display3`
- `display2`
- `display1`
- `headline`
- `title`
- `subheading2`
- `subheading1`
- `body2`
- `body1`
- `caption`
