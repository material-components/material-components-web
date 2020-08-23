<!--docs:
title: "Integrating MDC Web into Frameworks"
navTitle: "Framework Integration"
layout: landing
section: docs
path: /docs/framework-integration/
-->

# Integrating MDC Web into Frameworks

MDC Web was designed to be integrated as easily as possible into any and all web frameworks. This
document will walk you through strategies for integrating components into various types of
frameworks.

## Examples

We maintain a list of component libraries, which wrap MDC Web for other frameworks, in our main [README](../README.md) (under the [MDC Web on other frameworks](./framework-wrappers.md) document). Each library must:
- Serve components in an à-la-carte delivery model
- Have existed for longer than 6 weeks and show continued maintenance over time
- Provide usage documentation per component

## Approaches

There are two approaches you can take for integrating our components into frameworks: the **simple**
approach and the **advanced** approach. Both have their benefits and drawbacks, and are explained
below.

### The Simple Approach: Wrapping MDC Web vanilla components.

The easiest way to integrate MDC Web into frameworks is to use our vanilla components directly. This
works well for frameworks which assume they will be executed within the context of a browser, such
as [angular v1](https://angularjs.org), [backbone.js](http://backbonejs.org/), or even things such as [jQuery plugins](https://learn.jquery.com/plugins/basic-plugin-creation/).

The simple approach can be outlined as follows:

1. Include the Component's CSS on the page any way you wish
2. Create a **wrapper component** for your framework of choice, and add a property which will be
   set to the value of the MDC Web Component. We'll call this `mdcComponent`.
3. When the wrapper component is **initialized** (e.g. it is instantiated and attached to the DOM),
   _instantiate the MDC Web component with a root element, and assign it to the `mdcComponent`
   property_.
4. When the wrapper component is **destroyed** (e.g. it is unbound and detached from the DOM), call
   `mdcComponent.destroy()` to clean up the MDC Web component.

This general approach will work for almost all basic use-cases. For an example of this approach,
check out [this plunk](https://plnkr.co/edit/qZl2frDGBT6Ro7jEMbjP?p=preview) which
shows how to wrap our text field within an angular v1 component, as well as our button (with a
ripple) within an attribute directive.

Note that this approach will also work for [custom elements](https://developers.google.com/web/fundamentals/getting-started/primers/customelements). Use `connectedCallback` for initialization
and `disconnectedCallback` for destruction.

### The Advanced Approach: Using foundations and adapters

Many modern front-end libraries/frameworks, such as react and angular, wind up targeting more than
just a web browser. For these frameworks - and for some highly advanced application architectures -
a more robust approach is required. We provide foundations and adapters to accommodate this use
case.

> If you are interested in wrapping our components using foundations/adapters, you should first read
> through our [architecture overview](code/architecture.md) in order to familiarize yourself with the
> general concepts behind them.

Every component comes with a complementary foundation class, which is usually called
`MDCComponentFoundation`, where `MDCComponent` is the name of a component. For example, we have an
[MDCMenuFoundation](../packages/mdc-menu/foundation.ts) that is used by our
[MDCMenu](../packages/mdc-menu/index.ts) component, and which are both exported
publicly.

In order to implement a component via a foundation, take the following steps:

1. Include the component's CSS on the page any way you wish
2. Add an instance property to your component which will be set to the proper foundation class.
   We'll call this `mdcFoundation`.
3. Instantiate a foundation class, passing it a properly configured adapter as an argument
4. When your component is initialized, call `mdcFoundation.init()`
5. When your component is destroyed, call `mdcFoundation.destroy()`

Because of the nature of our components, some of the adapter APIs can be quite complex. However, we
are working as hard as we can to make writing adapters as easy and predictable as possible:

- Adapters are strictly versioned: _any_ change to an adapter interface - associative or not - is
  considered breaking and will cause a major version update of the component.
- Every adapter interface is thoroughly documented within each component's README
- Most adapter methods are one-liners, and for those that aren't, we provide `util` objects which
  implement those methods.
- We try and provide guidance on different ways to implement certain adapter methods that may seem
  ambiguous
- We plan on creating Type Definitions for our adapters in the future so that TypeScript users can
  validate that their interface conforms correctly to the adapter's specification.

> Please [file an issue](https://github.com/material-components/material-components-web/issues/new/choose) with us if there are certain snags you've ran into trying to implement an
  adapter, or if you feel that we can provide better guidance on a particular problem. This is
  definitely something we want to know about.
