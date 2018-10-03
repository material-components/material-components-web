<!--docs:
title: "Cards"
layout: detail
section: components
excerpt: "Cards for displaying content composed of different elements."
iconId: card
path: /catalog/cards/
-->

# Cards

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components.github.io/material-components-web-catalog/#/component/card">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/cards.png" width="328" alt="Cards screenshot">
  </a>
</div>-->

MDC Card is a component that implements the
[Material Design card component](https://material.io/go/design-cards), and makes it available to
developers as a set of CSS classes.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-cards">Material Design guidelines: Cards</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/card">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/card
```

## Usage

### HTML Structure

```html
<div class="mdc-card">
  Simple
</div>
```

Fully-featured:

```html
<div class="mdc-card">
  <div class="mdc-card__media mdc-card__media--square">
    <div class="mdc-card__media-content">Title</div>
  </div>
  <!-- ... content ... -->
  <div class="mdc-card__actions">
    <div class="mdc-card__action-buttons">
      <button class="mdc-button mdc-card__action mdc-card__action--button">Action 1</button>
      <button class="mdc-button mdc-card__action mdc-card__action--button">Action 2</button>
    </div>
    <div class="mdc-card__action-icons">
      <button class="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon" title="Share">share</button>
      <button class="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon" title="More options">more_vert</button>
    </div>
  </div>
</div>
```

Cards don't come with a predefined width, height, padding, or margin. In its simplest form (just a single element with
`mdc-card`), a card is basically just `mdc-elevation` + `border-radius`.

Cards expand horizontally to fill all available space, and vertically to fit their contents.

If you'd like to maintain a consistent width and height across cards, you'll need to set it in your styles:

```css
.my-card {
  height: 350px;
  width: 350px;
}
```

#### Icons

We recommend using [Material Icons](https://material.io/tools/icons/) from Google Fonts:

```html
<head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
```

However, you can also use SVG, [Font Awesome](https://fontawesome.com/), or any other icon library you wish.

#### Content blocks

Cards are composed of different content blocks, which are typically laid out vertically.

Because every app is different, there are no "standard" layouts for card content; each app should define their own.

However, MDC Card _does_ provide styles for two common card elements: _rich media_ (images or video) and _actions_.

##### Rich media

```css
.my-card__media {
  background-image: url("pretty.jpg");
}
```

```html
<div class="my-card__media mdc-card__media mdc-card__media--16-9">
  <div class="mdc-card__media-content">Title</div>
</div>
```

This area is used for showing rich media in cards, and optionally as a container. Use the `mdc-card__media` CSS class
and the [optional modifier classes](#css-classes).

##### Actions

```html
<div class="mdc-card__actions">
  <button class="mdc-button mdc-card__action mdc-card__action--button">Action 1</button>
  <button class="mdc-button mdc-card__action mdc-card__action--button">Action 2</button>
</div>
```

This area is used for showing different actions the user can take. It's typically used with buttons, as in the example
above, or with icon buttons, as below:

```html
<div class="mdc-card__actions">
  <button class="mdc-icon-button mdc-card__action mdc-card__action--icon"
     aria-pressed="false"
     aria-label="Add to favorites"
     title="Add to favorites">
   <i class="material-icons mdc-icon-button__icon mdc-icon-button__icon--on">favorite</i>
   <i class="material-icons mdc-icon-button__icon">favorite_border</i>
  </button>
  <button class="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon" title="Share">share</button>
  <button class="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon" title="More options">more_vert</button>
</div>
```

Be sure to include the `mdc-card__action` class on every action for correct positioning. In addition, _button_ icons
should use the `mdc-card__action--button` class, and _icon_ actions should use the `mdc-card__action--icon` class.

To have a single action button take up the entire width of the action row, use the `--full-bleed` modifier on the row:

```html
<div class="mdc-card__actions mdc-card__actions--full-bleed">
  <a class="mdc-button mdc-card__action mdc-card__action--button" href="#">
    All Business Headlines
    <i class="material-icons" aria-hidden="true">arrow_forward</i>
  </a>
</div>
```

To display buttons _and_ icons in the same row, wrap them in `mdc-card__action-buttons` and `mdc-card__action-icons`
elements:

```html
<div class="mdc-card__actions">
  <div class="mdc-card__action-buttons">
    <button class="mdc-button mdc-card__action mdc-card__action--button">Read</button>
    <button class="mdc-button mdc-card__action mdc-card__action--button">Bookmark</button>
  </div>
  <div class="mdc-card__action-icons">
   <button class="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon" title="Share">share</button>
    <button class="material-icons mdc-icon-button mdc-card__action mdc-card__action--icon" title="More options">more_vert</button>
  </div>
</div>
```

### Styles
```css
@import "@material/card/mdc-card";
```

### CSS Classes

CSS Class | Description
--- | ---
`mdc-card` | Mandatory. The main card element.
`mdc-card--outlined` | Optional. Removes the shadow and displays a hairline outline instead.
`mdc-card__primary-action` | Optional. The main tappable area of the card. Typically contains most (or all) card content _except_ `mdc-card__actions`. Only applicable to cards that have a primary action that the main surface should trigger.
`mdc-card__media` | Optional. Media area that displays a custom `background-image` with `background-size: cover`.
`mdc-card__media--square` | Optional. Automatically scales the media area's height to equal its width.
`mdc-card__media--16-9` | Optional. Automatically scales the media area's height according to its width, maintaining a 16:9 aspect ratio.
`mdc-card__media-content` | Optional. An absolutely-positioned box the same size as the media area, for displaying a title or icon on top of the `background-image`.
`mdc-card__actions` | Optional. Row containing action buttons and/or icons.
`mdc-card__actions--full-bleed` | Optional. Removes the action area's padding and causes its only child (an `mdc-card__action` element) to consume 100% of the action area's width.
`mdc-card__action-buttons` | Optional. A group of action buttons, displayed on the left side of the card (in LTR), adjacent to `mdc-card__action-icons`.
`mdc-card__action-icons` | Optional. A group of supplemental action icons, displayed on the right side of the card (in LTR), adjacent to `__action-buttons`.
`mdc-card__action` | Optional. An individual action button or icon.
`mdc-card__action--button` | Optional. An action button with text.
`mdc-card__action--icon` | Optional. An action icon with no text. We recommend using [Material Icons](https://material.io/tools/icons/) from Google Fonts.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-card-fill-color($color)` | Sets the fill color of a card.
`mdc-card-outline($color, $thickness)` | Sets the color and thickness of a card's outline (but does _not_ remove its shadow).
`mdc-card-shape-radius($radius, $rtl-reflexive)` | Sets the rounded shape to card with given radius size. Set `$rtl-reflexive` to true to flip radius values in RTL context, defaults to false.
`mdc-card-media-aspect-ratio($x, $y)` | Maintains the given aspect ratio on a `mdc-card__media` subelement by dynamically scaling its height relative to its width.
