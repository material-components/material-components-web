# Shape

MDC Shape is a Sass / CSS / JavaScript library which draws shapes.

## Design & API Documentation

TODO

## Installation

TODO

## Usage

### DOM Structure

```html
<div class="mdc-shape">
  <canvas class="mdc-shape__canvas"></canvas>
  <div style="clip-path: url(#FOO_ID); -webkit-clip-path: url(#FOO_ID)">Your Content</div>
  <svg class="mdc-shape__svg">
    <clipPath id="FOO_ID">
      <path class="mdc-shape__path"/>
    </clipPath>
  </svg>
</div>
```

We recommend you put any content for the shape inside the "clipped" element *after* the `mdc-shape__canvas` element. The "clipped" element must contain the style `clip-path:url(#FOO_ID)`, where `FOO_ID` corresponds to the value you assign to the `clipPath` element's `id` attribute. Using the same ID between the "clipped" element and the `clipPath` element effectively clips any content to the shape. It is important `mdc-shape__canvas` is before the "clipped" element, otherwise the clipping effect will clip the shadows drawn by `MDCShapeFoundation`.

### CSS Classes

CSS Class | Description
--- | ---
`mdc-shape` | Mandatory. Needs to be set on the root element of the component
`mdc-shape__canvas` | Mandatory. Needs to be set on the canvas node for drawing the shape
`mdc-shape__svg` | Mandatory. Needs to be set on the svg node for clipping content to the shape
`mdc-shape__path` | Mandatory. Needs to be set on the path node for clipping content to the shape

### Using the Foundation Class

MDC Shape ships with an `MDCShapeFoundation` class that external frameworks and libraries can use to integrate the component. As with all foundation classes, an adapter object must be provided.
The adapter for shape must provide the following functions, with correct signatures:

| Method Signature | Description |
| --- | --- |
| `setCanvasWidth(value: number) => void` | Sets the width of the canvas element. |
| `setCanvasHeight(value: number) => void` | Sets the height of the canvas element. |
| `getCanvasWidth() => number` | Returns the width of the canvas element. |
| `getCanvasHeight() => number` | Returns the height of the canvas element. |
| `getDevicePixelRatio() => number` | Returns the device pixel ratio. |
| `create2dRenderingContext() => {shadowColor: string, shadowBlur: number, shadowOffsetY: number, fillStyle: string, scale: (number, number), clearRect: (number, number, number, number), fill: (Path2D)}` | Returns an object which has the shape of a CanvasRenderingContext2d instance. An easy way to achieve this is simply `this.root_.querySelector(mdc.shape.MDCShapeFoundation.SHAPE_SELECTOR).getContext('2d');`. |

### Extending the Foundation Class

`MDCShapeFoundation` is an abstract class. Developers should extend `MDCShapeFoundation` and implement the `generatePath_` method. GeneratePath_ takes width, height, and padding, and returns a string representation of the SVG path data. This allows developers to create *any* shape.

TODO add more information about the other shapes we provide, which extend MDCShapeFoundation.

### MDCShape API

MDC Shape exposes the following methods:

| Method Signature | Description |
| --- | --- |
| `set background(value: string) => void` | Sets the background of the shape |
| `set elevation(value: number) => void` | Sets the elevation of the shape |
| `redraw() => void` | Redraws the shape |

### Shape Customization

There are two ways to customize your shape's elevation and background color. The first way is to use the MDCShape's API.

To modify the elevation of a shape, call the background setter

```
mdcShape.background = '#FOO';
```

To modify the elevation of a shape, call the elevation setter

```
mdcShape.elevation = 4;
```

The second way is to use custom CSS properties.

### CSS custom properties

To modify the elevation of a shape, set custom CSS properties on the mdc-shape element

```
--mdc-shape-elevation: 4;
```

To modify the background of a shape, set custom CSS properties on the mdc-shape element

```
--mdc-shape-background: #FF0000;
```