<!--docs:
title: "Chip set"
layout: detail
section: components
excerpt: "Chip sets represent logical groups of chips."
iconId: chip
path: /catalog/chips/chipset/
-->

# Chip set

Chip sets represent logical groups of [chips](../chip).

## Basic usage

**Note**: there's work planned to replace the `mdc-evolution-*` prefix of chips with the standard `mdc-chip-*` prefix.

### HTML structure

Chip sets have two varieties: layout grid chip sets and listbox chip sets.

Note: chip sets use the [roving `tabindex` pattern](https://www.w3.org/TR/wai-aria-practices-1.1/#kbd_roving_tabindex) for keyboard navigation. As a result, only one [chip action](../action) should be in the tab sequence with `tabindex="0"`. **All** other chip actions, even other action(s) in the same chip, should have `tabindex="-1"`.

#### Layout grid chip sets

Layout grid chip sets follow the [layout grid](https://www.w3.org/TR/wai-aria-practices/#layoutGrid) interaction pattern. They contain either [action chips](../chip#action-chips) or [input chips](../chip#input-chips).

```html
<span class="mdc-evolution-chip-set" role="grid">
  <span class="mdc-evolution-chip-set__chips" role="presentation">
    <!-- Contains either action chips or input chips -->
  </span>
</span>
```

#### Listbox chip sets

Listbox chip sets follow the follow the [listbox](https://www.w3.org/TR/wai-aria-practices/#Listbox) interaction pattern They contain [filter chips chips](../chip#filter-chips).

```html
<span class="mdc-evolution-chip-set" role="listbox" aria-orientation="horizontal" aria-multiselectable="true">
  <span class="mdc-evolution-chip-set__chips" role="presentation">
    <!-- Contains filter chips -->
  </span>
</span>
```

Listbox chip sets support both multi-selection and single-selection. The [`aria-multiselectable` attribute](https://www.w3.org/TR/wai-aria-1.1/#aria-multiselectable) dictates which behavior is applied.

```html
<span class="mdc-evolution-chip-set" role="listbox" aria-orientation="horizontal" aria-multiselectable="false">
  <span class="mdc-evolution-chip-set__chips" role="presentation">
    <!-- Contains filter chips -->
  </span>
</span>
```

## API

### CSS classes

CSS Class | Description
--- | ---
`mdc-evolution-chip-set` | Mandatory, for the chip set root.
`mdc-evolution-chip-set__chips` | Mandatory, for the element containing the chips.
`mdc-evolution-chip-set--overflow` | Optional, causes the chips to overflow instead of wrap (their default behavior).

### Sass mixins

Access to theme mixins require importing the chips theme style module.

```scss
@use "@material/chips";
```

Mixin | Description
--- | ---
`horizontal-space-between-chips($space)` | Sets the horizontal space between chips in the chip set.
`vertical-space-between-chips($space)` | Sets the vertical space between chips in the chip set.

### `MDCChipSet` methods

Method Signature | Description
--- | ---
`getChipIndexByID(chipID: string): number` | Returns the index of the chip with the given `id`.
`getChipIdAtIndex(index: number): string` | Returns the `id` of the chip at the given index.
`getSelectedChipIndexes(): ReadonlySet<number>` | Returns the indexes of the selcted chips (if any). Only supported for [listbox chip sets](#listbox-chip-sets).
`setChipSelected(index: number, action: MDCChipActionType, isSelected: boolean): void` | Sets the chip to be selected at the given index. Only supported for [listbox chip sets](#listbox-chip-sets).
`isChipSelected(index: number, action: MDCChipActionType): boolean` | Returns the selected state of the chip at the given index. Only supported for [listbox chip sets](#listbox-chip-sets).
`removeChip(index: number): boolean` | Returns the selected state of the chip at the given index. Only supported for [listbox chip sets](#listbox-chip-sets).

### `MDCChipSetEvents`

Event name | Detail | Description
--- | --- | ---
`MDCChipSet:interaction` | `MDCChipSetInteractionEventDetail` | Emitted when a chip is interacted with.
`MDCChipSet:removal` | `MDCChipSetRemovalEventDetail` | Emitted when a chip is removed. Check the detail to know when the removal animation is complete.
`MDCChipSet:selection` | `MDCChipSetSelectionEventDetail` | Emitted when a chip selected state changes.

### `MDCChipSetAdapter`

Method Signature | Description
--- | ---
`announceMessage(message: string): void` | Announces the message to screen readers via an [`aria-live` region](https://www.w3.org/TR/wai-aria-1.1/#aria-live).
`emitEvent<D extends object>(eventName: MDCChipSetEvents, eventDetail: D): void` | Emits the given `eventName` with the given `eventDetail`.
`getAttribute(attrName: MDCChipSetAttributes): string\|null` | Returns the value for the given if attribute or `null` if it does not exist.
`getChipActionsAtIndex(index: number): MDCChipActionType[]` | Returns the actions provided by the child chip at the given index.
`getChipCount(): number` | Returns the number of child chips.
`getChipIdAtIndex(index: number): string` | Returns the ID of the chip at the given index.
`getChipIndexById(chipID: string): number` | Returns the index of the child chip with the matching ID.
`isChipFocusableAtIndex(index: number, actionType: MDCChipActionType): boolean` | Proxies to the `MDCChip#isActionFocusable` method.
`isChipSelectableAtIndex(index: number, actionType: MDCChipActionType): boolean` | Proxies to the `MDCChip#isActionSelectable` method.
`isChipSelectedAtIndex(index: number, actionType: MDCChipActionType): boolean` | Proxies to the `MDCChip#isActionSelected` method.
`removeChipAtIndex(index: number): void` | Removes the chip at the given index.
`setChipFocusAtIndex(index: number, action: MDCChipActionType, focus: FocusBehavior): void` | Proxies to the `MDCChip#setActionFocus` method.
`setChipSelectedAtIndex(index: number, actionType: MDCChipActionType, isSelected: boolean): void` | Proxies to the `MDCChip#setActionSelected` method.
`startChipAnimationAtIndex(index: number, animation: Animation): void` | Starts the chip animation at the given index.

### `MDCChipSetFoundation`

Method Signature | Description
--- | ---
`handleChipAnimation(event: ChipAnimationEvent): void` | Handles the chip animation event.
`handleChipInteraction(event: ChipInteractionEvent): void` | Handles the chip interaction event.
`handleChipNavigation(event: ChipNavigationEvent): void` | Handles the chip navigation event.
`getSelectedChipIndexes(): ReadonlySet<number>` | Returns the unique selected indexes of the chips (if any).
`setChipSelected(index: number, action: MDCChipActionType, isSelected: boolean): void` | Sets the selected state of the chip at the given index and action.
`isChipSelected(index: number, action: MDCChipActionType): boolean` | Returns the selected state of the chip at the given index and action.
`removeChip(index: number): void` | Removes the chip at the given index.
`addChip(index: number): void` | Animates the addition of the chip at the given index.

### Usage within frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a chip set for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../../docs/integrating-into-frameworks.md).
