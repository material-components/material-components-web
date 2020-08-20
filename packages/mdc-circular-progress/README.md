<!--docs:
title: "Circular Progress"
layout: detail
section: components
excerpt: "Material Design-styled circular progress indicators."
iconId: progress_activity
path: /catalog/circular-progress/
-->

# Circular Progress

The MDC Circular Progress component is a spec-aligned circular progress indicator component adhering to the
[Material Design progress & activity requirements](https://material.io/go/design-progress-indicators).

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-progress-indicators">Guidelines</a>
  </li>
</ul>

## Installation

```
npm install @material/circular-progress
```

## Basic Usage

### HTML Structure

```html
<div class="mdc-circular-progress" style="width:48px;height:48px;" role="progressbar" aria-label="Example Progress Bar" aria-valuemin="0" aria-valuemax="1">
  <div class="mdc-circular-progress__determinate-container">
    <svg class="mdc-circular-progress__determinate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <circle class="mdc-circular-progress__determinate-track" cx="24" cy="24" r="18" stroke-width="4"/>
      <circle class="mdc-circular-progress__determinate-circle" cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="113.097" stroke-width="4"/>
    </svg>
  </div>
  <div class="mdc-circular-progress__indeterminate-container">
    <div class="mdc-circular-progress__spinner-layer">
      <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
        <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="4"/>
        </svg>
      </div><div class="mdc-circular-progress__gap-patch">
        <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="3.2"/>
        </svg>
      </div><div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
        <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="4"/>
        </svg>
      </div>
    </div>
  </div>
</div>
```
> _IMPORTANT_: Do not introduce space between the adjacent `</div><div>` tags above. Doing so will produce unwanted visual artifacts.

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
@use "@material/circular-progress/mdc-circular-progress";
```

### JavaScript Instantiation

```js
import { MDCCircularProgress } from '@material/circular-progress';

const circularProgress = new MDCCircularProgress(document.querySelector('.mdc-circular-progress'));
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

## Variants

### Sizing

To set the stroke-width and container size strictly to one of three sizes defined by guidelines, replace each SVG of the baseline element with the following and apply the appropriate `mdc-circular-progress--{size}` modifier class (see [CSS Classes](#CSS-Classes) section).

#### Large (48px)
See [baseline template](#HTML-Structure) above.

#### Medium (36px)
```html
<div class="mdc-circular-progress" style="width:36px;height:36px;" role="progressbar" aria-label="Example Progress Bar" aria-valuemin="0" aria-valuemax="1">
  <div class="mdc-circular-progress__determinate-container">
    <svg class="mdc-circular-progress__determinate-circle-graphic" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
      <circle class="mdc-circular-progress__determinate-track" cx="16" cy="16" r="12.5" stroke-width="3"/>
      <circle class="mdc-circular-progress__determinate-circle" cx="16" cy="16" r="12.5" stroke-dasharray="78.54" stroke-dashoffset="78.54" stroke-width="3"/>
    </svg>
  </div>
  <div class="mdc-circular-progress__indeterminate-container">
    <div class="mdc-circular-progress__spinner-layer">
      <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
        <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12.5" stroke-dasharray="78.54" stroke-dashoffset="39.27" stroke-width="3"/>
        </svg>
      </div><div class="mdc-circular-progress__gap-patch">
        <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12.5" stroke-dasharray="78.54" stroke-dashoffset="39.27" stroke-width="2.4"/>
        </svg>
      </div><div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
        <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
          <circle cx="16" cy="16" r="12.5" stroke-dasharray="78.54" stroke-dashoffset="39.27" stroke-width="3"/>
        </svg>
      </div>
    </div>
  </div>
</div>
```

#### Small (24px)
```html
<div class="mdc-circular-progress" style="width:24px;height:24px;" role="progressbar" aria-label="Example Progress Bar" aria-valuemin="0" aria-valuemax="1">
  <div class="mdc-circular-progress__determinate-container">
    <svg class="mdc-circular-progress__determinate-circle-graphic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <circle class="mdc-circular-progress__determinate-track" cx="12" cy="12" r="8.75" stroke-width="2.5"/>
      <circle class="mdc-circular-progress__determinate-circle" cx="12" cy="12" r="8.75" stroke-dasharray="54.978" stroke-dashoffset="54.978" stroke-width="2.5"/>
    </svg>
  </div>
  <div class="mdc-circular-progress__indeterminate-container">
    <div class="mdc-circular-progress__spinner-layer">
      <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
        <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="8.75" stroke-dasharray="54.978" stroke-dashoffset="27.489" stroke-width="2.5"/>
        </svg>
      </div><div class="mdc-circular-progress__gap-patch">
        <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="8.75" stroke-dasharray="54.978" stroke-dashoffset="27.489" stroke-width="2"/>
        </svg>
      </div><div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
        <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <circle cx="12" cy="12" r="8.75" stroke-dasharray="54.978" stroke-dashoffset="27.489" stroke-width="2.5"/>
        </svg>
      </div>
    </div>
  </div>
</div>
```
### Four-Colored

You may choose to have the indicator in inderminate state animate through 4 colors. The template for the four-colored indicator is like that of the [baseline](#HTML-Structure), except the spinner layer is replicated 4 times, 1 for each color. See [Sass-Mixins](#Sass-Mixins) for how to customize the four colors.
This is done instead of animating the color property to reduce browser repaints.

```html
<div class="mdc-circular-progress" style="width:48px;height:48px;" role="progressbar" aria-label="Example Progress Bar" aria-valuemin="0" aria-valuemax="1">
  <div class="mdc-circular-progress__determinate-container">
    <svg class="mdc-circular-progress__determinate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
      <circle class="mdc-circular-progress__determinate-track" cx="24" cy="24" r="18" stroke-width="4"/>
      <circle class="mdc-circular-progress__determinate-circle" cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="113.097" stroke-width="4"/>
    </svg>
  </div>
  <div class="mdc-circular-progress__indeterminate-container">
    <div class="mdc-circular-progress__spinner-layer mdc-circular-progress__color-1">
      <div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-left">
        <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="4"/>
        </svg>
      </div><div class="mdc-circular-progress__gap-patch">
        <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="3.8"/>
        </svg>
      </div><div class="mdc-circular-progress__circle-clipper mdc-circular-progress__circle-right">
        <svg class="mdc-circular-progress__indeterminate-circle-graphic" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <circle cx="24" cy="24" r="18" stroke-dasharray="113.097" stroke-dashoffset="56.549" stroke-width="4"/>
        </svg>
      </div>
    </div>

    <div class="mdc-circular-progress__spinner-layer mdc-circular-progress__color-2">
      <!-- Same as above -->
    </div>

    <div class="mdc-circular-progress__spinner-layer mdc-circular-progress__color-3">
      <!-- Same as above -->
    </div>

    <div class="mdc-circular-progress__spinner-layer mdc-circular-progress__color-4">
      <!-- Same as above -->
    </div>
  </div>
</div>
```

## Style Customization

### CSS Classes

CSS Class | Description
--------- | -------------
`mdc-circular-progress` | Mandatory.  The root element.
`mdc-circular-progress--indeterminate`   | Optional. Puts the circular progress indicator in an indeterminate state. |
`mdc-circular-progress--closed`  | Optional. Hides the circular progress indicator. |
`mdc-circular-progress__determinate-container` | Mandatory.  Contains the determinate progress indicator.
`mdc-circular-progress__indeterminate-container` | Mandatory.  Contains the indeterminate progress indicator.
`mdc-circular-progress__determinate-circle-graphic` | Mandatory. The determinate SVG.
`mdc-circular-progress__determinate-track` | Mandatory.  The determinate SVG track.
`mdc-circular-progress__determinate-circle` | Mandatory.  The determinate SVG circle.
`mdc-circular-progress__spinner-layer` | Mandatory.  Another wrapper around the indeterminate indicator.
`mdc-circular-progress__indeterminate-circle-graphic` | Mandatory.  An indeterminate SVG (there are three of these in total).
`mdc-circular-progress__circle-clipper` | Mandatory.  Clips an indeterminate SVG circle so that only a section of it is visible.
`mdc-circular-progress__circle-left` | Mandatory.  One of two circle sections that when combined are animated to form the full indeterminate progress indicator.
`mdc-circular-progress__circle-right` | Mandatory.  One of two circle sections that when combined are animated to form the full indeterminate progress indicator.
`mdc-circular-progress__gap-patch` | Mandatory.  A tiny little sliver of an SVG circle used to patch a gap between the circle-left and the circle-right.


> _NOTE_: Ensure the correct inner SVG templates for each size are used to ensure optimal ratio of the stroke width to container size as specified in Material Design guidelines.

### Sass Mixins

Mixin | Description
----- | ------------
`color($color)` | Customizes the stroke-color of the indicator. Applies to the determinate variant, and also the indeterminate variant unless the four-color mixin is applied.
`track-color($color)` | Customizes the track color of the indicator. Applies to the determinate variant only.
`indeterminate-colors($colors)` | Applies four animated stroke-colors to the indeterminate indicator. Applicable to the indeterminate variant only and overrides any single color currently set. Takes a list of exacty four colors.

## `MDCCircularProgress` Properties and Methods

Property | Value Type | Description
-------- | ---------- | --------------
`determinate` | `boolean` (write-only) | Toggles the component between the determinate and indeterminate state.
`progress` | `number` (write-only) | Sets the progress bar to this value. Value should be between 0 and 1.

Method Signature | Description |
---------------- | ----------- |
`open() => void` | Puts the component in the open state. |
`close() => void` | Puts the component in the closed state. |


## Usage within Web Frameworks

### `MDCCircularProgressAdapter`

Method Signature | Description
---------------- | -----------
`addClass(className: string) => void` | Adds a class to the root element.
`getDeterminateCircleAttribute(attributeName: string) => void` | Gets the specified attribute from the determinate circle element.
`hasClass(className: string) => boolean` | Returns boolean indicating whether the root element has a given class.
`removeClass(className: string) => void` | Removes a class from the root element.
`removeAttribute(attributeName: string) => void` | Removes the specified attribute from the root element.
`setAttribute(attributeName: string, value: string) => void` | Sets the specified attribute on the root element.
`setDeterminateCircleAttribute(attributeName: string, value: string) => void` | Sets the specified attribute on the determinate circle element.

### `MDCCircularProgressFoundation`

Method Signature | Description
---------------- | ---
`setDeterminate(value: boolean) => void` | Toggles the component between the determinate and indeterminate state.
`setProgress(value: number) => void` | Sets the progress bar to this value. Value should be between [0, 1].
`open() => void` | Puts the component in the open state.
`close() => void` | Puts the component in the closed state.


