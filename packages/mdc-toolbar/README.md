# MDC Toolbar

MDC Toolbar acts as a container for multiple rows containing items such as
application title, navigation menu, and tabs, among other things. Toolbars
scroll with content by default, but supports waterfall behavior as well.

In waterfall pattern, toolbar will fixed on top of the page and a elevation will
be added to toolbar once user starts scrolling. It provides a css-only fallback
which adds a persistent elevation to toolbar. Toolbar supports anchored only
last row at the top behavior. For toolbar with this modifier, only the last row
will be anchored at the top, while the rest of toolbar scrolls off.

Flexible behavior can be added to mdc-toolbar, whose height changes as the user
scroll. Flexible is defined as a modifier class of toolbar but not a standalone
component. For toolbar with this modifier, a flexible space will be added to the
first row of it.




## Installation

```
npm install --save @material/toolbar
```


## Usage

Wrap the items with `mdc-toolbar` class in following way:

```html
<header class="mdc-toolbar">
  <div class="mdc-toolbar__row">
    <section class="mdc-toolbar__section mdc-toolbar__section--align-start">
      <a class="material-icons">menu</a>
      <span class="mdc-toolbar__title">Title</span>
    </section>
  </div>
</header>
```

MDC Toolbars can accommodate multiple rows using the wrapper `mdc-toolbar__row`:

```html
<header class="mdc-toolbar">
  <div class="mdc-toolbar__row">
    <section class="mdc-toolbar__section mdc-toolbar__section--align-start">
      <a class="material-icons">menu</a>
      <span class="mdc-toolbar__title">Title</span>
    </section>
  </div>
  <div class="mdc-toolbar__row">
    ...
  </div>
</header>
```

#### Sections

Toolbar sections are aligned to the toolbar's center. You can change this
behavior by applying `mdc-toolbar__section--align-start` or
`mdc-toolbar__section--align-end` to align the sections to the start or the end
of the toolbar (respectively).

```html
<header class="mdc-toolbar">
  <div class="mdc-toolbar__row">
    <section class="mdc-toolbar__section mdc-toolbar__section--align-start">
      Section aligns to start.
    </section>
    <section class="mdc-toolbar__section">
      Section aligns to center.
    </section>
    <section class="mdc-toolbar__section mdc-toolbar__section--align-end">
      Section aligns to end.
    </section>
  </div>
</header>
```

Toolbar sections are laid out using flexbox. Each section will take up an equal
amount of space within the toolbar.

#### Toolbar title

You can use the `mdc-toolbar__title` element to style toolbar text representing
a page's title, or an application name.

```html
<header class="mdc-toolbar">
  <div class="mdc-toolbar__row">
    <section class="mdc-toolbar__section">
      <span class="mdc-toolbar__title">Title</span>
    </section>
  </div>
</header>
```

### Waterfall toolbars (Need Javascript, have css-only fallback)

By default, toolbars scroll with the page content. To keep the toolbar fixed to
the top of the screen, add an `mdc-toolbar--fixed` class to the toolbar element.

**Adjusting sibling elements of fixed toolbars**

When using `mdc-toolbar--fixed`, you need to set the margin of the content to
prevent toolbar overlaying your content.
If you are using `mdc-toolbar` with javascript, you should assgin your content
wrapper element to `mdc-toolbar`'s instance property `fixedAdjustElement`. This
will make `mdc-toolbar` aware of the wrapper class and adjust the `margin-top`
correspondingly.
When you are using css-only solution, you can add the `mdc-toolbar-fixed-adjust`
helper class to the toolbar's adjacent sibling element, which will add default
`margin-top`.


```html
<header class="mdc-toolbar mdc-toolbar--fixed">
  <div class="mdc-toolbar__row">
    <section class="mdc-toolbar__section mdc-toolbar__section--align-start">
      <span class="mdc-toolbar__title">Title</span>
    </section>
  </div>
</header>
<main class="mdc-toolbar-fixed-adjust">
  <p class="demo-paragraph">
    A demo paragraph here.
  </p>
</main>
```

### Fixed Last Row Toolbar (Need Javascript)

Toolbar supports anchored only last row at the top behavior.

```html
<header class="mdc-toolbar mdc-toolbar--fixed-lastrow-only">
  <div class="mdc-toolbar__row">
    <!-- This row will scroll off screen -->
  </div>
  <div class="mdc-toolbar__row">
    <!-- This row will anchor on top of screen -->
  </div>
</header>
```

### Flexible Toolbar (Need Javascript)

Flexible behavior can be added to mdc-toolbar, whose height changes as the user
scroll. Flexible behavior is highly customizable - we only define the change of
flexible space size without making further assumptions. But we do recommend the
height of flexible space should be an integral number of `mdc-toolbar__row`
height and provide a easier way for user to customize height. User can adjust the
height of flexible space through sass variable `$mdc-toolbar-ratio-to-extend-flexible`
or css variable `--mdc-toolbar-ratio-to-extend-flexible`.

Flexible toolbar emits `change` event and percentage of remaining flexible space
so that users will be able to adjust element inside based on their own branding need.

As usual, we further defined default behavior of flexible:
- Flexible has a fixed initial height 4 times of `mdc-toolbar__row`.
- When it has `mdc-toolbar--flexible-default-behavior`, it further defines the
background and title movement behavior.

```html
<header class="mdc-toolbar mdc-toolbar--flexible">
  <div class="mdc-toolbar__row">
    ...
  </div>
</header>
```

Using default behavior and add background image:

```html
<style>
  .mdc-toolbar__row:first-child::after {
    background-image: url("../images/4-3-2.jpg");
    background-size: cover;
    background-position: center;
  }
</style>
<header class="mdc-toolbar mdc-toolbar--flexible mdc-toolbar--flexible-default-behavior">
  <div class="mdc-toolbar__row">
    ...
  </div>
</header>
```

Custom height of flexible space:

```html
<style>
  #my-flexible-header {
    --mdc-toolbar-ratio-to-extend-flexible: 3;
  }
</style>
<header class="mdc-toolbar mdc-toolbar--flexible">
  <div class="mdc-toolbar__row">
    ...
  </div>
</header>
```



### RTL Support

`mdc-toolbar` is automatically RTL-aware, and will re-position elements whenever
it, or its ancestors, has a `dir="rtl"` attribute.


## Classes

### Block

The block class is `mdc-toolbar`. This defines the top-level toolbar element.

### Element
The component accommodates multiple rows using the wrapper `mdc-toolbar__row`.
For each row, it has `mdc-toolbar__section` and `mdc-toolbar__title` elements. You
can add multiple sections to toolbar. Refer to Sections and Toolbar title for
further details.

### Modifier

The provided modifiers are:

| Class                                | Description                             |
| -------------------------------------| --------------------------------------- |
| `mdc-toolbar--fixed`                 | Makes toolbar fixed on top and have persistent elavation |
| `mdc-toolbar--fixed-upgrade`         | Upgrade toolbar dynamically add waterfall effect |
| `mdc-toolbar--flexible`              | Makes toolbar first row has flexible space |
| `mdc-toolbar--flexible-space-minimized` | Dynamically added when flexible space is minimized |
| `mdc-toolbar--fixed-lastrow-only`    | Makes last row of toolbar anchored on top |
| `mdc-toolbar--fixed-at-last-row`     | Dynamically added when last row is anchored on top |
| `mdc-toolbar__section--align-start`  | Makes section aligns to the start.      |
| `mdc-toolbar__section--align-end`    | Makes section aligns to the end.        |


## JS Usage

### Including in code

#### ES2015

```javascript
import {MDCToolbar, MDCToolbarFoundation} from 'mdc-toolbar';
```

#### CommonJS

```javascript
const mdcToolbar = require('mdc-toolbar');
const MDCToolbar = mdcToolbar.MDCToolbar;
const MDCToolbarFoundation = mdcToolbar.MDCToolbarFoundation;
```

#### AMD

```javascript
require(['path/to/mdc-toolbar'], mdcToolbar => {
  const MDCToolbar = mdcToolbar.MDCToolbar;
  const MDCToolbarFoundation = mdcToolbar.MDCToolbarFoundation;
});
```

#### Global

```javascript
const MDCToolbar = mdc.toolbar.MDCToolbar;
const MDCToolbarFoundation = mdc.toolbar.MDCToolbarFoundation;
```

### Instantiation

```javascript
import {MDCToolbar} from 'mdc-toolbar';

const toolbar = new MDCToolbar(document.querySelector('.mdc-toolbar'));
```

### Event

| Event Name | Event Data Structure | Description |
| --- | --- | --- |
| `change` | {detail: number} | Emitted the ratio of current flexible space to total flexible space height. So when it is minimized, ratio equals to 0 and when it is maximized, ratio equals to 1. |


### Adapter

| Method Signature | Description |
| --- | --- |
| `hasClass(className: string) => void` | Check is the root element of the component has a class. |
| `addClass(className: string) => void` | Adds a class to the root element of the component. |
| `removeClass(className: string) => void` | Removes a class from the root element of the component. |
| `registerScrollHandler(handler: Function) => void` | Registers a handler to be called when user scrolls. Our default implementation adds the handler as a listener to the window's `scroll()` event. |
| `deregisterScrollHandler(handler: Function) => void` | Unregisters a handler to be called when user scrolls. Our default implementation removes the handler as a listener to the window's `scroll()` event. |
| `registerResizeHandler(handler: Function) => void` | Registers a handler to be called when the surface (or its viewport) resizes. Our default implementation adds the handler as a listener to the window's `resize()` event. |
| `deregisterResizeHandler(handler: Function) => void` | Unregisters a handler to be called when the surface (or its viewport) resizes. Our default implementation removes the handler as a listener to the window's `resize()` event. |
| `getViewportWidth() => number` | Get viewport (window) width. |
| `getViewportScrollY() => number` | Get the number of pixels that the content of body is scrolled upward. |
| `getOffsetHeight() => number` | Get root element `mdc-toolbar` offsetHeight. |
| `getFlexibleRowElementOffsetHeight() => number` | Get flexible row element offsetHeight. |
| `notifyChange() => evtData` | Broadcasts an event with the remaining ratio of flexible space. |
| `setStyleForRootElement(property: string, value: number) => void` | Set `mdc-toolbar` style property to provided value. |
| `setStyleForTitleElement(property: string, value: number) => void` | Set `mdc-toolbar__title` style property to provided value. |
| `setStyleForFlexibleRowElement(property: string, value: number) => void` | Set flexible row element style property to provided value. |
| `setStyleForFixedAdjustElement(property: string, value: number) => void` | Set `mdc-toolbar-fixed-adjust` style property to provided value. |
