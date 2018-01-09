# Importing the JS component

Most components ship with Component / Foundation classes which are used to provide a full-fidelity Material Design component. Depending on what technology you use in your stack, there are several ways to import the JavaScript.

## ES2015

```javascript
import {MDCFoo, MDCFooFoundation} from '@material/foo';
```

## CommonJS

```javascript
const mdcFoo = require('mdc-foo');
const MDCFoo = mdcFoo.MDCFoo;
const MDCFooFoundation = mdcFoo.MDCFooFoundation;
```

## AMD

```javascript
require(['path/to/mdc-foo'], mdcFoo => {
  const MDCFoo = mdcFoo.MDCFoo;
  const MDCFooFoundation = mdcFoo.MDCFooFoundation;
});
```

## Global

```javascript
const MDCFoo = mdc.foo.MDCFoo;
const MDCFooFoundation = mdc.foo.MDCFooFoundation;
```

## Automatic Instantiation

```javascript
mdc.foo.MDCFoo.attachTo(document.querySelector('.mdc-foo'));
```

## Manual Instantiation

```javascript
import {MDCFoo} from '@material/foo';

const foo = new MDCFoo(document.querySelector('.mdc-foo'));
```
