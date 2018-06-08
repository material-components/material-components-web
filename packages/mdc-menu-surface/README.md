<!--docs:
title: "Menu Surface"
layout: detail
section: components
excerpt: "Material Design menu surface."
iconId: menu
path: /catalog/menus/
-->

# Menu Surface

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components.github.io/material-components-web-catalog/#/component/menu">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/menus.png" width="178" alt="Menus screenshot">
  </a>
</div>-->

The MDC Menu Surface component is a reusable surface that appears above the content of the
page and can be positioned adjacent to an element. Menu Surfaces require JavaScript to properly position
themselves when opening.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/menus.html">Material Design guidelines: Menus</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/menu">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/menu-surface
```

## Usage

### HTML Structure

```html
<div class="mdc-menu-surface">
...
</div>
```

### Styles

```css
@import "@material/menu-surface/mdc-menu-surface";
```

### JavaScript Instantiation

```js
import {MDCMenuSurface} from '@material/menu-surface';

const menuSurface = new MDCMenuSurface(document.querySelector('.mdc-menu-surface'));
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-menu-surface` | Mandatory.
`mdc-menu-surface--animating-open` | Indicates the menu surface is currently animating open. This class is removed once the animation completes.
`mdc-menu-surface--open` | Indicates the menu surface is currently open, or is currently animating open.
`mdc-menu-surface--animating-closed` | Indicates the menu surface is currently animating closed. This class is removed once the animation completes.
`mdc-menu-surface--anchor` | Used to indicate which element the menu should be anchored to.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-menu-surface-ink-color($color)` | Sets the `color` property of the `mdc-menu-surface`.
`mdc-menu-surface-fill-color($color)` | Sets the `background-color` property of the `mdc-menu-surface`.

## `MDCMenuSurface` Properties and Methods

Property | Value Type | Description
--- | --- | ---
`open` | Boolean | Proxies to the foundation's `isOpen`/(`open`, `close`) methods.
`quickOpen` | Boolean | Proxies to the foundation's `setQuickOpen()` method.

Method Signature | Description
--- | ---
`show() => void` | Proxies to the foundation's `open()` method.
`hide() => void` | Proxies to the foundation's `close()` method.
`setAnchorCorner(Corner) => void` | Proxies to the foundation's `setAnchorCorner(Corner)` method.
`setAnchorMargin(AnchorMargin) => void` | Proxies to the foundation's `setAnchorMargin(AnchorMargin)` method.
`getDefaultFoundation() => MDCMenuSurfaceFoundation` | Returns the foundation.

## Usage Within Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Menu Surface for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCMenuSurfaceAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element.
`removeClass(className: string) => void` | Removes a class from the root element.
`hasClass(className: string) => boolean` | Returns a boolean indicating whether the root element has a given class.
`hasAnchor: () => boolean` | Returns whether the menu surface has an anchor for positioning.
`registerInteractionHandler(type: string, handler: EventListener) => void` | Adds an event listener `handler` for event type `type`.
`deregisterInteractionHandler(type: string, handler: EventListener) => void` | Removes an event listener `handler` for event type `type`.
`registerBodyClickHandler(handler: EventListener) => void` | Adds an event listener `handler` for event type `click` on the body.
`deregisterBodyClickHandler(handler: EventListener) => void` | Removes an event listener `handler` for event type `click` on the body.
`notifyClose() => void` | Dispatches an event notifying listeners that the menu surface has been closed.
`isElementInContainer(el: Element) => Boolean` | Returns true if the `el` Element is inside the `mdc-menu-surface` container.
`isRtl() => boolean` | Returns boolean indicating whether the current environment is RTL.
`setTransformOrigin(value: string) => void` | Sets the transform origin for the menu surface element.
`focus() => void` | Focuses the root element of the menu surface.
`isFocused() => boolean` | Returns a boolean value indicating whether the root element of the menu surface is focused.
`saveFocus() => void` | Stores the currently focused element on the document, for restoring with `restoreFocus`.
`restoreFocus() => void` | Restores the previously saved focus state, by making the previously focused element the active focus again.
`isFirstElementFocused() => boolean` | Returns a boolean value indicating if the first focusable element of the menu-surface is focused.
`isLastElementFocused() => boolean` | Returns a boolean value indicating if the last focusable element of the menu-surface is focused.
`focusFirstElement() => void` | Focuses the first focusable element of the menu-surface.
`focusLastElement() => void` | Focuses the last focusable element of the menu-surface.
`getInnerDimensions() => {width: number, height: number}` | Returns an object with the items container width and height.
`getAnchorDimensions() => {width: number, height: number, top: number, right: number, bottom: number, left: number}` | Returns an object with the dimensions and position of the anchor (same semantics as `DOMRect`).
`getWindowDimensions() => {width: number, height: number}` | Returns an object with width and height of the page, in pixels.
`setPosition(position: {top: string, right: string, bottom: string, left: string}) => void` | Sets the position of the menu surface element.
`setMaxHeight(value: string) => void` | Sets `max-height` style for the menu surface element.

### `MDCMenuSurfaceFoundation`

Method Signature | Description
--- | ---
`setAnchorCorner(corder: Corner) => void` | Sets the corner that the menu surface will be anchored to. See [constants.js](./constants.js)
`setAnchorMargin(margin: AnchorMargin) => void` | Sets the distance from the anchor point that the menu surface should be shown.
`open() => void` | Opens the menu surface. Optionally accepts an object with a `focusIndex` parameter to indicate which element should receive focus when the menu surface is opened.
`close()` | Closes the menu.
`isOpen() => boolean` | Returns a boolean indicating whether the menu surface is open.
`setQuickOpen(quickOpen: boolean) => void` | Sets whether the menu surface should open and close without animation when the `open`/`close` methods are called.

### Events

Event Name | Data | Description
--- | --- | ---
`MDCMenuSurface:close` | none | Event emitted after the menu surface is closed.
