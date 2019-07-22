<!--docs:
title: "Linear Progress"
layout: detail
section: components
excerpt: "Material Design-styled linear progress indicators."
iconId: progress_linear
path: /catalog/linear-progress/
-->

# Linear Progress

<!--<div class="article__asset">
  <a class="article__asset-link"
      href="https://material-components.github.io/material-components-web-catalog/#/component/linear-progress-indicator">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/linear-progress.png" width="586" alt="Linear progress screenshot">
  </a>
</div>-->

The MDC Linear Progress component is a spec-aligned linear progress indicator component adhering to the
[Material Design progress & activity requirements](https://material.io/go/design-progress-indicators).

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-progress-indicators">Guidelines</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/linear-progress-indicator">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/linear-progress
```

## Basic Usage

### HTML Structure
```html
<div role="progressbar" class="mdc-linear-progress">
  <div class="mdc-linear-progress__buffering-dots"></div>
  <div class="mdc-linear-progress__buffer"></div>
  <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
    <span class="mdc-linear-progress__bar-inner"></span>
  </div>
  <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
    <span class="mdc-linear-progress__bar-inner"></span>
  </div>
</div>
```

### Styles
```scss
@import "@material/linear-progress/mdc-linear-progress";
```

### JavaScript Instantiation

```js
import { MDCLinearProgress } from '@material/linear-progress';

const linearProgress = new MDCLinearProgress(document.querySelector('.mdc-linear-progress'));
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

### CSS Modifiers

The provided modifiers are:

| Class                 | Description                                             |
| --------------------- | ------------------------------------------------------- |
| `mdc-linear-progress--indeterminate`   | Puts the linear progress indicator in an indeterminate state. |
| `mdc-linear-progress--reversed`  | Reverses the direction of the linear progress indicator.   |
| `mdc-linear-progress--closed`  | Hides the linear progress indicator. |

### Sass Mixins

Mixin | Description
--- | ---
`mdc-linear-progress-bar-color($color)` | Sets the color of the progress bar
`mdc-linear-progress-buffer-color($color)` | Sets the color of the buffer bar and dots

<!-- docgen-tsdoc-replacer:start __DO NOT EDIT, This section is automatically generated__ -->
### MDCLinearProgress
#### Methods

Signature | Description
--- | ---
`close() => void` | Puts the component in the closed state.
`emit(evtType: string, evtData: T, shouldBubble?: boolean) => void` | Fires a cross-browser-compatible custom event from the component root of the given type, with the given data.
`listen(evtType: K, handler: SpecificEventListener<K>, options?: AddEventListenerOptions | boolean) => void` | Wrapper method to add an event listener to the component's root element. This is most useful when listening for custom events.
`open() => void` | Puts the component in the open state.
`unlisten(evtType: K, handler: SpecificEventListener<K>, options?: AddEventListenerOptions | boolean) => void` | Wrapper method to remove an event listener to the component's root element. This is most useful when unlistening for custom events.

#### Properties

Name | Type | Description
--- | --- | ---
buffer | `number` | Sets the buffer bar to this value. Value should be between [0, 1].
determinate | `boolean` | Toggles the component between the determinate and indeterminate state.
progress | `number` | Sets the progress bar to this value. Value should be between [0, 1].
reverse | `boolean` | Reverses the direction of the linear progress indicator.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create this component for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### MDCLinearProgressAdapter
#### Methods

Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element.
`getBuffer() => HTMLElement | null` | Returns the buffer element.
`getPrimaryBar() => HTMLElement | null` | Returns the primary bar element.
`hasClass(className: string) => boolean` | Returns boolean indicating whether the root element has a given class.
`removeClass(className: string) => void` | Removes a class from the root element.
`setStyle(el: HTMLElement, styleProperty: string, value: string) => void` | Sets the inline style on the given element.

### MDCLinearProgressFoundation
#### Methods

Signature | Description
--- | ---
`close() => void` | Puts the component in the closed state.
`open() => void` | Puts the component in the open state.
`setBuffer(value: number) => void` | Sets the buffer bar to this value.
`setDeterminate(isDeterminate: boolean) => void` | Toggles the component between the determinate and indeterminate state.
`setProgress(value: number) => void` | Sets the progress bar to this value.
`setReverse(isReversed: boolean) => void` | Reverses the direction of the linear progress indicator.


<!-- docgen-tsdoc-replacer:end -->
