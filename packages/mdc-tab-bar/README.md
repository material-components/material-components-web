<!--docs:
title: "Tab Bar"
layout: detail
section: components
excerpt: "Manages a set of Tabs."
iconId: tabs
path: /catalog/tabs/tab-bar/
-->

# Tab Bar

Tabs organize and allow navigation between groups of content that are related and at the same level of hierarchy.
The Tab Bar contains the Tab Scroller and Tab components.

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
npm install @material/tab-bar
```

## Basic Usage

### HTML Structure

```html
<div class="mdc-tab-bar" role="tablist">
  <div class="mdc-tab-scroller">
    <div class="mdc-tab-scroller__scroll-area">
      <div class="mdc-tab-scroller__scroll-content">
        <button class="mdc-tab mdc-tab--active" role="tab" aria-selected="true" tabindex="0">
          <span class="mdc-tab__content">
            <span class="mdc-tab__icon material-icons" aria-hidden="true">favorite</span>
            <span class="mdc-tab__text-label">Favorites</span>
          </span>
          <span class="mdc-tab-indicator mdc-tab-indicator--active">
            <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
          </span>
          <span class="mdc-tab__ripple"></span>
        </button>
      </div>
    </div>
  </div>
</div>
```

### Styles

```scss
@import "@material/tab-bar/mdc-tab-bar";
@import "@material/tab-scroller/mdc-tab-scroller";
@import "@material/tab-indicator/mdc-tab-indicator";
@import "@material/tab/mdc-tab";
```

### JavaScript Instantiation

```js
import {MDCTabBar} from '@material/tab-bar';

const tabBar = new MDCTabBar(document.querySelector('.mdc-tab-bar'));
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

### Variants

MDC Tab Bar does not have any variants; however, its subcomponents do. See the [Tab Scroller](../mdc-tab-scroller),
[Tab](../mdc-tab), and [Tab Indicator](../mdc-tab-indicator) documentation for more information.

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-tab-bar` | Mandatory.

### Sass Mixins

To customize the width of the tab bar, use the following mixin.

Mixin | Description
--- | ---
`mdc-tab-bar-width($width)` | Customizes the width of the tab bar.

## `MDCTabBar` Properties and Methods

Method Signature | Description
--- | ---
`activateTab(index: number) => void` | Activates the tab at the given index.
`scrollIntoView(index: number) => void` | Scrolls the tab at the given index into view.

Event Name | Event Data Structure | Description
--- | --- | ---
`MDCTabBar:activated` | `{"detail": {"index": number}}` | Emitted when a Tab is activated with the index of the activated Tab. Listen for this to update content when a Tab becomes active.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Tab Bar for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCTabBarAdapter`

Method Signature | Description
--- | ---
`scrollTo(scrollX: number) => void` | Scrolls the Tab Scroller to the given position.
`incrementScroll(scrollXIncrement: number) => void` | Increments the Tab Scroller by the given value.
`getScrollPosition() => number` | Returns the scroll position of the Tab Scroller.
`getScrollContentWidth() => number` | Returns the width of the Tab Scroller's scroll content element.
`getOffsetWidth() => number` | Returns the offsetWidth of the root element.
`isRTL() => boolean` | Returns if the text direction is RTL.
`setActiveTab(index: number) => void` | Sets the tab at the given index to be activated.
`activateTabAtIndex(index: number, clientRect: ClientRect) => void` | Activates the Tab at the given index with the given clientRect.
`deactivateTabAtIndex(index) => void` | Deactivates the Tab at the given index.
`focusTabAtIndex(index: number) => void` | Focuses the Tab at the given index.
`getTabIndicatorClientRectAtIndex(index: number) => ClientRect` | Returns the client rect of the Tab at the given index.
`getTabDimensionsAtIndex(index) => MDCTabDimensions` | Returns the dimensions of the Tab at the given index.
`getTabListLength() => number` | Returns the number of child Tab components.
`getPreviousActiveTabIndex() => number` | Returns the index of the previously active Tab.
`getFocusedTabIndex() => number` | Returns the index of the focused Tab.
`getIndexOfTab(tab: MDCTab) => number` | Returns the index of the given Tab instance.
`notifyTabActivated(index: number) => void` | Emits the `MDCTabBar:activated` event.

### `MDCTabBarFoundation`

Method Signature | Description
--- | ---
`activateTab(index: number) => void` | Activates the tab at the given index.
`handleKeyDown(evt: Event) => void` | Handles the logic for the `"keydown"` event.
`handleTabInteraction(evt: Event) => void` | Handles the logic for the `"MDCTab:interacted"` event.
`scrollIntoView(index: number) => void` | Scrolls the Tab at the given index into view.
