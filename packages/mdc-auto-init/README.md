<!--docs:
title: "Auto Init"
layout: detail
section: components
excerpt: "Utilities for declarative, DOM-based initialization of components on simple web sites."
path: /catalog/auto-init/
-->

# Auto Init

`mdc-auto-init` is a utility package that provides declarative, DOM-based method of initialization
for MDC Web components on simple web sites. Note that for more advanced use-cases and complex sites,
manual instantiation of components will give you more flexibility. However, `mdc-auto-init` is great
for static websites, prototypes, and other use-cases where simplicity and convenience is most
appropriate.

## Installation

```
npm install @material/auto-init
```

## Usage

### Using as part of `material-components-web`

If you are using mdc-auto-init as part of the [material-components-web](../material-components-web)
package, simply write the necessary DOM needed for a component, and attach a `data-mdc-auto-init`
attribute to the root element with its value set to the component's JavaScript class name (e.g.,
`MDCTextField`). Then, after writing the markup, simply insert a script tag that calls
`mdc.autoInit()`. Make sure you call `mdc.autoInit()` after all scripts are loaded so it works
properly.

```html
<label class="mdc-text-field mdc-text-field--filled" data-mdc-auto-init="MDCTextField">
  <span class="mdc-text-field__ripple"></span>
  <input class="mdc-text-field__input" type="text" aria-labelledby="label">
  <span id="label" class="mdc-floating-label">Input Label</span>
  <span class="mdc-line-ripple"></span>
</label>

<!-- at the bottom of the page -->
<script type="text/javascript">
  window.mdc.autoInit();
</script>
```

This will attach an [MDCTextField](../mdc-textfield) instance to the root `<div>` element.

#### Accessing the component instance

When `mdc-auto-init` attaches a component to an element, it assign that instance to the element
using a property whose name is the value of `data-mdc-auto-init`. For example, given

```html
<label class="mdc-text-field mdc-text-field--filled" data-mdc-auto-init="MDCTextField">
  <span class="mdc-text-field__ripple"></span>
  <input class="mdc-text-field__input" type="text" aria-labelledby="label">
  <span id="label" class="mdc-floating-label">Input Label</span>
  <span class="mdc-line-ripple"></span>
</label>
```

Once `mdc.autoInit()` is called, you can access the component instance via an `MDCTextField`
property on that element.

```js
document.querySelector<HTMLElement>('.mdc-text-field').MDCTextField.disabled = true;
```

#### Calling subsequent `mdc.autoInit()`

If you decide to add new components into the DOM after the initial `mdc.autoInit()`, you can make subsequent calls to `mdc.autoInit()`. This will not reinitialize existing components. This works since mdc-auto-init will add the `data-mdc-auto-init-state="initialized"` attribute, which tracks if the component has already been initialized. After calling `mdc.autoInit()` your component will then look like:

```html
<label class="mdc-text-field mdc-text-field--filled" data-mdc-auto-init="MDCTextField" data-mdc-auto-init-state="initialized">
  ...
</label>
```

### Using as a standalone module

#### Registering Components

If you are using `mdc-auto-init` outside of `material-components-web`, you must manually provide a
mapping between `data-mdc-auto-init` attribute values and the components which they map to. This can
be achieved via `mdcAutoInit.register`.

```js
import mdcAutoInit from '@material/auto-init';
import {MDCTextField} from '@material/textfield';

mdcAutoInit.register('MDCTextField', MDCTextField);
```

`mdcAutoInit.register()` tells `mdc-auto-init` that when it comes across an element with a
`data-mdc-auto-init` attribute set to `"MDCTextField"`, it should initialize an `MDCTextField`
instance on that element. The `material-components-web` package does this for all components for
convenience.

Also note that a component can be mapped to any string, not necessarily the name of its constructor.

```js
import mdcAutoInit from '@material/auto-init';
import {MDCTextField} from '@material/textfield';

mdcAutoInit.register('My amazing text field!!!', MDCTextField);
```

```html
<label class="mdc-text-field mdc-text-field--filled" data-mdc-auto-init="My amazing text field!!!">
  <!-- ... -->
</label>
<script>window.mdc.autoInit();</script>
```

### De-registering components

Any component can be deregistered by calling `mdcAutoInit.deregister` with the name used to register
the component.

```js
mdcAutoInit.deregister('MDCTextField');
```

This will simply remove the name -> component mapping. It will _not_ affect any already-instantiated
components on the page.

To unregister all name -> component mappings, you can use `mdcAutoInit.deregisterAll()`.

## How `mdc-auto-init` works

`mdc-auto-init` maintains a registry object which maps string identifiers, or **names**, to
component constructors. When the default exported function - `mdcAutoInit()` - is called,
`mdc-auto-init` queries the DOM for all elements with a `data-mdc-auto-init` attribute. For each
element returned, the following steps are taken:

1. If the `data-mdc-auto-init` attribute does not have a value associated with it, throw an error
2. If the value of `data-mdc-auto-init` cannot be found in the registry, throw an error
3. If the element has an existing property whose name is the value of `data-mdc-auto-init`, it is
   assumed to have already been initialized. Therefore it is skipped, and a warning will be logged
   to the console (this behavior can be overridden).
4. Let `Ctor` be the component constructor associated with the given name in the register
5. Let `instance` be the result of calling `Ctor.attachTo()` and passing in the element as an
   argument.
6. Create a non-writable, non-enumerable property on the node whose name is the value of
   `data-mdc-auto-init` and whose value is `instance`.

### Initializing only a certain part of the page

By default, `mdc-auto-init` will query the entire document to figure out which components to
initialize. To override this behavior, you can pass in an optional `root` first argument specifying
the root node whose children will be queried for instantiation.

```html
<div id="mdc-section">
  <!-- MDC Web Components, etc. -->
</div>
<script>window.mdc.autoInit(document.getElementById('mdc-section'));</script>
```

In the above example, only elements within `<div id="mdc-section">` will be queried.

### Calling autoInit() multiple times

By default, `mdc-auto-init` only expects to be called once, at page-load time. However, there may be
certain scenarios where one may want to use `mdc-auto-init` and may still need to call it multiple
times, such as on a Wordpress site that contains an infinitely-scrolling list of new blog post
elements containing MDC Web components. `mdcAutoInit()` takes an optional second argument which is the
function used to warn users when a component is initialized multiple times. By default, this is just
`console.warn()`. However, to skip over already-initialized components without logging a
warning, you could simply pass in a nop.

```html
<script>window.mdc.autoInit(/* root */ document, () => {});</script>
```

This will suppress any warnings about already initialized elements.

### Events

#### MDCAutoInit:End
Triggered when initialization of all components is complete.

`document.addEventListener("MDCAutoInit:End", () => {...});`
