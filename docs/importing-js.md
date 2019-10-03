<!--docs:
title: "Importing JS Components"
navTitle: "Importing JS Components"
layout: landing
section: docs
path: /docs/importing-js/
-->

# Importing the JS component

Most components ship with Component / Foundation classes which are used to provide a full-fidelity Material Design component. Depending on what technology you use in your stack, there are several ways to import the JavaScript.

### ES Modules

```js
import {MDCFoo, MDCFooFoundation} from '@material/foo';
```

Note that MDC Web's packages point `main` to pre-compiled UMD modules under `dist` to maximize compatibility.
Build toolchains often assume that dependencies under `node_modules` are already ES5, and thus skip transpiling them.

However, if you want to take advantage of tree-shaking and dependency sharing within MDC Web's code to reduce the size
of your built assets, you will want to explicitly reference the package's `index.js`:

```js
import {MDCFoo, MDCFooFoundation} from '@material/foo/index';
```

Certain build tools will detect the [`module`](https://github.com/rollup/rollup/wiki/pkg.module) property in `package.json`,
which points to an ES Module otherwise only containing ES5 syntax.
If you're using [Webpack](https://webpack.js.org/) or
[Rollup](https://rollupjs.org/guide/en), you do not need to
reference `/index` directly, and can continue to use the shorter
`@material/foo` import path syntax.

Note that in this case, you must ensure your build toolchain is configured to process MDC Web's modules
as well as your own.

See the [Getting Started guide](getting-started.md) for more details on setting up an environment.

#### TypeScript

If you are using TypeScript, MDC Web's packages also include `.d.ts` files for your consumption.
Most of the time you shouldn't need to explicitly reference these, as the TypeScript compiler should automatically
find them via the `types` property found in `package.json`. There is a bundled `.d.ts` file found under the `dist`
directory that maps to the respective UMD module.
There are corresponding `.d.ts` files for each foundation/component/adapter/etc. within the package.

> NOTE: We intentionally omit `.ts` source files in our packages because the `.d.ts` files and transpiled `.js` (in UMD or ES Module format) are universally accepted.

### CommonJS

```js
const mdcFoo = require('mdc-foo');
const MDCFoo = mdcFoo.MDCFoo;
const MDCFooFoundation = mdcFoo.MDCFooFoundation;
```

### AMD

```js
require(['path/to/mdc-foo'], mdcFoo => {
  const MDCFoo = mdcFoo.MDCFoo;
  const MDCFooFoundation = mdcFoo.MDCFooFoundation;
});
```

### Global / CDN

```js
const MDCFoo = mdc.foo.MDCFoo;
const MDCFooFoundation = mdc.foo.MDCFooFoundation;
```

## Instantiating Components via CSS Selector Queries

Many of the examples across the MDC Web documentation demonstrate how to create a component instance for a single element in a page:

```js
const foo = new MDCFoo(document.querySelector('.mdc-foo'));
```

This assumes there is one element of interest on the entire page, because `document.querySelector` always returns at most one element (the first match it finds).

To instantiate components for **multiple** elements at once, use `querySelectorAll`:

```js
const foos = [].map.call(document.querySelectorAll('.mdc-foo'), function(el) {
  return new MDCFoo(el);
});
```
