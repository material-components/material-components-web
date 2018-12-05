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

## Design & Demo

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
      <button type="button" class="mdc-button mdc-snackbar__action-button">Retry</button>
      <button class="mdc-icon-button mdc-snackbar__action-icon material-icons" title="Dismiss">close</button>
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

### Leading (tablet and desktop only)

By default, snackbars are centered horizontally within the viewport.

On larger screens, they can optionally be displayed on the _leading_ edge of the screen (the left side in LTR, or the right side in RTL) by adding the `mdc-snackbar--leading` modifier class to the root element:

```html
<div class="mdc-snackbar mdc-snackbar--leading">
  ...
</div>
```

### Wide (tablet and desktop only)

To increase the margins between the snackbar and the viewport on larger screens, add the `mdc-snackbar--wide` modifier class to the root element:

```html
<div class="mdc-snackbar mdc-snackbar--wide">
  ...
</div>
```

Alternatively, you can call the `mdc-snackbar-viewport-margin` mixin from Sass:

```scss
.my-snackbar {
  @include mdc-snackbar-viewport-margin(40px);
}
```

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-snackbar` | Mandatory. Container for the snackbar elements.
`mdc-snackbar__label` | Mandatory. Message text.
`mdc-snackbar__actions` | Optional. Wraps the action button/icon elements, if present.
`mdc-snackbar__action-button` | Optional. The action button.
`mdc-snackbar__action-icon` | Optional. The dismiss ("X") icon.
`mdc-snackbar--opening` | Optional. Applied automatically when the snackbar is in the process of animating open.
`mdc-snackbar--open` | Optional. Indicates that the snackbar is open and visible.
`mdc-snackbar--closing` | Optional. Applied automatically when the snackbar is in the process of animating closed.
`mdc-snackbar--leading` | Optional. Positions the snackbar on the leading edge of the screen (left in LTR, right in RTL) instead of centered.
`mdc-snackbar--stacked` | Optional. Positions the action button/icon below the label instead of alongside it.
`mdc-snackbar--wide` | Optional. Increases the margins between the snackbar and the viewport. Should only be applied to devices with large screens.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-snackbar-fill-color($color)` | Sets the fill color of the snackbar.
`mdc-snackbar-label-ink-color($color)` | Sets the color of the snackbar's label text.
`mdc-snackbar-shape-radius($radius, $rtl-reflexive)` | Sets the rounded shape to snackbar surface with given radius size. Set `$rtl-reflexive` to true to flip radius values in RTL context, defaults to false.
`mdc-snackbar-min-width($min-width)` | Sets the minimum width of the snackbar (defaults to `344px`).
`mdc-snackbar-max-width($max-width)` | Sets the maximum width of the snackbar (defaults to `672px`).
`mdc-snackbar-elevation($z-index)` | Sets the elevation of the snackbar.
`mdc-snackbar-viewport-margin($margin)` | Sets the distance between the snackbar and the viewport.
`mdc-snackbar-z-index($z-index)` | Sets the `z-index` of the snackbar.

> *NOTE*: The `mdc-snackbar__action-button` and `mdc-snackbar__action-icon` elements can be customized with [`mdc-button`](../mdc-button) and [`mdc-icon-button`](../mdc-icon-button) mixins.

### Sass Variables

Variable | Description
--- | ---
`$mdc-snackbar-fill-color` | Default fill color of the surface.
`$mdc-snackbar-label-ink-color` | Default ink color of the label.
`$mdc-snackbar-action-button-ink-color` | Default ink color of the action button.
`$mdc-snackbar-action-icon-ink-color` | Default ink color of the dismiss icon.
`$mdc-snackbar-label-type-scale` | Default type scale of the label text.
`$mdc-snackbar-action-icon-size` | Default size of the action icon.
`$mdc-snackbar-min-width` | Default `min-width` of the surface.
`$mdc-snackbar-max-width` | Default `max-width` of the surface.
`$mdc-snackbar-viewport-margin-narrow` | Default distance between the surface and the viewport.
`$mdc-snackbar-viewport-margin-wide` | Default distance between the surface and the viewport when `mdc-snackbar--wide` is applied.
`$mdc-snackbar-padding` | Default padding of the surface.
`$mdc-snackbar-elevation` | Default elevation.
`$mdc-snackbar-shape-radius` | Default shape radius.
`$mdc-snackbar-z-index` | Default z-index.
`$mdc-snackbar-enter-delay` | Default delay for enter animations.
`$mdc-snackbar-enter-duration` | Default duration of enter animations.
`$mdc-snackbar-exit-delay` | Default delay for exit animations.
`$mdc-snackbar-exit-duration` | Default duration of exit animations.

## JavaScript API

### `MDCSnackbar` Properties

Property | Value Type | Description
--- | --- | ---
`isOpen` | `boolean` (read-only) | Gets whether the snackbar is currently open.
`timeoutMs` | `number` | Gets/sets the automatic dismiss timeout in milliseconds. Value must be between `4000` and `10000` or an error will be thrown. Defaults to `5000` (5 seconds).
`closeOnEscape` | `boolean` | Gets/sets whether the snackbar closes when it is focused and the user presses the <kbd>ESC</kbd> key. Defaults to `true`.
`labelText` | `string` | Gets/sets the `textContent` of the label element.
`actionButtonText` | `string` | Gets/sets the `textContent` of the action button element.

### `MDCSnackbar` Methods

Method Signature | Description
--- | ---
`open() => void` | Opens the snackbar.
`close(reason: string?) => void` | Closes the snackbar, optionally with the specified reason indicating why it was closed.

### Events

Event Name | `event.detail` | Description
--- | --- | ---
`MDCSnackbar:opening` | `{}` | Indicates when the snackbar begins its opening animation.
`MDCSnackbar:opened` | `{}` | Indicates when the snackbar finishes its opening animation.
`MDCSnackbar:closing` | `{reason: ?string}` | Indicates when the snackbar begins its closing animation. `reason` contains the reason why the snackbar closed (`dismiss` or `action`).
`MDCSnackbar:closed` | `{reason: ?string}` | Indicates when the snackbar finishes its closing animation. `reason` contains the reason why the snackbar closed (`dismiss` or `action`).

### Usage Within Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Snackbar for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please see [Integrating MDC Web into Frameworks](../../docs/integrating-into-frameworks.md).

#### `MDCSnackbarAdapter` Methods

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element.
`removeClass(className: string) => void` | Removes a class from the root element.
`announce() => void` | Announces the snackbar's label text to screen reader users.
`notifyOpening() => void` | Broadcasts an event denoting that the snackbar has just started opening.
`notifyOpened() => void` | Broadcasts an event denoting that the snackbar has finished opening.
`notifyClosing(reason: string) {}` | Broadcasts an event denoting that the snackbar has just started closing. If a non-empty `reason` is passed, the event's `detail` object should include its value in the `reason` property.
`notifyClosed(reason: string) {}` | Broadcasts an event denoting that the snackbar has finished closing. If a non-empty `reason` is passed, the event's `detail` object should include its value in the `reason` property.

#### `MDCSnackbarFoundation` Methods

Method Signature | Description
--- | ---
`open()` | Opens the snackbar.
`close(action: string)` | Closes the snackbar, optionally with the specified action indicating why it was closed.
`isOpen() => boolean` | Returns whether the snackbar is open.
`getTimeoutMs() => number` | Returns the automatic dismiss timeout in milliseconds.
`setTimeoutMs(timeoutMs: number)` | Sets the automatic dismiss timeout in milliseconds. Value must be between `4000` and `10000` or an error will be thrown.
`getCloseOnEscape() => boolean` | Returns whether the snackbar closes when it is focused and the user presses the <kbd>ESC</kbd> key.
`setCloseOnEscape(closeOnEscape: boolean) => void` | Sets whether the snackbar closes when it is focused and the user presses the <kbd>ESC</kbd> key.
`handleKeyDown(event: !KeyEvent)` | Handles `keydown` events on or within the snackbar's root element.
`handleActionButtonClick(event: !MouseEvent)` | Handles `click` events on or within the action button.
`handleActionIconClick(event: !MouseEvent)` | Handles `click` events on or within the dismiss icon.

#### Event Handlers

When wrapping the Snackbar foundation, the following events must be bound to the indicated foundation methods:

Event | Target | Foundation Handler | Register | Deregister
--- | --- | --- | --- | ---
`keydown` | `.mdc-snackbar` | `handleKeyDown` | During initialization | During destruction
`click` | `.mdc-snackbar__action-button` | `handleActionButtonClick` | During initialization | During destruction
`click` | `.mdc-snackbar__action-icon` | `handleActionIconClick` | During initialization | During destruction

#### The Util API

External frameworks and libraries can use the following utility methods from the `util` module when implementing their own component.

Method Signature | Description
--- | ---
`announce(ariaEl: !HTMLElement, labelEl: !HTMLElement=) => void` | Announces the label text to screen reader users*.

_\* Alternatively, frameworks can use [Closure Library's `goog.a11y.aria.Announcer#say()` method](https://github.com/google/closure-library/blob/bee9ced776b4700e8076a3466bd9d3f9ade2fb54/closure/goog/a11y/aria/announcer.js#L80)._

## Accessibility

### Screen Readers

Snackbars automatically announce their label text to screen reader users with a ["polite" notification](https://www.w3.org/TR/wai-aria-1.1/#aria-live) when `open()` is called.

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

A dedicated dismiss icon is optional, but **strongly** recommended. If the snackbar gets permanently "stuck" on the screen for any reason (e.g., #1398), the user should be able to manually dismiss it.

### Dismiss Key

When one of the snackbar's subelements has focus (e.g., the action button or dismiss icon), pressing the <kbd>ESC</kbd> key dismisses the snackbar.

### No JS Ripples

The `mdc-snackbar__action-button` and `mdc-snackbar__action-icon` elements should _**not**_ have JavaScript-enabled [`MDCRipple`](../mdc-ripple) behavior.

When combined with the snackbar's exit animation, ripples cause too much motion, which can be distracting or disorienting for users.
