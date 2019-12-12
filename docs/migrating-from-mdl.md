<!--docs:
title: "Migrating from Material Design Lite"
navTitle: "Migrating from MDL"
layout: landing
section: docs
path: /docs/migrating-from-mdl/
-->

# Migrating from Material Design Lite

Material Components for the web (MDC Web) is the successor to the Material Design Lite (MDL) project.

While the philosophy behind the two projects is quite similar, migrating to MDC Web requires a number of changes, from
class names to different DOM structures. In addition, there are several choices to be made regarding component
initialization, how to depend on MDC Web, and theming/styling mechanisms.

This document attempts to summarize and guide you through the work involved. Let’s get started!

> **Note:** If you’re thinking of migrating your application to MDC Web, please bear in mind that it’s still in an alpha
state and thus APIs and certain UX features are subject to change.


## Depending on MDC Web

MDL is distributed on npm, Bower, and through its own CDN. It is a singular, universal library consisting of all
components and styles in one package.

In contrast, MDC Web is available only via npm. It is designed to be modular and is subdivided into individual component
packages, in addition to the all-encompassing `material-components-web` package, allowing you to choose whether to pull
in everything, or just the packages you want.

### npm

MDC Web is available on [npm](https://www.npmjs.com/), with packages living under the `@material` namespace.

In order to install e.g. the button component, you can run:

```
npm install @material/button
```

Some packages serve as dependencies for others, so don’t be surprised if you end up with multiple packages in your
`node_modules` folder! There are very few runtime dependencies outside of MDC Web, so the dependency tree should remain
small.

If you want all of MDC Web, you can pull in the meta package:

```
npm install material-components-web
```

### Content Distribution Network (CDN)

While MDL is available over a CDN, there’s currently no equivalent in MDC Web.

In the meantime, you can take advantage of the [unpkg CDN](https://unpkg.com/), which automatically provides
distribution for all npm packages.

For easily getting all MDC Web CSS:

```
https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css
```

And JS:

```
https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js
```

Check the [unpkg CDN main page](https://unpkg.com/) for more information on how to request particular version ranges.

You can also request individual packages' JS and CSS, e.g.:

```
https://unpkg.com/@material/textfield@latest/dist/mdc.textfield.min.js
https://unpkg.com/@material/textfield@latest/dist/mdc.textfield.min.css
```

> **Note:** We heavily recommend installing MDC Web packages locally in order to take full advantage of their
customization APIs. See the [Getting Started Guide](getting-started.md) for more information.

## Initializing components

Both MDL and MDC Web require the user to provide a specific DOM structure for a component, in order for it to function
correctly. This DOM has certain requirements, such as requiring the presence of specific CSS classes, a certain
hierarchy, and in some cases, specific HTML elements.

MDL:

```html
<div class="mdl-text-field mdl-js-text-field">
  <input class="mdl-text-field__input" type="text" id="input">
  <label class="mdl-text-field__label" for="input">Input Label</label>
</div>
```

MDC Web:

```html
<label class="mdc-text-field">
  <input class="mdc-text-field__input" type="text" id="input">
  <label for="input" class="mdc-floating-label">Input Label</label>
  <div class="mdc-line-ripple"></div>
</label>
```

In MDC Web, the DOM you specify must be complete; unlike MDL, the library will not create any missing elements for you.
This is done in order to make behavior more deterministic and give you greater freedom in customizing the non-critical
parts of a component's DOM.

Once a DOM is available, MDL manages component lifecycles automatically, by running through the page on load,
identifying DOM structures that correspond to MDL components, and automatically upgrading them.

In MDC Web, however, you have the choice between managing components’ lifecycles yourself, or having them automatically
initialized, similarly to MDL.

### Auto-initialization

Auto-initialization is handled by the `@material/auto-init` package, so start by ensuring that you’re depending on it
(check the [Depending on MDC Web section](#depending-on-mdc-web)).

For every component that you want to automatically initialize, set the `data-mdc-auto-init` attribute on the root
element, with the component’s class name as the value. For example:

```html
<label class="mdc-text-field" data-mdc-auto-init="MDCTextField">
  <input class="mdc-text-field__input" type="text" id="input">
  <label for="input" class="mdc-floating-label">Input Label</label>
  <div class="mdc-line-ripple"></div>
</label>
```

Auto-initialization needs to be triggered explicitly, but doing so is very straightforward.

If you're using already-transpiled JS:

```js
mdc.autoInit();
```

If you're using ES Module syntax:

```js
import autoInit from '@material/auto-init';

autoInit();
```

When using `autoInit`, you can access a component’s JavaScript instance via its root DOM element, on a property with the
same name as the value you passed to `data-mdc-auto-init`. So, for the example above:

```js
document.querySelector('.mdc-text-field').MDCTextField.disabled = true;
```

See the [`@material/auto-init` README](../packages/mdc-auto-init/README.md) for more details.

### Manual lifecycle management

While auto-initialization works very well for simpler use cases, manual management of components’ lifecycles is a better
option for complex applications that dynamically create and destroy parts of their user interface.

MDC Web modules include both UMD and ES Module sources. Both are transpiled ES5, so you can choose the best option depending on
your build toolchain.

> **Note:** When instantiating manually, be sure to store the returned instance somewhere so that you can access it when
you need to; unlike with auto-initialization, there is no way to retrieve it later via the DOM.

#### Importing a component from ES Module sources

Start by importing the component:

```js
import {MDCTextField} from '@material/textfield';
```

Then instantiate it by calling the constructor on the root node:

```js
const textField = new MDCTextField(document.querySelector('.mdc-text-field'));
```

> See the [Getting Started Guide](getting-started.md) for information on setting up a toolchain to consume ES Modules.

#### Using the component class in an ES5 bundle

Each MDC Web component ships with a transpiled ES5 [UMD](https://github.com/umdjs/umd) bundle, with component classes
placed into a package-specific property inside of the `mdc` namespace. These bundles are located under the `dist`
subdirectory in each published package, as opposed to the ES Modules sources under the root directory.

Aside from how the module is referenced, its usage otherwise remains the same. Instantiate a component by calling the
constructor on the root node:

```js
var textField = new mdc.textField.MDCTextField(document.querySelector('.mdc-text-field'));
```

## Styling

Styling in MDL is achieved with a collection of CSS classes that get applied to the DOM. Internally, MDL is built with
[Sass](http://sass-lang.com/), but there was no effort in exposing the Sass mixins and functions to developers.

MDC Web similarly involves applying CSS classes to the DOM, but it also puts much more emphasis on customization via
Sass mixins and functions.

### Using CSS classes

Like in MDL, styling components with CSS classes is simply a matter of applying them to the DOM:

```html
<div class="mdc-button mdc-button--raised">Button</div>
```

Each component lists the required CSS classes, as well as all of the optional modifiers, as part of its README.

### Using Sass

MDC Web components expose Sass mixins and functions to help customize properties supported by Material Theming.

You can access the Sass sources for a component in the similarly named `scss` file at its package root:

```scss
@import "@material/button/mdc-button";
```

In the case of `@material/button`, for example, there are several mixins that allow you to customize specific button
properties, as well as a convenience mixin to specify a fill color and automatically determine an accessible ink color:

```scss
.my-button {
  @include mdc-button-filled-accessible(darkblue);
}
```

## Theming

Theming in MDL is primarily handled either by overriding the theme variables in Sass, or by depending on a pre-generated
CSS bundle with the colors baked in, via [the customizer](https://getmdl.io/customize/index.html).

MDC Web similarly includes several centralized theme variables in the `@material/theme` package, along with helper
mixins and functions. Furthermore, MDC Web supports fine-grained theme customization via Sass mixins in each respective
component package. As with MDL, you can override the theme variables in Sass, but there’s no longer a customizer or a
CDN with different combinations. There is CSS custom property support, however.

In the future, additional tools will be available to assist in theme customization.

The process of customizing central theme variables is described in the following sections, but check the
[`@material/theme` README](../packages/mdc-theme/README.md) as well as the Sass APIs in each package for more details.

### Sass variables

In order to change the theme colors for your entire application, simply define the desired theme color variables before
importing `@material/theme` or any MDC Web components that rely on it:

```scss
$mdc-theme-primary: #9c27b0;
$mdc-theme-secondary: #ffab40;
$mdc-theme-background: #fff;

@import "@material/theme/mdc-theme";
```

The correct text colors will automatically be calculated based on the provided theme colors.

### CSS custom properties

If you are only targeting browsers which support CSS custom properties, you can use the custom properties provided by
`@material/theme`:

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

Unlike MDL, in which support goes back to Internet Explorer 9, MDC Web only supports IE 11.

For modern browsers, MDC Web supports the 2 most recent stable releases.

## Component equivalence

For many components, there is a 1:1 relation between MDL and MDC Web. In other cases there are some differences, with
MDL components being split up into multiple MDC Web ones, new ones being added, and some still to be implemented.

The following table summarizes the current situation (TBI = to be investigated):

| MDL component | MDC Web component | Notes |
| ------------- | ----------------- | ----- |
| `mdl-animation` | [`@material/animation`](../packages/mdc-animation/README.md) | Very similar. |
| `mdl-badge` | None | Not currently planned for MDC Web. |
| `mdl-button` | Split into [`@material/button`](../packages/mdc-button/README.md) and [`@material/fab`](../packages/mdc-fab/README.md) | No equivalent to MDL's Icon Button in MDC Web at the moment, [TBI](https://github.com/material-components/material-components-web/issues/12). |
| `mdl-card` | [`@material/card`](../packages/mdc-card/README.md) | Very different DOM. More options in MDC Web. |
| `mdl-checkbox` | [`@material/checkbox`](../packages/mdc-checkbox/README.md) | Very different DOM. Recommended use with [`@material/form-field`](../packages/mdc-form-field/README.md). |
| `mdl-chip` | [`@material/chips`](../packages/mdc-chips/README.md) | Different DOM and variants. |
| `mdl-data-table` | TBI | [#57](https://github.com/material-components/material-components-web/issues/57) - In the interim, consider using MDC List with flexbox. |
| `mdl-dialog` | [`@material/dialog`](../packages/mdc-dialog/README.md) | Sufficiently different from MDL. MDL uses the `dialog` element which has limited cross-browser support. `mdc-dialog` relies on elements with more cross-browser support. |
| `mdl-footer` | None | Not currently planned for MDC Web. |
| `mdl-grid` | [`@material/layout-grid`](../packages/mdc-layout-grid/README.md) | Very similar. No offsets in MDC Web. |
| `mdl-icon-toggle` | [`@material/icon-button`](../packages/mdc-icon-button/README.md) | Very different DOM. |
| `mdl-layout` | Split into [`@material/drawer`](../packages/mdc-drawer/README.md), [`@material/top-app-bar`](../packages/mdc-top-app-bar/README.md), [`@material/layout-grid`](../packages/mdc-layout-grid/README.md), and [`@material/tab-bar`](../packages/mdc-tab-bar/README.md), [`@material/tab-scroller`](../packages/mdc-tab-scroller/README.md), [`@material/tab`](../packages/mdc-tab/README.md), [`@material/tab-indicator`](../packages/mdc-tab-indicator/README.md) | Different DOM and variants. |
| `mdl-list` | [`@material/list`](../packages/mdc-list/README.md) | Very different DOM. |
| `mdl-menu` | [`@material/menu`](../packages/mdc-menu/README.md) | Very different DOM. |
| `mdl-palette` | [`@material/theme`](../packages/mdc-theme/README.md) | All theming is handled via [`@material/theme`](../packages/mdc-theme/README.md). |
| `mdl-progress` | [`@material/linear-progress`](../packages/mdc-linear-progress/README.md) | Very different DOM. |
| `mdl-radio` | [`@material/radio`](../packages/mdc-radio/README.md) | Very different DOM. Recommended use with [`@material/form-field`](../packages/mdc-form-field/README.md). |
| `mdl-resets` | None. | Not currently planned for MDC Web. |
| `mdl-ripple` | [`@material/ripple`](../packages/mdc-ripple/README.md) | Very different usage; much improved in MDC Web. |
| `mdl-shadow` | [`@material/elevation`](../packages/mdc-elevation/README.md) | Similar usage. |
| `mdl-slider` | [`@material/slider`](../packages/mdc-slider/README.md) | Very different DOM. |
| `mdl-snackbar` | [`@material/snackbar`](../packages/mdc-snackbar/README.md) | Very different DOM. |
| `mdl-spinner` | TBI | [#30](https://github.com/material-components/material-components-web/issues/30) |
| `mdl-switch` | [`@material/switch`](../packages/mdc-switch/README.md) | Very different DOM. |
| `mdl-tabs` | Split into [`@material/tab-bar`](../packages/mdc-tab-bar/README.md), [`@material/tab-scroller`](../packages/mdc-tab-scroller/README.md), [`@material/tab`](../packages/mdc-tab/README.md), [`@material/tab-indicator`](../packages/mdc-tab-indicator/README.md) | Very different DOM. |
| `mdl-text-field` | [`@material/textfield`](../packages/mdc-textfield/README.md) | Very different DOM and variants. |
| `mdl-tooltip` | TBI | [#24](https://github.com/material-components/material-components-web/issues/24) |
| `mdl-typography` | [`@material/typography`](../packages/mdc-typography/README.md) | Somewhat different usage; different/updated typography styles. |

MDC Web also includes several new components/packages which have no MDL equivalents. See the list of
[Material Components for the web](https://material.io/components/web/catalog/) for more information.
