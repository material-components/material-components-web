# MDC Button

The MDC Button component is a spec-aligned button component adhering to the
 [Material Design button requirements](https://material.google.com/components/buttons.html).
 It works without JavaScript with basic functionality for all states.
 If you initiate the JavaScript object for a button, then it will be enhanced with ripple effects. (Not yet implemented)

## Installation

```
npm install --save @material/button
```

## Usage

### Flat

```html
<button class="mdc-button">
  Flat button
</button>
```

### Colored

```html
<button class="mdc-button mdc-button--accent">
  Colored button
</button>
```

### Raised

```html
<button class="mdc-button mdc-button--raised">
  Raised button
</button>
```

### Disabled

```html
<button class="mdc-button mdc-button--raised" disabled>
  Raised disabled button
</button>
```

## Classes

### Block

The block class is `mdc-button`. This defines the top-level button element.

### Element

The button component has no inner elements.

### Modifier

The provided modifiers are:

| Class                 | Description                                             |
| --------------------- | ------------------------------------------------------- |
| `mdc-button--dense`   | Compresses the button text to make it slightly smaller. |
| `mdc-button--raised`  | Elevates the button and creates a colored background.   |
| `mdc-button--compact` | Reduces the amount of horizontal padding in the button. |
| `mdc-button--primary` | Colors the button with the primary color.               |
| `mdc-button--accent`  | Colors the button with the accent color.                |
