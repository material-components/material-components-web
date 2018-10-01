<!--docs:
title: "Importing JS Components"
navTitle: "Importing JS Components"
layout: landing
section: docs
path: /docs/importing-js/
-->

# Importing the JS component

Most components ship with Component / Foundation classes which are used to provide a full-fidelity Material Design component. Depending on what technology you use in your stack, there are several ways to import the JavaScript.

## ES2015

```js
import {MDCFoo, MDCFooFoundation} from '@material/foo';
```

Note that MDC Web's packages point `main` to pre-compiled UMD modules under `dist` to maximize compatibility.
Build toolchains often assume that dependencies under `node_modules` are already ES5, and thus skip transpiling them.

However, if you want to take advantage of tree-shaking and dependency sharing within MDC Web's code to reduce the size
of your built assets, you will want to explicitly reference the package's `index.js`, which contains the ES2015+ source:

```js
import {MDCFoo, MDCFooFoundation} from '@material/foo/index';
```

Note that in this case, you must ensure your build toolchain is configured to process and transpile MDC Web's modules
as well as your own. You will also need to include babel's
[`transform-object-assign`](https://www.npmjs.com/package/babel-plugin-transform-object-assign) plugin for IE 11 support.

See the [Getting Started guide](getting-started.md) for more details on setting up an environment.

## CommonJS

```js
const mdcFoo = require('mdc-foo');
const MDCFoo = mdcFoo.MDCFoo;
const MDCFooFoundation = mdcFoo.MDCFooFoundation;
```

## AMD

```js
require(['path/to/mdc-foo'], mdcFoo => {
  const MDCFoo = mdcFoo.MDCFoo;
  const MDCFooFoundation = mdcFoo.MDCFooFoundation;
});
```

## Global

```js
const MDCFoo = mdc.foo.MDCFoo;
const MDCFooFoundation = mdc.foo.MDCFooFoundation;
```
