# MDC Dialog

The MDC Dialog component is a spec-aligned dialog component adhering to the
[Material Design dialog pattern](https://material.io/guidelines/components/dialogs.html).
It implements a modal dialog window. You may notice that full screen components outlined in the dialog spec
do not appear in MDC Dialog. This is because they have been deemed to be outside of the scope of what
a dialog should be.

## Installation

```
npm install --save @material/dialog
```

## Dialog usage

Dialogs inform users about a specific task and may contain critical information or require decisions.  

```html
<aside id="my-mdc-dialog"
  class="mdc-dialog"
  role="alertdialog"
  aria-hidden="true"
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

> **NOTE**: The `.mdc-dialog__footer__button--accept` element _must_ be the _final focusable element_ within the dialog
in order for this component to function properly.

In the example above, we've created a dialog box in an `aside` element. Note that you can place content inside 
the dialog. There are two types: dialog & dialogs with scrollable content. These are declared using CSS classes.

Some dialogs will not be tall enough to accomodate everything you would like to display in them. For this there is a 
`mdc-dialog__body--scrollable` modifier to allow scrolling in the dialog.

```html
  <aside id="mdc-dialog-with-list"
    class="mdc-dialog"
    role="alertdialog"
    aria-hidden="true"
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

### Using the Component

MDC Dialog ships with a Component / Foundation combo which allows for frameworks to richly integrate the
correct dialog behaviors into idiomatic components.

#### Including in code

##### ES2015

```javascript
import {MDCDialog, MDCDialogFoundation} from 'mdc-dialog';
```

##### CommonJS

```javascript
const mdcDialog = require('mdc-dialog');
const MDCDialog = mdcDialog.MDCDialog;
const MDCDialogFoundation = mdcDialog.MDCDialogFoundation;
```

##### AMD

```javascript
require(['path/to/mdc-dialog'], mdcDialog => {
  const MDCDialog = mdcDrawer.MDCDialog;
  const MDCDialogFoundation = mdcDialog.MDCDialogFoundation;
});
```

##### Global

```javascript
const MDCDialog = mdc.dialog.MDCDialog;
const MDCDialogFoundation = mdc.dialog.MDCDialogFoundation;
```

#### Automatic Instantiation

If you do not care about retaining the component instance for the temporary drawer, simply call `attachTo()`
and pass it a DOM element. This however, is only useful if you do not need to pass a callback to the dialog
when the user selects Accept or Cancel.

```javascript
mdc.dialog.MDCDialog.attachTo(document.querySelector('#my-mdc-dialog'));
```

#### Manual Instantiation

Dialogs can easily be initialized using their default constructors as well, similar to `attachTo`. 

```javascript
import {MDCDialog} from 'mdc-dialog';

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

#### MDCDialog.lastFocusedTarget

EventTarget, usually an HTMLElement. Represents the element that was focused on the page before the dialog is shown. If set, 
the dialog will return focus to this element when closed. _This property should be set before calls to show()_.


#### MDCDialog.initialize() => void

Attaches ripples to the dialog footer buttons

#### MDCDialog.destroy() => void

Cleans up ripples when dialog is destroyed

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
do so. We provide instructions on how to add ripples to buttons within the [mdc-button README](https://github.com/material-components/material-components-web/tree/master/packages/mdc-button#adding-ripples-to-buttons).

### Adapter API

| Method Signature | Description |
| --- | --- |
| `hasClass(className: string) => boolean` | Returns boolean indicating whether the root has a given class. |
| `addClass(className: string) => void` | Adds a class to the root element. |
| `removeClass(className: string) => void` | Removes a class from the root element. |
| `setAttr(attr: string, val: string) => void` | Sets the given attribute to the given value on the root element. |
| `addBodyClass(className: string) => void` | Adds a class to the body. |
| `removeBodyClass(className: string) => void` | Removes a class from the body. |
| `eventTargetHasClass(target: EventTarget, className: string) => boolean` | Returns true if target has className, false otherwise. |
| `registerInteractionHandler(evt: string, handler: EventListener) => void` | Adds an event listener to the root element, for the specified event name. |
| `deregisterInteractionHandler(evt: string, handler: EventListener) => void` | Removes an event listener from the root element, for the specified event name. |
| `registerSurfaceInteractionHandler(evt: string, handler: EventListener) => void` | Registers an event handler on the dialog surface element. |
| `deregisterSurfaceInteractionHandler(evt: string, handler: EventListener) => void` | Deregisters an event handler from the dialog surface element. |
| `registerDocumentKeydownHandler(handler: EventListener) => void` | Registers an event handler on the `document` object for a `keydown` event. |
| `deregisterDocumentKeydownHandler(handler: EventListener) => void` | Deregisters an event handler on the `document` object for a `keydown` event. |
| `registerFocusTrappingHandler(handler: EventListener) => void` | Registers a focus event listener with a given handler at the capture phase on the document. |
| `deregisterFocusTrappingHandler(handler: EventListener) => void` | Deregisters a focus event listener from a given handler at the capture phase on the document. |
| `numFocusableTargets() => number` | Returns the number of focusable elements in the dialog |
| `setDialogFocusFirstTarget() => void` | Resets focus to the first focusable element in the dialog |
| `setInitialFocus() => void` | Sets focus on the `mdc-dialog__footer__button--accept` element. |
| `getFocusableElements() => Array<Element>` | Returns the list of focusable elements inside the dialog. |
| `saveElementTabState(el: Element) => void` | Saves the current tab index for the element in a way which it can be retrieved later on. |
| `restoreElementTabState(el: Element) => void` | Restores the saved tab index (if any) for an element. |
| `makeElementUntabbable(el: Element) => void` | Makes an element untabbable, e.g. by setting the `tabindex` to `-1`. |
| `setBodyAttr(attr: string, val: string) => void` | Sets the given attribute to the given value on the body element. |
| `rmBodyAttr(attr: string) => void` | Removes the given attribute from the body element. |
| `getFocusedTarget() => Element` | Returns the currently focused element, e.g. `document.activeElement`. |
| `setFocusedTarget(target: EventTarget) => void` | Sets focus on the given target, e.g. by calling `focus()` |
| `notifyAccept() => {}` | Broadcasts an event denoting that the user has accepted the dialog. |
| `notifyCancel() => {}` | Broadcasts an event denoting that the user has cancelled the dialog. |


### The full foundation API

#### MDCDialogFoundation.open() => void 

Opens the dialog, registers appropriate event listners, sets aria attributes, focuses elements.

#### MDCDialogFoundation.close() => void 

Closes the dialog, deregisters appropriate event listners, resets aria attributes, focuses elements.

#### MDCDialogFoundation.accept(notifyChange = false) => void 

Closes the dialog. If `notifyChange` is true, calls the adapter's `notifyAccept()` method.

#### MDCDialogFoundation.cancel(notifyChange = false) => void 

Closes the dialog. If `notifyChange` is true, calls the adapter's `notifyCancel()` method.

#### MDCDialogFoundation.isOpen() => Boolean 

Returns true if the dialog is open, false otherwise.

## Theming - Dark Theme Considerations

When using `mdc-theme--dark` / `mdc-dialog--theme-dark`, the dialog by default sets its background color to `#303030`. You can override this by either overridding the
`--mdc-dialog-dark-theme-bg-color`, overridding the `$mdc-dialog-dark-theme-bg-color` sass variable, or directly in CSS:

```css
.mdc-theme--dark .mdc-dialog__surface,
.mdc-dialog--theme-dark .mdc-dialog__surface {
  background-color: /* custom bg color */;
}
```
