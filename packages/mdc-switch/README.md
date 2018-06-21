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

Switches toggle the state of a single setting on or off. They are the preferred way to adjust settings on mobile.

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
  <div class="mdc-switch__track"></div>
  <div class="mdc-switch__thumb-underlay">
    <div class="mdc-switch__thumb">
        <input type="checkbox" id="basic-switch" class="mdc-switch__native-control" role="switch">
    </div>
  </div>
</div>
<label for="basic-switch">off/on</label>
```
## Variant

### Disabled Switch

Users can add the class 'mdc-switch--disabled' to the 'mdc-switch' element to disable the switch.

```html
<div class="mdc-switch mdc-switch--disabled">
  <div class="mdc-switch__track"></div>
  <div class="mdc-switch__thumb-underlay">
    <div class="mdc-switch__thumb">
        <input type="checkbox" id="another-basic-switch" class="mdc-switch__native-control" role="switch">
    </div>
  </div>
</div>
<label for="another-basic-switch">off/on</label>
```

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-switch` | Mandatory, for the parent element.
`mdc-switch__track` | Mandatory, for the track element.
`mdc-switch__thumb-underlay` | Mandatory, for the ripple effect.
`mdc-switch__thumb` | Mandatory, for the thumb element.
`mdc-switch__native-control` | Mandatory, for the input checkbox.

### Sass Mixins

The following mixins apply only to _enabled_ switches.
It is not currently possible to customize the color of a _disabled_ switch.

Mixin | Description
--- | ---
`mdc-switch-toggled-on-track-color($color)` | Sets color of the track when the switch is toggled on.
`mdc-switch-toggled-off-track-color($color)` | Sets color of the track when the switch is toggled off.
`mdc-switch-toggled-on-thumb-color($color)` | Sets color of the thumb when the switch is toggled on.
`mdc-switch-toggled-off-thumb-color($color)` | Sets color of the thumb when the switch is toggled off.
`mdc-switch-toggled-on-ripple-color($color)` | Sets the color of the ripple surrounding the thumb when the switch is toggled on.
`mdc-switch-toggled-off-ripple-color($color)` | Sets the color of the ripple surrounding the thumb when the switch is toggled off.