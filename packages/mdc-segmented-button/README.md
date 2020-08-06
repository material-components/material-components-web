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
@use '@material/ripple/common';
@use '@material/segmented-button/styles';
```

### JavaScript Instantiation

```js
import {MDCSegmentedButton} from '@material/segmented-button';
const segmentedButtonEl = document.querySelector('.mdc-segmented-button');
const segmentedButton = new MDCSegmentedButton(segmentedButtonEl);
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

The MDC Segmented Button component automatically instantiates the child MDC Segmented Button Segment components.

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

To include ripple effects when a segment is clicked add the following classes to the segment:

```html
<button class="mdc-segmented-button__segment">
  <div class="mdc-segmented-button__ripple"></div>
  <div class="mdc-segmented-button__label">Sample Text</div>
</button>
```

### Keyboard navigation

Each segment within the segmented button is a tabbable element. Arrow key navigation between segments is not supported at this time.

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-segmented-button` | Mandatory. Indicates the wrapper for child segments.
`mdc-segmented-button__single-select` | Optional. Indicates the segmented button only allows one segment to be selected at a time.
`mdc-segmented-button__segment` | Mandatory. Indicates a button element that can be selected.
`mdc-segmented-button__icon` | Optional. Indicates an icon in the segment. We recommend using [Material Icons](https://material.io/tools/icons/) from Google Fonts.
`mdc-segmented-button__label` | Optional. Indicates text in the segment.
`mdc-segmented-button__segment--selected` | Optional. Indicates that the segment is selected.
`mdc-touch-target-wrapper` | Optional. Indicates contained segment has touch target support.
`mdc-segmented-button--touch` | Optional. Indicates the segment has touch target support.
`mdc-segmented-button__touch` | Optional. Indicates the segment has touch target support.
`mdc-segmented-button__ripple` | Optional. Indicates the segment has a ripple effect when clicked.

> _NOTE_: Every segment element must contain an icon with class `mdc-segmented-button__icon`, text with class `mdc-segmented-button__label`, or both.

> _NOTE_: While `mdc-touch-target-wrapper`, `mdc-segmented-button--touch`, and `mdc-segmented-button__touch` are optional, if one is used then all three must be used.

### Sass Mixins

Mixin | Description
--- | ---
`outline-color` | Customizes the border color around each segment.
`unselected-ink-color` | Customizes the text and icon ink color for an unselected segment.
`unselected-container-fill-color` | Customizes the background color for an unselected segment.
`selected-ink-color` | Customizes the text and icon ink color for a selected segment.
`selected-container-fill-color` | Customizes the background color for an selected segment.

## `MDCSegmentedButton`, `MDCSegmentedButtonSegment`, and `SegmentDetail` Properties and Methods

The MDC Segmented Button package is composed of two JavaScript classes:

* `MDCSegmentedButton` defines the behavior of a set of segments.
* `MDCSegmentedButtonSegment` defines the behavior of a single segment.

To use the `MDCSegmentedButton` and `MDCSegmentedButtonSegment` classes, [import](../../docs/importing-js.md) both from `@material/segmented-button`.

### `SegmentDetail`

The `SegmentDetail` type contains only the actionable information about a specific `MDCSegmentedButtonSegment`.

Property | Value Type | Description
--- | --- | ---
`index` | `number` | The index of the segment.
`selected` | `boolean` | The segment's selected state.
`segmentId?` | `string | undefined` | The segment's segmentId, if provided.

### `MDCSegmentedButton`

Method Signature | Description
--- | ---
`getSelectedSegments() => readonly SegmentDetail[]` | Proxies to foundation's `getSelectedSegments` method.
`selectSegment(indexOrSegmentId: number | string) => void` | Proxies to foundation's `selectSegment` method.
`unselectSegment(indexOrSegmentId: number | string) => void` | Proxies to foundation's `unselectSegment` method.
`isSegmentSelected(indexOrSegmentId: number | string) => boolean` | Proxies to foundation's `isSegmentSelected` method.

Property | Value Type | Description
--- | --- | ---
`segments` | `ReadOnlyArray<MDCSegmentedButtonSegment>` | Array of child `MDCSegmentedButtonSegment`s.
`ripple` | `MDCRipple` (read-only) | The `MDCRipple` instance for the root element that `MDCSegmentedButton` initializes.

#### Events

Event Name | `event.detail` | Description
--- | --- | ---
MDCSegmentedButton:change | `SegmentDetail` | Indicates that a segment's selected value may have changed due to a click.

### `MDCSegmentedButtonSegment`

Method Signature | Description
--- | ---
`setIndex(index: number) => void` | Sets segment's index.
`setIsSingleSelect(isSingleSelect: boolean) => void` | Sets segment's isSingleSelect.
`isSelected() => boolean` | Proxies to foundation's `isSelected` method.
`setSelected() => void` | Proxies to foundation's `setSelected` method.
`setUnselected() => void` | Proxies to foundation's `setUnselected` method.
`getSegmentId() => string | undefined` | Proxies to foundation's `getSegmentId` method.

#### Events

Event Name | `event.detail` | Description
--- | --- | ---
`MDCSegmentedButtonSegment:selected` | `SegmentDetail` | Indicates the segment's selected status just changed due to a click.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create Segmented Buttons for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### Adapters: `MDCSegmentedButtonAdapter` and `MDCSegmentedButtonSegmentAdapter`

See [`segmented-button/component.ts`](segmented-button/component.ts) and [`segment/component.ts`](segment/component.ts) for vanilla DOM implementations of these adapter APIs for reference.

#### `MDCSegmentedButtonAdapter`

Method Signature | Description
--- | ---
`hasClass(className: string) => boolean` | Returns true if segmented button has className, otherwise returns false.
`getSegments() => readonly SegmentDetail[]` | Returns child segments represented as a readonly list of SegmentDetails.
`selectSegment(indexOrSegmentId: number | string) => void` | Sets identified segment to be selected.
`unselectSegment(indexOrSegmentId: number | string) => void` | Set identified segment to be not selected.
`notifySelectedChange(detail: SegmentDetail) => void` | Notifies the client about the changed segment with a `change` event.

>_NOTE_: `notifySelectedChange` must pass along a `SegmentDetail` representing the potentially changed Segment, and must be observable by the client (e.g. via DOM event bubbling).

#### `MDCSegmentedButtonSegmentAdapter`

Method Signature | Description
--- | ---
`isSingleSelect() => boolean` | Returns true if wrapping segmented button is single select, otherwise returns false.
`getAttr(attrName: string) => string | null` | Returns root element's attribute if it is set, otherwise returns null.
`setAttr(attrName: string, value: string) => void` | Sets root element's attribute value to `value`.
`addClass(className: string) => void` | Adds class to the root element.
`removeClass(className: string) => void` | Removes class from the root element.
`hasClass(className: string) => boolean` | Returns true if root element has class, otherwise returns false.
`notifySelectedChange(selected: boolean) => void` | Notifies the Segmented Button that the segment's selected state has changed.

>_NOTE_: `notifySelectedChange` must pass along a `SegmentDetail` representing the Segment, and must be observable by the `mdc-segmented-button` element (e.g. via DOM event bubbling).

### Foundations: `MDCSegmentedButtonFoundation` and `MDCSegmentedButtonSegmentFoundation`

#### `MDCSegmentedButtonFoundation`

Method Signature | Description
--- | ---
`selectSegment(indexOrSegmentId: number | string) => void` | Sets identified segment to be selected.
`unselectSegment(indexOrSegmentId: number | string) => void` | Set identified segment to be not selected.
`getSelectedSegments() => readonly SegmentDetail[]` | Returns selected segments as readonly list of SegmentDetails.
`isSegmentSelected(indexOrSegmentId: number | string) => boolean` | Returns true if identified segment is selected, otherwise returns false.
`isSingleSelect() => boolean` | Returns true if segmented button is single select, otherwise returns false.
`handleSelected(detail: SegmentDetail) => void` | Handles a `selected` event. Maintains single select restrictions, if applicable, and notifies client.

#### `MDCSegmentedButtonFoundation` Event Handlers

When wrapping the Segmented Button foundation, the following events must be bound to the indicated foundation methods:

Events | Element Selector | Foundation Handler
--- | --- | ---
`MDCSegmentedButtonSegment:selected` | `.mdc-segmented-button` (root) | `handleSelected`


### `MDCSegmentedButtonSegmentFoundation`

Method Signature | Description
--- | ---
`isSelected() => void` | Returns true if segment is currently selected.
`setSelected() => void` | Sets segment to be selected.
`setUnselected() => void` | Sets segment to be not selected.
`getSegmentId() => string | undefined` | Returns segment's segmentId if it was provided, otherwise return undefined.
`handleClick() => void` | Handles a `click` event. Changes selected state if able (due to single select) and notifies Segmented Button.

#### `MDCSegmentedButtonSegmentFoundation` Event Handlers

When wrapping the Segment foundation, the following events must be bound to the indicated foundation methods:

Events | Element Selector | Foundation Handler
--- | --- | ---
`click` | `.mdc-segmented-button__segment` (root) | `handleClick`