# Trailing Action (deprecated)

The trailing action is used in removable input chips. It is a subcomponent of the chips and intended only for use in the context of a chip.

## Basic Usage

### HTML Structure

```html
<button class="mdc-deprecated-chip-trailing-action"
        aria-label="Remove chip"
        tabindex="-1">
  <span class="mdc-deprecated-chip-trailing-action__ripple"></span>
  <span class="mdc-deprecated-chip-trailing-action__icon material-icons">close</span>
</button>
```

### Styles

```scss
@use "@material/chips/mdc-deprecated-chip-trailing-action";
```

## Variants

### Non-navigable trailing action

In some cases, the trailing action should be non-navigable. To accomplish this, swap the `aria-label` for `aria-hidden="true"`.

```html
<button class="mdc-deprecated-chip-trailing-action"
        aria-hidden="true"
        tabindex="-1">
  <span class="mdc-deprecated-chip-trailing-action__icon material-icons">close</span>
</button>
```

### Accessibility

Material Design spec advises that touch targets should be at least 48 x 48 px.
To meet this requirement, add the following to your trailing action:

```html
<button class="mdc-deprecated-chip-trailing-action"
        aria-label="Remove chip"
        tabindex="-1">
  <span class="mdc-deprecated-chip-trailing-action__ripple"></span>
  <span class="mdc-deprecated-chip-trailing-action__touch"></span>
  <span class="mdc-deprecated-chip-trailing-action__icon material-icons">close</span>
</button>
```

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-deprecated-chip-trailing-action` | Mandatory.
`mdc-deprecated-chip-trailing-action__icon` | Mandatory. Indicates the chip icon.
`mdc-deprecated-chip-trailing-action__ripple` | Mandatory. Indicates the chip ripple.
`mdc-deprecated-chip-trailing-action__touch` | Optional. Renders an accessible touch target.

### Sass Mixins

Mixin | Description
--- | ---
`color($color)` | Sets the trailing action color
`size($size)` | Sets the trailing action size
`horizontal-spacing($left, $right)` | Sets the trailing action horizontal spacing
`touch-target-width($width)` | Sets the trailing action touch target width


## `MDCChipTrailingAction` Methods

Method Signature | Description
--- | ---
`removeFocus() => void` | Proxies to the foundation's `removeFocus` method
`focus() => void` | Proxies to the foundation's `focus` method
`isNavigable() => void` | Proxies to the foundation's `isNavigable` method

##### Events

Event Name | `event.detail` | Description
--- | --- | ---
`MDCChipTrailingAction:interaction` | `{trigger: InteractionTrigger}` | Indicates the trailing action was interacted with via mouse or keyboard
`MDCChipTrailingAction:navigation` | `{key: string}` | Indicates a navigation event has occurred on a trailing action

> _NOTE_: All of `MDCChipTrailingAction`'s emitted events bubble up through the DOM.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create Chips for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCChipTrailingActionAdapter`

See [`component.ts`](component.ts) for a vanilla DOM implementations of the adapter API for reference.

Method Signature | Description
--- | ---
`focus() => void` | Gives focus to the root element
`getAttribute(attr: string) => string|null` | Returns the attribute value, if present
`notifyInteraction(trigger: InteractionTrigger) => void` | Notifies the Chip  that the trailing action has been interacted with
`notifyNavigation(key: string) => void` | Notifies the Chip that the trailing action was navigated
`setAttribute(attr: string, value: string) => void` | Sets an attribute on the root to the given value

### `MDCChipTrailingActionFoundation`

Method Signature | Description
--- | ---
`removeFocus() => void` | Removes focus from the trailing action
`focus() => void` | Gives focus to the trailing action
`isNavigable() => boolean` | Returns the navigability of the trailing action
`handleClick(event: MouseEvent) => void` | Handles a click event on the root element
`handleKeydown(event: KeyboardEvent) => void` | Handles a keydown event on the root element

#### `MDCChipTrailingActionFoundation` Event Handlers

When wrapping the trailing action foundation, the following events must be bound to the indicated foundation methods:

Events | Element Selector | Foundation Handler
--- | --- | ---
`click` | `.mdc-deprecated-chip-trailing-action` (root) | `handleClick()`
`keydown` | `.mdc-deprecated-chip-trailing-action` (root) | `handleKeydown()`
