# Material Components Web (MDC Web)

This package contains the master library for Material Components Web. It simply wraps all of its
sibling packages up into one comprehensive library for convenience.

## Installation

```
npm install material-components-web
```

## Usage

### Including the Sass

```scss
@import "material-components-web/material-components-web";
```

### Including the Javascript

```js
import * as mdc from 'material-components-web';
const checkbox = new mdc.checkbox.MDCCheckbox(document.querySelector('.mdc-checkbox'));
// OR
import {checkbox} from 'material-components-web';
const checkbox = new checkbox.MDCCheckbox(document.querySelector('.mdc-checkbox'));
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

> NOTE: Since switch is a reserved word in JS, switch is instead named `switchControl`. 

> NOTE: Built CSS files as well as UMD JS bundles will be available as part of the package.


### Auto-initialization of components

The `material-components-web` package automatically registers all MDC Web components with
[mdc-auto-init](../mdc-auto-init), making it dead simple to create and initialize components
with zero configuration or manual work.

For example, say you want to use an [icon button toogle](../mdc-icon-button). Simply render the necessary
DOM, and attach the `data-mdc-auto-init="MDCIconButtonToggle"` attribute.

```html
<button class="mdc-icon-button" 
   aria-label="Add to favorites"
   aria-pressed="false"
   data-mdc-auto-init="MDCIconButtonToggle">
  <i class="material-icons mdc-icon-button__icon mdc-icon-button__icon--on">favorite</i>
  <i class="material-icons mdc-icon-button__icon">favorite_border</i>
</button>
```

Then at the bottom of your html, insert this one-line script tag:

```html
<script>mdc.autoInit()</script>
```

This will automatically initialize the icon button toggle, as well as any other components marked with the
auto init data attribute. See [mdc-auto-init](../mdc-auto-init) for more info.
