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
`getScrollPosition() => number` | Returns the current visual scroll position

### `MDCTabScrollerAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element
`removeClass(className: string) => void` | Removes a class from the root element
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
`getScrollPosition() => number` | Returns the current visual scroll position
