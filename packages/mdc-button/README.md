<!--docs:
title: "Buttons"
layout: detail
section: components
excerpt: "Material Design-styled buttons."
iconId: button
path: /catalog/buttons/
-->

# Buttons

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/button.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/buttons.png" width="363" alt="Buttons screenshot">
  </a>
</div>-->

The MDC Button component is a spec-aligned button component adhering to the
[Material Design button requirements](https://material.io/guidelines/components/buttons.html).
It works without JavaScript with basic functionality for all states.
You can enhance the button to have ripple effects by instantiating `MDCRipple` on
the `button` element. See [MDC Ripple](../mdc-ripple) and [Demo](https://material-components-web.appspot.com/button.html) for details.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/buttons.html">Material Design guidelines: Buttons</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/button.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install --save @material/button
```

## Usage

### HTML Structure
```html
<button class="mdc-button">
  Button
</button>
```

> Note: Examples and documents use generic `<button>`, but users can also apply
`mdc-button` to `<a class="mdc-button">Link Button</a>` in cases where it is
semantically correct.

### Adding Icon

Users can nest `mdc-button__icon` inside the button element to add an icon. The icon in button
is set to 18px to meet legibility requirements.

We recommend you load [Material Icons](https://material.io/icons/) from Google Fonts

```html
<head>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>

<button class="mdc-button">
  <i class="material-icons mdc-button__icon">favorite</i>
  Button
</button>
```

It's also possible to use an SVG icon:

```html
<button class="mdc-button">
  <svg class="mdc-button__icon" xmlns="http://www.w3.org/2000/svg" viewBox="...">
  ...
  </svg>
  SVG Icon
</button>
```

### CSS Classes


CSS Class | Description
--- | ---
`mdc-button` | Mandatory, defaults to a text button that is flush with the surface
`mdc-button__icon`    | Optional, for the icon element
`mdc-button--raised` | Optional, a contained button that is elevated upon the surface
`mdc-button--unelevated` | Optional, a contained button that is flush with the surface
`mdc-button--stroked` | Optional, a contained button that is flush with the surface and has a visible border
`mdc-button--dense` | Optional, compresses the button text to make it slightly smaller

### Disabled Button

Users can add `disabled` directly to the button element or set the fieldset containing
the button to `disabled` to disable a button. Disabled buttons cannot be interacted
with and have no visual interaction effect.

```html
<button class="mdc-button mdc-button--raised" disabled>
  Raised disabled button
</button>
```

### Adding MDC Ripple

To add the ink ripple effect to a button, attach a [ripple](../mdc-ripple) instance to the
button element.

```js
mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-button'));
```

You can also do this declaratively when using the [material-components-web](../material-components-web) package.

```html
<button class="mdc-button" data-mdc-auto-init="MDCRipple">
  Flat button
</button>
```

Buttons are fully aware of ripple styles, so no DOM or CSS changes are required to use them.

### Sass Mixins

By default an MDC Button will inherit its color from the theme and align with [Material Design button requirements](https://material.io/guidelines/components/buttons.html). To customize a Button's color and properties, you can use the following mixins.

#### `mdc-button-filled-accessible($container-fill-color)`

This mixin is provided for customizing a *raised* or *unelevated* button's color. It changes the Button's
container color to the given color, and updates the Button's ink and ripple color to meet accessibility standards.

### Advanced Sass Mixins

> **A note about advanced mixins**, The following mixins are intended for advanced users. These mixins will override the color of the container, ink, stroke or ripple. You can use all of them if you want to completely customize a Button. Or you can use only one of them, e.g. if you only need to override the ripple color. **It is up to you to pick container, ink, stroke and ripple colors that work together, and meet accessibility standards.**

Mixin | Description
--- | ---
`mdc-button-container-fill-color` | Sets the container color to the given color.
`mdc-button-icon-color` | Sets the icon color to the given color.
`mdc-button-ink-color` | Sets the ink color to the given color. This affects both text and icon, unless `mdc-button-icon-color` is also used.
`mdc-button-stroke-color` | Sets the stroke color to the given color.
`mdc-button-corner-radius` | Sets the corner radius to the given number (defaults to 2px).
`mdc-button-stroke-width` | Sets the stroke width to the given number (defaults to 2px).

The ripple effect for the Button component is styled using [MDC Ripple](../mdc-ripple) mixins.

#### Caveat: Edge and CSS Variables

In browsers that fully support CSS variables, the above mixins will hook up styles using CSS variables if a theme property is passed.
However, due to Edge's buggy CSS variable support, `mdc-button-container-fill-color` will not honor CSS variables in Edge.
This means you will need to override button container styles manually for Edge if you are altering the affected CSS variables for theme properties
(raised and unelevated buttons use primary by default for the container fill color).
