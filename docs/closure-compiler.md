<!--docs:
title: "Closure Compiler Annotations"
layout: landing
section: docs
path: /docs/closure-compiler/
-->

# Annotating MDC-Web for the Closure Compiler

> TL;DR read the section on our [type system](#mdc-web-type-system) and our [closure compiler conventions](#mdc-web-closure-conventions).

## Who this document is for

This document is for _core contributors to MDC-Web, as well as contributors who wish to author
new components, or make non-trivial changes to existing components._ It assumes you're familiar with
our codebase, and have read through most of our [Authoring Components guide](./authoring-components.md).

## Why this is needed

MDC-Web - and Material Design in general - was created by Google. Therefore, it is not only a top
priority that MDC-Web works seamlessly for our external community, but also that _MDC-Web works
seamlessly for all Google applications_.

At Google, all Javascript is processed and minified by the
[Closure Compiler](https://github.com/google/closure-compiler) (which will be referred to as
**closure**, the **compiler**, or any combination of those terms). Thus, _in order for every Google
application to deem MDC-Web viable for use within it, the library must be compilable using
closure's [advanced compilation](https://developers.google.com/closure/compiler/docs/api-tutorial3)
mechanisms_.

### What about [externs](https://github.com/google/closure-compiler/wiki/FAQ#how-do-i-write-an-externs-file)?

Simply put: They will not cut it. When closure uses externs, it omits compiling those libraries;
instead it simply makes the compiled code aware they exist. This is unacceptable for many
applications at Google, whose build infrastructures require that all JS source code be compilable,
so as to maximize payload optimization and site speed performance.

## Closure Overview

If you've never worked on closure code before, we suggest you start by reading these pages in order:

1. https://github.com/google/closure-compiler/wiki/Annotating-JavaScript-for-the-Closure-Compiler
1. https://github.com/google/closure-compiler/wiki/Types-in-the-Closure-Type-System

You can also check out Google Developers's [Getting Started with the UI](https://developers.google.com/closure/compiler/docs/gettingstarted_ui) tutorial which will
introduce you to the [compiler appspot service](https://closure-compiler.appspot.com/home). The
service is extremely useful for testing and debugging closure code in isolation.

### Pro-tips for testing/debugging using the compiler appspot service

If/when using the appspot service, make sure you have `ADVANCED_OPTIMIZATIONS`
checked under the `optimization` option.

Furthermore, you may want to check the `Pretty Print` option if you're debugging the output code.

Additionally, if you use getter/setter properties within your code, add `// @language_out ECMASCRIPT5` in between the ClosureCompiler comment block, like:

```
// ==ClosureCompiler==
// @language_out ECMASCRIPT5
// ...Other configurations
// ==/ClosureCompiler==
```

This will tell closure to compile your code to ES5 (the default is ES3 which doesn't support
accessor properties).

You can use [this starter template](https://goo.gl/YSQkDi) to help debug your closure code, which
has all of the above settings pre-configured (Even though the UI shows optimization is simple).

## MDC-Web Type System

The following UML-like diagram shows a conceptual overview of the basic type system for MDC-Web. The
diagram uses closure-esque type syntax, and represents what's in [mdc-base](../packages/mdc-base).

![MDC-Web Type System UML(-like) diagram](https://docs.google.com/drawings/d/1mJBPiUkdFiXkU5A6kAdpZD5nXr6NkHIIW_vMNVdIvYY/pub?w=960&amp;h=720)

> Note that the actual code to express this parameterization will vary slightly from the UML above,
  since closure does not support bounded generics.

The overall type system is relatively straightforward, and boils down to 3 main concepts:

- **Adapters are simply [@record types](https://github.com/google/closure-compiler/wiki/Structural-Interfaces-in-Closure-Compiler) with a predefined shape specifying functions.** Because there
  is no such thing as a "base adapter", they are simply considered to be plain objects.
- **Foundations are parameterized by their adapters**. For example, an `MDCRippleFoundation` would be
  parameterized by an `MDCRippleAdapter`. Thus, when declaring the `MDCRippleFoundation` class, the
  proper JSDoc to specify this would be included: `@extends MDCFoundation<!MDCRippleAdapter>`.
- **Components are parameterized by their foundations**. For example, an `MDCRipple` would be
  parameterized by `MDCRippleFoundation`, which - as shown above - is itself parameterized by
  `MDCRippleAdapter`. Thus, when declaring the `MDCRipple` class, the proper JSDoc to specify this
  would be included: `@extends MDCComponent<!MDCRippleFoundation>`.

## MDC-Web Closure Conventions

The following guidelines outline the general conventions for writing closurized code for MDC-Web.
This section should contain most - if not all - of what you need to get up and running writing
closure for our codebase. It also includes an [example component skeleton](#an-example-component-skeleton).

### Making MDC-Web aware of closure components (temporary)

Until our [closure compatibility milestone](https://github.com/material-components/material-components-web/milestone/4) has been reached, please ensure that whenever a
component is annotated, it's directory name under `packages/` is added to the `"closureWhitelist"`
array within the top-level `package.json` file. This will allow our infrastructure to run build
tests against that package and its dependencies.

### Convention Guidelines

#### All `import` statements must _not_ use re-exported modules.

```js
// BAD
import {MDCFoundation} from '@material/base';
// GOOD
import MDCFoundation from '@material/base/foundation';
```

This is an unfortunate side-effect of how [closure's module naming mechanism works](https://github.com/google/closure-compiler/issues/2257).

#### All `export` statements must be consolidated into one line at the end of the file.

```js
// BAD
export function getFoo() {
...
export function getBar() {
// GOOD
function getFoo() {
...
function getBar() {
...
export {getFoo, getBar};
```


#### Standard foundation constants must be defined as `@enum` types

- `cssClasses` should be defined as `/** @enum {string} */`
- `strings` should be defined as `/** @enum {string} */`
- `numbers` should be defined as `/** @enum {number} */`

```js
/** @enum {string} */
const cssClasses = {
  // ...
};

/** @enum {string} */
const strings = {
  // ...
};

/** @enum {number} */
const numbers = {
  // ...
};

export {cssClasses, strings, numbers};
```

#### All adapters must be defined as `@record` types

Adapters must be defined within an `adapter.js` file in the component's package directory.
All methods should contain a summary of what they should do. This summary should be
copied over to the adapter API documentation in our README. This will facilitate future endeavors
to potentially automate the generation of our adapter API docs. _Note that this replaces the
inline comments present in the methods within `defaultAdapter`_.

```js
// adapter.js

/** @record */
class MDCComponentAdapter {
  /**
   * Adds a class to the root element.
   * @param {string} className
   */
  addClass(className) {}

  /**
   * Removes a class from the root element.
   * @param {string} className
   */
  removeClass(className) {}
}

export default MDCComponentAdapter;
```

#### All foundation and component classes must be marked as `@final`

Marking foundations/components as `@final` prevents unintended subclassing, which often leads to
[easily-breakable client code](https://medium.com/@rufuszh90/effective-java-item-17-design-and-document-for-inheritance-or-else-prohibit-it-be6041719fbc) (note that this excerpt is taken from the book [Effective Java, 2nd Edition](https://www.pearsonhighered.com/program/Bloch-Effective-Java-2nd-Edition/PGM310651.html) by Joshua Bloch).

The obvious exception to this rule is for classes that are intended to be subclassed. These should
be well documented, and made `@abstract` if possible.

#### Foundation classes must extend `MDCFoundation`

Foundations must extend `MDCFoundation` parameterized by their respective adapter. The
`defaultAdapter` must return an object with the correct adapter shape.

```js
// foundation.js

import MDCFoundation from '@material/base/foundation';
import MDCComponentAdapter from './adapter';

/**
 * @extends {MDCFoundation<!MDCComponentAdapter>}
 * @final
 */
class MDCComponentFoundation extends MDCFoundation {
  static get defaultAdapter() {
    return {
      addClass: () => {},
      removeClass: () => {},
    };
  }
}

export default MDCComponentFoundation;
```

#### Component classes must extend `MDCComponent`

Components must extend `MDCComponent` parameterized by their respective foundation.

```js
// index.js

import MDCComponent from '@material/base/component';
import MDCComponentFoundation from './foundation';

/**
 * @extends {MDCComponent<!MDCComponentFoundation>}
 * @final
 */
class MDCAwesomeComponent extends MDCComponent {
  /** @return {!MDCComponentFoundation} */
  getDefaultFoundation() {
    return new MDCComponentFoundation(/** @type {!MDCComponentAdapter} */ ({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
    }));
  }
}

export default MDCAwesomeComponent;
```

#### @typedefs are always `let` declarations, always pascal case, and always end in `Type`

<!--{% raw %} -->
```js
// GOOD
/**
 * @typedef {{foo: string, bar: number}}
 */
let EventDataType;

// GOOD
/**
 * @typedef {{foo: string, bar: number}}
 */
let EventDataType;

// BAD
/**
 * @typedef {{foo: string, bar: number}}
 */
MDCComponentFoundation.EventDataType;

// BAD
/**
 * @typedef {{foo: string, bar: number}}
 */
let eventDataType;

// BAD
/**
 * @typedef {{foo: string, bar: number}}
 */
let EventData;
```
<!--{% endraw %} -->

Using this convention allows us to write tooling around handling these expressions, such as
lint rule exceptions, and (in the future) code removal tools.

### Objects that use event names or other external symbols as keys must be declared as `@dict` or `!Object<string, T>`.

By default, when closure uses advanced compilation, it rewrites the property names of objects to be
as short as possible, ensuring the smallest possible code size. This is problematic when object
properties have semantic meaning for code used outside of closure. For example, if object keys
represent event names to be passed to `addEventListener`, or global settings to be affected by the
user, then the code will break when closure rewrites the property names. In order to prevent this,
objects with semantic keys must be declared as described above. Furthermore:

- All object keys _must be quoted_
- All references to object keys _must be done using bracket notation_

<!--{% raw %} -->
```js
// GOOD
/** @const {!Object<string, string>}  */
const activationDeactivationPairs = {
  'mousedown': 'mouseup',
  'touchstart': 'touchend',
};

// GOOD
/** @dict */
window.settings = {
  'windowObject': window,
  'domReadyEvent': 'onready',
  'scriptExecutionTimeoutMs': 3000,
}

// BAD (no quoted keys)
/** @type {{mousedown: !Function, touchstart: !Function}} */
const eventListenerMap = {
  mousedown: (evt) => handleMouseup(evt),
  touchstart: (evt) => handleTouchstart(evt),
};
```
<!--{% endraw %} -->

```js
// GOOD
el.addEventListener(activationDeactivationPairs['mousedown'], (evt) => this.deactivate(evt));

// GOOD
Object.keys(activationDeactivationPairs).forEach((activationEvt) => {
  const deactivationEvt = activationDeactivationPairs[activationEvt];

  el.addEventListener(activationEvt, (evt) => this.activate(evt));
  el.addEventListener(deactivationEvt, (evt) => this.deactivate(evt));
});

// BAD
el.addEventListener(activationDeactivationPairs.mousedown, (evt) => this.deactivate(evt));
```

#### `Object<string, T> vs. @dict`

- Use `Object<string, T>` for objects where _the type for every value must be the same_.
- Use `@dict` for objects where _the type for every value can vary_.

### An example component skeleton

The following shows a set of skeleton files for an example component:
`MDCExample`. This can be used as a reference model for annotating new or pre-existing
components for closure.

#### constants.js

```js

/** @enum {string} */
const cssClasses = {
  FADE_IN: 'mdc-example--fade-in',
  FADE_OUT: 'mdc-example--fade-out',
  IMPORTANT_MSG_FLASH: 'mdc-example__important-msg--flash',
};

/** @enum {string} */
const strings = {
  IMPORTANT_MSG_SELECTOR: '.mdc-example__important-msg',
};

/** @enum {number} */
const numbers = {
  FADE_DURATION_MS: 3000,
};

export {cssClasses, strings, numbers};
```

#### adapter.js

```js
/** @record */
class MDCExampleAdapter {
  /**
   * Adds a class to the root element.
   * @param {string} className
   */
  addClass(className) {}

  /**
   * Removes a class from the root element.
   * @param {string} className
   */
  removeClass(className) {}

  /**
   * Registers an event listener `handler` for event type `type` on the root element.
   * @param {string} type
   * @param {function(!Event): undefined} handler
   */
  registerInteractionHandler(type, handler) {}

  /**
   * Un-registers an event listener `handler` for event type `type` on the root element.
   * @param {string} type
   * @param {function(!Event): undefined} handler
   */
  deregisterInteractionHandler(type, handler) {}

  /**
   * Adds a class to the `important-msg` element.
   * @param {string} className
   */
  addClassToImportantMsg(className) {}

  /**
   * Removes a class from the `important-msg` element.
   * @param {string} className
   */
  removeClassFromImportantMsg(className) {}
}

export default MDCExampleAdapter;
```

#### foundation.js

```js
import MDCFoundation from '@material/base/foundation';
import MDCExampleAdapter from './adapter';
import {cssClasses, strings, numbers} from './constants';

/**
 * @extends {MDCFoundation<!MDCExampleAdapter>}
 * @final
 */
class MDCExampleFoundation extends MDCFoundation {
  /** @return enum {string} */
  static get cssClasses() {
    return cssClasses;
  }

  /** @return enum {string} */
  static get strings() {
    return strings;
  }

  /** @return enum {number} */
  static get numbers() {
    return numbers;
  }

  /** @return {!MDCExampleAdapter} */
  static get defaultAdapter() {
    return /** @type {!MDCExampleAdapter} */ ({
      addClass: () => {},
      removeClass: () => {},
      registerInteractionHandler: () => {},
      deregisterInteractionHandler: () => {},
      addClassToImportantMsg: () => {},
      removeClassFromImportantMsg: () => {},
    });
  }

  /**
   * @param {!MDCExampleAdapter} adapter
   */
  constructor(adapter) {
    super(Object.assign(MDCExampleFoundation.defaultAdapter, this));
    /** @private {boolean} */
    this.active_ = false;
    /** @private {number} */
    this.fadeInTimer_ = 0;
    /** @private {number} */
    this.fadeOutTimer_ = 0;
  }

  /**
   * @return {boolean}
   */
  isActive() {
    return this.active_;
  }

  /**
   * @param {boolean} active
   */
  setActive(active) {
    const {FADE_IN, FADE_OUT, IMPORTANT_MSG_FLASH} = cssClasses;
    this.active_ = active;
    if (this.active_) {
      this.adapter_.addClassToImportantMsg(IMPORTANT_MSG_FLASH);
      this.startFadeTimers_();
    } else {
      clearTimeout(this.fadeInTimer_);
      clearTimeout(this.fadeOutTimer_);
      this.adapter.removeClass(FADE_OUT);
      this.adapter_.removeClass(FADE_IN);
      this.adapter_.removeClassFromImportantMsg(IMPORTANT_MSG_FLASH);
    }
  }

  /**
   * @private
   */
  startFadeTimers_() {
    const {FADE_OUT, FADE_IN} = cssClasses;
    const {FADE_DURATION_MS} = numbers;

    this.adapter_.removeClass(FADE_OUT);
    this.adapter_.addClass(FADE_IN);
    this.fadeOutTimer_ = setTimeout(() => {
      this.adapter_.removeClass(FADE_IN);
      this.adapter_.addClass(FADE_OUT);
      this.fadeInTimer_ = setTimeout(() => this.startFadeTimers_(), FADE_DURATION_MS);
    }, FADE_DURATION_MS);
  }
}

export default MDCExampleFoundation;
```

#### index.js

```js
import MDCComponent from '@material/base/component';
import MDCExampleFoundation from './foundation';
import {strings} from './constants';

export {MDCExampleFoundation};

/**
 * @extends {MDCComponent<!MDCExampleFoundation>}
 * @final
 */
class MDCExample {
  /**
   * @param {!Element} root
   * @return {!MDCExample}
   */
  static attachTo(root) {
    return new MDCExample(root);
  }

  /**
   * @return {boolean}
   */
  get active() {
    return this.foundation_.isActive();
  }

  /**
   * @param {boolean} active
   */
  set active(active) {
    this.foundation_.setActive(active);
  }

  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);
    /** @private {?Element} */
    this.importantMsg_;
  }

  initialize() {
    this.importantMsg_ = this.root_.querySelector(strings.IMPORTANT_MSG_SELECTOR);
  }

  /**
   * @return {!MDCExampleFoundation}
   */
  getDefaultFoundation() {
    return new MDCExampleFoundation({
      addClass: (className) => this.root_.classList.add(className),
      removeClass: (className) => this.root_.classList.remove(className),
      registerInteractionHandler: (type, handler) => this.root_.addEventListener(type, handler),
      deregisterInteractionHandler: (type, handler) => {
        this.root_.removeEventListener(type, handler);
      },
      addClassToImportantMsg: (className) => this.importantMsg_.classList.add(className),
      removeClassFromImportantMsg: (className) => this.importantMsg_.classList.remove(className),
    });
  }

  initialSyncWithDOM() {
    this.active = 'active' in this.root_.dataset;
  }
}

export MDCExample;
```

## Closure idioms in our codebase

Because closure uses JSDoc as its type system, some of the idioms used to declare types in closure
may seem a bit foreign, or take some time to get used to. This section is an attempt to document
these idioms so that you'll expect them as you look through our codebase, and understand why they
exist.

### `@record` Declaration via class declaration

**Example**:

```js
/** @record */
class MDCComponentAdapter {
  /**
   * @param {string} className
   */
  addClass(className) {}

  /**
   * @param {string} className
   */
  removeClass(className) {}

  /**
   * @return {number}
   */
  getOffsetWidth() {}
}
```

This is the syntax we use for specifying [structural types](https://github.com/google/closure-compiler/wiki/Structural-Interfaces-in-Closure-Compiler) within closure.
The class methods, their parameters, and corresponding JSDoc specify the shape of an
object that must contain these methods with their specified parameters and return values. This is
mostly used to specify the shape of adapters, as mentioned above.

### `@typedef` via `let` declaration

**Example**:

<!--{% raw %} -->
```js
/**
 * @typedef {{
 *   isActivated: boolean,
 *   wasActivatedByPointer: boolean,
 *   wasElementMadeActive: boolean,
 *   activationStartTime: number,
 *   activationEvent: ?Event
 * }}
 */
let ActivationStateType;

/**
 * @typedef {{foo: number}}
 */
let MyExportedType;

export MyExportedType;
```
<!--{% endraw %} -->

While these `let` declarations do not do anything at runtime, they are used by closure to
encapsulate complex types as specified through a [\@typedef statement](https://github.com/google/closure-compiler/wiki/Types-in-the-Closure-Type-System#typedefs). The statements above let both `ActivationStateType` and `MyExportedType` be used as type
parameters throughout the rest of the code.

### "Dictionary" objects via quoted keys / bracket references

**Example**:

```js
/** @dict */
const SETTINGS = {
  'numRetries': 1,
  'selectorToQuery': 'body',
  'windowObject': window,
};

window.settings = SETTINGS;

/** @const {!Object<string, string>} */
const DEACTIVATION_ACTIVATION_PAIRS = {
  'mouseup': 'mousedown',
  'pointerup': 'pointerdown',
  'touchend': 'touchstart',
  'keyup': 'keydown',
  'blur': 'focus',
};

Object.keys(DEACTIVATION_ACTIVATION_PAIRS).forEach((deactivationEvt) => {
  const activationEvt = DEACTIVATION_ACTIVATION_PAIRS[deactivationEvt];
  domNode.addEventListener(activationEvt, someActivationListener);
  domNode.addEventListener(deactivationEvt, someDeactivationListener);
});

/** @const {!Array<!Object<string, !Function>>} */
const listeners = [
  {
    'mouseup': () => console.log('mouseup'),
    'mousedown': () => console.log('mousedown'),
  },
  {
    'keyup': () => console.log('keyup'),
    'keydown': () => console.log('keydown'),
  },
];

console.log(listeners[0]['mouseup']);
```

Sometimes in our code, object keys will have meaning outside just being a key for an object. An
example of this might be a map of event types to their respective listeners, as shown above.

When closure compiles javascript using advanced optimizations, it [obfuscates property values](https://developers.google.com/closure/compiler/docs/api-tutorial3#better) in
objects, classes, etc. While this leads to smaller code, it also leads to issues when those
properties are used externally. In order to prevent this behavior, object keys need to be quoted,
and those keys need to be referenced using bracket notation.

### Member declarations via sentinel property reference expressions.

Closure enforces that properties cannot be added to object instances unless those properties are
specified in their constructors. This is problematic in cases where a base constructor calls a
"setup" function in which properties are added to the instance. This is a pattern we use in our
codebase via `MDCComponent#initialize()`, so that the component has an opportunity to perform any
instantiation logic without losing all of the base constructor logic of assigning a root element,
instantiating an adapter, etc.

To get around this, we simply create a sentinel expression statement that references the property.
This sentinel expression lets closure know of the property declaration, which is declared _within_
the constructor via a different function.

**Example:**

```js
/**
 * @extends {MDCComponent<!MyComponentFoundation>}
 * @final
 */
class MyComponent extends MDCComponent {
  /**
   * @param {...?} args
   */
  constructor(...args) {
    super(...args);
    /** @private {?Element} */
    this.innerEl_;  // Sentinel expression statement
  }

  initialize() {
    this.innerEl_ = this.root_.querySelector('.mdc-my-component__inner-el');
  }
}
```

The reason we cannot simple declare the property first as following is because
closure mandates that `super()` be the first expression within a method.

```
constructor(...args) {
    /** @private {?Element} */
    this.innerEl_ = DEFAULT_VALUE;
    super(...args);
  }
```
Because `initialize()` is called as part of the `super()` call within the constructor,
we cannot assign a default value to `this.innerEl_` within the constructor since it
would override what's been assigned in `initialize()`.

While this may seem very foreign coming from outside of closure, it is a [common idiom used by closure code](https://github.com/google/closure-compiler/wiki/Types-in-the-Closure-Type-System#typedefs).

## Handling third-party code

Some of our components rely on third-party modules. These modules must be typed as **externs**
within `closure_externs.js`. In most cases, you will not need to worry about doing this, as a core
team member will most likely assist you with it. However, the details of typing these modules can
be found within that file.

## Where to go for more help

If you're working on an issue for MDC-Web and find yourself wrestling with closure, please don't
hesitate to [reach out on our discord channel](https://discord.gg/pRKaJB9) and we'll try and help
you out.
