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
<div role="progressbar" class="mdc-linear-progress" aria-label="Example Progress Bar" aria-valuemin="0" aria-valuemax="1" aria-valuenow="0">
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

### Accessibility

Progress bars conform to the [WAI-ARIA Progressbar Specification](https://www.w3.org/TR/wai-aria/#progressbar). The supported ARIA attributes for this progress bar are:

| Attribute | Description |
| --------- | ----------- |
| `aria-label` | Label indicating how the progress bar should be announced to the user. |
| `aria-valuemin` | The minimum numeric value of the progress bar, which should always be `0`. |
| `aria-valuemax` | The maximum numeric value of the progress bar, which should always be `1`. |
| `aria-valuenow` | A numeric value between `aria-valuemin` and `aria-valuemax` indicating the progress value of the primary progress bar. This attribute is removed in indeterminate progress bars. |

Note that `aria-label`, `aria-valuemin`, and `aria-valuemax` are static and must be configured in the HTML. `aria-valuenow` is updated dynamically by the foundation when the progress value is updated in determinate progress bars.

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

### Using the Foundation Class

MDC Linear Progress ships with an `MDCLinearProgressFoundation` class that external frameworks and libraries can
use to integrate the component. As with all foundation classes, an adapter object must be provided.
The adapter for linear progress must provide the following functions, with correct signatures:

| Method Signature | Description |
| --- | --- |
| `addClass(className: string) => void` | Adds a class to the root element. |
| `removeAttribute(attributeName: string) => void` | Removes the specified attribute from the root element. |
| `removeClass(className: string) => void` | Removes a class from the root element. |
| `hasClass(className: string) => boolean` | Returns boolean indicating whether the root element has a given class. |
| `forceLayout() => void` | Force-trigger a layout on the root element. This is needed to restart animations correctly. |
| `getPrimaryBar() => Element` | Returns the primary bar element. |
| `getBuffer() => Element` | Returns the buffer element. |
| `setAttribute(attributeName: string, value: string) => void` | Sets the specified attribute on the root element. |
| `setStyle(el: Element, styleProperty: string, value: string) => void` | Sets the inline style on the given element. |

### MDCLinearProgressFoundation API

MDC Linear Progress Foundation exposes the following methods:

| Method Signature | Description |
| --- | --- |
| `setDeterminate(value: boolean) => void` | Toggles the component between the determinate and indeterminate state. |
| `setProgress(value: number) => void` | Sets the progress bar to this value. Value should be between [0, 1]. |
| `setBuffer(value: number) => void` | Sets the buffer bar to this value. Value should be between [0, 1]. |
| `setReverse(value: boolean) => void` | Reverses the direction of the linear progress indicator. |
| `open() => void` | Puts the component in the open state. |
| `close() => void` | Puts the component in the closed state. |

### MDCLinearProgress API

MDC Linear Progress exposes the following methods:

| Method Signature | Description |
| --- | --- |
| `set determinate(value: boolean) => void` | Toggles the component between the determinate and indeterminate state. |
| `set progress(value: number) => void` | Sets the progress bar to this value. Value should be between [0, 1]. |
| `set buffer(value: number) => void` | Sets the buffer bar to this value. Value should be between [0, 1]. |
| `set reverse(value: boolean) => void` | Reverses the direction of the linear progress indicator. |
| `open() => void` | Puts the component in the open state. |
| `close() => void` | Puts the component in the closed state. |
