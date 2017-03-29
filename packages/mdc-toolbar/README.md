# MDC Toolbar

MDC Toolbar acts as a container for multiple rows containing items such as
application title, navigation menu, and tabs, among other things. Toolbars
scroll with content by default, but supports fixed on top as well. Currently,
this component does not yet support the "Waterfall" or "Flexible Header" patterns.


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


### Fixed toolbars

By default, toolbars scroll with the page content. To keep the toolbar fixed to
the top of the screen, add an `mdc-toolbar--fixed` class to the toolbar element.

**Adjusting sibling elements of fixed toolbars**

When using `mdc-toolbar--fixed`, you can add the `mdc-toolbar-fixed-adjust`
helper class to the toolbar's adjacent sibling element, which will ensure that
the sibling element's top margin will be large enough such that the fixed
toolbar will not overlay any of the element's content.

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

### Sections

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

### Toolbar title

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

### RTL Support

`mdc-toolbar` is automatically RTL-aware, and will re-position elements whenever
it, or its ancestors, has a `dir="rtl"` attribute.


## Classes

### Block

The block class is `mdc-toolbar`. This defines the top-level toolbar element.

### Element
The component has `mdc-toolbar__section` and `mdc-toolbar__title` elements. You
can add multiple sections to toolbar. Refer to Sections and Toolbar title for
further details.

### Modifier

The provided modifiers are:

| Class                                | Description                             |
| -------------------------------------| --------------------------------------- |
| `mdc-toolbar--fixed`                 | Make toolbar fixed to top of screen.    |
| `mdc-toolbar__section--align-start`  | Makes section aligns to the start.      |
| `mdc-toolbar__section--align-end`    | Makes section aligns to the end.        |
