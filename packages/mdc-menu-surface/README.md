<!--docs:
title: "Menu Surface"
layout: detail
section: components
excerpt: "Material Design menu surface."
iconId: menu
path: /catalog/menu-surface/
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
@use "@material/menu-surface/mdc-menu-surface";
```

### JavaScript Instantiation

```js
import {MDCMenuSurface} from '@material/menu-surface';

const menuSurface = new MDCMenuSurface(document.querySelector('.mdc-menu-surface'));
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.


## Variants

### Anchors and Positioning

#### Anchored To Parent

The menu surface can be positioned to automatically anchor to a parent element when opened.

```html
<div id="toolbar" class="toolbar mdc-menu-surface--anchor">
  <div class="mdc-menu-surface">
  ...
  </div>
</div>
```

#### Anchor To Element Within Wrapper

The menu surface can be positioned to automatically anchor to another element, by wrapping the other element with the anchor class.

```html
<div class="mdc-menu-surface--anchor">
  <button id="menu-surface-button">Open Menu Surface</button>
  <div class="mdc-menu-surface">
  ...
  </div>
</div>
```

#### Fixed Position

The menu surface can use fixed positioning when being displayed.

```html
<div class="mdc-menu-surface mdc-menu-surface--fixed">
...
</div>
```

Or in JS:

```js
// ...
menuSurface.setFixedPosition(true);
```

#### Absolute Position

The menu surface can use absolute positioning when being displayed. This requires that the element containing the
menu has the `position: relative` style.

```html
<div class="mdc-menu-surface">
...
</div>
```

```js
// ...
menuSurface.setAbsolutePosition(100, 100);
```

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-menu-surface` | Mandatory.
`mdc-menu-surface--animating-open` | Indicates the menu surface is currently animating open. This class is removed once the animation completes.
`mdc-menu-surface--open` | Indicates the menu surface is currently open, or is currently animating open.
`mdc-menu-surface--animating-closed` | Indicates the menu surface is currently animating closed. This class is removed once the animation completes.
`mdc-menu-surface--anchor` | Used to indicate which element the menu should be anchored to.
`mdc-menu-surface--fixed` | Used to indicate that the menu is using fixed positioning.

### Sass Mixins

Mixin | Description
--- | ---
`ink-color($color)` | Sets the `color` property of the `mdc-menu-surface`.
`fill-color($color)` | Sets the `background-color` property of the `mdc-menu-surface`.
`shape-radius($radius, $rtl-reflexive)` | Sets the rounded shape to menu surface with given radius size. Set `$rtl-reflexive` to true to flip radius values in RTL context, defaults to false.

## Constants & Types

Constant Name | Description
--- | ---
`Corner` | Enum for representing an element corner for positioning the menu-surface. See [constants.ts](./constants.ts).

Type Name | Description
--- | ---
`MDCMenuDimensions` | Width/height of an element. See [types.ts](./types.ts).
`MDCMenuDistance` | Margin values representing the distance from anchor point that the menu surface should be shown. See [types.ts](./types.ts).
`MDCMenuPoint` | X/Y coordinates. See [types.ts](./types.ts).

## `MDCMenuSurface` Properties and Methods

Property | Value Type | Description
--- | --- | ---
`quickOpen` | `boolean` | Proxies to the foundation's `setQuickOpen()` method.
`anchorElement` | `Element` | Gets or sets the element that the surface is anchored to, or `null` if the surface is not anchored. Defaults to the root element's parent `mdc-menu-surface--anchor` element if present.

Method Signature | Description
--- | ---
`isOpen() => boolean` | Proxies to the foundation's `isOpen` method.
`open() => void` | Proxies to the foundation's `open` method.
`close(skipRestoreFocus: boolean) => void` | Proxies to the foundation's `close` method.
`setAnchorCorner(Corner) => void` | Proxies to the foundation's `setAnchorCorner(Corner)` method.
`setAnchorMargin(Partial<MDCMenuDistance>) => void` | Proxies to the foundation's `setAnchorMargin(Partial<MDCMenuDistance>)` method.
`setFixedPosition(isFixed: boolean) => void` | Adds the `mdc-menu-surface--fixed` class to the `mdc-menu-surface` element. Proxies to the foundation's `setIsHoisted()` and `setFixedPosition()` methods.
`setAbsolutePosition(x: number, y: number) => void` | Proxies to the foundation's `setAbsolutePosition(x, y)` method. Used to set the absolute x/y position of the menu on the page. Should only be used when the menu is hoisted to the body.
`setMenuSurfaceAnchorElement(element: Element) => void` | Sets the element used as an anchor for `menu-surface` positioning logic.
`setIsHoisted() => void` | Proxies to the foundation's `setIsHoisted` method.
`getDefaultFoundation() => MDCMenuSurfaceFoundation` | Returns the foundation.

### Events

Event Name | Data | Description
--- | --- | ---
`MDCMenuSurface:closed` | none | Event emitted after the menu surface is closed.
`MDCMenuSurface:opened` | none | Event emitted after the menu surface is opened.

## Usage Within Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Menu Surface for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCMenuSurfaceAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element.
`removeClass(className: string) => void` | Removes a class from the root element.
`hasClass(className: string) => boolean` | Returns a boolean indicating whether the root element has a given class.
`hasAnchor: () => boolean` | Returns whether the menu surface has an anchor for positioning.
`notifyClose() => void` | Dispatches an event notifying listeners that the menu surface has been closed.
`notifyOpen() => void` | Dispatches an event notifying listeners that the menu surface has been opened.
`isElementInContainer(el: Element) => boolean` | Returns true if the `el` Element is inside the `mdc-menu-surface` container.
`isRtl() => boolean` | Returns boolean indicating whether the current environment is RTL.
`setTransformOrigin(value: string) => void` | Sets the transform origin for the menu surface element.
`isFocused() => boolean` | Returns a boolean value indicating whether the root element of the menu surface is focused.
`saveFocus() => void` | Stores the currently focused element on the document, for restoring with `restoreFocus`.
`restoreFocus() => void` | Restores the previously saved focus state, by making the previously focused element the active focus again.
`getInnerDimensions() => MDCMenuDimensions` | Returns an object with the items container width and height.
`getAnchorDimensions() => ClientRect \| null` | Returns an object with the dimensions and position of the anchor.
`getBodyDimensions() => MDCMenuDimensions` | Returns an object with width and height of the body, in pixels.
`getWindowDimensions() => MDCMenuDimensions` | Returns an object with width and height of the viewport, in pixels.
`getWindowScroll() => MDCMenuPoint` | Returns an object with the amount the body has been scrolled on the `x` and `y` axis.
`setPosition(position: Partial<MDCMenuDistance>) => void` | Sets the position of the menu surface element.
`setMaxHeight(value: string) => void` | Sets `max-height` style for the menu surface element.

### `MDCMenuSurfaceFoundation`

Method Signature | Description
--- | ---
`setAnchorCorner(corner: Corner) => void` | Sets the corner that the menu surface will be anchored to. See [constants.ts](./constants.ts)
`setAnchorMargin(margin: Partial<MDCMenuDistance>) => void` | Sets the distance from the anchor point that the menu surface should be shown.
`setIsHoisted(isHoisted: boolean) => void` | Sets whether the menu surface has been hoisted to the body so that the offsets are calculated relative to the page and not the anchor.
`setFixedPosition(isFixed: boolean) => void` | Sets whether the menu surface is using fixed positioning.
`setAbsolutePosition(x: number, y: number) => void` | Sets the absolute x/y position of the menu. Should only be used when the menu is hoisted or using fixed positioning.
`handleBodyClick(event: MouseEvent) => void` | Method used as the callback function for the `click` event.
`handleKeydown(event: KeyboardEvent) => void` | Method used as the callback function for the `keydown` events.
`open() => void` | Opens the menu surface.
`close() => void` | Closes the menu.
`isOpen() => boolean` | Returns a boolean indicating whether the menu surface is open.
`setQuickOpen(quickOpen: boolean) => void` | Sets whether the menu surface should open and close without animation when the `open`/`close` methods are called.
