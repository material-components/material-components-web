<!--docs:
title: "Drawers"
layout: detail
section: components
iconId: side_navigation
path: /catalog/drawers/
-->

# Drawers

The MDC Navigation Drawer is used to organize access to destinations and other functionality on an app.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-navigation-drawer">Material Design guidelines: Navigation drawer</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/drawer">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/drawer
```

## Basic Usage

### HTML Structure

```html
<nav class="mdc-drawer">
  <div class="mdc-drawer__content">
    <nav class="mdc-list">
      <a class="mdc-list-item mdc-list-item--activated" href="#" aria-selecetd="true">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>Inbox
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">send</i>Outgoing
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">drafts</i>Drafts
      </a>
    </nav>
  </div>
</header>
```

### Styles

```scss
@import "@material/drawer/mdc-list";
@import "@material/drawer/mdc-drawer";
```

### JavaScript Instantiation

For the standard drawer, the list must be instantiated for appropriate keyboard interaction:

```js
import {MDCList} from "@material/list";
const list = MDCList.attachTo(document.querySelector('.mdc-list'));
const.singleSelection = true;
```

Other variants use the `MDCDrawer` component, which will instantiate `MDCList` automatically:

```js
import {MDCDrawer} from "@material/drawer";
const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
```

## Variants

### Drawer with separate list groups

```html
<nav class="mdc-drawer">
  <div class="mdc-drawer__content">
    <nav class="mdc-list">
      <a class="mdc-list-item mdc-list-item--activated" href="#" aria-selected="true">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>
        <span class="mdc-list-item__label">Inbox</span>
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">star</i>
        <span class="mdc-list-item__label">Star</span>
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">send</i>
        <span class="mdc-list-item__label">Sent Mail</span>
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">drafts</i>
        <span class="mdc-list-item__label">Drafts</span>
      </a>

      <hr class="mdc-list-divider">
      <h6 class="mdc-list-group__subheader">Labels</h6>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">bookmark</i>
        <span class="mdc-list-item__label">Family</span>
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">bookmark</i>
        <span class="mdc-list-item__label">Friends</span>
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">bookmark</i>
        <span class="mdc-list-item__label">Work</span>
      </a>
    </nav>
  </div>
</div>
```

### Drawer with Header

Drawers can contain a header element which will not scroll with the rest of the drawer content. Things like account switchers and titles should live in the header element.

```html
<nav class="mdc-drawer">
  <div class="mdc-drawer__header">
    <h3 class="mdc-drawer__title">Mail</h3>
    <h6 class="mdc-drawer__subtitle">email@material.io</h6>
  </div>
  <div class="mdc-drawer__content">
    <nav class="mdc-list">
      <a class="mdc-list-item mdc-list-item--activated" href="#" aria-selected="true">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>Inbox
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">send</i>Outgoing
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">drafts</i>Drafts
      </a>
    </nav>
  </div>
</header>
```

### Dismissible Drawer

Dismissible drawers are by default hidden off screen, and can slide into view. Dismissible drawers should be used when navigation is not common, and the main app content is prioritized.

```html
<body>
  <header class="mdc-drawer mdc-drawer--dismissible">
    <div class="mdc-drawer__content">
      <nav class="mdc-list">
        <a class="mdc-list-item mdc-list-item--activated" href="#" aria-selected="true">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>Inbox
        </a>
        <a class="mdc-list-item" href="#">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">send</i>Outgoing
        </a>
        <a class="mdc-list-item" href="#">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">drafts</i>Drafts
        </a>
      </nav>
    </div>
  </header>

  <div class="mdc-drawer-app-content">
    App Content
  </div>
</body>
```

## Modal Drawer

Modal drawers are elevated above most of the app’s UI and don’t affect the screen’s layout grid.

```html
<body>
  <header class="mdc-drawer mdc-drawer--modal">
    <div class="mdc-drawer__content">
      <nav class="mdc-list">
        <a class="mdc-list-item mdc-list-item--activated" href="#" aria-selected="true">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>Inbox
        </a>
        <a class="mdc-list-item" href="#">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">send</i>Outgoing
        </a>
        <a class="mdc-list-item" href="#">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">drafts</i>Drafts
        </a>
      </nav>
    </div>
  </header>

  <div class="mdc-drawer-scrim">
    App Content
  </div>
</body>
```

> Use the `mdc-drawer-scrim` class on next sibling element to add backdrop to block app's UI.

#### Usage with Top App Bar

In cases where the drawer occupies the full viewport height, some styles must be applied to get the dismissible drawer and the content below the top app bar to independently scroll and work in all browsers.

In the following example, the `mdc-drawer__content` and `main-content` elements should scroll independently of each other. The `mdc-drawer--dismissible` and `mdc-drawer-app-content` elements should then sit side-by-side. The markup looks something like this:

```html
<body>
  <nav class="mdc-drawer mdc-drawer--dismissible" id="drawer">
    <div class="mdc-drawer__content">
      <div class="mdc-list">
        <a class="mdc-list-item mdc-list-item--activated" href="#" aria-selected="true">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>Inbox
        </a>
        <a class="mdc-list-item" href="#">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">send</i>Outgoing
        </a>
        <a class="mdc-list-item" href="#">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">drafts</i>Drafts
        </a>
      </div>
    </div>
  </nav>

  <div class="mdc-drawer-app-content">
    <header class="mdc-top-app-bar" id="app-bar">
      <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
          <a href="#" class="demo-menu material-icons mdc-top-app-bar__navigation-icon">menu</a>
          <span class="mdc-top-app-bar__title">Dismissible Drawer</span>
        </section>
      </div>
    </header>

    <main class="main-content">
      <div class="mdc-top-app-bar--fixed-adjust"></div>
        App Content
      </div>
    </main>
  </div>
</body>
```

The CSS to match it looks like this:

```scss
// Note: these styles do not account for any paddings/margins that you may need.

body {
  display: flex;
  height: 100vh;
}

.mdc-drawer-app-content {
  flex: auto;
  overflow: auto;
}

.main-content {
  overflow: auto;
  height: 100%;
}

#app-bar {
  position: absolute;
}
```

JavaScript code to wireup TopAppBar with drawer.

```javascript
var drawerEl = document.getElementById('demo-drawer');
drawer = new mdc.drawer.MDCDrawer(drawerEl);
var topAppBarEl = document.getElementById('app-bar');
var topAppBar = new mdc.topAppBar.MDCTopAppBar(topAppBarEl);
// Auto hides top app bar when main content is scrolled.
topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', function() {
  if (drawer.open) {
    drawer.open = false;
  } else {
    drawer.open = true;
  }
});
```

## Style Customization

### CSS Classes

Class | Description
--- | ---
`mdc-drawer` |  Mandatory.
`mdc-drawer__header` | Non-scrollable element that exists at the top of the drawer.
`mdc-drawer__content` | Scrollable content area of the drawer.
`mdc-drawer__title` | Title text element of the drawer.
`mdc-drawer__subtitle` | Subtitle text element of the drawer.
`mdc-drawer--dismissible` | Dismissible drawer variant class.
`mdc-drawer--modal` | Modal drawer variant class.
`mdc-drawer--open` | Dismissible variant only. If present, indicates that the dismissible drawer is in the open position.
`mdc-drawer--opening` | Dismissible variant only. Applied while the drawer is animating from the closed to the open position.
`mdc-drawer--closing` | Dismissible variant only. Applied while the drawer is animating from the open to the closed position.
`mdc-drawer-app-content` | Dismissible variant only. Sibling element that is resized when the drawer opens/closes.
`mdc-drawer-scrim` | Modal variant only. Used for backdrop to overlay on the app content. Applicable only for modal variant.


### Sass Mixins

Mixin | Description
--- | ---
`mdc-drawer-border-color($color, $opacity)` | Sets border color of `mdc-drawer` surface.
`mdc-drawer-divider-color($color, $opacity)` | Sets divider color found between list groups.
`mdc-drawer-fill-color-accessible($color)` | Sets the fill color to `$color`, and list item and icon ink colors to an accessible color relative to `$color`.
`mdc-drawer-surface-fill-color($color, $opacity)` | Sets the background color of `mdc-drawer`.
`mdc-drawer-title-ink-color($color, $opacity)` | Sets the ink color of `mdc-drawer__title`.
`mdc-drawer-subtitle-ink-color` | Sets drawer subtitle and list subheader ink color.
`mdc-drawer-icon-fill-color($color, $opacity)` | Sets drawer list item graphic icon background color.
`mdc-drawer-icon-ink-color($color, $opacity)` | Sets drawer list item graphic icon ink color.
`mdc-drawer-icon-activated-ink-color($color, $opacity)` | Sets activated drawer list item icon ink color.
`mdc-drawer-item-activated-text-color($color, $opacity)` | Sets activated drawer list item ink color.
`mdc-drawer-item-corner-radius($radius)` | Sets the corner border radius of the drawer list item.
`mdc-drawer-item-text-color($color, $opacity)` | Sets drawer list item ink color.
`mdc-drawer-meta-ink-color($color, $opacity)` | Sets drawer list item meta icon ink color.
`mdc-drawer-activated-overlay-color($color)` | Sets the overlay color of the activated drawer list item.
`mdc-drawer-scrim-fill-color($color, $opacity)` | Sets the fill color of `mdc-drawer-scrim`.

## `MDCDrawer` Properties and Methods

Property | Value Type | Description
--- | --- | ---
`open` | Boolean | Proxies to the foundation's `open`/`close` methods. Also returns true if drawer is in the open position.

### Events

Event Name | Event Data Structure | Description
--- | --- | ---
`MDCDrawer:open` | None | Emits when the navigation drawer has opened.
`MDCDrawer:close` | None | Emits when the navigation drawer has closed.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Navigation Drawer for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCDrawerAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element.
`hasClass(className: string) => boolean` | Returns true if the root element contains the given `className`.
`removeClass(className: string) => void` | Removes a class from the root element.
`elementHasClass(element: !Element, className: string) => boolean` | Returns true if the an element contains the given class.
`computeBoundingRect() => !ClientRect` | Returns the ClientRect for the root element.
`saveFocus() => void` | Saves the focus of currently active element.
`restoreFocus() => void` | Restores focus to element previously saved with 'saveFocus'.
`focusActiveNavigationItem() => void` | Focuses the active / selected navigation item.
`notifyClose() => void` | Emits the `MDCDrawer:close` event.
`notifyOpen() => void` | Emits the `MDCDrawer:open` event.
`trapFocus() => void` | Traps focus on root element and focuses the active navigation element.
`untrapFocus() => void` | Removes trap focus from root element and resumes focus to nav button.

### Foundations

#### `MDCDismissibleDrawerFoundation`

Method Signature | Description
--- | ---
`open() => void` | Opens the drawer from the closed state.
`close() => void` | Closes the drawer from the open state.
`opened() => void` | Abstract method which gets called when drawer finished opening.
`closed() => void` | Abstract method which gets called when drawer finished closing.
`isOpen() => boolean` | Returns true if the drawer is in the open position.
`isOpening() => boolean` | Returns true if the drawer is animating open.
`isClosing() => boolean` | Returns true if the drawer is animating closed.
`handleKeyDown(evt: Event) => void` | Handles the keydown event.
`handleTransitionEnd(evt: Event) => void` | Handles the transitionend event when the drawer finishes opening/closing.

#### `MDCModalDrawerFoundation` (extends `MDCDismissibleDrawerFoundation`)

Method Signature | Description
--- | ---
`opened() => void` | Executed when drawer finishes open animation.
`closed() => void` | Executed when drawer finishes close animation.
`handleScrimClick() => void` | Handles click event on scrim.
