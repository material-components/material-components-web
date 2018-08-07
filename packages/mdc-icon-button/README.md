<!--docs:
title: "Icon Buttons"
layout: detail
section: components
iconId: button
path: /catalog/buttons/icon-buttons/
-->

# Icon Buttons

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components.github.io/material-components-web-catalog/#/component/icon-button">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/icon-toggles.png" width="20" alt="Icon buttons screenshot">
  </a>
</div>-->

Icon buttons allow users to take actions, and make choices, with a single tap.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-buttons#toggle-button">Material Design guidelines: Toggle buttons</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/icon-button">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/icon-button
```

## Usage

### HTML Structure

```html
<button class="mdc-icon-button material-icons">favorite</button>
```

> Note: The MDC Icon Button can be used with `<button>` and `<a>` tags.

> Note: IE11 will not center the icon properly if there is a newline or space after the material icon text.

### Styles

```scss
@import "@material/icon-button/mdc-icon-button";
```

### JavaScript Instantiation

The icon button will work without JavaScript, but you can enhance it to have a ripple effect by instantiating `MDCRipple` on the root element.
See [MDC Ripple](../mdc-ripple) for details.

```js
import {MDCRipple} from '@material/ripple';

const iconButtonRipple = new MDCRipple(document.querySelector('.mdc-icon-button'));
iconButtonRipple.unbounded = true;
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

## Variants

### Icon Button Toggle

The icon button can be used to toggle between an on and off icon. To style an icon button as an icon button toggle, add
both icons as child elements and place the `data-toggle-on` attribute on the icon that should be on. If the button
should be initialized in the "on" state, then add the `mdc-icon-button--on` class to the parent `button`. Then
instantiate an `MDCIconButtonToggle` on the root element.

```html
<button id="add-to-favorites"
   class="mdc-icon-button"
   aria-label="Add to favorites"
   aria-hidden="true"
   aria-pressed="false">
   <i class="material-icons mdc-icon-button__icon">favorite</i>
   <i class="material-icons mdc-icon-button__icon" data-toggle-on>favorite_border</i>
</button>
```

```js
var toggleButton = new mdc.iconButton.MDCIconButtonToggle(document.getElementById('add-to-favorites'));
```

#### Icon Button Toggle States

Note the use of `data-toggle-on` attribute in the above examples. This attribute indicates which element is the
on element. When the `mdc-icon-button--on` class is present, the element with the `data-toggle-on` attribute
will be shown and the other element will be hidden. When the `mdc-icon-button--on` class is not present, the element
with the `data-toggle-on` attribute will be hidden and the other element will beshown. This is what allows
MDCIconButtonToggle to be so flexible. 

Attribute | Description
--- | ---
`data-toggle-on` | Used to indicate which element in an icon button toggle is the `on` value.

#### Icon Button Toggle with SVG

The icon button toggle can be used with SVGs.

```html
<button id="star-this-item"
   class="mdc-icon-button mdc-icon-button--on"
   aria-label="Unstar this item"
   aria-hidden="true"
   aria-pressed="true">
   <svg class="mdc-icon-button__icon">
     ...
   </svg>
   <svg class="mdc-icon-button__icon" data-toggle-on>
     ...
  </svg>
</button>
```

#### Icon Button Toggle with an Image

The icon button toggle can be used with `img` tags.

```html
<button id="star-this-item"
   class="mdc-icon-button mdc-icon-button--on"
   aria-label="Unstar this item"
   aria-hidden="true"
   aria-pressed="true">
   <img src="" class="mdc-icon-button__icon"/>
   <img src="" class="mdc-icon-button__icon" data-toggle-on/>
</button>
```

### Icons

The icon button can be used with a standard icon library such as Material Icons, or with an `svg`.
We recommend you use [Material Icons](https://material.io/tools/icons) from Google Fonts.

### Disabled

To disable an icon, add the `disabled` attribute directly to the `<button>` element. Icon buttons that use the `<a>` tag
cannot be disabled. Disabled icon buttons cannot be interacted with and have no visual interaction effect.

```html
<button class="mdc-icon-button material-icons" disabled>favorite</button>
```

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-icon-button` | Mandatory.
`mdc-icon-button--on` | Used to indicate the toggle button icon that is the not-selected option.

### Sass Mixins

To customize an icon button's color and properties, you can use the following mixins.

Mixin | Description
--- | ---
`mdc-icon-button-size($width, $height, $padding)` | Sets the width, height, font-size and padding for the icon and ripple. `$height` is optional and defaults to `$width`. `$padding` is optional and defaults to `max($width, $height)/2`. `font-size` is set to `max($width, $height)`.
`mdc-icon-button-ink-color($color)` | Sets the font color and the ripple color to the provided color value.


## `MDCIconButtonToggle` Properties and Methods

Property | Value Type | Description
--- | --- | ---
`on` | Boolean | Sets the toggle state to the provided `isOn` value.

### Events

Event Name | Event Data Structure | Description
--- | --- | ---
`MDCIconButtonToggle:change` | `{"detail": {"isOn": boolean}}` | Emits when the icon is toggled.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create an Icon Button Toggle for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCIconButtonToggleAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to a icon element.
`removeClass(className: string) => void` | Removes a class from a icon element.
`getAttr(name: string) => string` | Returns the value of the attribute `name` on the root element. Can also return `null`, similar to `getAttribute()`.
`setAttr(name: string, value: string) => void` | Sets the attribute `name` to `value` on the root element.
`notifyChange(evtData: {isOn: boolean}) => void` | Broadcasts a change notification, passing along the `evtData` to the environment's event handling system. In our vanilla implementation, Custom Events are used for this.

### Foundation: `MDCIconButtonToggleFoundation`

Method Signature | Description
--- | ---
`handleClick()` | Event handler triggered on the click event. It will toggle the icon from on/off and update aria attributes.