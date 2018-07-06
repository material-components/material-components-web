<!--docs:
title: "Tab Scroller"
layout: detail
section: components
excerpt: "Tab Scroller allows for smoothing animated scrolling of tab content"
iconId: tab
path: /catalog/tab-scroller/
-->

# Tab Scroller

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/tab-scroller.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/tab-scroller.png" width="363" alt="Tab scroller screenshot">
  </a>
</div>-->

Tab Scroller allows for smooth animated scrolling of tab content.

## Installation
```
npm install @material/tab-scroller
```

## Usage

### RTL Support

While the `scrollLeft` value for a scroll area behaves the same in LTR mode, ranging from 0 at the start to N at the end, the value for `scrollLeft` in RTL mode differs by browser. There are three different value ranges:

- "RTL Default", where the start (right-most point) is N and the end (left-most point) is 0
- "RTL Negative", where the start (right-most point) is 0 and the end (left-most point) is -N
- "RTL Reverse", where the start (right-most point) is 0 and the end (left-most point) is N

The Tab Scroller makes all browsers use the RTL `scrollLeft` value in the "RTL Negative" format, where 0 is the start (right-most) value and -N is the end (left-most) value.

### HTML Structure

```html
<div class="mdc-tab-scroller">
  <div class="mdc-tab-scroller__scroll-area">
    <div class="mdc-tab-scroller__scroll-content"></div>
  </div>
</div>
```

### CSS Classes

CSS Class | Description
--- | ---
`mdc-tab-scroller` | Mandatory. Contains the tab scroller content.
`mdc-tab-scroller__scroll-area` | Mandatory. Denotes the scrolling area.
`mdc-tab-scroller__scroll-content` | Mandatory. Denotes the scrolling content.

### `MDCTabScroller`

Method Signature | Description
--- | ---
`scrollTo(scrollX: number) => void` | Scrolls to the scrollX value
`incrementScroll(scrollX: number) => void` | Increments the current scroll value by the scrollX value
`computeCurrentScrollPosition() => number` | Returns the current visual scroll position

### `MDCTabScrollerAdapter`

Method Signature | Description
--- | ---
`addScrollAreaClass(className: string) => void` | Adds a class to the scroll area element
`removeScrollAreaClass(className: string) => void` | Removes a class from the scroll area element
`registerScrollAreaEventHandler(evtType: string, handler: EventListener) => void` | Registers an event listener on the scroll area element
`deregisterScrollAreaEventHandler(evtType: string, handler: EventListener) => void` | Deregisters an event listener on the scroll area element
`setScrollContentStyleProperty(property: string, value: string) => void` | Sets the style property of the scroll content element
`getScrollContentStyleValue(property: string) => string` | Returns the style property value of the scroll content element
`setScrollAreaScrollLeft(scrollLeft: number) => void` | Sets the scroll area element scrollLeft
`getScrollAreaScrollLeft() => number` | Returns the scroll area element scroll left
`getScrollContentOffsetWidth() => number` | Returns the scroll content element's offsetWidth
`getScrollAreaOffsetWidth() => number` | Returns the scroll area element's offsetWidth

### `MDCTabScrollerFoundation`

Method Signature | Description
--- | ---
`scrollTo(scrollX: number) => void` | Scrolls to the scrollX value
`incrementScroll(scrollX: number) => void` | Increments the current scroll value by the scrollX value
`computeCurrentScrollPosition() => number` | Returns the current visual scroll position
