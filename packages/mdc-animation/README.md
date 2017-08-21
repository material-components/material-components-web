<!--docs:
title: "Animation"
layout: detail
section: components
excerpt: "Animation timing curves and utilities for smooth and consistent motion."
iconId: animation
path: /catalog/animation/
-->

# Animation

Material in motion is responsive and natural. Use these easing curves and duration patterns to create smooth and consistent motion.

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

### CSS Classes

Some components already use a set curve for their animation. For example, MDC Checkbox uses deceleration curve for its checkmark animation.

If you want to animate an element that is not a Material Design component, you can apply the following CSS classes.

CSS Class | Description
--- | ---
`mdc-animation-deceleration-curve` | Sets the `animation-timing-function` to deceleration curve
`mdc-animation-standard-curve` | Sets the `animation-timing-function` to standard curve, a.k.a quickly accelerate and slowly decelerate
`mdc-animation-acceleration-curve` | Sets the `animation-timing-function` to acceleration curve
`mdc-animation-sharp-curve` | Sets the `animation-timing-function` to sharp curve, a.k.a quickly accelerate and decelerate

### Sass Variables and Mixins

Instead of setting CSS classes on elements, you can use the Sass mixins to achieve the same goal.

```scss
@import "@material/animation/mixins";

.my-element--animating {
  @include mdc-animation-acceleration-curve;
}
```

Mixin | Description
--- | ---
`mdc-animation-deceleration-curve` | Sets the `animation-timing-function` to deceleration curve
`mdc-animation-standard-curve` | Sets the `animation-timing-function` to standard curve, a.k.a quickly accelerate and slowly decelerate
`mdc-animation-acceleration-curve` | Sets the `animation-timing-function` to acceleration curve
`mdc-animation-sharp-curve` | Sets the `animation-timing-function` to sharp curve, a.k.a quickly accelerate and decelerate

We also provide the timing functions used by these mixins, which you can use with the `animation` or `transition` CSS properties

```scss
@import "@material/animation/variables";

.my-element--animating {
  animation: foo-keyframe 175ms $mdc-animation-standard-curve-timing-function;
}
```

Variable | Description
--- | ---
`mdc-animation-deceleration-curve-timing-function` | Timing function to decelerate
`mdc-animation-standard-curve-timing-function` | Timing function to quickly accelerate and slowly decelerate
`mdc-animation-acceleration-curve-timing-function` | Timing function to accelerate
`mdc-animation-sharp-curve-timing-function` | Timing function to quickly accelerate and decelerate

The following functions create transitions given `$name` and the `$duration`. You can also specify `$delay`, but the default is 0ms. `$name` can either refer to the keyframe, or to CSS property used in `transition`.

```scss
@import "@material/animation/functions";

.my-element {
  transition: mdc-animation-exit-permanent(/* $name: */ opacity, /* $duration: */ 175ms, /* $delay: */ 150ms);
  opacity: 0;
  will-change: opacity;

  &--animating {
    transition: mdc-animation-enter(/* $name: */ opacity, /* $duration: */ 175ms);
    opacity: 1;
  }
}
```


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

.my-element {
  animation: mdc-animation-enter(/* $name: */ fade-in, /* $duration: */ 350ms);
}
```

Function | Description
--- | ---
`mdc-animation-enter($name, $duration, $delay)` | Defines transition for entering the frame
`mdc-animation-exit-permanent($name, $duration, $delay)` | Defines transition for exiting the frame permanently
`mdc-animation-exit-temporary($name, $duration, $delay)` | Defines transition for exiting the frame temporarily

### JavaScript

These functions handle prefixing across various browsers

```js
import {getCorrectEventName} from '@material/animation';

const eventToListenFor = getCorrectEventName(window, 'animationstart');
```

Method Signature | Description
--- | ---
`getCorrectEventName(windowObj, eventType)` | Returns a JavaScript event name, prefixed if necessary
`getCorrectPropertyName(windowObj, eventType)` | Returns a CSS property name, prefixed if necessary
