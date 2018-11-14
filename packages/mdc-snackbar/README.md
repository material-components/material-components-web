<!--docs:
title: "Snackbars"
layout: detail
section: components
excerpt: "Snackbars provide brief messages about app processes at the bottom of the screen."
iconId: toast
path: /catalog/snackbars/
-->

# Snackbars

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components.github.io/material-components-web-catalog/#/component/snackbar">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/snackbars.png" width="336" alt="Snackbars screenshot">
  </a>
</div>-->

Snackbars provide brief messages about app processes at the bottom of the screen.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-snackbar">Material Design guidelines: Snackbars & toasts</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/snackbar">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/snackbar
```

## Basic Usage

### HTML Structure

```html
<div class="mdc-snackbar"
     aria-live="assertive"
     aria-atomic="true"
     aria-hidden="true">
  <div class="mdc-snackbar__text"></div>
  <div class="mdc-snackbar__action-wrapper">
    <button type="button" class="mdc-snackbar__action-button"></button>
  </div>
</div>
```

### Styles

```scss
@import "@material/snackbar/mdc-snackbar";
```

### JavaScript Instantiation

MDC Snackbar ships with a Component / Foundation combo which provides the API for showing snackbar messages with optional action.

```js
import {MDCSnackbar} from '@material/snackbar';

const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

## Variants

### Start Aligned Snackbars (tablet and desktop only)

MDC Snackbar can be start aligned (including in RTL contexts). To create a start-aligned
snackbar, add the `mdc-snackbar--align-start` modifier class to the root element.

```html
<div class="mdc-snackbar mdc-snackbar--align-start"
     aria-live="assertive"
     aria-atomic="true"
     aria-hidden="true">
  <div class="mdc-snackbar__text"></div>
  <div class="mdc-snackbar__action-wrapper">
    <button type="button" class="mdc-snackbar__action-button"></button>
  </div>
</div>
```

### Additional Information

#### Avoiding Flash-Of-Unstyled-Content (FOUC)

If you are loading the `mdc-snackbar` CSS asynchronously, you may experience a brief flash-of-unstyled-content (FOUC) due to the
snackbar's translate transition running once the CSS loads. To avoid this temporary FOUC, you can add the following simple style
before the `mdc-snackbar` CSS is loaded:

```css
.mdc-snackbar { transform: translateY(100%); }
```
This will move the snackbar offscreen until the CSS is fully loaded and avoids a translate transition upon load.

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-snackbar` | Mandatory. Container for the snackbar elements.
`mdc-snackbar__action-wrapper` | Mandatory. Wraps the action button.
`mdc-snackbar__action-button` | Mandatory. The action button.
`mdc-snackbar__text` | Mandtory. The next of the snackbar.
`mdc-snackbar--align-start` | Optional. Class to align snackbar to start, ltr dependent.
`mdc-snackbar--action-on-bottom` | Optional on the mdc-snackbar element. Moves action to bottom of snackbar. Can be applied in js.
`mdc-snackbar--multiline` | Optional on the mdc-snackbar element. Makes the snackbar multiple lines. Can be applied in js.

## `MDCSnackbar` Properties and Methods

Property | Value Type | Description
--- | --- | ---
`dismissesOnAction` | `boolean` | Whether the snackbar dismisses when the action is clicked, or if it waits for the timeout anyway. Defaults to `true`.

Method Signature | Description
--- | ---
`show(data: DataObject=) => void` | Displays the snackbar. `data` populates the snackbar and sets options (see below).

### DataObject Properties

 Property | Type | Description
--- | --- | ---
 `message` | string | Mandatory. The text message to display.
 `timeout` | number | The amount of time in milliseconds to show the snackbar. Defaults to `2750`.
 `actionHandler` | function | The function to execute when the action is clicked.
 `actionText` | string | Mandatory if `actionHandler` is set. The text to display for the action button.
 `multiline` | boolean | Whether to show the snackbar with space for multiple lines of text.
 `actionOnBottom` | boolean | Whether to show the action below the multiple lines of text (only applicable when `multiline` is true).

### Events

Event Name | `event.detail` | Description
--- | --- | ---
`MDCSnackbar:hide` | `{}` | Emitted when the Snackbar is hidden.
`MDCSnackbar:show` | `{}` | Emitted when the Snackbar is shown.

## Usage Within Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Snackbar for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCSnackbarAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element.
`removeClass(className: string) => void` | Removes a class from the root element.
`setAriaHidden() => void` | Sets `aria-hidden="true"` on the root element.
`unsetAriaHidden() => void` | Removes the `aria-hidden` attribute from the root element.
`setActionAriaHidden() => void` | Sets `aria-hidden="true"` on the action element.
`unsetActionAriaHidden() => void` | Removes the `aria-hidden` attribute from the action element.
`setActionText(actionText: string) => void` | Set the text content of the action element.
`setMessageText(message: string) => void` | Set the text content of the message element.
`setFocus() => void` | Sets focus on the action button.
`isFocused() => boolean` | Detects focus on the action button.
`visibilityIsHidden() => boolean` | Returns document.hidden property.
`registerBlurHandler(handler: EventListener) => void` | Registers an event handler to be called when a `blur` event is triggered on the action button.
`deregisterBlurHandler(handler: EventListener) => void` | Deregisters a `blur` event handler from the actionButton.
`registerVisibilityChangeHandler(handler: EventListener) => void` | Registers an event handler to be called when a 'visibilitychange' event occurs.
`deregisterVisibilityChangeHandler(handler: EventListener) => void` | Deregisters an event handler to be called when a 'visibilitychange' event occurs.
`registerCapturedInteractionHandler(evtType: string, handler: EventListener) => void` | Registers an event handler to be called when the given event type is triggered on the `body`.
`deregisterCapturedInteractionHandler(evtType: string, handler: EventListener) => void` | Deregisters an event handler from the `body`.
`registerActionClickHandler(handler: EventListener) => void` | Registers an event handler to be called when a `click` event is triggered on the action element.
`deregisterActionClickHandler(handler: EventListener) => void` | Deregisters an event handler from a `click` event on the action element. This will only be called with handlers that have previously been passed to `registerActionClickHandler` calls.
`registerTransitionEndHandler(handler: EventListener) => void` | Registers an event handler to be called when an `transitionend` event is triggered on the root element. Note that you must account for vendor prefixes in order for this to work correctly.
`deregisterTransitionEndHandler(handler: EventListener) => void` | Deregisters an event handler from an `transitionend` event listener. This will only be called with handlers that have previously been passed to `registerTransitionEndHandler` calls.
`notifyShow() => void` | Dispatches an event notifying listeners that the snackbar has been shown.
`notifyHide() => void` | Dispatches an event notifying listeners that the snackbar has been hidden.
