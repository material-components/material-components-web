# Material Components Web (MDC-Web)

This package contains the master library for Material Components Web. It simply wraps all of its
sibling packages up into one comprehensive library for convenience.

## Installation

```
npm install --save material-components-web
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
import { checkbox } from 'material-components-web';
const checkbox = new checkbox.MDCCheckbox(document.querySelector('.mdc-checkbox'));
```

> NOTE: Built CSS files as well as UMD JS bundles will be available as part of the package
> post-alpha.

### Auto-initialization of components

The `material-components-web` package automatically registers all MDC-Web components with
[mdc-auto-init](../mdc-auto-init), making it dead simple to create and initialize components
with zero configuration or manual work.

For example, say you want to use an [icon toggle](../mdc-icon-toggle). Simply render the necessary
DOM, an attach the `data-mdc-auto-init="MDCIconToggle"` attribute.

```html
<i class="mdc-icon-toggle material-icons" role="button" aria-pressed="false"
   aria-label="Add to favorites" tabindex="0"
   data-toggle-on='{"label": "Remove from favorites", "content": "favorite"}'
   data-toggle-off='{"label": "Add to favorites", "content": "favorite_border"}'
   data-mdc-auto-init="MDCIconToggle">
  favorite_border
</i>
```

Then at the bottom of your html, insert this one-line script tag:

```html
<script>mdc.autoInit()</script>
```

This will automatically initialize the icon toggle, as well as any other components marked with the
auto init data attribute. See [mdc-auto-init](../mdc-auto-init) for more info.
