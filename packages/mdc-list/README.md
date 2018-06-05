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
     href="https://material-components.github.io/material-components-web-catalog/#/component/list">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/lists.png" width="365" alt="Lists screenshot">
  </a>
</div>-->

Lists are continuous, vertical indexes of text or images.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/design/components/lists.html">Material Design guidelines: Lists</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/list">Demo</a>
  </li>
</ul>

## Installation
```
npm install @material/list
```

## Basic Usage

### HTML Structure

```html
<ul class="mdc-list" aria-orientation="vertical">
  <li class="mdc-list-item">Single-line item</li>
  <li class="mdc-list-item">Single-line item</li>
  <li class="mdc-list-item">Single-line item</li>
</ul>
```

## Variants

### Two-Line List

You can use the `mdc-list--two-line` combined with some extra markup around the text to style a list 
in the double line list style as defined by 
[the spec](https://material.io/design/components/lists.html#specs) (see "Double line").

```html
<ul class="mdc-list mdc-list--two-line" aria-orientation="vertical">
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

### List Groups

Multiple related lists can be grouped together using the `mdc-list-group` class on a containing element.

```html
<div class="mdc-list-group">
  <h3 class="mdc-list-group__subheader">List 1</h3>
  <ul class="mdc-list" aria-orientation="vertical">
    <li class="mdc-list-item">line item</li>
    <li class="mdc-list-item">line item</li>
    <li class="mdc-list-item">line item</li>
  </ul>

  <h3 class="mdc-list-group__subheader">List 2</h3>
  <ul class="mdc-list" aria-orientation="vertical">
    <li class="mdc-list-item">line item</li>
    <li class="mdc-list-item">line item</li>
    <li class="mdc-list-item">line item</li>
  </ul>
</div>
```

### List Dividers

MDC List contains an `mdc-list-divider` class which can be used as full-width or inset subdivisions either within lists themselves, or standalone between related groups of content.

```html
<ul class="mdc-list" aria-orientation="vertical">
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
<ul class="mdc-list" aria-orientation="vertical">
  <li class="mdc-list-item">Item 1 - List 1</li>
  <li class="mdc-list-item">Item 2 - List 1</li>
</ul>
<hr class="mdc-list-divider">
<ul class="mdc-list" aria-orientation="vertical">
  <li class="mdc-list-item">Item 1 - List 2</li>
  <li class="mdc-list-item">Item 2 - List 2</li>
</ul>
```

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-list` | Mandatory, for the list element.
`mdc-list--non-interactive` | Optional, disables interactivity affordances.
`mdc-list--dense` | Optional, styles the density of the list, making it appear more compact.
`mdc-list--avatar-list` | Optional, configures the leading tiles of each row to display images instead of icons. This will make the graphics of the list items larger.
`mdc-list--two-line` | Optional, modifier to style list with two lines (primary and secondary lines).
`mdc-list-item` | Mandatory, for the list item element.
`mdc-list-item__text` |	Optional, primary text for the row (displayed as middle column of the list item).
`mdc-list-item__secondary-text` | Optional, secondary text for the list item. Displayed below the primary text. Should be the child of `mdc-list-item__text`.
`mdc-list-item--selected` | Optional, styles the row in an selected* state.
`mdc-list-item--activated` | Optional, styles the row in an activated* state.
`mdc-list-item__graphic` | Optional, the first tile in the row (in LTR languages, the first column of the list item). Typically an icon or image.
`mdc-list-item__meta`	| Optional, the last tile in the row (in LTR languages, the last column of the list item). Typically small text, icon. or image.
`mdc-list-group` | Optional, wrapper around two or more mdc-list elements to be grouped together.
`mdc-list-group__subheader` |	Optional, heading text displayed above each list in a group.
`mdc-list-divider` | Optional, for list divider element.
`mdc-list-divider--padded` | Optional, leaves gaps on each side of divider to match padding of `list-item__meta`.
`mdc-list-divider--inset` | Optional, increases the leading margin of the divider so that it does not intersect the avatar column.

> NOTE: `mdc-list-divider` class can be used between list items (example 1) *OR* between two lists (example 2).

> NOTE: the difference between selected and activated states:

* *Selected* state should be implemented on the `.list-item` when it is likely to change soon. Eg., selecting one or more photos to share in Google Photos.
* Multiple items can be selected at the same time when using the *selected* state.
* *Activated* state is similar to selected state, however should only be implemented once within a specific list.
* *Activated* state is more permanent than selected state, and will **NOT** change soon relative to the lifetime of the page.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-list-item-primary-text-ink-color($color)` | Sets the ink color of the primary text of the list item.
`mdc-list-item-secondary-text-ink-color($color)` | Sets the ink color of the secondary text of the list item.
`mdc-list-item-graphic-fill-color($color)` | Sets background ink color of the graphic element within list item.
`mdc-list-item-graphic-ink-color($color)` | Sets ink color of the graphic element within list item.
`mdc-list-item-meta-ink-color($color)` | Sets ink color of the meta element within list item.
`mdc-list-divider-color($color)` | Sets divider ink color.
`mdc-list-group-subheader-ink-color($color)` | Sets ink color of subheader text within list group.

### Accessibility

The MDCList JavaScript component implements the WAI-ARIA best practices for
[Listbox](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox). This includes overriding the default tab behavior
within the list component. You should not add `tabindex` to any of the `li` elements in a list.

As the user navigates through the list, any `button` or `a` elements within the list will receive `tabindex="-1"`
when the list item is not focused. When the list item receives focus, the child `button` and `a` elements will 
receive `tabIndex="0"`. This allows for the user to tab through list items elements and then tab to the
first element after the list. The `Arrow`, `Home`, and `End` keys should be used for navigating internal list elements.
The MDCList will perform the following actions for each key press

Key | Action
--- | ---
`ArrowUp` | When the list is in a vertical orientation, it will cause the previous list item to receive focus.
`ArrowDown` | When the list is in a vertical orientation, it will cause the next list item to receive focus.
`ArrowLeft` | When the list is in a horizontal orientation (default), it will cause the previous list item to receive focus.
`ArrowRight` | When the list is in a horizontal orientation (default), it will cause the next list item to receive focus.
`Home` | Will cause the first list item in the list to receive focus.
`End` | Will cause the last list item in the list to receive focus.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a List for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCListAdapter`

Method Signature | Description
--- | ---
`getListItemCount() => Number` | Returns the total number of list items (elements with `mdc-list-item` class) that are direct children of the `root_` element.
`getFocusedElementIndex() => Number` | Returns the `index` value of the currently focused element.
`getListItemIndex(ele: Element) => Number` | Returns the `index` value of the provided `ele` element.
`focusItemAtIndex(ndx: Number) => void` | Focuses the list item at the `ndx` value specified.
`setTabIndexForListItemChildren(ndx: Number, value: Number) => void` | Sets the `tabindex` attribute to `value` for each child `button` and `a` element in the list item at the `ndx` specified.

### `MDCListFoundation`

Method Signature | Description
--- | ---
`setWrapFocus(value: Boolean) => void` | Sets the list to allow the up arrow on the first element to focus the last element of the list and vice versa. 
`setVerticalOrientation(value: Boolean) => void` | Sets the list to an orientation causing the keys used for navigation to change. `true` results in the Up/Down arrow keys being used. `false` results in the Left/Right arrow keys being used. 
`handleFocusIn(evt: Event) => void` | Handles the changing of `tabindex` to `0` for all `button` and `a` elements when a list item receives focus. 
`handleFocusOut(evt: Event) => void` | Handles the changing of `tabindex` to `-1` for all `button` and `a` elements when a list item loses focus.
`handleKeydown(evt: Event) => void` | Handles determining if a focus action should occur when a key event is triggered. 
`focusNextElement(index: Number) => void` | Handles focusing the next element using the current `index`.
`focusPrevElement(index: Number) => void` | Handles focusing the previous element using the current `index`.
`focusFirstElement() => void` | Handles focusing the first element in a list.
`focusLastElement() => void` | Handles focusing the last element in a list.
