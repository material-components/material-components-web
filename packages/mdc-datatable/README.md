<!--docs:
title: "Datatables"
layout: detail
section: components
excerpt: "Datatables."
iconId: datatable
path: /catalog/datatables/
-->

# Datatable

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components.github.io/material-components-web-catalog/#/component/datatable">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/datatables.png" width="714" alt="Datatable screenshot">
  </a>
</div>-->

Data tables display sets of data.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-datatables">Material Design guidelines: Datatables</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/datatable">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/datatable
```

### Styles

```scss
@import "@material/datatable/mdc-datatable";
```

> *NOTE*: Styles for any components you intend to include within datatable (e.g. Checkboxes, etc.) must also be
> imported.

## Basic Usage

### HTML Structure

```html
<div class="mdc-datatable">
  <table class="mdc-datatable__table">
    <thead>
      <tr class="mdc-datatable__header-row">
        <th class="mdc-datatable__header-cell" scope="col">Carbs (g)</th>
        <th class="mdc-datatable__header-cell" scope="col">Protein (g)</th>
        <th class="mdc-datatable__header-cell" scope="col">Comments</th>
      </tr>
    </thead>
    <tbody class="mdc-datatable__content">
      <tr class="mdc-datatable__row">
        <td class="mdc-datatable__cell-numeric">24</td>
        <td class="mdc-datatable__cell-numeric">4.0</td>
        <td class="mdc-datatable__cell">Super tasty</td>
      </tr>
      <tr class="mdc-datatable__row">
        <td class="mdc-datatable__cell-numeric">37</td>
        <td class="mdc-datatable__cell-numeric">4.3</td>
        <td class="mdc-datatable__cell">I like ice cream more</td>
      </tr>
      <tr class="mdc-datatable__row">
        <td class="mdc-datatable__cell-numeric">24</td>
        <td class="mdc-datatable__cell-numeric">6.0</td>
        <td class="mdc-datatable__cell">New filing flavor</td>
      </tr>
    </tbody>
  </table>
</div>
```
## Variants

### Datatable with row selection

```html
<div class="mdc-datatable">
  <table class="mdc-datatable__table">
    <thead>
      <tr class="mdc-datatable__header-row">
        <th class="mdc-datatable__header-cell" scope="col">
          <div class="mdc-checkbox mdc-datatable__checkbox">
            <input type="checkbox" class="mdc-checkbox__native-control" />
            <div class="mdc-checkbox__background">
              <svg class="mdc-checkbox__checkmark" viewbox="0 0 24 24">
                <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
              </svg>
              <div class="mdc-checkbox__mixedmark"></div>
            </div>
          </div>
        </th>
        <th class="mdc-datatable__header-cell" scope="col">Status</th>
        <th class="mdc-datatable__header-cell" scope="col">Signal name</th>
        <th class="mdc-datatable__header-cell" scope="col">Severity</th>
      </tr>
    </thead>
    <tbody class="mdc-datatable__content">
      <tr class="mdc-datatable__row">
        <td class="mdc-datatable__cell">
          <div class="mdc-checkbox mdc-datatable__checkbox">
            <input type="checkbox" class="mdc-checkbox__native-control" />
            <div class="mdc-checkbox__background">
              <svg class="mdc-checkbox__checkmark" viewbox="0 0 24 24">
                <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
              </svg>
              <div class="mdc-checkbox__mixedmark"></div>
            </div>
          </div>
        </td>
        <td class="mdc-datatable__cell">Online</td>
        <td class="mdc-datatable__cell">Arcus watch slowdown</td>
        <td class="mdc-datatable__cell">Medium</td>
      </tr>
      <tr class="mdc-datatable__row mdc-datatable__row--selected" aria-selected="true">
        <td class="mdc-datatable__cell">
          <div class="mdc-checkbox mdc-datatable__checkbox">
            <input type="checkbox" class="mdc-checkbox__native-control" checked />
            <div class="mdc-checkbox__background">
              <svg class="mdc-checkbox__checkmark" viewbox="0 0 24 24">
                <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
              </svg>
              <div class="mdc-checkbox__mixedmark"></div>
            </div>
          </div>
        </td>
        <td class="mdc-datatable__cell">Offline</td>
        <td class="mdc-datatable__cell">monarch: prod shared ares-managed-features-provider-heavy</td>
        <td class="mdc-datatable__cell">Huge</td>
      </tr>
    </tbody>
  </table>
</div>
```

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-datatable` | Mandatory. The root DOM element containing `table` and other supporting elements.
`mdc-datatable__table` | Mandatory. Table element. Added to `table` HTML tag.
`mdc-datatable__header-row` | Mandatory. Table header row element. Added to `thead > tr` HTML tag.
`mdc-datatable__header-cell` | Mandatory. Table header cell element. Added to `thead > th > td` HTML tag.
`mdc-datatable__content` | Mandatory. Table body element. Added to `tbody` HTML tag.
`mdc-datatable__row` | Mandatory. Table row element. Added to `tbody > tr` HTML tag.
`mdc-datatable__cell` | Mandatory. Table cell element. Added to `tbody > tr > td` HTML tag.
`mdc-datatable__cell-numeric` | Optional. Table cell element that contains numeric data. Added to `tbody > tr > td` HTML tag.
`mdc-datatable__checkbox` | Optional. Checkbox element rendered inside table row element. Add this class name to `mdc-checkbox` element to override styles required for datatable.
`mdc-datatable__row--selected` | Optional. Modifier class added to `mdc-datatable__row` when table row is selected.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-datatable-fill-color($color)` | Sets the background color of datatable surface.
`mdc-datatable-row-fill-color($color)` | Sets the background color of table row container.
`mdc-datatable-header-row-fill-color($color)` | Sets the background color of table header row container.
`mdc-datatable-selected-row-fill-color($color)` | Sets the background color of selected row container.
`mdc-datatable-checked-icon-color($color)` | Sets the checked icon color.
`mdc-datatable-divider-color($color)` | Sets the table rows divider color.
`mdc-datatable-divider-size($size)` | Sets the table rows divider size.
`mdc-datatable-row-hover-fill-color($color)` | Sets the background color of table row on hover.
`mdc-datatable-header-row-text-color($color)` | Sets the header row text color.
`mdc-datatable-row-text-color($color)` | Sets the row text color.
`mdc-datatable-shape-radius($radius)` | Sets the rounded shape with given radius size. `$radius` can be single radius or list radius values up to 4 list size.
`mdc-datatable-stroke-size($size)` | Sets the border size of datatable.
`mdc-datatable-stroke-color($color)` | Sets the border color of datatable.
`mdc-datatable-header-row-height($height)` | Sets the header row height.
`mdc-datatable-row-height($height)` | Sets row height.
`mdc-datatable-cell-padding($leading-padding, $trailing-padding)` | Sets leading & trailing padding for all cells.
`mdc-datatable-column-widths($width-list)` | Sets the custom widths for each table column.

## Accessibility

Please refer [WAI-ARIA Authoring Practices for table](https://www.w3.org/TR/wai-aria-practices-1.1/#table) for ARIA recommended role, states & properties required for table element.
