<!--docs:
title: "Tab"
layout: detail
section: components
excerpt: "Tab is a selectable element with an active state"
iconId: tab
path: /catalog/tab/
-->

# Tab

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/tab.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/tab.png" width="363" alt="Tab screenshot">
  </a>
</div>-->

Tab is a selectable element with an active state

## Design & API Documentation

<!--
<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/chips.html">Material Design guidelines: Chips</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/chips.html">Demo</a>
  </li>
</ul>
-->

## Installation
```
npm install --save @material/tab
```

## Usage

### HTML Structure

```html
<button class="mdc-tab" role="tab" aria-selected="false">
  <div class="mdc-tab__content">
    <span class="mdc-tab__text-label">Favorites</div>
  </div>
  <span class="mdc-tab__indicator"></span>
  <span class="mdc-tab__ripple"></span>
</button>
```

### CSS Classes

CSS Class | Description
--- | ---
`mdc-tab` | Mandatory.
`mdc-tab--active` | Optional. Denos that the tab is active.
`mdc-tab--two-lines` | Optional. Denos that the tab has an icon and text label that should be drawn on two separate lines
`mdc-tab__ripple` | Mandatory. Denos the ripple element of the tab
`mdc-tab__indicator` | Mandatory. Denotes the indicator of the tab
`mdc-tab__indicator--icon` | Optional. Denotes that the indicator should be drawn as an icon instead of a bar.
`mdc-tab__content` | Mandatory. Denotes the text label of the tab
`mdc-tab__text-label` | Optional. Denos an icon in the tab
`mdc-tab__icon` | Optional. Denotes a leading icon in the tab

### Sass Mixins

To customize the colors of any part of the tab, use the following mixins. 

Mixin | Description
--- | ---
`mdc-tab-text-label-color($color)` | Customizes the color of the tab text label
`mdc-tab-icon-color($color)` | Customizes the color of the tab icon
`mdc-tab-indicator-color($color)` | Customizes the color of the tab indicator
`mdc-tab-indciator-height($height)` | Customizes the height of the tab indicator

### `MDCTab`

Property | Value Type | Description
--- | --- | ---
`active` | `boolean` | Allows getting/setting the active state of the tab
`ripple` | `MDCRipple` | The `MDCRipple` instance for the root element that `MDCChip` initializes

### `MDCTabAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element
`removeClass(className: string) => void` | Removes a class from the root element
`hasClass(className: string) => boolean` | Returns true if the root element contains the given class
`registerEventHandler(evtType: string, handler: EventListener) => void` | Registers an event listener on the root element
`deregisterEventHandler(evtType: string, handler: EventListener) => void` | Deregisters an event listener on the root element
`setAttr(attr: string, value: string) => void` | Sets the given attribute on the root element to the given value

### `MDCTabFoundation`

Method Signature | Description
--- | ---
`handleTransitionEnd(evt: Event) => void` | Handles the logic for the `"transitionend"` event
`isActive() => boolean` | Returns whether the tab is active
`activate() => void` | Activates the tab
`deactivate() => void` | Deactivates the tab
