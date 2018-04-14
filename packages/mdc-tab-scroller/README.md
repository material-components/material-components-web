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

Tab Scroller allows for smoothing animated scrolling of tab content

## Design & API Documentation

<!--
<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/tab.html">Material Design guidelines: Tab</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/tab-scroller.html">Demo</a>
  </li>
</ul>
-->

## Installation
```
npm install --save @material/tab-scroller
```

## Usage

### HTML Structure

```html
<span class="mdc-tab-scroller">
  <span class="mdc-tab-scroller__content"></span>
</span>
```

#### Paging Scroller

In some cases, native scrolling may not be desirable. The paging scroller allows animated scrolling but does not support native scrolling.

```html
<span class="mdc-tab-scroller mdc-tab-scroller--paging">
  <span class="mdc-tab-scroller__content"></span>
</span>
```

### CSS Classes

CSS Class | Description
--- | ---
`mdc-tab-scroller` | Mandatory. Contains the tab scroller content.
`mdc-tab-scroller__content` | Mandatory. Denotes the tab scroller content.
`mdc-tab-scroller--paging` | Optional. Disables native scrolling of the Tab Scroller content

### `MDCTabScroller`

Method Signature | Description
--- | ---
`scrollTo(scrollX: number) => void` | Scrolls to the tab scrollX value

### `MDCTabScrollerAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element
`removeClass(className: string) => void` | Removes a class from the root element
`registerEventHandler(evtType: string, handler: EventListener) => void` | Registers an event listener on the root element
`deregisterEventHandler(evtType: string, handler: EventListener) => void` | Deregisters an event listener on the root element
`setContentStyleProperty(property: string, value: string) => void` | Sets the style property of the content element
`getContentStyleValue(property: string) => string` | Returns the style property value of the content element
`setScrollLeft(scrollLeft: number) => void` | Sets the root element scrollLeft
`getScrollLeft() => number` | Returns the root element scroll left
`computeContentClientRect() => ClientRect` | Returns the content element's bounding client rect
`computeClientRect() => ClientRect` | Returns the root element's bounding client rect

### `MDCTabScrollerFoundation`

Method Signature | Description
--- | ---
`scrollTo(scrollX: number) => void` | Scrolls to the scrollX value
