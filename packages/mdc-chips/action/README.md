<!--docs:
title: "Chip action"
layout: detail
section: components
excerpt: "Chip actions represent interactions regions of a chip."
iconId: chip
path: /catalog/chips/action/
-->

# Action

Actions represent discrete interactive regions of a [chip](../chip). They are only ever used inside of chips.

## Basic usage

**Note**: there's work planned to replace the `mdc-evolution-*` prefix of chips with the standard `mdc-chip-*` prefix.

### HTML structure

Actions have two varieties: primary and trailing. All chips must have a primary action. Chips may have an optional trailing action.

#### Primary action

Primary actions often use a `<button>` as the root.

```html
<button class="mdc-evolution-chip__action mdc-evolution-chip__action--primary" type="button" tabindex="0">
  <span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--primary"></span>
  <span class="mdc-evolution-chip__text-label">Chip label</span>
</button>
```

Primary actions may also be deletable.

```html
<button class="mdc-evolution-chip__action mdc-evolution-chip__action--primary" type="button" tabindex="0" data-mdc-deletable="true">
  <span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--primary"></span>
  <span class="mdc-evolution-chip__text-label">Chip label</span>
</button>
```

Primary actions may also be links.

```html
<a class="mdc-evolution-chip__action mdc-evolution-chip__action--primary" href="https://google.com" tabindex="0">
  <span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--primary"></span>
  <span class="mdc-evolution-chip__text-label">Chip label</span>
</a>
```

Primary actions accept an optional leading graphic.

```html
<button class="mdc-evolution-chip__action mdc-evolution-chip__action--primary" type="button" tabindex="0">
  <span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--primary"></span>
  <span class="mdc-evolution-chip__graphic">
    <span class="mdc-evolution-chip__icon mdc-evolution-chip__icon--primary material-icons">favorite</span>
  </span>
  <span class="mdc-evolution-chip__text-label">Chip label</span>
</button>
```

Primary actions can also be selectable, implementing the [`option` role](https://www.w3.org/TR/wai-aria-1.1/#option). Selectable primary actions require the graphic element with the included checkmark and may also include a leading graphic.

```html
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
```

#### Trailing action

Trailing actions always use a `<button> ` as the root.

```html
<button class="mdc-evolution-chip__action mdc-evolution-chip__action--trailing" type="button" tabindex="-1" data-mdc-deletable="true">
  <span class="mdc-evolution-chip__ripple mdc-evolution-chip__ripple--trailing"></span>
  <span class="mdc-evolution-chip__icon mdc-evolution-chip__icon--trailing">close</span>
</button>
```

## API

### CSS classes

CSS Class | Description
--- | ---
`mdc-evolution-chip__action` | Mandatory, for the action root.
`mdc-evolution-chip__action--primary` | Mandatory, mutually exclusive with the `*--trailing` root class.
`mdc-evolution-chip__action--trailing` | Mandatory, mutually exclusive with the `*--primary` root class.
`mdc-evolution-chip__action--presentational` | Optional, used to indicate the action is presentational (not interactive).
`mdc-evolution-chip__ripple` | Mandatory, used for the ripple.
`mdc-evolution-chip__ripple--primary` | Mandatory for the ripple, mutually exclusive with the `*--trailing` ripple class.
`mdc-evolution-chip__ripple--trailing` | Mandatory for the ripple, mutually exclusive with the `*--primary` ripple class.
`mdc-evolution-chip__text-label` | Mandatory for primary actions.
`mdc-evolution-chip__graphic` | Used for optionally selectable primary actions or primary actions with a leading graphic.
`mdc-evolution-chip__icon` | Mandatory for trailing actions, also used for optional leading graphic.
`mdc-evolution-chip__icon--primary` | Used for optional leading graphic.
`mdc-evolution-chip__checkmark` | Used for optionally selectable primary actions.
`mdc-evolution-chip__checkmark-svg` | Used for optionally selectable primary actions.
`mdc-evolution-chip__checkmark-path` | Used for optionally selectable primary actions.

### Sass mixins

All Sass mixins for actions are provided by the chip Sass.

### `MDCChipAction` methods

The `MDCChipAction` is exposed only to be called by the parent [`MDCChip`](../chip). Users should not interact with the `MDCChipAction` component nor rely on any exposed APIs or events.

### `MDCChipActionEvents`

These events are only emitted for consumption by the parent [`MDCChip`](../chip). Non-wrapping clients **should not** listen to these events.

Event name | Detail | Description
--- | --- | ---
`MDCChipAction:interaction` | `MDCChipActionInteractionEventDetail` | Consumed in the parent chip `handleActionInteraction` method.
`MDCChipAction:navigation` | `MDCChipActionNavigationEventDetail` | Consumed in the parent chip `handleActionNavigation` method.

### `MDCChipActionAdapter`

Method Signature | Description
--- | ---
`emitEvent<D extends object>(eventName: MDCChipActionEvents, eventDetail: D): void` | Emits the given `eventName` with the given `eventDetail`.
`focus(): void` | Focuses the action root.
`getAttribute(attr: MDCChipActionAttributes): string\|null` | Returns the attribute on the action root or `null` if none exists.
`getElementID(): string` | Returns the `[id](https://developer.mozilla.org/en-US/docs/Web/HTML/Global_attributes/id)` of the action root.
`removeAttribute(attr: MDCChipActionAttributes): void` | Removes the attribute from the action root.
`setAttribute(attr: MDCChipActionAttributes, value: string): void` | Sets the action root attribute to the given `value`

### `MDCChipActionFoundation`

`MDCChipActionFoundation` is abstract with concrete subclasses.

Method Signature | Description
--- | ---
`handleClick(): void` | Handles the [click](https://developer.mozilla.org/en-US/docs/Web/API/Element/click_event) event.
`handleKeydown(event: KeyboardEvent): void` | Handles the [keydown](https://developer.mozilla.org/en-US/docs/Web/API/Element/keydown_event) event.
`setDisabled(isDisabled: boolean): void` | Sets the disabled state.
`isDisabled(): boolean` | Returns the disabled state.
`setFocus(behavior: MDCChipActionFocusBehavior): void` | Set the focus behavior.
`isFocusable(): boolean` | Returns whether the action if focusable.
`setSelected(isSelected: boolean): void` | Sets the selected state.
`isSelected(): boolean` | Returns the selected state.
`abstract actionType(): MDCChipActionType` | Returns the type of the action.
`abstract isSelectable(): boolean` | Returns whether the action is selectable.

#### Subclasses

`MDCChipActionFoundation` is subclassed by `MDCChipPrimaryActionFoundation` and `MDCChipTrailingActionFoundation` which encapsulate the behavioral differences between primary and trailing actions. Clients **should not** subclass `MDCChipActionFoundation` themselves. Wrapping clients should provide the correct `MDCChipActionFoundation` subclass for their DOM. The following logic is pulled from the `MDCChipAction` component and should serve as an example of determing which subclass to use.

```ts
function init(root: HTMLElement, adapter: MDCChipTrailingActionAdapter): MDCChipTrailingActionFoundation {
  if (root.classList.contains(CssClasses.TRAILING_ACTION)) {
    return new MDCChipTrailingActionFoundation(adapter);
  }

  // Default to the primary foundation
  return new MDCChipPrimaryActionFoundation(adapter);
}
```


### Usage within frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a chip action for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../../docs/integrating-into-frameworks.md).
