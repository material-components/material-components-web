<!--docs:
title: "Dividers"
layout: detail
section: components
excerpt: "Material Design-styled dividers."
iconId: button
path: /catalog/dividers/
-->

# Dividers

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components.github.io/material-components-web-catalog/#/component/dividers">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/dividers.png" width="363" alt="Dividers screenshot">
  </a>
</div>-->

A divider is a thin line that groups content in lists and layouts.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-dividers">Material Design guidelines: Dividers</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/divider">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/divider
```

## Basic Usage

### HTML Structure

```html
<hr class="mdc-divider">
```

### Styles

```scss
@import "@material/divider/mdc-divider";
```

### Sass Mixins

To customize a divider's line color, you can use the following mixins.

#### Basic Sass Mixins

MDC Divider uses `rgba(0, 0, 0, 0.117)` as the default color. Use the following mixins to customize it.

Mixin | Description
--- | ---
`mdc-divider-line-color($container-fill-color)` | Sets the color of the divider line
