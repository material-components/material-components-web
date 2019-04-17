<!--docs:
title: "Data Tables"
layout: detail
section: components
excerpt: "Material Design-styled tables."
iconId: data_table
path: /catalog/data-tables/
-->

# Data Table

Data tables display sets of data.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-data-tables">Material Design guidelines: Data tables</a>
  </li>
</ul>

## Installation

```
npm install @material/data-table
```

### Styles

```scss
@import "@material/data-table/mdc-data-table";
```

> *NOTE*: Styles for any components you intend to include within data-table (e.g. Checkboxes, etc.) must also be
> imported.

## Basic Usage

### HTML Structure

```html
<div class="mdc-data-table">
  <table class="mdc-data-table__table">
    <thead>
      <tr class="mdc-data-table__header-row">
        <th class="mdc-data-table__header-cell" scope="col">Carbs (g)</th>
        <th class="mdc-data-table__header-cell" scope="col">Protein (g)</th>
        <th class="mdc-data-table__header-cell" scope="col">Comments</th>
      </tr>
    </thead>
    <tbody class="mdc-data-table__content">
      <tr class="mdc-data-table__row">
        <td class="mdc-data-table__cell mdc-data-table__cell--numeric">24</td>
        <td class="mdc-data-table__cell mdc-data-table__cell--numeric">4.0</td>
        <td class="mdc-data-table__cell">Super tasty</td>
      </tr>
      <tr class="mdc-data-table__row">
        <td class="mdc-data-table__cell mdc-data-table__cell--numeric">37</td>
        <td class="mdc-data-table__cell mdc-data-table__cell--numeric">4.3</td>
        <td class="mdc-data-table__cell">I like ice cream more</td>
      </tr>
      <tr class="mdc-data-table__row">
        <td class="mdc-data-table__cell mdc-data-table__cell--numeric">24</td>
        <td class="mdc-data-table__cell mdc-data-table__cell--numeric">6.0</td>
        <td class="mdc-data-table__cell">New filing flavor</td>
      </tr>
    </tbody>
  </table>
</div>
```
## Variants

### Data table with row selection

```html
<div class="mdc-data-table">
  <table class="mdc-data-table__table">
    <thead>
      <tr class="mdc-data-table__header-row">
        <th class="mdc-data-table__header-cell" scope="col">
          <div class="mdc-checkbox">
            <input type="checkbox" class="mdc-checkbox__native-control" />
            <div class="mdc-checkbox__background">
              <svg class="mdc-checkbox__checkmark" viewbox="0 0 24 24">
                <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
              </svg>
              <div class="mdc-checkbox__mixedmark"></div>
            </div>
          </div>
        </th>
        <th class="mdc-data-table__header-cell" scope="col">Status</th>
        <th class="mdc-data-table__header-cell" scope="col">Signal name</th>
        <th class="mdc-data-table__header-cell" scope="col">Severity</th>
      </tr>
    </thead>
    <tbody class="mdc-data-table__content">
      <tr class="mdc-data-table__row">
        <td class="mdc-data-table__cell">
          <div class="mdc-checkbox">
            <input type="checkbox" class="mdc-checkbox__native-control" />
            <div class="mdc-checkbox__background">
              <svg class="mdc-checkbox__checkmark" viewbox="0 0 24 24">
                <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
              </svg>
              <div class="mdc-checkbox__mixedmark"></div>
            </div>
          </div>
        </td>
        <td class="mdc-data-table__cell">Online</td>
        <td class="mdc-data-table__cell">Arcus watch slowdown</td>
        <td class="mdc-data-table__cell">Medium</td>
      </tr>
      <tr class="mdc-data-table__row mdc-data-table__row--selected" aria-selected="true">
        <td class="mdc-data-table__cell">
          <div class="mdc-checkbox">
            <input type="checkbox" class="mdc-checkbox__native-control" checked />
            <div class="mdc-checkbox__background">
              <svg class="mdc-checkbox__checkmark" viewbox="0 0 24 24">
                <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
              </svg>
              <div class="mdc-checkbox__mixedmark"></div>
            </div>
          </div>
        </td>
        <td class="mdc-data-table__cell">Offline</td>
        <td class="mdc-data-table__cell">monarch: prod shared ares-managed-features-provider-heavy</td>
        <td class="mdc-data-table__cell">Huge</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-data-table` | Mandatory. The root DOM element containing `table` and other supporting elements.
`mdc-data-table__table` | Mandatory. Table element. Added to `table` HTML tag.
`mdc-data-table__header-row` | Mandatory. Table header row element. Added to `thead > tr` HTML tag.
`mdc-data-table__header-cell` | Mandatory. Table header cell element. Added to `thead > th > td` HTML tag.
`mdc-data-table__content` | Mandatory. Table body element. Added to `tbody` HTML tag.
`mdc-data-table__row` | Mandatory. Table row element. Added to `tbody > tr` HTML tag.
`mdc-data-table__cell` | Mandatory. Table cell element. Added to `tbody > tr > td` HTML tag.
`mdc-data-table__cell--numeric` | Optional. Table cell element that contains numeric data. Added to `tbody > tr > td` HTML tag.
`mdc-data-table__row-checkbox` | Optional. Checkbox element rendered inside table row element. Add this class name to `mdc-checkbox` element to override styles required for data-table.
`mdc-data-table__row--selected` | Optional. Modifier class added to `mdc-data-table__row` when table row is selected.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-data-table-fill-color($color)` | Sets the background color of data-table surface.
`mdc-data-table-row-fill-color($color)` | Sets the background color of table row container.
`mdc-data-table-header-row-fill-color($color)` | Sets the background color of table header row container.
`mdc-data-table-selected-row-fill-color($color)` | Sets the background color of selected row container.
`mdc-data-table-checked-icon-color($color)` | Sets the checked icon color.
`mdc-data-table-divider-color($color)` | Sets the table rows divider color.
`mdc-data-table-divider-size($size)` | Sets the table rows divider size.
`mdc-data-table-row-hover-fill-color($color)` | Sets the background color of table row on hover.
`mdc-data-table-header-row-text-color($color)` | Sets the header row text color.
`mdc-data-table-row-text-color($color)` | Sets the row text color.
`mdc-data-table-shape-radius($radius)` | Sets the rounded shape with given radius size. `$radius` can be single radius or list radius values up to 4 list size.
`mdc-data-table-stroke-size($size)` | Sets the border size of data-table.
`mdc-data-table-stroke-color($color)` | Sets the border color of data-table.
`mdc-data-table-header-row-height($height)` | Sets the header row height.
`mdc-data-table-row-height($height)` | Sets row height.
`mdc-data-table-cell-padding($leading-padding, $trailing-padding)` | Sets leading & trailing padding for all cells.
`mdc-data-table-column-widths($width-list)` | Sets the custom widths for each table column.

## Accessibility

Please refer [WAI-ARIA Authoring Practices for table](https://www.w3.org/TR/wai-aria-practices-1.1/#table) for ARIA recommended role, states & properties required for table element.
