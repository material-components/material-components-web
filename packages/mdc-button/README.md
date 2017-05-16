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
If you initiate the JavaScript object for a button, then it will be enhanced with ripple effects. (Not yet implemented)

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

### Flat

```html
<button class="mdc-button">
  Flat button
</button>
```

### Colored

```html
<button class="mdc-button mdc-button--accent">
  Colored button
</button>
```

### Raised

```html
<button class="mdc-button mdc-button--raised">
  Raised button
</button>
```

### Disabled

```html
<button class="mdc-button mdc-button--raised" disabled>
  Raised disabled button
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
| `mdc-button--dense`   | Compresses the button text to make it slightly smaller. |
| `mdc-button--raised`  | Elevates the button and creates a colored background.   |
| `mdc-button--compact` | Reduces the amount of horizontal padding in the button. |
| `mdc-button--primary` | Colors the button with the primary color.               |
| `mdc-button--accent`  | Colors the button with the accent color.                |
