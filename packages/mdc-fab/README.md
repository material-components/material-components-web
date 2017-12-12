<!--docs:
title: "Floating Action Button"
layout: detail
section: components
excerpt: "A floating action button represents the primary action in an application"
iconId: button
path: /catalog/buttons/floating-action-buttons/
-->

# Floating Action Button

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/fab.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/fabs.png" width="78" alt="Floating action button screenshot">
  </a>
</div>-->

A floating action button represents the primary action in an application.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/buttons-floating-action-button.html">Material Design guidelines: Floating Action Button</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/fab.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install --save @material/fab
```

## Usage

### Load Material Icons

We recommend you load [Material Icons](https://material.io/icons/) from Google Fonts

```html
<head>
  <link href="https://fonts.googleapis.com/icon?family=Material+Icons" rel="stylesheet">
</head>
```

### HTML Structure

```html
<button class="mdc-fab material-icons" aria-label="Favorite">
  <span class="mdc-fab__icon">
    favorite
  </span>
</button>
```

### CSS Classes

CSS Class | Description
--- | ---
`mdc-fab` | Mandatory, for the button element
`mdc-fab__icon` | Mandatory, for the icon element
`mdc-fab--mini` | Optional, modifies the FAB to a smaller size
`mdc-fab--exited` | Optional, animates the FAB out of view.<br>When this class is removed, the FAB will return to view.

> **A note about `:disabled`**, No disabled styles are defined for FABs. The FAB promotes action, and should not be displayed in a disabled state. If you want to present a FAB that does *not* perform an action, you should also present an explanation to the user.

### Absolutely Positioned

Developers must position MDC FAB as needed within their application's design.

```html
<!--
  This will position the FAB in the bottom-right corner.
  Modify to fit your design's requirements.
-->
<style>
.app-fab--absolute {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
}

@media(min-width: 1024px) {
   .app-fab--absolute {
    bottom: 1.5rem;
    right: 1.5rem;
  }
}
</style>
<button class="mdc-fab material-icons app-fab--absolute" aria-label="Favorite">
  <span class="mdc-fab__icon">
    favorite
  </span>
</button>
```

### Adding MDC Ripple

To add the ripple effect to an MDC FAB, attach a [ripple](../mdc-ripple) instance to the
`mdc-fab` element.

```js
mdc.ripple.MDCRipple.attachTo(document.querySelector('.mdc-fab'));
```

You can also do this declaratively when using the [material-components-web](../material-components-web) package.

```html
<button class="mdc-fab material-icons" aria-label="Favorite" data-mdc-auto-init="MDCRipple">
  <span class="mdc-fab__icon">
    favorite
  </span>
</button>
```

MDC FAB is fully aware of MDC Ripple styles, so no DOM or CSS changes are required.

### Sass Mixins

By default an MDC FAB will inherit its color from the theme. This mixin will override the color of the MDC FAB's container, but maintain accessibility standards for the ink and ripple. The mixin is intended for customizing an MDC FAB's color to a non-theme color.

#### `mdc-fab-accessible($container-color)`

Changes the FAB's container color to the given color, and updates the FAB's ink and ripple color to meet accessibility standards.

### Advanced Sass Mixins

> **A note about advanced mixins**, The following mixins are intended for advanced users. These mixins will override the color of the container, ink, or ripple. You can use all of them if you want to completely customize a FAB. Or you can use only one of them, e.g. if you only need to override the ripple color. **It is up to you to pick container, ink, and ripple colors that work together, and meet accessibility standards.**

Mixin | Description
--- | ---
`mdc-fab-container-color($color)` | Sets the container color to the given color
`mdc-fab-ink-color($color)` | Sets the ink color to the given color

The ripple effect for the FAB component is styled using [MDC Ripple](../mdc-ripple) mixins.

#### Caveat: Edge and CSS Variables

In browsers that fully support CSS variables, the above mixins will hook up styles using CSS variables if a theme property is passed.
However, due to Edge's buggy CSS variable support, `mdc-fab-container-color` will not honor CSS variables in Edge.
This means you will need to override FAB container styles manually for Edge if you are altering the affected CSS variables for theme properties (FAB uses secondary by default for the container fill color).
