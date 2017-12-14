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
<i class="material-icons mdc-text-field__icon" tabindex="0">event</i>
```

### Usage within `mdc-text-field`

Leading and trailing icons can be added to `mdc-text-field` as visual indicators
as well as interaction targets. To do so, add the relevant classes
(`mdc-text-field--with-leading-icon` or `mdc-text-field--with-trailing-icon`) to the root element, add
an `i` element with your preferred icon, and give it a class of `mdc-text-field__icon`.

#### Leading:

```html
<div class="mdc-text-field mdc-text-field--box mdc-text-field--with-leading-icon">
  <i class="material-icons mdc-text-field__icon" tabindex="0">event</i>
  <input type="text" id="my-input" class="mdc-text-field__input">
  <label for="my-input" class="mdc-text-field__label">Your Name</label>
  <div class="mdc-text-field__bottom-line"></div>
</div>
```

#### Trailing:

```html
<div class="mdc-text-field mdc-text-field--box mdc-text-field--with-trailing-icon">
  <input type="text" id="my-input" class="mdc-text-field__input">
  <label for="my-input" class="mdc-text-field__label">Your Name</label>
  <i class="material-icons mdc-text-field__icon" tabindex="0">event</i>
  <div class="mdc-text-field__bottom-line"></div>
</div>
```

>**NOTE:** if you would like to display un-clickable icons, simply remove `tabindex="0"`,
and the css will ensure the cursor is set to default, and that actioning on an icon doesn't
do anything unexpected.

#### MDCTextFieldIcon API

##### MDCTextFieldIcon.foundation

MDCTextFieldIconFoundation. This allows the parent MDCTextField component to access the public methods on the MDCTextFieldIconFoundation class.

### Using the foundation class

Method Signature | Description
--- | ---
setAttr(attr: string, value: string) => void | Sets an attribute with a given value on the icon element
registerInteractionHandler(evtType: string, handler: EventListener) => void | Registers an event listener for a given event
deregisterInteractionHandler(evtType: string, handler: EventListener) => void | Deregisters an event listener for a given event
notifyIconAction() => void | Emits a custom event "MDCTextField:icon" denoting a user has clicked the icon, which bubbles to the top-level text field element

#### The full foundation API

##### MDCTextFieldIconFoundation.setDisabled(disabled: boolean)

Updates the icon's disabled state.

##### MDCTextFieldIconFoundation.handleInteraction(evt: Event)

Handles a text field interaction event.
