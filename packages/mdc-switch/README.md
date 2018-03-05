<!--docs:
title: "Switches"
layout: detail
section: components
iconId: switch
path: /catalog/input-controls/switches/
-->

# Switches

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/switch.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/switches.png" width="37" alt="Switches screenshot">
  </a>
</div>-->

The MDC Switch component is a spec-aligned switch component adhering to the
[Material Design Switch requirements](https://material.io/guidelines/components/selection-controls.html#selection-controls-switch).
It works without JavaScript.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/selection-controls.html#selection-controls-switch">Material Design guidelines: Switches</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/switch.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install --save @material/switch
```

## Usage

### HTML Structure

```html
<div class="mdc-switch">
  <input type="checkbox" id="basic-switch" class="mdc-switch__native-control" />
  <div class="mdc-switch__background">
    <div class="mdc-switch__knob"></div>
  </div>
</div>
<label for="basic-switch">off/on</label>
```

#### Disabled Switch

Users can add `disabled` directly to the input element or set the fieldset containing the switch to `disabled` to disable a switch. Disabled switches cannot be interacted with and have no visual interaction effect.

```html
<div class="mdc-switch">
  <input type="checkbox" id="another-basic-switch" class="mdc-switch__native-control" disabled />
  <div class="mdc-switch__background">
    <div class="mdc-switch__knob"></div>
  </div>
</div>
<label for="another-basic-switch">off/on</label>
```

### CSS Classes

CSS Class | Description
--- | ---
`mdc-switch` | Mandatory, for the parent element
`mdc-switch__native-control` | Mandatory, for the input checkbox
`mdc-switch__background` | Mandatory, for the background element
`mdc-switch__knob` | Mandatory, for the knob element

### Sass Mixins

The following mixins apply only to _enabled_ switches in the _on_ (checked) state.
It is not currently possible to customize the color of a _disabled_ or _off_ (unchecked) switch.

Mixin | Description
--- | ---
`mdc-switch-track-color($color)` | Sets the track color
`mdc-switch-knob-color($color)` | Sets the knob color
`mdc-switch-focus-indicator-color($color)` | Sets the focus indicator color
