# MDC Slider

The MDC Slider component provides a range input field adhering to the [Material Design Specification]( https://material.google.com/components/sliders.html).

It handles cross-browser differences in how the native input[range] element is styled and handles mouse and touch events.
It provides an `MDCSlider:change` custom event giving access to the current range value in a uniform event.
It requires JavaScript to handle the lower and upper track shading but includes a degraded version that does
not require any javascript for basic operation.

## Installation

```
npm install --save @material/slider
```

## Continuous slider usage

```html
<div class="mdc-slider" id="mdc-slider-default">
  <input type="range" min="0" max="100" value="25" class="mdc-slider__input">
  <div class="mdc-slider__background">
    <div class="mdc-slider__background-lower"></div>
    <div class="mdc-slider__background-upper"></div>
  </div>
</div>
```

The slider component is driven by an underlying native input[range] element. This element is sized and positioned the same way as the slider component itself, allowing for proper behavior of assistive devices.

CSS classes:

| Class                                  | Description                                                                |
| -------------------------------------- | -------------------------------------------------------------------------- |
| `mdc-slider`                           | Mandatory. Needs to be set on the root element of the component.           |
| `mdc-mdc-slider__input`                | Mandatory. Needs to be set on the input element.                           |
| `mdc-mdc-slider__background`           | Mandatory. Needs to be set on the background div element.                  |
| `mdc-mdc-slider__background-lower`     | Mandatory. Needs to be set on the background lower track div element.      |
| `mdc-mdc-slider__background-upper`     | Mandatory. Needs to be set on the background upper track div element.      |
| `mdc-slider--accent`                   | Optional. Colors the slider with the theme accent color.                   |


> _NOTE_: _if you plan on using CSS-only_. The slider will not shade the lower and upper parts
> of the track on most browsers except IE.

### Using the JS component

MDC Slider ships with Component / Foundation classes which are used to provide a full-fidelity
Material Design text field component.

#### Including in code

##### ES2015

```javascript
import {MDCSlider, MDCSliderFoundation} from 'mdc-slider';
```

##### CommonJS

```javascript
const MDCSlider = require('mdc-slider');
const MDCSlider = MDCSlider.MDCSlider;
const MDCSliderFoundation = MDCSlider.MDCSliderFoundation;
```

##### AMD

```javascript
require(['path/to/mdc-slider'], MDCSlider => {
  const MDCSlider = MDCSlider.MDCSlider;
  const MDCSliderFoundation = MDCSlider.MDCSliderFoundation;
});
```

##### Global

```javascript
const MDCSlider = mdc.slider.MDCSlider;
const MDCSliderFoundation = mdc.slider.MDCSliderFoundation;
```

#### Automatic Instantiation

```javascript
mdc.slider.MDCSlider.attachTo(document.querySelector('.mdc-slider'));
```

#### Manual Instantiation

```javascript
import {MDCSlider} from 'mdc-slider';

const slider = new MDCSlider(document.querySelector('.mdc-slider'));
```


#### Using the slider component
```js
var slider = new mdc.slider.MDCSlider(document.querySelector('#mdc-slider-default'));

slider.listen('MDCSlider:change', function(evt) {
  console.log(`value: {evt.detail.value}`);
})
```

### Slider component API

##### MDCSlider.disabled

Boolean. Proxies to the foundation's `isDisabled/setDisabled` methods when retrieved/set
respectively.

#### MDCSlider.destroy() => void

Cleans up handlers when slider is destroyed


### Slider Events

#### MDCSlider:change

Broadcast when a user actions on the `.mdc-slider__input` element.


### Using the foundation class


| Method Signature | Description |
| --- | --- |
| addClass(className: string) => void | Adds a class to the root element |
| removeClass(className: string) => void | Removes a class from the root element |
| `hasClass(className: string) => boolean` | Returns boolean indicating whether element has a given class. |
| addInputClass(className: string) => void | Adds a class to the input element |
| removeInputClass(className: string) => void | Removes a class from the inp[ut] element |
| setAttr(name: string, value: string) => void | Sets an attribute on the input element |
| registerHandler(type: string, handler: EventListener) => void | Registers an event listener on the native input element for the type |
| deregisterHandler(type: string, handler: EventListener) => void | Un-registers an event listener on the native input element for the type |
| registerRootHandler(type: string, handler: EventListener) => void | Registers an event listener on the root element for the type |
| deregisterRootHandler(type: string, handler: EventListener) => void | Un-registers an event listener on the root element for the type |
| getNativeInput() => {value: string, disabled: boolean} | Returns an object representing the native input element, with a similar API shape. The object returned should include the `value` and `disabled` properties. We _never_ alter the value within our code, however we _do_ update the disabled property, so if you choose to duck-type the return value for this method in your implementation it's important to keep this in mind. Also note that this method can return null, which the foundation will handle gracefully. |
| `hasNecessaryDom() => boolean` | Returns boolean indicating whether the necessary DOM is present (namely, the `mdc-slider__background` container). |
| `setLowerStyle(name: string, value: string) => void` | Sets the style `name` to `value` on the background-lower element. |
| `setUpperStyle(name: string, value: string) => void` | Sets the style `name` to `value` on the background-upper element. |
| `notifyChange(evtData: {value: number}) => void` | Broadcasts a change notification, passing along the `evtData` to the environment's event handling system. In our vanilla implementation, Custom Events are used for this. |

#### The full foundation API

##### MDCSliderFoundation.isDisabled() => boolean

Returns a boolean specifying whether or not the input is disabled.

##### MDCSliderFoundation.setDisabled(disabled: boolean)

Updates the input's disabled state.

### Theming

MDC Slider components use the configured theme's primary color for its thumb and track.
