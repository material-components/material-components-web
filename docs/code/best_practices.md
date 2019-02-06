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
private progress_!: number; // Assigned in init

init() {
  this.progress_ = 0;
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
