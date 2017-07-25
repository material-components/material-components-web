<!--docs:
title: "Layout Grids"
layout: detail
section: components
excerpt: "Responsive grids using CSS/SCSS."
iconId: responsive_layout
path: /catalog/layout-grids/
-->

# Layout Grids

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/layout-grid.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/layout.png" width="256" alt="Layout grid screenshot">
  </a>
</div>-->

MDC Layout Grid is a CSS-only component that implements the
[Material Design layout grid guidelines](https://material.io/guidelines/layout/responsive-ui.html#responsive-ui-grid),
and makes them available to developers as CSS classes and Sass mixins.

It uses [CSS Grid](https://www.w3.org/TR/css-grid-1/) where possible, with a CSS Flexible Box fallback everywhere else.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/layout/responsive-ui.html#responsive-ui-grid">Material Design guidelines: Layout grid guidelines</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/layout-grid.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install --save @material/layout-grid
```

## The layout grid

A grid is a container that consists of a group of cells. Grid can define its own max-width or designate its columns to be a certain width. Cells get positioned in sequence according to a predefined number of columns.

The grid has 12 columns in desktop mode (>= 840px), 8 columns in tablet mode (>= 480px), and 4 columns in phone mode
(< 480px). Cells specify how many columns to span (the default is 4). Cells are placed side by side until there is no more room, then the next cell is placed at the beginning of the next row.

 Margins (the space between the edge of the grid and the edge of the first cell) and gutters (the space between edges of adjacent cells) can be customized on different devices respectively based on design needs. The columns are evenly distributed within the container width, minus the width of all margins and gutters. Layout grids set default margins and gutters to 24px on desktop, 16px on tablet and phone, according to the Material Design spec.

The grid and cells are not styled in any way, serving only for alignment and positioning of elements.


## CSS class usage

```html
<div class="mdc-layout-grid">
  <div class="mdc-layout-grid__inner">
    <div class="mdc-layout-grid__cell"></div>
    <div class="mdc-layout-grid__cell"></div>
    <div class="mdc-layout-grid__cell"></div>
  </div>
</div>
```

The grid should have the `mdc-layout-grid` class. Every cell should have the `mdc-layout-grid__cell` class and must be wrapped by `mdc-layout-grid__inner` for proper alignment. Behavior for grids containing direct children without the `mdc-layout-grid__cell` class is undefined.

By default, `mdc-layout-grid` behaves like a fluid container, which takes up its parents container's available space. You can change the behavior using [max-width](#max-width) or [fixed column width layout grid](#fixed-column-width-grid).


### Margins and gutters

Layout grids set default margins and gutters to 24px on desktop, 16px on tablet and phone.

The Material Design spec recommends 8px, 16px, 24px or 40px as the sizes to choose from, we set those as choices in our demo catalog. However, MDC layout grid doesn't impose any restrictions.


#### CSS custom properties

You can change the margins and gutters for a grid using the `--mdc-layout-grid-margin-#{$device}` and `--mdc-layout-grid-gutter-#{$device}` custom properties, respectively. This requires support for CSS custom properties on the end-user's browser.

```css
.my-grid {
  --mdc-layout-grid-margin-desktop: 40px;
  --mdc-layout-grid-gutter-tablet: 16px;
  --mdc-layout-grid-gutter-phone: 8px;
}
```

#### Sass variables

You can change the margins and gutters using sass variables if you are compiling from them. MDC layout grid uses sass map `mdc-layout-grid-default-margin` and `mdc-layout-grid-default-gutter` to define margins and gutters on different screen types.


### Grid cells

#### Column spans

```html
<div class="mdc-layout-grid">
  <div class="mdc-layout-grid__inner">
    <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6"></div>
    <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-4"></div>
    <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-2"></div>
  </div>
</div>
```

You can set the cells span by applying one of the span classes, of the form `mdc-layout-grid__cell--span-{columns}`, where `{columns}` is an integer between 1 and 12. If the chosen span size is larger than the available number of columns at the current screen size, the cell behaves as if its chosen span size were equal to the available number of columns at that screen size. That is, it takes up the entirety of its row, and no more than that.

If the span classes are not set, `mdc-layout-grid__cell` will fallback to a default span size of 4 columns. You can make it a different number by changing the default value. However, this number needs to be provided at compile time by using sass variable `$mdc-layout-grid-default-column-span`.


#### Column spans for specific screen sizes

It's possible to tweak the behavior of cells further by defining different column spans for specific screen sizes.
These override the default at that size.

You can do that with the `mdc-layout-grid__cell--span-{columns}-{screen_size}` classes, where `{columns}` is an integer
between 1 and 12 and `{screen_size}` is one of `desktop`, `tablet` or `phone`.

```html
<div class="mdc-layout-grid">
  <div class="mdc-layout-grid__inner">
    <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-6 mdc-layout-grid__cell--span-8-tablet"></div>
    <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-4 mdc-layout-grid__cell--span-6-tablet"></div>
    <div class="mdc-layout-grid__cell mdc-layout-grid__cell--span-2 mdc-layout-grid__cell--span-4-phone"></div>
  </div>
</div>
```

In the example above, the first cell has a default span of 6, the second 4, and the third 2. However, at tablet sizes,
the first cell becomes 8 columns wide instead, and the second 6 columns wide. At phone sizes, the third cell becomes 4
columns wide.

#### Cell reordering

By default, items are positioned in the source order. However, you can reorder them by using the
`mdc-layout-grid__cell--order-{number}` classes, where `{order}` is an integer between 1 and 12.

```html
<div class="mdc-layout-grid">
  <div class="mdc-layout-grid__inner">
    <div class="mdc-layout-grid__cell mdc-layout-grid__cell--order-3"></div>
    <div class="mdc-layout-grid__cell mdc-layout-grid__cell--order-1"></div>
    <div class="mdc-layout-grid__cell mdc-layout-grid__cell--order-2"></div>
  </div>
</div>
```

Please bear in mind that this may have an impact on accessibility, since screen readers and other tools tend to follow
source order.


#### Cell alignment

Items are defined to stretch, by default, taking up the height of their corresponding row. You can switch to a different
behavior by using one of the `mdc-layout-grid__cell--align-{position}` alignment classes, where `{position}` is one of
`{top}`, `{middle}` or `{bottom}`.

```html
<div class="mdc-layout-grid">
  <div class="mdc-layout-grid__inner">
    <div class="mdc-layout-grid__cell mdc-layout-grid__cell--align-top"></div>
    <div class="mdc-layout-grid__cell mdc-layout-grid__cell--align-middle"></div>
    <div class="mdc-layout-grid__cell mdc-layout-grid__cell--align-bottom"></div>
  </div>
</div>
```

### Grid with restricted width

#### Max width

MDC layout grids take up the parent element space by default. However, user can set `$mdc-layout-grid-max-width` to restrict the max-width of the layout grid.


#### Fixed column width grid

You can designate each column to have a certain width by using `mdc-layout-grid--fixed-column-width` modifier. The column width can be specified through sass map `$mdc-layout-grid-column-width` or css custom properties `--mdc-layout-grid-column-width-{screen_size}`. The column width is set to 72px on all devices by default.

```
<style>
:root {
  --mdc-layout-grid-column-width-desktop: 84px;
}
</style>

<div class="mdc-layout-grid mdc-layout-grid--fixed-column-width">
  <div class="mdc-layout-grid__inner">
    <div class="mdc-layout-grid__cell"></div>
    <div class="mdc-layout-grid__cell"></div>
  </div>
</div>
```

#### Alignment of grid

The grid is by default center aligned. User can add `mdc-layout-grid--align-left`
or `mdc-layout-grid--align-right` modifier class to change this behavior. Note, these
modifiers will have no effect when the grid already fills its container.

```
<div class="mdc-layout-grid mdc-layout-grid--fixed-column-width mdc-layout-grid--align-left">
  <div class="mdc-layout-grid__inner">
    <div class="mdc-layout-grid__cell"></div>
    <div class="mdc-layout-grid__cell"></div>
  </div>
</div>
```

### Nested grid

When your contents need extra structure that cannot be supported by single layout grid, you can nest layout grid within each other. To nest layout grid, add a new `mdc-layout-grid__inner` to wrap around nested `mdc-layout-grid__cell` within an existing `mdc-layout-grid__cell`.

The nested layout grid behaves exactly like when they are not nested, e.g, they have 12 columns on desktop, 8 columns on tablet and 4 columns on phone. They also use the **same gutter size** as their parents, but margins are not re-introduced since they are living within another cell.

However, Material guideline do not recommend have a deeply nested grid since it might means a over complicated UX.

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


## Sass mixin usage

### mdc-layout-grid

```scss
@include mdc-layout-grid(desktop, 16px, 1600px);
```

`mdc-layout-grid` defines a grid and should be applied to the container element. The mixin takes three parameters:
- `$size`: the target platform: `desktop`, `tablet` or `phone`.
- `$margin`: the size of the grid margin.
- `$max-width` (optional): the maximum width of the grid, at which point space stops being distributed by the columns.

### mdc-layout-grid-inner

```scss
@include mdc-layout-grid-inner(desktop, 16px, 16px);
```

`mdc-layout-grid-inner` defines wrapper of the grid cells. The mixin takes three parameters:
- `$size`: the target platform: `desktop`, `tablet` or `phone`.
- `$margin`: the size of the grid margin.
- `$gutter`: the size of the gutter between cells.


### mdc-layout-grid-cell

```scss
@include mdc-layout-grid-cell(desktop, 4, 16px);
```

`mdc-layout-grid-cell` defines a cell and should be applied to the cell element. The mixin takes three parameters:
- `$size`: the target platform: `desktop`, `tablet` or `phone`.
- `$default-span` (optional, default 4): how many columns this cell should span (1 to 12).
- `$gutter`: the size of the gutter between cells. Be sure to use the same value as for the parent grid.

> Note even though size is passed in as one of the arguments, it won't apply any `media-query` rules. It is set for using the correct CSS custom properties to overriden the margin and gutter at runtime (See [Margins and gutters](#margins-and-gutters) section for detail).

### mdc-layout-grid-fixed-column-width

```scss
@include mdc-layout-grid-fixed-column-width(desktop, 24px, 24px, 72px);
```

`mdc-layout-grid-fixed-column-width` defines the container by width designated column width. The mixin takes four parameters:
- `$size`: the target platform: `desktop`, `tablet` or `phone`.
- `$margin`: the size of the grid margin.
- `$gutter`: the size of the gutter between cells.
- `$column-width`: the width of the column within the grid.


### mdc-layout-grid-cell-order

```scss
@include mdc-layout-grid-cell(16px);
@include mdc-layout-grid-cell-order(2);
```

`mdc-layout-grid-cell-order` reorders a cell inside a grid. It's an optional mixin that should be applied to the cell
element, together with the mandatory `mdc-layout-grid-cell`.

It takes a single parameter, `$order`, which expects a value from 1 to 12.

### mdc-layout-grid-cell-align

```scss
@include mdc-layout-grid-cell(16px);
@include mdc-layout-grid-cell-align(top);
```

`mdc-layout-grid-cell-align` aligns a cell vertically inside a grid. It's an optional mixin that should be applied to
the cell element, together with the mandatory `mdc-layout-grid-cell`.

It takes a single parameter, `$position`, which expects `top`, `middle` or `bottom` as values.
