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
    <a href="https://material.io/guidelines/components/text-fields.html#text-fields-layout">Material Design guidelines: Text Fields Layout</a>
  </li>
</ul>

## Usage

### HTML Structure

```html
<i class="material-icons mdc-text-field__icon" tabindex="0" role="button">event</i>
```

### Usage within `mdc-text-field`

Leading and trailing icons can be applied to text fields styled as `mdc-text-field--box` or `mdc-text-field--outlined`. To add an icon, add the relevant class (either `mdc-text-field--with-leading-icon` or `mdc-text-field--with-trailing-icon`) to the root element, add an `i` element with your preferred icon, and give it a class of `mdc-text-field__icon`.

#### Leading icon

In text field box:
```html
<div class="mdc-text-field mdc-text-field--box mdc-text-field--with-leading-icon">
  <i class="material-icons mdc-text-field__icon" tabindex="0" role="button">event</i>
  <input type="text" id="my-input" class="mdc-text-field__input">
  <label for="my-input" class="mdc-floating-label">Your Name</label>
  <div class="mdc-text-field__bottom-line"></div>
</div>
```

In outlined text field:
```html
<div class="mdc-text-field mdc-text-field--outlined mdc-text-field--with-leading-icon">
  <i class="material-icons mdc-text-field__icon" tabindex="0" role="button">event</i>
  <input type="text" id="my-input" class="mdc-text-field__input">
  <label for="my-input" class="mdc-floating-label">Your Name</label>
  <div class="mdc-notched-outline">
    <svg>
      <path class="mdc-notched-outline__path"/>
    </svg>
  </div>
  <div class="mdc-notched-outline__idle"></div>
</div>
```

#### Trailing icon

In text field box:
```html
<div class="mdc-text-field mdc-text-field--box mdc-text-field--with-trailing-icon">
  <input type="text" id="my-input" class="mdc-text-field__input">
  <label for="my-input" class="mdc-floating-label">Your Name</label>
  <i class="material-icons mdc-text-field__icon" tabindex="0" role="button">event</i>
  <div class="mdc-text-field__bottom-line"></div>
</div>
```

In outlined text field:
```html
<div class="mdc-text-field mdc-text-field--outlined mdc-text-field--with-trailing-icon">
  <input type="text" id="my-input" class="mdc-text-field__input">
  <label for="my-input" class="mdc-floating-label">Your Name</label>
  <i class="material-icons mdc-text-field__icon" tabindex="0" role="button">event</i>
  <div class="mdc-notched-outline">
    <svg>
      <path class="mdc-notched-outline__path"/>
    </svg>
  </div>
  <div class="mdc-notched-outline__idle"></div>
</div>
```

>**NOTE:** if you would like to display un-clickable icons, simply remove `tabindex="0"` and `role="button"`,
and the CSS will ensure the cursor is set to default, and that interacting with an icon doesn't
do anything unexpected.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-text-field-icon-color($color)` | Customizes the color for the leading/trailing icons.

### `MDCTextFieldIcon`

##### `MDCTextFieldIcon.foundation`

This allows the parent `MDCTextField` component to access the public methods on the `MDCTextFieldIconFoundation` class.

### `MDCTextFieldIconAdapter`

Method Signature | Description
--- | ---
`getAttr(attr: string) => string` | Gets the value of an attribute on the icon element
`setAttr(attr: string, value: string) => void` | Sets an attribute with a given value on the icon element
`removeAttr(attr: string) => void` | Removes an attribute from the icon element
`registerInteractionHandler(evtType: string, handler: EventListener) => void` | Registers an event listener for a given event
`deregisterInteractionHandler(evtType: string, handler: EventListener) => void` | Deregisters an event listener for a given event
`notifyIconAction() => void` | Emits a custom event "MDCTextField:icon" denoting a user has clicked the icon, which bubbles to the top-level text field element

### `MDCTextFieldIconFoundation`

Method Signature | Description
--- | ---
`setDisabled(disabled: boolean) => void` | Updates the icon's disabled state
`handleInteraction(evt: Event) => void` | Handles a text field interaction event
