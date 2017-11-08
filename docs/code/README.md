# Code

## Foundation / Adapter

MDC Web has split each dynamic component's JavaScript into two pieces:
Foundation and Adapter. This lets us reuse Foundation code across multiple web
platforms, e.g. React and Angular, by re-implementing only the Adapter. For now
we've only implemented a vanilla JavaScript version of the Adapter

## Architecture

MDC Web is split into packages. Each package is either a Subsystem or a
Component. Subsystems apply to many components. They generally describe style
(e.g.: color) or motion (e.g.: animation). Component packages tend to rely on
many subsystem packages. But component packages rarely depend on other
component packages. Components require an HTML struture. Some components are
static, but most are dynamic and include some JavaScript.

> Each component is usable seperate from any other component.

## Best Practices

MDC Web follows naming and documentation best practices to keep our code
consistent, and our APIs user friendly. We follow isolation best practices to
keep our code loosely coupled. And we follow performace best practices to keep
our components fast.

## README standards

MDC Web component documentation serves two purposes:

* Populate the [Catalog Site](https://material.io/components/web/catalog/)
* Highlight [how to use our APIs](readme_standards.md), for our external developers

> Developers should not have to read our code to know how to use our APIs

