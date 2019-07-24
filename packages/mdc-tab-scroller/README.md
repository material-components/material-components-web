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

<!-- docgen-tsdoc-replacer:start __DO NOT EDIT, This section is automatically generated__ -->
### MDCTabScroller
#### Methods

Signature | Description
--- | ---
`getScrollContentWidth() => number` | Returns the width of the scroll content.
`getScrollPosition() => number` | Returns the current visual scroll position.
`incrementScroll(scrollXIncrement: number) => void` | Increments the scroll value by the given `scrollXIncrement` amount.
`emit(evtType: string, evtData: T, shouldBubble?: boolean) => void` | Fires a cross-browser-compatible custom event from the component root of the given type, with the given data.
`listen(evtType: K, handler: SpecificEventListener<K>, options?: AddEventListenerOptions | boolean) => void` | Wrapper method to add an event listener to the component's root element. This is most useful when listening for custom events.
`scrollTo(scrollX: number) => void` | Scrolls to the given `scrollX` pixel position.
`unlisten(evtType: K, handler: SpecificEventListener<K>, options?: AddEventListenerOptions | boolean) => void` | Wrapper method to remove an event listener to the component's root element. This is most useful when unlistening for custom events.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create this component for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### MDCTabScrollerAdapter
#### Methods

Signature | Description
--- | ---
`getScrollAreaScrollLeft() => number` | Returns the `scrollLeft` value of the scroll area element.
`addClass(className: string) => void` | Adds the given className to the root element.
`computeHorizontalScrollbarHeight() => number` | Returns the height of the browser's horizontal scrollbars (in px).
`computeScrollAreaClientRect() => ClientRect` | Returns the bounding client rect of the scroll area element.
`computeScrollContentClientRect() => ClientRect` | Returns the bounding client rect of the scroll content element.
`eventTargetMatchesSelector(evtTarget: EventTarget, selector: string) => boolean` | Returns `true` if the given event target satisfies the given CSS selector.
`getScrollAreaOffsetWidth() => number` | Returns the `offsetWitdth` of the scroll area element.
`addScrollAreaClass(className: string) => void` | Adds the given className to the scroll area element.
`getScrollContentOffsetWidth() => number` | Returns the `offsetWidth` of the scroll content element.
`getScrollContentStyleValue(propertyName: string) => string` | Returns the scroll content element's computed style value of the given css property `propertyName`. We achieve this via `getComputedStyle(...).getPropertyValue(propertyName)`.
`removeClass(className: string) => void` | Removes the given className from the root element.
`setScrollAreaScrollLeft(scrollLeft: number) => void` | Sets the `scrollLeft` value of the scroll area element to the passed value.
`setScrollAreaStyleProperty(propName: string, value: string) => void` | Sets a style property of the area element to the passed value.
`setScrollContentStyleProperty(propName: string, value: string) => void` | Sets a style property of the content element to the passed value.

### MDCTabScrollerFoundation
#### Methods

Signature | Description
--- | ---
`getRTLScroller() => MDCTabScrollerRTL` | Creates an RTL Scroller instance for the current browser.
`getScrollPosition() => number` | Returns the current visual scroll position.
`handleInteraction() => void` | Responds to mouse, pointer, touch, and keyboard events.
`handleTransitionEnd(evt: Event) => void` | Responds to a `transitionend` event on the `mdc-tab-scroller__scroll-content` element.
`incrementScroll(scrollXIncrement: number) => void` | Increment the scroll value by the `scrollXIncrement` value.
`scrollTo(scrollX: number) => void` | Scrolls to the `scrollX` value.


<!-- docgen-tsdoc-replacer:end -->

#### `util` Functions

MDC Tab Scroller provides a `util` module with functions to help implement adapter methods.

Function Signature | Description
--- | ---
`computeHorizontalScrollbarHeight(document: Document) => number` | Returns the height of the browser's horizontal scrollbars (in px).

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
