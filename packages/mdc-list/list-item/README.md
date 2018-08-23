<!--docs:
title: "List Item"
layout: detail
section: components
excerpt: "A single line item within a list."
iconId: list
path: /catalog/lists/list-item
-->

# List Item

A single list item within a list.

## Basic Usage

### HTML Structure

```html
<li class="mdc-list-item">Single-line item</li>
```

## Variants

### Two-Line List Item

There is some extra markup for a two-line list item, as detailed in  [the spec](https://material.io/design/components/lists.html#specs) (see "Double line").

```html
<li class="mdc-list-item">
  <span class="mdc-list-item__text">
    <span class="mdc-list-item__primary-text">First-line text</span>
    <span class="mdc-list-item__secondary-text">Second-line text</span>
  </span>
</li>
```

> NOTE: Make sure there are no white-space characters before primary and secondary text content.

### Single Selection List

MDC List can handle selecting/deselecting list elements based on click or keyboard action. When enabled, the `space` and `enter` keys (or `click` event) will trigger an single list item to become selected and any other previous selected element to become deselected. The first `mdc-list-item` needs `tabindex="0"`.

```html
<li class="mdc-list-item" tabindex="0">Single-line item</li>
```

#### Pre-selected list item

When rendering the list with a pre-selected list item, the list item that needs to be selected should contain
the `mdc-list-item--selected` or `mdc-list-item--activated` class and `aria-selected="true"` attribute before
creating the list.

```html
<li class="mdc-list-item mdc-list-item--selected" aria-selected="true" tabindex="0">Single-line item</li>
```

## Style Customization

### Accessibility

The MDCListItem JavaScript component helps implement the WAI-ARIA best practices for
[Listbox](https://www.w3.org/TR/wai-aria-practices-1.1/#Listbox). This includes overriding the default tab behavior within the list component.

As the user navigates through the list, any `button` or `a` elements within the list will receive `tabindex="-1"`
when the list item is not focused. When the list item receives focus, the child `button` and `a` elements will 
receive `tabIndex="0"`. This allows for the user to tab through list item elements and then tab to the
first element after the list. 

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a List Item for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../../docs/integrating-into-frameworks.md).

### Considerations for Advanced Approach

The `MDCListItemFoundation` expects the HTML to be setup a certain way before being used. This setup is a part of the `layout()` functions within the `index.js`.

#### Setup in `layout()`

If the list items contain sub-elements that are focusable (`button` or `a` elements), these should also receive `tabIndex="-1"`.

```html
<li class="mdc-list-item" tabindex="0">Single-line item<button tabindex="-1"></button></li>
```
 
### `MDCListItemAdapter`

Method Signature | Description
--- | ---
`hasClass(className: string) => boolean` | Returns true if the root element contains the given class
`setTabIndexForChildren(index: Number, value: Number) => void` | Sets the `tabindex` attribute to `value` for each child `button` and `a` element in the list item.

### `MDCListItemFoundation`

Method Signature | Description
--- | ---
`handleFocusIn(evt: Event) => void` | Handles the changing of `tabindex` to `0` for all `button` and `a` elements when a list item receives focus. 
`handleFocusOut(evt: Event) => void` | Handles the changing of `tabindex` to `-1` for all `button` and `a` elements when a list item loses focus.

