<!--docs:
title: "Touch Target"
layout: detail
section: components
excerpt: "Increased touch targets for components"
path: /catalog/touchtarget/
-->

# Touch Target

Touch targets are the parts of the screen that respond to user input. They extend beyond the visual bounds of an element.
For example, a button may appear to be 48 x 36 px, but the padding surrounding it comprises the full 48 x 48 px touch target.

Material Design spec states that touch targets should be at least 48 x 48 px.
The MDC Web library provides mixins and guidance on adding an increased touch target for the following components:
* Button
* Chips
* Checkbox
* Radio
* Mini FAB

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/design/usability/accessibility.html#layout-typography">Material Design guidelines: Touch Targets</a>
  </li>
</ul>

## Installation

```
npm install @material/touchtarget
```

## Basic Usage

### HTML Structure

For a given button component:

<button class="mdc-button">
  <div class="mdc-button__ripple">
  <span class="mdc-button__label">My Inaccessible Button</span>
</button>

You would add an increased touch target as follows:

<div class="mdc-touch-target-wrapper">
  <button class="mdc-button mdc-button--touch">
    <div class="mdc-button__ripple">
    <span class="mdc-button__label">My Inaccessible Button</span>
    <div class="mdc-button__touch"></div>
  </button>
</div>

Note that the `mdc-touch-target-wrapper` element is only necessary if you want to avoid potentially overlapping touch targets on adjacent elements (due to collapsing margins).

### Styles

```css
@import "@material/touch-target/mdc-touch-target";
```

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-touch-target-wrapper` | Class on the component touch target wrapper element.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-touch-target` | Applied to the inner touch target element.
`mdc-touch-target-component` | Applied to the component root element. Adds margin to compensate for the increased touch target.
`mdc-touch-target-wrapper` | Applied to the component wrapper, if applicable.
