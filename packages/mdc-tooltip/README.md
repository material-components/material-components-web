<!--docs:
title: "Tooltip"
layout: detail
section: components
excerpt: "Tooltips display informative text when users hover over, focus on, or tap an element."
iconId: tooltip
path: /catalog/tooltips/
-->

# Tooltip

Tooltips display informative text when users hover over, focus on, or tap an element.

![Tooltip example](images/tooltip.png)

## Content

* [Using tooltips](#using-tooltips)
* [Tooltips](#tooltips)
* [API](#api)
* [Usage within web frameworks](#usage-within-web-frameworks)

## Using tooltips

Tooltips, when activated, display a text label identifying an element, such as a
description of its function. Tooltips should include only short, descriptive
text and avoid restating visible UI text.

Common use cases include:

* Displaying full text that has been truncated
* Identifying a UI affordance
* Describing differences between similar elements
* Distinguishing actions with related iconography

### Tooltip positioning
Tooltip positioning is based on the anchor element (the element that, on user
interaction, results in showing or hiding of a tooltip). They appear directly
below or above this anchor element and can be placed flush with either the end,
center, or start of the anchor.

![End, center, and start alignment of tooltip on icon button in a LTR page](images/plain_tooltip_alignment.png)
<p align="center"> *Tooltips aligned with the end, center, and start of an anchor element (in a LTR page flow).* </p>


A threshold distance of 32px is expected to be maintained between the tooltip
and the viewport edge. A valid tooltip position is calculated based on which of
the position options (start, center, or end for x-axis alignment and above or
below for y-axis alignment) maintain this threshold. If all possible alignment
options violate the threshold, then a valid tooltip position is one that does
not collide with the viewport.

A user specified position is honored only if the specified position is
considered valid based on the logic outlined above.

### Installing tooltips

```
npm install @material/tooltip
```

### Styles

```scss
@use "@material/tooltip/styles";
```

### JavaScript instantiation

```js
import {MDCTooltip} from '@material/tooltip';
const tooltip = new MDCTooltip(document.querySelector('.mdc-tooltip'));
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

### Making tooltips accessible

Each tooltip element placed into the DOM is expected to have a unique `id`.
Their corresponding anchor element must be labeled with the `aria-describedby`
attribute, establishing a relationship between the two elements.

## Tooltips

### Tooltip example

```html
<div id="tooltip-id" class="mdc-tooltip" role="tooltip" aria-hidden="true">
  <div class="mdc-tooltip__surface">
    lorem ipsum dolor
  </div>
</div>
```

To ensure proper positioning of the tooltip, it's important that this tooltip
element is an immediate child of the `<body>`, rather than nested underneath
the anchor element or other elements.


```html
<a aria-describedby="tooltip-id" href="www.google.com"> Link </a>
```

The `aria-describedby` attribute (which is given the `id` for the associated tooltip)
designates an element as being the anchor element for a particular tooltip.

Other MDC components can be designated as anchor elements by adding this
attribute.

#### MDC Button:

```html
<button class="mdc-button mdc-button--outlined" aria-describedby="tooltip-id">
  <div class="mdc-button__ripple"></div>
  <span class="mdc-button__label">Button</span>
</button>
```
#### MDC Icon Button:

```html
<button class="mdc-icon-button material-icons" aria-describedby="tooltip-id">favorite</button>
```

If the information provided in the tooltip is duplicated from the anchor
element's `aria-label`, the tooltip can be hidden from the screenreader by
annotating the anchor element with `data-tooltip-id` instead of
`aria-describedby`. Hiding the tooltip from the screenreader will prevent the
same information from being announced twice (once from the `aria-label` and
a second time from the tooltip).

```html
<button class="mdc-icon-button material-icons"
        aria-label="toggle favorite"
        data-tooltip-id="tooltip-id">
  favorite
</button>

<div id="tooltip-id" class="mdc-tooltip" role="tooltip" aria-hidden="true">
  <div class="mdc-tooltip__surface">
    toggle favorite
  </div>
</div>
```


## API

### Sass mixins

Access to theme mixins require importing the tooltip's theme style module.

```scss
@use "@material/tooltip";
```

Mixin | Description
--- | ---
`fill-color($color)` | Sets the fill color of the tooltip.
`label-ink-color($color)` | Sets the color of the tooltip's label text.
`shape-radius($radius, $rtl-reflexive)` | Sets the rounded shape to tooltip surface with given radius size. Set `$rtl-reflexive` to true to flip radius values in RTL context, defaults to false.

### `MDCTooltip` Methods

Method Signature | Description
--- | ---
`setTooltipPosition(position: {xPos?: XPosition, yPos?: YPosition}) => void` | Specify how the tooltip should be aligned with the anchor element. See [tooltip positioning](#tooltip-positioning) section for more information.
`setAnchorBoundaryType(type: AnchorBoundaryType) => void` | Specify whether the anchor element is `bounded` (element has an identifiable boundary such as a button) or `unbounded` (element does not have a visually declared boundary such as a text link). Tooltips are placed closer to bounded anchor elements compared to unbounded anchor elements. If no type is specified, defaults to `bounded`

### Usage Within Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Tooltip for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

See [MDCTooltipAdapter](./adapter.ts) and [MDCTooltipFoundation](./foundation.ts) for up-to-date code documentation of tooltip foundation APIs.
