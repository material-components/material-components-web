<!--docs:
title: "Migrating from Material Design Lite"
navTitle: "Migrating from MDL"
layout: landing
section: docs
path: /docs/migrating-from-mdl/
-->

# Migrating from Material Design Lite

Material Components for the web (MDC-Web) is the successor to the Material Design Lite (MDL) project.

While the philosophy behind the two projects is quite similar, migrating to MDC-Web requires a number of changes, from
class names to different DOM structures. In addition, there are several choices to be made regarding component
initialization, how to depend on MDC-Web, and theming/styling mechanisms.

This document attempts to summarize and guide you through the work involved. Let’s get started!

> **Note:** If you’re thinking of migrating your application to MDC-Web, please bear in mind that it’s still in an alpha
state and thus APIs and certain UX features are subject to change.


## Depending on MDC-Web

MDL is distributed on NPM, Bower, and through its own CDN. MDC-Web is currently only available on NPM.

While MDL is a singular, universal library consisting of all components and styles, MDC-Web has been designed to be
modular, allowing you to make the choice of either pulling in everything, or just the packages you want.

### NPM

MDC-Web is made available on [NPM](https://www.npmjs.com/), with packages living under the `@material` namespace.

In order to install e.g. the button component, you can run:

```
npm install --save @material/button
```

Some packages serve as dependencies for others, so don’t be surprised if you end up with multiple packages in your
`node_modules` folder! There are no runtime dependencies outside of MDC-Web, so the dependency tree should remain small.

If you want all of MDC-Web, you can pull in the meta package:

```
npm install --save material-components-web
```

### Content Distribution Network (CDN)

While MDL is available over a CDN, there’s currently no equivalent in MDC-Web (it’s in the plans for the future,
though!).

In the meantime, you can take advantage of the [unpkg CDN](https://unpkg.com/), which automatically provides
distribution for all NPM packages.

For easily getting all MDC-Web CSS:

```
https://unpkg.com/material-components-web@latest/dist/material-components-web.css
```

And JS:

```
https://unpkg.com/material-components-web@latest/dist/material-components-web.js
```

Check the [unpkg CDN main page](https://unpkg.com/) for more information on how to request particular version ranges.

There’s also the option of getting individual packages, rather than the `material-components-web` meta-package.


## Initializing components

Both MDL and MDC-Web require the user to provide a specific DOM for a component, in order for it to function correctly.
This DOM has certain requirements, such as requiring the presence of specific CSS classes, a certain hierarchy, and in
some cases, specific HTML elements.

MDL:

```html
<div class="mdl-text-field mdl-js-text-field">
  <input class="mdl-text-field__input" type="text" id="input">
  <label class="mdl-text-field__label" for="input">Input Label</label>
</div>
```


MDC-Web:

```html
<div class="mdc-text-field">
  <input class="mdc-text-field__input" type="text" id="input">
  <label for="input" class="mdc-text-field__label">Input Label</label>
  <div class="mdc-text-field__bottom-line"></div>
</div>
```

In MDC-Web, the DOM you specify must be complete; unlike MDL, the library will not create any missing elements for you.
This is done in order to make behavior more deterministic and give you greater freedom in customizing the non-critical
parts of a component's DOM.

Once a DOM is available, MDL manages component lifecycles automatically, by running through the page on load,
identifying DOM structures that correspond to MDL components, and automatically upgrading them.

In MDC-Web, however, you have the choice between managing components’ lifecycles yourself, or having them automatically
initialized, similarly to MDL.

### Auto-initialization

Auto-initialization is handled by the `@material/auto-init` package, so start by ensuring that you’re depending on it
(check the [Depending on MDC-Web section](#depending-on-mdc-web)).

For every component that you want to automatically initialize, set the `data-mdc-auto-init` attribute on the root
element, with the component’s class name as the value. For example:

```html
<div class="mdc-text-field" data-mdc-auto-init="MDCTextField">
  <input class="mdc-text-field__input" type="text" id="input">
  <label for="input" class="mdc-text-field__label">Input Label</label>
  <div class="mdc-text-field__bottom-line"></div>
</div>
```

Auto-initialization still needs to be triggered explicitly. An easy way of doing this is by adding a small script to the
bottom of your page:

```html
<script type="text/javascript">
  window.mdc.autoInit();
</script>
```

You can access a component’s JavaScript instance via the DOM, by looking in a property with the same name as the value
you passed to `data-mdc-auto-init`. So, for the example above:

```js
document.querySelector('.mdc-text-field').MDCTextField.disabled = true;
```

Be sure to read the [`@material/auto-init` README](../packages/mdc-auto-init/README.md) for more details.

### Manual lifecycle management

While auto-initialization works very well for simpler use-cases, manual management of components’ lifecycles is a better
option for complex applications that create and destroy parts of their user interface in runtime.

MDC-Web modules include both ES2015 sources and bundled, transpiled ES5, so you can choose the best option depending on
your build pipeline.

#### Importing a component from ES2015 sources

Start by importing the component:

```js
import {MDCTextField} from '@material/textfield';
```

And instantiate a component by calling the constructor on the root node:

```js
const textField = new MDCTextField(document.querySelector('.mdc-text-field'));
```

Be sure to store the returned instance somewhere so that you can access the instance when you need to; unlike
auto-initialization, there is no way to retrieve it later via the DOM.

#### Using the component class in an ES5 bundle

Each MDC-Web component ships with an ES5 transpiled [UMD](https://github.com/umdjs/umd) bundle, with component classes placed into a package-specific property inside of the `mdc` namespace. In order to easily access it in your code, you can do:

```js
const MDCTextField = mdc.textField.MDCTextField;
```

After that, you can instantiate a component by calling the constructor on the root node:

```js
const textField = new MDCTextField(document.querySelector('.mdc-text-field'));
```

Be sure to store the returned instance somewhere so that you can access the instance when you need to; unlike
auto-initialization, there is no way to retrieve it later via the DOM.


## Styling

Styling in MDL is achieved with a collection of CSS classes that get applied to the DOM. Internally, MDL is built with
Sass, but there was no effort in exposing the Sass mixins and functions to developers.

In MDC-Web, components can expose both CSS and Sass interfaces to their styles. This is particularly true for
foundational components, such as `@material/elevation` or `@material/theme`.

### Using CSS classes

Like in MDL, styling components with CSS classes is simply a matter of applied them to the DOM:

```html
<div class="mdc-text-field">
  <input type="text" id="my-text-field" class="mdc-text-field__input">
  <label class="mdc-text-field__label" for="my-text-field">Hint text</label>
  <div class="mdc-text-field__bottom-line"></div>
</div>
```

Every component lists the required CSS classes, as well as all of the optional modifiers, as part of their README.

### Using CSS Custom Properties

Some MDC-Web components include CSS custom properties as part of their interfaces. An example of this is the
`@material/layout-grid`, which exposes custom properties for modifying the default margin and gutter sizes:

```css
.my-grid {
  --mdc-layout-grid-margin: 40px;
  --mdc-layout-grid-gutter: 16px;
}
```

Be sure to read the README for each component to get all the details on their usage.

> **Note:** CSS Custom Property support in components is a progressive enhancement feature that doesn’t work in every
supported browser. If you’re using any custom properties, make sure your site doesn’t depend on them for any critical
features. For some of this functionality, we also provide pre-generated CSS classes as well as Sass variables and
mixins, which may cover your use-case.

### Using Sass

Many MDC-Web components expose Sass mixins and functions that you can directly use on your site. These make it possible
to customize components beyond what’s possible with the provided CSS classes, as well as reduce CSS class usage in the
DOM.

You can access the Sass sources for a component in the similarly named `scss` file at its package root:

```scss
@import "@material/layout-grid/mdc-layout-grid”;
```

In the case of `@material/layout-grid`, for example, there are several mixins that allow you to apply a layout grid
directly to your site, while customizing the margins and gutters:

```scss
.page-layout {
  @include mdc-layout-grid(16px, 16px, 1600px);
}

.page-layout > .sidebar {
  @include mdc-layout-grid-cell(16px, 4);
}
```

Since Sass is a preprocessor that generates static CSS output, this approach doesn’t require any special support in the
end user’s browser.


## Theming

Theming in MDL is primarily handled either by overriding the theme variables in Sass, or by depending on a pre-generated
CSS bundle with the colors baked in, via [the customizer](https://getmdl.io/customize/index.html).

In MDC-Web, all theming is handled via the `@material/theme` package. There’s the option of overriding the theme
variables in Sass, as in MDL, but there’s no longer a customizer or a CDN with different combinations. There is custom property support, however.

In the future, there will likely be other options available via a planned CDN.

For details on theming, please check the [`@material/theme` README](../packages/mdc-theme/README.md), but you’ll find a
summary below.

### Sass variables

In order to change the theme colors for your entire application, simply define the three theme color variables before
importing `@material/theme` or any MDC-Web components that rely on it:

```scss
$mdc-theme-primary: #9c27b0;
$mdc-theme-secondary: #ffab40;
$mdc-theme-background: #fff;

@import "@material/theme/mdc-theme";
```

The correct text colors will automatically be calculated based on the provided theme colors.

### CSS Custom Properties

If you’re comfortable relying on CSS Custom Properties for your theming, bearing in mind that it requires support in
end-users’ browsers, you can use the custom properties provided by `@material/theme`:

```css
:root {
  --mdc-theme-primary: #9c27b0;
  --mdc-theme-secondary: #ffab40;
  --mdc-theme-background: #fff;
}
```

Unfortunately, due to the current limitations of CSS color handling, it’s not currently possible to automatically
calculate the correct text colors to use, based on the chosen theme colors. These will all need to be set manually.
Please check the [`@material/theme` README](../packages/mdc-theme/README.md) for more details.


## Browser support

Unlike MDL, in which support goes back to Internet Explorer 9, MDC-Web only supports IE 11.

For modern major browsers, MDC-Web guarantees support for up to 2 versions prior to the current stable release.


## Component equivalence

For many components, there is a 1:1 relation between MDL and MDC-Web. In other cases there are some differences, with
MDL components being split up into multiple MDC-Web ones, new ones being added, and some still to be implemented.

The following table summarizes the current situation (TBI = to be implemented):

| MDL component | MDC-Web component | Notes |
| ------------- | ----------------- | ----- |
| `mdl-animation` | [`@material/animation`](../packages/mdc-animation/README.md) | Very similar. |
| `mdl-badge` | None | Not currently planned for MDC-Web. |
| `mdl-button` | Split into [`@material/button`](../packages/mdc-button/README.md) and [`@material/fab`](../packages/mdc-fab/README.md) | No icon button in MDC-Web at the moment, [TBI](https://github.com/material-components/material-components-web/issues/12). |
| `mdl-card` | [`@material/card`](../packages/mdc-card/README.md) | Very different DOM. More options in MDC-Web. |
| `mdl-checkbox` | [`@material/checkbox`](../packages/mdc-checkbox/README.md) | Very different DOM. Recommended use with [`@material/form-field`](../packages/mdc-form-field/README.md). |
| `mdl-chip` | TBI | [#56](https://github.com/material-components/material-components-web/issues/56) |
| `mdl-data-table` | TBI | [#57](https://github.com/material-components/material-components-web/issues/57) |
| `mdl-dialog` | [`@material/dialog`](../packages/mdc-dialog/README.md) | Sufficiently different from MDL. MDL uses the `dialog` element which has limited cross-browser support. `mdc-dialog` relies on elements with more cross-browser support. |
| `mdl-footer` | None | Not currently planned for MDC-Web. |
| `mdl-grid` | [`@material/layout-grid`](../packages/mdc-layout-grid/README.md) | Very similar. No offsets in MDC-Web. |
| `mdl-icon-toggle` | [`@material/icon-toggle`](../packages/mdc-icon-toggle/README.md) | Very different DOM. |
| `mdl-layout` | Split into [`@material/drawer`](../packages/mdc-drawer/README.md), [`@material/toolbar`](../packages/mdc-toolbar/README.md), and [`@material/layout-grid`](../packages/mdc-layout-grid/README.md) | No tabs component in MDC-Web at the moment, [TBI](https://github.com/material-components/material-components-web/issues/37). |
| `mdl-list` | [`@material/list`](../packages/mdc-list/README.md) | Very different DOM. |
| `mdl-menu` | [`@material/menu`](../packages/mdc-menu/README.md) | Very different DOM. |
| `mdl-palette` | TBI | [#27](https://github.com/material-components/material-components-web/issues/27) |
| `mdl-progress` | TBI | [#29](https://github.com/material-components/material-components-web/issues/29) |
| `mdl-radio` | [`@material/radio`](../packages/mdc-radio/README.md) | Very different DOM. Recommended use with [`@material/form-field`](../packages/mdc-form-field/README.md). |
| `mdl-resets` | None. | There are plans for an [optional resets/defaults library](https://github.com/material-components/material-components-web/issues/42). |
| `mdl-ripple` | [`@material/ripple`](../packages/mdc-ripple/README.md) | Very different usage; much improved in MDC-Web. |
| `mdl-shadow` | [`@material/elevation`](../packages/mdc-elevation/README.md) | Similar usage. |
| `mdl-slider` | TBI | [#25](https://github.com/material-components/material-components-web/issues/25) |
| `mdl-snackbar` | [`@material/snackbar`](../packages/mdc-snackbar/README.md) | Very different DOM. |
| `mdl-spinner` | TBI | [#30](https://github.com/material-components/material-components-web/issues/30) |
| `mdl-switch` | [`@material/switch`](../packages/mdc-switch/README.md) | Very different DOM. |
| `mdl-tabs` | [`@material/tabs`](../packages/mdc-tabs/README.md) | Very different DOM. |
| `mdl-text-field` | [`@material/textfield`](../packages/mdc-textfield/README.md) | Very different DOM. |
| `mdl-tooltip` | TBI | [#24](https://github.com/material-components/material-components-web/issues/24) |
| `mdl-typography` | [`@material/typography`](../packages/mdc-typography/README.md) | Somewhat different usage. |

New MDC-Web components:

| Component | Description |
| --------- | ----------- |
| [`@material/auto-init`](../packages/mdc-auto-init/README.md) | Helper for automatically initializing components (optional in MDC-Web). |
| [`@material/form-field`](../packages/mdc-form-field/README.md) | Helpers for using labels with form field elements (radios and checkboxes). |
| [`@material/grid-list`](../packages/mdc-grid-list/README.md) | An RTL-aware grid list component. |
| [`@material/rtl`](../packages/mdc-rtl/README.md) | Helpers for working with right-to-left languages. |
| [`@material/select`](../packages/mdc-select/README.md) | Select (AKA drop-down) component. |
| [`@material/theme`](../packages/mdc-theme/README.md) | Theming helpers for CSS and Sass. |
| [`@material/toolbar`](../packages/mdc-toolbar/README.md) | A container for multiple rows containing items such as application title, navigation menu, and tabs, among other things. |
