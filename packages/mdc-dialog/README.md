# MDC Dialog

The MDC Dialog component is a spec-aligned dialog component adhering to the
[Material Design dialog pattern](https://material.google.com/patterns/navigation-dialog.html).
It implements a modal dialog window.

## Installation

```
npm install --save @material/dialog
```

## Dialog usage

Dialogs inform users about a specific task and may contain critical information, require decisions, or involve multiple tasks.


```html
> TODO: example 
```

In the example above, we've created a dialog box in an `aside` element. Note that you can place content inside the dialog.

> TODO: Give examples of the type of dialogs
>
> Simple Dialog
> Navigation Dialog
> Navigation Autocomplete Dialog
> Scrolling Dialog

CSS classes:

| Class                                  | Description                                                                |
| -------------------------------------- | -------------------------------------------------------------------------- |
| `mdc-dialog`                           | Mandatory. Needs to be set on the root element of the component.           |


> TODO: Convert this stuff to dialog instead of drawer
### Using the Component

MDC Dialog ships with a Component / Foundation combo which allows for frameworks to richly integrate the
correct dialog behaviors into idiomatic components.

#### Including in code

##### ES2015

```javascript
import {MDCTemporaryDrawer, MDCTemporaryDrawerFoundation} from 'mdc-drawer';
```

##### CommonJS

```javascript
const mdcDrawer = require('mdc-drawer');
const MDCTemporaryDrawer = mdcDrawer.MDCTemporaryDrawer;
const MDCTemporaryDrawerFoundation = mdcDrawer.MDCTemporaryDrawerFoundation;
```

##### AMD

```javascript
require(['path/to/mdc-drawer'], mdcDrawer => {
  const MDCTemporaryDrawer = mdcDrawer.MDCTemporaryDrawer;
  const MDCTemporaryDrawerFoundation = mdcDrawer.MDCTemporaryDrawerFoundation;
});
```

##### Global

```javascript
const MDCTemporaryDrawer = mdc.drawer.MDCTemporaryDrawer;
const MDCTemporaryDrawerFoundation = mdc.drawer.MDCTemporaryDrawerFoundation;
```

#### Automatic Instantiation

If you do not care about retaining the component instance for the temporary drawer, simply call `attachTo()`
and pass it a DOM element.  

```javascript
mdc.drawer.MDCTemporaryDrawer.attachTo(document.querySelector('.mdc-temporary-drawer'));
```

#### Manual Instantiation

Temporary drawers can easily be initialized using their default constructors as well, similar to `attachTo`.

```javascript
import {MDCTemporaryDrawer} from 'mdc-drawer';

const drawer = new MDCTemporaryDrawer(document.querySelector('.mdc-temporary-drawer'));
```

### Using the Foundation Class

MDC Temporary Drawer ships with an `MDCTemporaryDrawerFoundation` class that external frameworks and libraries can
use to integrate the component. As with all foundation classes, an adapter object must be provided.
The adapter for temporary drawers must provide the following functions, with correct signatures:

| Method Signature | Description |
| --- | --- |
| `addClass(className: string) => void` | Adds a class to the root element. |
| `removeClass(className: string) => void` | Removes a class from the root element. |
| `hasClass(className: string) => boolean` | Returns boolean indicating whether element has a given class. |
| `hasNecessaryDom() => boolean` | Returns boolean indicating whether the necessary DOM is present (namely, the `mdc-temporary-drawer__drawer` drawer container). |
| `registerInteractionHandler(evt: string, handler: EventListener) => void` | Adds an event listener to the root element, for the specified event name. |
| `deregisterInteractionHandler(evt: string, handler: EventListener) => void` | Removes an event listener from the root element, for the specified event name. |
| `registerDrawerInteractionHandler(evt: string, handler: EventListener) => void` | Adds an event listener to the drawer container sub-element, for the specified event name. |
| `deregisterDrawerInteractionHandler(evt: string, handler: EventListener) => void` | Removes an event listener from drawer container sub-element, for the specified event name. |
| `registerTransitionEndHandler(handler: EventListener) => void` | Registers an event handler to be called when a `transitionend` event is triggered on the drawer container sub-element element. |
| `deregisterTransitionEndHandler(handler: EventListener) => void` | Deregisters an event handler from a `transitionend` event listener. This will only be called with handlers that have previously been passed to `registerTransitionEndHandler` calls. |
| `registerDocumentKeydownHandler(handler: EventListener) => void` | Registers an event handler on the `document` object for a `keydown` event. |
| `deregisterDocumentKeydownHandler(handler: EventListener) => void` | Deregisters an event handler on the `document` object for a `keydown` event. |
| `getDrawerWidth() => number` | Returns the current drawer width, in pixels. |
| `setTranslateX(value: number) => void` | Sets the current position for the drawer, in pixels from the border. |
| `updateCssVariable(value: string) => void` | Sets a CSS custom property, for controlling the current background opacity when manually dragging the drawer. |
| `getFocusableElements() => NodeList` | Returns the node list of focusable elements inside the drawer. |
| `saveElementTabState(el: Element) => void` | Saves the current tab index for the element in a data property. |
| `restoreElementTabState(el: Element) => void` | Restores the saved tab index (if any) for an element. |
| `makeElementUntabbable(el: Element) => void` | Makes an element untabbable. |
| `isRtl() => boolean` | Returns boolean indicating whether the current environment is RTL. |
| `isDrawer(el: Element) => boolean` | Returns boolean indicating whether the provided element is the drawer container sub-element. |
