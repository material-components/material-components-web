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
    <span class="mdc-tab__icon">heart</div>
    <span class="mdc-tab__text-label">Favorites</div>
  </div>
</button>
```

### CSS Classes

CSS Class | Description
--- | ---
`mdc-tab` | Mandatory.
`mdc-tab--active` | Optional. Indicates that the tab is active.
`mdc-tab__content` | Mandatory. Indicates the text label of the tab
`mdc-tab__text-label` | Optional. Indicates an icon in the tab
`mdc-tab__icon` | Optional. Indicates a leading icon in the tab

### Sass Mixins

To customize the colors of any part of the tab, use the following mixins. 

Mixin | Description
--- | ---
<!--
`mdc-chip-set-spacing($gap-size)` | Customizes the amount of space between each chip in the set
`mdc-chip-corner-radius($radius)` | Customizes the corner radius for a chip
`mdc-chip-fill-color-accessible($color)` | Customizes the background fill color for a chip, and updates the chip's ink and ripple color to meet accessibility standards
`mdc-chip-fill-color($color)` | Customizes the background fill color for a chip
`mdc-chip-ink-color($color)` | Customizes the text ink color for a chip, and updates the chip's ripple color to match
`mdc-chip-selected-ink-color($color)` | Customizes text ink and ripple color of a chip in the _selected_ state
`mdc-chip-stroke($width, $style, $color)` | Customizes the border stroke properties for a chip
`mdc-chip-stroke-width($width)` | Customizes the border stroke width for a chip
`mdc-chip-stroke-style($style)` | Customizes the border stroke style for a chip
`mdc-chip-stroke-color($color)` | Customizes the border stroke color for a chip
-->

<!--
> _NOTE_: `mdc-chip-set-spacing` also sets the amount of space between a chip and the edge of the set it's contained in.
-->

### `MDCTab`

Method Signature | Description
--- | ---
<!--
`toggleSelected() => void` | Proxies to the foundation's `toggleSelected` method
-->

Property | Value Type | Description
--- | --- | ---
<!--
`ripple` | `MDCRipple` | The `MDCRipple` instance for the root element that `MDCChip` initializes
-->

### `MDCTabAdapter`

Method Signature | Description
--- | ---
<!--
`addClass(className: string) => void` | Adds a class to the root element
`removeClass(className: string) => void` | Removes a class from the root element
`hasClass(className: string) => boolean` | Returns true if the root element contains the given class
`registerInteractionHandler(evtType: string, handler: EventListener) => void` | Registers an event listener on the root element
`deregisterInteractionHandler(evtType: string, handler: EventListener) => void` | Deregisters an event listener on the root element
`registerTrailingIconInteractionHandler(evtType: string, handler: EventListener) => void` | Registers an event listener on the trailing icon element
`deregisterTrailingIconInteractionHandler(evtType: string, handler: EventListener) => void` | Deregisters an event listener on the trailing icon element
`notifyInteraction() => void` | Emits a custom event `MDCChip:interaction` denoting the chip has been interacted with, which bubbles to the parent `mdc-chip-set` element
`notifyTrailingIconInteraction() => void` | Emits a custom event `MDCChip:trailingIconInteraction` denoting the chip's trailing icon has been interacted with, which bubbles to the parent `mdc-chip-set` element
-->

### `MDCTabFoundation`

Method Signature | Description
--- | ---
<!--
`toggleSelected() => void` | Toggles the selected class on the chip element
-->
