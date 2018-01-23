<!--docs:
title: "Drawers"
layout: detail
section: components
excerpt: "Permanent, persistent, and temporary drawers."
iconId: side_navigation
path: /catalog/drawers/
-->

# Drawers

The MDC Drawer component is a spec-aligned drawer component adhering to the
[Material Design navigation drawer pattern](https://material.io/guidelines/patterns/navigation-drawer.html).
It implements permanent, persistent, and temporary drawers. Permanent drawers are CSS-only and require no JavaScript, whereas persistent and temporary drawers require JavaScript to function, in order to respond to
user interaction.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/patterns/navigation-drawer.html">Material Design guidelines: Navigation drawer</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/drawer/temporary-drawer.html">Demo: Temporary Drawer</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/drawer/persistent-drawer.html">Demo: Persistent Drawer</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/drawer/permanent-drawer-above-toolbar.html">Demo: Permanent Drawer Above Toolbar</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/drawer/permanent-drawer-below-toolbar.html">Demo: Permanent Drawer Below Toolbar</a>
  </li>
</ul>

## Installation

```
npm install --save @material/drawer
```

## Permanent drawer usage

A permanent drawer is always open, sitting to the side of the content. It is appropriate for any display size larger
than mobile.

> TODO(sgomes): Give advice on how to hide permanent drawer in mobile.

```html
<nav class="mdc-drawer mdc-drawer--permanent mdc-typography">
  <div class="mdc-drawer__toolbar-spacer"></div>
  <div class="mdc-drawer__content">
    <nav id="icon-with-text-demo" class="mdc-list">
      <a class="mdc-list-item mdc-list-item--activated" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>Inbox
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">star</i>Star
      </a>
    </nav>
  </div>
</nav>
<div>
  Toolbar and page content go inside here.
</div>
```

In the example above, we've set the drawer above the toolbar, and are using a toolbar spacer to ensure that it is
presented correctly, with the correct amount of space to match the toolbar height. Note that you can place content
inside the toolbar spacer.

Permanent drawers can also be set below the toolbar:

```html
<div>Toolbar goes here</div>

<div class="content">
  <nav class="mdc-drawer mdc-drawer--permanent mdc-typography">
    <nav id="icon-with-text-demo" class="mdc-list">
      <a class="mdc-list-item mdc-list-item--activated" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>Inbox
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">star</i>Star
      </a>
    </nav>
  </nav>
  <main>
    Page content goes here.
  </main>
</div>
```

CSS classes:

| Class                                  | Description                                                                |
| -------------------------------------- | -------------------------------------------------------------------------- |
| `mdc-drawer`                           | Mandatory. Needs to be set on the root element of the component.           |
| `mdc-drawer--permanent`                | Mandatory. Needs to be set on the root element of the component.           |
| `mdc-drawer__toolbar-spacer`           | Optional. Add to node to provide the matching amount of space for toolbar. |

## Persistent drawer usage

Persistent drawers can be toggled open or closed. The drawer sits on the same surface elevation as the content. It is closed by default. When the drawer is outside of the page grid and opens, the drawer forces other content to change size and adapt to the smaller viewport. Persistent drawers stay open until closed by the user.

Persistent drawers are acceptable for all sizes larger than mobile.

```html
<aside class="mdc-drawer mdc-drawer--persistent mdc-typography">
  <nav class="mdc-drawer__drawer">
    <header class="mdc-drawer__header">
      <div class="mdc-drawer__header-content">
        Header here
      </div>
    </header>
    <nav id="icon-with-text-demo" class="mdc-drawer__content mdc-list">
      <a class="mdc-list-item mdc-list-item--activated" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>Inbox
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">star</i>Star
      </a>
    </nav>
  </nav>
</aside>
```

```js
let drawer = new mdc.drawer.MDCPersistentDrawer(document.querySelector('.mdc-drawer--persistent'));
document.querySelector('.menu').addEventListener('click', () => drawer.open = true);
```

CSS classes:

| Class                                   | Description                                                                |
| --------------------------------------- | -------------------------------------------------------------------------- |
| `mdc-drawer`                            | Mandatory. Needs to be set on the root element of the component.           |
| `mdc-drawer--persistent`                | Mandatory. Needs to be set on the root element of the component.           |
| `mdc-drawer__drawer`                    | Mandatory. Needs to be set on the container node for the drawer content.   |

### Sass Mixins

To customize the fill color, the ink color, or scrim color (transparent mask found in the temporary drawer), you can use the following mixins.

#### `mdc-drawer-fill-color($color)`

This mixin customizes the fill (background) color of the drawer.

#### `mdc-drawer-ink-color($color)`

This mixin customizes the ink color (font / copy color) of the drawer.

#### `mdc-drawer-fill-color-accessible($color)`

This mixin customizes the fill color of the drawer. It also sets the ink color to an accessible complement of the fill.

#### `mdc-drawer-scrim-color($color, $opacity)`

This mixin customizes the color and opacity of the scrim. (temporary drawer only)

### Using the JS Component

MDC Persistent Drawer ships with a Component / Foundation combo which allows for frameworks to richly integrate the
correct drawer behaviors into idiomatic components.

#### Including in code

##### ES2015

```javascript
import {MDCPersistentDrawer, MDCPersistentDrawerFoundation, util} from '@material/drawer';
```

##### CommonJS

```javascript
const mdcDrawer = require('mdc-drawer');
const MDCPersistentDrawer = mdcDrawer.MDCPersistentDrawer;
const MDCPersistentDrawerFoundation = mdcDrawer.MDCPersistentDrawerFoundation;
const util = mdcDrawer.util;
```

##### AMD

```javascript
require(['path/to/mdc-drawer'], mdcDrawer => {
  const MDCPersistentDrawer = mdcDrawer.MDCPersistentDrawer;
  const MDCPersistentDrawerFoundation = mdcDrawer.MDCPersistentDrawerFoundation;
  const util = mdcDrawer.util;
});
```

##### Global

```javascript
const MDCPersistentDrawer = mdc.drawer.MDCPersistentDrawer;
const MDCPersistentDrawerFoundation = mdc.drawer.MDCPersistentDrawerFoundation;
const util = mdc.drawer.util;
```

#### Automatic Instantiation

If you do not care about retaining the component instance for the persistent drawer, simply call `attachTo()`
and pass it a DOM element.

```javascript
mdc.drawer.MDCPersistentDrawer.attachTo(document.querySelector('.mdc-drawer--persistent'));
```

#### Manual Instantiation

Persistent drawers can easily be initialized using their default constructors as well, similar to `attachTo`.

```javascript
import {MDCPersistentDrawer} from '@material/drawer';

const drawer = new MDCPersistentDrawer(document.querySelector('.mdc-drawer--persistent'));
```

#### Handling events

When the drawer is opened or closed, the component will emit a
`MDCPersistentDrawer:open` or `MDCPersistentDrawer:close` custom event with no data attached.
Events get emitted only when the drawer toggles its opened state, i.e. multiple consecutive
`drawer.open = true` calls will result in only one `MDCPersistentDrawer:open`.

### Using the Foundation Class

MDC Persistent Drawer ships with an `MDCPersistentDrawerFoundation` class that external frameworks and libraries can
use to integrate the component. As with all foundation classes, an adapter object must be provided.
The adapter for persistent drawers must provide the following functions, with correct signatures:

| Method Signature | Description |
| --- | --- |
| `addClass(className: string) => void` | Adds a class to the root element. |
| `removeClass(className: string) => void` | Removes a class from the root element. |
| `hasClass(className: string) => boolean` | Returns boolean indicating whether element has a given class. |
| `hasNecessaryDom() => boolean` | Returns boolean indicating whether the necessary DOM is present (namely, the `mdc-drawer__drawer` drawer container). |
| `registerInteractionHandler(evt: string, handler: EventListener) => void` | Adds an event listener to the root element, for the specified event name. |
| `deregisterInteractionHandler(evt: string, handler: EventListener) => void` | Removes an event listener from the root element, for the specified event name. |
| `registerDrawerInteractionHandler(evt: string, handler: EventListener) => void` | Adds an event listener to the drawer container sub-element, for the specified event name. |
| `deregisterDrawerInteractionHandler(evt: string, handler: EventListener) => void` | Removes an event listener from drawer container sub-element, for the specified event name. |
| `registerTransitionEndHandler(handler: EventListener) => void` | Registers an event handler to be called when a `transitionend` event is triggered on the drawer container sub-element element. |
| `deregisterTransitionEndHandler(handler: EventListener) => void` | Deregisters an event handler from a `transitionend` event listener. This will only be called with handlers that have previously been passed to `registerTransitionEndHandler` calls. |
| `registerDocumentKeydownHandler(handler: EventListener) => void` | Registers an event handler on the `document` object for a `keydown` event. |
| `deregisterDocumentKeydownHandler(handler: EventListener) => void` | Deregisters an event handler on the `document` object for a `keydown` event. |
| `getDrawerWidth() => number` | Returns the current drawer width, in pixels. |
| `setTranslateX(value: number) => void` | Sets the current position for the drawer, in pixels from the border. |
| `getFocusableElements() => NodeList` | Returns the node list of focusable elements inside the drawer. |
| `saveElementTabState(el: Element) => void` | Saves the current tab index for the element in a data property. |
| `restoreElementTabState(el: Element) => void` | Restores the saved tab index (if any) for an element. |
| `makeElementUntabbable(el: Element) => void` | Makes an element untabbable. |
| `notifyOpen() => void` | Dispatches an event notifying listeners that the drawer has been opened. |
| `notifyClose() => void` | Dispatches an event notifying listeners that the drawer has been closed. |
| `isRtl() => boolean` | Returns boolean indicating whether the current environment is RTL. |
| `isDrawer(el: Element) => boolean` | Returns boolean indicating whether the provided element is the drawer container sub-element. |

## Temporary drawer usage

A temporary drawer is usually closed, sliding out at a higher elevation than the content when opened. It is appropriate
for any display size.

```html
<aside class="mdc-drawer mdc-drawer--temporary mdc-typography">
  <nav class="mdc-drawer__drawer">
    <header class="mdc-drawer__header">
      <div class="mdc-drawer__header-content">
        Header here
      </div>
    </header>
    <nav id="icon-with-text-demo" class="mdc-drawer__content mdc-list">
      <a class="mdc-list-item mdc-list-item--activated" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>Inbox
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">star</i>Star
      </a>
    </nav>
  </nav>
</aside>
```

```js
let drawer = new mdc.drawer.MDCTemporaryDrawer(document.querySelector('.mdc-drawer--temporary'));
document.querySelector('.menu').addEventListener('click', () => drawer.open = true);
```

### Headers and toolbar spacers

Temporary drawers can use toolbar spacers, headers, or neither.

A toolbar spacer adds to the drawer the same amount of space that the toolbar takes up in your application. This is
very useful for visual alignment and consistency. Note that you can place content inside the toolbar spacer.

```html
<aside class="mdc-drawer mdc-drawer--temporary mdc-typography">
  <nav class="mdc-drawer__drawer">

    <div class="mdc-drawer__toolbar-spacer"></div>

    <nav id="icon-with-text-demo" class="mdc-drawer__content mdc-list">
      <a class="mdc-list-item mdc-list-item--activated" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>Inbox
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">star</i>Star
      </a>
    </nav>
  </nav>
</aside>
```

A header, on the other hand, is a large rectangular area that maintains a 16:9 ratio. It's often used for user account
selection.
It uses an outer `mdc-drawer__header` for positioning, with an inner `mdc-drawer__header-content`
for placing the actual content, which will be bottom-aligned.

```html
<aside class="mdc-drawer mdc-drawer--temporary mdc-typography">
  <nav class="mdc-drawer__drawer">

    <header class="mdc-drawer__header">
      <div class="mdc-drawer__header-content">
        Header content goes here
      </div>
    </header>

    <nav id="icon-with-text-demo" class="mdc-drawer__content mdc-list">
      <a class="mdc-list-item mdc-list-item--activated" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>Inbox
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">star</i>Star
      </a>
    </nav>
  </nav>
</aside>
```

CSS classes:

| Class                                  | Description                                                                |
| -------------------------------------- | -------------------------------------------------------------------------- |
| `mdc-drawer`                           | Mandatory. Needs to be set on the root element of the component.           |
| `mdc-drawer--temporary`                | Mandatory. Needs to be set on the root element of the component.           |
| `mdc-drawer__drawer`                   | Mandatory. Needs to be set on the container node for the drawer content.   |
| `mdc-drawer__content`                  | Optional. Should be set on the list of items inside the drawer.            |
| `mdc-drawer__toolbar-spacer`           | Optional. Add to node to provide the matching amount of space for toolbar. |
| `mdc-drawer__header`                   | Optional. Add to container node to create a 16:9 drawer header.            |
| `mdc-drawer__header-content`           | Optional. Add to content node inside `mdc-temporary-drawer__header`.       |

### Using the JS Component

MDC Temporary Drawer ships with a Component / Foundation combo which allows for frameworks to richly integrate the
correct drawer behaviors into idiomatic components.

#### Including in code

##### ES2015

```javascript
import {MDCTemporaryDrawer, MDCTemporaryDrawerFoundation, util} from '@material/drawer';
```

##### CommonJS

```javascript
const mdcDrawer = require('mdc-drawer--temporary');
const MDCTemporaryDrawer = mdcDrawer.MDCTemporaryDrawer;
const MDCTemporaryDrawerFoundation = mdcDrawer.MDCTemporaryDrawerFoundation;
const util = mdcDrawer.util;
```

##### AMD

```javascript
require(['path/to/mdc-drawer'], mdcDrawer => {
  const MDCTemporaryDrawer = mdcDrawer.MDCTemporaryDrawer;
  const MDCTemporaryDrawerFoundation = mdcDrawer.MDCTemporaryDrawerFoundation;
  const util = mdcDrawer.util;
});
```

##### Global

```javascript
const MDCTemporaryDrawer = mdc.drawer.MDCTemporaryDrawer;
const MDCTemporaryDrawerFoundation = mdc.drawer.MDCTemporaryDrawerFoundation;
const util = mdc.drawer.util;
```

#### Automatic Instantiation

If you do not care about retaining the component instance for the temporary drawer, simply call `attachTo()`
and pass it a DOM element.

```javascript
mdc.drawer.MDCTemporaryDrawer.attachTo(document.querySelector('.mdc-drawer--temporary'));
```

#### Manual Instantiation

Temporary drawers can easily be initialized using their default constructors as well, similar to `attachTo`.

```javascript
import {MDCTemporaryDrawer} from '@material/drawer';

const drawer = new MDCTemporaryDrawer(document.querySelector('.mdc-drawer--temporary'));
```

#### Handling events

When the drawer is opened or closed, the component will emit a
`MDCTemporaryDrawer:open` or `MDCTemporaryDrawer:close` custom event with no data attached.
Events get emitted only when the drawer toggles its opened state, i.e. multiple consecutive
`drawer.open = true` calls will result in only one `MDCTemporaryDrawer:open`.

### Using the Foundation Class

MDC Temporary Drawer ships with an `MDCTemporaryDrawerFoundation` class that external frameworks and libraries can
use to integrate the component. As with all foundation classes, an adapter object must be provided.
The adapter for temporary drawers must provide the following functions, with correct signatures:

| Method Signature | Description |
| --- | --- |
| `addClass(className: string) => void` | Adds a class to the root element. |
| `removeClass(className: string) => void` | Removes a class from the root element. |
| `hasClass(className: string) => boolean` | Returns boolean indicating whether element has a given class. |
| `eventTargetHasClass(target: EventTarget, className: string) => boolean` | Returns true if target has className, false otherwise. |
| `addBodyClass(className: string) => void` | Adds a class to the body. |
| `removeBodyClass(className: string) => void` | Removes a class from the body. |
| `hasNecessaryDom() => boolean` | Returns boolean indicating whether the necessary DOM is present (namely, the `mdc-drawer__drawer` drawer container). |
| `registerInteractionHandler(evt: string, handler: EventListener) => void` | Adds an event listener to the root element, for the specified event name. |
| `deregisterInteractionHandler(evt: string, handler: EventListener) => void` | Removes an event listener from the root element, for the specified event name. |
| `registerDrawerInteractionHandler(evt: string, handler: EventListener) => void` | Adds an event listener to the drawer container sub-element, for the specified event name. |
| `deregisterDrawerInteractionHandler(evt: string, handler: EventListener) => void` | Removes an event listener from drawer container sub-element, for the specified event name. |
| `registerTransitionEndHandler(handler: EventListener) => void` | Registers an event handler to be called when a `transitionend` event is triggered on the drawer container sub-element element. |
| `deregisterTransitionEndHandler(handler: EventListener) => void` | Deregisters an event handler from a `transitionend` event listener. This will only be called with handlers that have previously been passed to `registerTransitionEndHandler` calls. |
| `registerDocumentKeydownHandler(handler: EventListener) => void` | Registers an event handler on the `document` object for a `keydown` event. |
| `deregisterDocumentKeydownHandler(handler: EventListener) => void` | Deregisters an event handler on the `document` object for a `keydown` event. |
| `getDrawerWidth() => number` | Returns the current drawer width, in pixels. |
| `setTranslateX(value: number) => void` | Sets the current position for the drawer, in pixels from the border. |
| `updateCssVariable(value: string) => void` | Sets a CSS custom property, for controlling the current background opacity when manually dragging the drawer. |
| `getFocusableElements() => NodeList` | Returns the node list of focusable elements inside the drawer. |
| `saveElementTabState(el: Element) => void` | Saves the current tab index for the element in a data property. |
| `restoreElementTabState(el: Element) => void` | Restores the saved tab index (if any) for an element. |
| `makeElementUntabbable(el: Element) => void` | Makes an element untabbable. |
| `notifyOpen() => void` | Dispatches an event notifying listeners that the drawer has been opened. |
| `notifyClose() => void` | Dispatches an event notifying listeners that the drawer has been closed. |
| `isRtl() => boolean` | Returns boolean indicating whether the current environment is RTL. |
| `isDrawer(el: Element) => boolean` | Returns boolean indicating whether the provided element is the drawer container sub-element. |

### The util API
External frameworks and libraries can use the following utility methods when integrating a component.

#### util.remapEvent(eventName, globalObj = window) => String

Remap touch events to pointer events, if the browser doesn't support touch events.

#### util.getTransformPropertyName(globalObj = window, forceRefresh = false) => String

Choose the correct transform property to use on the current browser.

#### util.supportsCssCustomProperties(globalObj = window) => Boolean

Determine whether the current browser supports CSS properties.

#### util.applyPassive(globalObj = window, forceRefresh = false) => object

Determine whether the current browser supports passive event listeners, and if so, use them.

#### util.saveElementTabState(el) => void

Save the tab state for an element.

#### util.restoreElementTabState(el) => void

Restore the tab state for an element, if it was saved.
