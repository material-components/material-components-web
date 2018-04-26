<!--docs:
title: "Radio Buttons"
layout: detail
section: components
iconId: radio_button
path: /catalog/input-controls/radio-buttons/
-->

# Radio Buttons

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/radio.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/radios.png" width="60" alt="Radio buttons screenshot">
  </a>
</div>-->

Radio buttons allow the user to select one option from a set while seeing all available options.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/selection-controls.html#selection-controls-radio-button">Material Design guidelines: Selection Controls – Radio buttons</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/radio.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/radio
```

## Basic Usage

### HTML Structure

```html
<div class="mdc-radio">
  <input class="mdc-radio__native-control" type="radio" id="radio-1" name="radios" checked>
  <div class="mdc-radio__background">
    <div class="mdc-radio__outer-circle"></div>
    <div class="mdc-radio__inner-circle"></div>
  </div>
</div>
<label for="radio-1">Radio 1</label>
```

### Styles

```scss
@import "@material/radio/mdc-radio";
```

### JavaScript Instantiation

The radio button will work without JavaScript, but you can enhance it with a ripple interaction effect by instantiating `MDCRadio` on the root element.

```js
import {MDCRadio} from '@material/radio';

const radio = new MDCRadio(document.querySelector('.mdc-radio'));
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

## Variants

### Disabled 

To disable a radio button, add the `mdc-radio--disabled` class to the root element and set the `disabled` attribute on the `<input>` element.
Disabled radio buttons cannot be interacted with and have no visual interaction effect.

```html
<div class="mdc-radio mdc-radio--disabled">
  <input class="mdc-radio__native-control" type="radio" id="radio-1" name="radios" disabled>
  <div class="mdc-radio__background">
    <div class="mdc-radio__outer-circle"></div>
    <div class="mdc-radio__inner-circle"></div>
  </div>
</div>
<label for="radio-1">Radio 1</label>
```

## Style Customization

MDC Radio uses [MDC Theme](mdc-theme)'s `secondary` color by default. Use the following mixins to customize it.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-radio-unchecked-stroke-color($color)` | Sets the stroke color of an unchecked radio button
`mdc-radio-checked-stroke-color($color)` | Sets the stroke color of a checked radio button
`mdc-radio-ink-color($color)` | Sets the ink color of a radio button
`mdc-radio-focus-indicator-color($color)` | Sets the color of the focus indicator

#### Caveat: Edge and CSS Custom Properties

In browsers that fully support CSS custom properties, the above mixins will work if you pass in a [MDC Theme](mdc-theme) property (e.g. `primary`) as an argument. However, Edge does not fully support CSS custom properties. If you are using any of the Sass mixins, you must pass in an actual color value for support in Edge.

## `MDCRadio` Properties and Methods

Property | Value Type | Description
--- | --- | ---
`checked` | Boolean | Proxies to the foundation's `isChecked`/`setChecked` methods
`disabled` | Boolean | Proxies to the foundation's `isDisabled/setDisabled` methods
`value` | String | Proxies to the foundation's `getValue/setValue` methods

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Radio button for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCRadioAdapter`

| Method Signature | Description |
| --- | --- |
| `getNativeControl() => HTMLInputElement?` | Returns the native radio control |
| `addClass(className: string) => void` | Adds a class to the root element |
| `removeClass(className: string) => void` | Removes a class from the root element |

### `MDCRadioFoundation`

| Method Signature | Description |
| --- | --- |
| `isChecked() => boolean` | Returns whether the native control is checked, or `false` if there's no native control |
| `setChecked(checked: boolean) => void` | Sets the checked value of the native control |
| `isDisabled() => boolean` | Returns whether the native control is disabled, or `false` if there's no native control |
| `setDisabled(disabled: boolean) => void` | Sets the disabled value of the native control |
| `getValue() => boolean` | Returns the value of the native control, or `null` if there's no native control |
| `setDisabled(disabled: boolean) => void` | Sets the value of the native control |
