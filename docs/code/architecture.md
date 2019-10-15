# Architecture

MDC Web is split into packages. Each package is either a Subsystem or a
Component. Subsystems apply to many components. They generally describe style
(e.g.: color) or motion (e.g.: animation). Component packages tend to rely on
many subsystem packages. On the other hand, component packages rarely depend on
other component packages. Components require an HTML structure. Some components
are static, but most are dynamic and include some JavaScript.

> Each component is usable separate from any other component.

## Sass

All of MDC Web's CSS is generated using [Sass](http://sass-lang.com/). Sass
mixins let us make groups of CSS declarations that we want to reuse on
multiple components. Subsystems provide a Sass mixin, which the component
imports in its Sass file. Each package compiles its Sass files into a single CSS
file.

## HTML

MDC Web does NOT provide any HTML templates. We simply provide documentation
with the required HTML structure.

## JavaScript

MDC Web has split each dynamic component's JavaScript into two pieces:
Foundation and Adapter. This lets us reuse Foundation code across multiple web
platforms, e.g. React and Angular, by re-implementing only the Adapter. For now
we've only implemented a vanilla JavaScript version of the Adapter.

### TypeScript

MDC Web components are written in [TypeScript](https://www.typescriptlang.org/)
to increase developer velocity and reduce errors. Our npm releases include
UMD JavaScript bundles, ES Modules containing ES5, and `.d.ts` typing
declaration files for TypeScript users.
See [Importing JS](../importing-js.md) for more information.

### Foundation

The Foundation contains the business logic that best represents Material Design,
without actually referring to any DOM elements. The Foundation delegates to Adapter
methods for any logic requiring DOM manipulation.

### Adapter

The Adapter is an interface with all the methods the Foundation needs to
implement Material Design business logic. There can be many implementations of
the Adapter, allowing for interoperability with different frameworks.

### Vanilla Component

Instantiated with a root [element](https://developer.mozilla.org/en-US/docs/Web/API/Element),
the Vanilla Component creates a Foundation instance with a Vanilla Adapter by
overriding the `getDefaultFoundation` method of `MDCComponent`. The Vanilla Adapter
implements the Adapter APIs and directly references the root element. The Vanilla
Component also exposes proxy methods for any Foundation methods a developer needs to access.

Developers who are simply interested in consuming MDC Web (i.e. not providing a
wrapper library) should only need to interact with the Component. They should not
need to directly access Foundation or Adapter APIs.
