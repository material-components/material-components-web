<!--docs:
title: "Tab Indicator"
layout: detail
section: components
excerpt: "Tab Indicator is a visual guide that shows which Tab is active"
iconId: tab
path: /catalog/tab/
-->

# Tab Indicator

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/tab-indicator.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/tab-indicator.png" width="363" alt="Tab indicator screenshot">
  </a>
</div>-->

Tab Indicator is a visual guide that shows which Tab is active

## Design & API Documentation

<!--
<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/tabs.html">Material Design guidelines: Tab Indicator</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/tab-indicator.html">Demo</a>
  </li>
</ul>
-->

## Installation
```
npm install --save @material/tab-indicator
```

## Usage

### HTML Structure

```html
<span class="mdc-tab-indicator"></span>
```

##### Tab Indicator Icon

We recommend you load [Material Icons](https://material.io/icons/) from Google Fonts. However, users are free to use whatever icons they like.

```html
<span class="mdc-tab-indicator mdc-tab-indicator--icon">
  <i class="material-icons">lens</i>
</span>
```

### CSS Classes

CSS Class | Description
--- | ---
`mdc-tab-indicator` | Mandatory.
`mdc-tab-indicator--icon` | Optional. Sets up the tab indicator to appear as an icon

### Sass Mixins

To customize the tab indicator, use the following mixins.

Mixin | Description
--- | ---
`mdc-tab-indicator-color($color)` | Customizes the color of the tab indicator
`mdc-tab-indicator-height($height)` | Customizes the height of the tab indicator
`mdc-tab-indicator-top-radius($radius)` | Customizes the top left and top right border radius of the tab indicator

### `MDCTabIndicator`

Method Signature | Description
--- | ---
`activate(previousTabClientRect: ClientRect) => void` | Activates the tab indicator
`deactivate() => void` | Deactivates the tab indicator
`computeClientRect() => ClientRect` | Returns the root element bounding client rect

### `MDCTabIndicatorAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element
`removeClass(className: string) => void` | Removes a class from the root element
`registerEventHandler(evtType: string, handler: EventListener) => void` | Registers an event listener on the root element
`deregisterEventHandler(evtType: string, handler: EventListener) => void` | Deregisters an event listener on the root element
`setStyleProp(property: string, value: string) => void` | Sets the style property of the root element
`computeClientRect() => ClientRect` | Returns the root element's bounding client rect

### `MDCTabIndicatorFoundation`

Method Signature | Description
--- | ---
`handleTransitionEnd(evt: Event) => void` | Handles the logic for the `"transitionend"` event on the root element
`activate(previousTabIndicatorRect: ClientRect) => void` | Activates the tab indicator
`deactivate() => void` | Deactivates the tab indicator
`computeClientRect() => ClientRect` | Returns the root element's bounding client rect
