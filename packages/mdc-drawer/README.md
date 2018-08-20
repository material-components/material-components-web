<!--docs:
title: "Drawers"
layout: detail
section: components
excerpt: "Permanent drawers."
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
      <a class="mdc-list-item mdc-list-item--activated" href='#' aria-selected="true">
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
@import "@material/drawer/mdc-drawer";
```

### JavaScript Instantiation

For standard drawer the list has to be instantiated like this:

```js
import {MDCList} from "@material/list";
const list = MDCList.attachTo(document.querySelector('.mdc-list'));
const.singleSelection = true;
```

For other variants:

```js
import {MDCDrawer} from "@material/drawer";
const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
```

## Variants

### Drawers with separate list groups

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

### Drawers with Header

Drawers can contain a header element which will not scroll with the rest of the drawer content. Things like account switchers and titles should live in the header element.

```html
<nav class="mdc-drawer">
  <div class="mdc-drawer__header">
    <h3 class="mdc-drawer__title">Mail</h3>
    <h6 class="mdc-drawer__subtitle">email@material.io</h6>
  </div>
  <div class="mdc-drawer__content">
    <nav class="mdc-list">
      <a class="mdc-list-item mdc-list-item--activated" href='#' aria-selected="true">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>Inbox
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
        <a class="mdc-list-item mdc-list-item--activated" href='#' aria-selected="true">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>Inbox
        </a>
      </nav>
    </div>
  </header>

  <div class="mdc-drawer-app-content">
    App Content
  </div>
</body>
```

> Use the `mdc-drawer-app-content` class to the element sibling to the drawer to get the open/close animations to work.

### Usage with Top App Bar

There are some styles that need to be applied to get the top app bar and the dismissible drawer to independently scroll and work on all browsers. `.mdc-drawer__content` and `#main-content` elements should independently scroll each other. The `mdc-drawer--dismissible` and `mdc-drawer-app-content` should then sit side-by-side. The markup looks something like this:

```html
<body>
  <nav class="mdc-drawer mdc-drawer--dismissible">
    <div class="mdc-drawer__content">
      <div class="mdc-list">
        <a class="mdc-list-item mdc-list-item--activated" href='#' aria-selected="true">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>Inbox
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

    <main id="main-content">
      <div class="mdc-top-app-bar--fixed-adjust"></div>
        App Content
      </div>
    </main>
  </div>
</body>
```

The CSS to match it looks like:

```css
// these style do not account for any paddings/margins that you may need

body {
  display: flex;
  height: 100vh;
}

.mdc-drawer-app-content {
  flex: auto;
  overflow: auto;
}

#main-content {
  overflow: auto;
  height: 100%;
}

```

## Style Customization

### CSS Classes

Class | Description
--- | ---
`mdc-drawer` |  Mandatory.
`mdc-drawer--closing` | Applies the transition to the dismissible drawer while it is animating from the open to the closed position.
`mdc-drawer--opening` | Applies the transition to the dismissible drawer while it is animating from the closed to the open position.
`mdc-drawer-app-content` | Used for dismissible drawer variant sibling element that should animate open/closed with it.
`mdc-drawer--dismissible` | Dismissible drawer variant class.
`mdc-drawer__header` | Non-scrollable element that exists on the top of the drawer.
`mdc-drawer--open` | If present indicates that dismissible drawer is in the open position.
`mdc-drawer__content` | Scrollable content area of the drawer.
`mdc-drawer__title` | Title text element of the drawer.
`mdc-drawer__subtitle` | Subtitle text element of the drawer.


### Sass Mixins

Mixin | Description
--- | ---
`mdc-drawer-activated-overlay-color($color)` | Sets the overlay color of the activated drawer list item.
`mdc-drawer-border-color($color, $opacity)` | Sets border color of `mdc-drawer` surface.
`mdc-drawer-divider-color($color, $opacity)` | Sets divider color found between list groups.
`mdc-drawer-fill-color-accessible($color)` | Sets the fill color to `$color`, and list item text and icon ink colors to an accessible color relative to `$color`.
`mdc-drawer-subtitle-text-color` | Sets drawer list subheader and drawer subtitle ink color.
`mdc-drawer-icon-fill-color($color, $opacity)` | Sets drawer list item graphic icon background color.
`mdc-drawer-icon-activated-ink-color($color, $opacity)` | Sets activated drawer list item icon ink color.
`mdc-drawer-icon-ink-color($color, $opacity)` | Sets drawer list item graphic icon ink color.
`mdc-drawer-item-activated-text-color($color, $opacity)` | Sets activated drawer list item ink color.
`mdc-drawer-item-corner-radius($radius)` | Sets the corner border radius of the drawer list item.
`mdc-drawer-item-text-color($color, $opacity)` | Sets drawer list item ink color.
`mdc-drawer-meta-ink-color($color, $opacity)` | Sets drawer list item meta icon ink color.
`mdc-drawer-surface-fill-color($color, $opacity)` | Sets the background color of `mdc-drawer`.
`mdc-drawer-title-ink-color($color, $opacity)` | Sets the ink color of `mdc-drawer__title`.

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
`eventTargetHasClass(targetElement: !Element, className: string) => boolean` | Returns true if the target element contains the given class.
`computeBoundingRect() => !ClientRect` | Returns the ClientRect for the root element.
`saveFocus() => void` | Saves the focus of currently active element.
`restoreFocus() => void` | Restores focus to element previously saved with 'saveFocus'.
`focusActiveNavigationItem() => void` | Focuses the active / selected navigation item.
`notifyClose() => void` | Emits the `MDCDrawer:close` event.
`notifyOpen() => void` | Emits the `MDCDrawer:open` event.

### Foundations: `MDCDismissibleDrawerFoundation`

Method Signature | Description
--- | ---
`open() => void` | Opens the drawer from the closed state.
`close() => void` | Closes the drawer from the open state.
`isOpen() => boolean` | Returns true if the drawer is in the open position.
`isOpening() => boolean` | Returns true if the drawer is animating open.
`isClosing() => boolean` | Returns true if the drawer is animating closed.
`handleKeyDown(evt: Event) => void` | Handles the keydown event.
`handleTransitionEnd(evt: Event) => void` | Handles the transitionend event when the drawer finishes opening/closing.
