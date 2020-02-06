<!--docs:
title: "Image List"
layout: detail
section: components
excerpt: "An RTL-aware Material Design image list component."
iconId: card
path: /catalog/image-lists/
-->

# Image List

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components.github.io/material-components-web-catalog/#/component/image-list">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/image-list.png" width="294" alt="Image list screenshot">
  </a>
</div>-->

MDC Image List provides a RTL-aware Material Design image list component. An Image List consists of several items,
each containing an image and optionally supporting content (i.e. a text label).

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-image-list">Material Design guidelines: Image list</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/image-list">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/image-list
```

## Basic Usage

### HTML Structure

The HTML structure for a Standard Image List is as follows:

```html
<ul class="mdc-image-list my-image-list">
  <li class="mdc-image-list__item">
    <div class="mdc-image-list__image-aspect-container">
      <img class="mdc-image-list__image" src="...">
    </div>
    <div class="mdc-image-list__supporting">
      <span class="mdc-image-list__label">Text label</span>
    </div>
  </li>
  ...
</ul>
```

### Styles

```scss
@use "@material/image-list/mdc-image-list";
```

The HTML structure above would be combined with an invocation of the `standard-columns` mixin,
to establish how many columns should be displayed per line:

```scss
@use "@material/image-list";

.my-image-list {
  @include image-list.standard-columns(5);
}
```

Images in a Standard Image list are constrained to 1:1 aspect ratio by default; this can be overridden using the
`aspect` mixin documented below.

## Variants

### Masonry Image List

The Masonry Image List variant presents images vertically arranged into several columns, using
[CSS Columns](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Columns). In this layout, images may be any
combination of aspect ratios.

```html
<ul class="mdc-image-list mdc-image-list--masonry my-masonry-image-list">
  <li class="mdc-image-list__item">
    <img class="mdc-image-list__image" src="...">
    <div class="mdc-image-list__supporting">
      <span class="mdc-image-list__label">Text label</span>
    </div>
  </li>
  ...
</ul>
```

> **Note:** Masonry Image List items _do not_ include the `mdc-image-list__image-aspect-container` element, since
images in the list are not expected to be locked to a common aspect ratio.

This would be combined with an invocation of the `mdc-image-list-masonry-columns` mixin, to establish how many columns
should be displayed:

```scss
.my-masonry-image-list {
  @include image-listmasonry-columns(5);
}
```

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-image-list` | Mandatory. Indicates the root Image List element.
`mdc-image-list--masonry` | Optional. Indicates that this Image List should use the Masonry variant.
`mdc-image-list--with-text-protection` | Optional. Indicates that supporting content should be positioned in a scrim overlaying each image (instead of positioned separately under each image).
`mdc-image-list__item` | Mandatory. Indicates each item in an Image List.
`mdc-image-list__image-aspect-container` | Optional. Parent of each item's image element, responsible for constraining aspect ratio. This element may be omitted entirely if images are already sized to the correct aspect ratio.
`mdc-image-list__image` | Mandatory. Indicates the image element in each item.
`mdc-image-list__supporting` | Optional. Indicates the area within each item containing the supporting text label, if the Image List contains text labels.
`mdc-image-list__label` | Optional. Indicates the text label in each item, if the Image List contains text labels.

### Sass Mixins

Mixin | Description
--- | ---
`aspect($width-height-ratio)` | Styles the aspect container elements within an Image List to conform to the given ratio, where 1 is 1:1, greater than 1 is wider, and less than 1 is taller.
`shape-radius($radius, $rtl-reflexive)` | Sets the rounded shape to image list item with given radius size. Set `$rtl-reflexive` to true to flip radius values in RTL context, defaults to false.
`standard-columns($column-count, $gutter-size)` | Styles a Standard Image List to display the given number of columns. `$gutter-size` is optional and overrides the default amount of space between items.
`masonry-columns($column-count, $gutter-size)` | Styles a Masonry Image List to display the given number of columns. `$gutter-size` is optional and overrides the default amount of space between items.

> **Note:** Only one of the `mdc-image-list-...-columns` mixins should be used for any given Image List.
> Use the mixin appropriate to the variant being used.

### Additional Information

#### Constraining width

The `mdc-image-list-...-columns` mixins will grow and shrink items based on the Image List's overall width. Depending on
placement, this could be directly related to the viewport width, and images could become exceedingly large compared to
their actual rendered size. This can be restricted by using any of `min-width`, `width`, or `max-width` on the Image
List:

```scss
@use "@material/image-list";

.my-image-list {
  @include image-list.standard-columns(5);

  max-width: 960px;
}
```

> **Note:** Remember that any specified width will apply to the _entire_ list, so be sure to account for the gutters
as well.

#### Changing number of columns across breakpoints

Presenting a different number of columns for different viewport sizes is straightforward, since the only thing that
needs to be changed are styles:

```scss
.my-image-list {
  @include image-list.standard-columns(5);
}

@media (max-width: 599px) {
  .my-image-list {
    @include image-list.standard-columns(3);
  }
}
```

#### Using div in place of img to enforce aspect ratio

> **Note:** This advice is not applicable to Masonry Image List, where images do not share a common aspect ratio.

Images in an Image List typically use the `img` element. However, if your assets don't have the same aspect ratio as
specified for list items, they will become distorted. In these cases, you can use a `div` element in place of `img`,
and set the `background-image` of each.

> **Note:** Ensuring your images are appropriately-sized prior to serving them to browsers is the most efficient and
ideal approach to using MDC Image List. The `div` alternative is provided as a convenience. If you use this alternative,
make sure to also include the `mdc-image-list__image-aspect-container` element around each item's image.
