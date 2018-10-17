<!--docs:
title: "Side Sheets"
layout: detail
section: components
excerpt: "Permanent, dismissible, and modal side sheets."
iconId: side_navigation
path: /catalog/side-sheets/
-->

# Side Sheets

The MDC Side Sheet is a supplementary surface primarily used on tablet and desktop.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-sheets-side">Material Design guidelines: Sheets: Side</a>
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
  ...
</aside>
```

#### Icon

Side sheets are typically dismissible or modal, and are opened via an affordance such as an icon in a Top App Bar.

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
```

### JavaScript Instantiation

```js
import {MDCSideSheet} from "@material/side-sheet";
const sideSheet = MDCSideSheet.attachTo(document.querySelector('.mdc-side-sheet'));
```

## Variants

### Dismissible Side Sheet

Dismissible side sheets are by default hidden off screen, and can slide into view.

```html
<body>
  <aside class="mdc-side-sheet mdc-side-sheet--dismissible">
    ...
  </aside>

  <div class="mdc-side-sheet-app-content">
    App Content
  </div>
</body>
```

> Apply the `mdc-side-sheet-app-content` class to a subsequent sibling element after the side-sheet for the open/close animations to work.\

#### Usage with Top App Bar

In cases where the side sheet occupies the full viewport height, some styles must be applied to get the dismissible side sheet and the content below the top app bar to independently scroll and work in all browsers.

In the following example, the `mdc-side-sheet` and `main-content` elements should scroll independently of each other. The `mdc-side-sheet--dismissible` and `mdc-side-sheet-app-content` elements should then sit side-by-side. The markup looks something like this:

```html
<body>
  <aside class="mdc-side-sheet mdc-side-sheet--dismissible">
    ...
  </aside>

  <div class="mdc-side-sheet-app-content">
    <header class="mdc-top-app-bar app-bar" id="app-bar">
      <div class="mdc-top-app-bar__row">
        <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
          <a href="#" id="filter-button" class="material-icons mdc-top-app-bar__action-item" aria-label="Filters" alt="Filters">filter_list</a>
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

The JavaScript to toggle the side sheet when the filter button is clicked looks like this:

```js
import {MDCTopAppBar} from "@material/top-app-bar";
const topAppBar = MDCTopAppBar.attachTo(document.getElementById('app-bar'));
topAppBar.setScrollTarget(document.getElementById('main-content'));
const filterButton = document.getElementById('filter-button');
filterButton.addEventListener('click', () => {
  sideSheet.open = !sideSheet.open;
});
```

### Modal Side Sheet

Modal side sheets are elevated above the rest of the app's UI and don't affect the screen's layout grid.

```html
<body>
  <aside class="mdc-side-sheet mdc-side-sheet--modal">
    ...
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
`mdc-side-sheet--dismissible` | Dismissible side sheet variant class.
`mdc-side-sheet--modal` | Modal side sheet variant class.
`mdc-side-sheet--open` | If present, indicates that the dismissible side sheet is in the open position.
`mdc-side-sheet--opening` | Applied while the side sheet is animating from the closed to the open position.
`mdc-side-sheet--closing` | Applied while the side sheet is animating from the open to the closed position.
`mdc-side-sheet-app-content` | Dismissible variant only. Sibling element that is resized when the side sheet opens/closes.
`mdc-side-sheet-scrim` | Modal variant only. Used for the overlay on the app content.


### Sass Mixins

Mixin | Description
--- | ---
`mdc-side-sheet-ink-color` | Sets the ink color of text within the side sheet.
`mdc-side-sheet-surface-fill-color($color)` | Sets the background color of `mdc-side-sheet`.
`mdc-side-sheet-surface-fill-color-accessible($color)` | Sets the fill color to `$color`, and text ink color to an accessible color relative to `$color`.
`mdc-side-sheet-scrim-fill-color($color)` | Sets the fill color of `mdc-side-sheet-scrim`.
`mdc-side-sheet-stroke-color($color)` | Sets border color of `mdc-side-sheet` surface.
`mdc-side-sheet-shape-radius($radius)` | Sets the rounded shape to side sheet with given radius size. `$radius` can be single radius or list of 2 radius values for trailing-top and trailing-bottom. Automatically flips the radius values in RTL context.
`mdc-side-sheet-z-index($value)` | Sets the z index of side sheet. Side Sheet stays on top of top app bar except for clipped variant of side sheet.
`mdc-side-sheet-width($width)` | Sets the width of the side sheet. In the case of the dismissible variant, also sets margin required for `mdc-side-sheet-app-content`.

## Accessibility

### Focus Management

It is recommended to shift focus to the first focusable element in the main content when side sheet is closed. (By default, MDC Side Sheet restores focus to the button which opened it.)

```js
const closeButtonEl = document.querySelector('#close-button');
const mainContentEl = document.querySelector('.main-content');

closeButtonEl.addEventListener('click', () => {
  sideSheet.open = false;
});

document.body.addEventListener('MDCSideSheet:closed', () => {
  mainContentEl.querySelector('input, button').focus();
});
```

## `MDCSideSheet` Properties and Methods

Property | Value Type | Description
--- | --- | ---
`open` | Boolean | Proxies to the foundation's `open`/`close` methods. Also returns true if side sheet is in the open position.

### Events

Event Name | Event Data Structure | Description
--- | --- | ---
`MDCSideSheet:opened` | None | Emits when the side sheet has opened.
`MDCSideSheet:closed` | None | Emits when the side sheet has closed.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Side Sheet for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

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
`open() => void` | Opens the side sheet from the closed state.
`close() => void` | Closes the side sheet from the open state.
`isOpen() => boolean` | Returns true if the side sheet is in the open position.
`isOpening() => boolean` | Returns true if the side sheet is animating open.
`isClosing() => boolean` | Returns true if the side sheet is animating closed.
`handleKeyDown(evt: Event) => void` | Handles the keydown event.
`handleTransitionEnd(evt: Event) => void` | Handles the transitionend event when the side sheet finishes opening/closing.
`opened() => void` | Only called internally. Extension point for when side sheet finishes open animation.
`closed() => void` | Only called internally. Extension point for when side sheet finishes close animation.

#### `MDCModalSideSheetFoundation` (extends `MDCDismissibleSideSheetFoundation`)

Method Signature | Description
--- | ---
`handleScrimClick() => void` | Handles click event on scrim.
