<!--docs:
title: "Progress Indicator"
layout: detail
section: components
excerpt: "Material Design-styled progress indicators."
iconId: progress_linear
path: /catalog/progress-indicator/
-->

# Progress Indicators

The MDC Progress Indicator component exposes common foundation and component interfaces for a progress indicator. Components that implement these interfaces include [linear progress](https://github.com/material-components/material-components-web/tree/master/packages/mdc-linear-progress) and [circular progress](https://github.com/material-components/material-components-web/tree/master/packages/mdc-circular-progress).
[Material Design progress & activity requirements](https://material.io/go/design-progress-indicators).

## Installation

```
npm install @material/progress-indicator
```

## Basic Usage

### MDCProgressIndicatorFoundation API

MDC Progress Indicator Foundation exposes the following methods:

| Method Signature | Description |
| --- | --- |
| `setDeterminate(value: boolean) => void` | Toggles the component between the determinate and indeterminate state. |
| `isDeterminate() => boolean` | Whether or not the component is in determinate state. |
| `setProgress(value: number) => void` | Sets the progress to this value. Value should be between [0, 1]. |
| `getProgress() => number` | The current progress value in the interval [0,1]. |
| `open() => void` | Puts the component in the open state. |
| `close() => void` | Puts the component in the closed state. |
| `isClosed() => boolean` | Whether or not the progress indicator is closed. |

### MDCProgressIndicator Component API

MDC Progress Indicator exposes the following API:

| Method Signature | Description |
| --- | --- |
| `determinate: boolean` | Whether the indicator is in the determinate or indeterminate state. |
| `progress: number` | The current progress. Value should be between [0, 1]. |
| `open() => void` | Puts the component in the open state. |
| `close() => void` | Puts the component in the closed state. |
