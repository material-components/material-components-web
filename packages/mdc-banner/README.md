<!--docs:
title: "Banner"
layout: detail
section: components
excerpt: "Material Design-styled banner."
iconId: banner
path: /catalog/banner/
-->

# Banner

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components.github.io/material-components-web-catalog/#/component/elevation">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/elevation.png" width="247" alt="Elevation screenshot">
  </a>
</div>-->

A banner displays a prominent message and related optional actions.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-banner">Material Design guidelines: Banner</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/banner
```

## Basic Usage

### HTML

```html
  <div class="mdc-banner>
      <div class="mdc-banner__content">
        <svg class="mdc-banner__icon">
          ...
        </svg>
        <div class="mdc-typography--body2">
          Banner message.
        </div>
      </div>
      <div class="mdc-banner__actions">
        <button type="button" class="mdc-button mdc-banner__button">
          retry
        </button>
      </div>
  </div>
```

### Styles

```scss
@import "@material/banner/mdc-banner";
```
