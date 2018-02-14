<!--docs:
title: "Toolbars"
layout: detail
section: components
excerpt: "A container for multiple rows of items such as application title, navigation menu, or tabs."
iconId: toolbar
path: /catalog/topappbar/
-->

# Top App Bar

MDC Top App Bar acts as a container for items such as
application title, navigation menu, and action items, among other things. Top app bars
scroll with content by default.

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
npm install --save @material/top-app-bar
```

## Usage

### HTML Structure

```html
<header class="mdc-top-app-bar">
  <div class="mdc-top-app-bar__row">
    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
      <a href="#" class="material-icons mdc-top-app-bar__menu-icon">menu</a>
      <span class="mdc-top-app-bar__title">Title</span>
    </section>
  </div>
</header>
```

Top app bars can accommodate multiple icons on the right:

```html
<header class="mdc-top-app-bar">
  <div class="mdc-top-app-bar__row">
    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
      <a href="#" class="material-icons mdc-top-app-bar__menu-icon">menu</a>
      <span class="mdc-top-app-bar__title">Title</span>
    </section>
    <section id="iconSection" class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="top-app-bar">
      <a href="#" class="material-icons mdc-top-app-bar__icon" aria-label="Download" alt="Download">file_download</a>
      <a href="#" class="material-icons mdc-top-app-bar__icon" aria-label="Print this page" alt="Print this page">print</a>
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
  
  // Listen for menu icon events 
  topAppBarElement.addEventListener('MDCTopAppBar:nav', function () {
    // do something
  });
```

### CSS Classes

The provided modifiers are:

Class | Description                            
--- | ---
`mdc-top-app-bar` | Mandatory

### Sass Mixins

Mixin | Description
--- | ---
`mdc-top-app-bar-ink-color($color)` | Sets the ink color of the top app bar
`mdc-top-app-bar-fill-color($color)` | Sets the fill color of the top app bar
`mdc-top-app-bar-fill-color-accessible($color)` | Sets the fill color of the top app bar and automatically sets a high-contrast ink color
`mdc-top-app-bar-icon-ink-color($color)` | Sets the ink color of the top app bar icons

### `MDCTopAppBar`

See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

#### `MDCTopAppBarAdapter`

Method Signature | Description
--- | ---
`hasClass(className: string) => boolean` | Checks if the root element of the component has the given className.
`addClass(className: string) => void` | Adds a class to the root element of the component.
`removeClass(className: string) => void` | Removes a class from the root element of the component.

### Events

Event Name | Event Data Structure | Description
--- | --- | ---
`MDCTopAppBar:nav` | None | Emits when the menu icon is clicked. 