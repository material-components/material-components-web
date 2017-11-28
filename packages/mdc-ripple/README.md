<!--docs:
title: "Ripples"
layout: detail
section: components
excerpt: "Ink ripple touch feedback effect."
iconId: ripple
path: /catalog/ripples/
-->

# Ripples

MDC Ripple provides the JavaScript and CSS required to provide components (or any element at all) with a material "ink ripple" interaction effect. It is designed to be efficient, uninvasive, and usable without adding any extra DOM to your elements.

MDC Ripple also works without JavaScript, where it gracefully degrades to a simpler CSS-Only implementation.

## Table of Contents

- [An aside regarding browser support](#an-aside-regarding-browser-support)
- [Installation](#installation)
- [Usage](#usage)
  - [Adding Ripple styles](#adding-ripple-styles)
  - [Adding Ripple JS](#adding-ripple-js)
  - [Ripple JS API](#ripple-js-api)
  - [Unbounded Ripples](#unbounded-ripples)
  - [The mdc-ripple-surface class](#the-mdc-ripple-surface-class)
  - [Using the foundation](#using-the-foundation)
  - [Using the vanilla DOM adapter](#using-the-vanilla-dom-adapter)
- [Tips/Tricks](#tipstricks)
  - [Integrating ripples into MDC-Web components](#integrating-ripples-into-mdc-web-components)
  - [Using a sentinel element for a ripple](#using-a-sentinel-element-for-a-ripple)
  - [Keyboard interaction for custom UI components](#keyboard-interaction-for-custom-ui-components)
  - [Specifying known element dimensions](#specifying-known-element-dimensions)
- [Caveat: Edge](#caveat-edge)
- [Caveat: Safari 9](#caveat-safari)
- [Caveat: Mobile Safari](#caveat-mobile-safari)
- [Caveat: Theme Custom Variables](#caveat-theme-custom-variables)
- [The util API](#the-util-api)

### An aside regarding browser support

In order to function correctly, MDC Ripple requires a _browser_ implementation of [CSS Variables](https://www.w3.org/TR/css-variables/). MDC Ripple uses custom properties to dynamically position pseudo elements, which allows us to not need any extra DOM for this effect.

Because we rely on scoped, dynamic CSS variables, static pre-processors such as [postcss-custom-properties](https://github.com/postcss/postcss-custom-properties) will not work as an adequate polyfill ([...yet?](https://github.com/postcss/postcss-custom-properties/issues/32)).

Edge and Safari 9, although they do [support CSS variables](http://caniuse.com/#feat=css-variables), do not support MDC Ripple. See the respective caveats for [Edge](#caveat-edge) and [Safari 9](#caveat-safari) for an explanation.

## Installation

```
npm install --save @material/ripple
```

## Usage

### Adding Ripple styles

General notes:

* Ripple mixins can be applied to a variety of elements representing interactive surfaces. These mixins are also used by other MDC Web components such as Button, FAB, Checkbox, Radio, etc.
* Surfaces for bounded ripples should have `overflow` set to `hidden`, while surfaces for unbounded ripples should have it set to `visible`
* When a ripple is successfully initialized on an element using JS, it dynamically adds a `mdc-ripple-upgraded` class to that element. If ripple JS is not initialized but Sass mixins are included on the surface, the ripple will still work, but it uses a simpler, CSS-only implementation which relies on `:hover`, `:focus`, and `:active`.

#### Sass API

These APIs implicitly use pseudo-elements for the ripple effect: `::before` for the background, and `::after` for the foreground.
All three of the following mixins are mandatory in order to fully style the ripple effect; from that point, it is feasible to further override only the parts necessary (e.g. `mdc-ripple-color` specifically) for variants of a component.

Mixin | Description
--- | ---
`mdc-ripple-surface` | Adds base styles for a ripple surface
`mdc-ripple-color($color, $opacity)` | Adds styles for the color and opacity of the ripple effect
`mdc-ripple-radius($radius)` | Adds styles for the radius of the ripple effect,<br>for both bounded and unbounded ripples

### Adding Ripple JS

First import the ripple JS.

#### ES2015

```javascript
import {MDCRipple, MDCRippleFoundation, util} from '@material/ripple';
```

##### CommonJS

```javascript
const {MDCRipple, MDCRippleFoundation, util} = require('@material/ripple');
```

#### AMD

```javascript
require('path/to/@material/ripple', function(mdcRipple) {
  const MDCRipple = mdcRipple.MDCRipple;
  const MDCRippleFoundation = mdcRipple.MDCRippleFoundation;
  const util = mdcRipple.util;
});
```

#### Global

```javascript
const MDCRipple = mdc.ripple.MDCRipple;
const MDCRippleFoundation = mdc.ripple.MDCRippleFoundation;
const util = mdc.ripple.util;
```

Then, simply initialize the ripple with the correct DOM element.

```javascript
const surface = document.querySelector('.surface');
const ripple = new MDCRipple(surface);
```

You can also use `attachTo()` as an alias if you don't care about retaining a reference to the
ripple.

```javascript
MDCRipple.attachTo(document.querySelector('.surface'));
```

### Ripple JS API

The component allows for programmatic activation / deactivation of the ripple, for interdependent interaction between
components. This is used for making form field labels trigger the ripples in their corresponding input elements, for
example.

#### MDCRipple.activate()

Triggers an activation of the ripple (the first stage, which happens when the ripple surface is engaged via interaction,
such as a `mousedown` or a `pointerdown` event). It expands from the center.

#### MDCRipple.deactivate()

Triggers a deactivation of the ripple (the second stage, which happens when the ripple surface is engaged via
interaction, such as a `mouseup` or a `pointerup` event). It expands from the center.

#### MDCRipple.layout()

Recomputes all dimensions and positions for the ripple element. Useful if a ripple surface's
position or dimension is changed programmatically.

### Unbounded Ripples

If you'd like to use _unbounded_ ripples, such as those used for checkboxes and radio buttons, you
can do so either imperatively in JS _or_ declaratively using the DOM.

#### Using JS

You can set an `unbounded` property to specify whether or not the ripple is unbounded.

```javascript
const ripple = new MDCRipple(root);
ripple.unbounded = true;
```

If directly using our foundation, you must provide this information directly anyway, so simply have
`isUnbounded` return `true`.

```javascript
const foundation = new MDCRippleFoundation({
  isUnbounded: () => true,
  // ...
});
```

#### Using DOM (Component Only)

If you are using our vanilla component for the ripple (not our foundation class), you can add a
data attribute to your root element indicating that you wish the ripple to be unbounded:

```html
<div class="surface" data-mdc-ripple-is-unbounded>
  <p>A surface</p>
</div>
```

### The mdc-ripple-surface class

mdc-ripple contains CSS which exports an `mdc-ripple-surface` class that can turn any element into
a ripple:

```html
<style>
.my-surface {
  width: 200px;
  height: 200px;
  background: grey; /* Google Blue 500 :) */
  border-radius: 2px;
}
</style>
<!-- ... -->
<div class="mdc-ripple-surface my-surface" tabindex="0">Ripples FTW!</div>
```

There are also modifier classes that can be used for styling ripple surfaces using the configured
theme's primary and secondary colors

```html
<div class="mdc-ripple-surface mdc-ripple-surface--primary my-surface" tabindex="0">
  Surface with a primary-colored ripple.
</div>
<div class="mdc-ripple-surface mdc-ripple-surface--accent my-surface" tabindex="0">
  Surface with a secondary-colored ripple.
</div>
```

Check out our demo (in the top-level `demos/` directory) to see these classes in action.

### Using the foundation

The MDCRippleFoundation can be used like any other foundation component. Usually, you'll want to use
it in your component _along_ with the foundation for the actual UI element you're trying to add a
ripple to. The adapter API is as follows:

| Method Signature | Description |
| --- | --- |
| `browserSupportsCssVars() => boolean` | Whether or not the given browser supports CSS Variables. When implementing this, please take the [Edge](#caveat-edge) and [Safari 9](#caveat-safari) considerations into account. We provide a `supportsCssVariables` function within the `util.js` which we recommend using, as it handles this for you. |
| `isUnbounded() => boolean` | Whether or not the ripple should be considered unbounded. |
| `isSurfaceActive() => boolean` | Whether or not the surface the ripple is acting upon is [active](https://www.w3.org/TR/css3-selectors/#useraction-pseudos). We use this to detect whether or not a keyboard event has activated the surface the ripple is on. This does not need to make use of `:active` (which is what we do); feel free to supply your own heuristics for it. |
| `isSurfaceDisabled() => boolean` | Whether or not the ripple is attached to a disabled component. If true, the ripple will not activate. |
| `addClass(className: string) => void` | Adds a class to the ripple surface |
| `removeClass(className: string) => void` | Removes a class from the ripple surface |
| `registerInteractionHandler(evtType: string, handler: EventListener) => void` | Registers an event handler that's invoked when the ripple is interacted with using type `evtType`. Essentially equivalent to `HTMLElement.prototype.addEventListener`. |
| `deregisterInteractionHandler(evtType: string, handler: EventListener) => void` | Unregisters an event handler that's invoked when the ripple is interacted with using type `evtType`. Essentially equivalent to `HTMLElement.prototype.removeEventListener`. |
| `registerResizeHandler(handler: Function) => void` | Registers a handler to be called when the surface (or its viewport) resizes. Our default implementation adds the handler as a listener to the window's `resize()` event. |
| `deregisterResizeHandler(handler: Function) => void` | Unregisters a handler to be called when the surface (or its viewport) resizes. Our default implementation removes the handler as a listener to the window's `resize()` event. |
| `updateCssVariable(varName: string, value: (string or null)) => void` | Programmatically sets the css variable `varName` on the surface to the value specified. |
| `computeBoundingRect() => ClientRect` | Returns the ClientRect for the surface. |
| `getWindowPageOffset() => {x: number, y: number}` | Returns the `page{X,Y}Offset` values for the window object as `x` and `y` properties of an object (respectively). |

### Using the vanilla DOM adapter

Because ripples are used so ubiquitously throughout our codebase, `MDCRipple` has a static
`createAdapter(instance)` method that can be used to instantiate an adapter object that can be used by
any `MDCComponent` that needs to instantiate an `MDCRippleFoundation` with custom functionality.

```js
class MyMDCComponent extends MDCComponent {
  constructor() {
    super(...arguments);
    this.ripple_ = new MDCRippleFoundation(Object.assign(MDCRipple.createAdapter(this), {
      isSurfaceActive: () => this.isActive_
    }));
    this.ripple_.init();
  }

  // ...
}
```

## Tips/Tricks

### Integrating ripples into MDC-Web components

Usually, you'll want to leverage `::before` and `::after` pseudo-elements when integrating the
ripple into MDC-Web components. Furthermore, when defining your component, you can instantiate the
ripple foundation at the top level, and share logic between those adapters.

### Using a sentinel element for a ripple

If you find you can't use pseudo-elements to style the ripple, another strategy could be to use a
sentinel element that goes inside your element and covers its surface. Doing this should get you
the same effect.

```html
<div class="my-component">
  <div class="mdc-ripple-surface"></div>
  <!-- your component DOM -->
</div>
```

### Keyboard interaction for custom UI components

Different keyboard events activate different elements. For example, the space key activate buttons, while the enter key activates links. Handling this by sniffing the key/keyCode of an event is brittle and error-prone, so instead we take the approach of using `adapter.isSurfaceActive()`. The
way in which our default vanilla DOM adapter determines this is by using
`element.matches(':active')`. However, this approach will _not_ work for custom components that
the browser does not apply this pseudo-class to.

If you want your component to work properly with keyboard events, you'll have to listen for both `keydown` and `keyup` and set some sort of state that the adapter can use to determine whether or
not the surface is "active", e.g.

```js
class MyComponent {
  constructor(el) {
    this.el = el;
    this.active = false;
    this.ripple_ = new MDCRippleFoundation({
      // ...
      isSurfaceActive: () => this.active
    });
    this.el.addEventListener('keydown', evt => {
      if (isSpace(evt)) {
        this.active = true;
      }
    });
    this.el.addEventListener('keyup', evt => {
      if (isSpace(evt)) {
        this.active = false;
      }
    });
  }
}
```

### Specifying known element dimensions

If you asynchronously load style resources, such as loading stylesheets dynamically via scripts
or loading fonts, then `adapter.getClientRect()` may by default return _incorrect_ dimensions when
the ripple foundation is initialized. For example, if you put a ripple on an element that uses an
icon font, and the size of the icon font isn't specified at initialization time, then if that icon
font hasn't loaded it may report the intrinsic width/height incorrectly. In order to prevent this,
you can override the default behavior of `getClientRect()` to return the correct results. For
example, if you know an icon font sizes its elements to `24px` width/height, you can do the
following:

```js
this.ripple_ = new MDCRippleFoundation({
  // ...
  computeBoundingRect: () => {
    const {left, top} = element.getBoundingClientRect();
    const dim = 24;
    return {
      left,
      top,
      width: dim,
      height: dim,
      right: left + dim,
      bottom: top + dim
    };
  }
});
```

## Caveat: Edge

> TL;DR ripples are disabled in Edge because of issues with its support of CSS variables in pseudo elements.

Edge introduced CSS variables in version 15. Unfortunately, there are
[known issues](https://developer.microsoft.com/en-us/microsoft-edge/platform/issues/11495448/)
involving its implementation for pseudo-elements which cause ripples to behave incorrectly.
We feature-detect Edge's buggy behavior as it pertains to `::before`, and do not initialize ripples if the bug is
observed. Earlier versions of Edge (and IE) are not affected, as they do not report support for CSS variables at all,
and as such ripples are never initialized.

<a name="caveat-safari"></a>
## Caveat: Safari 9

> TL;DR ripples are disabled in Safari 9 because of a nasty CSS variables bug.

The ripple works by updating CSS Variables which are used by pseudo-elements. This allows ripple
effects to work on elements without the need to add a bunch of extra DOM to them. Unfortunately, in
Safari 9.1, there is a nasty bug where updating a css variable on an element will _not_ trigger a
style recalculation on that element's pseudo-elements which make use of the css variable (try out
[this codepen](http://codepen.io/traviskaufman/pen/jARYOR) in Chrome, and then in Safari 9.1 to
see the issue). We feature-detect around this using alternative heuristics regarding different
webkit versions: Webkit builds which have this bug fixed (e.g. the builds used in Safari 10+)
support [CSS 4 Hex Notation](https://drafts.csswg.org/css-color/#hex-notation) while those do not
have the fix don't. We use this to reliably feature-detect whether we are working with a WebKit
build that can handle our usage of CSS variables.

## Caveat: Mobile Safari

> TL;DR for CSS-only ripple styles to work as intended, register a `touchstart` event handler on the affected element or its ancestor.

Mobile Safari does not trigger `:active` styles noticeably by default, as
[documented](https://developer.apple.com/library/content/documentation/AppleApplications/Reference/SafariWebContent/AdjustingtheTextSize/AdjustingtheTextSize.html#//apple_ref/doc/uid/TP40006510-SW5)
in the Safari Web Content Guide. This effectively suppresses the intended pressed state styles for CSS-only ripple surfaces. This behavior can be remedied by registering a `touchstart` event handler on the element, or on any common ancestor of the desired elements.

See [this StackOverflow answer](https://stackoverflow.com/a/33681490) for additional information on mobile Safari's behavior.

## Caveat: Theme Custom Variables

> TL;DR theme custom variable changes will not propagate to ripples if the browser does not support
> [CSS 4 color-mod functions](https://drafts.csswg.org/css-color/).

The way that [mdc-theme works](../mdc-theme#mdc-theme-prop-mixin) is that it emits two properties: one with the hard-coded sass variable, and another for a
CSS variable that can be interpolated. The problem is that ripple backgrounds need to have an opacity, and currently there's no way to opacify a pre-existing color defined by a CSS variable.
There is an editor's draft for a `color-mod` function (see link in TL;DR) that _can_ do this:

```css
background: color(var(--mdc-theme-primary) a(6%));
```

But as far as we know, no browsers yet support it. We have added a `@supports` clause into our code
to make sure that it can be used as soon as browsers adopt it, but for now this means that _changes
to your theme via a custom variable will not propagate to ripples._ We don't see this being a gigantic issue as we envision most users configuring one theme via sass. For places where you do need this, special treatment will have to be given.

### The util API

External frameworks and libraries can use the following utility methods when integrating a component.

#### util.supportsCssVariables(windowObj, forceRefresh = false) => Boolean

Determine whether the current browser supports CSS variables (custom properties). This function caches its result; `forceRefresh` will force recomputation, but is used mainly for testing and should not be necessary in normal use.

#### util.applyPassive(globalObj = window, forceRefresh = false) => object

Determine whether the current browser supports passive event listeners, and if so, use them. This function caches its result; `forceRefresh` will force recomputation, but is used mainly for testing and should not be necessary in normal use.

#### getMatchesProperty(HTMLElementPrototype) => Function

Choose the correct matches property to use on the current browser.

#### getNormalizedEventCoords(ev, pageOffset, clientRect) => object

Determines X/Y coordinates of an event normalized for touch events and ripples.
