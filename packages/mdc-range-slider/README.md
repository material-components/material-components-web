# MDC Range Slider

MDC Range slider is a scss component to style ranged inputs implementing as much of [Material Design slider component guidelines](https://material.io/guidelines/components/sliders.html#) as possible with the non-standard pseudo-elements use to style ranged input selectors in Geko, Edge, Blink and WebKit layout engines.  



## Installation

```
npm install --save @material/range-slider

```

## Usage

Use exclusively on inputs with type set to range.


```html
<!-- standard -->
<input type="range" value="5" min="0" max="10" step="1" class="mdc-range-slider" />

<!-- primary -->
<input type="range" value="5" min="0" max="10" step="1" class="mdc-range-slider mdc-range-slider--primary" />

<!-- Accent -->
<input type="range" value="5" min="0" max="10" step="1" class="mdc-range-slider mdc-range-slider--accent" />

<!-- disabled -->
<input type="range" class="mdc-range-slider" value="5" min="0" max="10" step="1" disabled="true" />

```

## Modifiers

| Class | Description |
| --- | --- |
| mdc-range-slider | Base slider |
| mdc-range-slider mdc-range-slider-primary | Colours the slider with the primary colour |
| mdc-range-slider mdc-range-slider--accent | Colours the sloder with the accent colour |
| mdc-range-slider mdc-range-slider--disabled | adds disabled colouring to the slider, can also be done by adding a disabled attribute |

##### Disabled inputs
Setting the disabled attribute will supersede class suffixes like primary and accent.

```html
<input type="range"  value="5" min="0" max="10" step="1" class="mdc-range-slider mdc-range-slider--accent" disabled="true" />
<!-- Will Render the same as -->
<input type="range"  value="5" min="0" max="10" step="1" class="mdc-range-slider mdc-range-slider--disabled" />
<!-- And -->
<input type="range"  value="5" min="0" max="10" step="1" class="mdc-range-slider" disabled />
```
