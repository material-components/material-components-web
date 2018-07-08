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
| `mdc-tooltip--<DIRECTION>`     | A pure css `span` element width an direction attribute, can be: "bottom", "top", "left" or "right"     |
| `mdc-tooltip--show`            | Class to make the tooltip transition from a hidden to a visible state |

These are the default scss values, that can be overriden:

```scss
$mdc-tooltip-background: $material-color-grey-700 !default;
$mdc-tooltip-transition-length-show: 150ms !default;
$mdc-tooltip-transition-length-hide: 75ms !default;
```

## `MDCTooltip` Properties and Methods

| Property Name | Value Type | Description |
| --- | --- | --- |
| `visible` | `boolean` | `true` if the tooltip is currently displayed, `false` otherwise |
| `gap` | `number` | Gap between Tooltip and Controlling element when Tooltip is shown |
| `showDelay` | `number` | Define the delay until the Tooltip shows up in ms, default is 0ms |
| `hideDelay` | `number` | Define the delay until the Tooltip is hidden in ms, default is 1500ms |

| Method Signature | Description |
| --- | --- |
| `show()` | Displays the Tooltip |
| `hide()` | Hide the Tooltip |

Example:
```js
import {MDCTooltip} from '@material/tooltip';
const element = document.querySelector('.mdc-tooltip');
const tooltip = new MDCTooltip(element);
tooltip.show();
```

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Tooltip for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCTooltipAdapter`

The `root` element is the tooltip element e.g. `<span class='mdc-tooltip'>tooltip</span>`. The `controller` is the element the tooltip is for. The `controller` is the element the tooltip anchors to. It "controls" the tooltips positioning and display.

| Method Signature | Description |
| --- | --- |
| `addClass(className: string) => void` | Adds a class to the root element. |
| `removeClass(className: string) => void` | Removes a class from the root element. |
| `getClassList() => [className: string]` | Returns a list of all classes asigned to the root element|
| `getRootWidth() => number` | Returns the width of the root element ignoring any applied css transformation. |
| `getRootHeight() => number` | Returns the height of the root element ignoring any applied css transformation. |
| `getControllerWidth() => number` | Returns the width of the controlling element ignoring any applied css transformation. |
| `getControllerHeight() => number` | Returns the height of the controlling element ignoring any applied css transformation. |
| `getControllerOffsetTop() => number` | Returns the offsetTop property of the controlling element as in: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetTop |
| `getControllerOffsetLeft() => number` | Returns the offsetLeft property of the controlling element as in: https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetLeft |
| `setStyle(propertyName: string, value: string) => void` | Sets the style property with propertyName to value on the root element. |
| `registerListener(type: string, handler: function) => void` | Registers an eventlistener of any type to the controller element |
| `deregisterListener(type: string, handler: function) => void` | Deregisters an eventlistener of any type to the controller element