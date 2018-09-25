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
     href="https://material-components.github.io/material-components-web-catalog/#/component/fab">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/fabs.png" width="78" alt="Floating action button screenshot">
  </a>
</div>-->

A floating action button represents the primary action in an application.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-fab">Material Design guidelines: Floating Action Button</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/fab">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/fab
```

## Basic Usage

### Load Material Icons

We recommend using [Material Icons](https://material.io/tools/icons/) from Google Fonts:

```html
<head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
```

However, you can also use SVG, [Font Awesome](https://fontawesome.com/), or any other icon library you wish.

### HTML Structure

```html
<button class="mdc-fab" aria-label="Favorite">
  <span class="mdc-fab__icon material-icons">favorite</span>
</button>
```

> _NOTE:_ The floating action button icon can be used with a `span`, `i`, `img`, or `svg` element.

> _NOTE:_ IE 11 will not center the icon properly if there is a newline or space after the material icon text.

### Styles

```scss
@import "@material/fab/mdc-fab";
```

### JavaScript Instantiation

The FAB will work without JavaScript, but you can enhance it to have a ripple effect by instantiating `MDCRipple` on the root element. See [MDC Ripple](../mdc-ripple) for details.

```js
import {MDCRipple} from '@material/ripple';

const fabRipple = new MDCRipple(document.querySelector('.mdc-fab'));
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

## Variants

### Extended FAB

```html
<button class="mdc-fab mdc-fab--extended">
  <span class="material-icons mdc-fab__icon">add</span>
  <span class="mdc-fab__label">Create</span>
</button>
```

> _NOTE:_ The extended FAB must contain label where as the icon is optional. The icon and label may be specified in whichever order is appropriate based on context.

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-fab` | Mandatory, for the button element
`mdc-fab__icon` | Mandatory, for the icon element
`mdc-fab__label` | Optional, for the text label. Applicable only for Extended FAB.
`mdc-fab--mini` | Optional, modifies the FAB to a smaller size
`mdc-fab--extended` | Optional, modifies the FAB to wider size which includes a text label.
`mdc-fab--exited` | Optional, animates the FAB out of view.<br>When this class is removed, the FAB will return to view.

> **A note about `:disabled`**, No disabled styles are defined for FABs. The FAB promotes action, and should not be displayed in a disabled state. If you want to present a FAB that does *not* perform an action, you should also present an explanation to the user.

### Sass Mixins

#### Basic Sass Mixins

MDC FAB uses [MDC Theme](../mdc-theme)'s `secondary` color by default. Use the following mixins to customize it.

Mixin | Description
--- | ---
`mdc-fab-accessible($container-color)` | Changes the FAB's container color to the given color, and updates the FAB's ink and ripple color to meet accessibility standards.
`mdc-fab-extended-fluid` | Makes the Extended FAB fluid to container, such as screen width or the layout grid. Exposed as a mixin to support use within `@media` queries.

#### Advanced Sass Mixins

> **A note about advanced mixins**, The following mixins are intended for advanced users. These mixins will override the color of the container, ink, or ripple. You can use all of them if you want to completely customize a FAB. Or you can use only one of them, e.g. if you only need to override the ripple color. **It is up to you to pick container, ink, and ripple colors that work together, and meet accessibility standards.**

Mixin | Description
--- | ---
`mdc-fab-container-color($color)` | Sets the container color to the given color
`mdc-fab-icon-size($width, $height)` | Sets the icon `width`, `height`, and `font-size` properties to the specified `width` and `height`. `$height` is optional and will default to `$width` if omitted. The `font-size` will be set to the provided `$width` value.
`mdc-fab-ink-color($color)` | Sets the ink color to the given color
`mdc-fab-extended-padding($icon-padding, $label-padding)` | Sets the padding on both sides of the icon, and between the label and the edge of the FAB. In cases where there is no icon, `$label-padding` will apply to both sides.
`mdc-fab-extended-label-padding($label-padding)` | Sets the label side padding for Extended FAB. Useful when styling an Extended FAB with no icon.
`mdc-fab-shape-radius($radius, $rtl-reflexive)` | Sets rounded shape to all FAB variants with given radius size. Set `$rtl-reflexive` to true to flip radius values in RTL context, defaults to false.

The ripple effect for the FAB component is styled using [MDC Ripple](../mdc-ripple) mixins.

#### Caveat: Edge and CSS Variables

In browsers that fully support CSS custom properties, the above mixins will work if you pass in a [MDC Theme](../mdc-theme) property (e.g. `primary`) as an argument. However, Edge does not fully support CSS custom properties. If you are using the `mdc-fab-container-color` mixin, you must pass in an actual color value for support in Edge.

### Additional Information

#### Positioning

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
<button class="mdc-fab app-fab--absolute" aria-label="Favorite">
  <span class="mdc-fab__icon material-icons">favorite</span>
</button>
```
