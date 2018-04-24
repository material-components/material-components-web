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
npm install @material/chips
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

To use a leading icon in a filter chip, put the `mdc-chip__icon--leading` element _before_ the `mdc-chip__checkmark` element:

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

#### Pre-selected

To display a pre-selected chip, add the class `mdc-chip--selected` to the root chip element.

```html
<div class="mdc-chip mdc-chip--selected">
  <div class="mdc-chip__text">Add to calendar</div>
</div>
```

To pre-select filter chips that have a leading icon, also add the class `mdc-chip__icon--leading-hidden` to the `mdc-chip__icon--leading` element. This will ensure that the checkmark displaces the leading icon.

```html
<div class="mdc-chip mdc-chip--selected">
  <i class="material-icons mdc-chip__icon mdc-chip__icon--leading mdc-chip__icon--leading-hidden">face</i>
  <div class="mdc-chip__checkmark">
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
`mdc-chip-set--input` | Optional. Indicates that the chips in the set are input chips, which enable user input by converting text into chips.
`mdc-chip-set--choice` | Optional. Indicates that the chips in the set are choice chips, which allow a single selection from a set of options.
`mdc-chip-set--filter` | Optional. Indicates that the chips in the set are filter chips, which allow multiple selection from a set of options.
`mdc-chip` | Mandatory.
`mdc-chip--selected` | Optional. Indicates that the chip is selected.
`mdc-chip__text` | Mandatory. Indicates the text content of the chip.
`mdc-chip__icon` | Optional. Indicates an icon in the chip.
`mdc-chip__icon--leading` | Optional. Indicates a leading icon in the chip.
`mdc-chip__icon--leading-hidden` | Optional. Hides the leading icon in a filter chip when the chip is selected.
`mdc-chip__icon--trailing` | Optional. Indicates a trailing icon which removes the chip from the DOM. Only use with input chips.
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
`mdc-chip-fill-color-accessible($color)` | Customizes the background fill color for a chip, and updates the chip's ink, icon and ripple colors to meet accessibility standards
`mdc-chip-fill-color($color)` | Customizes the background fill color for a chip
`mdc-chip-ink-color($color)` | Customizes the text ink color for a chip, and updates the chip's ripple color to match
`mdc-chip-selected-ink-color($color)` | Customizes text ink and ripple color of a chip in the _selected_ state
`mdc-chip-outline($width, $style, $color)` | Customizes the outline properties for a chip
`mdc-chip-outline-width($width)` | Customizes the outline width for a chip
`mdc-chip-outline-style($style)` | Customizes the outline style for a chip
`mdc-chip-outline-color($color)` | Customizes the outline color for a chip
`mdc-chip-leading-icon-color($color, $opacity)` | Customizes the color of a leading icon in a chip, optionally customizes opacity
`mdc-chip-trailing-icon-color($color, $opacity, $hover-opacity, $focus-opacity)` | Customizes the color of a trailing icon in a chip, optionally customizes regular/hover/focus opacities
`mdc-chip-leading-icon-size($size)` | Customizes the size of a leading icon in a chip
`mdc-chip-trailing-icon-size($size)` | Customizes the size of a trailing icon in a chip

> _NOTE_: `mdc-chip-set-spacing` also sets the amount of space between a chip and the edge of the set it's contained in.

### `MDCChip` and `MDCChipSet`

The MDC Chips module is comprised of two JavaScript classes:
* `MDCChip` defines the behavior of a single chip
* `MDCChipSet` defines the behavior of chips within a specific set. For example, chips in an input chip set behave differently from those in a filter chip set.

To use the `MDCChip` and `MDCChipSet` classes, [import](../../docs/importing-js.md) both classes from `@material/chips`.

#### `MDCChip`

Method Signature | Description
--- | ---
`get foundation() => MDCChipFoundation` | Returns the foundation
`isSelected() => boolean` | Proxies to the foundation's `isSelected` method
`remove() => void` | Destroys the chip and removes the root element from the DOM

Property | Value Type | Description
--- | --- | ---
`ripple` | `MDCRipple` | The `MDCRipple` instance for the root element that `MDCChip` initializes

#### `MDCChipSet`

Method Signature | Description
--- | ---
`addChip(text: string, leadingIcon: Element, trailingIcon: Element) => void` | Creates a new chip in the chip set with the given text, leading icon, and trailing icon

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
`notifyInteraction() => void` | Emits a custom event `MDCChip:interaction` denoting the chip has been interacted with
`notifyTrailingIconInteraction() => void` | Emits a custom event `MDCChip:trailingIconInteraction` denoting the chip's trailing icon has been interacted with
`notifyRemoval() => void` | Emits a custom event `MDCChip:removal` denoting the chip will be removed
`getComputedStyleValue(propertyName: string) => string` | Returns the computed property value of the given style property on the root element
`setStyleProperty(propertyName: string, value: string) => void` | Sets the property value of the given style property on the root element

> _NOTE_: The custom events emitted by `notifyInteraction` and `notifyTrailingIconInteraction` must pass along the target chip in its event `detail`, as well as bubble to the parent `mdc-chip-set` element.

#### `MDCChipSetAdapter`

Method Signature | Description
--- | ---
`hasClass(className: string) => boolean` | Returns whether the chip set element has the given class
`registerInteractionHandler(evtType: string, handler: EventListener) => void` | Registers an event handler on the root element for a given event
`deregisterInteractionHandler(evtType: string, handler: EventListener) => void` | Deregisters an event handler on the root element for a given event
`appendChip(text: string, leadingIcon: Element, trailingIcon: Element) => Element` | Appends and returns a chip element with the given text, leading icon, and trailing icon
`removeChip(chip: MDCChip) => void` | Removes the chip object from the chip set

### Foundations: `MDCChipFoundation` and `MDCChipSetFoundation`

#### `MDCChipFoundation`

Method Signature | Description
--- | ---
`isSelected() => boolean` | Returns true if the chip is selected
`setSelected(selected: boolean) => void` | Sets the chip's selected state

#### `MDCChipSetFoundation`

Method Signature | Description
--- | ---
`addChip(text: string, leadingIcon: Element, trailingIcon: Element) => Element` | Returns a new chip element with the given text, leading icon, and trailing icon, added to the root chip set element
`select(chipFoundation: MDCChipFoundation) => void` | Selects the given chip
`deselect(chipFoundation: MDCChipFoundation) => void` | Deselects the given chip
