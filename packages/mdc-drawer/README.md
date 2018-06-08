<!--docs:
title: "Drawers"
layout: detail
section: components
excerpt: "Permanent, persistent, and temporary drawers."
iconId: side_navigation
path: /catalog/drawers/
-->

# Drawers

The MDC Navigation Drawer is used to organize access to destinations and other functionality on an app.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/design/components/navigation-drawer.html">Material Design guidelines: Navigation drawer</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/drawer">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/drawer
```

## Basic Usage

### HTML Structure

```html
<nav class="mdc-drawer">
  <div class="mdc-drawer__scrollable">
    <nav class="mdc-list">
      <a class="mdc-list-item mdc-list-item--selected" href='#'>
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>Inbox
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">send</i>Outgoing
      </a>
      <a class="mdc-list-item" href="#">
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">drafts</i>Drafts
      </a>
    </nav>
  </div>
</header>
```

### Styles

```scss
@import "@material/drawer/mdc-drawer";
```


## Variants

### Drawers with separate list groups

If you need multiple list groups within the drawer please see the [list readme](https://github.com/material-components/material-components-web/tree/master/packages/mdc-list#list-groups) for detailed use and instruction.

### Drawers with Header

Drawers can contain a header element which will not scroll with the rest of the drawer content. Things like account switchers and titles should live in the header element.

```html
<nav class="mdc-drawer">
  <div class="mdc-drawer__header">
    <h3 class="mdc-drawer__title">Mail</h3>
    <h6 class="mdc-drawer__subtitle">email@material.io</h6>
  </div>
  <div class="mdc-drawer__scrollable">
    <nav class="mdc-list">
      <a class="mdc-list-item mdc-list-item--selected" href='#'>
        <i class="material-icons mdc-list-item__graphic" aria-hidden="true">inbox</i>Inbox
      </a>
    </nav>
  </div>
</header>
```

## Style Customization

### CSS Classes

Class | Description
--- | ---
`mdc-drawer` |  Mandatory.
`mdc-drawer__header` | Non-scrollable element that exists on the top of the drawer.
`mdc-drawer__title` | Title text element of the drawer.
`mdc-drawer__subtitle` | Subtitle text element of the drawer.
`mdc-drawer__scrollable` | Scrollable content area of the drawer.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-drawer-border-color($color, $opacity)` | Sets border color of `mdc-drawer` surface.
`mdc-drawer-surface-fill-color($color, $opacity)` | Sets the background color of `mdc-drawer`.
`mdc-drawer-active-overlay-color($color)` | Sets the overlay color of the activated drawer list item.
`mdc-drawer-title-ink-color($color, $opacity)` | Sets the ink color of `mdc-drawer__title`.
`mdc-drawer-item-corner-radius($radius)` | Sets the corner border radius of the drawer list item.
`mdc-drawer-item-text-color($color, $opacity)` | Sets drawer list item ink color.
`mdc-drawer-item-activated-text-color($color, $opacity)` | Sets activated drawer list item ink color.
`mdc-drawer-icon-fill-color($color, $opacity)` | Sets drawer list item graphic icon background color.
`mdc-drawer-icon-ink-color($color, $opacity)` | Sets drawer list item graphic icon ink color.
`mdc-drawer-meta-ink-color($color, $opacity)` | Sets drawer list item meta icon ink color.
`mdc-drawer-divider-color($color, $opacity)` | Sets divider color found between list groups.
`mdc-drawer-group-header-text-color` | Sets drawer list subheader and drawer subtitle ink color.
