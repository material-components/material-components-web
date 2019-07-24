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
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/snackbars.png" width="336" alt="Snackbar screenshot">
  </a>
</div>-->

Snackbars provide brief messages about app processes at the bottom of the screen.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-snackbar">Material Design guidelines: Snackbars</a>
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
<div class="mdc-snackbar">
  <div class="mdc-snackbar__surface">
    <div class="mdc-snackbar__label"
         role="status"
         aria-live="polite">
      Can't send photo. Retry in 5 seconds.
    </div>
    <div class="mdc-snackbar__actions">
      <button type="button" class="mdc-button mdc-snackbar__action">Retry</button>
    </div>
  </div>
</div>
```

### Styles

```scss
@import "@material/snackbar/mdc-snackbar";
```

### JavaScript Instantiation

```js
import {MDCSnackbar} from '@material/snackbar';
const snackbar = new MDCSnackbar(document.querySelector('.mdc-snackbar'));
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

## Variants

### Stacked

Action buttons with long text should be positioned _below_ the label instead of alongside it. This can be accomplished by adding the `mdc-snackbar--stacked` modifier class to the root element:

```html
<div class="mdc-snackbar mdc-snackbar--stacked">
  ...
</div>
```

Alternatively, you can call the `mdc-snackbar-layout-stacked` mixin from Sass:

```scss
@media (max-width: $mdc-snackbar-mobile-breakpoint) {
  .my-snackbar {
    @include mdc-snackbar-layout-stacked;
  }
}
```

### Leading (tablet and desktop only)

By default, snackbars are centered horizontally within the viewport.

On larger screens, they can optionally be displayed on the _leading_ edge of the screen (the left side in LTR, or the right side in RTL) by adding the `mdc-snackbar--leading` modifier class to the root element:

```html
<div class="mdc-snackbar mdc-snackbar--leading">
  ...
</div>
```

Alternatively, you can call the `mdc-snackbar-position-leading` mixin from Sass:

```scss
@media (min-width: $mdc-snackbar-mobile-breakpoint) {
  .my-snackbar {
    @include mdc-snackbar-position-leading;
  }
}
```

### Wide (tablet and desktop only)

To increase the margins between the snackbar and the viewport on larger screens, call the `mdc-snackbar-viewport-margin` mixin inside a media query:

```scss
@media (min-width: $mdc-snackbar-mobile-breakpoint) {
  .my-snackbar {
    @include mdc-snackbar-viewport-margin($mdc-snackbar-viewport-margin-wide);
  }
}
```

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-snackbar` | Mandatory. Container for the snackbar elements.
`mdc-snackbar__label` | Mandatory. Message text.
`mdc-snackbar__actions` | Optional. Wraps the action button/icon elements, if present.
`mdc-snackbar__action` | Optional. The action button.
`mdc-snackbar__dismiss` | Optional. The dismiss ("X") icon.
`mdc-snackbar--opening` | Optional. Applied automatically when the snackbar is in the process of animating open.
`mdc-snackbar--open` | Optional. Indicates that the snackbar is open and visible.
`mdc-snackbar--closing` | Optional. Applied automatically when the snackbar is in the process of animating closed.
`mdc-snackbar--leading` | Optional. Positions the snackbar on the leading edge of the screen (left in LTR, right in RTL) instead of centered.
`mdc-snackbar--stacked` | Optional. Positions the action button/icon below the label instead of alongside it.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-snackbar-fill-color($color)` | Sets the fill color of the snackbar.
`mdc-snackbar-label-ink-color($color)` | Sets the color of the snackbar's label text.
`mdc-snackbar-shape-radius($radius, $rtl-reflexive)` | Sets the rounded shape to snackbar surface with given radius size. Set `$rtl-reflexive` to true to flip radius values in RTL context, defaults to false.
`mdc-snackbar-min-width($min-width, $mobile-breakpoint)` | Sets the `min-width` of the surface on tablet/desktop devices. On mobile, the width is automatically set to 100%.
`mdc-snackbar-max-width($max-width)` | Sets the `max-width` of the snackbar.
`mdc-snackbar-elevation($z-index)` | Sets the elevation of the snackbar.
`mdc-snackbar-viewport-margin($margin)` | Sets the distance between the snackbar and the viewport.
`mdc-snackbar-z-index($z-index)` | Sets the `z-index` of the snackbar.
`mdc-snackbar-position-leading()` | Positions the snackbar on the leading edge of the screen (left in LTR, right in RTL) instead of centered.
`mdc-snackbar-layout-stacked()` | Positions the action button/icon below the label instead of alongside it.

> **NOTE**: The `mdc-snackbar__action` and `mdc-snackbar__dismiss` elements can be further customized with [`mdc-button`](../mdc-button) and [`mdc-icon-button`](../mdc-icon-button) mixins.

<!-- docgen-tsdoc-replacer:start __DO NOT EDIT, This section is automatically generated__ -->
### MDCSnackbar
#### Methods

Signature | Description
--- | ---
`close(reason?: undefined | string) => void` | Closes the snackbar, optionally with the specified reason indicating why it was closed.
`emit(evtType: string, evtData: T, shouldBubble?: boolean) => void` | Fires a cross-browser-compatible custom event from the component root of the given type, with the given data.
`listen(evtType: K, handler: SpecificEventListener<K>, options?: AddEventListenerOptions | boolean) => void` | Wrapper method to add an event listener to the component's root element. This is most useful when listening for custom events.
`open() => void` | Opens the snackbar.
`unlisten(evtType: K, handler: SpecificEventListener<K>, options?: AddEventListenerOptions | boolean) => void` | Wrapper method to remove an event listener to the component's root element. This is most useful when unlistening for custom events.

#### Properties

Name | Type | Description
--- | --- | ---
actionButtonText | `string` | Gets/sets the `textContent` of the action button element.
closeOnEscape | `boolean` | Gets/sets whether the snackbar closes when it is focused and the user presses the <kbd>ESC</kbd> key. Defaults to `true`.
isOpen | `boolean` | Gets whether the snackbar is currently open.
labelText | `string` | Gets/sets the `textContent` of the label element. > **NOTE**: Setting `labelText` while the snackbar is open will cause screen readers to announce the new label. See [Screen Readers](#screen-readers) below for more information.
timeoutMs | `number` | Gets/sets the automatic dismiss timeout in milliseconds. Value must be between `4000` and `10000` or an error will be thrown. Defaults to `5000` (5 seconds).

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create this component for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### MDCSnackbarAdapter
#### Methods

Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element.
`announce() => void` | Announces the snackbar's label text to screen reader users.
`notifyClosed(reason: string) => void` | Broadcasts an event denoting that the snackbar has just started closing. If a non-empty `reason` is passed, the event's `detail` object should include its value in the `reason` property.
`notifyClosing(reason: string) => void` | Broadcasts an event denoting that the snackbar has finished closing. If a non-empty `reason` is passed, the event's `detail` object should include its value in the `reason` property.
`notifyOpened() => void` | Broadcasts an event denoting that the snackbar has finished opening.
`notifyOpening() => void` | Broadcasts an event denoting that the snackbar has just started opening.
`removeClass(className: string) => void` | Removes a class from the root element.

### MDCSnackbarFoundation
#### Methods

Signature | Description
--- | ---
`handleKeyDown(evt: KeyboardEvent) => void` | Handles `keydown` events on or within the snackbar's root element.
`close(reason?: undefined | string) => void` | Closes the snackbar, optionally with the specified action indicating why it was closed.
`getCloseOnEscape() => boolean` | Returns whether the snackbar closes when it is focused and the user presses the <kbd>ESC</kbd> key.
`getTimeoutMs() => number` | Returns the automatic dismiss timeout in milliseconds.
`handleActionButtonClick(_evt: MouseEvent) => void` | Handles `click` events on or within the action button.
`handleActionIconClick(_evt: MouseEvent) => void` | Handles `click` events on or within the dismiss icon.
`isOpen() => boolean` | Returns whether the snackbar is open.
`open() => void` | Opens the snackbar.
`setCloseOnEscape(closeOnEscape: boolean) => void` | Sets whether the snackbar closes when it is focused and the user presses the <kbd>ESC</kbd> key.
`setTimeoutMs(timeoutMs: number) => void` | Sets the automatic dismiss timeout in milliseconds. Value must be between `4000` and `10000` or an error will be thrown.


<!-- docgen-tsdoc-replacer:end -->

#### Event Handlers

When wrapping the Snackbar foundation, the following events must be bound to the indicated foundation methods:

Event | Target | Foundation Handler | Register | Deregister
--- | --- | --- | --- | ---
`keydown` | `.mdc-snackbar` | `handleKeyDown` | During initialization | During destruction
`click` | `.mdc-snackbar__action` | `handleActionButtonClick` | During initialization | During destruction
`click` | `.mdc-snackbar__dismiss` | `handleActionIconClick` | During initialization | During destruction

#### The Util API

External frameworks and libraries can use the following utility methods from the `util` module when implementing their own component.

Method Signature | Description
--- | ---
`announce(ariaEl: Element, labelEl?: Element) => void` | Announces the label text to screen reader users.

> Alternatively, frameworks can use [Closure Library's `goog.a11y.aria.Announcer#say()` method](https://github.com/google/closure-library/blob/bee9ced776b4700e8076a3466bd9d3f9ade2fb54/closure/goog/a11y/aria/announcer.js#L80).

## Accessibility

### Screen Readers

Snackbars automatically announce their label text to screen reader users with a ["polite" notification](https://www.w3.org/TR/wai-aria-1.1/#aria-live) when `open()` is called.

However, screen readers only announce [ARIA Live Regions](https://mdn.io/ARIA_Live_Regions) when the element's `textContent` _changes_, so MDC Snackbar provides a `util.announce()` method to temporarily clear and then restore the label element's `textContent`.

> **NOTE**: Setting `labelText` while the snackbar is open will cause screen readers to announce the new label.

`util.announce()` supports the latest versions of the following screen readers and browsers:

* [ChromeVox](https://chrome.google.com/webstore/detail/chromevox/kgejglhpjiefppelpmljglcjbhoiplfn)
* [NVDA](https://www.nvaccess.org/):
    - Chrome
    - Firefox
    - IE 11
* [JAWS](https://www.freedomscientific.com/Products/Blindness/JAWS):
    - Chrome
    - Firefox
    - IE 11

macOS VoiceOver is _not_ supported at this time.

### Dismiss Icon

Snackbars are intended to dismiss on their own after a few seconds, but a dedicated dismiss icon may be optionally included as well for accessibility purposes.

### Dismiss Key

Pressing the <kbd>ESC</kbd> key while one of the snackbar's child elements has focus (e.g., the action button) will dismiss the snackbar.

To disable this behavior, set `closeOnEscape` to `false`.

### No JS Ripples

The `mdc-snackbar__action` and `mdc-snackbar__dismiss` elements should _**not**_ have JavaScript-enabled [`MDCRipple`](../mdc-ripple) behavior.

When combined with the snackbar's exit animation, ripples cause too much motion, which can be distracting or disorienting for users.
