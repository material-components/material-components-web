<!--docs:
title: "Lists"
layout: detail
section: components
excerpt: "Lists present multiple line items vertically as a single continuous element."
iconId: list
path: /catalog/lists/
-->

# Lists

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/list.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/lists.png" width="365" alt="Lists screenshot">
  </a>
</div>-->

MDC List provides styles which implement [Material Design Lists](https://material.io/guidelines/components/lists.html) -
"A single continuous column of tessellated subdivisions of equal width." Both single-line and two-line lists are
supported (with three-line lists [planned](https://github.com/material-components/material-components-web/issues/31)).
MDC Lists are designed to be accessible and RTL aware.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/lists.html">Material Design guidelines: Lists</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/list.html">Demo</a>
  </li>
</ul>

## Installation
```
npm install --save @material/list
```

## Usage

### HTML Structure

#### Single-Line List
A basic list consists simply of the list itself, and list items taking up one line.

List items (rows) can contain primary and secondary actions. Lists items can contain 1 supporting graphic tile and/or 1 metadata tile that are positioned at the start and end of the list item, respectively.


```html
<ul class="mdc-list">
  <li class="mdc-list-item">Single-line item</li>
  <li class="mdc-list-item">Single-line item</li>
  <li class="mdc-list-item">Single-line item</li>
</ul>
```

#### Two-Line List
While in theory you can add any number of "lines" to a list item, you can use the `mdc-list--two-line` combined with some extra markup around the text to style a list in the two-line list style as defined by [the spec](https://material.io/guidelines/components/lists.html#lists-specs) (see "Two-line lists").

```html
<ul class="mdc-list mdc-list--two-line">
  <li class="mdc-list-item">
    <span class="mdc-list-item__text">
      First-line text
      <span class="mdc-list-item__secondary-text">
        Second-line text
      </span>
    </span>
  </li>
  <li class="mdc-list-item">
    <span class="mdc-list-item__text">
      First-line text
      <span class="mdc-list-item__secondary-text">
        Second-line text
      </span>
    </span>
  </li>
  <li class="mdc-list-item">
    <span class="mdc-list-item__text">
      First-line text
      <span class="mdc-list-item__secondary-text">
        Second-line text
      </span>
    </span>
  </li>
</ul>
```

#### List Groups
Multiple related lists can be grouped together using the `mdc-list-group` class on a containing element.

```html
<div class="mdc-list-group">
  <h3 class="mdc-list-group__subheader">List 1</h3>
  <ul class="mdc-list">
    <li class="mdc-list-item">line item</li>
    <li class="mdc-list-item">line item</li>
    <li class="mdc-list-item">line item</li>
  </ul>

  <h3 class="mdc-list-group__subheader">List 2</h3>
  <ul class="mdc-list">
    <li class="mdc-list-item">line item</li>
    <li class="mdc-list-item">line item</li>
    <li class="mdc-list-item">line item</li>
  </ul>
</div>
```

#### List Dividers
MDC List contains an `mdc-list-divider` class which can be used as full-width or inset subdivisions either within lists themselves, or standalone between related groups of content.

```html
<ul class="mdc-list">
  <li class="mdc-list-item">Item 1 - Division 1</li>
  <li class="mdc-list-item">Item 2 - Division 1</li>
  <li role="separator" class="mdc-list-divider"></li>
  <li class="mdc-list-item">Item 1 - Division 2</li>
  <li class="mdc-list-item">Item 2 - Division 2</li>
</ul>
```

> NOTE: the role="separator" attribute on the list divider. It is important to include this so that assistive technology can be made aware that this is a presentational element and is not meant to be included as an item in a list. Note that separator is indeed a valid role for li elements.

OR

```html
<ul class="mdc-list">
  <li class="mdc-list-item">Item 1 - List 1</li>
  <li class="mdc-list-item">Item 2 - List 1</li>
</ul>
<hr class="mdc-list-divider">
<ul class="mdc-list">
  <li class="mdc-list-item">Item 1 - List 2</li>
  <li class="mdc-list-item">Item 2 - List 2</li>
</ul>
```

### CSS Classes
CSS Class | Description
--- | ---
`mdc-list` | Mandatory, for the list element
`mdc-list--non-interactive` | Optional, disables interactivity affordances
`mdc-list--dense` | Optional, styles the density of the list, making it appear more compact
`mdc-list--avatar-list` | Optional, configures the leading tiles of each row to display images instead of icons. This will make the graphics of the list items larger
`mdc-list--two-line` | Optional, modifier to style list with two lines (primary and secondary lines)
`mdc-list-item` | Mandatory, for the list item element
`mdc-list-item__text` |	Optional, primary text for the row (displayed as middle column of the list item)
`mdc-list-item__secondary-text` | Optional, secondary text for the list item. Displayed below the primary text. Should be the child of `mdc-list-item__text`
`mdc-list-item--selected` | Optional, styles the row in an selected* state
`mdc-list-item--activated` | Optional, styles the row in an activated* state
`mdc-list-item__graphic` | Optional, the first tile in the row (in LTR languages, the first column of the list item). Typically an icon or image.
`mdc-list-item__meta`	| Optional, the last tile in the row (in LTR languages, the last column of the list item). Typically small text, icon. or image.
`mdc-list-group` | Optional, wrapper around two or more mdc-list elements to be grouped together
`mdc-list-group__subheader` |	Optional, heading text displayed above each list in a group
`mdc-list-divider` | Optional, for list divider element
`mdc-list-divider--padded` | Optional, leaves gaps on each side of divider to match padding of `list-item__meta`
`mdc-list-divider--inset` | Optional, increases the leading margin of the divider so that it does not intersect the avatar column

> NOTE: `mdc-list-divider` class can be used between list items (example 1) *OR* between two lists (example 2)

> NOTE: the difference between selected and activated states:

* *Selected* state should be implemented on the `.list-item` when it is likely to change soon. Eg., selecting one or more photos to share in Google Photos.
* Multiple items can be selected at the same time when using the *selected* state
* *Activated* state is similar to selected state, however should only be implemented once within a specific list.
* *Activated* state is more permanent than selected state, and will **NOT** change soon relative to the lifetime of the page.

### Sass Mixins
Mixin | Description
--- | ---
`mdc-list-item-primary-text-ink-color($color)` | Sets the ink color of the primary text of the list item
`mdc-list-item-secondary-text-ink-color($color)` | Sets the ink color of the secondary text of the list item
`mdc-list-item-graphic-fill-color($color)` | Sets background ink color of the graphic element within list item
`mdc-list-item-graphic-ink-color($color)` | Sets ink color of the graphic element within list item
`mdc-list-item-meta-ink-color($color)` | Sets ink color of the meta element within list item
`mdc-list-divider-color($color)` | Sets divider ink color
`mdc-list-group-subheader-ink-color($color)` | Sets ink color of subheader text within list group
