<!--docs:
title: "Text Field Icon"
layout: detail
section: components
excerpt: "Icons describe the type of input a text field requires"
iconId: text_field
path: /catalog/input-controls/text-field/icon/
-->

# Text Field Icon

Icons describe the type of input a text field requires. They can also be interaction targets.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-text-fields#text-fields-layout">Material Design guidelines: Text Fields Layout</a>
  </li>
</ul>

## Basic Usage

### HTML Structure

```html
<i class="material-icons mdc-text-field__icon" tabindex="0" role="button">event</i>
```

#### Icon Set

We recommend using [Material Icons](https://material.io/tools/icons/) from Google Fonts:

```html
<head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
```

However, you can also use SVG, [Font Awesome](https://fontawesome.com/), or any other icon library you wish.

### Styles

```scss
@import "@material/textfield/icon/mdc-text-field-icon";
```

### JavaScript Instantiation

```js
import {MDCTextFieldIcon} from '@material/textfield/icon';

const icon = new MDCTextFieldIcon(document.querySelector('.mdc-text-field-icon'));
```

## Variants

Leading and trailing icons can be applied to default or `mdc-text-field--outlined` Text Fields. To add an icon, add the relevant class (`mdc-text-field--with-leading-icon` and/or `mdc-text-field--with-trailing-icon`) to the root element, add an `i` element with your preferred icon, and give it a class of `mdc-text-field__icon`. If using 2 icons at the same time, the first icon inside the `mdc-text-field` element will be interpreted as the leading icon and the second icon will be interpreted as the trailing icon.

> **NOTE:** if you would like to display un-clickable icons, simply omit `tabindex="0"` and `role="button"`, and the CSS will ensure the cursor is set to default, and that interacting with an icon doesn't do anything unexpected.

### Leading icon

In text field:

```html
<div class="mdc-text-field mdc-text-field--with-leading-icon">
  <i class="material-icons mdc-text-field__icon" tabindex="0" role="button">event</i>
  <input type="text" id="my-input" class="mdc-text-field__input">
  <label for="my-input" class="mdc-floating-label">Your Name</label>
  <div class="mdc-line-ripple"></div>
</div>
```

In outlined text field:

```html
<div class="mdc-text-field mdc-text-field--outlined mdc-text-field--with-leading-icon">
  <i class="material-icons mdc-text-field__icon" tabindex="0" role="button">event</i>
  <input type="text" id="my-input" class="mdc-text-field__input">
  <div class="mdc-notched-outline">
    <div class="mdc-notched-outline__leading"></div>
    <div class="mdc-notched-outline__notch">
      <label for="my-input" class="mdc-floating-label">Your Name</label>
    </div>
    <div class="mdc-notched-outline__trailing"></div>
  </div>
</div>
```

### Trailing icon

In text field:

```html
<div class="mdc-text-field mdc-text-field--with-trailing-icon">
  <input type="text" id="my-input" class="mdc-text-field__input">
  <label for="my-input" class="mdc-floating-label">Your Name</label>
  <i class="material-icons mdc-text-field__icon" tabindex="0" role="button">event</i>
  <div class="mdc-line-ripple"></div>
</div>
```

In outlined text field:

```html
<div class="mdc-text-field mdc-text-field--outlined mdc-text-field--with-trailing-icon">
  <input type="text" id="my-input" class="mdc-text-field__input">
  <i class="material-icons mdc-text-field__icon" tabindex="0" role="button">event</i>
  <div class="mdc-notched-outline">
    <div class="mdc-notched-outline__leading"></div>
    <div class="mdc-notched-outline__notch">
      <label for="my-input" class="mdc-floating-label">Your Name</label>
    </div>
    <div class="mdc-notched-outline__trailing"></div>
  </div>
</div>
```

### Leading and Trailing icons

In text field:

```html
<div class="mdc-text-field mdc-text-field--with-leading-icon mdc-text-field--with-trailing-icon">
  <i class="material-icons mdc-text-field__icon">phone</i>
  <input type="text" id="my-input" class="mdc-text-field__input">
  <label for="my-input" class="mdc-floating-label">Phone Number</label>
  <i class="material-icons mdc-text-field__icon" tabindex="0" role="button">event</i>
  <div class="mdc-line-ripple"></div>
</div>
```

In outlined text field:

```html
<div class="mdc-text-field mdc-text-field--outlined mdc-text-field--with-leading-icon mdc-text-field--with-trailing-icon">
  <i class="material-icons mdc-text-field__icon">phone</i>
  <input type="text" id="my-input" class="mdc-text-field__input">
  <i class="material-icons mdc-text-field__icon" tabindex="0" role="button">clear</i>
  <div class="mdc-notched-outline">
   <div class="mdc-notched-outline__leading"></div>
    <div class="mdc-notched-outline__notch">
      <label for="my-input" class="mdc-floating-label">Phone Number</label>
    </div>
    <div class="mdc-notched-outline__trailing"></div>
  </div>
</div>
```

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-text-field-icon` | Mandatory.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-text-field-icon-color($color, $styleSecondIcon: false)` | Customizes the color for the leading/trailing icons. If the `$styleSecondIcon` is `true` it will output the color to only apply to a trailing icon when used with a leading icon.

<!-- docgen-tsdoc-replacer:start __DO NOT EDIT, This section is automatically generated__ -->
### MDCTextFieldIcon
#### Methods

Signature | Description
--- | ---
`emit(evtType: string, evtData: T, shouldBubble?: boolean) => void` | Fires a cross-browser-compatible custom event from the component root of the given type, with the given data.
`listen(evtType: K, handler: SpecificEventListener<K>, options?: AddEventListenerOptions | boolean) => void` | Wrapper method to add an event listener to the component's root element. This is most useful when listening for custom events.
`unlisten(evtType: K, handler: SpecificEventListener<K>, options?: AddEventListenerOptions | boolean) => void` | Wrapper method to remove an event listener to the component's root element. This is most useful when unlistening for custom events.

#### Properties

Name | Type | Description
--- | --- | ---
foundation | `MDCTextFieldIconFoundation` | Returns the icon's foundation. This allows the parent `MDCTextField` component to access the public methods on the `MDCTextFieldIconFoundation` class.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create this component for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### MDCTextFieldIconAdapter
#### Methods

Signature | Description
--- | ---
`deregisterInteractionHandler(evtType: K, handler: SpecificEventListener<K>) => void` | Deregisters an event listener on the icon element for a given event.
`getAttr(attr: string) => string | null` | Gets the value of an attribute on the icon element.
`notifyIconAction() => void` | Emits a custom event "MDCTextField:icon" denoting a user has clicked the icon.
`registerInteractionHandler(evtType: K, handler: SpecificEventListener<K>) => void` | Registers an event listener on the icon element for a given event.
`removeAttr(attr: string) => void` | Removes an attribute from the icon element.
`setAttr(attr: string, value: string) => void` | Sets an attribute on the icon element.
`setContent(content: string) => void` | Sets the text content of the icon element.

### MDCTextFieldIconFoundation
#### Methods

Signature | Description
--- | ---
`handleInteraction(evt: MouseEvent | KeyboardEvent) => void` | Handles a text field interaction event.
`setAriaLabel(label: string) => void` | Updates the icon's aria-label.
`setContent(content: string) => void` | Updates the icon's text content.
`setDisabled(disabled: boolean) => void` | Updates the icon's disabled state.


<!-- docgen-tsdoc-replacer:end -->
