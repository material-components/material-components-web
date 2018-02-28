<!--docs:
title: "Select Label"
layout: detail
section: components
iconId: menu
path: /catalog/input-controls/select-menus/label/
-->

# Select Label

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/select.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/selects.png" width="376" alt="Select screenshot">
  </a>
</div>-->

Select labels display the type of input a field requires. Every select should have a label. Labels are aligned with the input line and always visible. They can be resting (when a select is inactive and empty) or floating. The label is a text caption or description for the select.

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
<div class="mdc-select__label" for="my-select-id">Hint text</div>
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
`mdc-select__label` | Mandatory
`mdc-select__label--float-above` | Indicates the label is floating above the select

### `MDCSelectLabel`

Method Signature | Description
--- | ---
`float(value: string)` | Styles the label to float or defloat as necessary.

### `MDCSelectLabelAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the label element.
`removeClass(className: string) => void` | Removes a class from the label element.

### `MDCSelectLabelFoundation`

Method Signature | Description
--- | ---
`styleFloat(value: string)` | Adds or removes the float-above selector to the label element.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-select-floating-label-color($color)` | Customizes the color of the label element.
