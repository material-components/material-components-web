<!--docs:
title: "Side Sheets"
layout: detail
section: components
excerpt: "Permanent, dismissible, and modal side sheets."
iconId: side_navigation
path: /catalog/side-sheets/
-->

# Side Sheets

The MDC Side Sheet is used to organize access to destinations and other functionality on an app.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-navigation-side-sheet">Material Design guidelines: Navigation side-sheet</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/side-sheet">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/side-sheet
```

### HTML Structure

```html
<aside class="mdc-side-sheet">
  <div class="mdc-side-sheet__content">
    <nav class="mdc-list">
      <a class="mdc-list-item mdc-list-item--activated" href="#" aria-selected="true">
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

#### Menu Icon

We recommend using [Material Icons](https://material.io/tools/icons/) from Google Fonts:

```html
<head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
```

However, you can also use SVG, [Font Awesome](https://fontawesome.com/), or any other icon library you wish.

### Styles

```scss
@import "@material/side-sheet/mdc-side-sheet";
@import "@material/list/mdc-list";
```

### JavaScript Instantiation

For permanently visible side-sheet, the list must be instantiated for appropriate keyboard interaction:

```js
import {MDCList} from "@material/list";
const list = MDCList.attachTo(document.querySelector('.mdc-list'));
list.wrapFocus = true;
```

Other variants use the `MDCSideSheet` component, which will instantiate `MDCList` automatically:

```js
import {MDCSideSheet} from "@material/side-sheet";
const sideSheet = MDCSideSheet.attachTo(document.querySelector('.mdc-side-sheet'));
```

## Variants

### Side Sheet with separate list groups

```html
<aside class="mdc-side-sheet">
  <div class="mdc-side-sheet__content">
    <nav class="mdc-list">
      <a class="mdc-list-item mdc-list-item--activated" href="#" aria-selected="true">
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

### Side Sheet with Header

Side Sheets can contain a header element which will not scroll with the rest of the side-sheet content. Things like account switchers and titles should live in the header element.

```html
<aside class="mdc-side-sheet">
  <div class="mdc-side-sheet__header">
    <h3 class="mdc-side-sheet__title">Mail</h3>
    <h6 class="mdc-side-sheet__subtitle">email@material.io</h6>
  </div>
  <div class="mdc-side-sheet__content">
    <nav class="mdc-list">
      <a class="mdc-list-item mdc-list-item--activated" href="#" aria-selected="true">
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

### Dismissible Side Sheet

Dismissible side sheets are by default hidden off screen, and can slide into view. Dismissible side sheets should be used when navigation is not common, and the main app content is prioritized.

```html
<body>
  <aside class="mdc-side-sheet mdc-side-sheet--dismissible">
    <div class="mdc-side-sheet__content">
      <nav class="mdc-list">
        <a class="mdc-list-item mdc-list-item--activated" href="#" aria-selected="true">
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

  <div class="mdc-side-sheet-app-content">
    App Content
  </div>
</body>
```

> Apply the `mdc-side-sheet-app-content` class to the sibling element after the side-sheet for the open/close animations to work.

#### Usage with Top App Bar

In cases where the side-sheet occupies the full viewport height, some styles must be applied to get the dismissible side-sheet and the content below the top app bar to independently scroll and work in all browsers.

In the following example, the `mdc-side-sheet__content` and `main-content` elements should scroll independently of each other. The `mdc-side-sheet--dismissible` and `mdc-side-sheet-app-content` elements should then sit side-by-side. The markup looks something like this:

```html
<body>
  <aside class="mdc-side-sheet mdc-side-sheet--dismissible">
    <div class="mdc-side-sheet__content">
      <div class="mdc-list">
        <a class="mdc-list-item mdc-list-item--activated" href="#" aria-selected="true">
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

  <div class="mdc-side-sheet-app-content">
    <header class="mdc-top-app-bar app-bar" id="app-bar">
      <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
          <a href="#" class="demo-menu material-icons mdc-top-app-bar__navigation-icon">menu</a>
          <span class="mdc-top-app-bar__title">Dismissible Side Sheet</span>
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

The CSS to match it looks like this:

```scss
// Note: these styles do not account for any paddings/margins that you may need.

body {
  display: flex;
  height: 100vh;
}

.mdc-side-sheet-app-content {
  flex: auto;
  overflow: auto;
}

.main-content {
  overflow: auto;
  height: 100%;
}

.app-bar {
  position: absolute;
}
```

The JavaScript to toggle the side-sheet when the navigation button is clicked looks like this:

```js
import {MDCTopAppBar} from "@material/top-app-bar";
const topAppBar = MDCTopAppBar.attachTo(document.getElementById('app-bar'));
topAppBar.setScrollTarget(document.getElementById('main-content'));
topAppBar.listen('MDCTopAppBar:nav', () => {
  sideSheet.open = !sideSheet.open;
});
```

### Modal Side Sheet

Modal side sheets are elevated above most of the app's UI and don't affect the screen's layout grid.

```html
<body>
  <aside class="mdc-side-sheet mdc-side-sheet--modal">
    <div class="mdc-side-sheet__content">
      <nav class="mdc-list">
        <a class="mdc-list-item mdc-list-item--activated" href="#" aria-selected="true">
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

  <div class="mdc-side-sheet-scrim"></div>
  <div>Main Content</div>
</body>
```

> The `mdc-side-sheet-scrim` next sibling element protects the app's UI from interactions while the side-sheet is open.

## Style Customization

### CSS Classes

Class | Description
--- | ---
`mdc-side-sheet` | Mandatory.
`mdc-side-sheet--dismissible` | Dismissible side-sheet variant class.
`mdc-side-sheet--modal` | Modal side-sheet variant class.
`mdc-side-sheet--open` | If present, indicates that the dismissible side-sheet is in the open position.
`mdc-side-sheet--opening` | Applied while the side-sheet is animating from the closed to the open position.
`mdc-side-sheet--closing` | Applied while the side-sheet is animating from the open to the closed position.
`mdc-side-sheet__content` | Scrollable content area of the side-sheet.
`mdc-side-sheet-app-content` | Dismissible variant only. Sibling element that is resized when the side-sheet opens/closes.
`mdc-side-sheet-scrim` | Modal variant only. Used for the overlay on the app content.


### Sass Mixins

Mixin | Description
--- | ---
`mdc-side-sheet-ink-color` | Sets the ink color of text within the side sheet.
`mdc-side-sheet-surface-fill-color($color)` | Sets the background color of `mdc-side-sheet`.
`mdc-side-sheet-surface-fill-color-accessible($color)` | Sets the fill color to `$color`, and text ink color to an accessible color relative to `$color`.
`mdc-side-sheet-scrim-fill-color($color)` | Sets the fill color of `mdc-side-sheet-scrim`.
`mdc-side-sheet-stroke-color($color)` | Sets border color of `mdc-side-sheet` surface.
`mdc-side-sheet-shape-radius($radius)` | Sets the rounded shape to side-sheet with given radius size. `$radius` can be single radius or list of 2 radius values for trailing-top and trailing-bottom. Automatically flips the radius values in RTL context.
`mdc-side-sheet-z-index($value)` | Sets the z index of side-sheet. Side Sheet stays on top of top app bar except for clipped variant of side-sheet.
`mdc-side-sheet-width($width)` | Sets the width of the side-sheet. In the case of the dismissible variant, also sets margin required for `mdc-side-sheet-app-content`.

## Accessibility

### Focus Management

It is recommended to shift focus to the first focusable element in the main content when side-sheet is closed or one of the destination items is activated. (By default, MDC Side Sheet restores focus to the menu button which opened it.)

#### Dismissible Side Sheet

Restore focus to the first focusable element when a list item is activated or after the side-sheet closes. Do not close the side-sheet upon item activation, since it should be up to the user when to show/hide the dismissible side-sheet.

```js
const listEl = document.querySelector('.mdc-side-sheet .mdc-list');
const mainContentEl = document.querySelector('.main-content');

listEl.addEventListener('click', (event) => {
  mainContentEl.querySelector('input, button').focus();
});

document.body.addEventListener('MDCSideSheet:closed', () => {
  mainContentEl.querySelector('input, button').focus();
});
```

#### Modal Side Sheet

Close the side-sheet when an item is activated in order to dismiss the modal as soon as the user performs an action. Only restore focus to the first focusable element in the main content after the side-sheet is closed, since it's being closed automatically.

```js
const listEl = document.querySelector('.mdc-side-sheet .mdc-list');
const mainContentEl = document.querySelector('.main-content');

listEl.addEventListener('click', (event) => {
  sideSheet.open = false;
});

document.body.addEventListener('MDCSideSheet:closed', () => {
  mainContentEl.querySelector('input, button').focus();
});
```

## `MDCSideSheet` Properties and Methods

Property | Value Type | Description
--- | --- | ---
`open` | Boolean | Proxies to the foundation's `open`/`close` methods. Also returns true if side-sheet is in the open position.

### Events

Event Name | Event Data Structure | Description
--- | --- | ---
`MDCSideSheet:opened` | None | Emits when the navigation side-sheet has opened.
`MDCSideSheet:closed` | None | Emits when the navigation side-sheet has closed.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Navigation Side Sheet for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCSideSheetAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element.
`hasClass(className: string) => boolean` | Returns true if the root element contains the given `className`.
`removeClass(className: string) => void` | Removes a class from the root element.
`elementHasClass(element: !Element, className: string) => boolean` | Returns true if the an element contains the given class.
`saveFocus() => void` | Saves the focus of currently active element.
`restoreFocus() => void` | Restores focus to element previously saved with 'saveFocus'.
`focusActiveNavigationItem() => void` | Focuses the active / selected navigation item.
`notifyClose() => void` | Emits the `MDCSideSheet:closed` event.
`notifyOpen() => void` | Emits the `MDCSideSheet:opened` event.
`trapFocus() => void` | Traps focus on root element and focuses the active navigation element.
`releaseFocus() => void` | Releases focus trap from root element which was set by `trapFocus` and restores focus to where it was prior to calling `trapFocus`.

### Foundations

#### `MDCDismissibleSideSheetFoundation`

Method Signature | Description
--- | ---
`open() => void` | Opens the side-sheet from the closed state.
`close() => void` | Closes the side-sheet from the open state.
`isOpen() => boolean` | Returns true if the side-sheet is in the open position.
`isOpening() => boolean` | Returns true if the side-sheet is animating open.
`isClosing() => boolean` | Returns true if the side-sheet is animating closed.
`handleKeyDown(evt: Event) => void` | Handles the keydown event.
`handleTransitionEnd(evt: Event) => void` | Handles the transitionend event when the side-sheet finishes opening/closing.
`opened() => void` | Only called internally. Extension point for when side-sheet finishes open animation.
`closed() => void` | Only called internally. Extension point for when side-sheet finishes close animation.

#### `MDCModalSideSheetFoundation` (extends `MDCDismissibleSideSheetFoundation`)

Method Signature | Description
--- | ---
`handleScrimClick() => void` | Handles click event on scrim.
