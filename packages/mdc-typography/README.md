<!--docs:
title: "Typography"
layout: detail
section: components
excerpt: "Typographic scale that handles a set of type sizes"
iconId: typography
path: /catalog/typography/
-->

# Typography

Material Design's text sizes and styles were developed to balance content density and reading comfort under typical usage conditions.

MDC Typography is a foundational module that applies these styles to MDC Web components. The typographic styles in this module are derived from ten styles:

* Display 4
* Display 3
* Display 2
* Display 1
* Headline
* Title
* Subheading 2
* Subheading 1
* Body 2
* Body 1
* Caption
* Button

### Usage

```html
<head>
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
</head>
<body class="mdc-typography">
  <h1 class="mdc-typography--display4">Big header</h1>
</body>
```

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

```
npm install --save @material/typography
```

## Usage

### Load Roboto

We recommend you load Roboto from Google Fonts

```html
<head>
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500" rel="stylesheet">
</head>
<body class="mdc-typography">
  <h1 class="mdc-typography--display4">Big header</h1>
</body>
```

### CSS Classes

Some components have a set typographic style. For example, a raised MDC Card uses Body 1, Body 2, and Headline styles.

If you want to set the typographic style of an element, which is not a Material Design component, you can apply the following CSS classes.

CSS Class | Description
--- | ---
`mdc-typography` | Sets the font to Roboto
`mdc-typography--display4` | Sets font properties as Display 4
`mdc-typography--display3` | Sets font properties as Display 3
`mdc-typography--display2` | Sets font properties as Display 2
`mdc-typography--display1` | Sets font properties as Display 1
`mdc-typography--headline` | Sets font properties as Headline
`mdc-typography--title` | Sets font properties as Title
`mdc-typography--subheading2` | Sets font properties as Subheading 2
`mdc-typography--subheading1` | Sets font properties as Subheading 1
`mdc-typography--body2` | Sets font properties as Body 2
`mdc-typography--body1` | Sets font properties as Body 1
`mdc-typography--caption` | Sets font properties as Caption
`mdc-typography--button` | Sets font properties as Button
`mdc-typography--adjust-margin` | Positions text, used in conjunction with font classes above

> **A note about `mdc-typography--adjust-margin`**, `mdc-typography--adjust-margin` will change the margin properties of the element it is applied to, to align text correctly. `mdc-typography--adjust-margin` should only be used in a text context; using this property on UI elements such as buttons may cause them to be positioned incorrectly.

### Sass Variables and Mixins

Mixin | Description
--- | ---
`mdc-typography-base` | Sets the font to Roboto
`mdc-typography($style)` | Applies one of the typography styles, including setting the font to Roboto
`mdc-typography-adjust-margin($style)` | Positions text
`mdc-typography-overflow-ellipsis` | Truncates overflow text to one line with an ellipsis

> **A note about `mdc-typography-adjust-margin`**, `mdc-typography-adjust-margin` will change the margin properties of the element it is applied to, to align text correctly. `mdc-typography-adjust-margin` should only be used in a text context; using this property on UI elements such as buttons may cause them to be positioned incorrectly.

> **A note about `mdc-typography-overflow-ellipsis`**, `mdc-typography-overflow-ellipsis` should only be used if the element is `display: block` or `display: inline-block`.

#### `$style` Values

These styles can be used as the `$style` argument for `mdc-typography` and `mdc-typography-adjust-margin` mixins.

* `display4`
* `display3`
* `display2`
* `display1`
* `headline`
* `title`
* `subheading2`
* `subheading1`
* `body2`
* `body1`
* `caption`
* `button`
