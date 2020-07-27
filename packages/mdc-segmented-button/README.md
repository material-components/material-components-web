# Segmented Buttons

[Segmented buttons](https://material.io/components/buttons#toggle-button) allow users to toggle the selected states of grouped buttons.

## Using segmented buttons

## Installation

```
npm install @material/segmented-button
```

## Basic Usage

### HTML Structure

```html
<div class="mdc-segmented-button" role="group">
  <button class="mdc-segmented-button__segment" aria-pressed="false">
      <i class="material-icons mdc-segmented-button__icon">favorite</i>
  </button>
  <button class="mdc-segmented-button__segment" aria-pressed="false">
      <div class="mdc-segmented-button__label">Sample Text</div>
  </button>
  <button class="mdc-segmented-button__segment" aria-pressed="false">
      <i class="material-icons mdc-segmented-button__icon">favorite</i>
      <div class="mdc-segmented-button__label">Sample Text</div>
  </button>
</div>
```

### Styles

```scss
@use "@material/segmented-button/segmented-button";
@use "@material/segmented-button/segment";

@include segmented-button.core-styles();
@include segment.core-styles();
```

### JavaScript Instantiation

```js
import {MDCSegmentedButton} from '@material/segmented-button';
const segmentedButtonEl = document.querySelector('.mdc-segmented-button');
const segmentedButton = new MDCSegmentedButton(segmentedButtonEl);
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

The `MDCSegmentedButton` component automatically instantiates the child `MDCSegmentedButtonSegment` components.

### Icons

We recommend using [Material Icons](https://material.io/tools/icons/) from Google Fonts:

```html
<head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
</head>
```

However, you can also use SVG, [FontAwesome](https://fontawesome.com/), or any other icon library you wish.

## Segmented Button

### Multi select

By default, the segmented button allows any number of segments to be selected at a time so that each segment is independent from the rest.

For accessibility, the segments are treated as toggle buttons. The segmented button is assigned `role="group"` and each segment has the attribute `aria-pressed` with a boolean value corresponding to its selected state.

```html
<div class="mdc-segmented-button" role="group">
  <button class="mdc-segmented-button__segment" aria-pressed="false">
      <i class="material-icons mdc-segmented-button__icon">favorite</i>
  </button>
  <button class="mdc-segmented-button__segment" aria-pressed="false">
      <div class="mdc-segmented-button__label">Sample Text</div>
  </button>
  <button class="mdc-segmented-button__segment" aria-pressed="false">
      <i class="material-icons mdc-segmented-button__icon">favorite</i>
      <div class="mdc-segmented-button__label">Sample Text</div>
  </button>
</div>
```

### Single select

The segmented button can be limited to select only one segment at a time. In this case, the selected segment cannot be unselected with a click. Selecting a different segment will unselect the previously selected segment. To make the segmented button single select, add the class `mdc-segmented-button--single-select`.

For accessibility, the segments are treated as radio buttons. The segmented button is assigned `role="radiogroup"` and each segment is assigned `role="radio"` and has the attribute `aria-checked` with a boolean value corresponding to its selected state.

```html
<div class="mdc-segmented-button mdc-segmented-button--single-select" role="radiogroup">
  <button class="mdc-segmented-button__segment" role="radio" aria-checked="false">
      <i class="material-icons mdc-segmented-button__icon">favorite</i>
  </button>
  <button class="mdc-segmented-button__segment" role="radio" aria-checked="false">
      <div class="mdc-segmented-button__label">Sample Text</div>
  </button>
  <button class="mdc-segmented-button__segment" role="radio" aria-checked="false">
      <i class="material-icons mdc-segmented-button__icon">favorite</i>
      <div class="mdc-segmented-button__label">Sample Text</div>
  </button>
</div>
```

## Segment

The segment is assumed to be a child of a segmented button. The segment can be in a selected or unselected state and changes state if the button is clicked or if the segmented button tells it to change its state. If the parent segmented button is single select and the segment is selected, the segment will not become unselected if it is clicked.

The segment can contain an icon, text, or both. If both an icon and text are used, the icon is assumed to come first (unless the page is loaded as rtl). Ripple effects and touch support can also be added.

### Segment with text

To insert text inside of a segment, add the class `mdc-segmented-button__label`.

```html
<button class="mdc-segmented-button__segment">
  <div class="mdc-segmented-button__label">Sample Text</div>
</button>
```

### Segment with an icon

To insert an icon inside of a segment, add the class `mdc-segmented-button__icon`.

```html
<button class="mdc-segmented-button__segment">
  <i class="material-icons mdc-segmented-button__icon">favorite</i>
</button>
```

### Selected segment

The segment will remain in a visually toggled state while selected. To select the segment by default, add the class `mdc-segmented-button__segment--selected` and set the attribute `aria-pressed` or `aria-checked` (if the segmented button is multi or single select, respectively) to `true`.

```html
<button class="mdc-segmented-button__segment mdc-segmented-button__segment--selected" aria-pressed="true">
  <div class="mdc-segmented-button__label">Sample Text</div>
</button>
```

## Additional Information

### Touch accessibility

`//TODO: update this section if incorrect`

Material Design spec advises that touch targets should be at least 48 x 48 px. To meet this requirement, add the following to your segments:

```html
<div class="mdc-touch-target-wrapper">
  <button class="mdc-segmented-button__segment mdc-segmented-button--touch">
    <div class="mdc-segmented-button__label">Sample Text</div>
    <div class="mdc-segmented-button__touch">
  </button>
</div>
```

### Ripple

To include ripple effects when a segment is clicked, add the following to the segment:

```html
<button class="mdc-segmented-button__segment">
  <div class="mdc-segmented-button__ripple"></div>
  <div class="mdc-segmented-button__label">Sample Text</div>
</button>
```

### Keyboard navigation

Each segment within the segmented button is a tabbable element. Arrow key navigation between segments is not supported at this time.

## `//TODO: add API documentation`