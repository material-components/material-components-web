# MDC Switch

The MDC Switch component is a spec-aligned switch component adhering to the
[Material Design Switch requirements](https://material.io/guidelines/components/selection-controls.html#selection-controls-switch).
It works without JavaScript.

## Installation

```
npm install --save @material/switch
```

## Usage

```html
<div class="mdc-switch">    
  <input type="checkbox" id="basic-switch" class="mdc-switch__native-control" />
  <div class="mdc-switch__background">
    <div class="mdc-switch__knob"></div>
  </div>
</div>
<label for="basic-switch" class="mdc-switch-label">off/on</label>
```

### Disabled
```html
<div class="mdc-switch mdc-switch--disabled">    
  <input type="checkbox" id="another-basic-switch" class="mdc-switch__native-control" disabled />
  <div class="mdc-switch__background">
    <div class="mdc-switch__knob"></div>
  </div>
</div>
<label for="another-basic-switch" class="mdc-switch-label">off/on</label>
```

## Classes

### Block

The block class is `mdc-switch`. This defines the top-level switch element.

### Modifier

The provided modifiers are:

| Class                 | Description                                  |
| ----------------------| -------------------------------------------- |
| `mdc-switch--disabled`   | Applies disabled style to disabled switches. |
