<!--docs:
title: "Layout Grid"
layout: detail
section: components
excerpt: "A CSS only responsive grid."
iconId: responsive_layout
path: /catalog/layout-grid/
-->

# Layout Grid

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/layout-grid.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/layout.png" width="256" alt="Layout grid screenshot">
  </a>
</div>-->

Material design’s responsive UI is based on a column-variate grid layout. It has 12 columns on desktop, 8 columns on tablet and 4 columns on phone.


## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/layout/responsive-ui.html#responsive-ui-grid">Material Design guidelines: Layout grid</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/layout-grid.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install --save @material/layout-grid
```

## Usage

### HTML Structure

```html
<div class="mdc-layout-grid">
  <div class="mdc-layout-grid__inner">
    <div class="mdc-layout-grid__cell"></div>
    <div class="mdc-layout-grid__cell"></div>
    <div class="mdc-layout-grid__cell"></div>
  </div>
</div>
```

#### Nested grid

When your contents need extra structure that cannot be supported by single layout grid, you can nest layout grid within each other. To nest layout grid, add a new `mdc-layout-grid__inner` to wrap around nested `mdc-layout-grid__cell` within an existing `mdc-layout-grid__cell`.

The nested layout grid behaves exactly like when they are not nested, e.g, they have 12 columns on desktop, 8 columns on tablet and 4 columns on phone. They also use the **same gutter size** as their parents, but margins are not re-introduced since they are living within another cell.

However, the Material Design guidelines do not recommend having a deeply nested grid as it might mean an over complicated UX.

```html
<div class="mdc-layout-grid">
  <div class="mdc-layout-grid__inner">
    <div class="mdc-layout-grid__cell">
      <div class="mdc-layout-grid__inner">
        <div class="mdc-layout-grid__cell"><span>Second level</span></div>
        <div class="mdc-layout-grid__cell"><span>Second level</span></div>
      </div>
    </div>
    <div class="mdc-layout-grid__cell">First level</div>
    <div class="mdc-layout-grid__cell">First level</div>
  </div>
</div>
```

### CSS Classes

CSS Class | Description
--- | ---
`mdc-layout-grid` | Mandatory, for the layout grid element
`mdc-layout-grid__inner` | Mandatory, for wrapping grid cell
`mdc-layout-grid__cell` | Mandatory, for the layout grid cell
`mdc-layout-grid__cell--span-<NUMBER_OF_COLUMNS>` | Optional, specifies the number of columns the cell spans
`mdc-layout-grid__cell--span-<NUMBER_OF_COLUMNS>-<TYPE_OF_DEVICE>` | Optional, specifies the number of columns the cell spans on a type of device (desktop, tablet, mobile)
`mdc-layout-grid__cell--order-<INDEX>` | Optional, specifies the order of the cell
`mdc-layout-grid__cell--align-<POSITION>` | Optional, specifies the alignment of cell
`mdc-layout-grid--fixed-column-width` | Optional, specifies the grid should have fixed column width
`mdc-layout-grid--align-<GRID_POSITION>` | Optional, specifies the alignment of the whole grid

#### `mdc-layout-grid__cell--span-<NUMBER_OF_COLUMNS>`

You can set the cells span by applying one of the span classes, of the form `mdc-layout-grid__cell--span-{columns}`, where `{columns}` is an integer between 1 and 12. If the chosen span size is larger than the available number of columns at the current screen size, the cell behaves as if its chosen span size were equal to the available number of columns at that screen size. If the span classes are not set, `mdc-layout-grid__cell` will fallback to a default span size of 4 columns.


#### `mdc-layout-grid__cell--span-<NUMBER_OF_COLUMNS>-<TYPE_OF_DEVICE>`

The same as `mdc-layout-grid__cell--span-<NUMBER_OF_COLUMNS>` but for a specific type of device(`desktop`, `tablet` or `phone`).


#### `mdc-layout-grid__cell--order-<INDEX>`

By default, items are positioned in the source order. However, you can reorder them by using the
`mdc-layout-grid__cell--order-<INDEX>` classes, where `<INDEX>` is an integer between 1 and 12.
Please bear in mind that this may have an impact on accessibility, since screen readers and other tools tend to follow
source order.

#### `mdc-layout-grid__cell--align-<POSITION>`

Items are defined to stretch, by default, taking up the height of their corresponding row. You can switch to a different
behavior by using one of the `mdc-layout-grid__cell--align-<POSITION>` alignment classes, where `<POSITION>` is one of
`top`, `middle` or `bottom`.


#### `mdc-layout-grid--fixed-column-width`

You can designate each column to have a certain width by using `mdc-layout-grid--fixed-column-width` modifier. The column width can be specified through sass map `$mdc-layout-grid-column-width` or css custom properties `--mdc-layout-grid-column-width-{screen_size}`. The column width is set to 72px on all devices by default.


#### `mdc-layout-grid--align-<GRID_POSITION>`

The grid is by default center aligned. You can add `mdc-layout-grid--align-left`
or `mdc-layout-grid--align-right` modifier class to change this behavior. Note, these
modifiers will have no effect when the grid already fills its container.


### Sass Mixins

Mixin | Description
--- | ---
`mdc-layout-grid($type-of-device, $margin, $max-width)` | Generates CSS for a grid container on certain device type
`mdc-layout-grid-inner($type-of-device, $margin, $gutter)` | Generates CSS for a grid cell wrapper on certain device type
`mdc-layout-grid-cell($type-of-device, $default-span, $gutter)` | Generates CSS for a grid cell on certain device type
`mdc-layout-grid-fixed-column-width($type-of-device, $margin, $gutter, $column-width)` | Generates CSS for a fixed column width container on certain device type
`mdc-layout-grid-cell-order($order)` | Reorders a cell inside a grid
`mdc-layout-grid-cell-align($position)` | Aligns a cell vertically inside a grid


#### `mdc-layout-grid($type-of-device, $margin, $max-width)`

Generates CSS for a grid container on certain device type. The mixin takes three parameters:

- `$size`: the target platform: `desktop`, `tablet` or `phone`.
- `$margin`: the size of the grid margin.
- `$max-width` (optional): the maximum width of the grid, at which point space stops being distributed by the columns.

#### `mdc-layout-grid-inner($type-of-device, $margin, $max-width)`

Generates CSS for a grid cell wrapper on certain device type. The mixin takes three parameters:
- `$size`: the target platform: `desktop`, `tablet` or `phone`.
- `$margin`: the size of the grid margin.
- `$gutter`: the size of the gutter between cells.

#### `mdc-layout-grid-cell($type-of-device, $default-span, $gutter)`

Generates CSS for a grid cell on certain device type. The mixin takes three parameters:
- `$size`: the target platform: `desktop`, `tablet` or `phone`.
- `$default-span` (optional, default 4): how many columns this cell should span (1 to 12).
- `$gutter`: the size of the gutter between cells. Be sure to use the same value as for the parent grid.

> Note even though size is passed in as one of the arguments, it won't apply any `media-query` rules. It is set for using the correct CSS custom properties to overriden the margin and gutter at runtime (See [Margins and gutters](#margins-and-gutters) section for detail).

#### `mdc-layout-grid-fixed-column-width($type-of-device, $margin, $gutter, $column-width)`

Generates CSS for a fixed column width container on certain device type. The mixin takes four parameters:
- `$size`: the target platform: `desktop`, `tablet` or `phone`.
- `$margin`: the size of the grid margin.
- `$gutter`: the size of the gutter between cells.
- `$column-width`: the width of the column within the grid.

### Sass Variables

Variables | Description
--- | ---
`mdc-layout-grid-breakpoints` | A SASS Map specifies the breakpoints width
`mdc-layout-grid-default-margin` | A SASS Map specifies the number of columns
`mdc-layout-grid-default-margin` | A SASS Map specifies the space between the edge of the grid and the edge of the first cell
`mdc-layout-grid-default-gutter` | A SASS Map specifies the space between edges of adjacent cells
`mdc-layout-grid-column-width` | A SASS Map specifies the column width of grid columns
`mdc-layout-grid-default-column-span` | Specifies a cell's default span
`mdc-layout-grid-max-width` | Restricts max width of the layout grid


### CSS Custom Properties

CSS Custom Properties | Description
--- | ---
`mdc-layout-grid-margin-<TYPE_OF_DEVICE>` | Specifies the space between the edge of the grid and the edge of the first cell
`mdc-layout-grid-gutter-<TYPE_OF_DEVICE>` | Specifies the space between edges of adjacent cells
