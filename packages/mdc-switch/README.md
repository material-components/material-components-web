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
     href="https://material-components.github.io/material-components-web-catalog/#/component/switch">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/switches.png" width="37" alt="Switches screenshot">
  </a>
</div>-->

Switches toggle the state of a single settings option on or off, and are mobile preferred.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-switches">Material Design guidelines: Switches</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/switch">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/switch
```

## Basic Usage

### HTML Structure

```html
<div class="mdc-switch">
  <input type="checkbox" id="basic-switch" class="mdc-switch__native-control" role="switch">
  <div class="mdc-switch__background">
    <div class="mdc-switch__knob"></div>
  </div>
</div>
<label for="basic-switch">off/on</label>
```
## Variant

### Disabled Switch

Users can add the `disabled` attribute directly to the `<input>` element or a parent `<fieldset>` element to disable a switch.

```html
<div class="mdc-switch">
  <input type="checkbox" id="another-basic-switch" class="mdc-switch__native-control" role="switch" disabled>
  <div class="mdc-switch__background">
    <div class="mdc-switch__knob"></div>
  </div>
</div>
<label for="another-basic-switch">off/on</label>
```

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-switch` | Mandatory, for the parent element.
`mdc-switch__native-control` | Mandatory, for the input checkbox.
`mdc-switch__background` | Mandatory, for the background element.
`mdc-switch__knob` | Mandatory, for the knob element.

### Sass Mixins

The following mixins apply only to _enabled_ switches in the _on_ (checked) state.
It is not currently possible to customize the color of a _disabled_ or _off_ (unchecked) switch.

Mixin | Description
--- | ---
`mdc-switch-track-color($color)` | Sets the track color.
`mdc-switch-knob-color($color)` | Sets the knob color.
`mdc-switch-focus-indicator-color($color)` | Sets the focus indicator color.
