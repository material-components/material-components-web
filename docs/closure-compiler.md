<!--docs:
title: "Closure Compiler Annotations"
layout: landing
section: docs
path: /docs/closure-compiler/
-->

# MDC Web Authoring Practices for Interoperability with Closure Compiler

## Who this document is for

This document is for _core contributors to MDC Web, as well as contributors who wish to author
new components, or make non-trivial changes to existing components._ It assumes you're familiar with
our codebase, and have read through most of our [Authoring Components guide](./authoring-components.md).

## Why this is needed

MDC Web - and Material Design in general - was created by Google. Therefore, it is not only a top
priority that MDC Web works seamlessly for our external community, but also that _MDC Web works
seamlessly for all Google applications_.

At Google, all JavaScript is processed and minified by the
[Closure Compiler](https://github.com/google/closure-compiler) (which will be referred to as
**closure**, the **compiler**, or any combination of those terms). MDC Web is now in TypeScript, but will still need to
be transpiled to closure-annotated ES2015 for use at Google.

## MDC Web Type System

The overall type system is relatively straightforward, and boils down to 3 main concepts:

- **Adapters are simply interfaces with a predefined shape specifying functions.** There is no such thing as a
  "base adapter".
- **Foundations are parameterized by their adapters.** For example, an `MDCRippleFoundation` would be
  parameterized by an `MDCRippleAdapter`. Thus, the `MDCRippleFoundation` class is declared as
  `class MDCRippleFoundation extends MDCFoundation<MDCRippleAdapter>`.
- **Components are parameterized by their foundations.** For example, an `MDCRipple` would be
  parameterized by `MDCRippleFoundation`, which - as shown above - is itself parameterized by
  `MDCRippleAdapter`. Thus, the `MDCRipple` class is declared as
  `class MDCRipple extends MDCComponent<MDCRippleFoundation>`.

## MDC Web Closure Conventions

The following guidelines outline the general conventions for writing closure-friendly code for MDC Web.
This section should contain most - if not all - of what you need to get up and running writing components in our codebase.

### All `import` statements must _not_ use re-exported modules.

```js
// BAD
import {MDCFoundation} from '@material/base';
// GOOD
import {MDCFoundation} from '@material/base/foundation';
```

This is an unfortunate side-effect of how [closure's module naming mechanism works](https://github.com/google/closure-compiler/issues/2257).

### Standard foundation constants must be defined as `enum` types

- `cssClasses` and `strings` should be [string enums](https://www.typescriptlang.org/docs/handbook/enums.html#string-enums)
- `numbers` should be a [numeric enum](https://www.typescriptlang.org/docs/handbook/enums.html#numeric-enums)

```ts
enum cssClasses {
  // ...
}

enum strings {
  // ...
}

enum numbers {
  // ...
}

export {cssClasses, strings, numbers};
```

### All adapters must be defined as interfaces

Each adapter must be defined within an `adapter.ts` file in the component's package directory.
All methods should contain a summary of what they should do. This summary should be
copied over to the adapter API documentation in our README. This will facilitate future endeavors
to potentially automate the generation of our adapter API docs. _Note that this replaces the
inline comments present in the methods within `defaultAdapter`_.

```ts
// adapter.ts

interface MDCComponentAdapter {
  /**
   * Adds a class to the root element.
   */
  addClass(className: string): void;

  /**
   * Removes a class from the root element.
   */
  removeClass(className: string): void;
}

export default MDCComponentAdapter;
```

### Foundation classes must extend `MDCFoundation`

Foundations must extend `MDCFoundation` parameterized by their respective adapter. The
`defaultAdapter` must return an object with the correct adapter shape.

```ts
// foundation.ts

import {MDCFoundation} from '@material/base/foundation';
import MDCComponentAdapter from './adapter';

class MDCComponentFoundation extends MDCFoundation<MDCComponentAdapter> {
  static get defaultAdapter(): MDCComponentAdapter {
    return {
      addClass: (className: string) => {},
      removeClass: (className: string) => {},
    };
  }
}

export default MDCComponentFoundation;
```

### Component classes must extend `MDCComponent`

Components must extend `MDCComponent` parameterized by their respective foundation.

```ts
// index.ts

import {MDCComponent} from '@material/base/component';
import MDCComponentFoundation from './foundation';

class MDCAwesomeComponent extends MDCComponent<MDCComponentFoundation> {
  getDefaultFoundation(): MDCComponentFoundation {
    return new MDCComponentFoundation({
      addClass: (className: string) => this.root_.classList.add(className),
      removeClass: (className: string) => this.root_.classList.remove(className),
    });
  }
}

export default MDCAwesomeComponent;
```

### Interfaces for type definitions always end in `Type`

<!--{% raw %} -->
```ts
interface EventDataType {
  foo: string;
  bar: number;
}
```
<!--{% endraw %} -->

Using this convention allows us to write tooling around handling these expressions, such as lint rule exceptions.

### For key/value maps, use index signatures where possible

Index signatures are useful for homogeneous maps of key/value pairs, while interfaces are useful for specific object signatures.
Both are more specific than just typing something as `object`, and are thus preferable for their respective use cases.

<!--{% raw %} -->
```ts
static get strings(): {[key: string]: string} {
  ...
}
```
<!--{% endraw %} -->

## Where to go for more help

If you're working on an issue for MDC Web and find yourself wrestling with closure, please don't
hesitate to [reach out on our discord channel](https://discord.gg/pRKaJB9) and we'll try and help
you out.
