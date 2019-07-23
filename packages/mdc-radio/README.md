<!--docs:
title: "Radio Buttons"
layout: detail
section: components
iconId: radio_button
path: /catalog/input-controls/radio-buttons/
-->

# Radio Buttons

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components.github.io/material-components-web-catalog/#/component/radio">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/radios.png" width="60" alt="Radio buttons screenshot">
  </a>
</div>-->

Radio buttons allow the user to select one option from a set while seeing all available options.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-radio-buttons">Material Design guidelines: Selection Controls – Radio buttons</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/radio">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/radio
```

## Basic Usage

We recommend using MDC Radio with [MDC Form Field](../mdc-form-field) for enhancements such as label alignment, label activation of the ripple interaction effect, and RTL-awareness.

### HTML Structure

```html
<div class="mdc-form-field">
  <div class="mdc-radio">
    <input class="mdc-radio__native-control" type="radio" id="radio-1" name="radios" checked>
    <div class="mdc-radio__background">
      <div class="mdc-radio__outer-circle"></div>
      <div class="mdc-radio__inner-circle"></div>
    </div>
  </div>
  <label for="radio-1">Radio 1</label>
</div>
```

### Styles

```scss
@import "@material/form-field/mdc-form-field";
@import "@material/radio/mdc-radio";
```

### JavaScript Instantiation

The radio button will work without JavaScript, but you can enhance it with a ripple interaction effect by instantiating `MDCRadio` on the `mdc-radio` element. To activate the ripple effect upon interacting with the label, you must also instantiate `MDCFormField` on the `mdc-form-field` element and set the `MDCRadio` instance as its `input`.

```js
import {MDCFormField} from '@material/form-field';
import {MDCRadio} from '@material/radio';

const radio = new MDCRadio(document.querySelector('.mdc-radio'));
const formField = new MDCFormField(document.querySelector('.mdc-form-field'));
formField.input = radio;
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

## Variants

### Disabled

To disable a radio button, add the `mdc-radio--disabled` class to the root element and set the `disabled` attribute on the `<input>` element.
Disabled radio buttons cannot be interacted with and have no visual interaction effect.

```html
<div class="mdc-form-field">
  <div class="mdc-radio mdc-radio--disabled">
    <input class="mdc-radio__native-control" type="radio" id="radio-1" name="radios" disabled>
    <div class="mdc-radio__background">
      <div class="mdc-radio__outer-circle"></div>
      <div class="mdc-radio__inner-circle"></div>
    </div>
  </div>
  <label for="radio-1">Radio 1</label>
</div>
```

## Style Customization

MDC Radio uses [MDC Theme](../mdc-theme)'s `secondary` color by default. Use the following mixins to customize it.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-radio-unchecked-stroke-color($color)` | Sets the stroke color of an unchecked radio button
`mdc-radio-checked-stroke-color($color)` | Sets the stroke color of a checked radio button
`mdc-radio-ink-color($color)` | Sets the ink color of a radio button
`mdc-radio-focus-indicator-color($color)` | Sets the color of the focus indicator

#### Caveat: Edge and CSS Custom Properties

In browsers that fully support CSS custom properties, the above mixins will work if you pass in a [MDC Theme](../mdc-theme) property (e.g. `primary`) as an argument. However, Edge does not fully support CSS custom properties. If you are using any of the Sass mixins, you must pass in an actual color value for support in Edge.

<!-- docgen-tsdoc-replacer:start __DO NOT EDIT, This section is automatically generated__ -->
### MDCRadio
#### Methods

Signature | Description
--- | ---
`emit(evtType: string, evtData: T, shouldBubble?: boolean) => void` | Fires a cross-browser-compatible custom event from the component root of the given type, with the given data.
`listen(evtType: K, handler: SpecificEventListener<K>, options?: AddEventListenerOptions | boolean) => void` | Wrapper method to add an event listener to the component's root element. This is most useful when listening for custom events.
`unlisten(evtType: K, handler: SpecificEventListener<K>, options?: AddEventListenerOptions | boolean) => void` | Wrapper method to remove an event listener to the component's root element. This is most useful when unlistening for custom events.

#### Properties

Name | Type | Description
--- | --- | ---
checked | `boolean` | Setter/getter for the radio's checked state.
disabled | `boolean` | Setter/getter for the radio's disabled state. Setter proxies to foundation's `setDisabled` method
value | `string` | Setter/getter for the radio's value.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create this component for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### MDCRadioAdapter
#### Methods

Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element.
`removeClass(className: string) => void` | Removes a class from the root element.
`setNativeControlDisabled(disabled: boolean) => void` | Sets the input's `disabled` property to the given value.

### MDCRadioFoundation
#### Methods

Signature | Description
--- | ---
`setDisabled(disabled: boolean) => void` | Sets the disabled value of the native control.


<!-- docgen-tsdoc-replacer:end -->
