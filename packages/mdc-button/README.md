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
     href="https://material-components.github.io/material-components-web-catalog/#/component/button">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/buttons.png" width="363" alt="Buttons screenshot">
  </a>
</div>-->

Buttons allow users to take actions, and make choices, with a single tap.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-buttons">Material Design guidelines: Buttons</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/button">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/button
```

## Basic Usage

### HTML Structure

```html
<button class="mdc-button">
  <div class="mdc-button__ripple"></div>
  <span class="mdc-button__label">Button</span>
</button>
```

> _NOTE_: Examples here use the generic `<button>`, but users can also apply the `mdc-button` class to `<a>` elements.

### Styles

```scss
@import "@material/button/mdc-button";
```

### JavaScript Instantiation

The button will work without JavaScript, but you can enhance it to have a ripple effect by instantiating `MDCRipple` on the root element. See [MDC Ripple](../mdc-ripple) for details.

```js
import {MDCRipple} from '@material/ripple';

const buttonRipple = new MDCRipple(document.querySelector('.mdc-button'));
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

## Variants

### Contained Button

To style a contained button, add the `mdc-button--raised` class to the `<button>` element for a contained button with elevation, or the `mdc-button--unelevated` class for a contained button flush with the surface.

### Outlined Button

To style an outlined button, add the class `mdc-button--outlined` to the `<button>` element.

### Icons

We recommend using [Material Icons](https://material.io/tools/icons/) from Google Fonts:

```html
<head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
```

However, you can also use SVG, [Font Awesome](https://fontawesome.com/), or any other icon library you wish.

To add an icon, add an element with the `mdc-button__icon` class inside the button element and set the attribute `aria-hidden="true"`. The icon is set to 18px to meet legibility requirements.

```html
<button class="mdc-button">
  <div class="mdc-button__ripple"></div>
  <i class="material-icons mdc-button__icon" aria-hidden="true">favorite</i>
  <span class="mdc-button__label">Button</span>
</button>
```

It's also possible to use an SVG icon:

```html
<button class="mdc-button">
  <div class="mdc-button__ripple"></div>
  <svg class="mdc-button__icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" viewBox="...">
  ...
  </svg>
  <span class="mdc-button__label">Button</span>
</button>
```

#### Trailing Icon

Certain icons make more sense to appear after the button's text label rather than before. This can be accomplished by
putting the icon markup _after_ the `mdc-button__label` element.

```html
<button class="mdc-button">
  <div class="mdc-button__ripple"></div>
  <span class="mdc-button__label">Button</span>
  <i class="material-icons mdc-button__icon" aria-hidden="true">favorite</i>
</button>
```

> _NOTE_: The `mdc-button__label` element is _required_ in order for the trailing icon to be styled appropriately.

### Disabled

To disable a button, add the `disabled` attribute directly to the `<button>`, or set the `disabled` attribute on the `<fieldset>` containing the button.
Disabled buttons cannot be interacted with and have no visual interaction effect.

```html
<button class="mdc-button" disabled>
  <div class="mdc-button__ripple"></div>
  <span class="mdc-button__label">Button</span>
</button>
```

## Additional Information

### Accessibility

Material Design spec advises that touch targets should be at least 48 x 48 px.
To meet this requirement, add the following to your button:

```html
<div class="mdc-touch-target-wrapper">
  <button class="mdc-button mdc-button--touch">
    <div class="mdc-button__ripple"></div>
    <span class="mdc-button__label">My Accessible Button</span>
    <div class="mdc-button__touch"></div>
  </button>
</div>
```

Note that the outer `mdc-touch-target-wrapper` element is only necessary if you want to avoid potentially overlapping touch targets on adjacent elements (due to collapsing margins).

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-button` | Mandatory. Defaults to a text button that is flush with the surface.
`mdc-button__ripple` | Mandatory. Indicates the element which shows the ripple styling.
`mdc-button--raised` | Optional. Styles a contained button that is elevated above the surface.
`mdc-button--unelevated` | Optional. Styles a contained button that is flush with the surface.
`mdc-button--outlined` | Optional. Styles an outlined button that is flush with the surface.
`mdc-button__label` | Recommended.\* Indicates the element containing the button's text label.
`mdc-button__icon` | Optional. Indicates the element containing the button's icon.

> \*_NOTE_: The `mdc-button__label` element is required for buttons with a trailing icon, but it is currently optional for
> buttons with no icon or a leading icon. In the latter cases, it is acceptable for the text label to simply exist
> directly within the `mdc-button` element.
> However, the `mdc-button__label` class may become mandatory for all cases in the future, so it is recommended to
> always include it to be future-proof.

### Sass Mixins

To customize a button's color and properties, you can use the following mixins.

#### Basic Sass Mixins

MDC Button uses [MDC Theme](../mdc-theme)'s `primary` color by default. Use the following mixins to customize it.

Mixin | Description
--- | ---
`mdc-button-filled-accessible($container-fill-color)` | Sets the container fill color for a contained (_raised_ or _unelevated_) button, and updates the button's ink, icon, and ripple colors to meet accessibility standards

#### Advanced Sass Mixins

These mixins will override the color of the container, ink, outline or ripple. It is up to you to ensure your button meets accessibility standards.

Mixin | Description
--- | ---
`mdc-button-container-fill-color($color)` | Sets the container fill color to the given color for an enabled button.
`mdc-button-disabled-container-fill-color($color)` | Sets the container fill color to the given color for a disabled button.
`mdc-button-icon-color($color)` | Sets the icon color to the given color for an enabled button.
`mdc-button-disabled-icon-color($color)` | Sets the icon color to the given color for a disabled button.
`mdc-button-ink-color($color)` | Sets the ink color to the given color for an enabled button, and sets the icon color to the given color unless `mdc-button-icon-color` is also used.
`mdc-button-disabled-ink-color($color)` | Sets the ink color to the given color for a disabled button, and sets the icon color to the given color unless `mdc-button-icon-color` is also used.
`mdc-button-density($density-scale)` | Sets density scale for button. Supported density scale values (`-3`, `-2`, `-1`, `0`).
`mdc-button-height($height)` | Sets custom height for button.
`mdc-button-shape-radius($radius, $density-scale, $rtl-reflexive)` | Sets rounded shape to button with given radius size. `$density-scale` is only required when `$radius` value is in percentage unit, defaults to `$mdc-button-density-default-scale`. Set `$rtl-reflexive` to true to flip radius values in RTL context, defaults to false.
`mdc-button-horizontal-padding($padding)` | Sets horizontal padding to the given number.
`mdc-button-outline-color($color)` | Sets the outline color to the given color for an enabled button.
`mdc-button-disabled-outline-color($color)` | Sets the outline color to the given color for a disabled button.
`mdc-button-outline-width($width, $padding)` | Sets the outline width to the given number (defaults to 2px) and adjusts padding accordingly. `$padding` is only required in cases where `mdc-button-horizontal-padding` is also included with a custom value.

##### Caveat: Edge and CSS Custom Properties

In browsers that fully support CSS custom properties, the above mixins will work if you pass in a [MDC Theme](../mdc-theme) property (e.g. `primary`) as an argument. However, Edge does not fully support CSS custom properties. If you are using the `mdc-button-container-fill-color` mixin, you must pass in an actual color value for support in Edge.
