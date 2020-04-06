<!--docs:
title: "Text field icon"
layout: detail
section: components
excerpt: "Icons describe the type of input a text field requires"
iconId: text_field
path: /catalog/input-controls/text-field/icon/
-->

# Text field icon

Icons describe the type of input a text field requires. They can also be interaction targets.

## Basic usage

### HTML structure

```html
<i class="material-icons mdc-text-field__icon mdc-text-field__icon--leading" tabindex="0" role="button">event</i>
```

#### Icon set

We recommend using [Material Icons](https://material.io/tools/icons/) from Google Fonts:

```html
<head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
```

However, you can also use SVG, [Font Awesome](https://fontawesome.com/), or any other icon library you wish.

### Styles

```scss
@use "@material/textfield/icon";

@include icon.icon-core-styles;
```

### JavaScript instantiation

```js
import {MDCTextFieldIcon} from '@material/textfield/icon';

const icon = new MDCTextFieldIcon(document.querySelector('.mdc-text-field-icon'));
```

## Variants

Leading and trailing icons can be applied to default or `mdc-text-field--outlined` Text Fields. To add an icon, add the relevant class (`mdc-text-field--with-leading-icon` and/or `mdc-text-field--with-trailing-icon`) to the root element, add an `i` element with your preferred icon, and give it a class of `mdc-text-field__icon` with the modifier `mdc-text-field__icon--leading` or `mdc-text-field__icon--trailing`.

> **NOTE:** if you would like to display un-clickable icons, simply omit `tabindex="0"` and `role="button"`, and the CSS will ensure the cursor is set to default, and that interacting with an icon doesn't do anything unexpected.

### Leading icon

In text field:

```html
<label class="mdc-text-field mdc-text-field--with-leading-icon">
  <i class="material-icons mdc-text-field__icon mdc-text-field__icon--leading" tabindex="0" role="button">event</i>
  <input class="mdc-text-field__input" type="text" aria-labelledby="my-label-id">
  <span class="mdc-floating-label" id="my-label-id">Your Name</span>
  <div class="mdc-line-ripple"></div>
</label>
```

In outlined text field:

```html
<label class="mdc-text-field mdc-text-field--outlined mdc-text-field--with-leading-icon">
  <i class="material-icons mdc-text-field__icon mdc-text-field__icon--leading" tabindex="0" role="button">event</i>
  <input class="mdc-text-field__input" type="text" aria-labelledby="my-label-id">
  <div class="mdc-notched-outline">
    <div class="mdc-notched-outline__leading"></div>
    <div class="mdc-notched-outline__notch">
      <span class="mdc-floating-label" id="my-label-id">Your Name</span>
    </div>
    <div class="mdc-notched-outline__trailing"></div>
  </div>
</label>
```

### Trailing icon

In text field:

```html
<label class="mdc-text-field mdc-text-field--with-trailing-icon">
  <input class="mdc-text-field__input" type="text" aria-labelledby="my-label-id">
  <i class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing" tabindex="0" role="button">event</i>
  <span class="mdc-floating-label" id="my-label-id">Your Name</span>
  <div class="mdc-line-ripple"></div>
</label>
```

In outlined text field:

```html
<label class="mdc-text-field mdc-text-field--outlined mdc-text-field--with-trailing-icon">
  <input class="mdc-text-field__input" type="text" aria-labelledby="my-label-id">
  <i class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing" tabindex="0" role="button">event</i>
  <div class="mdc-notched-outline">
    <div class="mdc-notched-outline__leading"></div>
    <div class="mdc-notched-outline__notch">
      <span class="mdc-floating-label" id="my-label-id">Your Name</span>
    </div>
    <div class="mdc-notched-outline__trailing"></div>
  </div>
</label>
```

### Leading and trailing icons

In text field:

```html
<label class="mdc-text-field mdc-text-field--with-leading-icon mdc-text-field--with-trailing-icon">
  <i class="material-icons mdc-text-field__icon mdc-text-field__icon--leading">phone</i>
  <input class="mdc-text-field__input" type="text" aria-labelledby="my-label-id">
  <i class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing" tabindex="0" role="button">event</i>
  <span class="mdc-floating-label" id="my-label-id">Phone Number</span>
  <div class="mdc-line-ripple"></div>
</label>
```

In outlined text field:

```html
<label class="mdc-text-field mdc-text-field--outlined mdc-text-field--with-leading-icon mdc-text-field--with-trailing-icon">
  <i class="material-icons mdc-text-field__icon mdc-text-field__icon--leading">phone</i>
  <input class="mdc-text-field__input" type="text" aria-labelledby="my-label-id">
  <i class="material-icons mdc-text-field__icon mdc-text-field__icon--trailing" tabindex="0" role="button">clear</i>
  <div class="mdc-notched-outline">
   <div class="mdc-notched-outline__leading"></div>
    <div class="mdc-notched-outline__notch">
      <span class="mdc-floating-label" id="my-label-id">Phone Number</span>
    </div>
    <div class="mdc-notched-outline__trailing"></div>
  </div>
</label>
```

## API

### CSS classes

CSS Class | Description
--- | ---
`mdc-text-field__icon` | Mandatory.
`mdc-text-field__icon--leading` | Mandatory for leading icons.
`mdc-text-field__icon--trailing` | Mandatory for trailing icons.

### Sass mixins

Mixin | Description
--- | ---
`mdc-text-field-leading-icon-color($color)` | Customizes the color for the leading icon in an enabled text-field.
`mdc-text-field-trailing-icon-color($color)` | Customizes the color for the trailing icon in an enabled text-field.
`mdc-text-field-disabled-icon-color($color)` | Customizes the color for the leading/trailing icons in a disabled text-field.

## `MDCTextFieldIcon` properties and methods

Property | Value Type | Description
--- | --- | ---
`foundation` | `MDCTextFieldIconFoundation` | Returns the icon's foundation. This allows the parent `MDCTextField` component to access the public methods on the `MDCTextFieldIconFoundation` class.

## Usage within frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Text Field Icon for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../../docs/integrating-into-frameworks.md).

### `MDCTextFieldIconAdapter`

Method Signature | Description
--- | ---
`getAttr(attr: string) => string` | Gets the value of an attribute on the icon element.
`setAttr(attr: string, value: string) => void` | Sets an attribute with a given value on the icon element.
`removeAttr(attr: string) => void` | Removes an attribute from the icon element.
`setContent(content: string) => void` | Sets the text content of the icon element.
`registerInteractionHandler(evtType: string, handler: EventListener) => void` | Registers an event listener for a given event.
`deregisterInteractionHandler(evtType: string, handler: EventListener) => void` | Deregisters an event listener for a given event.
`notifyIconAction() => void` | Emits a custom event "MDCTextField:icon" denoting a user has clicked the icon, which bubbles to the top-level text field element.

### `MDCTextFieldIconFoundation`

Method Signature | Description
--- | ---
`setDisabled(disabled: boolean) => void` | Updates the icon's disabled state.
`setAriaLabel(label: string) => void` | Updates the icon's aria-label.
`setContent(content: string) => void` | Updates the icon's text content.
`handleInteraction(evt: Event) => void` | Handles a text field interaction event.
