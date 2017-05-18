<!--docs:
title: "Animation"
layout: detail
section: components
excerpt: "Animation timing curves and utilities for smooth and consistent motion."
iconId: animation
path: /catalog/animation/
-->

# Animation

MDC Animation is a Sass / CSS / JavaScript library which provides a toolbelt for Material Design animation, based off of the [motion guidelines](https://material.io/guidelines/motion/duration-easing.html#duration-easing-common-durations). Currently, it only covers easing curves.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/motion/duration-easing.html">Material Design guidelines: Duration & easing</a>
  </li>
</ul>

## Installation

```
npm install --save @material/animation
```

## Usage

We currently have variables for the following 3 animation curves:

| Variable name | timing function | use case |
| --- | --- | --- |
| `$mdc-animation-fast-out-slow-in-timing-function` | `cubic-bezier(.4, 0, .2, 1)` | Standard curve; any animations that are visible from start to finish (e.g. a FAB transforming into a toolbar) |
| `$mdc-animation-linear-out-slow-in-timing-function` | `cubic-bezier(0, 0, .2, 1)` | Animations that cause objects to enter the screen (e.g. a fade in) |
| `$mdc-animation-fast-out-linear-in-timing-function` | `cubic-bezier(.4, 0, ``, 1)` | Animations that cause objects to leave the screen (e.g. a fade out) |

### SCSS

Simply drop `mdc-animation` into your build and start using the variables:

```scss
.mdc-thing--animating {
  animation: foo 175ms $mdc-animation-fast-out-slow-in-timing-function;
}
```

or the mixins, which simply assign their corresponding variables to the `animation-timing-function`
property:

```scss
.mdc-thing--on-screen {
  @include mdc-animation-fast-out-linear-in;
}
```

Every mixin has the same name as its corresponding variable, without the `-timing-function` suffix.

MDC Animation also provides helper functions for defining transitions for when something enters and exits the frame. A
very common example of this is something that fades in and then fades out using opacity.

```scss
@import "@material/animation/functions";

.mdc-thing {
  transition: mdc-animation-exit(/* $name: */ opacity, /* $duration: */ 175ms, /* $delay: */ 150ms);
  opacity: 0;
  will-change: opacity;

  &:active {
    transition: mdc-animation-enter(opacity, 175ms /*, $delay: 0ms by default */);
    opacity: 1;
  }
}
```

Note that these functions also work with the `animation` property.

```scss
@import "@material/animation/functions";

@keyframes fade-in {
  from {
    transform: translateY(-80px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.mdc-thing {
  animation: mdc-animation-enter(fade-in, 350ms);
}
```

### CSS Classes

> NOTE: dist/ will be available when installing via NPM.

Alternatively, you can include the built stylesheet and use the classes it exports within your HTML

```html
<link href="path/to/mdc-animation/dist/mdc-animation.css" rel="stylesheet">
<!-- ... -->
<div id="my-animating-div" class="mdc-animation-fast-out-slow-in">hi</div>
```

CSS Classes have the exact same name as their mixin counterparts.

### Overriding the default curves.

All animation variables are marked with `!default`, thus they can be overridden should the need
arise.

### JavaScript

MDC Web ships with a set of utility functions designed to make animations easier to implement.

### Using Utility Functions

To use:
```js
import {getCorrectEventName} from '@material/animation';

const eventToListenFor = getCorrectEventName(window, 'animationstart');
```

| Method Signature | Description |
| --- | --- |
| `getCorrectEventName(windowObj: Object, eventType: string)` | Returns a JavaScript event name. Prefixed if necessary. |
| `getCorrectPropertyName(windowObj: Object, eventType: string)` | Returns a CSS property name. Prefixed if necessary. |
