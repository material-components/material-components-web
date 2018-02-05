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
  <div class="mdc-chip">
    <div class="mdc-chip__text">Chip content</div>
  </div>
  <div class="mdc-chip">
    <div class="mdc-chip__text">Chip content</div>
  </div>
  <div class="mdc-chip">
    <div class="mdc-chip__text">Chip content</div>
  </div>
</div>
```

### CSS Classes

CSS Class | Description
--- | ---
`mdc-chip` | Mandatory.
`mdc-chip__text` | Mandatory. Indicates the text content of the chip.
`mdc-chip-set` | Mandatory. Indicates the set that the chip belongs to.

### `MDCChip` and `MDCChipSet`

The MDC Chips module is comprised of two JavaScript classes: 
* `MDCChip` defines the behavior of a single chip
* `MDCChipSet` defines the behavior of chips within a specific set. For example, chips in an entry chip set behave differently from those in a filter chip set.

To use the `MDCChip` and `MDCChipSet` classes, [import](../../docs/importing-js.md) both classes from `@material/chips`.

#### `MDCChip`

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
`registerInteractionHandler(evtType: string, handler: EventListener) => void` | Registers an event listener on the root element
`deregisterInteractionHandler(evtType: string, handler: EventListener) => void` | Deregisters an event listener on the root element
`notifyInteraction() => void` | Emits a custom event "MDCChip:interaction" denoting the chip has been interacted with, which bubbles to the parent `mdc-chip-set` element

#### `MDCChipSetAdapter`

Method Signature | Description
--- | ---
`hasClass(className: string) => boolean` | Returns whether the chip set element has the given class

### Foundations: `MDCChipFoundation` and `MDCChipSetFoundation`

#### `MDCChipFoundation`
None yet, coming soon.

#### `MDCChipSetFoundation`
None yet, coming soon.
