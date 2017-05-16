<!--docs:
title: "Grid Lists"
layout: detail
section: components
excerpt: "An RTL-aware Material Design grid list component."
iconId: card
path: /catalog/grid-lists/
-->

# Grid Lists

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/grid-list.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/grids.png" width="320" alt="Grid lists screenshot">
  </a>
</div>-->

MDC Grid List provides a RTL-aware Material Design Grid list component adhering to the
[Material Design Grid list spec](https://material.io/guidelines/components/grid-lists.html).
Grid Lists are best suited for presenting homogeneous data, typically images.
Each item in a grid list is called a **tile**. Tiles maintain consistent width, height, and padding
across screen sizes.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/grid-lists.html">Material Design guidelines: Grid lists</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/grid-list.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install --save @material/grid-list
```


## Usage

Basic Grid list has the following structure:

```html
<div class="mdc-grid-list">
  <ul class="mdc-grid-list__tiles">
    <li class="mdc-grid-tile">
      <div class="mdc-grid-tile__primary">
        <img class="mdc-grid-tile__primary-content" src="my-image.jpg" />
      </div>
      <span class="mdc-grid-tile__secondary">
        <span class="mdc-grid-tile__title">Title</span>
      </span>
    </li>
    <li class="mdc-grid-tile">
      <div class="mdc-grid-tile__primary">
        <img class="mdc-grid-tile__primary-content" src="my-image.jpg" />
      </div>
      <span class="mdc-grid-tile__secondary">
        <span class="mdc-grid-tile__title">Title</span>
      </span>
    </li>
  </ul>
</div>
```

The above markup will give you a Grid list of tiles that:

- Have 4px padding in between themselves
- Have a 1x1 aspect ratio
- Have a one-line footer caption with no icon

You just need to put the content you want to load in `src` of
`<img class="mdc-grid-tile__primary-content" src="..."/>`. However, if your
assets don't have the same aspect ratio you as specified in the tile, it will
distort those assets. We provide a solution of that case in
[Using a div in place of an img](#using-a-div-in-place-of-an-img) section.


### Setting the tile width

The tile width is set to 200px by default. There are three ways that you can
overwrite the default value for your grid list:

1. Using CSS variables

  ```css
  .mdc-grid-tile {
    --mdc-grid-list-tile-width: 300px;
  }
  ```

2. Overwriting SCSS variable

  You can overwrite the scss variable by

  ```scss
  @import "@material/grid-list/mdc-grid-list";
  $mdc-grid-list-tile-width: 300px;
  ```

3. Add own style to tile

  ```html
  <style>
    .my-grid-list .mdc-grid-tile {
      width : 300px;
    }
  </style>
  <div class="mdc-grid-list my-grid-list">
    <ul class="mdc-grid-list__tiles">
      <li class="mdc-grid-tile"></li>
      ...
    </ul>
  </div>
  ```

### Change tile padding

Grid list tiles can have 1px padding instead of 4px by adding
`mdc-grid-list--tile-gutter-1` modifier.

```html
<div class="mdc-grid-list mdc-grid-list--tile-gutter-1">
  <ul class="mdc-grid-list__tiles">
  ...
  </ul>
</div>
```

### Image only tile

Grid lists support image only tile. You can remove `mdc-grid-tile__secondary`
and create a image only grid list.

```html
<div class="mdc-grid-list mdc-grid-list--tile-gutter-1">
  <ul class="mdc-grid-list__tiles">
    <li class="mdc-grid-tile">
      <div class="mdc-grid-tile__primary">
        <img class="mdc-grid-tile__primary-content" src="images/1-1.jpg" />
      </div>
    </li>
  </ul>
</div>
```

### Header caption

Grid lists support header caption. You can change the footer caption to be a
header caption by adding `mdc-grid-list--header-caption` modifier.

```html
<div class="mdc-grid-list mdc-grid-list--header-caption">
  <ul class="mdc-grid-list__tiles">
    ...
  </ul>
</div>
```

### Add support text to secondary content (caption)

Grid lists support a one-line caption by default. You can add an additional line of support
text if needed by adding the `mdc-grid-list--twoline-caption` modifier and additional
markup

```html
<div class="mdc-grid-list mdc-grid-list--twoline-caption">
  <ul class="mdc-grid-list__tiles">
    <li class="mdc-grid-tile">
      <div class="mdc-grid-tile__primary">
        <img class="mdc-grid-tile__primary-content" src="my-image.jpg" />
      </div>
      <span class="mdc-grid-tile__secondary">
        <span class="mdc-grid-tile__title">Title</span>
        <span class="mdc-grid-tile__support-text">Support text</span>
      </span>
    </li>
  </ul>
</div>
```

### Add icon to secondary content (caption)

You can add an icon to a caption by adding `mdc-grid-list--with-icon-align-start` or
`mdc-grid-list--with-icon-align-end` and changing the markup.

```html
<div class="mdc-grid-list mdc-grid-list--with-icon-align-start">
  <ul class="mdc-grid-list__tiles">
    <li class="mdc-grid-tile">
      <div class="mdc-grid-tile__primary">
        <img class="mdc-grid-tile__primary-content" src="my-image.jpg" />
      </div>
      <span class="mdc-grid-tile__secondary">
        <i class="mdc-grid-tile__icon material-icons">star_border</i>
        <span class="mdc-grid-tile__title">Title</span>
      </span>
    </li>
  </ul>
</div>
```

### Change aspect ratio of tile

Grid list tiles support all material guideline recommended aspect ratio:

- 1x1
- 16x9
- 2x3
- 3x2
- 4x3
- 3x4

You can use the modifier class `mdc-grid-list--tile-aspect-$ASPECT_RATIO` to apply these aspect
ratios to your grid list. Simply replace `$ASPECT_RATIO` with any of the predefined ratios.

```html
<!-- Example of 16x9 tile -->
<div class="mdc-grid-list mdc-grid-list--tile-aspect-16x9">
  <ul class="mdc-grid-list__tiles">
  ...
  </ul>
</div>
```

As pointed out in the previous section, if your
assets don't have the same aspect ratio you as specified in the tile, it will
distort those assets. We provide a solution of that case in
[Using a div in place of an img](#using-a-div-in-place-of-an-img) section.

### Using a div in place of an img

In case you cannot ensure all your assets will have the same aspect ratio, you
can use `div` instead of `img` markup. It will resize the assets to cover the tile
and crop the assets to display the center part.

```html
<style>
  .my-tile-image {
    background-image: url(my-image.jpg);
  }
</style>
<div class="mdc-grid-list">
  <ul class="mdc-grid-list__tiles">
    <li class="mdc-grid-tile">
      <div class="mdc-grid-tile__primary">
        <div class="mdc-grid-tile__primary-content my-tile-image"></div>
      </div>
      <span class="mdc-grid-tile__secondary">
        <span class="mdc-grid-tile__title">Title</span>
      </span>
    </li>
  </ul>
</div>
```

However, the method results in a less semantic markup, so we don't use this method by
default.


### RTL Support

`mdc-grid-list` is automatically RTL-aware, and will re-position elements whenever
it, or its ancestors, have a `dir="rtl"` attribute.


### Theme

`mdc-grid-list` supports theming. `mdc-grid-tile__primary` uses the theme's background
color for its background color. `mdc-grid-tile__secondary` uses the theme's primary
color for it's background color, and the theme's `text-primary-on-primary` color for its text color.

### Using the Foundation Class

MDCGridList ships with an `MDCGridListFoundation` class that external frameworks and libraries
can use to build their own MDCGridList components with minimal effort. As with all foundation
classes, an adapter object must be provided. The adapter for Grid list must provide the following
functions, with correct signatures:

| Method Signature | Description |
| --- | --- |
| `getOffsetWidth() => number` | Get root element `mdc-grid-list` offsetWidth. |
| `getNumberOfTiles() => number` | Get the number of mdc-grid-tile elements contained within the grid list. |
| `getOffsetWidthForTileAtIndex(index: number) => number` | Get offsetWidth of `mdc-grid-tile` at specified index. |
| `setStyleForTilesElement(property: string, value: number) => void` | Set `mdc-grid-list__tiles` style property to provided value. |
| `registerResizeHandler(handler: Function) => void` | Registers a handler to be called when the surface (or its viewport) resizes. Our default implementation adds the handler as a listener to the window's `resize()` event. |
| `deregisterResizeHandler(handler: Function) => void` | Unregisters a handler to be called when the surface (or its viewport) resizes. Our default implementation removes the handler as a listener to the window's `resize()` event. |
