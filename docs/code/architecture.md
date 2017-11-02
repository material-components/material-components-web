# Architecture

MDC Web is split into packages. Each package is either a Subsystem or a
Component. Subsystems apply to many components. They generally describe style
(e.g. color) or motion (e.g. animation). Component packages tend to rely on
many subsystem packages. But component packages rarely depend on other
component packages. Components require an HTML struture. Some components are
static, but most are dynamic and include some JavaScript.

> Each component is usable separate from any other component.

## Sass

All of MDC Web's CSS is generated using [Sass](http://sass-lang.com/). Sass
mixins lets us make groups of CSS declarations that we want to reuse on
multiple components. Subsystems provide a Sass mixin, which the component
imports in it's Sass file. Each package compiles it's Sass files into a single
CSS file.

## HTML

MDC Web does NOT provide any HTML templates. We simply provide documentation
with the required HTML structure.

## JavaScript

MDC Web has split each dynamic component's JavaScript into two pieces:
Foundation and Adapter. This lets us reuse Foundation code across multiple web
platforms, e.g. React and Angular, by re-implementing only the Adapter. For now
we've only implemented a vanilla JavaScript version of the Adapter.

### Foundation

The Foundation contains the business logic that best represents Material Design,
without actually referring to any HTML elements. This lets us isolate HTML logic
into the Adapter. Foundation has-a Adapter.

### Adapter

The Adapter is an interface with all the methods the Foundation needs to
implement Material Design business logic. There can be many implementations of
the Adapter!

### Vanilla Component

Instantiated with a root [element](https://developer.mozilla.org/en-US/docs/Web/API/Element),
it creates a Foundation with a Vanilla Adapter. Vanilla Adapter implements
Adapter and directly references the root element. It also has proxy methods for
any Foundation method a developer needs to access.
