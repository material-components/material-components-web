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

### Basic Lists

A basic list consists simply of the list itself, and list items taking up one line.

```html
<ul class="mdc-list">
  <li class="mdc-list-item">Single-line item</li>
  <li class="mdc-list-item">Single-line item</li>
  <li class="mdc-list-item">Single-line item</li>
</ul>
```

#### RTL Support

A list will flip its direction if it is _placed within an ancestor element containing a `dir`
attribute with value `"rtl"`_. This applies to all lists regardless of type.

```html
<html dir="rtl">
  <!-- ... -->
  <ul class="mdc-list">
    <!-- Hebrew for 'item in list' -->
    <li class="mdc-list-item">פריט ברשימה</li>
  </ul>
</html>
```

#### Dark Mode Support

Like other MDC-Web components, lists support dark mode either when an `mdc-list--theme-dark` class is
attached to the root element, or the element has an ancestor with class `mdc-theme--dark`.

```html
<html class="mdc-theme--dark">
  <!-- ... -->
  <ul class="mdc-list">
    <li class="mdc-list-item">A list item on a dark background</li>
  </ul>
</html>
```

#### Non-interactive lists

By default, list items receive styles for hover, focus, and press states (including the ripple effect if
`MDCRipple` is instantiated). It is possible to opt out of these styles by adding the `mdc-list--non-interactive`
modifier to the parent list.

> **Note**: In order to receive focus state, list items must either use a focusable element such as `<a>`, or have an
> explicit `tabindex` attribute value.

### "Dense" Lists

Lists can be made more compact by using the `mdc-list--dense` modifier class.

```html
<ul class="mdc-list mdc-list--dense">
  <!-- ... -->
</ul>
```

### Two-Line List Items

While in theory you can add any number of "lines" to a list item, you can use the `mdc-list--two-line` combined with
some extra markup around the text to style a list in the two-line list style as defined by
[the spec](https://material.io/guidelines/components/lists.html#lists-specs) (see "Two-line lists").

```html
<ul class="mdc-list mdc-list--two-line">
  <li class="mdc-list-item">
    <span class="mdc-list-item__text">
      Two-line item
      <span class="mdc-list-item__secondary-text">Secondary text</span>
    </span>
  </li>
</ul>
```

### List Item Tile Elements

As mentioned in the spec, list items (rows) can contain primary and secondary actions. They can also contain
things such as avatars, icons, interactive controls, etc. We call all of these items *tiles*. Lists items
can contain 1 **supporting graphic** tile and/or 1 **metadata** tile that are positioned at the start
and end of the list item, respectively. These tiles are correctly flipped in RTL contexts.

> _N.B._ Please keep accessibility in mind when using things such as icons / icon fonts for tile
> elements. Font Awesome has [excellent guidelines](http://fontawesome.io/accessibility/) for this.

#### Adding a Supporting Graphic

You can add a supporting graphic using an element with class `mdc-list-item__graphic` class.

```html
<ul class="mdc-list">
  <li class="mdc-list-item">
    <i class="mdc-list-item__graphic material-icons" aria-hidden="true">network_wifi</i>
    Wi-Fi
  </li>
  <li class="mdc-list-item">
    <i class="mdc-list-item__graphic material-icons" aria-hidden="true">bluetooth</i>
    Bluetooth
  </li>
  <li class="mdc-list-item">
    <i class="mdc-list-item__graphic material-icons" aria-hidden="true">data_usage</i>
    Data Usage
  </li>
</ul>
```

#### Making a Graphic an Avatar

You can use the `mdc-list--avatar-list` modifier class to style the graphic elements as what
the spec calls "avatars" - large, circular tiles that lend themselves well to contact images,
profile pictures, etc.

```html
<h2>Contacts</h2>
<ul class="mdc-list mdc-list--avatar-list">
  <li class="mdc-list-item">
    <img class="mdc-list-item__graphic" src="/users/1/profile_pic.png"
         width="56" height="56" alt="Picture of Janet Perkins">
    Janet Perkins
  </li>
  <li class="mdc-list-item">
    <img class="mdc-list-item__graphic" src="/users/2/profile_pic.png"
         width="56" height="56" alt="Picture of Mary Johnson">
    Mary Johnson
  </li>
  <li class="mdc-list-item">
    <img class="mdc-list-item__graphic" src="/users/3/profile_pic.png"
         width="56" height="56" alt="Picture of Peter Carlsson">
    Peter Carlsson
  </li>
</ul>
```

#### Adding Metadata

Metadata tiles can be added in a similar way to graphics. Place an element after the text
with a `mdc-list-item__meta` class.

```html
<h2>Contacts</h2>
<ul class="mdc-list">
  <li class="mdc-list-item">
    Janet Perkins
    <a href="#" class="mdc-list-item__meta material-icons"
       aria-label="Remove from favorites" title="Remove from favorites">
      favorite
    </a>
  </li>
  <li class="mdc-list-item">
    Mary Johnson
    <a href="#" class="mdc-list-item__meta material-icons"
       aria-label="Add to favorites" title="Add to favorites">
      favorite_border
    </a>
  </li>
  <li class="mdc-list-item">
    Janet Perkins
    <a href="#" class="mdc-list-item__meta material-icons"
       aria-label="Add to favorites" title="Add to favorites">
      favorite_border
    </a>
  </li>
</ul>
```

Supporting graphics and metadata can be combined easily. Check out the list demo for many examples of how
tiles can be configured.

> NOTE: If using controls such as a switch within a list tile, you may need to override
> the width and height styles set on the tile element.

### Using Ink Ripples for Interactive Lists

MDC List supports adding ripples to `mdc-list-item` elements, for example in the case of a nav menu.
To add ripples to lists, simply attach a ripple to each list item. Note that this can be easily done
via `mdc-auto-init` when using [material-components-web](../material-components-web).

```html
<nav class="mdc-list">
  <a href="/wifi" class="mdc-list-item" data-mdc-auto-init="MDCRipple">
    <i class="material-icons mdc-list-item__graphic" aria-hidden="true">
      network_wifi
    </i>
    Wi-Fi
  </a>
  <a href="/bluetooth" class="mdc-list-item" data-mdc-auto-init="MDCRipple">
    <i class="material-icons mdc-list-item__graphic" aria-hidden="true">
      bluetooth
    </i>
    Bluetooth
  </a>
  <a href="/data-usage" class="mdc-list-item" data-mdc-auto-init="MDCRipple">
    <i class="material-icons mdc-list-item__graphic" aria-hidden="true">
      data_usage
    </i>
    Data Usage
  </a>
</nav>
<script>
  mdc.autoInit();
</script>
```

### List Dividers

MDC List contains an `mdc-list-divider` class which can be used as full-width or inset
subdivisions either within lists themselves, or standalone between related groups of content.

To use within lists, simply add the `mdc-list-divider` class to a list item.

```html
<ul class="mdc-list">
  <li class="mdc-list-item">Item 1 - Division 1</li>
  <li class="mdc-list-item">Item 2 - Division 1</li>
  <li class="mdc-list-item">Item 3 - Division 1</li>
  <li role="separator" class="mdc-list-divider"></li>
  <li class="mdc-list-item">Item 1 - Division 2</li>
  <li class="mdc-list-item">Item 1 - Division 2</li>
</ul>
```

> Note the `role="separator"` attribute on the list divider. It is important to include this so that
> assistive technology can be made aware that this is a presentational element and is not meant to
> be included as an item in a list. Note that `separator` is indeed a
> [valid role](https://w3c.github.io/html/grouping-content.html#the-li-element) for `li` elements.

Dividers are designed to span the full width of the list by default (especially useful in the context of drawers and menus).
To make a divider match the padding of list items, add the `mdc-list-divider--padded` modifier class.

Inset dividers are useful when working with lists which have graphics.
To add an inset divider, also add the `mdc-list-divider--inset` modifier class to the divider element.

### List Groups

Multiple related lists can be grouped together using the `mdc-list-group` class on a containing
element. `mdc-list-divider` elements can be used in these groups _between_ lists to help
differentiate them.

```html
<div class="mdc-list-group">
  <h3 class="mdc-list-group__subheader">List 1</h3>
  <ul class="mdc-list">
    <li class="mdc-list-item">Single-line item</li>
    <li class="mdc-list-item">Single-line item</li>
    <li class="mdc-list-item">Single-line item</li>
  </ul>

  <hr class="mdc-list-divider">

  <h3 class="mdc-list-group__subheader">List 2</h3>
  <ul class="mdc-list">
    <li class="mdc-list-item">Single-line item</li>
    <li class="mdc-list-item">Single-line item</li>
    <li class="mdc-list-item">Single-line item</li>
  </ul>
</div>
```

### Tips/Tricks

#### Bordered Lists

While hinted at within the spec, **bordered lists** - where each list item has a border around
it - are not officially part of the list component spec. However, they seem to be used
often in web applications, especially those suited more for desktop. The following example shows how
to add borders to lists.

```html
<style>
  .my-bordered-list {
    /* remove the side padding. we'll be placing it around the item instead. */
    padding-right: 0;
    padding-left: 0;
  }
  .my-bordered-list .mdc-list-item {
    /* Add the list side padding padding to the list item. */
    padding: 0 16px;
    /* Add a border around each element. */
    border: 1px solid rgba(0, 0, 0, .12);
  }
  /* Ensure adjacent borders don't collide with one another. */
  .my-bordered-list .mdc-list-item:not(:first-child) {
    border-top: none;
  }
</style>
<!-- ... -->
<ul class="mdc-list my-bordered-list">
  <li class="mdc-list-item">Item 1</li>
  <li class="mdc-list-item">Item 2</li>
  <li class="mdc-list-item">Item 3</li>
</ul>
```

#### Control Tile Positions

In some cases, you may want the supporting graphic or metadata to be positioned differently than the center.
An example of this is in [this mock][pos-mock] showing a timestamp being positioned in the top-right corner
or a list item. You can easily do this by adding an `align-self` rule to the tiles you'd like
styled this way. For example, given a `timestamp` class for metadata:

```css
.mdc-list-item__meta.timestamp {
  /* Lock to top of container. */
  align-self: flex-start;
}
```

[pos-mock]: https://material-design.storage.googleapis.com/publish/material_v_9/0Bx4BSt6jniD7ckJuUHNnUVlVYTQ/components_lists_content1.png

Alternatively, if you have _multiple_ items you'd like to put into a tile, you can give it `display: flex` and
`flex-direction: column`. This will allow you to stack items within a tile, one on top of another.

For example, let's say you're building a messaging app and, naturally, you want a list of messages
as part of your UI. Your designer wants a timestamp in the top-right corner and an "unread"
indicator below it corner.

The HTML for this can be easily added:

```html
<ul class="mdc-list mdc-list--two-line msgs-list">
  <li class="mdc-list-item">
    <span class="mdc-list-item__text">
      Ali Connors
      <span class="mdc-list-item__secondary-text">Lunch this afternoon? I was...</span>
    </span>

    <span class="mdc-list-item__meta">
      <time datetime="2014-01-28T04:36:00.000Z">4:36pm</time>
      <i class="material-icons" arial-label="Unread message">chat_bubble</i>
    </span>
  </li>
  <!-- ... -->
</ul>
```

And the basic CSS is relatively trivial:

```css
.msgs-list .mdc-list-item__meta {
  width: auto;
  height: auto;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
}
```

### CSS Classes

#### Blocks

CSS Class | Description
--- | ---
`mdc-list` | A container for rows (`mdc-list-item`s)
`mdc-list-group` | Wraps one or more `mdc-list` and/or `mdc-list-divider` elements
`mdc-list-item` | An individual row in an `mdc-list`
`mdc-list-divider` | Separates two rows or two lists using a horizontal bar

#### Modifiers

CSS Class | Description
--- | ---
`mdc-list--dense` | Increases the density of the list, making it appear more compact
`mdc-list--avatar-list` | Configures the leading tiles of each row to display images instead of icons
`mdc-list--two-line` | Increases the height of the row to give it greater visual separation from adjacent rows
`mdc-list-item--selected` | Styles the row in a selected\* state
`mdc-list-item--activated` | Styles the row in an activated\* state
`mdc-list-divider--inset` | Increases the leading margin of the divider so that it does not intersect the avatar column

\* **Note**: the difference between _selected_ and _activated_ states:

- _Selected_ is ephemeral and likely to change soon. E.g., selecting one or more photos to share in Google Photos.
  Multiple items in a list can be _selected_ at the same time.
- _Activated_ is more permanent within the page's lifetime. E.g., the currently highlighted destination in a nav drawer.
  Only one item in a list can be _activated_ at a time.

#### Elements

CSS Class | Description
--- | ---
`mdc-list-item__graphic` | The first tile in the row (in LTR languages, the left-most)
`mdc-list-item__meta` | The last tile in the row (in LTR languages, the right-most)
`mdc-list-item__text` | Primary text for the row (displayed as the middle tile)
`mdc-list-item__secondary-text` | Secondary text for the row (displayed in the middle tile)
`mdc-list-group__subheader` | Heading text displayed above each list in a group

### Sass Mixins

Mixin | Description
--- | ---
`mdc-list-item-primary-text-ink-color($color)` | Sets the ink color of the primary text
`mdc-list-item-secondary-text-ink-color($color)` | Sets the ink color of the secondary text
`mdc-list-item-graphic-fill-color($color)` | Sets the fill color of the supporting graphic
`mdc-list-item-graphic-ink-color($color)` | Sets the ink color of the supporting graphic
`mdc-list-item-meta-ink-color($color)` | Sets the ink color of the metadata element
`mdc-list-divider-color($color)` | Sets the color of the divider
`mdc-list-group-subheader-ink-color($color)` | Sets the ink color of the list group subheader
