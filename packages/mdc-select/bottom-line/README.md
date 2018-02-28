<!--docs:
title: "Select Bottom Line"
layout: detail
section: components
iconId: menu
path: /catalog/input-controls/select-menus/bottom-line/
-->

# Select Bottom Line

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/select.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/selects.png" width="376" alt="Select screenshot">
  </a>
</div>-->

Select bottom line animates activation and deactivation state as the select receives focus and blurs. Every select should have a bottom line.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/text-fields.html">Material Design guidelines: Text Fields</a>
  </li>
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/menus.html">Material Design guidelines: Menus</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/select.html">Demo</a>
  </li>
</ul>

## Usage

### HTML Structure

```html
<div class="mdc-select__bottom-line"></div>
```

### Usage within `mdc-select`

```html
<div class="mdc-select" role="listbox">
  <div class="mdc-select__surface" tabindex="0">
    <div class="mdc-select__label">Pick a Food Group</div>
    <div class="mdc-select__selected-text"></div>
    <div class="mdc-select__bottom-line"></div>
  </div>
  <div class="mdc-menu mdc-select__menu">
    <ul class="mdc-list mdc-menu__items">
      <li class="mdc-list-item" role="option" tabindex="0">
        Dairy
      </li>
      <li class="mdc-list-item" role="option" tabindex="0">
        Vegetables
      </li>
      <li class="mdc-list-item" role="option" tabindex="0">
        Fruit
      </li>
    </ul>
  </div>
</div>
```

### CSS Classes

CSS Class | Description
--- | ---
`mdc-select__bottom-line` | Mandatory.
`mdc-select__bottom-line--active` | Indicates the bottom line is active and the select is in focus.

### `MDCSelectBottomLine`

Method Signature | Description
--- | ---
`activate()` | Proxies to the foundation's `activate()` method.
`deactivate()` | Proxies to the foundation's `deactivate()` method.

### `MDCSelectBottomLineAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the bottom line element.
`removeClass(className: string) => void` | Removes a class from the bottom line element.

### `MDCSelectBottomLineFoundation`

Method Signature | Description
--- | ---
`activate()` | Activates the bottom line.
`deactivate()` | Deactivates the bottom line.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-select-bottom-line-fill-color($color)` | Customizes the color of the background color.
