<!--docs:
title: "Tooltip"
layout: detail
section: components
excerpt: "text that pops up to explain functionality of actions"
iconId: tooltip
path: /catalog/tooltip/
-->

# Tooltip

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/tooltip/index.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/tooltip.png" width="376" alt="Tooltip screenshot">
  </a>
</div>-->

Tooltips display informative text when users hover over, focus on, or tap an element to explain functionality of actions.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/design/components/tooltips.html">Material Design guidelines: Tooltips</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/tooltip/index.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/tooltip
```

## Basic Usage
In this example tooltips are used for fab buttons. But it can be used on any other element, too. There are two possiblities.
#### HTML structure
```html
<!-- adding the <span class="mdc-tooltip"> to an element -->
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
<span class="mdc-tooltip" for="example">My Tooltip</span>
```
#### Javascript Instantiation
```js
import {MDCTooltip} from '@material/tooltip';

const tooltip = new MDCTooltip(document.querySelector('.mdc-tooltip'));
```
#### Styles
```scss
@import "@material/tooltip/mdc-tooltip";
```

## Variants

The default behavior is to move the tooltip to the bottom. By using the CSS classes: `mdc-tooltip--left`, `mdc-tooltip--right`, `mdc-tooltip--top`, `mdc-tooltip--bottom`, this behaviour can be changed.
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

## Style Customization

#### CSS Classes

| Class                          | Description                                     |
| ------------------------------ | ----------------------------------------------- |
| `mdc-tooltip`                  | A pure css `span` element                       |
| `mdc-tooltip--<DIRECTION>`     | A pure css `span` element width an direction attribute, can be: "bottom", "top", "left" or "right"                     |

These are the default scss values, that can be overriden:

```scss
$mdc-tooltip-background: $material-color-grey-700 !default;
$mdc-tooltip-background-dark: $material-color-grey-200 !default;
$mdc-tooltip-transition-length: 150ms !default;
```

## `MDCTooltip` Properties and Methods

| Property Name | Value Type | Description |
| --- | --- | --- |
| `visible` | `boolean` | `true` if the tooltip is currently displayed, `false` otherwise |

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

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Tooltip for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCTolltipAdapter`

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