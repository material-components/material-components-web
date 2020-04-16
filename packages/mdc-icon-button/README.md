<!--docs:
title: "Icon buttons"
layout: detail
section: components
excerpt: "Web icon buttons"
iconId: button
path: /catalog/buttons/icon-buttons/
-->

# Icon buttons

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components.github.io/material-components-web-catalog/#/component/icon-button">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/icon-toggles.png" width="20" alt="Icon buttons screenshot">
  </a>
</div>-->

[Icon buttons](https://material.io/components/buttons/) allow users to take actions, and make choices, with a single tap.

**Note**: For buttons with both icons and text, use the `mdc-button` component. For more information, see the `mdc-button` [docs](../mdc-button).

## Using icon buttons

### Installation

```
npm install @material/icon-button
```

### Styles

```scss
@use "@material/icon-button";

@include icon-button.core-styles;
```

### JavaScript instantiation

The icon button will work without JavaScript, but you can enhance it to have a ripple effect by instantiating `MDCRipple` on the root element.
See [MDC Ripple](../mdc-ripple) for details.

```js
import {MDCRipple} from '@material/ripple';

const iconButtonRipple = new MDCRipple(document.querySelector('.mdc-icon-button'));
iconButtonRipple.unbounded = true;
```

**Note**: See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

### Icons

We recommend using [Material Icons](https://material.io/tools/icons/) from Google Fonts:

```html
<head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
```

However, you can also use SVG, [Font Awesome](https://fontawesome.com/), or any other icon library you wish.

## Icon button

```html
<button class="mdc-icon-button material-icons">favorite</button>
```

**Note**: The MDC Icon Button can be used with both `<button>` and `<a>` tags.

**Note**: IE11 will not center the icon properly if there is a newline or space after the material icon text.

## Icon button toggle

The icon button can be used to toggle between an on and off icon.

To style an icon button as an icon button toggle, add
both icons as child elements and place the `mdc-icon-button__icon--on` class on the icon that represents the on element.
If the button should be initialized in the "on" state, then add the `mdc-icon-button--on` class to the parent `button`.

```html
<button id="add-to-favorites"
   class="mdc-icon-button"
   aria-label="Add to favorites"
   aria-pressed="false">
   <i class="material-icons mdc-icon-button__icon mdc-icon-button__icon--on">favorite</i>
   <i class="material-icons mdc-icon-button__icon">favorite_border</i>
</button>
```

Then, instantiate an `MDCIconButtonToggle` on the root element.

```js
import {MDCIconButtonToggle} from '@material/icon-button';
const iconToggle = new MDCIconButtonToggle(document.querySelector('.mdc-icon-button'));
```

### Icon button toggle with SVG

The icon button toggle can be used with SVGs.

```html
<button id="star-this-item"
   class="mdc-icon-button mdc-icon-button--on"
   aria-label="Unstar this item"
   aria-pressed="true">
   <svg class="mdc-icon-button__icon">
     ...
   </svg>
   <svg class="mdc-icon-button__icon mdc-icon-button__icon--on">
     ...
  </svg>
</button>
```

### Icon button toggle with an image

The icon button toggle can be used with `img` tags.

```html
<button id="star-this-item"
   class="mdc-icon-button mdc-icon-button--on"
   aria-label="Unstar this item"
   aria-pressed="true">
   <img src="" class="mdc-icon-button__icon"/>
   <img src="" class="mdc-icon-button__icon mdc-icon-button__icon--on"/>
</button>
```

### Icon button toggle with toggled aria label

Some designs may call for the aria label to change depending on the icon button
state. In this case, specify the `data-aria-label-on` (aria label in on state)
and `aria-data-label-off` (aria label in off state) attributes, and omit the
`aria-pressed` attribute.

```html
<button id="add-to-favorites"
   class="mdc-icon-button"
   aria-label="Add to favorites"
   data-aria-label-on="Remove from favorites"
   data-aria-label-off="Add to favorites">
   <i class="material-icons mdc-icon-button__icon mdc-icon-button__icon--on">favorite</i>
   <i class="material-icons mdc-icon-button__icon">favorite_border</i>
</button>
```

## API

### CSS classes

CSS Class | Description
--- | ---
`mdc-icon-button` | Mandatory.
`mdc-icon-button--on` | This class is applied to the root element and is used to indicate if the icon button toggle is in the "on" state.
`mdc-icon-button__icon` | This class is applied to each icon element for the icon button toggle.
`mdc-icon-button__icon--on` | This class is applied to a icon element and is used to indicate the toggle button icon that is represents the "on" icon.

### Sass mixins

To customize an icon button's color and properties, you can use the following mixins.

Mixin | Description
--- | ---
`density($density-scale)` | Sets density scale for icon button. Supported density scales range from `-5` to `0`, (`0` being the default).
`size($size)` | Sets the padding for the icon button based on overall size.
`icon-size($width, $height, $padding)` | Sets the width, height, font-size and padding for the icon and ripple. `$height` is optional and defaults to `$width`. `$padding` is optional and defaults to `max($width, $height)/2`. `font-size` is set to `max($width, $height)`.
`ink-color($color)` | Sets the font color and the ripple color to the provided color value.
`disabled-ink-color($color)` | Sets the font color to the provided color value for a disabled icon button.
`flip-icon-in-rtl()` | Flips icon only in RTL context.

### `MDCIconButtonToggle` properties and methods

Property | Value Type | Description
--- | --- | ---
`on` | Boolean | Sets the toggle state to the provided `isOn` value.

### Events

Event Name | Event Data Structure | Description
--- | --- | ---
`MDCIconButtonToggle:change` | `{"detail": {"isOn": boolean}}` | Emits when the icon is toggled.

### `MDCIconButtonToggleAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element.
`removeClass(className: string) => void` | Removes a class from the root element.
`hasClass(className: string) => boolean` | Determines whether the root element has the given CSS class name.
`setAttr(name: string, value: string) => void` | Sets the attribute `name` to `value` on the root element.
`notifyChange(evtData: {isOn: boolean}) => void` | Broadcasts a change notification, passing along the `evtData` to the environment's event handling system. In our vanilla implementation, Custom Events are used for this.

### `MDCIconButtonToggleFoundation`

Method Signature | Description
--- | ---
`handleClick()` | Event handler triggered on the click event. It will toggle the icon from on/off and update aria attributes.
