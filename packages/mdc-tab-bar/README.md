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

## Variants

MDC Tab Bar does not have any variants; however, its subcomponents do. See the [Tab Scroller](../mdc-tab-scroller),
[Tab](../mdc-tab), and [Tab Indicator](../mdc-tab-indicator) documentation for more information.

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
`mdc-tab-bar` | Mandatory.

### Sass Mixins

To customize the width of the tab bar, use the following mixin.

Mixin | Description
--- | ---
`mdc-tab-bar-width($width)` | Customizes the width of the tab bar.

<!-- docgen-tsdoc-replacer:start __DO NOT EDIT, This section is automatically generated__ -->
### MDCTabBar
#### Methods

Signature | Description
--- | ---
`activateTab(index: number) => void` | Activates the tab at the given index.
`emit(evtType: string, evtData: T, shouldBubble?: boolean) => void` | Fires a cross-browser-compatible custom event from the component root of the given type, with the given data.
`listen(evtType: K, handler: SpecificEventListener<K>, options?: AddEventListenerOptions | boolean) => void` | Wrapper method to add an event listener to the component's root element. This is most useful when listening for custom events.
`scrollIntoView(index: number) => void` | Scrolls the tab at the given index into view.
`unlisten(evtType: K, handler: SpecificEventListener<K>, options?: AddEventListenerOptions | boolean) => void` | Wrapper method to remove an event listener to the component's root element. This is most useful when unlistening for custom events.

#### Properties

Name | Type | Description
--- | --- | ---
focusOnActivate | `boolean` | Sets whether tabs focus themselves when activated. Defaults to `true`.
useAutomaticActivation | `boolean` | Sets how tabs activate in response to keyboard interaction. Automatic (`true`) activates as soon as a tab is focused with arrow keys; manual (`false`) activates only when the user presses space/enter. The default is automatic (`true`).

#### Events
- `MDCTabBar:activated {"detail": {"index": number}}` Emitted when a Tab is activated with the index of the activated Tab. Listen for this to update content when a Tab becomes active.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create this component for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### MDCTabBarAdapter
#### Methods

Signature | Description
--- | ---
`getScrollPosition() => number` | Returns the scroll position of the Tab Scroller.
`activateTabAtIndex(index: number, clientRect?: ClientRect) => void` | Activates the tab at the given index with the given client rect.
`focusTabAtIndex(index: number) => void` | Focuses the tab at the given index.
`getFocusedTabIndex() => number` | Returns the index of the focused Tab.
`getIndexOfTabById(id: string) => number` | Returns the index of the focused Tab.
`getOffsetWidth() => number` | Returns the offsetWidth of the root element.
`getPreviousActiveTabIndex() => number` | Returns the index of the previously active Tab.
`getScrollContentWidth() => number` | Returns the width of the Tab Scroller's scroll content element.
`deactivateTabAtIndex(index: number) => void` | Deactivates the tab at the given index.
`getTabDimensionsAtIndex(index: number) => MDCTabDimensions` | Returns the dimensions of the Tab at the given index.
`getTabIndicatorClientRectAtIndex(index: number) => ClientRect` | Returns the client rect of the tab's indicator.
`getTabListLength() => number` | Returns the number of child Tab components.
`incrementScroll(scrollXIncrement: number) => void` | Increments the current scroll position by the given amount
`isRTL() => boolean` | Returns if the text direction is RTL.
`notifyTabActivated(index: number) => void` | Emits the `MDCTabBar:activated` event.
`scrollTo(scrollX: number) => void` | Scrolls the Tab Scroller to the given position.
`setActiveTab(index: number) => void` | Sets the tab at the given index to be activated.

### MDCTabBarFoundation
#### Methods

Signature | Description
--- | ---
`activateTab(index: number) => void` | Activates the tab at the given index.
`handleKeyDown(evt: KeyboardEvent) => void` | Handles the logic for the `"keydown"` event.
`handleTabInteraction(evt: MDCTabInteractionEvent) => void` | Handles the logic for the `"MDCTab:interacted"` event.
`scrollIntoView(index: number) => void` | Scrolls the Tab at the given index into view.
`setUseAutomaticActivation(useAutomaticActivation: boolean) => void` | Sets how tabs activate in response to keyboard interaction. Automatic (`true`) activates as soon as a tab is focused with arrow keys; manual (`false`) activates only when the user presses space/enter. See https://www.w3.org/TR/wai-aria-practices/#tabpanel for examples.


<!-- docgen-tsdoc-replacer:end -->
