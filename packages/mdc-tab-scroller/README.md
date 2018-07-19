<!--docs:
title: "Tab Scroller"
layout: detail
section: components
excerpt: "Allows for smooth native and animated scrolling of tabs."
iconId: tabs
path: /catalog/tabs/scroller/
-->

# Tab Scroller

A Tab Scroller allows for smooth native and animated scrolling of tabs.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-tabs#scrollable-tabs">Material Design guidelines: Scrollable Tabs</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/tabs">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/tab-scroller
```

## Basic Usage

### HTML Structure

```html
<div class="mdc-tab-scroller">
  <div class="mdc-tab-scroller__scroll-area">
    <div class="mdc-tab-scroller__scroll-content"></div>
  </div>
</div>
```

### Styles

```scss
@import "@material/tab/mdc-tab-scroller";
```

### JavaScript Instantiation

```js
import {MDCTabScroller} from '@material/tab-scroller';

const tabScroller = new MDCTabScroller(document.querySelector('.mdc-tab-scroller'));
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-tab-scroller` | Mandatory. Contains the tab scroller content.
`mdc-tab-scroller__scroll-area` | Mandatory. Denotes the scrolling area.
`mdc-tab-scroller__scroll-content` | Mandatory. Denotes the scrolling content.

## `MDCTabScroller` Methods

Method Signature | Description
--- | ---
`scrollTo(scrollX: number) => void` | Scrolls to the scrollX value.
`incrementScroll(scrollX: number) => void` | Increments the current scroll value by the scrollX value.
`getScrollPosition() => number` | Returns the current visual scroll position.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Tab Scroller for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCTabScrollerAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element.
`removeClass(className: string) => void` | Removes a class from the root element.
`setScrollContentStyleProperty(property: string, value: string) => void` | Sets the style property of the scroll content element.
`getScrollContentStyleValue(property: string) => string` | Returns the style property value of the scroll content element.
`setScrollAreaScrollLeft(scrollLeft: number) => void` | Sets the scroll area element's `scrollLeft`.
`getScrollAreaScrollLeft() => number` | Returns the scroll area element's `scrollLeft`.
`getScrollContentOffsetWidth() => number` | Returns the scroll content element's `offsetWidth`.
`getScrollAreaOffsetWidth() => number` | Returns the scroll area element's `offsetWidth`.

### `MDCTabScrollerFoundation`

Method Signature | Description
--- | ---
`scrollTo(scrollX: number) => void` | Scrolls to the `scrollX` value.
`incrementScroll(scrollX: number) => void` | Increments the current scroll value by the `scrollX` value.
`getScrollPosition() => number` | Returns the current visual scroll position.
