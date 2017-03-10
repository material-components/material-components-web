# MDC Dialog

The MDC Dialog component is a spec-aligned dialog component adhering to the
[Material Design dialog pattern](https://material.google.com/patterns/navigation-dialog.html).
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
  aria-labelledby="mdc-dialog__label"
  aria-describedby="mdc-dialog__description">
  <div class="mdc-dialog__surface">
    <header class="mdc-dialog__header">
      <h2 id="mdc-dialog__label" class="mdc-dialog__header__title">
        Use Google's location service?
      </h2>
    </header>
    <section id="mdc-dialog__description" class="mdc-dialog__body">
      Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
    </section>
    <footer class="mdc-dialog__footer">
      <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog--cancel">DECLINE</button>
      <button type="button" class="mdc-button mdc-dialog__footer__button mdc-dialog--accept">ACCEPT</button>
    </footer>
  </div>
  <div class="mdc-dialog__backdrop"></div>
</aside>
```

In the example above, we've created a dialog box in an `aside` element. Note that you can place content inside 
the dialog. There are two types: dialog & dialogs with scrollable content. These are declared using CSS classes.

CSS classes:

| Class                                  | Description                                                                     |
| -------------------------------------- | ------------------------------------------------------------------------------- |
| `mdc-dialog`                           | Mandatory. Needs to be set on the root element of the component.                |
| `mdc-dialog__surface`                  | Mandatory. This element contains all of your dialog content.                    |
| `mdc-dialog__backdrop`                 | Mandatory. This element creates a semi-opaque scrim behind the dialog surface.  |
| `mdc-dialog__header`                   | Mandatory. This element is the dialog header.                                   |
| `mdc-dialog__header__title`            | Mandatory. This element is the dialog label and is used by aria.                |
| `mdc-dialog__body`                     | Mandatory. This element is the dialog's main content area and is used by aria.  |
| `mdc-dialog__footer`                   | Mandatory. This element is the ancestor of the accept and cancel buttons.       |
| `mdc-dialog--cancel`                   | Mandatory. This element is the accept button.                                   |
| `mdc-dialog--accept`                   | Mandatory. This element is the cancel button.                                   |


In the example, we also set some aria attributes with corresponding IDs on some elements.

Element attributes:

| Attribute                              | Description                                                                     |
| -------------------------------------- | ------------------------------------------------------------------------------- |
| `aria-hidden`                          | Initially set to true on root of the component.                                 |
| `aria-labelledby`                      | Set on the root, the value must be the ID of `.mdc-dialog__header__title`       |
| `aria-describedBy`                     | Set on the root, the value must be the ID of `.mdc-dialog__body`                |

Element IDs:

| ID                                     | Description                                                                     |
| -------------------------------------- | ------------------------------------------------------------------------------- |
| `mdc-dialog__label`                    | Mandatory. Corresponds to the value of `aira-labelledby` on the root element.   |
| `mdc-dialog__description`              | Mandatory. Corresponds to the value of `aira-describedby` on the root element.  |


### Using the Component

MDC Dialog ships with a Component / Foundation combo which allows for frameworks to richly integrate the
correct dialog behaviors into idiomatic components.

#### Including in code

##### ES2015

```javascript
import {MDCTDialog, MDCDialogFoundation} from 'mdc-dialog';
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

### Using the Foundation Class

MDC Dialog ships with an `MDCDialogFoundation` class that external frameworks and libraries can
use to integrate the component. As with all foundation classes, an adapter object must be provided.
The adapter for dialog must provide the following functions, with correct signatures:

| Method Signature | Description |
| --- | --- |
| `setBackgroundAriaHidden: (ariaHidden: Bool) => void` | Sets the `aria-hidden` attribute on the background content |
| `setDialogAriaHidden: (ariaHidden: Bool) => void` | Sets the `aria-hidden` attribute on the dialog surface |
| `addClass(className: string) => void` | Adds a class to the root element. |
| `removeClass(className: string) => void` | Removes a class from the root element. |
| `hasClass(className: string) => boolean` | Returns boolean indicating whether element has a given class. |
| `registerInteractionHandler(evt: string, handler: EventListener) => void` | Adds an event listener to the root element, for the specified event name. |
| `deregisterInteractionHandler(evt: string, handler: EventListener) => void` | Removes an event listener from the root element, for the specified event name. |
| `addScrollLockClass(className: string) => void` | Adds a class to prevent scrolling the dialog background when open. |
| `removeScrollLockClass(className: string) => void` | Removes a class which prevents scrolling the dialog background when open. |
| `registerDialogInteractionHandler: (evt: string, handler: EventListener) => void` | Registers an event handler to prevent pointer events from propagating past the dialog surface. |
| `deregisterDialogInteractionHandler: (evt: string, handler: EventListener) => void` | Deregisters an event handler to prevent pointer events from propagating past the dialog surface. |
| `registerDocumentKeydownHandler(handler: EventListener) => void` | Registers an event handler on the `document` object for a `keydown` event. |
| `deregisterDocumentKeydownHandler(handler: EventListener) => void` | Deregisters an event handler on the `document` object for a `keydown` event. |
| `registerFocusTrappingHandler: (handler: EventListener) => void` | Registers an event handler to help with focus trapping. |
| `deregisterFocusTrappingHandler: (handler: EventListener) => void` | Deregisters an event handler to help with focus trapping. |
| `getFocusableElements() => NodeList` | Returns the node list of focusable elements inside the drawer. |
| `saveElementTabState(el: Element) => void` | Saves the current tab index for the element in a data property. |
| `restoreElementTabState(el: Element) => void` | Restores the saved tab index (if any) for an element. |
| `makeElementUntabbable(el: Element) => void` | Makes an element untabbable. |
| `setAttribute: (elem: Element, attr: String, val: Boolean) => void`
| `acceptButton: (el: Element) => void` | This is your accept button |
| `cancelButton: (el: Element) => void` | This is your cancel button |
| `acceptAction: () => {}` | This function will be called when accept is selected |
| `cancelAction: () => {}` | This function will be called when cancel is selected or the backdrop is clicked |
