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
     href="https://material-components.github.io/material-components-web-catalog/#/component/chips">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/chips.png" width="363" alt="Chips screenshot">
  </a>
</div>-->

Chips are compact elements that allow users to enter information, select a choice, filter content, or trigger an action.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-chips">Material Design guidelines: Chips</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/chips">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/chips
```

## Basic Usage

### HTML Structure

>**Note**: Due to IE11 and Edge's lack of support for the `:focus-within` selector, keyboard navigation of the chip set will not be visually obvious.

```html
<div class="mdc-chip-set" role="grid">
  <div class="mdc-chip" role="row">
    <div class="mdc-chip__ripple"></div>
    <span role="gridcell">
      <span role="button" tabindex="0" class="mdc-chip__primary-action">
        <span class="mdc-chip__text">Chip One</span>
      </span>
    </span>
  </div>
  <div class="mdc-chip" role="row">
    <div class="mdc-chip__ripple"></div>
    <span role="gridcell">
      <span role="button" tabindex="-1" class="mdc-chip__primary-action">
        <span class="mdc-chip__text">Chip Two</span>
      </span>
    </span>
  </div>
  ...
</div>
```

### Styles

```scss
@use "@material/chips/mdc-chips";
```

### JavaScript Instantiation

```js
import {MDCChipSet} from '@material/chips';
const chipSetEl = document.querySelector('.mdc-chip-set');
const chipSet = new MDCChipSet(chipSetEl);
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

## Variants

### Leading and Trailing Icons

You can optionally add a leading icon (i.e. thumbnail) and/or a trailing "remove" icon to a chip. To add an icon, add an `i` element with your preferred icon, give it a class of `mdc-chip__icon`, and a class of either `mdc-chip__icon--leading` or `mdc-chip__icon--trailing`.

We recommend using [Material Icons](https://material.io/tools/icons/) from Google Fonts:

```html
<head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
```

However, you can also use SVG, [Font Awesome](https://fontawesome.com/), or any other icon library you wish.

#### Leading icon

```html
<div class="mdc-chip" role="row">
  <div class="mdc-chip__ripple"></div>
  <i class="material-icons mdc-chip__icon mdc-chip__icon--leading">event</i>
  <span role="gridcell">
    <span role="button" tabindex="0" class="mdc-chip__primary-action">
      <span class="mdc-chip__text">Add to calendar</span>
    </span>
  </span>
</div>
```

#### Trailing icon

A trailing icon comes with the functionality to remove the chip from the set. If you're adding a trailing icon, also set `tabindex="0"` and `role="button"` to make it accessible by keyboard and screenreader. Trailing icons should only be added to [input chips](#input-chips).

```html
<div class="mdc-chip" role="row">
  <div class="mdc-chip__ripple"></div>
  <span role="gridcell">
    <span role="button" tabindex="0" class="mdc-chip__primary-action">
      <span class="mdc-chip__text">Jane Smith</span>
    </span>
  </span>
  <span role="gridcell">
    <i class="material-icons mdc-chip__icon mdc-chip__icon--trailing mdc-chip-trailing-action" tabindex="-1" role="button">cancel</i>
  </span>
</div>
```

### Choice Chips

Choice chips are a variant of chips which allow single selection from a set of options. To define a set of chips as choice chips, add the class `mdc-chip-set--choice` to the chip set element.

```html
<div class="mdc-chip-set mdc-chip-set--choice" role="grid">
  ...
</div>
```

### Filter Chips

Filter chips are a variant of chips which allow multiple selection from a set of options. To define a set of chips as filter chips, add the class `mdc-chip-set--filter` to the chip set element. When a filter chip is selected, a checkmark appears as the leading icon. If the chip already has a leading icon, the checkmark replaces it. This requires the HTML structure of a filter chip to differ from other chips:

```html
<div class="mdc-chip-set mdc-chip-set--filter" role="grid">
  <div class="mdc-chip" role="row">
    <div class="mdc-chip__ripple"></div>
    <span class="mdc-chip__checkmark" >
      <svg class="mdc-chip__checkmark-svg" viewBox="-2 -3 30 30">
        <path class="mdc-chip__checkmark-path" fill="none" stroke="black"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
      </svg>
    </span>
    <span role="gridcell">
      <span role="checkbox" tabindex="0" aria-checked="false" class="mdc-chip__primary-action">
        <span class="mdc-chip__text">Filterable content</span>
      </span>
    </span>
  </div>
  ...
</div>
```

To use a leading icon in a filter chip, put the `mdc-chip__icon--leading` element _before_ the `mdc-chip__checkmark` element:

```html
<div class="mdc-chip-set mdc-chip-set--filter" role="grid">
  <div class="mdc-chip" role="row">
    <div class="mdc-chip__ripple"></div>
    <i class="material-icons mdc-chip__icon mdc-chip__icon--leading">face</i>
    <span class="mdc-chip__checkmark" >
      <svg class="mdc-chip__checkmark-svg" viewBox="-2 -3 30 30">
        <path class="mdc-chip__checkmark-path" fill="none" stroke="black"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
      </svg>
    </span>
    <span role="gridcell">
      <span role="checkbox" tabindex="0" aria-checked="false" class="mdc-chip__primary-action">
        <span class="mdc-chip__text">Filterable content</span>
      </span>
    </span>
  </div>
  ...
</div>
```

### Input Chips

Input chips are a variant of chips which enable user input by converting text into chips. To define a set of chips as input chips, add the class `mdc-chip-set--input` to the chip set element.

```html
<div class="mdc-chip-set mdc-chip-set--input" role="grid">
  ...
</div>
```

#### Adding Chips to the DOM

The MDC Chips package does not handle the process of converting text into chips, in order to remain framework-agnostic. The `MDCChipSet` component exposes an `addChip` method, which accepts an element which is expected to already be inserted within the Chip Set element after any existing chips. The `MDCChipSet` component will then handle creating and tracking a `MDCChip` component instance.

For example:

```js
input.addEventListener('keydown', function(event) {
  if (event.key === 'Enter' || event.keyCode === 13) {
    const chipEl = document.createElement('div');
    // ... perform operations to properly populate/decorate chip element ...
    chipSetEl.appendChild(chipEl);
    chipSet.addChip(chipEl);
  }
});
```

> _NOTE_: `MDCChipSet` will generate a unique ID to apply to each added chip's element if it does not already have an ID
> when it is passed to `addChip`. This is used to distinguish chips during user interactions.

#### Removing Chips from the DOM

By default, input chips are removed in response to clicking the trailing remove icon in the chip. Removal can also be triggered by calling `MDCChip`'s `beginExit()` method.

Individual `MDCChip` instances will emit a `MDCChip:removal` event once the exit transition ends. `MDCChipSet` will handle destroying the `MDCChip` instance in response to `MDCChip:removal`, but it must be removed from the DOM manually. You can listen for `MDCChip:removal` from the parent Chip Set or any ancestor, since the event bubbles:

```js
chipSet.listen('MDCChip:removal', function(event) {
  chipSetEl.removeChild(event.detail.root);
});
```

### Pre-selected

To display a pre-selected filter or choice chip, add the class `mdc-chip--selected` to the root chip element.

```html
<div class="mdc-chip-set mdc-chip-set--choice" role="grid">
  <div class="mdc-chip mdc-chip--selected" role="row">
    <div class="mdc-chip__ripple"></div>
    <span role="gridcell">
      <span role="radio" tabindex="0" aria-checked="true" class="mdc-chip__primary-action">
        <span class="mdc-chip__text">Add to calendar</span>
      </span>
    </span>
  </div>
</div>
```

To pre-select filter chips that have a leading icon, also add the class `mdc-chip__icon--leading-hidden` to the `mdc-chip__icon--leading` element. This will ensure that the checkmark displaces the leading icon.

```html
<div class="mdc-chip-set mdc-chip-set--filter" role="grid">
  <div class="mdc-chip mdc-chip--selected" role="row">
    <div class="mdc-chip__ripple"></div>
    <i class="material-icons mdc-chip__icon mdc-chip__icon--leading mdc-chip__icon--leading-hidden">face</i>
    <span class="mdc-chip__checkmark">
      <svg class="mdc-chip__checkmark-svg" viewBox="-2 -3 30 30">
        <path class="mdc-chip__checkmark-path" fill="none" stroke="black"
              d="M1.73,12.91 8.1,19.28 22.79,4.59"/>
      </svg>
    </span>
    <span role="gridcell">
      <span role="checkbox" tabindex="0" aria-checked="true" class="mdc-chip__primary-action">
        <span class="mdc-chip__text">Filterable content</span>
      </span>
    </span>
  </div>
</div>
```

## Additional Information

### Accessibility

Material Design spec advises that touch targets should be at least 48 x 48 px.
To meet this requirement, add the following to your chip:

```html
<div class="mdc-touch-target-wrapper">
  <div class="mdc-chip mdc-chip--touch">
    <div class="mdc-chip__ripple"></div>
    <span role="gridcell">
      <span role="button" tabindex="0" class="mdc-chip__primary-action">
        <div class="mdc-chip__touch"></div>
        <span class="mdc-chip__text">Chip One</span>
      </span>
    </span>
  </div>
</div>
```

Note that the outer `mdc-touch-target-wrapper` element is only necessary if you want to avoid potentially overlapping touch targets on adjacent elements (due to collapsing margins).

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-chip-set` | Mandatory. Indicates the set that the chip belongs to.
`mdc-chip-set--input` | Optional. Indicates that the chips in the set are input chips, which enable user input by converting text into chips.
`mdc-chip-set--choice` | Optional. Indicates that the chips in the set are choice chips, which allow a single selection from a set of options.
`mdc-chip-set--filter` | Optional. Indicates that the chips in the set are filter chips, which allow multiple selection from a set of options.
`mdc-chip` | Mandatory.
`mdc-chip__ripple` | Mandatory. Indicates the element which shows the ripple styling.
`mdc-chip--selected` | Optional. Indicates that the chip is selected.
`mdc-chip__text` | Mandatory. Indicates the text content of the chip.
`mdc-chip__icon` | Optional. Indicates an icon in the chip. We recommend using [Material Icons](https://material.io/tools/icons/) from Google Fonts.
`mdc-chip__icon--leading` | Optional. Indicates a leading icon in the chip.
`mdc-chip__icon--leading-hidden` | Optional. Hides the leading icon in a filter chip when the chip is selected.
`mdc-chip__icon--trailing` | Optional. Indicates a trailing icon which removes the chip from the DOM. Only use with input chips.
`mdc-chip__checkmark` | Optional. Indicates the checkmark in a filter chip.
`mdc-chip__checkmark-svg` | Mandatory with the use of `mdc-chip__checkmark`. Indicates the checkmark SVG element in a filter chip.
`mdc-chip__checkmark-path` | Mandatory with the use of `mdc-chip__checkmark`. Indicates the checkmark SVG path in a filter chip.

> _NOTE_: Every element that has an `mdc-chip__icon` class must also have either the `mdc-chip__icon--leading` or `mdc-chip__icon--trailing` class.

`mdc-chip__action--primary` | Mandatory. Placed on the `mdc-chip__text` element.
`mdc-chip__action--trailing` | Optinoal. Placed on the `mdc-chip__icon--trailing` when it should be accessible via keyboard navigation.
`mdc-chip--deletable` | Optional. Indicates that the chip should be removable by the delete or backspace key.

### Sass Mixins

Mixin | Description
--- | ---
`set-spacing($gap-size)` | Customizes the amount of space between each chip in the set
`shape-radius($radius, $rtl-reflexive)` | Sets the rounded shape to chip with given radius size. Set `$rtl-reflexive` to true to flip radius values in RTL context, defaults to false.
`fill-color-accessible($color)` | Customizes the background fill color for a chip, and updates the chip's ink, icon and ripple colors to meet accessibility standards
`fill-color($color)` | Customizes the background fill color for a chip
`ink-color($color)` | Customizes the text ink color for a chip, and updates the chip's ripple color to match
`selected-ink-color($color)` | Customizes text ink and ripple color of a chip in the _selected_ state
`outline($width, $style, $color)` | Customizes the outline properties for a chip
`outline-width($width, $horizontal-padding)` | Customizes the outline width for a chip. `$horizontal-padding` is only required in cases where `horizontal-padding` is also included with a custom value
`outline-style($style)` | Customizes the outline style for a chip
`outline-color($color)` | Customizes the outline color for a chip
`height($height)` | Customizes the height for a chip
`horizontal-padding($padding)` | Customizes the horizontal padding for a chip
`leading-icon-color($color, $opacity)` | Customizes the color of a leading icon in a chip, optionally customizes opacity
`trailing-icon-color($color, $opacity, $hover-opacity, $focus-opacity)` | Customizes the color of a trailing icon in a chip, optionally customizes regular/hover/focus opacities
`leading-icon-size($size)` | Customizes the size of a leading icon in a chip
`trailing-icon-size($size)` | Customizes the size of a trailing icon in a chip
`leading-icon-margin($left-margin, $right-margin)` | Customizes the margin of a leading icon in a chip
`trailing-icon-margin($left-margin, $right-margin)` | Customizes the margin of a trailing icon in a chip
`elevation-transition()` | Adds a MDC elevation transition to the chip. This should be used instead of setting transition with `mdc-elevation-transition-value()` directly when a box shadow transition is desired for a chip
`density($density-scale)` | Sets density scale for chip. Supported density scales  are `-2`, `-1` and `0` (default).

> _NOTE_: `mdc-chip-set-spacing` also sets the amount of space between a chip and the edge of the set it's contained in.

## `MDCChip` and `MDCChipSet` Properties and Methods

The MDC Chips package is composed of two JavaScript classes:
* `MDCChip` defines the behavior of a single chip.
* `MDCChipSet` defines the behavior of chips within a specific set. For example, chips in an input chip set behave differently from those in a filter chip set.

To use the `MDCChip` and `MDCChipSet` classes, [import](../../docs/importing-js.md) both classes from `@material/chips`.

#### `MDCChip`

Method Signature | Description
--- | ---
`beginExit() => void` | Proxies to the foundation's `beginExit` method
`focusPrimaryAction() => void` | Proxies to the foundation's `focusPrimaryAction` method
`focusTrailingAction() => void` | Proxies to the foundation's `focusTrailingAction` method
`removeFocus() => void` | Proxies to the foundation's `removeFocus` method
`setSelectedFromChipSet(selected: boolean) => void` | Proxies to the foundation's `setSelectedFromChipset` method (only called from the chip set)

Property | Value Type | Description
--- | --- | ---
`id` | `string` (read-only) | Unique identifier on the chip\*
`selected` | `boolean` | Proxies to the foundation's `isSelected`/`setSelected` methods
`shouldRemoveOnTrailingIconClick` | `boolean` | Proxies to the foundation's `getShouldRemoveOnTrailingIconClick`/`setShouldRemoveOnTrailingIconClick` methods\*\*
`ripple` | `MDCRipple` (read-only) | The `MDCRipple` instance for the root element that `MDCChip` initializes

> \*_NOTE_: This will be the same as the `id` attribute on the root element. If an `id` is not provided, a unique one will be generated by `MDCChipSet.addChip()`.

> \*\*_NOTE_: If `shouldRemoveOnTrailingIconClick` is set to false, you must manually call `beginExit()` on the chip to remove it.

##### Events

Event Name | `event.detail` | Description
--- | --- | ---
`MDCChip:interaction` | `{chipId: string}` | Indicates the chip was interacted with (via click/tap or Enter key)
`MDCChip:selection` | `{chipId: string, selected: boolean}` | Indicates the chip's selection state has changed (for choice/filter chips)
`MDCChip:removal` | `{chipId: string, removedAnnouncement: string|null}` | Indicates the chip is ready to be removed from the DOM
`MDCChip:trailingIconInteraction` | `{chipId: string}` | Indicates the chip's trailing icon was interacted with (via click/tap or Enter key)
`MDCChip:navigation` | `{chipId: string, key: string, source: FocusSource}` | Indicates a navigation event has occurred on a chip

> _NOTE_: All of `MDCChip`'s emitted events bubble up through the DOM.

#### `MDCChipSet`

Method Signature | Description
--- | ---
`addChip(chipEl: Element) => void` | Adds a new `MDCChip` instance to the chip set based on the given `mdc-chip` element

Property | Value Type | Description
--- | --- | ---
`chips` | `ReadonlyArray<MDCChip>` | An array of the `MDCChip` objects that represent chips in the set
`selectedChipIds` | `ReadonlyArray<string>` | An array of the IDs of all selected chips

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create Chips for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### Adapters: `MDCChipAdapter` and `MDCChipSetAdapter`

See [`chip/component.ts`](chip/component.ts) and [`chip-set/component.ts`](chip-set/component.ts) for vanilla DOM implementations of these adapter APIs for reference.

#### `MDCChipAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element
`removeClass(className: string) => void` | Removes a class from the root element
`hasClass(className: string) => boolean` | Returns true if the root element contains the given class
`addClassToLeadingIcon(className: string) => void` | Adds a class to the leading icon element
`removeClassFromLeadingIcon(className: string) => void` | Removes a class from the leading icon element
`eventTargetHasClass(target: EventTarget, className: string) => boolean` | Returns true if target has className, false otherwise
`notifyInteraction() => void` | Notifies the Chip Set that the chip has been interacted with\*
`notifySelection(selected: boolean, chipSetShouldIgnore: boolean) => void` | Notifies the Chip Set that the chip has been selected or deselected\*\*. When `chipSetShouldIgnore` is `true`, the chip set does not process the event.
`notifyTrailingIconInteraction() => void` | Notifies the Chip Set that the chip's trailing icon has been interacted with\*
`notifyRemoval() => void` | Notifies the Chip Set that the chip will be removed\*\*\*
`getComputedStyleValue(propertyName: string) => string` | Returns the computed property value of the given style property on the root element
`setStyleProperty(propertyName: string, value: string) => void` | Sets the property value of the given style property on the root element
`hasLeadingIcon() => boolean` | Returns whether the chip has a leading icon
`getRootBoundingClientRect() => ClientRect` | Returns the bounding client rect of the root element
`getCheckmarkBoundingClientRect() => ClientRect \| null` | Returns the bounding client rect of the checkmark element or null if it doesn't exist
`notifyNavigation(key: string, source: EventSource) => void` | Notifies the Chip Set that a navigation event has occurred
`setPrimaryActionAttr(attr: string, value: string) => void` | Sets an attribute on the primary action element to the given value
`focusPrimaryAction() => void` | Gives focus to the primary action element
`hasTrailingAction() => boolean` | Returns `true` if the chip has a trailing action element
`setTrailingActionAttr(attr: string, value: string) => void` | Sets an attribute on the trailing action element to the given value, if the element exists
`focusTrailingAction() => void` | Gives focus to the trailing action element if present
`getAttribute(attr: string) => string|null` | Returns the string value of the attribute if it exists, otherwise `null`


> \*_NOTE_: `notifyInteraction` and `notifyTrailingIconInteraction` must pass along the target chip's ID, and must be observable by the parent `mdc-chip-set` element (e.g. via DOM event bubbling).

> \*\*_NOTE_: `notifySelection` must pass along the target chip's ID and selected state, and must be observable by the parent `mdc-chip-set` element (e.g. via DOM event bubbling).

> \*\*\*_NOTE_: `notifyRemoval` must pass along the target chip's ID and its root element, and must be observable by the parent `mdc-chip-set` element (e.g. via DOM event bubbling).

#### `MDCChipSetAdapter`

Method Signature | Description
--- | ---
`hasClass(className: string) => boolean` | Returns whether the chip set element has the given class
`removeChipAtIndex(index: number) => void` | Removes the chip with the given `index` from the chip set
`selectChipAtIndex(index: string, selected: boolean, shouldNotifyClients: boolean) => void` | Calls `MDCChip#setSelectedFromChipSet(selected)` on the chip at the given `index`. Will emit a selection event if called with `shouldNotifyClients` set to `true`. The emitted selection event will be ignored by the `MDCChipSetFoundation`.
`getIndexOfChipById(id: string) => number` | Returns the index of the chip with the matching `id` or -1
`focusChipPrimaryActionAtIndex(index: number) => void` | Calls `MDCChip#focusPrimaryAction()` on the chip at the given `index`
`focusChipTrailingActionAtIndex(index: number) => void` | Calls `MDCChip#focusTrailingAction()` on the chip at the given `index`
`isRTL() => boolean` | Returns `true` if the text direction is RTL
`getChipListCount() => number` | Returns the number of chips inside the chip set
`removeFocusFromChipAtIndex(index: number) => void` | Calls `MDCChip#removeFocus()` on the chip at the given `index`
`announceMessage(message: string) => void` | Announces the message via [an `aria-live` region](https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Live_Regions)

### Foundations: `MDCChipFoundation` and `MDCChipSetFoundation`

#### `MDCChipFoundation`

Method Signature | Description
--- | ---
`isSelected() => boolean` | Returns true if the chip is selected
`setSelected(selected: boolean) => void` | Sets the chip's selected state
`setSelectedFromChipSet(selected: boolean, shouldNotifyClients: boolean) => void` | Sets the chip's selected state (called from the chip set) to the `selected` param. Will emit a selection event if called with `shouldNotifyClients` set to `true`. The emitted selection event will be ignored by the `MDCChipSetFoundation`.
`getShouldRemoveOnTrailingIconClick() => boolean` | Returns whether a trailing icon click should trigger exit/removal of the chip
`setShouldRemoveOnTrailingIconClick(shouldRemove: boolean) => void` | Sets whether a trailing icon click should trigger exit/removal of the chip
`getDimensions() => ClientRect` | Returns the dimensions of the chip. This is used for applying ripple to the chip.
`beginExit() => void` | Begins the exit animation which leads to removal of the chip
`handleInteraction(evt: Event) => void` | Handles an interaction event on the root element
`handleTransitionEnd(evt: Event) => void` | Handles a transition end event on the root element
`handleTrailingIconInteraction(evt: Event) => void` | Handles an interaction event on the trailing icon element
`handleKeydown(evt: Event) => void` | Handles a keydown event on the root element
`removeFocus() => void` | Removes focusability from the chip

#### `MDCChipFoundation` Event Handlers

When wrapping the Chip foundation, the following events must be bound to the indicated foundation methods:

Events | Element Selector | Foundation Handler
--- | --- | ---
`click`, `keydown` | `.mdc-chip` (root) | `handleInteraction()`
`click`, `keydown` | `.mdc-chip__icon--trailing` (if present) | `handleTrailingIconInteraction()`
`transitionend` | `.mdc-chip` (root) | `handleTransitionEnd()`
`keydown` | `.mdc-chip` (root) | `handleKeydown()`

#### `MDCChipSetFoundation`

Method Signature | Description
--- | ---
`getSelectedChipIds() => ReadonlyArray<string>` | Returns an array of the IDs of all selected chips
`select(chipId: string) => void` | Selects the chip with the given id
`handleChipInteraction(detail: MDCChipInteractionEventDetail) => void` | Handles a custom `MDCChip:interaction` event on the root element
`handleChipSelection(detail: MDCChipSelectionEventDetail) => void` | Handles a custom `MDCChip:selection` event on the root element. When `chipSetShouldIgnore` is true, the chip set does not process the event.
`handleChipRemoval(detail: MDCChipRemovalEventDetail) => void` | Handles a custom `MDCChip:removal` event on the root element
`handleChipNavigation(detail: MDCChipNavigationEventDetail) => void` | Handles a custom `MDCChip:navigation` event on the root element

#### `MDCChipSetFoundation` Event Handlers

When wrapping the Chip Set foundation, the following events must be bound to the indicated foundation methods:

Events | Element Selector | Foundation Handler
--- | --- | ---
`MDCChip:interaction` | `.mdc-chip-set` (root) | `handleChipInteraction`
`MDCChip:selection` | `.mdc-chip-set` (root) | `handleChipSelection`
`MDCChip:removal` | `.mdc-chip-set` (root) | `handleChipRemoval`
`MDCChip:navigation` | `.mdc-chip-set` (root) | `handleChipNavigation`
