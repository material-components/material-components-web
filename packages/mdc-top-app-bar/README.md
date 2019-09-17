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
     href="https://material-components.github.io/material-components-web-catalog/#/component/top-app-bar">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/top-app-bar.png"
         width="494" alt="Top App Bar screenshot">
  </a>
</div>-->

MDC Top App Bar acts as a container for items such as application title, navigation icon, and action items.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-app-bar-top">Material Design guidelines: Top app bar</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/top-app-bar">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/top-app-bar
```

## Basic Usage

### HTML Structure

```html
<header class="mdc-top-app-bar">
  <div class="mdc-top-app-bar__row">
    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
      <button class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button">menu</button>
      <span class="mdc-top-app-bar__title">Title</span>
    </section>
  </div>
</header>
```

> NOTE: Please see note below about `mdc-icon-button` in the [Top App Bar With Action Items](#top-app-bar-with-action-items) section.

#### Menu Icons

We recommend using [Material Icons](https://material.io/tools/icons/) from Google Fonts:

```html
<head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
```

However, you can also use SVG, [Font Awesome](https://fontawesome.com/), or any other icon library you wish.

### Styles

```scss
@import "@material/top-app-bar/mdc-top-app-bar";
@import "@material/icon-button/mdc-icon-button";
```

### JavaScript Instantiation

```js
import {MDCTopAppBar} from '@material/top-app-bar';

// Instantiation
const topAppBarElement = document.querySelector('.mdc-top-app-bar');
const topAppBar = new MDCTopAppBar(topAppBarElement);
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

## Variants

### Top App Bar With Action Items

Top app bars can contain action items which are placed on the side opposite the navigation icon. You must also attach the `mdc-icon-button` class to both the `mdc-top-app-bar__navigation-icon` and the `mdc-top-app-bar__action-item` elements in order to get the correct styles applied. For further documentation on icons, please see the [mdc-icon-button docs](../mdc-icon-button/README.md).

```html
<header class="mdc-top-app-bar">
  <div class="mdc-top-app-bar__row">
    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
      <button class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button">menu</button>
      <span class="mdc-top-app-bar__title">Title</span>
    </section>
    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
      <button class="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-label="Download">file_download</button>
      <button class="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-label="Print this page">print</button>
      <button class="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-label="Bookmark this page">bookmark</button>
    </section>
  </div>
</header>
```

### Short

Short top app bars are top app bars that can collapse to the navigation icon side when scrolled.

```html
<header class="mdc-top-app-bar mdc-top-app-bar--short">
  <div class="mdc-top-app-bar__row">
    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-start">
      <button class="material-icons mdc-top-app-bar__navigation-icon mdc-icon-button">menu</button>
      <span class="mdc-top-app-bar__title">Title</span>
    </section>
    <section class="mdc-top-app-bar__section mdc-top-app-bar__section--align-end" role="toolbar">
      <button class="material-icons mdc-top-app-bar__action-item mdc-icon-button" aria-label="Bookmark this page">bookmark</button>
    </section>
  </div>
</header>
```

> Short top app bars should be used with no more than 1 action item.

### Short - Always Closed

Short top app bars can be configured to always appear collapsed by applying the `mdc-top-app-bar--short-collapsed` before instantiating the component :

```html
<header class="mdc-top-app-bar mdc-top-app-bar--short mdc-top-app-bar--short-collapsed">
  ...
</header>
```

### Fixed

Fixed top app bars stay at the top of the page and elevate above the content when scrolled.

```html
<header class="mdc-top-app-bar mdc-top-app-bar--fixed">
  ...
</header>
```

### Prominent

The prominent top app bar is taller.

```html
<header class="mdc-top-app-bar mdc-top-app-bar--prominent">
  ...
</header>
```

### Dense

The dense top app bar is shorter.

```html
<header class="mdc-top-app-bar mdc-top-app-bar--dense">
  ...
</header>
```

## Style Customization

### CSS Classes

Class | Description
--- | ---
`mdc-top-app-bar` | Mandatory.
`mdc-top-app-bar--fixed` | Class used to style the top app bar as a fixed top app bar.
`mdc-top-app-bar--fixed-adjust` | Class used to style the content below the standard and fixed top app bar to prevent the top app bar from covering it.
`mdc-top-app-bar--prominent` | Class used to style the top app bar as a prominent top app bar.
`mdc-top-app-bar--prominent-fixed-adjust` | Class used to style the content below the prominent top app bar to prevent the top app bar from covering it.
`mdc-top-app-bar--dense` | Class used to style the top app bar as a dense top app bar.
`mdc-top-app-bar--dense-fixed-adjust` | Class used to style the content below the dense top app bar to prevent the top app bar from covering it.
`mdc-top-app-bar--dense-prominent-fixed-adjust` | Class used to style the content below the top app bar when styled as both dense and prominent, to prevent the top app bar from covering it.
`mdc-top-app-bar--short` | Class used to style the top app bar as a short top app bar.
`mdc-top-app-bar--short-collapsed` | Class used to indicate the short top app bar is collapsed.
`mdc-top-app-bar--short-fixed-adjust` | Class used to style the content below the short top app bar to prevent the top app bar from covering it.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-top-app-bar-ink-color($color)` | Sets the ink color of the top app bar.
`mdc-top-app-bar-icon-ink-color($color)` | Sets the ink color of the top app bar icons.
`mdc-top-app-bar-fill-color($color)` | Sets the fill color of the top app bar.
`mdc-top-app-bar-fill-color-accessible($color)` | Sets the fill color of the top app bar and automatically sets a high-contrast ink color.
`mdc-top-app-bar-short-shape-radius($radius, $rtl-reflexive)` | Sets the rounded shape to short top app bar variant (when it is collapsed) with given radius size. Set `$rtl-reflexive` to true to flip radius values in RTL context, defaults to true.

## `MDCTopAppBar` Properties and Methods

Method Signature | Description
--- | ---
`setScrollTarget(target: element) => void` | Sets scroll target to different DOM node (default is window).

### Events

Event Name | Event Data Structure | Description
--- | --- | ---
`MDCTopAppBar:nav` | None | Emits when the navigation icon is clicked.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Top App Bar for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCTopAppBarAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element of the component.
`removeClass(className: string) => void` | Removes a class from the root element of the component.
`hasClass(className: string) => boolean` | Checks if the root element of the component has the given className.
`setStyle(property: string, value: string) => void` | Sets the specified CSS property to the given value on the root element.
`getTopAppBarHeight() => number` | Gets the height in px of the top app bar.
`getViewportScrollY() => number` | Gets the number of pixels that the content of body is scrolled from the top of the page.
`getTotalActionItems() => number` | Gets the number of action items in the top app bar.
`notifyNavigationIconClicked() => void` | Emits a custom event `MDCTopAppBar:nav` when the navigation icon is clicked.

### Foundations

#### `MDCTopAppBarBaseFoundation`, `MDCTopAppBarFoundation`, `MDCFixedTopAppBarFoundation` and `MDCShortTopAppBarFoundation`

All foundations provide the following methods:

Method Signature | Description
--- | ---
`handleTargetScroll() => void` | Handles `scroll` event on specified scrollTarget (defaults to `window`).
`handleWindowResize() => void` | Handles `resize` event on window.
`handleNavigationClick() => void` | Handles `click` event on navigation icon.

#### `MDCShortTopAppBarFoundation`

In addition to the methods above, the short variant provides the following public methods and properties:

Method Signature | Description
--- | ---
`setAlwaysCollapsed(value: boolean) => void` | When `value` is `true`, sets the short top app bar to always be collapsed.
`getAlwaysCollapsed() => boolean` | Gets if the short top app bar is in the "always collapsed" state.

Property | Value Type | Description
--- | --- | ---
`isCollapsed` | `boolean` (read-only) | Indicates whether the short top app bar is in the collapsed state.
