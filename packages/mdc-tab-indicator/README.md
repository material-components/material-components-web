<!--docs:
title: "Tab Indicator"
layout: detail
section: components
excerpt: "A visual guide that shows which Tab is active."
iconId: tabs
path: /catalog/tabs/indicator/
-->

# Tab Indicator

A Tab Indicator is a visual guide that shows which Tab is active.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-tabs#anatomy">Material Design guidelines: Anatomy of Tabs</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/tabs">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/tab-indicator
```

## Basic Usage

### HTML Structure

```html
<span class="mdc-tab-indicator">
  <span class="mdc-tab-indicator__content"></span>
</span>
```

### Styles

```scss
@use "@material/tab-indicator/mdc-tab-indicator";
```

### JavaScript Instantiation

```js
import {MDCTabIndicator} from '@material/tab-indicator';

const tabIndicator = new MDCTabIndicator(document.querySelector('.mdc-tab-indicator'));
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

## Variants

### Active Indicator

Add the `mdc-tab-indicator--active` class to the `mdc-tab-indicator` element to make the Tab Indicator active.

### Indicator Types and Transitions

The Tab Indicator may be represented in one of two ways:

* Underline, indicated by the `mdc-tab-indicator__content--underline` class
* Icon, indicated by the `mdc-tab-indicator__content--icon` class

> *NOTE*: One of these classes _must_ be applied to the Tab Indicator's content element.

The Tab Indicator may transition in one of two ways:

* Slide, the default behavior
* Fade, indicated by the `mdc-tab-indicator--fade` class

#### Sliding Underline Indicator

```html
<span class="mdc-tab-indicator">
  <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
</span>
```

#### Icon Indicators

We recommend using [Material Icons](https://material.io/tools/icons/) from Google Fonts:

```html
<head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
```

However, you can also use SVG, [Font Awesome](https://fontawesome.com/), or any other icon library you wish.

Remember to include `aria-hidden="true"`, since the active indicator is already signified via the
`aria-selected` attribute on the tab.

##### Fading Icon Indicator

```html
<span class="mdc-tab-indicator mdc-tab-indicator--fade">
  <span class="mdc-tab-indicator__content mdc-tab-indicator__content--icon material-icons" aria-hidden="true">star</span>
</span>
```

##### Sliding Icon Indicator

```html
<span class="mdc-tab-indicator">
  <span class="mdc-tab-indicator__content mdc-tab-indicator__content--icon material-icons" aria-hidden="true">star</span>
</span>
```

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-tab-indicator` | Mandatory. Contains the tab indicator content.
`mdc-tab-indicator__content` | Mandatory. Denotes the tab indicator content.
`mdc-tab-indicator--active` | Optional. Visually activates the indicator.
`mdc-tab-indicator--fade` | Optional. Sets up the tab indicator to fade in on activation and fade out on deactivation.
`mdc-tab-indicator__content--underline` | Optional. Denotes an underline tab indicator.
`mdc-tab-indicator__content--icon` | Optional. Denotes an icon tab indicator.

> *NOTE*: Exactly one of the `--underline` or `--icon` content modifier classes should be present.

### Sass Mixins

To customize the tab indicator, use the following mixins.

Mixin | Description
--- | ---
`surface` | Mandatory. Must be applied to the parent element of the `mdc-tab-indicator`.
`underline-color($color)` | Customizes the color of the underline.
`icon-color($color)` | Customizes the color of the icon subelement.
`underline-height($height)` | Customizes the height of the underline.
`icon-height($height)` | Customizes the height of the icon subelement.
`underline-top-corner-radius($radius)` | Customizes the top left and top right border radius of the underline child element.

## `MDCTabIndicator` Methods

Method Signature | Description
--- | ---
`activate(previousIndicatorClientRect?: ClientRect) => void` | Activates the tab indicator.
`deactivate() => void` | Deactivates the tab indicator.
`computeContentClientRect() => ClientRect` | Returns the content element bounding client rect.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Tab Indicator for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCTabIndicatorAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element.
`removeClass(className: string) => void` | Removes a class from the root element.
`setContentStyleProperty(property: string, value: string) => void` | Sets the style property of the content element.
`computeContentClientRect() => ClientRect` | Returns the content element's bounding client rect.

### `MDCTabIndicatorFoundation`

Method Signature | Description
--- | ---
`handleTransitionEnd(event: Event) => void` | Handles the logic for the `"transitionend"` event on the root element.
`activate(previousIndicatorClientRect?: ClientRect) => void` | Activates the tab indicator.
`deactivate() => void` | Deactivates the tab indicator.
`computeContentClientRect() => ClientRect` | Returns the content element's bounding client rect.
