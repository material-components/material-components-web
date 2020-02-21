<!--docs:
title: "Line Ripple"
layout: detail
section: components
excerpt: "The line ripple is used to highlight user-specified input above it."
path: /catalog/input-controls/line-ripple/
-->

# Line Ripple

The line ripple is used to highlight user-specified input above it. When a line ripple is active, the line’s color and thickness changes.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-text-fields#text-fields-layout">Material Design guidelines: Text Fields Layout</a>
  </li>
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/text-field">Demo with Line Ripple on Text Field</a>
  </li>
</ul>

## Installation

```
npm install @material/line-ripple
```

## Basic Usage

### HTML Structure

```html
<span class="mdc-line-ripple"></span>
```

### Styles

```scss
@use "@material/line-ripple/mdc-line-ripple";
```

### JavaScript Instantiation

```js
import {MDCLineRipple} from '@material/line-ripple';

const lineRipple = new MDCLineRipple(document.querySelector('.mdc-line-ripple'));
```

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-line-ripple` | Mandatory.
`mdc-line-ripple--active` | Styles the line ripple as an active line ripple.
`mdc-line-ripple--deactivating` | Styles the line ripple as a deactivating line ripple.

### Sass Mixins

Mixin | Description
--- | ---
`color($color)` | Customizes the color of the line ripple when active.

## `MDCLineRipple` Properties and Methods

Method Signature | Description
--- | ---
`activate() => void` | Proxies to the foundation's `activate()` method.
`deactivate() => void` | Proxies to the foundation's `deactivate()` method.
`setRippleCenter(xCoordinate: number) => void` | Proxies to the foundation's `setRippleCenter(xCoordinate: number)` method.

## Usage Within Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Line Ripple for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCLineRippleAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element.
`removeClass(className: string) => void` | Removes a class from the root element.
`hasClass(className: string) => boolean` | Determines whether the root element has the given CSS class name.
`setStyle(propertyName: string, value: string) => void` | Sets the style property with `propertyName` to `value` on the root element.
`registerEventHandler(evtType: EventType, handler: EventListener) => void` | Registers an event listener on the root element for a given event.
`deregisterEventHandler(evtType: EventType, handler: EventListener) => void` | Deregisters an event listener on the root element for a given event.

### `MDCLineRippleFoundation`

Method Signature | Description
--- | ---
`activate() => void` | Activates the line ripple.
`deactivate() => void` |  Deactivates the line ripple.
`setRippleCenter(xCoordinate: number) => void` | Sets the center of the ripple to the `xCoordinate` given.
`handleTransitionEnd(evt: Event) => void` | Handles a `transitionend` event.
