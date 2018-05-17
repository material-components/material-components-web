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
     href="https://material-components-web.appspot.com/menu.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/menus.png" width="178" alt="Menus screenshot">
  </a>
</div>-->

The MDC Menu Surface component is a reusable temporary surface that appears above the content of the 
page and can be positioned adjacent to an element. Temporary Surfaces require Javascript to properly position 
itself when opening.

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
</div>
```

### JavaScript Instantiation

```js
import {MDCMenuSurface} from '@material/menu-surface';

const menuSurface = new MDCMenuSurface(document.querySelector('.mdc-menu-surface'));
```

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-menu-surface` | Mandatory.
`mdc-menu-surface--animating-open` | Indicates the menu is currently animating open. This class is removed once the animation completes.
`mdc-menu-surface--open` | Indicates the menu is currently open, or is currently animating open.
`mdc-menu-surface--animating-closed` | Indicates the menu is currently animating closed. This class is removed once the animation completes.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-menu-surface-color($color)` | Sets the `background-color` property of the `mdc-menu-surface`.
`mdc-menu-on-surface-color($color)` | Sets the `color` property of the `mdc-menu-surface`.

### `MDCMenuSurface`

See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

Property | Value Type | Description
--- | --- | ---
`open` | Boolean | Proxies to the foundation's `isOpen`/(`open`, `close`) methods.
`items` | Array<Element> | Proxies to the foundation's container to query for all `.mdc-list-item[role]` elements.
`itemsContainer` | Element | Queries the foundation's root element for the `mdc-menu__items` container element.
`quickOpen` | Boolean | Proxies to the foundation's `setQuickOpen()` method.
`disableHorizontalAutoAlignment` | Boolean | Proxies to the foundation's `disableHorizontalAlignment()` method.

Method Signature | Description
--- | ---
`show({focusIndex: ?number}) => void` | Proxies to the foundation's `open()` method. An optional config parameter allows the caller to specify which item should receive focus after the menu opens.
`hide() => void` | Proxies to the foundation's `close()` method.
`setAnchorCorner(Corner) => void` | Proxies to the foundation's `setAnchorCorner(Corner)` method.
`setAnchorMargin(AnchorMargin) => void` | Proxies to the foundation's `setAnchorMargin(AnchorMargin)` method.
`getDefaultFoundation() => MDCMenuSurfaceFoundation` | Returns the foundation.
`hoistToBody() => void` | Removes the `menu-surface` from the DOM and appends it to the body.
`setAnchorElement(element: Element) => void` | Sets the HTML element that this menu should position around.

## Usage Within Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Text Field for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCMenuSurfaceAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element.
`removeClass(className: string) => void` | Removes a class from the root element.
`hasClass(className: string) => boolean` | Returns a boolean indicating whether the root element has a given class.
`getAttributeForEventTarget(target: EventTarget, attributeName: string) => string` | Returns the value of a given attribute on an event target.
`getInnerDimensions() => {width: number, height: number}` | Returns an object with the items container width and height.
`hasAnchor: () => boolean` | Returns whether the menu has an anchor for positioning.
`getAnchorDimensions() => {width: number, height: number, top: number, right: number, bottom: number, left: number}` | Returns an object with the dimensions and position of the anchor (same semantics as `DOMRect`).
`getWindowDimensions() => {width: number, height: number}` | Returns an object with width and height of the page, in pixels.
`getNumberFocusableElements() => number` | Returns the number of focusable elements inside the items container. 
`getFocusedItemIndex() => number` | Returns the index of the currently focused menu item (-1 if none).
`focusItemAtIndex(index: number) => void` | Focuses the menu item with the provided index.
`getIndexForEventTarget(target: EventTarget) => number` | Checks to see if the `target` of an event pertains to one of the menu surface focusable elements, and if so returns the index of that item. Returns -1 if the target is not one of the focusable elements.
`registerInteractionHandler(type: string, handler: EventListener) => void` | Adds an event listener `handler` for event type `type`.
`deregisterInteractionHandler(type: string, handler: EventListener) => void` | Removes an event listener `handler` for event type `type`.
`registerBodyClickHandler(handler: EventListener) => void` | Adds an event listener `handler` for event type `click`.
`deregisterBodyClickHandler(handler: EventListener) => void` | Removes an event listener `handler` for event type `click`.
`notifyClose() => void` | Dispatches an event notifying listeners that the menu surface has been closed.
`saveFocus() => void` | Stores the currently focused element on the document, for restoring with `restoreFocus`.
`restoreFocus() => void` | Restores the previously saved focus state, by making the previously focused element the active focus again.
`isElementInContainer(el: Element) => Boolean` | Returns true if the `el` Element is inside the `mdc-menu-surface` container.
`isFocused() => boolean` | Returns a boolean value indicating whether the root element of the menu is focused.
`focus() => void` | Focuses the root element of the menu.
`isRtl() => boolean` | Returns boolean indicating whether the current environment is RTL.
`setTransformOrigin(value: string) => void` | Sets the transform origin for the menu element.
`setPosition(position: {top: string, right: string, bottom: string, left: string}) => void` | Sets the position of the menu element.
`setMaxHeight(value: string) => void` | Sets `max-height` style for the menu element.

### `MDCMenuSurfaceFoundation`

Method Signature | Description
--- | ---
`setAnchorCorner(corder: Corner) => void` | Sets the corner that the menu will be anchored to. See [constants.js](https://github.com/material-components/material-components-web/blob/cc299230728ba5a994866ebd31aaaf1a0f4cc87f/packages/mdc-menu/constants.js#L73)
`setAnchorMargin(margin: AnchorMargin) => void` | Sets the distance from the anchor point that the menu should be shown.
`setAnchorEleent(el: Element) => void` | Sets the element that the menu will be anchored to.
`open({focusIndex: ?number}) => void` | Opens the menu. Optionally accepts an object with a `focusIndex` parameter to indicate which list item should receive focus when the menu is opened.
`close(evt: ?Event)` | Closes the menu. Optionally accepts the event to check if the target is disabled before closing the menu.
`isOpen() => boolean` | Returns a boolean indicating whether the menu is open.
`setQuickOpen(quickOpen: boolean) => void` | Sets whether the menu should open and close without animation when the `open`/`close` methods are called.
`disableHorizontalAutoAlignment(isDisabled: boolean) => void` | Disables the horizontal auto alignment of the menu. 

### Events

Event Name | Data | Description
--- | --- | ---
`MDCMenuSurface:cancel` | none | Event emitted after the menu is closed.
