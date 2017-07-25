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

MDC List provides styles which implement [Material Design Lists](https://material.io/guidelines/components/lists.html) - "A single continuous column of tessellated subdivisions of equal width." Both single-line and two-line lists are supported (with
three-line lists [coming soon](https://github.com/material-components/material-components-web/issues/31)). MDC
Lists are designed to be accessible and RTL aware.

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

#### Dark Mode support

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

### "Dense" Lists

Lists can be made more compact by using the `mdc-list--dense` modifier class.

```html
<ul class="mdc-list mdc-list--dense">
  <!-- ... -->
</ul>
```

### Two-line lists

While in theory you can add any number of "lines" to a list item, you can use the `mdc-list--two-line` combined with some extra markup around the text to style a list in the two-line list style as defined by [the spec](https://material.io/guidelines/components/lists.html#lists-specs) (see "Two-line lists").

```html
<ul class="mdc-list mdc-list--two-line">
  <li class="mdc-list-item">
    <span class="mdc-list-item__text">
      Two-line item
      <span class="mdc-list-item__text__secondary">Secondary text</span>
    </span>
  </li>
</ul>
```

### List "Detail" Elements

As mentioned in the spec, lists can contain primary and secondary actions. It can also contain
things such as avatars, icons, interactive controls, etc. We call these items *detail* items. Lists
can contain 1 **start detail** item and/or 1 **end detail** item that are positioned at the start
and end of the list, respectively. These items are correctly flipped in RTL contexts.

> _N.B._ Please keep accessibility in mind when using things such as icons / icon fonts for detail
> elements. Font Awesome has [excellent guidelines](http://fontawesome.io/accessibility/) for this.

#### Adding a start detail

You can add a start detail using an element with class `mdc-list-item__start-detail` class.

```html
<ul class="mdc-list">
  <li class="mdc-list-item">
    <i class="mdc-list-item__start-detail material-icons" aria-hidden="true">network_wifi</i>
    Wi-Fi
  </li>
  <li class="mdc-list-item">
    <i class="mdc-list-item__start-detail material-icons" aria-hidden="true">bluetooth</i>
    Bluetooth
  </li>
  <li class="mdc-list-item">
    <i class="mdc-list-item__start-detail material-icons" aria-hidden="true">data_usage</i>
    Data Usage
  </li>
</ul>
```

#### Making a start detail an avatar

You can use the `mdc-list--avatar-list` modifier class to style the start detail elements as what
the spec calls "avatars" - large, circular details that lend themselves well to contact images,
profile pictures, etc.

```html
<h2>Contacts</h2>
<ul class="mdc-list mdc-list--avatar-list">
  <li class="mdc-list-item">
    <img class="mdc-list-item__start-detail" src="/users/1/profile_pic.png"
         width="56" height="56" alt="Picture of Janet Perkins">
    Janet Perkins
  </li>
  <li class="mdc-list-item">
    <img class="mdc-list-item__start-detail" src="/users/2/profile_pic.png"
         width="56" height="56" alt="Picture of Mary Johnson">
    Mary Johnson
  </li>
  <li class="mdc-list-item">
    <img class="mdc-list-item__start-detail" src="/users/3/profile_pic.png"
         width="56" height="56" alt="Picture of Peter Carlsson">
    Peter Carlsson
  </li>
</ul>
```

#### Adding an end detail

End details can be added in a similar way to start details. Place an element after the text
with a `mdc-list-item__end-detail` class.

```html
<h2>Contacts</h2>
<ul class="mdc-list">
  <li class="mdc-list-item">
    Janet Perkins
    <a href="#" class="mdc-list-item__end-detail material-icons"
       aria-label="Remove from favorites" title="Remove from favorites">
      favorite
    </a>
  </li>
  <li class="mdc-list-item">
    Mary Johnson
    <a href="#" class="mdc-list-item__end-detail material-icons"
       aria-label="Add to favorites" title="Add to favorites">
      favorite_border
    </a>
  </li>
  <li class="mdc-list-item">
    Janet Perkins
    <a href="#" class="mdc-list-item__end-detail material-icons"
       aria-label="Add to favorites" title="Add to favorites">
      favorite_border
    </a>
  </li>
</ul>
```

Start and end details can be combined easily. Check out the list demo for many examples of how
details can be configured.

> NOTE: If using controls such as a switch (_TK!_) within a list detail, you may need to override
> the width and height styles set on the detail element.

### Using ink ripples for interactive lists

MDC List supports adding ripples to `mdc-list-item` elements, for example in the case of a nav menu.
To add ripples to lists, simply attach a ripple to all list items. Note that this can be easily done
via `mdc-auto-init` when using the [material-components-web](../material-components-web).

```html
<nav class="mdc-list">
  <a href="/wifi" class="mdc-list-item" data-mdc-auto-init="MDCRipple">
    <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">
      network_wifi
    </i>
    Wi-Fi
  </a>
  <a href="/bluetooth" class="mdc-list-item" data-mdc-auto-init="MDCRipple">
    <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">
      bluetooth
    </i>
    Bluetooth
  </a>
  <a href="/data-usage" class="mdc-list-item" data-mdc-auto-init="MDCRipple">
    <i class="material-icons mdc-list-item__start-detail" aria-hidden="true">
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

MDC List contains an `mdc-list-divider` classes which can be used as full-width or inset
subdivisions either within lists themselves, or event standalone between related groups of content.

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
> be included as an item in a list. Note that `separator` is indeed [a valid role](https://w3c.github.io/html/grouping-content.html#the-li-element)
> for `li` elements.

In order to make separators inset, add a `mdc-list-divider--inset` modifier class to it.

```html
<ul class="mdc-list">
  <li class="mdc-list-item">Item 1 - Division 1</li>
  <li class="mdc-list-item">Item 2 - Division 1</li>
  <li class="mdc-list-item">Item 3 - Division 1</li>
  <li role="separator" class="mdc-list-divider mdc-list-divider--inset"></li>
  <li class="mdc-list-item">Item 1 - Division 2</li>
  <li class="mdc-list-item">Item 1 - Division 2</li>
</ul>
```

Inset dividers are useful when working with lists which have start details.

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

#### Control detail item positions

In some cases, you may want start/end details to be positioned differently than the center. An
example of this is in [this mock](https://material-design.storage.googleapis.com/publish/material_v_9/0Bx4BSt6jniD7ckJuUHNnUVlVYTQ/components_lists_content1.png) showing a timestamp being positioned in the top-right corner
or a list item. You can easily do this by adding an `align-self` rule to the details you'd like
styled this way. For example, given a `timestamp` class for an end detail:

```css
.mdc-list-item__end-detail.timestamp {
  /* Lock to top of container. */
  align-self: flex-start;
}
```

Alternatively, if you have _multiple_ items you'd like to put into a detail, you can give it flex
positioning and set its flex direction to column. This will allow you to stack items within an end
detail one on top of another.

For example, let's say you're building a messaging app and, naturally, you want a list of messages
as part of your UI. You're designer wants a timestamp in the top-right corner and an "unread"
indicator below it corner.

The html for this can be easily added

```html
<ul class="mdc-list mdc-list--two-line msgs-list">
  <li class="mdc-list-item">
    <span class="mdc-list-item__text">
      Ali Connors
      <span class="mdc-list-item__text__secondary">Lunch this afternoon? I was...</span>
    </span>

    <span class="mdc-list-item__end-detail">
      <time datetime="2014-01-28T04:36:00.000Z">4:36pm</time>
      <i class="material-icons" arial-label="Unread message">chat_bubble</i>
    </span>
  </li>
  <!-- ... -->
</ul>
```

And the basic CSS is relatively trivial

```css
.msgs-list .mdc-list-item__end-detail {
  width: auto;
  height: auto;
  display: inline-flex;
  flex-direction: column;
  align-items: flex-end;
}
```
