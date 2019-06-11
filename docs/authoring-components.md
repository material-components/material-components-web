<!--docs:
title: "Authoring Components"
layout: landing
section: docs
path: /docs/authoring-components/
-->

# Authoring Components

This document serves as a reference for developing components either directly for MDC Web or
external components that would like to interface with the MDC Web ecosystem.

> Please note that since this project is still in its early stages of development, these practices
may be subject to change. They will stabilize as we near towards a full release.

- [Authoring Components](#authoring-components)
  - [Who this document is for](#who-this-document-is-for)
  - [How to build a component](#how-to-build-a-component)
    - [Start with a simple component prototype](#start-with-a-simple-component-prototype)
    - [Identify host environment interactions](#identify-host-environment-interactions)
    - [Create the adapter interface](#create-the-adapter-interface)
    - [Refactor your existing code into a foundation](#refactor-your-existing-code-into-a-foundation)
    - [Build a component on top of that foundation, providing an adapter](#build-a-component-on-top-of-that-foundation-providing-an-adapter)
  - [What makes a good component](#what-makes-a-good-component)
    - [Fully tested code](#fully-tested-code)
    - [Thoroughly documented and strictly versioned adapter interface](#thoroughly-documented-and-strictly-versioned-adapter-interface)
    - [Accessibility](#accessibility)
    - [RTL Awareness](#rtl-awareness)
    - [Support for theming](#support-for-theming)
  - [General Best Practices](#general-best-practices)
    - [Do what the user expects](#do-what-the-user-expects)
    - [Design adapter interfaces to be simple and intuitive](#design-adapter-interfaces-to-be-simple-and-intuitive)
    - [Do not reference host objects within foundation code](#do-not-reference-host-objects-within-foundation-code)
    - [Clean up all references on destruction](#clean-up-all-references-on-destruction)
  - [Authoring components for MDC Web](#authoring-components-for-mdc-web)
    - [File Structure](#file-structure)
    - [License Stanzas](#license-stanzas)
    - [Scss](#scss)
      - [Separate reusable variables and mixins from main scss](#separate-reusable-variables-and-mixins-from-main-scss)
      - [Follow the BEM Pattern](#follow-the-bem-pattern)
      - [Use mdc-theme for theming](#use-mdc-theme-for-theming)
      - [Use mdc-rtl for RTL support](#use-mdc-rtl-for-rtl-support)
    - [Javascript](#javascript)
      - [Define a static attachTo(root) method for every component](#define-a-static-attachtoroot-method-for-every-component)
      - [Define a defaultAdapter getter for every foundation](#define-a-defaultadapter-getter-for-every-foundation)
      - [Define all exported CSS classes, strings, and numbers as foundation constants.](#define-all-exported-css-classes-strings-and-numbers-as-foundation-constants)
      - [Extend components and foundations from mdc-base classes.](#extend-components-and-foundations-from-mdc-base-classes)
      - [Packages must be registered with our build infrastructure, and with material-components-web pkg](#packages-must-be-registered-with-our-build-infrastructure-and-with-material-components-web-pkg)
      - [TypeScript Compatibility](#typescript-compatibility)
    - [Testing](#testing)
      - [Verify foundation's adapters](#verify-foundations-adapters)
      - [Use helper methods](#use-helper-methods)
      - [Use bel for DOM fixture](#use-bel-for-dom-fixture)
      - [Always clean up the DOM after every test](#always-clean-up-the-dom-after-every-test)
      - [Verify adapters via testdouble.](#verify-adapters-via-testdouble)

## Who this document is for

The first two sections of this document describe general guidelines for how to think about building
a component, as well as criteria for what makes a good component. Anyone interested in building
components either directly for MDC Web or as an external component that plays well within the
MDC Web ecosystem should find it useful. The third section talks about authoring components
specifically for MDC Web, and is best suited for those looking to contribute directly to the
project.

Note that this document assumes you are familiar with the library and its
[architecture](code/architecture.md). If that is not the case, we recommend reading that first. If you
are brand new to the project, we recommend starting with our [Getting Started Guide](./getting-started.md).

## How to build a component

This section outlines the thought process behind authoring new components for MDC Web. It is
inspired by React's [Thinking in React](https://facebook.github.io/react/docs/thinking-in-react.html) article.

Starting out from nothing and going straight to a component/adapter/foundation implementation can be
at the best daunting, at worst completely impossible from a productivity and experimentation
standpoint. Often times, you'll want to _build a prototype component in the most straightforward way
possible, and then work your way back towards a foundation and adapter_. We usually take the
following steps.

To demonstrate this approach, we will build a **red-blue toggle**, very simple toggle button that
toggles between a red background with blue text, and vice versa. While not a Material Design
component, it demonstrates the concepts of how to think about building for MDC Web.

### Start with a simple component prototype

When first starting out on a component, start by building a prototype using vanilla
HTML/CSS/Javascript, without worrying about any foundations or adapters. Below is the prototype code
for our redblue-toggle, which you may also [view on codepen](http://codepen.io/traviskaufman/pen/jVxdNo).

> **TIP**: When prototyping your own components, you can use [this Codepen template](http://codepen.io/traviskaufman/pen/pNQmRp) as a starting
point.

Start out by experimenting with a DOM structure, and writing a simple prototype component to test
out the dynamic functionality.

```html
<div class="redblue-toggle" role="button" aria-pressed="false">
  Toggle <span class="redblue-toggle__color">Blue</span>
</div>
```

```ts
class RedblueTogglePrototype {
  get toggled() {
    return this.root.getAttribute('aria-pressed') === 'true';
  }

  set toggled(toggled) {
    this.toggle(toggled);
  }

  constructor(root) {
    this.root = root;
    this.clickHandler_ = () => this.toggle();
    this.initialize();
  }

  initialize() {
    this.root.addEventListener('click', this.clickHandler_);
  }

  destroy() {
    this.root.removeEventListener('click', this.clickHandler_);
  }

  toggle(isToggled = undefined) {
    const wasToggledExplicitlySet = isToggled === Boolean(isToggled);
    const toggled = wasToggledExplicitlySet ? isToggled : !this.toggled;
    const toggleColorEl = this.root.querySelector('.redblue-toggle__color');
    let toggleColor;

    this.root.setAttribute('aria-pressed', String(toggled));
    if (toggled) {
      toggleColor = 'Red';
      this.root.classList.add('redblue-toggle--toggled');
    } else {
      toggleColor = 'Blue';
      this.root.classList.remove('redblue-toggle--toggled');
    }
    toggleColorEl.textContent = toggleColor;
  }
}

new RedblueTogglePrototype(document.querySelector('.redblue-toggle'));
```

Note how the JS Component does not reference MDC Web in any way, nor does it have any notion
of foundations or adapters. By omitting this work, you can rapidly experiment with your component,
incorporating changes quickly and easily. Nonetheless, the way the component is prototype looks
quite similar to the way that the MDC Web component will eventually be built.

### Identify host environment interactions

Once you're satisfied with your prototype, the next step is to figure out what functionality will
need to be proxied through an adapter. Any direct interactions with the host
environment will need to be proxied, so that our foundations will be able to integrate into all
frameworks across the web platform.

> As mentioned in our architecture doc, the term **host environment** refers to the context in which
the component is used. It could be the browser, a server which the component is being rendered on,
a Virtual DOM environment, or even a mobile application in the case of technologies like
[React-Native](https://facebook.github.io/react-native/).

For the redblue-toggle, it's pretty easy to see all of the instances where we interact with the host
environment: it occurs every place we read from or write to our `root` node.

- Updating `aria-pressed` when toggled via `setAttribute`
- Updating the classes on the root node when toggled via `classList.{add,remove}`.
- Setting the `textContent` of the child color indicator element when toggled.
- Adding/removing event listeners on the root node within `initialize()`/`destroy()` respectively.

In other cases, host environment interaction may not be straightforward, such as
`window.addEventListener('resize', ...)`. These are also examples of host environment interaction
and must be taken into account.

### Create the adapter interface

Now that the host environment interactions are identified, an adapter interface can be carved out
within our existing component.

```ts
class RedblueTogglePrototype {
  get toggled() {
    return SOMEHOW_GET_ATTRIBUTE('aria-pressed') === 'true';
  }

  set toggled(toggled) {
    this.toggle(toggled);
  }

  constructor(root) {
    this.root = root;
    this.clickHandler_ = () => this.toggle();
    this.initialize();
  }

  initialize() {
    this.root.addEventListener('click', this.clickHandler_);
  }

  destroy() {
    this.root.removeEventListener('click', this.clickHandler_);
  }

  toggle(isToggled = undefined) {
    const wasToggledExplicitlySet = isToggled === Boolean(isToggled);
    const toggled = wasToggledExplicitlySet ? isToggled : !this.toggled;

    let toggleColor;

    SOMEHOW_SET_ATTRIBUTE('aria-pressed', String(toggled));
    if (toggled) {
      toggleColor = 'Red';
      SOMEHOW_ADD_CLASS('redblue-toggle--toggled');
    } else {
      toggleColor = 'Blue';
      SOMEHOW_REMOVE_CLASS('redblue-toggle--toggled');
    }
    SOMEHOW_UPDATE_TOGGLE_COLOR_TEXT_CONTENT(toggleColor);
  }
}
```

In the code above all of the host environment interactions have been replaced with fake `SOMEHOW_*`
methods. We can now take these fake methods and transform them into an adapter interface.

| Fake Method Signature | Adapter Method Signature |
| --- | --- |
| SOMEHOW_GET_ATTRIBUTE(attr: string) => string | getAttr(attr: string) => string |
| SOMEHOW_SET_ATTRIBUTE(attr: string, value: string) | setAttr(attr: string, value: string) |
| SOMEHOW_ADD_CLASS(className: string) | addClass(className: string) |
| SOMEHOW_REMOVE_CLASS(className: string) | removeClass(className: string) |
| SOMEHOW_UPDATE_TOGGLE_COLOR_TEXT_CONTENT(textContent: string) | setToggleColorTextContent(textContent: string) |

> Note: We no longer recommend using `registerInteractionHandler` and
`deregisterInteractionHandler` as adapter methods for adding/removing generic event listeners. Event handling varies significantly across frameworks
(e.g., [React Synthetic Events](https://reactjs.org/docs/events.html)),
so we recommend managing events in the component layer.

### Refactor your existing code into a foundation

Now that our adapter API is defined, our existing code can be reworked into a foundation class.
As a convention in our codebase, we define a static `defaultAdapter` getter that returns
an adapter with NOP signatures for each function. This helps us verify the shape of the adapter,
prevent adapters from throwing errors when methods are forgotten, and in the future can (and should)
be used to build out lint tools to enforce proper adapter shape. This example shows that, as well
as making use of our `MDCFoundation` class, which is the base class which all foundations inherit
from.

```ts
class RedblueToggleFoundation extends MDCFoundation {
  static get defaultAdapter() {
    return {
      getAttr: (attr: string) => '',
      setAttr: (attr: string, value: string) => undefined,
      addClass: (className: string) => undefined,
      removeClass: (className: string) => undefined,
      setToggleColorTextContent: (textContent: string) => undefined,
      registerInteractionHandler: (type: string, handler: EventListener) => undefined,
      deregisterInteractionHandler: (type: string, handler: EventListener) => undefined,
    };
  }

  private toggled_ = false;

  constructor(adapter) {
    super({...RedblueToggleFoundation.defaultAdapter, ...adapter});
  }

  handleClick() {
    this.toggle_();
  }

  isToggled() {
    return this.adapter_.getAttr('aria-pressed') === 'true';
  }

  private toggle_(isToggled = undefined) {
    const wasToggledExplicitlySet = isToggled === Boolean(isToggled);
    this.toggled_ = wasToggledExplicitlySet ? isToggled : !this.toggled_;

    let toggleColor;

    this.adapter_.setAttr('aria-pressed', String(this.toggled_));
    if (this.toggled_) {
      toggleColor = 'Red';
      this.adapter_.addClass('redblue-toggle--toggled');
    } else {
      toggleColor = 'Blue';
      this.adapter_.removeClass('redblue-toggle--toggled');
    }
    this.adapter_.setToggleColorTextContent(toggleColor);
  }
}
```

Note how `isToggled()` and `toggle()` are used in place of setters and getters. Given that a
foundation is a lower-level API, we feel that this convention is appropriate.

### Build a component on top of that foundation, providing an adapter

The last step is simply to build your actual component using the foundation above. The component has
two main jobs:

* Provide an idiomatic interface to the foundation's functionality within the host environment
* Provide an adapter to the foundation that will allow it to work within the host environment

Since this component is a vanilla component, it should be modeled after the vanilla DOM API, which
favors getters and setters to implement its functionality (think `checked`, `disabled`, etc.). Our
adapter is extremely straightforward as we can simply repurpose the methods we started out with.

```ts
class RedblueToggle extends MDCComponent {
  initialize() {
    this.listen('click', this.foundation_.handleClick);
  }

  destroy() {
    this.unlisten('click', this.foundation_.handleClick);
  }

  get toggled() {
    return this.foundation_.isToggled();
  }

  set toggled(toggled) {
    this.foundation_.toggle(toggled);
  }

  getDefaultFoundation() {
    return new RedblueToggleFoundation({
      getAttr: attr => this.root_.getAttribute(attr),
      setAttr: (attr, value) => this.root_.setAttribute(attr, value),
      addClass: className => this.root_.classList.add(className),
      removeClass: className => this.root_.classList.remove(className),
      setToggleColorTextContent: textContent => {
        this.root_.querySelector('.redblue-toggle__color').textContent = textContent;
      },
    });
  }
}
```

You can view a [finished example on CodePen](http://codepen.io/traviskaufman/pen/gLExme?editors=0010).

## What makes a good component

These additional guidelines provide a "checklist" of sorts when building your own components. We
strictly adhere to them within our codebase, and doing the same will ensure an enjoyable experience
for your component's consumers.

### Fully tested code

ECMAScript, by design, is a dynamic and flexible language. The benefits of this dynamicism and
flexibility come at the cost of verifying the correctness of your program. The only way to ensure
that your code will behave as expected is to execute that code and verify that the results are those
you expect. Strive for 100% test coverage for your foundations, adapters, and components.

### Thoroughly documented and strictly versioned adapter interface

Since framework authors will be designing code around your adapter interface, it's important that
you provide all information necessary for them to do so. Our recommended approach is to document
the adapter's interface within a component's README, providing both the method signature as well
as the expected behavior of the method.

Equally important is to _strictly version your adapter interfaces_. Changes to your adapter
interface - even associative ones - have the potential to break existing implementations or
trick implementors into thinking their code is working as expected whereas they may be missing a
key aspect of the component due to having failed to implement a new adapter method. We consider
_each change to an adapter interface a breaking change_, and recommend this approach.

### Accessibility

We require all of our core components to be fully accessible. We implement [ARIA specifications](https://www.w3.org/WAI/intro/aria)
where it makes sense to do so, and ensure that we are being semantic as possible when it comes to
our components' behavior. The [accessibility developer tools](https://chrome.google.com/webstore/detail/accessibility-developer-t/fpkknkljclfencbdbgkenhalefipecmb?hl=en) are a great way to analyze how
accessible your component is.

### RTL Awareness

Components should be RTL-aware. That is, there should be some sort of strategy a component uses to
detect whether or not it is in an RTL context, and make proper adjustments accordingly. We use
our [@material/rtl](../packages/mdc-rtl) library to assist us with this.

### Support for theming

A component should be able to be altered according to a **theme**. A theme can be defined any way
you wish. It may be by using _primary_ and _secondary_ colors, or you may choose to expose scss
variables or CSS Custom properties specific to your component. Whichever way you choose, ensure that
_clients can easily alter common aesthetic elements of your component to make it fit with their
overall design_. We use [@material/theme](../packages/mdc-theme) for this purpose.

## General Best Practices

Even when a component satisfies all of the above requirements, it may still run into pitfalls.
Follow the recommendations below to avoid pitfalls and unintended situations as much as possible.

> Just like with any set of best practices, it is important to keep in mind that these are
_guidelines_, not hard and fast rules. [If a best practice prevents you from improving or maintaining your component, ignore it](https://en.wikipedia.org/wiki/Wikipedia:Ignore_all_rules).
However, justify your slight, preferably in the form of documentation or a code comment.

### Do what the user expects

This is our "golden rule", if you will. _Design your component APIs to be intuitive and
easy-to-understand. Ensure that your components behave in a way a user could predict_. For
example, the `checked` getter on `MDCCheckbox` returns a boolean indicating whether or not the
internal state of the checkbox is checked. It does not produce side effects, and functions in
exactly the sameway `HTMLInputElement.prototype.checked` functions when its `type` is set to
`"checkbox"`. When designing your components, model them after the environment you expect your users
to use them in. In our case, our vanilla components are modeled after the DOM APIs.

### Design adapter interfaces to be simple and intuitive

This follows the above practice of doing what the user expects. Since library consumers will be
implementing the adapter methods, they should be simple to implement as well as straightforward and
intuitive in nature. Most adapter methods should be one-liners, such as "add a class" or "update a
style property." Users should not have to guess about what the purpose of an adapter method is, nor
what its expected input and output should be.

For example, a good adapter interface method might be

| Method Signature | Description |
| --- | --- |
| `setStyle(styleProperty: string, value: string) => void` | Sets a style on the root element given a dasherized `styleProperty` as well as a `value` for that property. |

As opposed to a bad adapter interface like the one below

| Method Signature | Description |
| --- | --- |
| `applyComponentStyles() => void` | Sets the correct styles on the component's root element. Consult our documentation for more info. |

The above adapter interface is more suited for a foundation method. The adapter's sole
responsibility should be performing the style updates, not determining what they are.

### Do not reference host objects within foundation code

To ensure your foundation is as compatible with as many frameworks as possible, avoid directly
referencing host objects within them. This includes `window`, `document`, `console`, and others.
_Only reference global objects defined within the ECMAScript specification within your foundations._

We make an exception for this rule for `requestAnimationFrame`, but in the future we may refactor
that out as well. In addition, a workaround to working with host objects in a foundation is to ask
for them via the adapter.

### Clean up all references on destruction

This includes event handlers, timer IDs, animation frame IDs, and any other external references that
may be retained. There are two accurate litmus tests to ensure this is being done:

1. `init()` (or `initialize()` in a vanilla component) and `destroy()` are reflexive. For example,
   any event listeners attached in `init()` are removed in `destroy()`.
2. Every call which creates an external reference (e.g. `setTimeout()`, `requestAnimationFrame()`)
   is kept track of, and cleaned up within destroy. For example, every `setTimeout()` call should have its ID retained by the foundation/component, and have `clearTimeout()` called on it within
   destroy.

## Authoring components for MDC Web

The following guidelines are for those who wish to contribute directly to MDC Web. In addition to
adhering to all of the practices above, we have additional conventions we expect contributors to
adhere to. It's worth noting that most of these conventions - including our coding style, commit
message format, and test coverage - are _automatically enforced via linters_, both so that
contributors can move quickly and confidently, and core team members do not have to waste time and
energy nitpicking on pull requests.

### File Structure

All source files for a component reside under `packages/`. All test files reside under `test/unit`,
which mirrors the `packages/` directory. Screenshot tests for packages reside under `test/screenshot/spec`.

A typical component within our codebase looks like so:

```
packages
  ├── mdc-component
      ├── README.md # Usage instructions and API documentation
      ├── adapter.ts # Adapter interface implemented by framework wrappers and the vanilla component
      ├── foundation.ts # Framework-agnostic business logic used by wrapper libraries and the vanilla component
      ├── component.ts # Vanilla component and adapter implementations for clients who aren't using a framework
      ├── constants.ts # Constant values used by one or more files in the package (e.g., cssClasses, strings, numbers)
      ├── index.ts # Forwards exports from other files in the package (adapter, foundation, component, util, etc.)
      ├── types.ts # (optional) Contains types and interfaces exposed in public APIs unrelated to the vanilla component
      ├── util.ts # (optional) Framework-agnostic helper functions (e.g., feature detection)
      ├── mdc-component.scss # The main source file for the component's CSS
      └── package.json # The components package file
test/unit
  ├── mdc-component
      ├── foundation.test.js # Unit tests for the component's foundation
      ├── mdc-component.test.js # Unit tests for the component's
test/screenshot
  ├── spec
      ├── mdc-component
          ├── classes
              ├── baseline.html # component usage in the happy path case. Other variants would go under ./classes.
          ├── mixins
              ├── ink-color.html # component using a sass mixin for customization.
```

**Every component _must_ have these files before we will accept a PR for them.**

When contributing a new component, we encourage you to look at existing components to get a better
sense of our conventions. Your new component should "blend in" with all existing components.

Additionally, all new components require the following within their `package.json`:

```
"publishConfig": {
  "access": "public"
}
```

This is needed so that lerna will be able to automatically publish new scoped packages.

We also require a list of keywords for each package. This list should always include `material components` and `material design`, followed by the component name:

```
"keywords": [
  "material components",
  "material design",
  <COMPONENT_NAME>
]
```

For example, if you are building a checkbox component, `keywords` would include `material components`, `material design`, and `checkbox`

**Below is an example of what a full `package.json` should look like for a new component:**

```json
{
  "name": "@material/example",
  "version": "0.0.0",
  "description": "The Material Components for the web example component",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/material-components/material-components-web.git"
  },
  "keywords": [
    "material components",
    "material design",
    "example"
  ],
  "publishConfig": {
    "access": "public"
  }
}
```

### License Stanzas

We are required to put the following at the _top_ of _every source code file_, including tests,
demos, and demo html. The stanza is as follows:

```
Copyright <YEAR> Google Inc.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
```

Please put this in a comment at the top of every source file, replacing <YEAR> with the year the file was created.

### Scss

#### Separate reusable variables and mixins from main scss

If variables and mixins are intended to be used outside of a single stylesheet, refactor them out
into [sass partials](http://sass-lang.com/guide#topic-4). These files can then be included in other
stylesheets without having extra CSS omitted both times. As a rule of thumb, _never_ `@import` sass
files which output CSS, as it will most likely be duplicate output.

#### Follow the BEM Pattern

We follow a modified version of the [BEM](http://getbem.com/) pattern, which is defined within our
[stylelint rules](../.stylelintrc.yaml#L252-L255). It's basically:

```scss
.mdc-block {

}

.mdc-block__element {

}

.mdc-block--modifier {

}
```

Usually, we structure it within our code as such:

```scss
.mdc-block {
  // ...

  &__element {
    // ...
  }
}

.mdc-block--modifier {
  // ...

  .mdc-block__element {
    // ...
  }
}
```

Sometimes, you'll need to qualify selectors, which such as `.some-context .mdc-block {/* ... */}`.
Stylelint will complain about this, which you can disable by inserting the following:

```scss
// stylelint-disable plugin/selector-bem-pattern

// styles select-bem-pattern complains about...

// stylelint-enable plugin/selector-bem-pattern
```

#### Use mdc-theme for theming
All thematic elements of a component should be specified via [mdc-theme](../packages/mdc-theme).
This will ensure that the component integrates harmoniously into our theming system.

#### Use mdc-rtl for RTL support
All RTL treatments within a component's style should be specified via [mdc-rtl](../packages/mdc-rtl).
This will ensure that all components treat RTL contexts the same way, and will behave consistently.

### Javascript

#### Define a static attachTo(root) method for every component

All components _must_ define a static `attachTo` method with the following signature:

`static attachTo(element: HTMLElement) => Constructor`

e.g.

```js
class MDCNewComponent extends MDCComponent {
  static attachTo(root) {
    return new MDCNewComponent(root);
  }
}
```

`mdc-auto-init` requires this method to be present, and we guarantee its provision as a convenience
to our users. We have spoken about writing a lint rule for this in the future.

#### Define a defaultAdapter getter for every foundation
All foundations _must_ define a static `defaultAdapter` method which returns an adapter with all
functions defined. The functions should essentially be NOPs; taking no parameters and returning the
correct type (e.g. `false` for boolean, `0` for number, `{}` for object, etc.). Our convention is
to annotate the function via inline comments using [Typescript's type annotations](https://basarat.gitbooks.io/typescript/content/docs/types/type-system.html).

It is also a convention to override a foundation's constructor to mix in the passed `adapter` param
to a default adapter object. This ensures that the adapter is guaranteed to have the correct shape.

```js
class MDCNewComponentFoundation extends MDCFoundation {
  static get defaultAdapter() {
    return {
      addClass: (/* className: string */) => {},
      getAttr: (/* attr: string */) => /* string */ '',
      // ...
    }
  }

  constructor(adapter) {
    super(...MDCNewComponentFoundation.defaultAdapter, ...adapter});
  }
}
```

This of course comes at the cost of potentially obscuring erroneous passed in adapters. However,
we plan on providing type definitions for adapters in the future to help assuage this. Similar to
the aforementioned rule, we would also like to provide lint rules to enforce these conventions.

#### Define all exported CSS classes, strings, and numbers as foundation constants.
- All CSS Classes referenced by a component's foundation must be referenced by a `cssClasses` static
  getter.
- All strings that are used outside the context of the foundation class (CSS selectors, custom event names,
  text that could potentially be localized, etc.) must be referenced by a `strings` static getter.
- All semantic numbers leveraged by the foundation (timeout lengths, transition durations, etc.) must
  be referenced by a `numbers` static getter.
- These constants should be defined within a `constants.ts` file, and then proxied through the
  foundation.

```ts
// constants.ts

export const cssClasses = {
  ROOT: 'mdc-new-component',
  ACTIVE: 'mdc-new-component--active',
  DISABLED: 'mdc-new-component--disabled',
};

export const strings = {
  CHILD_SELECTOR: '.mdc-new-component__child',
  CUSTOM_EVENT: 'MDCNewComponent:event',
};

export const numbers = {
  DEFAULT_THROTTLE_DELAY_MS: 300,
};

// foundation.ts

import {cssClasses, strings, numbers} from './constants';

class MDCNewComponentFoundation extends MDCFoundation {
  static get defaultAdapter() {
    // ...
  }

  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get numbers() {
    return numbers;
  }
}
```

The primary purpose of this is so that our components can interoperate with aspects of Google's
front-end infrastructure, such as Closure Stylesheets' [CSS Class Renaming](https://github.com/google/closure-stylesheets#renaming) mechanism. In addition, it
provides the added benefit of semantic code, and less magic strings/numbers.

#### Extend components and foundations from mdc-base classes.
To ensure that all packages behave consistently, all components must extend `MDCComponent` and all
foundations must extend `MDCFoundation`. More information for both of these classes can be found in
the [mdc-base README](../packages/mdc-base).

#### Packages must be registered with our build infrastructure, and with material-components-web pkg
Whenever you create a new component, it's important to notify the proper tools and packages of it.
Concretely:

- Ensure that an entry for it exists in `webpack.config.js` for the `js-components` and `css` module
- Ensure that it is added as a dependency of `material-components-web`. If the component contains
  styles, ensure that they are `@import`ed within `material-components-web.scss`. If the component
  contains javascript, ensure that its component namespace is exported within
  `material-components-web`, and it is registered with `mdc-auto-init`. Lastly, remember to add it
  to `package.json` of `material-components-web`.
- Ensure that the correct **commit subject** for the package is added to the
  `config.validate-commit-msg.scope.allowed` array within the top-level `package.json` at the root
  of the repo. The commit subject is the _name the component, without the `mdc-`/`@material/`_.
  E.g., for `mdc-icon-button`, the correct subject is `icon-button`.

#### TypeScript Compatibility

All core MDC Web components must be fully compatible with strict-mode [TypeScript](https://www.typescriptlang.org/). We've provided a list of requirements and further explanation of meeting the TypeScript compatibility, as well as
conventions, examples, and common TypeScript patterns you may not be used to, in our [Coding Best Practices](./code/best_practices.md).

### Testing

The following guidelines should be used to help write tests for MDC Web code. Our tests are written
using [mocha](https://mochajs.org/) with the [qunit UI](https://mochajs.org/#qunit), and are driven by [karma](https://karma-runner.github.io/1.0/index.html). We use the [chai assert API](http://chaijs.com/api/assert/)
for assertions, and [testdouble](https://github.com/testdouble/testdouble.js/) for mocking and stubbing.

#### Verify foundation's adapters
When testing foundations, ensure that at least one of your test cases uses the
`verifyDefaultAdapter` method defined with our [foundation helpers](../test/unit/helpers/foundation.js). This is done to ensure that adapter interfaces do not
change unexpectedly.

#### Use helper methods
We have helper modules within [test/unit/helpers](../test/unit/helpers) for things like
bootstrapping foundation tests, intercepting adapter methods used for listening to events, and
dealing with `requestAnimationFrame`. We encourage you to make use of them in your code to make it
as easy as possible to write tests!

#### Use bel for DOM fixture
We use the [bel](https://www.npmjs.com/package/bel) library to generate fixtures for our component/adapter tests. We've found it to
be an easy and successful way to bootstrap fixtures without having to worry about maintaining HTML
files or write unwieldy DOM API code.

#### Always clean up the DOM after every test
This is important. _Before a test ends, ensure that any elements attached to the DOM have been
removed_.

#### Verify adapters via testdouble.
We use [testdouble.js](https://github.com/testdouble/testdouble.js) as our de-facto mocking
framework. A huge benefit to the component/foundation/adapter pattern is it makes testing the
functionality of our components extremely easy. We encourage you to make use of testdouble stubs for
adapters and use them to verify your foundation's behavior (note that this is what [our foundation setup code](../test/unit/helpers/setup.js#L21) does by default).
