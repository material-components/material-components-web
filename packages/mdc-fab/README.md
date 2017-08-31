<!--docs:
title: "Floating Action Buttons"
layout: detail
section: components
iconId: button
path: /catalog/buttons/floating-action-buttons/
-->

# Floating Action Buttons

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/fab.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/fabs.png" width="78" alt="Floating action buttons screenshot">
  </a>
</div>-->

The MDC FAB component is a spec-aligned button component adhering to the
[Material Design FAB requirements](https://material.io/guidelines/components/buttons-floating-action-button.html).
It works without JavaScript with basic functionality for all states.
If you initiate the JavaScript object for a button, then it will be enhanced with ripple effects. (Not yet implemented)

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

The demonstrations use the [Material Design Icon Font](https://design.google.com/icons/).
You may include this to use them as shown or use any other icon method you wish.

### Default

```html
<button class="mdc-fab material-icons" aria-label="Favorite">
  <span class="mdc-fab__icon">
    favorite
  </span>
</button>
```

### Mini

```html
<button class="mdc-fab mdc-fab--mini material-icons" aria-label="Favorite">
  <span class="mdc-fab__icon">
    favorite
  </span>
</button>
```

### Plain

```html
<button class="mdc-fab mdc-fab--plain material-icons" aria-label="favorite">
  <span class="mdc-fab__icon">
    favorite
  </span>
</button>
```

### Absolutely positioned

By default the FAB rests in the page where it sits in the content flow.
Developers must position it as needed within their application's design.

```html
<!--
  This will position the FAB in the bottom-right corner.
  Modify to fit your design's requirements.
-->
<style>
.app-fab--absolute.app-fab--absolute {
  position: fixed;
  bottom: 1rem;
  right: 1rem;
}

@media(min-width: 1024px) {
   .app-fab--absolute.app-fab--absolute {
    bottom: 1.5rem;
    right: 1.5rem;
  }
}
</style>
<button class="mdc-fab app-fab--absolute" aria-label="Edit">
  <span class="mdc-fab__icon">
    <svg width="24" height="24" viewBox="0 0 24 24">
      <path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/>
    </svg>
  </span>
</button>
```

> **Note** In this example we are using an SVG icon. When you are using SVG icons do _not_ specifiy the `fill` attribute. Fill is set by the components where SVGs may be used.

### Adding ripples to FABs

To add the ink ripple effect to a FAB, attach a [ripple](../mdc-ripple) instance to the
FAB element.

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

FABs are fully aware of ripple styles, so no DOM or CSS changes are required to use them.

### Block

The block class is `mdc-fab`. This defines the top-level button element.

### Element

The button component has a single `span` element added as a child of the button due to buttons not adhering to flexbox rules
in all browsers. See [this Stackoverflow post](http://stackoverflow.com/posts/35466231/revisions) for details.

### CSS Classes

CSS Class | Description
--- | ---
`mdc-fab--mini` | Makes the fab smaller (40 x 40 pixels)
`mdc-fab--plain` | Makes the FAB have a white background

> **NOTE**: No disabled styles are defined for FABs, as they are intended to denote a promoted action, and should not be
> displayed in a disabled state. If there is ever a situation where a FAB should *not* perform an action,
> an explanation should be presented to the user.

### Sass Mixins

The following mixins are intended for advanced users. By default a FAB will inherit its color from the theme.
These mixins will override the color of the container, ink, or ripple. You can use all of them if you want to 
completely customize a FAB. Or you can use only one of them, e.g. if you only need to override the ripple color.
It is up to you to pick container, ink, and ripple colors that work together, and meet accessibility standards.

#### `mdc-fab-container-color($color)`

Changes the FAB's container color to the given color.

#### `mdc-fab-ink-color($color)`

Changes the FAB's ink color to the given color.

#### `mdc-fab-ripple($ripple-config)`

Changes the FAB's ripple to the given ripple configuration (see the [mdc-ripple README][ripple-readme]).

[ripple-readme]: https://github.com/material-components/material-components-web/blob/master/packages/mdc-ripple/README.md
