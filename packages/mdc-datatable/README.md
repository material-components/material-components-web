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
        <td class="mdc-datatable__cell">24</td>
        <td class="mdc-datatable__cell">4.0</td>
        <td class="mdc-datatable__cell">Super tasty</td>
      </tr>
      <tr class="mdc-datatable__row">
        <td class="mdc-datatable__cell">37</td>
        <td class="mdc-datatable__cell">4.3</td>
        <td class="mdc-datatable__cell">I like ice cream more</td>
      </tr>
      <tr class="mdc-datatable__row">
        <td class="mdc-datatable__cell">24</td>
        <td class="mdc-datatable__cell">6.0</td>
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
`mdc-datatable` | Mandatory. The root DOM element containing the surface and table content.
