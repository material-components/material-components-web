<!--docs:
title: "Chip"
layout: detail
section: components
excerpt: "Chips represent logical groups of interactive actions inside a chip set."
iconId: chip
path: /catalog/chips/chip/
-->

# Chip

Chips represent logical groups of [actions](../action) contained inside a [chip set](../chip-set).

## Basic usage

**Note**: there's work planned to replace the `mdc-evolution-*` prefix of chips with the standard `mdc-chip-*` prefix.

### HTML structure

Chips must contain a [primary action](../action#primary-action) and may contain a [trailing action](../action#trailing-action).

Note: all chips **must** have a unique [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id).

#### Layout grid

Both action chips and input chips follow the [layout grid](https://www.w3.org/TR/wai-aria-practices/#layoutGrid) interaction pattern. All navigable actions must be contained by a [`gridcell` role](https://www.w3.org/TR/wai-aria-1.1/#gridcell) and the chip root must have the [`row` role](https://www.w3.org/TR/wai-aria-1.1/#row).

##### Action chips

Action chips have a single mandatory primary action.

```html
<span class="mdc-evolution-chip" role="row" id="c0">
  <span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--primary" role="gridcell">
    <button class="mdc-evolution-chip__action mdc-evolution-chip__action--primary" type="button" tabindex="0">
      <span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--primary"></span>
      <span class="mdc-evolution-chip__text-label">Chip label</span>
    </button>
  </span>
</span>
```

Action chips with buttons can be disabled with the `mdc-evolution-chip--disabled` class and the [`disabled` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled) on the root. Action chips with links cannot be disabled.

```html
<span class="mdc-evolution-chip mdc-evolution-chip--disabled" role="row" id="c1">
  <span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--primary" role="gridcell">
    <button class="mdc-evolution-chip__action mdc-evolution-chip__action--primary" type="button" tabindex="-1" disabled>
      <span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--primary"></span>
      <span class="mdc-evolution-chip__text-label">Chip label</span>
    </button>
  </span>
</span>
```

##### Input chips

Input chips have a mandatory primary action and trailing action.

```html
<span class="mdc-evolution-chip" role="row" id="c2">
  <span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--primary" role="gridcell">
    <button class="mdc-evolution-chip__action mdc-evolution-chip__action--primary" type="button" tabindex="0">
      <span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--primary"></span>
      <span class="mdc-evolution-chip__text-label">Chip foo</span>
    </button>
  </span>
  <span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--trailing" role="gridcell">
    <button class="mdc-evolution-chip__action mdc-evolution-chip__action--trailing" type="button" tabindex="-1" data-mdc-deletable="true" aria-label="Remove chip foo">
      <span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--trailing"></span>
      <span class="mdc-evolution-chip__icon mdc-evolution-chip__icon--trailing">close</span>
    </button>
  </span>
</span>
```

If it's desirable to have only the primary action be navigable, the trailing action `gridcell` role can be excluded and the trailing action can receive [`aria-hidden="true"`](https://www.w3.org/TR/wai-aria-1.1/#aria-hidden). In this case, it's recommended to include `data-mdc-deletable="true"` on the primary action, thus making it deletable via Backspace/Delete key press on focus, and an `aria-label` indicating the behavior.

```html
<span class="mdc-evolution-chip" role="presentation" id="c3">
  <span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--primary" role="gridcell">
    <button class="mdc-evolution-chip__action mdc-evolution-chip__action--primary" type="button" tabindex="0" data-mdc-deletable="true" aria-label="Chip foo, press backspace or delete to remove">
      <span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--primary"></span>
      <span class="mdc-evolution-chip__text-label">Chip foo</span>
    </button>
  </span>
  <button class="mdc-evolution-chip__action mdc-evolution-chip__action--trailing" type="button" tabindex="-1" data-mdc-deletable="true" aria-hidden="true">
    <span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--trailing"></span>
    <span class="mdc-evolution-chip__icon mdc-evolution-chip__icon--trailing">close</span>
  </button>
</span>
```

Similar to action chips, input chips with buttons can be disabled by setting the [`disabled` attribute](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/disabled) on the actions and adding the `mdc-evolution-chip--disabled` class to the root.

```html
<span class="mdc-evolution-chip mdc-evolution-chip--disabled" role="row" id="c4">
  <span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--primary" role="gridcell">
    <button class="mdc-evolution-chip__action mdc-evolution-chip__action--primary" type="button" tabindex="-1" disabled>
      <span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--primary"></span>
      <span class="mdc-evolution-chip__text-label">Chip foo</span>
    </button>
  </span>
  <span class="mdc-evolution-chip__cell mdc-evolution-chip__cell--trailing" role="gridcell">
    <button class="mdc-evolution-chip__action mdc-evolution-chip__action--trailing" type="button" tabindex="-1" data-mdc-deletable="true" aria-label="Remove chip foo" disabled>
      <span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--trailing"></span>
      <span class="mdc-evolution-chip__icon mdc-evolution-chip__icon--trailing">close</span>
    </button>
  </span>
</span>
```

#### Listbox

Filter chips follow the [listbox](https://www.w3.org/TR/wai-aria-practices/#Listbox) interaction pattern.

##### Filter chips

Filter chips have a mandatory primary action while the chip root receives a [`presentation` role](https://www.w3.org/TR/wai-aria-1.1/#presentation).

```html
<span class="mdc-evolution-chip" role="presentation" id="c5">
  <span class="mdc-evolution-chip__action mdc-evolution-chip__action--primary" role="option" aria-selected="false" tabindex="0">
    <span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--primary"></span>
    <span class="mdc-evolution-chip__graphic">
      <span class="mdc-evolution-chip__icon mdc-evolution-chip__icon--primary material-icons">favorite</span> <!-- optional -->
      <span class="mdc-evolution-chip__checkmark">
        <svg class="mdc-evolution-chip__checkmark-svg" viewBox="-2 -3 30 30">
          <path class="mdc-evolution-chip__checkmark-path"
              fill="none" stroke="black" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
        </svg>
      </span>
    </span>
    <span class="mdc-evolution-chip__text-label">Chip label</span>
  </span>
</span>
```

To disable a filter chip, set [`aria-disabled="true"`](https://www.w3.org/TR/wai-aria-1.1/#aria-disabled) on the primary action and add the `mdc-evolution-chip--disabled` class on the chip root.

```html
<span class="mdc-evolution-chip mdc-evolution-chip--disabled" role="presentation" id="c6">
  <span class="mdc-evolution-chip__action mdc-evolution-chip__action--primary" role="option" aria-selected="false" tabindex="0">
    <span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--primary"></span>
    <span class="mdc-evolution-chip__graphic">
      <span class="mdc-evolution-chip__icon mdc-evolution-chip__icon--primary material-icons">favorite</span> <!-- optional -->
      <span class="mdc-evolution-chip__checkmark">
        <svg class="mdc-evolution-chip__checkmark-svg" viewBox="-2 -3 30 30">
          <path class="mdc-evolution-chip__checkmark-path"
              fill="none" stroke="black" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
        </svg>
      </span>
    </span>
    <span class="mdc-evolution-chip__text-label">Chip label</span>
  </span>
</span>
```

## API

### CSS classes

CSS Class | Description
--- | ---
`mdc-evolution-chip` | Mandatory, for the chip root.
`mdc-evolution-chip--selectable` | Mandatory for selectable (i.e filter) chips.
`mdc-evolution-chip--selected` | Mandatory for selectable chips that are selected. Used in conjunction with `*--selectable`.
`mdc-evolution-chip--with-primary-graphic` | Mandatory for chips that have a primary graphic (i.e. the checkmark for filter chips and/or an icon)
`mdc-evolution-chip--with-primary-icon` | Mandatory for chips that have an icon in the primary graphic slot (used in conjunction with `*--with-primary-graphic`). Not mandatory if the primary graphic only contains the filter chip checkmark.
`mdc-evolution-chip--with-trailing-action` | Mandatory for chips with a trailing action.
`mdc-evolution-chip--filter` | Optional for filter chips, making the selected treatment visually distinct.
`mdc-evolution-chip--with-avatar` | Optinal, for chips with a primary graphic icon that should be receive the avatar treatment.
`mdc-evolution-chip--disabled` | Optional, visually styles the chip as disabled.
`mdc-evolution-chip__cell` | Optional, for [layout grid chips](#layout-grid). Applied to the grid cell.
`mdc-evolution-chip__cell--primary` | Optional, for [layout grid chips](#layout-grid). Applied to the grid cell containing the primary action.
`mdc-evolution-chip__cell--trailing` | Optional, for [layout grid chips](#layout-grid). Applied to the grid cell containing the trailing action **if** the trailing action is navigable.

### Sass mixins

Access to theme mixins require importing the chips theme style module.

```scss
@use "@material/chips";
```

Mixin | Description
--- | ---
`ripple-color($color)` | Sets the ripple color of a chip.
`selected-ripple-color($color)` | Sets the ripple color of a selected chip.
`trailing-action-ripple-color($color)` | Sets the ripple color of a chip trailing action.
`trailing-action-ripple-size($size)` | Sets the ripple size of a chip trailing action.
`density($density)` | Sets the density of a chip.
`height($height)` | Sets the height of a chip.
`shape-radius($radius)` | Sets the shape radius of a chip.
`outline-width($width)` | Sets the outline width of a chip.
`outline-color($color)` | Sets the outline color of a chip.
`selected-outline-color($color)` | Sets the outline color of a selected chip.
`outline-style($style)` | Sets the outline style of a chip.
`container-color($color)` | Sets the container color of a chip.
`selected-container-color($color)` | Sets the container color of a selected chip.
`text-label-color($color)` | Sets the text label color of a chip.
`selected-text-label-color($color)` | Sets the text label color of a selected chip.
`text-label-type-scale($type-scale)` | Sets the text label type scale of a chip.
`graphic-size($size)` | Sets the graphic size of a chip.
`icon-color($color)` | Sets the icon color of a chip.
`icon-container-color($color)` | Sets the icon container color of a chip.
`icon-size($size)` | Sets the icon size of a chip.
`trailing-action-size($size)` | Sets the trailing action size of a chip.
`trailing-action-color($color)` | Sets the trailing action color of a chip.
`checkmark-size($size)` | Sets the checkmark size of a chip.
`checkmark-color($color)` | Sets the checkmark color of a chip.
`checkmark-container-color($color)` | Sets the checkmark container color of a chip.
`horizontal-padding($leading, $trailing)` | Sets the horizontal padding of a chip with no graphic or trailing action.
`with-graphic-horizontal-padding($graphic-leading, $graphic-trailing, $primary-trailing)` | Sets the horizontal padding of a chip with a primary graphic.
`with-trailing-action-horizontal-padding($primary-leading, $trailing-action-leading, $trailing-action-trailing)` | Sets the horizontal padding of a chip with a trailing action.
`with-graphic-and-trailing-action-horizontal-padding($graphic-leading, $graphic-trailing, $trailing-action-leading, $trailing-action-trailing)` | Sets the horizontal padding of a chip with a primary graphic and trailing action.

### `MDCChip` methods

The `MDCChip` is exposed only to be called by the parent [`MDCChipSet`](../chip-set). Users should not interact with the `MDCChip` component nor rely on any exposed APIs or events.

### `MDCChip` events

These events are only emitted for consumption by the parent [`MDCChipSet`](../chip-set). Non-wrapping clients **should not** listen to these events.

Event name | Detail | Description
--- | --- | ---
`MDCChip:animation` | `MDCChipAnimationEventDetail` | Consumed in the parent chip set `handleChipAnimation` method.
`MDCChip:interaction` | `MDCChipInteractionEventDetail` | Consumed in the parent chip set `handleChipInteraction` method.
`MDCChip:navigation` | `MDCChipNavigationEventDetail` | Consumed in the parent chip set `handleChipNavigation` method.

### `MDCChipAdapter`

Method Signature | Description
--- | ---
`addClass(className: ClassName): void` | Adds the class name to the chip root.
`emitEvent<D extends object>(eventName: Events, eventDetail: D): void` | Emits the given `eventName` with the given `eventDetail`.
`getActions(): MDCChipActionType[]` | Returns the actions of the chip in [DOM order](https://developers.google.com/web/fundamentals/accessibility/focus/dom-order-matters).
`getAttribute(attrName: Attributes): string\|null` | Returns the value of the attribute or `null` if it does not exist.
`getElementID(): string` | Returns the [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) of the root element.
`getOffsetWidth(): number` | Returns the [`offsetWidth`](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetWidth) of the root element.
`hasClass(className: CssClasses): boolean` | Returns `true` if the class exists on the root element, otherwise returns `false`.
`isActionSelectable(action: MDCChipActionType): boolean` | Returns the seletability of the action with the given type.
`isActionSelected(action: MDCChipActionType): boolean` | Returns the selected state of the action with the given type.
`isActionFocusable(action: MDCChipActionType): boolean` | Returns the focusability of the action with the given type.
`isActionDisabled(action: MDCChipActionType): boolean` | Returns the disabled state of the action with the given type.
`isRTL(): boolean` | Returns `true` if the chip is rendered in an RTL context, otherwise returns `false`.
`removeClass(className: CssClasses): void` | Remove the given class from the root.
`setActionDisabled(action: MDCChipActionType, isDisabled: boolean): void` | Sets the disabled state of the action with the given type.
`setActionFocus(action: MDCChipActionType, behavior: MDCChipActionFocusBehavior): void` | Sets the focus behavior of the action with the given type.
`setActionSelected(action: MDCChipActionType, isSelected: boolean): void` | Sets the selected state of the action with the given type.
`setStyleProperty(property: string, value: string): void` | Sets the style property on the root to the given value.

### `MDCChipFoundation`

Method Signature | Description
--- | ---
`handleAnimationEnd(event: AnimationEvent): void` | Handles the [`animationend` event](https://developer.mozilla.org/en-US/docs/Web/API/Document/animationend_event).
`handleTransitionEnd(): void` | Handles the [`transitionend` event](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/transitionend_event).
`handleActionInteraction(event: ActionInteractionEvent): void` | Handles the chip action's interaction event.
`handleActionNavigation(event: ActionNavigationEvent): void` | Handles the chip action's navigation event.
`getElementID(): string` | Returns the [`id`](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id) of the chip.
`setDisabled(isDisabled: boolean): void` | Sets the disabled state of the chip.
`isDisabled(): boolean` | Returns the disabled state of the chip.
`getActions(): ActionType[]` | Returns the actions of the chip.
`isActionFocusable(action: MDCChipActionType): boolean` | Returns the focusability of the given action.
`isActionSelectable(action: MDCChipActionType): boolean` | Returns the selectability of the given action.
`isActionSelected(action: MDCChipActionType): boolean` | Returns the selected state of the given action.
`setActionFocus(action: MDCChipActionType, focus: MDCChipActionFocusBehavior): void` | Sets the focus behavior of the given action.
`setActionSelected(action: MDCChipActionType, isSelected: boolean): void` | Sets the selected state of the given action.
`startAnimation(animation: Animation): void` | Starts the given animation on the chip.

### Usage within frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a chip for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../../docs/integrating-into-frameworks.md).
