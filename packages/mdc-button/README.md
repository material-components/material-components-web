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
is set to 18px to meet legibility requirements. When using an `svg` icon, simply include the svg within the button.

We recommend you load [Material Icons](https://material.io/icons/) from Google Fonts

```html
<head>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>

<button class="mdc-button">
  <i class="material-icons mdc-button__icon">favorite</i>
  Button
</button>

<button class="mdc-button">
  <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 24 24"><defs><path id="a" d="M-240.34-17.17c-18.22 0-33 15.15-33 33.84 0 14.95 9.45 27.63 22.57 32.11 1.65.31 2.25-.74 2.25-1.63 0-.8-.03-2.93-.04-5.75-9.18 2.04-11.12-4.54-11.12-4.54-1.5-3.91-3.66-4.95-3.66-4.95-3-2.1.23-2.06.23-2.06 3.31.24 5.05 3.49 5.05 3.49 2.94 5.17 7.72 3.68 9.6 2.81.3-2.19 1.15-3.68 2.09-4.52-7.33-.85-15.03-3.76-15.03-16.72 0-3.69 1.29-6.71 3.4-9.08-.34-.86-1.47-4.3.32-8.95 0 0 2.77-.91 9.08 3.47 2.63-.75 5.46-1.13 8.26-1.14 2.8.01 5.63.39 8.26 1.14 6.3-4.38 9.07-3.47 9.07-3.47 1.8 4.66.67 8.1.33 8.95 2.11 2.37 3.39 5.39 3.39 9.08 0 13-7.72 15.86-15.07 16.7 1.19 1.04 2.24 3.11 2.24 6.27 0 4.52-.04 8.17-.04 9.28 0 .91.59 1.96 2.27 1.63 13.1-4.48 22.55-17.16 22.55-32.1.01-18.71-14.77-33.86-33-33.86"/></defs><clipPath id="b"><use xlink:href="#a" overflow="visible"/></clipPath><g clip-path="url(#b)"><defs><path id="c" d="M-1121.33-2471.17h1680v3369h-1680z"/></defs><clipPath id="d"><use xlink:href="#c" overflow="visible"/></clipPath><path clip-path="url(#d)" d="M-278.33-22.17h76v76h-76z"/></g><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/><path d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4z"/><path fill="none" d="M0 0h24v24H0z"/></svg>
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
`mdc-button--compact` | Optional, reduces the amount of horizontal padding in the button

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
`mdc-button-container-fill-color` | Sets the container color to the given color
`mdc-button-ink-color` | Sets the ink color to the given color
`mdc-button-stroke-color` | Sets the stroke color to the given color
`mdc-button-corner-radius` | Sets the corner radius to the given number (defaults to 2px)
`mdc-button-stroke-width` | Sets the stroke width to the given number (defaults to 2px)

The ripple effect for the Button component is styled using [MDC Ripple](../mdc-ripple) mixins.

#### Caveat: Edge and CSS Variables

In browsers that fully support CSS variables, the above mixins will hook up styles using CSS variables if a theme property is passed.
However, due to Edge's buggy CSS variable support, `mdc-button-container-fill-color` will not honor CSS variables in Edge.
This means you will need to override button container styles manually for Edge if you are altering the affected CSS variables for theme properties
(raised and unelevated buttons use primary by default for the container fill color).
