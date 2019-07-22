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

Dialogs inform users about a task and can contain critical information, require decisions, or involve multiple tasks.

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

### HTML Structure

```html
<div class="mdc-dialog"
     role="alertdialog"
     aria-modal="true"
     aria-labelledby="my-dialog-title"
     aria-describedby="my-dialog-content">
  <div class="mdc-dialog__container">
    <div class="mdc-dialog__surface">
      <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
      <h2 class="mdc-dialog__title" id="my-dialog-title"><!--
     -->Dialog Title<!--
   --></h2>
      <div class="mdc-dialog__content" id="my-dialog-content">
        Dialog body text goes here.
      </div>
      <footer class="mdc-dialog__actions">
        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="no">
          <span class="mdc-button__label">No</span>
        </button>
        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="yes">
          <span class="mdc-button__label">Yes</span>
        </button>
      </footer>
    </div>
  </div>
  <div class="mdc-dialog__scrim"></div>
</div>
```

> *NOTE*: Titles cannot contain leading whitespace due to how `mdc-typography-baseline-top()` works.

### Styles

```scss
@import "@material/dialog/mdc-dialog";
```

> *NOTE*: Styles for any components you intend to include within dialogs (e.g. List, Checkboxes, etc.) must also be
> imported.

### JavaScript Instantiation

```js
import {MDCDialog} from '@material/dialog';
const dialog = new MDCDialog(document.querySelector('.mdc-dialog'));
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

MDC Dialog makes no assumptions about what will be added to the `mdc-dialog__content` element. Any List, Checkboxes,
etc. must also be instantiated. If your dialog contains any layout-sensitive components, you should wait until
`MDCDialog:opened` is emitted to instantiate them (or call `layout` on them) so that the dialog's transition finishes
first.

For example, to instantiate an MDC List inside of a Simple or Confirmation Dialog:

```js
import {MDCList} from '@material/list';
const list = new MDCList(document.querySelector('.mdc-dialog .mdc-list'));

dialog.listen('MDCDialog:opened', () => {
  list.layout();
});
```

> *NOTE*: Mispositioned or incorrectly-sized elements (e.g. ripples, floating labels, notched outlines) are a strong
> indication that child components are being instantiated before the dialog has finished opening.

## Variants

### Simple Dialog

The Simple Dialog contains a list of potential actions. It does not contain buttons.

```html
<div class="mdc-dialog"
     role="alertdialog"
     aria-modal="true"
     aria-labelledby="my-dialog-title"
     aria-describedby="my-dialog-content">
  <div class="mdc-dialog__container">
    <div class="mdc-dialog__surface">
      <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
      <h2 class="mdc-dialog__title" id="my-dialog-title"><!--
     -->Choose a Ringtone<!--
   --></h2>
      <div class="mdc-dialog__content" id="my-dialog-content">
        <ul class="mdc-list mdc-list--avatar-list">
          <li class="mdc-list-item" tabindex="0" data-mdc-dialog-action="none">
            <span class="mdc-list-item__text">None</span>
          </li>
          <li class="mdc-list-item" data-mdc-dialog-action="callisto">
            <span class="mdc-list-item__text">Callisto</span>
          </li>
          <!-- ... -->
        </ul>
      </div>
    </div>
  </div>
  <div class="mdc-dialog__scrim"></div>
</div>
```

> Note the inclusion of the `mdc-list--avatar-list` class, which aligns with the Simple Dialog spec.

### Confirmation Dialog

The Confirmation Dialog contains a list of choices, and buttons to confirm or cancel. Choices are accompanied by
radio buttons (indicating single selection) or checkboxes (indicating multiple selection).

```html
<div class="mdc-dialog"
     role="alertdialog"
     aria-modal="true"
     aria-labelledby="my-dialog-title"
     aria-describedby="my-dialog-content">
  <div class="mdc-dialog__container">
    <div class="mdc-dialog__surface">
      <!-- Title cannot contain leading whitespace due to mdc-typography-baseline-top() -->
      <h2 class="mdc-dialog__title" id="my-dialog-title"><!--
     -->Choose a Ringtone<!--
   --></h2>
      <div class="mdc-dialog__content" id="my-dialog-content">
        <ul class="mdc-list">
          <li class="mdc-list-item" tabindex="0">
            <span class="mdc-list-item__graphic">
              <div class="mdc-radio">
                <input class="mdc-radio__native-control"
                       type="radio"
                       id="test-dialog-baseline-confirmation-radio-1"
                       name="test-dialog-baseline-confirmation-radio-group"
                       checked>
                <div class="mdc-radio__background">
                  <div class="mdc-radio__outer-circle"></div>
                  <div class="mdc-radio__inner-circle"></div>
                </div>
              </div>
            </span>
            <label id="test-dialog-baseline-confirmation-radio-1-label"
                   for="test-dialog-baseline-confirmation-radio-1"
                   class="mdc-list-item__text">None</label>
          </li>
          <!-- ... -->
        </ul>
      </div>
      <footer class="mdc-dialog__actions">
        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="close">
          <span class="mdc-button__label">Cancel</span>
        </button>
        <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="accept">
          <span class="mdc-button__label">OK</span>
        </button>
      </footer>
    </div>
  </div>
  <div class="mdc-dialog__scrim"></div>
</div>
```

> *NOTE*: In the example above, the Cancel button intentionally has the `close` action to align with the behavior of
> clicking the scrim or pressing the Escape key, allowing all interactions involving dismissal without taking an action
> to be detected the same way.

### Additional Information

#### Dialog Actions

All dialog variants support the concept of dialog actions. Any element within a dialog may include the
`data-mdc-dialog-action` attribute to indicate that interacting with it should close the dialog with the specified action.
This action is then reflected via `event.detail.action` in the `MDCDialog:closing` and `MDCDialog:closed` events.

Additionally, two interactions have defined actions by default:

* Clicking on the scrim
* Pressing the Escape key within the dialog

Both of these map to the `close` action by default. This can be accessed and customized via the component's
`scrimClickAction` and `escapeKeyAction` properties, respectively.

Setting either of these properties to an empty string will result in that interaction being disabled (i.e. the dialog
will no longer close in response to the interaction). Exercise caution when doing this - it should always be possible
for a user to dismiss the dialog.

Any action buttons within the dialog which equate strictly to a dismissal with no further action should also use the
`close` action; this will make it easy to handle all such interactions consistently, while separately handling other
actions.

#### Action Button Arrangement

As indicated in the [Dialog design article](https://material.io/design/components/dialogs.html#anatomy), buttons within
the `mdc-dialog__actions` element are arranged horizontally by default, with the confirming action _last_.

In cases where the button text is too long for all buttons to fit on a single line, the buttons are stacked vertically,
with the confirming action _first_.

MDC Dialog detects and handles this automatically by default, reversing the buttons when applying the stacked layout.
This automatic behavior can be disabled by setting `autoStackButtons` to `false` on the component instance:

```js
dialog.autoStackButtons = false;
```

This will also be disabled if the `mdc-dialog--stacked` modifier class is applied manually to the root element before the
component is instantiated, but note that dialog action button labels are recommended to be short enough to fit on a
single line if possible.

#### Default Action Button

MDC Dialog supports indicating that one of its action buttons represents the default action, triggered by pressing the
Enter key. This can be used e.g. for single-choice Confirmation Dialogs to accelerate the process of making a selection,
avoiding the need to tab through to the appropriate button to confirm the choice.

To indicate that a button represents the default action, add the `data-mdc-dialog-button-default` data attribute.
For example:
```html
...
<footer class="mdc-dialog__actions">
  <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="close">
    <span class="mdc-button__label">Cancel</span>
  </button>
  <button type="button" class="mdc-button mdc-dialog__button" data-mdc-dialog-action="accept" data-mdc-dialog-button-default>
    <span class="mdc-button__label">OK</span>
  </button>
</footer>
...
```

#### Actions and Selections

Dialogs which require making a choice via selection controls should initially disable any button which performs an
action if no choice is selected by default. MDC Dialog does not include built-in logic for this, since it aims to remain
as unopinionated as possible regarding dialog contents, aside from relaying information on which action is taken.

#### Accessibility

##### Using `aria-hidden` as a fallback for `aria-modal`

`aria-modal` is part of the ARIA 1.1 specification, and indicates to screen readers that they should confine themselves
to a single element. MDC Dialog recommends adding `aria-modal="true"` to the root element of its DOM structure; however,
not all user agents and screen readers properly honor this attribute.

The fallback is to apply `aria-hidden="true"` to all static content behind the dialog, when the dialog is open. This will
be easiest to achieve if all non-modal elements are under a single common ancestor under the body, so that `aria-hidden`
can be applied to one element.

```js
dialog.listen('MDCDialog:opened', function() {
  // Assuming contentElement references a common parent element with the rest of the page's content
  contentElement.setAttribute('aria-hidden', 'true');
});

dialog.listen('MDCDialog:closing', function() {
  contentElement.removeAttribute('aria-hidden');
});
```

> Note: The example above intentionally listens to the **opened** (not opening) event and the **closing** (not closed)
> event in order to avoid additional jumping between elements by screen readers due to one element becoming hidden
> before others become visible.

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-dialog` | Mandatory. The root DOM element containing the surface and the container.
`mdc-dialog__scrim` | Mandatory. Semitransparent backdrop that displays behind a dialog.
`mdc-dialog__container` | Mandatory. Wrapper element needed to ensure flexbox behavior in IE 11.
`mdc-dialog__surface` | Mandatory. The bounding box for the dialog's content.
`mdc-dialog__title` | Optional. Brief summary of the dialog's purpose.
`mdc-dialog__content` | Optional. Primary content area. May contain a list, a form, or prose.
`mdc-dialog__actions` | Optional. Footer area containing the dialog's action buttons.
`mdc-dialog__button` | Optional. Individual action button. Typically paired with [`mdc-button`](../mdc-button).
`mdc-dialog--open` | Optional. Indicates that the dialog is open and visible.
`mdc-dialog--opening` | Optional. Applied automatically when the dialog is in the process of animating open.
`mdc-dialog--closing` | Optional. Applied automatically when the dialog is in the process of animating closed.
`mdc-dialog--scrollable` | Optional. Applied automatically when the dialog has overflowing content to warrant scrolling.
`mdc-dialog--stacked` | Optional. Applied automatically when the dialog's action buttons can't fit on a single line and must be stacked.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-dialog-container-fill-color($color)` | Sets the fill color of the dialog.
`mdc-dialog-scrim-color($color, $opacity)` | Sets the color of the scrim behind the dialog.
`mdc-dialog-title-ink-color($color, $opacity)` | Sets the color of the dialog's title text.
`mdc-dialog-content-ink-color($color, $opacity)` | Sets the color of the dialog's content text.
`mdc-dialog-scroll-divider-color($color, $opacity)` | Sets the color of the dividers which display around scrollable content.
`mdc-dialog-shape-radius($radius, $rtl-reflexive)` | Sets the rounded shape to dialog surface with given radius size. Set `$rtl-reflexive` to true to flip radius values in RTL context, defaults to false.
`mdc-dialog-min-width($min-width)` | Sets the minimum width of the dialog (defaults to 280px).
`mdc-dialog-max-width($max-width, $margin)` | Sets the maximum width of the dialog (defaults to 560px max width and 16px margins).
`mdc-dialog-max-height($max-height, $margin)` | Sets the maximum height of the dialog (defaults to no max height and 16px margins).

> *NOTE*: The `max-width` and `max-height` mixins only apply their maximum when the viewport is large enough to accommodate the specified value when accounting for the specified margin on either side. When the viewport is smaller, the dialog is sized such that the given margin is retained around the edges.

## Other Customizations
Data Attributes | Description
--- | ---
`data-mdc-dialog-button-default` | Optional. Add to a button to indicate that it is the default action button (see Default Action Button section above).
`data-mdc-dialog-initial-focus` | Optional. Add to an element to indicate that it is the element to initially focus on after the dialog has opened.

<!-- docgen-tsdoc-replacer:start __DO NOT EDIT, This section is automatically generated__ -->
### MDCDialog

#### Methods

Signature | Description
--- | ---
`close(action?: undefined | string) => void` | Closes the dialog, optionally with the specified action indicating why it was closed.
`emit(evtType: string, evtData: T, shouldBubble?: boolean) => void` | Fires a cross-browser-compatible custom event from the component root of the given type, with the given data.
`layout() => void` | Recalculates layout and automatically adds/removes modifier classes like `--scrollable`.
`listen(evtType: K, handler: SpecificEventListener<K>, options?: AddEventListenerOptions | boolean) => void` | Wrapper method to add an event listener to the component's root element. This is most useful when listening for custom events.
`open() => void` | Opens the dialog.
`unlisten(evtType: K, handler: SpecificEventListener<K>, options?: AddEventListenerOptions | boolean) => void` | Wrapper method to remove an event listener to the component's root element. This is most useful when unlistening for custom events.

#### Properties

Name | Type | Description
--- | --- | ---
autoStackButtons | `boolean` | Proxies to the foundation's `getAutoStackButtons` and `setAutoStackButtons` methods.
escapeKeyAction | `string` | Proxies to the foundation's `getEscapeKeyAction` and `setEscapeKeyAction` methods.
isOpen | `boolean` | Proxies to the foundation's `isOpen` method.
scrimClickAction | `string` | Proxies to the foundation's `getScrimClickAction` and `setScrimClickAction` methods.

#### Events
- `MDCDialog:opening {}` Indicates when the dialog begins its opening animation.
- `MDCDialog:opened {}` Indicates when the dialog finishes its opening animation.
- `MDCDialog:closing {action: string?}` Indicates when the dialog begins its closing animation. `action` represents the action which closed the dialog.
- `MDCDialog:closed {action: string?}` Indicates when the dialog finishes its closing animation. `action` represents the action which closed the dialog.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create this component for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### MDCDialogAdapter

#### Methods

Signature | Description
--- | ---
`notifyClosed(action: string) => void` | Broadcasts an event denoting that the dialog has finished closing. If a non-empty `action` is passed, the event's `detail` object should include its value in the `action` property.
`addBodyClass(className: string) => void` | Adds a class to the `<body>`.
`areButtonsStacked() => boolean` | Returns `true` if `mdc-dialog__action` buttons (`mdc-dialog__button`) are stacked vertically, otherwise `false` if they are side-by-side.
`clickDefaultButton() => void` | Invokes `click()` on the `data-mdc-dialog-button-default` element, if one exists in the dialog.
`eventTargetMatches(target: EventTarget | null, selector: string) => boolean` | Returns `true` if the target element matches the given CSS selector, otherwise `false`.
`getActionFromEvent(evt: Event) => string | null` | Retrieves the value of the `data-mdc-dialog-action` attribute from the given event's target, or an ancestor of the target.
`getInitialFocusEl() => HTMLElement | null` | Returns the `data-mdc-dialog-initial-focus` element to add focus to after the dialog has opened. Element to focus on after dialog has opened.
`hasClass(className: string) => boolean` | Returns whether the given class exists on the root element.
`isContentScrollable() => boolean` | Returns `true` if `mdc-dialog__content` can be scrolled by the user, otherwise `false`.
`addClass(className: string) => void` | Adds a class to the root element.
`notifyClosing(action: string) => void` | Broadcasts an event denoting that the dialog has just started closing. If a non-empty `action` is passed, the event's `detail` object should include its value in the `action` property.
`notifyOpened() => void` | Broadcasts an event denoting that the dialog has finished opening.
`notifyOpening() => void` | Broadcasts an event denoting that the dialog has just started to open.
`releaseFocus() => void` | Removes any effects of focus trapping on the dialog surface (see [Handling Focus Trapping](#handling-focus-trapping) below for more details).
`removeBodyClass(className: string) => void` | Removes a class from the `<body>`.
`removeClass(className: string) => void` | Removes a class from the root element.
`reverseButtons() => void` | Reverses the order of action buttons in the `mdc-dialog__actions` element. Used when switching between stacked and unstacked button layouts.
`trapFocus(focusElement: HTMLElement | null) => void` | Sets up the DOM such that keyboard navigation is restricted to focusable elements within the dialog surface (see [Handling Focus Trapping](#handling-focus-trapping) below for more details). Moves focus to `initialFocusEl`, if set.

### MDCDialogFoundation

#### Methods

Signature | Description
--- | ---
`handleKeydown(evt: KeyboardEvent) => void` | Handles `keydown` events on or within the dialog's root element.
`close(action?: undefined | string) => void` | Closes the dialog, optionally with the specified action indicating why it was closed.
`getAutoStackButtons() => boolean` | Returns whether stacked/unstacked action button layout is automatically handled during layout logic.
`getEscapeKeyAction() => string` | Returns the action reflected when the Escape key is pressed.
`getScrimClickAction() => string` | Returns the action reflected when the scrim is clicked.
`handleClick(evt: MouseEvent) => void` | Handles `click` events on or within the dialog's root element.
`handleDocumentKeydown(evt: KeyboardEvent) => void` | Handles `keydown` events on or within the document while the dialog is open.
`isOpen() => boolean` | Returns whether the dialog is open.
`layout() => void` | Recalculates layout and automatically adds/removes modifier classes e.g. `--scrollable`.
`open() => void` | Opens the dialog.
`setAutoStackButtons(autoStack: boolean) => void` | Sets whether stacked/unstacked action button layout is automatically handled during layout logic.
`setEscapeKeyAction(action: string) => void` | Sets the action reflected when the Escape key is pressed. Setting to `''` disables closing the dialog via Escape key.
`setScrimClickAction(action: string) => void` | Sets the action reflected when the scrim is clicked. Setting to `''` disables closing the dialog via scrim click.


<!-- docgen-tsdoc-replacer:end -->

### The Util API

External frameworks and libraries can use the following utility methods from the `util` module when implementing their own component.

Method Signature | Description
--- | ---
`createFocusTrapInstance(surfaceEl: Element, focusTrapFactory: function(): !FocusTrap, initialFocusEl: ?Element) => !FocusTrap` | Creates a properly configured [focus-trap][] instance.
`isScrollable(el: Element \| null) => boolean` | Determines if the given element is scrollable.
`areTopsMisaligned(els: Element[]) => boolean` | Determines if two or more of the given elements have different `offsetTop` values.

### Handling Focus Trapping

In order for dialogs to be fully accessible, they must conform to the guidelines outlined in:

* https://www.w3.org/TR/wai-aria-practices/#dialog_modal
* https://www.w3.org/TR/wai-aria-practices-1.1/examples/dialog-modal/dialog.html
* https://developer.mozilla.org/en-US/docs/Web/Accessibility/ARIA/ARIA_Techniques/Using_the_dialog_role

The main implication of these guidelines is that the only focusable elements are those contained within a dialog
surface.

Trapping focus correctly for a modal dialog requires a complex set of events and interaction
patterns that we feel is best not duplicated within the logic of this component. Furthermore,
frameworks and libraries may have their own ways of trapping focus that framework authors may want
to make use of. For this reason, we have two methods on the adapter that should be used to handle
focus trapping:

* `trapFocus()` is called when the dialog is open and should set up focus trapping adhering
  to the ARIA practices in the link above.
* `releaseFocus()` is called when the dialog is closed and should tear down any focus
  trapping set up when the dialog was open.

The `MDCDialog` component uses the [focus-trap][] package to handle this.
**You can use `util.createFocusTrapInstance()` (see below) to easily create
a focus trapping solution for your component code.**

[focus-trap]: https://github.com/davidtheclark/focus-trap

> NOTE: iOS platform doesn't seem to register currently focused element via `document.activeElement` which causes releasing
> focus to last focused element fail.

#### `createFocusTrapInstance()`

```js
const {activate, deactivate} =
  util.createFocusTrapInstance(surfaceEl, focusTrapFactory, initialFocusEl);
```

Given a dialog surface element an optional `focusTrap` factory function, and an optional initial element to focus,
such that:

* The focus is trapped within the `surfaceEl`
* The `initialFocusEl` receives focus when the focus trap is activated
    - If omitted, defaults to the first focusable element in `surfaceEl`
* Closing the dialog in any way (including pressing Escape or clicking outside the dialog) deactivates focus trapping
* Focus is returned to the previously focused element before the focus trap was activated

This focus trap instance can be used to implement the `trapFocus` and `releaseFocus` adapter methods by calling
`instance.activate()` and `instance.deactivate()` respectively within those methods.

The `focusTrapFactory` can be used to override the `focus-trap` function used to create the focus trap. Its API is the
same as focus-trap's [createFocusTrap](https://github.com/davidtheclark/focus-trap#focustrap--createfocustrapelement-createoptions)
(which is what it defaults to). You can pass in a custom function for mocking out the actual function within tests,
or to modify the arguments passed to the function before it's called.
