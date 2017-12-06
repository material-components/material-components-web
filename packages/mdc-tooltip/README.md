<!--docs:
title: "Tooltips"
layout: detail
section: components
iconId: tooltip
path: /catalog/tooltips
-->

# Tooltips

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/tooltip.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/tooltip.png" width="376" alt="Tooltip screenshot">
  </a>
</div>-->

MDC Tooltip provides the user with short descriptions that appear on hover, focus and touch of the controller element.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.google.com/components/tooltips.html">Material Design guidelines: Tooltips</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/tooltip.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install --save @material/tooltip
```

## Usage

```html
<button class="mdc-fab material-icons" aria-label="Favorite">
  <span class="mdc-fab__icon">
    arrow_downward
  </span>
  <span class="mdc-tooltip">My Tooltip</span>
</button>

<!-- or by using the 'for' attribute -->

<button id="example" class="mdc-fab material-icons" aria-label="Favorite">
  <span class="mdc-fab__icon">
    arrow_downward
  </span>
</button>
<span class="mdc-tooltip" for"example">My Tooltip</span>
```

Then with JS

```js
import {MDCTooltip} from '@material/tooltip';

const tooltip = new MDCTooltip(document.querySelector('.mdc-tooltip'));
```


#### Move to different directions
The default behavior is to move the tooltip to the bottom. By using the CSS classes: `mdc-tooltip--left`, `mdc-tooltip--right`, `mdc-tooltip-top`, `mdc-tooltip-bottom`, this behaviour can be changed.
>Note: Always the last added class will determine in which direction the tooltip is showing

```html
<!-- Show tooltip to the top -->
<button class="mdc-fab material-icons" aria-label="Favorite">
  <span class="mdc-fab__icon">
    arrow_upward
  </span>
  <span class="mdc-tooltip--top">My Tooltip</span>
</button>
```

#### Style the tooltips

These are the default scss values, that can be overriden:

```scss
$mdc-tooltip-background: $material-color-grey-700 !default;
// used for mdc-theme--dark, color will change to black
$mdc-tooltip-background-dark: $material-color-grey-200 !default;
$mdc-tooltip-transition-length: 150ms !default;
```

#### Including in code

##### ES2015

```javascript
import {MDCTooltip, MDCTooltipFoundation} from '@material/tooltip';
```

##### CommonJS

```javascript
const mdcTooltip = require('mdc-tooltip');
const MDCTooltip = mdcTooltip.MDCTooltip;
const MDCTooltipFoundation = mdcTooltip.MDCTooltipFoundation;
```

##### AMD

```javascript
require(['path/to/mdc-tooltip'], mdcTooltip => {
  const MDCTooltip = mdcTooltip.MDCTooltip;
  const MDCTooltipFoundation = mdcTooltip.MDCTooltipFoundation;
});
```

##### Global

```javascript
const MDCTooltip = mdc.tooltip.MDCTooltip;
const MDCTooltipFoundation = mdc.tooltip.MDCTooltipFoundation;
```

#### Classes

| Class                          | Description                                     |
| ------------------------------ | ----------------------------------------------- |
| `mdc-tooltip`                  | A pure css `span` element                       |
| `mdc-tooltip--<DIRECTION>`     | A pure css `span` element width an direction attribute, can be: "bottom", "top", "left" or "right"                     |

### MDC Tooltip Component API

#### Properties
| Property Name | Type | Description |
| --- | --- | --- |
| `visible` | `boolean` | `true` if the tooltip is currently displayed, `false` otherwise |

#### Methods

| Method Signature | Description |
| --- | --- |
| `show()` | Displays the Tooltip |
| `hide()` | Hide the Tooltip |
| `reset()` | Hide and recenter the tooltip. This should be called if after initialization the position of the tooltip is updated

Example:
```js
import {MDCTooltip} from '@material/tooltip';
let element = document.querySelector('.mdc-tooltip');
const tooltip = new MDCTooltip(element);
tooltip.show();
```


## Using the foundation class

MDC Tooltips ships with a foundation class that framework authors can use to integrate MDC Tooltip into their custom components.

### Adapter API

The `root` element is the tooltip element e.g. `<span class='mdc-tooltip'>tooltip</span>`. The `controller` is the element the tooltip is for. Therefore it "controls" the tooltip when and where the tooltips should display and hide.

| Method Signature | Description |
| --- | --- |
| `addClass(className: string) => void` | Adds a class to the root element. |
| `removeClass(className: string) => void` | Removes a class from the root element. |
| `getClassList() => [className: string]` | Returns a list of all classes asigned to the root element|
| `computeBoundingRect() => {height: number, width: number}` | Returns the height and with of the root element |
| `computeControllerBoundingRect() => {offsetTop: number, offsetLeft: number, width: number, height: number}` | Returns the height and with of the controller element as well as the offsetTop and offsetLeft property: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetTop |
| `setStyle(propertyName: string, value: string) => void` | Sets a dasherized css property propertyName to the value value on the surface element. We achieve this via root.style.setProperty(propertyName, value) |
| `registerListener(type: string, handler: function) => void` | Registers an eventlistener of any type to the controller element |
| `deregisterListener(type: string, handler: function) => void` | Deregisters an eventlistener of any type to the controller element |
| `registerWindowListener(type: string, handler: function) => void` | Registers an eventlistener of any type to the window element |
| `deregisterWindowListener(type: string, handler: function) => void` | Deregisters an eventlistener of any type to the window element |
| `registerTransitionEndHandler(handler: EventListener) => void` | Registers an event handler to be called when a `transitionend` event is triggered on the root element |
| `deregisterTransitionEndHandler(handler: EventListener) => void` | Deregisters an event handler from a `transitionend` event listener on the root element. |


## Theming

The MDC Tooltips are fully dark theme aware by displaying tooltips with bright background and black font color. While in default theming a dark background with white color is used.
