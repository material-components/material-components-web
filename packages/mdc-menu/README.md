<!--docs:
title: "Menus"
layout: detail
section: components
excerpt: "Non-cascading Material Design menus."
iconId: menu
path: /catalog/menus/
-->

# Menus

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/simple-menu.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/menus.png" width="178" alt="Menus screenshot">
  </a>
</div>-->

The MDC Menu component is a spec-aligned menu component adhering to the
[Material Design menu specification](https://material.io/guidelines/components/menus.html).
It implements simple menus. Menus require JavaScript to work correctly, but the open and closed states are correct on
first render.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/menus.html">Material Design guidelines: Menus</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/simple-menu.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install --save @material/<MODULE_NAME>
```

## Usage

A simple menu is usually closed, appearing when opened. It is appropriate for any display size.

```html
<div class="mdc-simple-menu" tabindex="-1">
  <ul class="mdc-simple-menu__items mdc-list" role="menu" aria-hidden="true">
    <li class="mdc-list-item" role="menuitem" tabindex="0">
      A Menu Item
    </li>
    <li class="mdc-list-item" role="menuitem" tabindex="0">
      Another Menu Item
    </li>
  </ul>
</div>
```
> Note: adding a `tabindex` of `0` to the menu items places them in the tab order.
  Adding a `tabindex` of `-1` to the root element makes it programmatically focusable, without
  placing it in the tab order. This allows the menu to be focused on open, so that the next Tab
  keypress moves to the first menu item. If you would like the first menu item to be automatically
  focused instead, remove `tabindex="-1"` from the root element.

```js
let menu = new mdc.menu.MDCSimpleMenu(document.querySelector('.mdc-simple-menu'));
// Add event listener to some button to toggle the menu on and off.
document.querySelector('.some-button').addEventListener('click', () => menu.open = !menu.open);
```

You can start the menu in its open state by adding the `mdc-simple-menu--open` class to your HTML:

```html
<div class="mdc-simple-menu mdc-simple-menu--open">
...
</div>
```

### Positioning the menu

The menu can either be positioned manually, or automatically, by anchoring it to an element.

#### Positioning

The menu can use an anchor to determine how to automatically position itself in relation to the anchored element. 

##### Anchor To Parent Wrapper

The anchor can be a visible element that the menu is a child of:

```html
<div id="toolbar" class="toolbar mdc-menu-anchor">
  <div class="mdc-simple-menu">
  ...
  </div>
</div>
```

##### Anchor To Element Within Wrapper

The anchor can also be a wrapper element that contains the actual visible element to attach to:

```html
<div id="demo-menu" class="mdc-menu-anchor">
  <button id="menu-button">Open Menu</button>
  <div class="mdc-simple-menu">
  ...
  </div>
</div>
```

##### Manual Positioning

The menu is absolutely positioned by default. It must be positioned by using the style attribute or a class with position properties. 

```html
<div class="container">
  <div class="mdc-simple-menu" style="top: 0; left: 0;">
  ...
  </div>
</div>
```

#### Disabled menu items

When used in components such as MDC Menu, menu list items can be disabled.
To disable a list item, set `aria-disabled` property to `"true"`, and set `tabindex` to `"-1"`.

```html
<div class="mdc-simple-menu" tabindex="-1">
  <ul class="mdc-simple-menu__items mdc-list" role="menu" aria-hidden="true">
    <li class="mdc-list-item" role="menuitem" tabindex="0">
      A Menu Item
    </li>
    <li class="mdc-list-item" role="menuitem" tabindex="-1" aria-disabled="true">
      Disabled Menu Item
    </li>
  </ul>
</div>
```

### CSS Classes

CSS Class | Description
--- | ---
`mdc-simple-menu` | Mandatory
`mdc-simple-menu--animating-open` | Indicates the menu is currently animating open. This class is removed once the animation completes. 
`mdc-simple-menu--open` | Indicates the menu is currently open, or is currently animating open. 
`mdc-simple-menu--animating-closed` | Indicates the menu is currently animating closed. This class is removed once the animation completes. 

### JS Examples

```js
  // Instantiation
  var menuEl = document.querySelector('#toolbar');
  var menu = new mdc.menu.MDCSimpleMenu(menuEl);
  var menuButtonEl = document.querySelector('#menu-button');
  
  // Toggle menu open
  menuButtonEl.addEventListener('click', function() {
    menu.open = !menu.open;
  });
  
  // Listen for selected item
  menuEl.addEventListener('MDCSimpleMenu:selected', function(evt) {
     var detail = evt.detail;
  });
  
  // Set Anchor Corner to Bottom End
  menu.setAnchorCorner(Corner.BOTTOM_END); 
```

### `MDCSimpleMenu`

See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

Property | Value Type | Description
--- | --- | ---
`open` | Boolean | Proxies to the foundation's `isOpen`/(`open`, `close`) methods. 
`items` | Array<Element> | Proxies to the foundation's container to query for all `.mdc-list-item[role]` elements.
`itemsContainer` | Element | Queries the foundation's root element for the `mdc-simple-menu__items` container element.

Method Signature | Description
--- | ---
`show({focusIndex: ?number}) => void` | Proxies to the foundations `open()` method. Optional options object containing a  `focusIndex` parameter to specify the item to receive focus after the menu opens.
`hide() => void` | Proxies to the foundation's `close()` method.
`setAnchorCorner(Corner) => void` | Proxies to the foundation's `setAnchorCorner(Corner)` method.
`setAnchorMargin(AnchorMargin) => void` | Proxies to the foundation's `setAnchorMargin(AnchorMargin)` method.
`getDefaultFoundation() => MDCSimpleMenuFoundation` | Returns the foundation. 

### `MDCSimpleMenuAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element.
`removeClass(className: string) => void` | Removes a class from the root element.
`hasClass(className: string) => boolean` | Returns boolean indicating whether element has a given class.
`hasNecessaryDom() => boolean` | Returns boolean indicating whether the necessary DOM is present (namely, the `mdc-simple-menu__items` container).
`getAttributeForEventTarget(target: EventTarget, attributeName: string) => string` | Returns the value of a given attribute on an event target.
`eventTargetHasClass: (target: EventTarget, className: string) => boolean` | Returns true if the event target has a given class.
`getInnerDimensions() => {width: number, height: number}` | Returns an object with the items container width and height.
`hasAnchor: () => boolean` | Returns whether the menu has an anchor for positioning.
`getAnchorDimensions() => { width: number, height: number, top: number, right: number, bottom: number, left: number }` | Returns an object with the dimensions and position of the anchor (same semantics as `DOMRect`).
`getWindowDimensions() => {width: number, height: number}` | Returns an object with width and height of the page, in pixels.
`getNumberOfItems() => numbers` | Returns the number of _item_ elements inside the items container. In our vanilla component, we determine this by counting the number of list items whose `role` attribute corresponds to the correct child role of the role present on the menu list element. For example, if the list element has a role of `menu` this queries for all elements that have a role of `menuitem`.
`registerInteractionHandler(type: string, handler: EventListener) => void` | Adds an event listener `handler` for event type `type`.
`deregisterInteractionHandler(type: string, handler: EventListener) => void` | Removes an event listener `handler` for event type `type`.
`registerBodyClickHandler(handler: EventListener) => void` | Adds an event listener `handler` for event type `click`.
`deregisterBodyClickHandler(handler: EventListener) => void` | Removes an event listener `handler` for event type `click`.
`getIndexForEventTarget(target: EventTarget) => number` | Checks to see if the `target` of an event pertains to one of the menu items, and if so returns the index of that item. Returns -1 if the target is not one of the menu items. The same notice for `index` applies here as above.
`notifySelected(evtData: {index: number}) => void` | Dispatches an event notifying listeners that a menu item has been selected. The function should accept an `evtData` parameter containing the an object with an `index` property representing the index of the selected item. Implementations may choose to supplement this data with additional data, such as the item itself.
`notifyCancel() => void` | Dispatches an event notifying listeners that the menu has been closed with no selection made.
`saveFocus() => void` | Stores the currently focused element on the document, for restoring with `restoreFocus`.
`restoreFocus() => void` | Restores the previously saved focus state, by making the previously focused element the active focus again.
`isFocused() => boolean` | Returns a boolean value indicating whether the root element of the simple menu is focused.
`focus() => void` | Focuses the root element of the simple menu.
`getFocusedItemIndex() => number` | Returns the index of the currently focused menu item (-1 if none).
`focusItemAtIndex(index: number) => void` | Focuses the menu item with the provided index.
`isRtl() => boolean` | Returns boolean indicating whether the current environment is RTL.
`setTransformOrigin(value: string) => void` | Sets the transform origin for the menu element.
`setPosition(position: { top: string, right: string, bottom: string, left: string }) => void` | Sets the position of the menu element.
`setMaxHeight(value: string) => void` | Sets `max-height` style for the menu element.

### `MDCSimpleMenuFoundation`

Method Signature | Description
--- | ---
`setAnchorCorner(corder: Corner) => void` | Sets the corner that the menu will be anchored to. See [constants.js](https://github.com/material-components/material-components-web/blob/cc299230728ba5a994866ebd31aaaf1a0f4cc87f/packages/mdc-menu/simple/constants.js#L73)
`setAnchorMargin(margin: AnchorMargin) => void` | Sets the distance from the anchor point that the menu should be shown. 
`open({focusIndex: ?number}) => void` | Opens the menu. Optionally accepts an object with a `focusIndex` parameter to indicate which list item should receive focus when the menu is opened. 
`close(evt: ?Event)` | Closes the menu. Optionally accepts the event to check if the target is disabled before closing the menu.  
`isOpen() => boolean` | Returns a boolean indicating whether the menu is open. 

### Events

Event Name | Data | Description
--- | --- | ---
`MDCSimpleMenu:selected` | {detail: { item: HTMLElement, index: number } } | Used to indicate when an element has been selected. This event also includes the item selected and the list index of that item.
`MDCSimpleMenu:cancel` | none | Event emitted when the menu is closed with no selection made (e.g. if the user hits `Esc` while it's open, or clicks somewhere else on the page). 
