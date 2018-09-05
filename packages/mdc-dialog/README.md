<!--docs:
title: "Dialogs"
layout: detail
section: components
excerpt: "Modal dialogs."
iconId: dialog
path: /catalog/dialogs/
-->

# Dialog

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components.github.io/material-components-web-catalog/#/component/dialog">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/dialogs.png" width="714" alt="Dialogs screenshot">
  </a>
</div>-->

[Dialogs](https://material.io/go/design-dialogs) inform users about a task and can contain critical information,
require decisions, or involve multiple tasks.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-dialogs">Material Design guidelines: Dialogs</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/dialog">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/dialog
```

## Basic Usage

```html
<div id="test-dialog"
     class="mdc-dialog"
     role="alertdialog"
     aria-modal="true"
     aria-labelledby="test-dialog-title"
     aria-describedby="test-dialog-content">
  <div class="mdc-dialog__container">
    <!-- Title cannot contain leading whitespace due to a technical limitation in mdc-typography-baseline-top(). -->
    <h2 class="mdc-dialog__title" id="test-dialog-title"><!--
   -->Use Google's location service?<!--
 --></h2>
    <section class="mdc-dialog__content" id="test-dialog-content">
      Let Google help apps determine location. This means sending anonymous location data to Google, even when no apps are running.
    </section>
    <footer class="mdc-dialog__actions">
      <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">Decline</button>
      <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes">OK</button>
    </footer>
  </div>
  <div class="mdc-dialog__scrim"></div>
</div>
```

> **Note**: Dialogs have default `max-width` and `max-height` values that can be overridden via the
> `mdc-dialog-max-width()` and `mdc-dialog-max-height()` Sass mixins.

> **Note**: Titles cannot contain leading whitespace due to how `mdc-typography-baseline-top()` works.

```html
<div id="test-dialog-with-list"
     class="mdc-dialog"
     role="alertdialog"
     aria-modal="true"
     aria-labelledby="test-dialog-with-list-label"
     aria-describedby="test-dialog-with-list-description">
  <div class="mdc-dialog__container">
    <!-- Title cannot contain leading whitespace due to a technical limitation in mdc-typography-baseline-top(). -->
    <h2 class="mdc-dialog__title" id="test-dialog-with-list-label"><!--
   -->Choose a Ringtone<!--
 --></h2>
    <section class="mdc-dialog__content" id="test-dialog-with-list-description">
      <ul class="mdc-list">
        <li class="mdc-list-item">
          <span class="mdc-list-item__text">None</span>
        </li>
        <li class="mdc-list-item">
          <span class="mdc-list-item__text">Callisto</span>
        </li>
        <li class="mdc-list-item">
          <span class="mdc-list-item__text">Ganymede</span>
        </li>
        <li class="mdc-list-item">
          <span class="mdc-list-item__text">Luna</span>
        </li>
        <li class="mdc-list-item">
          <span class="mdc-list-item__text">Marimba</span>
        </li>
        <li class="mdc-list-item">
          <span class="mdc-list-item__text">Schwifty</span>
        </li>
        <li class="mdc-list-item">
          <span class="mdc-list-item__text">Callisto</span>
        </li>
        <li class="mdc-list-item">
          <span class="mdc-list-item__text">Ganymede</span>
        </li>
        <li class="mdc-list-item">
          <span class="mdc-list-item__text">Luna</span>
        </li>
        <li class="mdc-list-item">
          <span class="mdc-list-item__text">Marimba</span>
        </li>
        <li class="mdc-list-item">
          <span class="mdc-list-item__text">Schwifty</span>
        </li>
      </ul>
    </section>
    <footer class="mdc-dialog__actions">
      <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">Decline</button>
      <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes">OK</button>
    </footer>
  </div>
  <div class="mdc-dialog__scrim"></div>
</div>
```

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-dialog` | Mandatory. The root DOM element containing the surface and the container.
`mdc-dialog--animating` | Optional. Indicates that the dialog is in the process of animating open or closed.
`mdc-dialog--open` | Optional. Indicates that the dialog is open and visible.
`mdc-dialog__actions` | Optional. Footer area containing the dialog's action buttons.
`mdc-dialog__button` | Optional. Individual action button. Typically paired with `mdc-button`.
`mdc-dialog__container` | Mandatory. Wrapper element needed to make flexbox behave in IE 11.
`mdc-dialog__content` | Optional. Primary content area. Can contain a list, a form, or prose.
`mdc-dialog__scrim` | Mandatory. Semitransparent backdrop that displays behind a dialog.
`mdc-dialog__surface` | Mandatory. The bounding box for the dialog's content.
`mdc-dialog__title` | Optional. Brief summary of the dialog's purpose.

## JS Classes

### `MDCDialog` Properties and Methods

Property | Value Type | Description
--- | --- | ---
`open` | `boolean` | Returns whether the dialog is open or not.

Method Signature | Description
--- | ---
`layout() => void` | Recalculates layout and automatically adds/removes modifier classes like `--scrollable`.
`show() => void` | Opens the dialog.
`close() => void` | Closes the dialog.

### `MDCDialogFoundation` Methods

Property | Value Type | Description
--- | --- | ---
`open` | `boolean` | Returns whether the dialog is open or not.

Method Signature | Description
--- | ---
`open()` | Opens the dialog.
`close(action)` | Closes the dialog with an optional "action" param denoting the reason the dialog was closed.
`isOpen()` | Returns `true` if the dialog is open, or `false` if it is closed.
`layout()` | Recalculates layout and automatically adds/removes modifier classes like `--scrollable`.

### `MDCDialogAdapter` Methods

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element.
`removeClass(className: string) => void` | Removes a class from the root element.
`addBodyClass(className: string) => void` | Adds a class to the `<body>`.
`removeBodyClass(className: string) => void` | Removes a class from the `<body>`.
`eventTargetHasClass(target: !EventTarget, className: string) => void` | Returns `true` if the target element has the given CSS class, otherwise `false`.
`eventTargetMatchesSelector(target: !EventTarget, selector: string) => void` | Returns `true` if the target element matches the given CSS selector, otherwise `false`.
`registerInteractionHandler(eventName: string, handler: !EventListener) => void` | Adds an event listener to the root element for the specified event name.
`deregisterInteractionHandler(eventName: string, handler: !EventListener) => void` | Removes an event listener from the root element for the specified event name.
`registerDocumentHandler(eventName: string, handler: !EventListener) => void` | Adds an event listener to the `document` for the specified event name.
`deregisterDocumentHandler(eventName: string, handler: !EventListener) => void` | Removes an event listener from the `document` for the specified event name.
`registerWindowHandler(eventName: string, handler: !EventListener) => void` | Adds an event listener to the `window` for the specified event name.
`deregisterWindowHandler(eventName: string, handler: !EventListener) => void` | Removes an event listener from the `window` for the specified event name.
`trapFocusOnSurface() => void` | Sets up the DOM which the dialog is contained in such that focusability is restricted to the elements on the dialog surface (see [Handling Focus Trapping](#handling-focus-trapping) below for more details).
`untrapFocusOnSurface() => void` | Removes any affects of focus trapping on the dialog surface from the DOM (see [Handling Focus Trapping](#handling-focus-trapping) below for more details).
`isContentScrollable() => boolean` | Returns `true` if `mdc-dialog__content` can be scrolled by the user, otherwise `false`.
`areButtonsStacked() => boolean` | Returns `true` if `mdc-dialog__action` buttons (`mdc-dialog__button`) are stacked vertically, otherwise `false` if they are side-by-side.
`getAction(element: !Element) => ?string` | Retrieves the value of a `data-*` attribute from the given element.
`notifyOpening() => void` | Broadcasts an event denoting that the dialog has just started to open.
`notifyOpened() => void` | Broadcasts an event denoting that the dialog has finished opening.
`notifyClosing(action: ?string) {}` | Broadcasts an event denoting that the dialog has just started closing.
`notifyClosed(action: ?string) {}` | Broadcasts an event denoting that the dialog has finished closing.

### The Util API

External frameworks and libraries can use the following utility methods when integrating a component.

Method Signature | Description
--- | ---
`createFocusTrapInstance(surfaceEl: !Element, initialFocusEl: ?Element, focusTrapFactory: function(): !focusTrap) => focusTrap` | Creates a properly configured [focus-trap][] instance.
`isScrollable(el) => boolean` | Determines if the given element is scrollable.
`areTopsMisaligned(els) => boolean` | Determines if two or more of the given elements have different `offsetTop` values.

### Handling Focus Trapping

In order for dialogs to be fully accessible, they must conform to the guidelines outlined in:
- https://www.w3.org/TR/wai-aria-practices/#dialog_modal
- https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html
- https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_dialog_role

The main implication of these guidelines is that the only focusable elements are those contained within a dialog
surface.

Trapping focus correctly for a modal dialog requires a complex set of events and interaction
patterns that we feel is best not duplicated within the logic of this component. Furthermore,
frameworks and libraries may have their own ways of trapping focus that framework authors may want
to make use of. For this reason, we have two methods on the adapter that should be used to handle
focus trapping:

- `trapFocusOnSurface()` is called when the dialog is open and should set up focus trapping adhering
  to the ARIA practices in the link above.
- `untrapFocusOnSurface()` is called when the dialog is closed and should tear down any focus
  trapping set up when the dialog was open.

In our `MDCDialog` component, we use the [focus-trap][] package to handle this.
**You can use `util.createFocusTrapInstance)_` (see below) to easily create
a focus trapping solution for your component code.**

[focus-trap]: https://github.com/davidtheclark/focus-trap

#### `createFocusTrapInstance()`

```js
const {activate, deactivate} =
  util.createFocusTrapInstance(surfaceEl, initialFocusEl, focusTrapFactory = require('focus-trap'));
```

Given a dialog surface element, an initial element to focus, and an optional focusTrap factory
function, such that:

- The focus is trapped within the `surfaceEl`
- The `initialFocusEl` receives focus when the focus trap is activated
- Pressing the `escape` key deactivates focus
- Clicking outside the dialog deactivates focus
- Focus is returned to the previously focused element before the focus trap was activated

This focus trap instance can be used to implement the `trapFocusOnSurface` and
`untrapFocusOnSurface` adapter methods by calling `instance.activate()` and `instance.deactivate()`
respectively within those methods.

The `focusTrapFactory` can be used to override the `focus-trap` function used to create the focus
trap. It's API is the same as focus-trap's [createFocusTrap](https://github.com/davidtheclark/focus-trap#focustrap--createfocustrapelement-createoptions) (which is what it defaults to). You can pass in a custom function for mocking out the
actual function within tests, or to modify the arguments passed to the function before it's called.
