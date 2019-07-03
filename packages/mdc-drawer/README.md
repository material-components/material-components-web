<!--docs:
title: "Drawers"
layout: detail
section: components
excerpt: "Permanent, dismissible, and modal drawers."
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

### HTML Structure

```html
<aside class="mdc-drawer">
  <div class="mdc-drawer__content">
    <nav class="mdc-list">
      <a class="mdc-list-item mdc-list-item--activated" href="#" aria-current="page">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>
        <span class="mdc-list-item__text">Inbox</span>
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">send</i>
        <span class="mdc-list-item__text">Outgoing</span>
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">drafts</i>
        <span class="mdc-list-item__text">Drafts</span>
      </a>
    </nav>
  </div>
</aside>
```

#### Icons

We recommend using [Material Icons](https://material.io/tools/icons/) from Google Fonts:

```html
<head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
```

However, you can also use SVG, [Font Awesome](https://fontawesome.com/), or any other icon library you wish.

### Styles

```scss
@import "@material/drawer/mdc-drawer";
@import "@material/list/mdc-list";
```

### JavaScript Instantiation

For permanently visible drawer, the list must be instantiated for appropriate keyboard interaction:

```js
import {MDCList} from "@material/list";
const list = MDCList.attachTo(document.querySelector('.mdc-list'));
list.wrapFocus = true;
```

Other variants use the `MDCDrawer` component, which will instantiate `MDCList` automatically:

```js
import {MDCDrawer} from "@material/drawer";
const drawer = MDCDrawer.attachTo(document.querySelector('.mdc-drawer'));
```

## Variants

### Drawer with separate list groups

```html
<aside class="mdc-drawer">
  <div class="mdc-drawer__content">
    <nav class="mdc-list">
      <a class="mdc-list-item mdc-list-item--activated" href="#" aria-current="page">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>
        <span class="mdc-list-item__text">Inbox</span>
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">star</i>
        <span class="mdc-list-item__text">Star</span>
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">send</i>
        <span class="mdc-list-item__text">Sent Mail</span>
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">drafts</i>
        <span class="mdc-list-item__text">Drafts</span>
      </a>

      <hr class="mdc-list-divider">
      <h6 class="mdc-list-group__subheader">Labels</h6>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">bookmark</i>
        <span class="mdc-list-item__text">Family</span>
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">bookmark</i>
        <span class="mdc-list-item__text">Friends</span>
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">bookmark</i>
        <span class="mdc-list-item__text">Work</span>
      </a>
    </nav>
  </div>
</aside>
```

### Drawer with Header

Drawers can contain a header element which will not scroll with the rest of the drawer content. Things like account switchers and titles should live in the header element.

```html
<aside class="mdc-drawer">
  <div class="mdc-drawer__header">
    <h3 class="mdc-drawer__title">Mail</h3>
    <h6 class="mdc-drawer__subtitle">email@material.io</h6>
  </div>
  <div class="mdc-drawer__content">
    <nav class="mdc-list">
      <a class="mdc-list-item mdc-list-item--activated" href="#" aria-current="page">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>
        <span class="mdc-list-item__text">Inbox</span>
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">send</i>
        <span class="mdc-list-item__text">Outgoing</span>
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">drafts</i>
        <span class="mdc-list-item__text">Drafts</span>
      </a>
    </nav>
  </div>
</aside>
```

### Dismissible Drawer

Dismissible drawers are by default hidden off screen, and can slide into view. Dismissible drawers should be used when navigation is not common, and the main app content is prioritized.

```html
<body>
  <aside class="mdc-drawer mdc-drawer--dismissible">
    <div class="mdc-drawer__content">
      <nav class="mdc-list">
        <a class="mdc-list-item mdc-list-item--activated" href="#" aria-current="page">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>
          <span class="mdc-list-item__text">Inbox</span>
        </a>
        <a class="mdc-list-item" href="#">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">send</i>
          <span class="mdc-list-item__text">Outgoing</span>
        </a>
        <a class="mdc-list-item" href="#">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">drafts</i>
          <span class="mdc-list-item__text">Drafts</span>
        </a>
      </nav>
    </div>
  </aside>

  <div class="mdc-drawer-app-content">
    App Content
  </div>
</body>
```

> Apply the `mdc-drawer-app-content` class to the sibling element after the drawer for the open/close animations to work.

#### Usage with Top App Bar

##### Dismissible Drawer Full Height Drawer

In cases where the drawer occupies the full viewport height, some styles must be applied to get the dismissible drawer and the content below the top app bar to independently scroll and work in all browsers.

In the following example, the `mdc-drawer__content` and `main-content` elements should scroll independently of each other. The `mdc-drawer--dismissible` and `mdc-drawer-app-content` elements should then sit side-by-side. The markup looks something like this:

```html
<body>
  <aside class="mdc-drawer mdc-drawer--dismissible">
    <div class="mdc-drawer__content">
      <div class="mdc-list">
        <a class="mdc-list-item mdc-list-item--activated" href="#" aria-current="page">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>
          <span class="mdc-list-item__text">Inbox</span>
        </a>
        <a class="mdc-list-item" href="#">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">send</i>
          <span class="mdc-list-item__text">Outgoing</span>
        </a>
        <a class="mdc-list-item" href="#">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">drafts</i>
          <span class="mdc-list-item__text">Drafts</span>
        </a>
      </div>
    </div>
  </aside>

  <div class="mdc-drawer-app-content">
    <header class="mdc-top-app-bar app-bar" id="app-bar">
      <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
          <a href="#" class="demo-menu material-icons mdc-top-app-bar__navigation-icon">menu</a>
          <span class="mdc-top-app-bar__title">Dismissible Drawer</span>
        </section>
      </div>
    </header>

    <main class="main-content" id="main-content">
      <div class="mdc-top-app-bar--fixed-adjust">
        App Content
      </div>
    </main>
  </div>
</body>
```

##### Dismissible Drawer Below Top App Bar

In cases where the drawer appears below the top app bar you will want to follow the markup shown below. The `mdc-drawer__content` and `main-content` elements will also scroll independently of each other. The `mdc-top-app-bar`, `mdc-drawer` and `mdc-drawer-app-content` will be sibling to each other. The `mdc-top-app-bar--fixed-adjust` helper class will be applied to `mdc-drawer` and `mdc-drawer-app-content` elements to adjust the position with top app bar.

```html
<body>
  <header class="mdc-top-app-bar app-bar" id="app-bar">
    <div class="mdc-top-app-bar__row">
      <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
        <a href="#" class="demo-menu material-icons mdc-top-app-bar__navigation-icon">menu</a>
        <span class="mdc-top-app-bar__title">Dismissible Drawer</span>
      </section>
    </div>
  </header>
  <aside class="mdc-drawer mdc-drawer--dismissible mdc-top-app-bar--fixed-adjust">
    <div class="mdc-drawer__content">
      <div class="mdc-list">
        <a class="mdc-list-item mdc-list-item--activated" href="#" aria-current="page">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>
          <span class="mdc-list-item__text">Inbox</span>
        </a>
        <a class="mdc-list-item" href="#">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">send</i>
          <span class="mdc-list-item__text">Outgoing</span>
        </a>
        <a class="mdc-list-item" href="#">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">drafts</i>
          <span class="mdc-list-item__text">Drafts</span>
        </a>
      </div>
    </div>
  </aside>

  <div class="mdc-drawer-app-content mdc-top-app-bar--fixed-adjust">
    <main class="main-content" id="main-content">
      App Content
    </main>
  </div>
</body>
```

The CSS to match either case looks like this:

```scss
// Note: these styles do not account for any paddings/margins that you may need.

body {
  display: flex;
  height: 100vh;
}

.mdc-drawer-app-content {
  flex: auto;
  overflow: auto;
  position: relative;
}

.main-content {
  overflow: auto;
  height: 100%;
}

.app-bar {
  position: absolute;
}

// only apply this style if below top app bar
.mdc-top-app-bar {
  z-index: 7;
}
```

The JavaScript to toggle the drawer when the navigation button is clicked looks like this:

```js
import {MDCTopAppBar} from "@material/top-app-bar";
const topAppBar = MDCTopAppBar.attachTo(document.getElementById('app-bar'));
topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
  drawer.open = !drawer.open;
});
```

### Modal Drawer

Modal drawers are elevated above most of the app's UI and don't affect the screen's layout grid.

```html
<body>
  <aside class="mdc-drawer mdc-drawer--modal">
    <div class="mdc-drawer__content">
      <nav class="mdc-list">
        <a class="mdc-list-item mdc-list-item--activated" href="#" aria-current="page">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>
          <span class="mdc-list-item__text">Inbox</span>
        </a>
        <a class="mdc-list-item" href="#">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">send</i>
          <span class="mdc-list-item__text">Outgoing</span>
        </a>
        <a class="mdc-list-item" href="#">
          <i class="material-icons mdc-list-item__graphic" aria-hidden="true">drafts</i>
          <span class="mdc-list-item__text">Drafts</span>
        </a>
      </nav>
    </div>
  </aside>

  <div class="mdc-drawer-scrim"></div>
  <div>Main Content</div>
</body>
```

> The `mdc-drawer-scrim` next sibling element is **required**, to protect the app's UI from interactions while the modal drawer is open.

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
`mdc-drawer--open` | If present, indicates that the dismissible drawer is in the open position.
`mdc-drawer--opening` | Applied while the drawer is animating from the closed to the open position.
`mdc-drawer--closing` | Applied while the drawer is animating from the open to the closed position.
`mdc-drawer-app-content` | Mandatory for dismissible variant only. Sibling element that is resized when the drawer opens/closes.
`mdc-drawer-scrim` | Mandatory for modal variant only. Used for the overlay on the app content.


### Sass Mixins

Mixin | Description
--- | ---
`mdc-drawer-border-color($color)` | Sets border color of `mdc-drawer` surface.
`mdc-drawer-divider-color($color)` | Sets divider color found between list groups.
`mdc-drawer-fill-color-accessible($color)` | Sets the fill color to `$color`, and list item and icon ink colors to an accessible color relative to `$color`.
`mdc-drawer-surface-fill-color($color)` | Sets the background color of `mdc-drawer`.
`mdc-drawer-title-ink-color($color)` | Sets the ink color of `mdc-drawer__title`.
`mdc-drawer-subtitle-ink-color` | Sets drawer subtitle and list subheader ink color.
`mdc-drawer-item-icon-ink-color($color)` | Sets drawer list item graphic icon ink color.
`mdc-drawer-item-text-ink-color($color)` | Sets drawer list item text ink color.
`mdc-drawer-item-activated-icon-ink-color($color)` | Sets activated drawer list item icon ink color.
`mdc-drawer-item-activated-text-ink-color($color)` | Sets activated drawer list item text ink color.
`mdc-drawer-shape-radius($radius)` | Sets the rounded shape to drawer with given radius size. `$radius` can be single radius or list of 2 radius values for trailing-top and trailing-bottom. Automatically flips the radius values in RTL context.
`mdc-drawer-item-shape-radius($radius, $rtl-reflexive)` | Sets the rounded shape to drawer navigation item with given radius size. Set `$rtl-reflexive` to true to flip radius values in RTL context, defaults to true.
`mdc-drawer-activated-overlay-color($color)` | Sets the overlay color of the activated drawer list item.
`mdc-drawer-scrim-fill-color($color)` | Sets the fill color of `mdc-drawer-scrim`.
`mdc-drawer-z-index($value)` | Sets the z index of drawer. Drawer stays on top of top app bar except for clipped variant of drawer.
`mdc-drawer-width($width)` | Sets the width of the drawer. In the case of the dismissible variant, also sets margin required for `mdc-drawer-app-content`.

## Accessibility

### Focus Management

It is recommended to shift focus to the first focusable element in the main content when drawer is closed or one of the destination items is activated. (By default, MDC Drawer restores focus to the menu button which opened it.)

#### Dismissible Drawer

Restore focus to the first focusable element when a list item is activated or after the drawer closes. Do not close the drawer upon item activation, since it should be up to the user when to show/hide the dismissible drawer.

```js
const listEl = document.querySelector('.mdc-drawer .mdc-list');
const mainContentEl = document.querySelector('.main-content');

listEl.addEventListener('click', (event) => {
  mainContentEl.querySelector('input, button').focus();
});

document.body.addEventListener('MDCDrawer:closed', () => {
  mainContentEl.querySelector('input, button').focus();
});
```

#### Modal Drawer

Close the drawer when an item is activated in order to dismiss the modal as soon as the user performs an action. Only restore focus to the first focusable element in the main content after the drawer is closed, since it's being closed automatically.

```js
const listEl = document.querySelector('.mdc-drawer .mdc-list');
const mainContentEl = document.querySelector('.main-content');

listEl.addEventListener('click', (event) => {
  drawer.open = false;
});

document.body.addEventListener('MDCDrawer:closed', () => {
  mainContentEl.querySelector('input, button').focus();
});
```

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Navigation Drawer for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).
