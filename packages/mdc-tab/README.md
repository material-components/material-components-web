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

Tab is a selectable element with an active state and an indicator

## Design & API Documentation

<!--
<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/tabs.html">Material Design guidelines: Tabs</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/tab.html">Demo</a>
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
  <span class="mdc-tab__ripple"></span>
  <span class="mdc-tab-indicator"></span>
</button>
```

#### Text Label and Icon

You can use an icon in place of or with a text label.

##### Icon

```html
<button class="mdc-tab" role="tab" aria-selected="false">
  <div class="mdc-tab__content">
    <span class="mdc-tab__icon material-icons">favorite</div>
  </div>
  <span class="mdc-tab__ripple"></span>
  <span class="mdc-tab-indicator"></span>
</button>
```

##### Text Label and Icon

```html
<button class="mdc-tab" role="tab" aria-selected="false">
  <div class="mdc-tab__content">
    <span class="mdc-tab__icon material-icons">favorite</div>
    <span class="mdc-tab__text-label">Favorites</div>
  </div>
  <span class="mdc-tab__ripple"></span>
  <span class="mdc-tab-indicator"></span>
</button>
```

##### Stacked Text Label and Icon

Add the `mdc-tab--stacked` class to the root element to vertically stack the icon and text label.

#### Indicator Customization

The tab indicator can be customized via dimensions and style. It can appear as a bar matching the width of the full tab *or* a bar matching the width of the text label. It can also be customized to appear as an icon.

Modifying the width of the tab indicator bar requires changing the tab indicator's location in the DOM. Modifying the tab indicator to appear as an icon requires adding an `mdc-tab-indicator--icon` class.

##### Text Label Width Indicator

To make the indicator match the width of the text label, just move the indicator element inside the `mdc-tab__content` element.

```html
<button class="mdc-tab" role="tab" aria-selected="false">
  <div class="mdc-tab__content">
    <span class="mdc-tab__text-label">Favorites</div>
    <span class="mdc-tab-indicator"></span>
  </div>
  <span class="mdc-tab__ripple"></span>
</button>
```

##### Icon Indicator

We recommend you load [Material Icons](https://material.io/icons/) from Google Fonts. However, users are free to use whatever icons they like.

```html
<button class="mdc-tab" role="tab" aria-selected="false">
  <div class="mdc-tab__content">
    <span class="mdc-tab__text-label">Favorites</div>
  </div>
  <span class="mdc-tab-indicator mdc-tab-indicator--icon">
    <i class="material-icons">change_history</i>
  </span>
  <span class="mdc-tab__ripple"></span>
</button>
```

### CSS Classes

CSS Class | Description
--- | ---
`mdc-tab` | Mandatory.
`mdc-tab__ripple` | Mandatory. Denotes the ripple element of the tab
`mdc-tab__content` | Mandatory. Denotes the content of the tab
`mdc-tab-indicator` | Mandatory. Denotes the tab indicator
`mdc-tab--active` | Optional. Denotes that the tab is active.
`mdc-tab--two-lines` | Optional. Denotes that the tab has an icon and text label that should be drawn on two separate lines
`mdc-tab__text-label` | Optional. Denotes a text label in the tab content
`mdc-tab__icon` | Optional. Denotes an icon in the tab content

### Sass Mixins

To customize the colors of any part of the tab, use the following mixins.

Mixin | Description
--- | ---
`mdc-tab-text-label-color($color)` | Customizes the color of the tab text label
`mdc-tab-icon-color($color)` | Customizes the color of the tab icon
`mdc-tab-indicator-color($color)` | Customizes the color of the tab indicator
`mdc-tab-indciator-height($height)` | Customizes the height of the tab indicator

### `MDCTab`

Method Signature | Description
--- | ---
`activate(previousTabClientRect: ClientRect) => void` | Activates the tab
`deactivate() => void` | Deactivates the tab

Property | Value Type | Description
--- | --- | ---
`active` | `boolean` | Getter for the active state of the tab
`indicatorClientRect` | `ClientRect` | Getter for the indicator's bounding client rect

### `MDCTabAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element
`removeClass(className: string) => void` | Removes a class from the root element
`hasClass(className: string) => boolean` | Returns whether the root element has the given class
`registerEventHandler(evtType: string, handler: EventListener) => void` | Registers an event listener on the root element
`deregisterEventHandler(evtType: string, handler: EventListener) => void` | Deregisters an event listener on the root element
`setAttr(attr: string, value: string) => void` | Sets the given attribute on the root element to the given value

### `MDCTabFoundation`

Method Signature | Description
--- | ---
`handleTransitionEnd(evt: Event) => void` | Handles the logic for the `"transitionend"` event on the root element
`isActive() => boolean` | Returns whether the tab is active
`activate(previousTabIndicatorRect: ClientRect) => void` | Activates the tab
`deactivate() => void` | Deactivates the tab
`getIndicatorClientRect() => ClientRect` | Returns the tab indicator's bounding client rect
