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

The icon button can be used to toggle between an on and off icon. To style an icon button as an icon button toggle, add the
`data-toggle-on` and `data-toggle-off` attributes to the `mdc-icon-button` element. Then instantiate an `MDCIconButtonToggle` on the root element.

```html
<button id="add-to-favorites"
   class="mdc-icon-button material-icons"
   aria-label="Add to favorites"
   aria-hidden="true"
   aria-pressed="false"
   data-toggle-on-content="favorite"
   data-toggle-on-label="Remove from favorites"
   data-toggle-off-content="favorite_border"
   data-toggle-off-label="Add to favorites">favorite_border</button>
```

```js
var toggleButton = new mdc.iconButton.MDCIconButtonToggle(document.getElementById('add-to-favorites'));
```

#### Icon Button Toggle States

Note the use of `data-toggle-*` properties in the above examples. When an MDCIconButtonToggle
instance is toggled, it looks at these data attributes to determine how to update the element. This is what
allows MDCIconButtonToggle to be so flexible. The `data-toggle-on-*` properties will be used when the is
MDCIconButtonToggle is toggled on, and vice versa for `data-toggle-off-*`.

Attribute | Description
--- | ---
`data-toggle-<TOGGLE STATE>-label` | The value to apply to the element's "aria-label" attribute.
`data-toggle-<TOGGLE STATE>-content` | The text content to set on the element. Note that if an inner icon is used, the text content will be set on that element instead.
`data-toggle-<TOGGLE STATE>-class` | A CSS class to apply to the icon element. The same rules regarding inner icon elements described for `content` apply here as well.

#### Icon Button Toggle with Font Awesome

The icon button toggle can be used with other font libraries such as Font Awesome that use an inner icon element.

```html
<button id="star-this-item"
   class="mdc-icon-button"
   aria-label="Unstar this item"
   aria-hidden="true"
   aria-pressed="true"
   data-toggle-on-class="fa-star"
   data-toggle-on-label="Unstar this item"
   data-toggle-off-class="fa-star-o"
   data-toggle-off-label="Star this item"><i class="fa fa-2x fa-star"></i></button>
```

### Icons

The icon button can be used with a standard icon library such as Material Icons or Font Awesome, or with an `svg`.
The icon button toggle should only be used with an standard icon library. We recommend you use 
[Material Icons](https://material.io/tools/icons) from Google Fonts.

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
`addClass(className: string) => void` | Adds a class to the root element, or the inner icon element.
`removeClass(className: string) => void` | Removes a class from the root element, or the inner icon element.
`registerInteractionHandler(type: string, handler: EventListener) => void` | Registers an event handler for an interaction event, such as `click` or `keydown`.
`deregisterInteractionHandler(type: string, handler: EventListener) => void` | Removes an event handler for an interaction event, such as `click` or `keydown`.
`setText(text: string) => void` | Sets the text content of the root element, or the inner icon element.
`getTabIndex() => number` | Returns the tab index of the root element.
`setTabIndex(tabIndex: number) => void` | Sets the tab index of the root element.
`getAttr(name: string) => string` | Returns the value of the attribute `name` on the root element. Can also return `null`, similar to `getAttribute()`.
`setAttr(name: string, value: string) => void` | Sets the attribute `name` to `value` on the root element.
`removeAttr(name: string) => void` | Removes the attribute `name` on the root element.
`notifyChange(evtData: {isOn: boolean}) => void` | Broadcasts a change notification, passing along the `evtData` to the environment's event handling system. In our vanilla implementation, Custom Events are used for this.

### Foundation: `MDCIconButtonToggleFoundation`

The foundation does not contain any public properties or methods aside from those inherited from MDCFoundation.
