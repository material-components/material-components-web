<!--docs:
title: "Top App Bar"
layout: detail
section: components
excerpt: "A container for items such as application title, navigation icon, and action items."
iconId: toolbar
path: /catalog/top-app-bar/
-->

# Top App Bar

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/top-app-bar.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/top-app-bar.png" width="494" alt="Top App Bar screenshot">
  </a>
</div>-->

MDC Top App Bar acts as a container for items such as application title, navigation icon, and action items.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/toolbars.html">Material Design guidelines: Toolbars</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/top-app-bar.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/top-app-bar
```

## Usage

### HTML Structure

```html
<header class="mdc-top-app-bar">
  <div class="mdc-top-app-bar__row">
    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
      <a href="#" class="material-icons mdc-top-app-bar__navigation-icon">menu</a>
      <span class="mdc-top-app-bar__title">Title</span>
    </section>
  </div>
</header>
```

Top app bars can accommodate multiple action items on the opposite side of the navigation icon:

```html
<header class="mdc-top-app-bar">
  <div class="mdc-top-app-bar__row">
    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
      <a href="#" class="material-icons mdc-top-app-bar__navigation-icon">menu</a>
      <span class="mdc-top-app-bar__title">Title</span>
    </section>
    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
      <a href="#" class="material-icons mdc-top-app-bar__action-item" aria-label="Download" alt="Download">file_download</a>
      <a href="#" class="material-icons mdc-top-app-bar__action-item" aria-label="Print this page" alt="Print this page">print</a>
      <a href="#" class="material-icons mdc-top-app-bar__action-item" aria-label="Bookmark this page" alt="Bookmark this page">bookmark</a>
    </section>
  </div>
</header>
```

Top app bars can be fixed at the top of the page:

```html
<header class="mdc-top-app-bar mdc-top-app-bar--fixed">
  <div class="mdc-top-app-bar__row">
    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
      <a href="#" class="material-icons mdc-top-app-bar__navigation-icon">menu</a>
      <span class="mdc-top-app-bar__title">Title</span>
    </section>
  </div>
</header>
```

Short top app bars should only be used with one action item:

```html
<header class="mdc-top-app-bar mdc-top-app-bar--short">
  <div class="mdc-top-app-bar__row">
    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
      <a href="#" class="material-icons mdc-top-app-bar__navigation-icon">menu</a>
      <span class="mdc-top-app-bar__title">Title</span>
    </section>
    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
      <a href="#" class="material-icons mdc-top-app-bar__action-item" aria-label="Bookmark this page" alt="Bookmark this page">bookmark</a>
    </section>
  </div>
</header>
```

Short top app bars can be configured to always appear collapsed by applying the `mdc-top-app-bar--short-collapsed` before instantiating the component :

```html
<header class="mdc-top-app-bar mdc-top-app-bar--short mdc-top-app-bar--short-collapsed">
  <div class="mdc-top-app-bar__row">
    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
      <a href="#" class="material-icons mdc-top-app-bar__navigation-icon">menu</a>
      <span class="mdc-top-app-bar__title">Title</span>
    </section>
    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="top-app-bar">
      <a href="#" class="material-icons mdc-top-app-bar__icon" aria-label="Bookmark this page" alt="Bookmark this page">bookmark</a>
    </section>
  </div>
</header>
```

### JavaScript

```js
  // Instantiation
  var topAppBarElement = document.querySelector('#topAppBar');
  var topAppBar = mdc.topAppBar.MDCTopAppBar.attachTo(topAppBarElement);

  // Listen for navigation icon events
  topAppBarElement.addEventListener('MDCTopAppBar:nav', function () {
    // do something
  });
```

### CSS Classes

Class | Description
--- | ---
`mdc-top-app-bar` | Mandatory.
`mdc-top-app-bar--fixed` | Class used to style the top app bar as a fixed top app bar.
`mdc-top-app-bar--prominent` | Class used to style the top app bar as a prominent top app bar.
`mdc-top-app-bar--short` | Class used to style the top app bar as a short top app bar.
`mdc-top-app-bar--short-collapsed` | Class used to indicate the short top app bar is collapsed.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-top-app-bar-ink-color($color)` | Sets the ink color of the top app bar.
`mdc-top-app-bar-icon-ink-color($color)` | Sets the ink color of the top app bar icons.
`mdc-top-app-bar-fill-color($color)` | Sets the fill color of the top app bar.
`mdc-top-app-bar-fill-color-accessible($color)` | Sets the fill color of the top app bar and automatically sets a high-contrast ink color.
`mdc-top-app-bar-short-border-radius($border-radius)` | Sets the `border-bottom-radius` property on the action item side. Used only for the short top app bar when collapsed.

### `MDCTopAppBar`

See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

#### `MDCTopAppBarAdapter`

Method Signature | Description
--- | ---
`hasClass(className: string) => boolean` | Checks if the root element of the component has the given className.
`addClass(className: string) => void` | Adds a class to the root element of the component.
`removeClass(className: string) => void` | Removes a class from the root element of the component.
`registerNavigationIconInteractionHandler(evtType: string, handler: EventListener) => void` | Registers an event listener on the native navigation icon element for a given event.
`deregisterNavigationIconInteractionHandler(evtType: string, handler: EventListener) => void` | Deregisters an event listener on the native navigation icon element for a given event.
`notifyNavigationIconClicked() => void` | Emits a custom event `MDCTopAppBar:nav` when the navigation icon is clicked.
`registerScrollHandler(handler) => void` | Registers a handler to be called when user scrolls. Our default implementation adds the handler as a listener to the window's `scroll` event.
`deregisterScrollHandler(handler) => void` | Unregisters a handler to be called when user scrolls. Our default implementation removes the handler as a listener to the window's `scroll` event.
`getViewportScrollY() => number` | Gets the number of pixels that the content of body is scrolled from the top of the page.
`getTotalActionItems() => number` | Gets the number of action items in the top app bar.

### Events

Event Name | Event Data Structure | Description
--- | --- | ---
`MDCTopAppBar:nav` | None | Emits when the navigation icon is clicked.
