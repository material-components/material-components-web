<!--docs:
title: "Snackbars"
layout: detail
section: components
excerpt: "Brief feedback for an action through a message at the bottom of the screen."
iconId: toast
path: /catalog/snackbars/
-->

# Snackbars

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/snackbar.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/snackbars.png" width="336" alt="Snackbars screenshot">
  </a>
</div>-->

The MDC Snackbar component is a spec-aligned snackbar/toast component adhering to the
[Material Design snackbars & toasts requirements](https://material.io/guidelines/components/snackbars-toasts.html#snackbars-toasts-specs).
It requires JavaScript to show and hide itself.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/snackbars-toasts.html">Material Design guidelines: Snackbars & toasts</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/snackbar.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/snackbar
```

## Usage

### Snackbar DOM

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

### Using the JS Component

MDC Snackbar ships with a Component / Foundation combo which provides the API for showing snackbar
messages with optional action.

#### Including in code

##### ES2015

```javascript
import {MDCSnackbar, MDCSnackbarFoundation} from '@material/snackbar';
```

##### CommonJS

```javascript
const mdcSnackbar = require('mdc-snackbar');
const MDCSnackbar = mdcSnackbar.MDCSnackbar;
const MDCSnackbarFoundation = mdcSnackbar.MDCSnackbarFoundation;
```

##### AMD

```javascript
require(['path/to/mdc-snackbar'], mdcSnackbar => {
  const MDCSnackbar = mdcSnackbar.MDCSnackbar;
  const MDCSnackbarFoundation = mdcSnackbar.MDCSnackbarFoundation;
});
```

##### Global

```javascript
const MDCSnackbar = mdc.snackbar.MDCSnackbar;
const MDCSnackbarFoundation = mdc.snackbar.MDCSnackbarFoundation;
```

#### Automatic Instantiation

If you do not care about retaining the component instance for the snackbar, simply call `attachTo()`
and pass it a DOM element.

```javascript
mdc.snackbar.MDCSnackbar.attachTo(document.querySelector('.mdc-snackbar'));
```

#### Manual Instantiation

Snackbars can easily be initialized using their default constructors as well, similar to `attachTo`.

```javascript
import {MDCSnackbar} from '@material/snackbar';

const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
```

#### Handling events

When snackbar is shown or dismissed, the component will emit a `MDCSnackbar:show` or
`MDCSnackbar:hide` custom event with no data attached.

### Showing a message and action

Once you have obtained an MDCSnackbar instance attached to the DOM, you can use
the `show` method to trigger the display of a message with optional action. The
`show`  method takes an object for snackbar data. The table below shows the
properties and their usage.

| Property | Effect | Remarks | Type |
|-----------|--------|---------|---------|
| message   | The text message to display. | Required | String |
| timeout   | The amount of time in milliseconds to show the snackbar. | Optional (default 2750) | Integer |
| actionHandler | The function to execute when the action is clicked. | Optional | Function |
| actionText | The text to display for the action button. | Required if actionHandler is set |  String |
| multiline | Whether to show the snackbar with space for multiple lines of text | Optional |  Boolean |
| actionOnBottom | Whether to show the action below the multiple lines of text | Optional, applies when multiline is true |  Boolean |

### Responding to a Snackbar Action

To respond to a snackbar action, assign a function to the optional `actionHandler` property in the object that gets passed to the `show` method. If you choose to set this property, you *must _also_* set the `actionText` property.

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

```js
import {MDCSnackbar} from '@material/snackbar';

const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
const dataObj = {
  message: messageInput.value,
  actionText: 'Undo',
  actionHandler: function () {
    console.log('my cool function');
  }
};

snackbar.show(dataObj);
```


### Keep snackbar when the action button is pressed

By default the snackbar will be dimissed when the user presses the action button.
If you want the snackbar to remain visible until the timeout is reached (regardless of
whether the user pressed the action button or not) you can set the `dismissesOnAction`
property to `false`:

```
const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
snackbar.dismissesOnAction = false
```

### Using the Foundation Class

MDC Snackbar ships with an `MDCSnackbarFoundation` class that external frameworks and libraries can
use to integrate the component. As with all foundation classes, an adapter object must be provided.
The adapter for snackbars must provide the following functions, with correct signatures:

| Method Signature | Description |
| --- | --- |
| `addClass(className: string) => void` | Adds a class to the root element. |
| `removeClass(className: string) => void` | Removes a class from the root element. |
| `setAriaHidden() => void` | Sets `aria-hidden="true"` on the root element. |
| `unsetAriaHidden() => void` | Removes the `aria-hidden` attribute from the root element. |
| `setActionAriaHidden() => void` | Sets `aria-hidden="true"` on the action element. |
| `unsetActionAriaHidden() => void` | Removes the `aria-hidden` attribute from the action element. |
| `setActionText(actionText: string) => void` | Set the text content of the action element. |
| `setMessageText(message: string) => void` | Set the text content of the message element. |
| `setFocus() => void` | Sets focus on the action button. |
| `visibilityIsHidden() => boolean` | Returns document.hidden property. |
| `registerBlurHandler(handler: EventListener) => void` | Registers an event handler to be called when a `blur` event is triggered on the action button |
| `deregisterBlurHandler(handler: EventListener) => void` | Deregisters a `blur` event handler from the actionButton |
| `registerVisibilityChangeHandler(handler: EventListener) => void` | Registers an event handler to be called when a 'visibilitychange' event occurs |
| `deregisterVisibilityChangeHandler(handler: EventListener) => void` | Deregisters an event handler to be called when a 'visibilitychange' event occurs |
| `registerCapturedInteractionHandler(evtType: string, handler: EventListener) => void` | Registers an event handler to be called when the given event type is triggered on the `body` |
| `deregisterCapturedInteractionHandler(evtType: string, handler: EventListener) => void` | Deregisters an event handler from the `body` |
| `registerActionClickHandler(handler: EventListener) => void` | Registers an event handler to be called when a `click` event is triggered on the action element. |
| `deregisterActionClickHandler(handler: EventListener) => void` | Deregisters an event handler from a `click` event on the action element. This will only be called with handlers that have previously been passed to `registerActionClickHandler` calls. |
| `registerTransitionEndHandler(handler: EventListener) => void` | Registers an event handler to be called when an `transitionend` event is triggered on the root element. Note that you must account for vendor prefixes in order for this to work correctly. |
| `deregisterTransitionEndHandler(handler: EventListener) => void` | Deregisters an event handler from an `transitionend` event listener. This will only be called with handlers that have previously been passed to `registerTransitionEndHandler` calls. |
| `notifyShow() => void` | Dispatches an event notifying listeners that the snackbar has been shown. |
| `notifyHide() => void` | Dispatches an event notifying listeners that the snackbar has been hidden. |

## Avoiding Flash-Of-Unstyled-Content (FOUC)

If you are loading the `mdc-snackbar` CSS asynchronously, you may experience a brief flash-of-unstyled-content (FOUC) due to the
snackbar's translate transition running once the CSS loads. To avoid this temporary FOUC, you can add the following simple style
before the `mdc-snackbar` CSS is loaded:

```css
.mdc-snackbar { transform: translateY(100%); }
```
This will move the snackbar offscreen until the CSS is fully loaded and avoids a translate transition upon load.
