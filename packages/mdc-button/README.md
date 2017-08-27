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
the `button` element. See [MDC Ripple](https://github.com/material-components/material-components-web/tree/master/packages/mdc-ripple) and [Demo](https://material-components-web.appspot.com/button.html) for details.

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

### Button type

> Note: Examples and documents use generic `<button>`, but users can also apply
`mdc-button` to `<a class="mdc-button">Link Button</a>` in cases where it is
semantically correct.

#### Text Button

```html
<button class="mdc-button">
  Text button
</button>
```

#### Raised Button

```html
<button class="mdc-button mdc-button--raised">
  Raised button
</button>
```

#### Unelevated Button

```html
<button class="mdc-button mdc-button--unelevated">
  Unelevated button
</button>
```

#### Stroked Button

```html
<button class="mdc-button mdc-button--stroked">
  Stroked button
</button>
```

### Button state

#### Disabled

Users can add `disabled` directly to the button element or set the fieldset containing
the button to `disabled` to disable a button. Disabled buttons cannot be interacted
with and have no visual interaction effect.

```html
<button class="mdc-button mdc-button--raised" disabled>
  Raised disabled button
</button>
```

### Colored

MDC Buttons have a default baseline color, but it is also possible to adopt the
application's primary or secondary color by adding the `mdc-button--primary` or
`mdc-button--accent` modifier.

> Note: "Secondary" was previously called "accent" in the Material spec. See
[mdc-theme](https://github.com/material-components/material-components-web/tree/master/packages/mdc-theme)
for details.

```html
<button class="mdc-button mdc-button--accent">
  Colored button
</button>
```

### Adding ripples to buttons

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

## Classes

### Block

The block class is `mdc-button`. This defines the top-level button element.

### Element

The button component has no inner elements.

### Modifier

The provided modifiers are:

| Class                 | Description                                             |
| --------------------- | ------------------------------------------------------- |
| `mdc-button--raised`  | A contained button that is elevated upon the surface.   |
| `mdc-button--unelevated`  | A contained button that is flush with the surface.  |
| `mdc-button--stroked`  | A contained button contained by a rectangular shape.  |
| `mdc-button--dense`   | Compresses the button text to make it slightly smaller. |
| `mdc-button--compact` | Reduces the amount of horizontal padding in the button. |
| `mdc-button--primary` | Colors the button with the primary color.               |
| `mdc-button--accent`  | Colors the button with the secondary color.             |
