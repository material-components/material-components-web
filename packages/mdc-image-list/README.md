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
     href="https://material-components-web.appspot.com/image-list.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/image-list.png" width="320" alt="Image list screenshot">
  </a>
</div>-->

MDC Image List provides a RTL-aware Material Design image list component, representing an evolution of the
[Material Design Grid list spec](https://material.io/guidelines/components/grid-lists.html).
An Image List consists of several items, each containing an image and optionally supporting content (i.e. a text label).

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/grid-lists.html">Material Design guidelines: Grid lists</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/image-list.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install --save @material/image-list
```

## Usage

### DOM Structure

#### Image list items

Each item within an Image List possesses the following structure:

```html
<li class="mdc-image-list__item">
  <div class="mdc-image-list__image-aspect-container">
    <img class="mdc-image-list__image" src="...">
  </div>
  <div class="mdc-image-list__supporting">
    <span class="mdc-image-list__label">Text label</span>
  </div>
</li>
```

#### Standard Image List

The Standard Image List is simply an unordered list containing any number of items:

```html
<ul class="mdc-image-list">
  <li class="mdc-image-list__item">
    ...
  </li>
  <li class="mdc-image-list__item">
    ...
  </li>
  ...
</ul>
```

### CSS Classes

CSS Class | Description
--- | ---
`mdc-image-list` | Mandatory. Indicates the root Image List element.
`mdc-image-list__item` | Mandatory. Indicates each item in an Image List.
`mdc-image-list__image-aspect-container` | Optional. Parent of each item's image element, responsible for contstraining aspect ratio. This element may be omitted entirely if images are already guaranteed to be the correct aspect ratio.
`mdc-image-list__image` | Mandatory. Indicates the image element in each item.
`mdc-image-list__supporting` | Optional. Indicates the area within each item containing the supporting text label and
`mdc-image-list__label` | Optional. Indicates the text label in each item, if the Image List contains text labels.

### Sass Mixins

Mixin | Description
--- | ---


Image List can be styled one of two ways to scale based on the width of its containing element (or the page):
scaling images so the Image List always fills the width of the container, or scaling the side margins such
that the images remain the same size and the Image List remains centered within the container.

### Using div in place of img to enforce aspect ratio

Images in an Image List typically use the `img` element. However, if your assets don't have the same aspect ratio as
specified for list items, they will become distorted. In these cases, you can use a `div` element in place of `img`,
and set the `background-image` of each.

> **Note:** Ensuring your images are appropriately-sized prior to serving them to browsers is the most efficient and
ideal approach to using MDC Image List. The `div` alternative is provided as a convenience. If you use this alternative,
make sure to also include the `mdc-image-list__image-aspect-container` element around each item's image.
