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
<span class="mdc-tab-indicator">
  <span class="mdc-tab-indicator__content"></span>
</span>
```

#### Active Indicator

Add the `mdc-tab-indicator--active` class to the `mdc-tab-indicator` element to make the Tab Indicator active.

#### Sliding Underline Indicator
```html
<span class="mdc-tab-indicator">
  <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
</span>
```

#### Fading Icon Indicator

You can use [Material Icons](https://material.io/icons/) from Google Fonts within your Fading Icon Indicator, or you can use your own icons.

```html
<span class="mdc-tab-indicator mdc-tab-indicator--fade">
  <span class="mdc-tab-indicator__content mdc-tab-indicator__content--icon material-icons">star</span>
</span>
```

#### Sliding Icon Indicator
```html
<span class="mdc-tab-indicator">
  <span class="mdc-tab-indicator__content mdc-tab-indicator__content--icon material-icons">star</span>
</span>
```

### CSS Classes

CSS Class | Description
--- | ---
`mdc-tab-indicator` | Mandatory. Contains the tab indicator content.
`mdc-tab-indicator__content` | Mandatory. Denotes the tab indicator content.
`mdc-tab-indicator--active` | Optional. Visually activates the indicator
`mdc-tab-indicator--fade` | Optional. Sets up the tab indicator to fade in on activation and fade out on deactivation
`mdc-tab-indicator__content--underline` | Optional. Denotes an underline tab indicator
`mdc-tab-indicator__content--icon` | Optional. Denotes an icon tab indicator

### Sass Mixins

To customize the tab indicator, use the following mixins.

Mixin | Description
--- | ---
`mdc-tab-indicator-surface` | Mandatory. Applied to the parent element of the `mdc-tab-indicator`.
`mdc-tab-indicator-underline-color($color)` | Customizes the color of the underline
`mdc-tab-indicator-icon-color($color)` | Customizes the color of the icon subelement
`mdc-tab-indicator-underline-height($height)` | Customizes the height of the underline
`mdc-tab-indicator-icon-height($height)` | Customizes the height of the icon subelement
`mdc-tab-indicator-underline-top-corner-radius($radius)` | Customizes the top left and top right border radius of the underline subelement

### `MDCTabIndicator`

Method Signature | Description
--- | ---
`activate(previousIndicatorClientRect: ClientRect) => void` | Activates the tab indicator
`deactivate() => void` | Deactivates the tab indicator
`computeContentClientRect() => ClientRect` | Returns the content element bounding client rect

### `MDCTabIndicatorAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element
`removeClass(className: string) => void` | Removes a class from the root element
`registerEventHandler(evtType: string, handler: EventListener) => void` | Registers an event listener on the root element
`deregisterEventHandler(evtType: string, handler: EventListener) => void` | Deregisters an event listener on the root element
`setContentStyleProp(property: string, value: string) => void` | Sets the style property of the content element
`computeContentClientRect() => ClientRect` | Returns the content element's bounding client rect

### `MDCTabIndicatorFoundation`

Method Signature | Description
--- | ---
`handleTransitionEnd(evt: Event) => void` | Handles the logic for the `"transitionend"` event on the root element
`activate(previousIndicatorClientRect: ClientRect) => void` | Activates the tab indicator
`deactivate() => void` | Deactivates the tab indicator
`computeContentClientRect() => ClientRect` | Returns the content element's bounding client rect
