<!--docs:
title: "Chips"
layout: detail
section: components
excerpt: "Chips are compact elements that represent an attribute, text, entity, or action."
iconId: chip
path: /catalog/chips/
-->

# Chips

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/chips.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/chips.png" width="363" alt="Chips screenshot">
  </a>
</div>-->

Chips are compact elements that allow users to enter information, select a choice, filter content, or trigger an action.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/chips.html">Material Design guidelines: Chips</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/chips.html">Demo</a>
  </li>
</ul>

## Installation
```
npm install --save @material/chips
```

## Usage

### HTML Structure

```html
<div class="mdc-chip-set">
  <div class="mdc-chip" tabindex="0">
    <div class="mdc-chip__text">Chip content</div>
  </div>
  <div class="mdc-chip" tabindex="0">
    <div class="mdc-chip__text">Chip content</div>
  </div>
  <div class="mdc-chip" tabindex="0">
    <div class="mdc-chip__text">Chip content</div>
  </div>
</div>
```

#### Leading and Trailing Icons

You can optionally add a leading icon (i.e. thumbnail) and/or a trailing icon to a chip. To add an icon, add an `i` element with your preferred icon, give it a class of `mdc-chip__icon`, and a class of either `mdc-chip__icon--leading` or `mdc-chip__icon--trailing`. If you're adding a trailing icon, also set `tabindex="0"` and `role="button"` to make it accessible by keyboard and screenreader.

##### Leading icon

```html
<div class="mdc-chip">
  <i class="material-icons mdc-chip__icon mdc-chip__icon--leading">event</i>
  <div class="mdc-chip__text">Add to calendar</div>
</div>
```

##### Trailing icon

```html
<div class="mdc-chip">
  <div class="mdc-chip__text">Jane Smith</div>
  <i class="material-icons mdc-chip__icon mdc-chip__icon--trailing" tabindex="0" role="button">cancel</i>
</div>
```

#### Filter Chips

Filter chips are a variant of chips which allow multiple selection from a set of options. When a filter chip is selected, a checkmark appears as the leading icon. If the chip already has a leading icon, the checkmark replaces it. This requires the HTML structure of a filter chip to differ from other chips:

```html
<div class="mdc-chip">
  <div class="mdc-chip__checkmark" >
    <svg class="mdc-chip__checkmark-svg" viewBox="-2 -3 30 30">
      <path class="mdc-chip__checkmark-path" fill="none" stroke="black"
            d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
    </svg>
  </div>
  <div class="mdc-chip__text">Filterable content</div>
</div>
```

> _NOTE_: To use a leading icon in a filter chip, put the `mdc-chip__icon--leading` element _before_ the `mdc-chip__checkmark` element:

```html
<div class="mdc-chip">
  <i class="material-icons mdc-chip__icon mdc-chip__icon--leading">face</i>
  <div class="mdc-chip__checkmark" >
    <svg class="mdc-chip__checkmark-svg" viewBox="-2 -3 30 30">
      <path class="mdc-chip__checkmark-path" fill="none" stroke="black"
            d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
    </svg>
  </div>
  <div class="mdc-chip__text">Filterable content</div>
</div>
```

### CSS Classes

CSS Class | Description
--- | ---
`mdc-chip-set` | Mandatory. Indicates the set that the chip belongs to.
`mdc-chip-set--choice` | Optional. Indicates that the chips in the set are choice chips, which allow a single selection from a set of options.
`mdc-chip-set--filter` | Optional. Indicates that the chips in the set are filter chips, which allow multiple selection from a set of options.
`mdc-chip` | Mandatory.
`mdc-chip__text` | Mandatory. Indicates the text content of the chip.
`mdc-chip__icon` | Optional. Indicates an icon in the chip.
`mdc-chip__icon--leading` | Optional. Indicates a leading icon in the chip.
`mdc-chip__icon--trailing` | Optional. Indicates a trailing icon in the chip.
`mdc-chip__checkmark` | Optional. Indicates the checkmark in a filter chip.
`mdc-chip__checkmark-svg` | Mandatory with the use of `mdc-chip__checkmark`. Indicates the checkmark SVG element in a filter chip.
`mdc-chip__checkmark-path` | Mandatory with the use of `mdc-chip__checkmark`. Indicates the checkmark SVG path in a filter chip.

> _NOTE_: Every element that has an `mdc-chip__icon` class must also have either the `mdc-chip__icon--leading` or `mdc-chip__icon--trailing` class.

### Sass Mixins

To customize the colors of any part of the chip, use the following mixins. 

Mixin | Description
--- | ---
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

> _NOTE_: `mdc-chip-set-spacing` also sets the amount of space between a chip and the edge of the set it's contained in.

### `MDCChip` and `MDCChipSet`

The MDC Chips module is comprised of two JavaScript classes: 
* `MDCChip` defines the behavior of a single chip
* `MDCChipSet` defines the behavior of chips within a specific set. For example, chips in an entry chip set behave differently from those in a filter chip set.

To use the `MDCChip` and `MDCChipSet` classes, [import](../../docs/importing-js.md) both classes from `@material/chips`.

#### `MDCChip`

Method Signature | Description
--- | ---
`toggleSelected() => void` | Proxies to the foundation's `toggleSelected` method

Property | Value Type | Description
--- | --- | ---
`ripple` | `MDCRipple` | The `MDCRipple` instance for the root element that `MDCChip` initializes

#### `MDCChipSet`

Property | Value Type | Description
--- | --- | ---
`chips` | Array<`MDCChip`> | An array of the `MDCChip` objects that represent chips in the set

### Adapters: `MDCChipAdapter` and `MDCChipSetAdapter`

#### `MDCChipAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element
`removeClass(className: string) => void` | Removes a class from the root element
`hasClass(className: string) => boolean` | Returns true if the root element contains the given class
`addClassToLeadingIcon(className: string) => void` | Adds a class to the leading icon element
`removeClassFromLeadingIcon(className: string) => void` | Removes a class from the leading icon element
`eventTargetHasClass(target: EventTarget, className: string) => boolean` | Returns true if target has className, false otherwise
`registerEventHandler(evtType: string, handler: EventListener) => void` | Registers an event listener on the root element
`deregisterEventHandler(evtType: string, handler: EventListener) => void` | Deregisters an event listener on the root element
`registerTrailingIconInteractionHandler(evtType: string, handler: EventListener) => void` | Registers an event listener on the trailing icon element
`deregisterTrailingIconInteractionHandler(evtType: string, handler: EventListener) => void` | Deregisters an event listener on the trailing icon element
`notifyInteraction() => void` | Emits a custom event `MDCChip:interaction` denoting the chip has been interacted with, which bubbles to the parent `mdc-chip-set` element
`notifyTrailingIconInteraction() => void` | Emits a custom event `MDCChip:trailingIconInteraction` denoting the chip's trailing icon has been interacted with, which bubbles to the parent `mdc-chip-set` element

#### `MDCChipSetAdapter`

Method Signature | Description
--- | ---
`hasClass(className: string) => boolean` | Returns whether the chip set element has the given class
`registerInteractionHandler(evtType, handler) => void` | Registers an event handler on the root element for a given event
`deregisterInteractionHandler(evtType, handler) => void` | Deregisters an event handler on the root element for a given event

### Foundations: `MDCChipFoundation` and `MDCChipSetFoundation`

#### `MDCChipFoundation`

Method Signature | Description
--- | ---
`toggleSelected() => void` | Toggles the selected class on the chip element

#### `MDCChipSetFoundation`
None yet, coming soon.
