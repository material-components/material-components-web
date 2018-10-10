<!--docs:
title: "Tab"
layout: detail
section: components
excerpt: "Governs the visibility of one of several groups of content."
iconId: tabs
path: /catalog/tabs/tab/
-->

# Tab

Tabs organize and allow navigation between groups of content that are related and at the same level of hierarchy.
Each Tab governs the visibility of one group of content.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-tabs">Material Design guidelines: Tabs</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/tabs">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/tab
```

## Basic Usage

### HTML Structure

```html
<button class="mdc-tab" role="tab" aria-selected="false" tabindex="-1">
  <span class="mdc-tab__content">
    <span class="mdc-tab__icon material-icons" aria-hidden="true">favorite</span>
    <span class="mdc-tab__text-label">Favorites</span>
  </span>
  <span class="mdc-tab-indicator">
    <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
  </span>
  <span class="mdc-tab__ripple"></span>
</button>
```

### Styles

```scss
@import "@material/tab/mdc-tab";
```

### JavaScript Instantiation

```js
import {MDCTab} from '@material/tab';

const tab = new MDCTab(document.querySelector('.mdc-tab'));
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

## Variants

### Active Tab

> *NOTE*: Don't forget to add the `mdc-tab-indicator--active` class to the `mdc-tab-indicator` subcomponent.

```html
<button class="mdc-tab mdc-tab--active" role="tab" aria-selected="true">
  <span class="mdc-tab__content">
    <span class="mdc-tab__icon material-icons" aria-hidden="true">favorite</span>
    <span class="mdc-tab__text-label">Favorites</span>
  </span>
  <span class="mdc-tab-indicator mdc-tab-indicator--active">
    <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
  </span>
  <span class="mdc-tab__ripple"></span>
</button>
```

### Tab with Indicator Spanning Only Content

In the example under Basic Usage, the Tab Indicator will span the entire tab. Alternatively, the tab indicator can be
set up to span only the content of the tab if it is instead placed _within_ the `mdc-tab__content` element:

```html
<button class="mdc-tab" role="tab" aria-selected="false" tabindex="-1">
  <span class="mdc-tab__content">
    <span class="mdc-tab__icon material-icons" aria-hidden="true">favorite</span>
    <span class="mdc-tab__text-label">Favorites</span>
    <span class="mdc-tab-indicator">
      <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
    </span>
  </span>
  <span class="mdc-tab__ripple"></span>
</button>
```

### Tab Icons

We recommend using [Material Icons](https://material.io/tools/icons/) from Google Fonts:

```html
<head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
```

However, you can also use SVG, [Font Awesome](https://fontawesome.com/), or any other icon library you wish.

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-tab` | Mandatory.
`mdc-tab__content` | Mandatory. Indicates the text label of the tab.
`mdc-tab__ripple` | Mandatory. Denotes the ripple surface for the tab.
`mdc-tab--active` | Optional. Indicates that the tab is active.
`mdc-tab--stacked` | Optional. Indicates that the tab icon and label should flow vertically instead of horizontally.
`mdc-tab--min-width` | Optional. Indicates that the tab should shrink in size to be as narrow as possible without causing text to wrap.
`mdc-tab__text-label` | Optional. Indicates an icon in the tab.
`mdc-tab__icon` | Optional. Indicates a leading icon in the tab.

### Sass Mixins

To customize the colors of any part of the tab, use the following mixins.

Mixin | Description
--- | ---
`mdc-tab-text-label-color($color)` | Customizes the color of the tab text label.
`mdc-tab-icon-color($color)` | Customizes the color of the tab icon.
`mdc-tab-parent-positioning` | Sets the positioning of the MDCTab's parent element so that `MDCTab.computeDimensions()` reports the same values in all browsers.
`mdc-tab-fixed-width($width)` | Sets the fixed width of the tab. The tab will never be smaller than the given width.

## `MDCTab` Properties and Methods

Property | Value Type | Description
--- | --- | ---
`active` | `boolean` | Allows getting the active state of the tab.

Method Signature | Description
--- | ---
`activate(previousIndicatorClientRect: ClientRect=) => void` | Activates the indicator.  `previousIndicatorClientRect` is an optional argument.
`deactivate() => void` | Deactivates the indicator.
`focus() => void` | Focuses the tab.
`computeIndicatorClientRect() => ClientRect` | Returns the bounding client rect of the indicator.
`computeDimensions() => MDCTabDimensions` | Returns the dimensions of the Tab.

Event Name | Event Data Structure | Description
--- | --- | ---
`MDCTab:interacted` | `{"detail": {"tab": MDCTab}}` | Emitted when the Tab is interacted with, regardless of its active state. Used by parent components to know which Tab to activate.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Tab for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCTabAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element.
`removeClass(className: string) => void` | Removes a class from the root element.
`hasClass(className: string) => boolean` | Returns true if the root element contains the given class.
`setAttr(attr: string, value: string) => void` | Sets the given attribute on the root element to the given value.
`activateIndicator(previousIndicatorClientRect: ClientRect=) => void` | Activates the tab indicator subcomponent. `previousIndicatorClientRect` is an optional argument.
`deactivateIndicator() => void` | Deactivates the tab indicator subcomponent.
`getOffsetLeft() => number` | Returns the `offsetLeft` value of the root element.
`getOffsetWidth() => number` | Returns the `offsetWidth` value of the root element.
`getContentOffsetLeft() => number` | Returns the `offsetLeft` value of the content element.
`getContentOffsetWidth() => number` | Returns the `offsetWidth` value of the content element.
`notifyInteracted() => void` | Emits the `MDCTab:interacted` event.
`focus() => void` | Applies focus to the root element.

### `MDCTabFoundation`

Method Signature | Description
--- | ---
`handleClick() => void` | Handles the logic for the `"click"` event.
`isActive() => boolean` | Returns whether the tab is active.
`activate(previousIndicatorClientRect: ClientRect=) => void` | Activates the tab. `previousIndicatorClientRect` is an optional argument.
`deactivate() => void` | Deactivates the tab.
`computeDimensions() => MDCTabDimensions` | Returns the dimensions of the tab.

### `MDCTabFoundation` Event Handlers

When wrapping the Tab component, it is necessary to register the following event handler. For an example of this, see the [MDCTab](index.js) component's `initialSyncWithDOM` method.

Event | Element | Foundation Handler
--- | --- | ---
`click` | Root element | `handleClick()`
