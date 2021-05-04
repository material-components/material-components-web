# Best Practices

MDC Web follows naming and documentation best practices to keep our code
consistent, and our APIs user-friendly. We follow isolation best practices to
keep our code loosely coupled. And we follow performance best practices to keep
our components fast.

### Naming

*  Match [spec](https://material.io/guidelines) whenever possible. If the nomenclature used in spec conflicts with a natively implemented element or pattern, reach out for guidance
*  Use the [BEM naming convention](http://getbem.com/naming/) for CSS classes

### Documentation

* Keep documentation short, don't use ten words when one will do
* Let Material Design guidelines cover when/why to use a component

### Isolation

*  Never reference [element](https://developer.mozilla.org/en-US/docs/Web/API/Element) directly in the Foundation

TODO: Add more notes about how to isolate subsystems from component specifics

### Performance

*  Only animate properties that will run on the GPU
*  Use `requestAnimationFrame`
*  Avoid constant synchronous DOM reads/writes
*  Reduce the number of composite layers

### Typescript

#### Definite assignment operator
* MDC Web has other lifecycle methods (`initialize()` and `initSyncWithDom()`) that are not contained within the `constructor`.
* Typescript compiler cannot infer that the other methods are run in conjunction, and will throw an error on properties not defined.
* Feel free to use the `!` when you run into the error `<PROPERTY_NAME> has no initializer and is not definitely assigned in the constructor.`. ie.

```
private progress!: number; // Assigned in init

init() {
  this.progress = 0;
}
```

#### type vs. interface

* Prefer `interface` over `type` for defining types when possible.

#### any vs. unknown vs. {}

* Defer to using `unknown` over both `any` and `{}` types.
* If you must choose between `any` and `{}` defer to `{}`.

#### Events

* `@material/base` defines convenience types (`EventType` and `SpecificEventListener`) for working with events and event listeners.
* Prefer to type as `EventType` over `string` when you expect that the string will be a standard event name (e.g. `click`, `keydown`).
* Prefer to type as `SpecificEventListener` over `EventListener` when you know what type of event is being listened for (e.g. `SpecificEventHandler<'click'>`).

#### When to use Node/Element/HTMLElement

* `Node` is more generic than `Element`, while `Element` is more generic than `HTMLElement`.
* `Node` is mainly used for the document or comments/text.
* `Element` should be used when the type in question could be `HTMLElement`, `SVGElement`, or others.
* `HTMLElement` only pertains to DOM Elements such as `<a>`, `<li>`, `<div>` just to name a few.
* Use the most generic type that you think is possible during runtime.

#### Foundation `import` statements must _not_ use re-exported modules

Only the `index.ts` or `component.ts` files are allowed to reference from other component packages' `index.ts`.
This is because wrapping libraries only use `foundation` and `adapter`, so we should decouple the `component`.

```ts
// BAD
import {MDCFoundation} from '@material/base';
// GOOD
import {MDCFoundation} from '@material/base/foundation';
```

#### All adapters must be defined as interfaces

Each adapter must be defined within an `adapter.ts` file in the component's package directory.
All methods should contain a summary of what they should do. This summary should be
copied over to the adapter API documentation in our README. This will facilitate future endeavors
to potentially automate the generation of our adapter API docs.
_Note that this replaces the inline comments present in the methods within `defaultAdapter`_.

```ts
// adapter.ts
export interface MDCComponentAdapter {
  /**
   * Adds a class to the root element.
   */
  addClass(className: string): void;

   /**
   * Removes a class from the root element.
   */
  removeClass(className: string): void;
}
```

#### Foundation classes must extend `MDCFoundation`

Foundations must extend `MDCFoundation` parameterized by their respective adapter.
The `defaultAdapter` must return an object with the correct adapter shape.

```ts
// foundation.ts
import {MDCFoundation} from '@material/base/foundation';
import MDCComponentAdapter from './adapter';
export class MDCComponentFoundation extends MDCFoundation<MDCComponentAdapter> {
  static get defaultAdapter(): MDCComponentAdapter {
    return {
      addClass: (className: string) => undefined,
      removeClass: (className: string) => undefined,
    };
  }
}
```

#### Component classes must extend `MDCComponent`

Components must extend `MDCComponent` parameterized by their respective foundation.

```ts
// index.ts
import {MDCComponent} from '@material/base/component';
import MDCComponentFoundation from './foundation';
export class MDCAwesomeComponent extends MDCComponent<MDCComponentFoundation> {
  getDefaultFoundation(): MDCComponentFoundation {
    return new MDCComponentFoundation({
      addClass: (className: string) => this.root.classList.add(className),
      removeClass: (className: string) => this.root.classList.remove(className),
    });
  }
}
```
