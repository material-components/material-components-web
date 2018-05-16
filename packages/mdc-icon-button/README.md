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
     href="https://material-components-web.appspot.com/icon-button.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/icon-toggles.png" width="20" alt="Icon buttons screenshot">
  </a>
</div>-->

Icon buttons allow users to take actions, and make choices, with a single tap.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/buttons.html#buttons-toggle-buttons">Material Design guidelines: Toggle buttons</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/icon-toggle">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/icon-button
```

## Usage

### HTML Structure

```html
<button class="mdc-icon-button material-icons">
  favorite
</button>
```
> Note: The MDC Icon Button can be used with `<button>` and `<a>` tags.

### Styles

```scss
@import "@material/icon-button/mdc-icon-button";
```
### JavaScript Instantiation

The icon button will work without Javascript, but you can enhance it to hav ea ripple effect by instantiating `MDCRipple` on the root element. 
See [MDC Ripple](../mdc-ripple) for details.

```js
import {MDCRipple} from '@material/ripple';

const iconButtonRipple = new MDCRipple(document.querySelector('.mdc-icon-button'));
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

## Variants

### Icon Toggle

The icon button can be used to toggle between an on and off icon. To style an icon button as an icon toggle, add the 
`data-toggle-on` and `data-toggle-off` attributes to the `mdc-icon-button` element. Then instantiate an `MDCIconToggle` on the root element. 

```html
<button id="add-to-favorites"
   class="mdc-icon-button material-icons"
   aria-label="Add to favorites"
   aria-hidden="true"
   data-toggle-on='{"content": "favorite", "label": "Remove From Favorites"}'
   data-toggle-off='{"content": "favorite_border", "label": "Add to Favorites"}'>
    favorites_border
</button>
```

```js
var toggleButton = new mdc.iconButton.MDCIconToggle(document.getElementById('add-to-favorites'));
```

#### Icon Toggle States

Note the use of `data-toggle-on` and `data-toggle-off` in the above examples. When an MDCIconToggle
instance is toggled, it looks at this data to determine how to update the element. This is what
allows MDCIconToggle to be so flexible. The `data-toggle-on` configuration will be used when the is
MDCIconToggle is toggled on, and vice versa for `data-toggle-off`. Both data attributes are encoded
as JSON and can contain the following properties:

Property | Description
--- | ---
`label` | The value to apply to the element's "aria-label" attribute.
`content` | The text content to set on the element. Note that if an inner icon is used, the text content will be set on that element instead.
`cssClass` | A css class to apply to the icon element for the given toggle state. The same rules regarding inner icon elements described for `content` apply here as well.

### Icons 

The icon button can be used with a standard icon library or an `svg`. The icon toggle should only be used with 
an standard icon library. We recommend you use [Material Icons](https://material.io/icons/) from Google Fonts.

### Disabled

To disable an icon, add the `disabled` attribute directly to the `<button>` element. Icon buttons that use the `<a>` tag
cannot be disabled. Disabled icon buttons cannot be interacted with and have no visual interaction effect.

```html
<button class="mdc-icon-button material-icons" disabled>
  favorite
</button>
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
`mdc-icon-button-size($height, $width, $padding)` | Sets the height, width an padding for the icon and ripple. `$width` is optional and defaults to `$height`. `$padding` is optional and defaults to `$height/2`.
`mdc-icon-font-size($font-size)` | Sets the font size for an icon. It will also set the height, width and padding of the element for the ripple to render correctly.
`mdc-icon-button-ink-color($color)` | Sets the font color and the ripple color to the provided color value.


## `MDCIconToggle` Properties and Methods

Method Signature | Description
--- | ---
`on(isOn: boolean) => void` | Sets the toggle state to the provided `isOn` value.
`disabled(isDisabled: boolean) => void` | Sets the icon toggle to the `disabled` state.

### Events

Event Name | Event Data Structure | Description
--- | --- | ---
`MDCIconToggle` | `{"detail": {"isOn": boolean}}` | Emits when the icon is toggled.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Icon Toggle for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCIconToggleAdapter`

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
`rmAttr(name: string) => void` | Removes the attribute `name` on the root element.
`notifyChange(evtData: {isOn: boolean}) => void` | Broadcasts a change notification, passing along the `evtData` to the environment's event handling system. In our vanilla implementation, Custom Events are used for this.

### Foundation: `MDCIconToggleFoundation`

The foundation does not contain any public properties or methods aside from those inherited from MDCFoundation.
