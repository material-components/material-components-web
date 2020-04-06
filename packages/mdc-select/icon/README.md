<!--docs:
title: "Select icon"
layout: detail
section: components
excerpt: "Icons describe the type of input a select requires"
iconId: text_field
path: /catalog/input-controls/select-menus/icon/
-->

# Select icon

Icons describe the type of input a select requires. They can also be interaction targets.

## Basic usage

### HTML structure

```html
<i class="material-icons mdc-select__icon" tabindex="0" role="button">event</i>
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
@import "@material/select/icon/mdc-select-icon";
```

### JavaScript instantiation

```js
import {MDCSelectIcon} from '@material/select/icon';

const icon = new MDCSelectIcon(document.querySelector('.mdc-select__icon'));
```

## Variants

Leading icons can be applied to default or `mdc-select--outlined` Selects. To add a leading icon, add the class `mdc-select--with-leading-icon` to the root element, add an `i` element with your preferred icon as a child of the `mdc-select__anchor` element, and give it a class of `mdc-select__icon`.

> **NOTE:** if you would like to display un-clickable icons, simply omit `tabindex="0"` and `role="button"`, and the CSS will ensure the cursor is set to default, and that interacting with an icon doesn't do anything unexpected.

### Leading icon

In select:

```html
<div class="mdc-select mdc-select--with-leading-icon">
  <div class="mdc-select__anchor">
    <i class="material-icons mdc-select__icon" tabindex="0" role="button">event</i>
    ...
  </div>
  <!-- The rest of the select markup. -->
</div>
```

In outlined select:

```html
<div class="mdc-select mdc-select--outlined mdc-select--with-leading-icon">
  <div class="mdc-select__anchor">
    <i class="material-icons mdc-select__icon" tabindex="0" role="button">event</i>
    ...
  </div>
  <!-- The rest of the select markup. -->
</div>
```

## API

### CSS classes

CSS Class | Description
--- | ---
`mdc-select__icon` | Mandatory.

### Sass mixins

Mixin | Description
--- | ---
`mdc-select-icon-color($color)` | Customizes the color for the leading icon.

## `MDCSelectIcon` properties and methods

Property | Value Type | Description
--- | --- | ---
`foundation` | `MDCSelectIconFoundation` | Returns the icon's foundation. This allows the parent `MDCSelect` component to access the public methods on the `MDCSelectIconFoundation` class.

## Usage within frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Select Icon for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../../docs/integrating-into-frameworks.md).

### `MDCSelectIconAdapter`

Method Signature | Description
--- | ---
`getAttr(attr: string) => string` | Gets the value of an attribute on the icon element.
`setAttr(attr: string, value: string) => void` | Sets an attribute with a given value on the icon element.
`removeAttr(attr: string) => void` | Removes an attribute from the icon element.
`setContent(content: string) => void` | Sets the text content of the icon element.
`registerInteractionHandler(evtType: string, handler: EventListener) => void` | Registers an event listener for a given event.
`deregisterInteractionHandler(evtType: string, handler: EventListener) => void` | Deregisters an event listener for a given event.
`notifyIconAction() => void` | Emits a custom event "MDCSelect:icon" denoting a user has clicked the icon, which bubbles to the top-level select element.

### `MDCSelectIconFoundation`

Method Signature | Description
--- | ---
`setDisabled(disabled: boolean) => void` | Updates the icon's disabled state.
`setAriaLabel(label: string) => void` | Updates the icon's aria-label.
`setContent(content: string) => void` | Updates the icon's text content.
`handleInteraction(evt: Event) => void` | Handles a select interaction event.
