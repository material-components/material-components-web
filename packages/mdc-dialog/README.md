<!--docs:
title: "Dialogs"
layout: detail
section: components
excerpt: "Modal dialogs."
iconId: dialog
path: /catalog/dialogs/
-->

# Dialogs

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/dialog.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/dialogs.png" width="714" alt="Dialogs screenshot">
  </a>
</div>-->

The MDC Dialog component is a spec-aligned dialog component adhering to the
[Material Design dialog pattern](https://material.io/guidelines/components/dialogs.html).
It implements a modal dialog window. You may notice that full screen components outlined in the dialog spec
do not appear in MDC Dialog. This is because they have been deemed to be outside of the scope of what
a dialog should be.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/dialogs.html">Material Design guidelines: Dialogs</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/dialog.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/dialog
```

## Dialog usage

Dialogs inform users about a specific task and may contain critical information or require decisions.

```html
<aside id="my-mdc-dialog"
  class="mdc-dialog"
  role="alertdialog"
  aria-labelledby="my-mdc-dialog-label"
  aria-describedby="my-mdc-dialog-description">
  <div class="mdc-dialog__surface">
    <header class="mdc-dialog__header">
      <h2 id="my-mdc-dialog-label" class="mdc-dialog__header__title">
        Use Google's location service?
      </h2>
    </header>
    <section id="my-mdc-dialog-description" class="mdc-dialog__body">
      Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
    </section>
    <footer class="mdc-dialog__footer">
      <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel">Decline</button>
      <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept">Accept</button>
    </footer>
  </div>
  <div class="mdc-dialog__backdrop"></div>
</aside>
```

In the example above, we've created a dialog box in an `aside` element. Note that you can place content inside
the dialog. There are two types: dialog & dialogs with scrollable content. These are declared using CSS classes.

In most cases, dialog content should be able to fit without scrolling. However, certain special cases call for the
ability to scroll the dialog's contents (see "Scrollable content exception" under
[Behavior](https://material.io/guidelines/components/dialogs.html#dialogs-behavior)). For these special cases, there is
a `mdc-dialog__body--scrollable` modifier to allow scrolling in the dialog.

> **Note**: The body of a scrollable dialog is styled with a default max-height; this can be overridden as necessary via
> the `.mdc-dialog__body--scrollable` selector.

```html
  <aside id="mdc-dialog-with-list"
    class="mdc-dialog"
    role="alertdialog"
    aria-labelledby="mdc-dialog-with-list-label"
    aria-describedby="mdc-dialog-with-list-description">
    <div class="mdc-dialog__surface">
      <header class="mdc-dialog__header">
        <h2 id="mdc-dialog-with-list-label" class="mdc-dialog__header__title">
          Choose a Ringtone
        </h2>
      </header>
      <section id="mdc-dialog-with-list-description" class="mdc-dialog__body mdc-dialog__body--scrollable">
       	<ul class="mdc-list">
          <li class="mdc-list-item">None</li>
          <li class="mdc-list-item">Callisto</li>
          <li class="mdc-list-item">Ganymede</li>
          <li class="mdc-list-item">Luna</li>
          <li class="mdc-list-item">Marimba</li>
          <li class="mdc-list-item">Schwifty</li>
          <li class="mdc-list-item">Callisto</li>
          <li class="mdc-list-item">Ganymede</li>
          <li class="mdc-list-item">Luna</li>
          <li class="mdc-list-item">Marimba</li>
          <li class="mdc-list-item">Schwifty</li>
        </ul>
      </section>
      <footer class="mdc-dialog__footer">
        <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel">Decline</button>
        <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept">Accept</button>
      </footer>
    </div>
    <div class="mdc-dialog__backdrop"></div>
  </aside>
```

Note that unlike the css classnames, the specific ID names used do not have to be _exactly_ the same as listed above.
They only need to match the values set for their corresponding aria attributes.

### Dialog Action Color ###

Dialog actions use system colors by default, but you can use a contrasting color, such as the palette’s secondary color, to distinguish dialog actions from dialog content. To emphasize an action from other contents, add `mdc-dialog__action` to `mdc-button` to apply secondary color.

```html
<aside class="mdc-dialog">
  <div class="mdc-dialog__surface">
    <footer class="mdc-dialog__footer">
      <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--cancel">Decline</button>
      <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog__footer__button--accept mdc-dialog__action">Accept</button>
    </footer>
  </div>
</aside>
```

### Using the Component

MDC Dialog ships with a Component / Foundation combo which allows for frameworks to richly integrate the
correct dialog behaviors into idiomatic components.

#### Including in code

##### ES2015

```javascript
import {MDCDialog, MDCDialogFoundation, util} from '@material/dialog';
```

##### CommonJS

```javascript
const mdcDialog = require('@material/dialog');
const MDCDialog = mdcDialog.MDCDialog;
const MDCDialogFoundation = mdcDialog.MDCDialogFoundation;
const util = mdcDialog.util;
```

##### AMD

```javascript
require(['path/to/@material/dialog'], mdcDialog => {
  const MDCDialog = mdcDrawer.MDCDialog;
  const MDCDialogFoundation = mdcDialog.MDCDialogFoundation;
  const util = mdcDialog.util;
});
```

##### Global

```javascript
const MDCDialog = mdc.dialog.MDCDialog;
const MDCDialogFoundation = mdc.dialog.MDCDialogFoundation;
const util = mdc.dialog.util;
```

#### Automatic Instantiation

If you do not care about retaining the component instance for the dialog, simply call `attachTo()`
and pass it a DOM element. This however, is only useful if you do not need to pass a callback to the dialog
when the user selects Accept or Cancel.

```javascript
mdc.dialog.MDCDialog.attachTo(document.querySelector('#my-mdc-dialog'));
```

#### Manual Instantiation

Dialogs can easily be initialized using their default constructors as well, similar to `attachTo`.

```javascript
import {MDCDialog} from '@material/dialog';

const dialog = new MDCDialog(document.querySelector('#my-mdc-dialog'));
```

#### Using the dialog component
```js
var dialog = new mdc.dialog.MDCDialog(document.querySelector('#mdc-dialog-default'));

dialog.listen('MDCDialog:accept', function() {
  console.log('accepted');
})

dialog.listen('MDCDialog:cancel', function() {
  console.log('canceled');
})

document.querySelector('#default-dialog-activation').addEventListener('click', function (evt) {
  dialog.lastFocusedTarget = evt.target;
  dialog.show();
})
```

### Dialog component API

#### MDCDialog.open

Boolean. True when the dialog is shown, false otherwise.

#### MDCDialog.show() => void

Shows the dialog

#### MDCDialog.close() => void

Closes the dialog

### Dialog Events

#### MDCDialog:accept

Broadcast when a user actions on the `.mdc-dialog__footer__button--accept` element.

#### MDCDialog:cancel

Broadcast when a user actions on the `.mdc-dialog__footer__button--cancel` element.

### Using the Foundation Class

MDC Dialog ships with an `MDCDialogFoundation` class that external frameworks and libraries can
use to integrate the component. As with all foundation classes, an adapter object must be provided.

> **NOTE**: Components themselves must manage adding ripples to dialog buttons, should they choose to
do so. We provide instructions on how to add ripples to buttons within the [mdc-button README](../mdc-button#adding-ripples-to-buttons).

### Adapter API

| Method Signature | Description |
| --- | --- |
| `addClass(className: string) => void` | Adds a class to the root element. |
| `removeClass(className: string) => void` | Removes a class from the root element. |
| `setStyle(propertyName: string, value: string) => void` | Sets a style property `propertyName` on the root element to the `value` specified |
| `addBodyClass(className: string) => void` | Adds a class to the body. |
| `removeBodyClass(className: string) => void` | Removes a class from the body. |
| `eventTargetHasClass(target: EventTarget, className: string) => boolean` | Returns true if target has className, false otherwise. |
| `registerInteractionHandler(evt: string, handler: EventListener) => void` | Adds an event listener to the root element, for the specified event name. |
| `deregisterInteractionHandler(evt: string, handler: EventListener) => void` | Removes an event listener from the root element, for the specified event name. |
| `registerSurfaceInteractionHandler(evt: string, handler: EventListener) => void` | Registers an event handler on the dialog surface element. |
| `deregisterSurfaceInteractionHandler(evt: string, handler: EventListener) => void` | Deregisters an event handler from the dialog surface element. |
| `registerDocumentKeydownHandler(handler: EventListener) => void` | Registers an event handler on the `document` object for a `keydown` event. |
| `deregisterDocumentKeydownHandler(handler: EventListener) => void` | Deregisters an event handler on the `document` object for a `keydown` event. |
| `registerTransitionEndHandler: (handler: EventListener) => void` | Registers an event handler to be called when a transitionend event is triggered on the dialog container sub-element element. |
| `deregisterTransitionEndHandler: (handler: EventListener) => void` | Deregisters an event handler from a transitionend event listener. This will only be called with handlers that have previously been passed to registerTransitionEndHandler calls. |
| `notifyAccept() => {}` | Broadcasts an event denoting that the user has accepted the dialog. |
| `notifyCancel() => {}` | Broadcasts an event denoting that the user has cancelled the dialog. |
| `isDialog(el: Element) => boolean` | Returns boolean indicating whether the provided element is the dialog surface element. |
| `trapFocusOnSurface() => {}` | Sets up the DOM which the dialog is contained in such that focusability is restricted to the elements on the dialog surface (see [Handling Focus Trapping](#handling-focus-trapping) below for more details). |
| `untrapFocusOnSurface() => {}` | Removes any affects of focus trapping on the dialog surface from the DOM (see [Handling Focus Trapping](#handling-focus-trapping) below for more details). |

#### Handling Focus Trapping

In order for dialogs to be fully accessible, they must conform to the guidelines outlined in
https://www.w3.org/TR/wai-aria-practices/#dialog_modal. The main implication of these guidelines is
that the only focusable elements are those contained within a dialog surface.

Trapping focus correctly for a modal dialog requires a complex set of events and interaction
patterns that we feel is best not duplicated within the logic of this component. Furthermore,
frameworks and libraries may have their own ways of trapping focus that framework authors may want
to make use of. For this reason, we have two methods on the adapter that should be used to handle
focus trapping:

- *trapFocusOnSurface()* is called when the dialog is open and should set up focus trapping adhering
  to the ARIA practices in the link above.
- *untrapFocusOnSurface()* is called when the dialog is closed and should tear down any focus
  trapping set up when the dialog was open.

In our `MDCDialog` component, we use the [focus-trap](https://github.com/davidtheclark/focus-trap)
package to handle this. **You can use [util.createFocusTrapInstance](#mdcdialog-util-api) to easily
create a focus trapping solution for your component code.**

### The full foundation API

#### MDCDialogFoundation.open() => void

Opens the dialog, registers appropriate event listeners, sets aria attributes, focuses elements.

#### MDCDialogFoundation.close() => void

Closes the dialog, deregisters appropriate event listeners, resets aria attributes, focuses
elements.

#### MDCDialogFoundation.accept(notifyChange = false) => void

Closes the dialog. If `notifyChange` is true, calls the adapter's `notifyAccept()` method.

#### MDCDialogFoundation.cancel(notifyChange = false) => void

Closes the dialog. If `notifyChange` is true, calls the adapter's `notifyCancel()` method.

#### MDCDialogFoundation.isOpen() => Boolean

Returns true if the dialog is open, false otherwise.

### MDCDialog Util API

#### util.createFocusTrapInstance(surfaceEl, acceptButtonEl, focusTrapFactory = require('focus-trap')) => {activate: () => {}, deactivate: () => {}};

Given a dialog surface element, an accept button element, and an optional focusTrap factory
function, creates a properly configured [focus-trap](https://github.com/davidtheclark/focus-trap)
instance such that:

- The focus is trapped within the `surfaceEl`
- The `acceptButtonEl` receives focus when the focus trap is activated
- Pressing the `escape` key deactivates focus
- Clicking outside the dialog deactivates focus
- Focus is returned to the previously focused element before the focus trap was activated

This focus trap instance can be used to implement the `trapFocusOnSurface` and
`untrapFocusOnSurface` adapter methods by calling `instance.activate()` and `instance.deactivate()`
respectively within those methods.

The `focusTrapFactory` can be used to override the `focus-trap` function used to create the focus
trap. It's API is the same as focus-trap's [createFocusTrap](https://github.com/davidtheclark/focus-trap#focustrap--createfocustrapelement-createoptions) (which is what it defaults to). You can pass in a custom function for mocking out the
actual function within tests, or to modify the arguments passed to the function before it's called.
