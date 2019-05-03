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
@import "@material/tab-scroller/mdc-tab-scroller";
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
`mdc-tab-scroller--align-start` | Optional. Sets the elements inside the scroll content element to be aligned to the start of the scroll content element.
`mdc-tab-scroller--align-end` | Optional. Sets the elements inside the scroll content element to be aligned to the end of the scroll content element.
`mdc-tab-scroller--align-center` | Optional. Sets the elements inside the scroll content element to be aligned to the center of the scroll content element.

> _NOTE_: The `align` modifier classes are only applicable when the contents do not meet or exceed the width of the Tab Scroller and Tab Bar (i.e., most commonly, when `mdc-tab--min-width` is used on each tab).

## `MDCTabScroller` Methods

Method Signature | Description
--- | ---
`scrollTo(scrollX: number) => void` | Scrolls to the scrollX value.
`incrementScroll(scrollX: number) => void` | Increments the current scroll value by the scrollX value.
`getScrollPosition() => number` | Returns the current visual scroll position.
`getScrollContentWidth() => number` | Returns the width of the scroll content element.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Tab Scroller for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCTabScrollerAdapter`

Method Signature | Description
--- | ---
`eventTargetMatchesSelector(eventTarget: EventTarget, selector: string) => boolean` | Returns `true` if the given event target satisfies the given CSS selector.
`addClass(className: string) => void` | Adds a class to the root element.
`addScrollAreaClass(className: string) => void` | Adds a class to the scroll area element.
`removeClass(className: string) => void` | Removes a class from the root element.
`setScrollAreaStyleProperty(property: string, value: string) => void` | Sets the given style property on the scroll area element.
`setScrollContentStyleProperty(property: string, value: string) => void` | Sets the given style property on the scroll content element.
`getScrollContentStyleValue(property: string) => string` | Returns the given style property value on the scroll content element.
`setScrollAreaScrollLeft(scrollLeft: number) => void` | Sets the scroll area element's `scrollLeft`.
`getScrollAreaScrollLeft() => number` | Returns the scroll area element's `scrollLeft`.
`getScrollContentOffsetWidth() => number` | Returns the scroll content element's `offsetWidth`.
`getScrollAreaOffsetWidth() => number` | Returns the scroll area element's `offsetWidth`.
`computeScrollAreaClientRect() => ClientRect` | Returns the bounding client rect of the scroll area element.
`computeScrollContentClientRect() => ClientRect` | Returns the bounding client rect of the scroll content element.
`computeHorizontalScrollbarHeight() => number` | Returns the height of the browser's horizontal scrollbars (in px).

#### `util` Functions

MDC Tab Scroller provides a `util` module with functions to help implement adapter methods.

Function Signature | Description
--- | ---
`computeHorizontalScrollbarHeight(document: Document) => number` | Returns the height of the browser's horizontal scrollbars (in px).

### `MDCTabScrollerFoundation`

Method Signature | Description
--- | ---
`getRTLScroller() => MDCTabScrollerRTL` | Creates an RTL Scroller instance for the current browser.
`getScrollPosition() => number` | Returns the current visual scroll position.
`handleInteraction() => void` | Responds to mouse, pointer, touch, and keyboard events.
`handleTransitionEnd(evt: Event) => void` | Responds to a `transitionend` event on the `mdc-tab-scroller__scroll-content` element.
`incrementScroll(scrollX: number) => void` | Increments the current scroll value by the `scrollX` value.
`scrollTo(scrollX: number) => void` | Scrolls to the `scrollX` value.

### `MDCTabScrollerRTL`

Abstract class with three concrete implementations depending on the browser:

* `MDCTabScrollerRTLDefault`
* `MDCTabScrollerRTLNegative`
* `MDCTabScrollerRTLReverse`

Method Signature | Description
--- | ---
`getAnimatingScrollPosition(scrollX: number, translateX: number) => number` | Returns the current scroll position during animation.
`getScrollPositionRTL(translateX: number) => number` | Returns the number of px the user has scrolled horizontally, relative to the leading edge.
`incrementScrollRTL(scrollX: number) => MDCTabScrollerAnimation` | Returns an object containing the values required to animate from the current scroll position to a new scroll position.
`scrollToRTL(scrollX: number) => MDCTabScrollerAnimation` | Scrolls content horizontally to the given position in an RTL-friendly way.
