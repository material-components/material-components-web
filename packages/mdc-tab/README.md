# Tab

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/tab.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/tab.png" width="363" alt="Tab screenshot">
  </a>
</div>-->

Tab is a selectable element with an active state

## Design & API Documentation

<!--
<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/chips.html">Material Design guidelines: Chips</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/chips.html">Demo</a>
  </li>
</ul>
-->

## Installation
```
npm install --save @material/tab
```

## Usage

### HTML Structure

```html
<button class="mdc-tab" role="tab" aria-selected="false">
  <div class="mdc-tab__content">
    <span class="mdc-tab__icon">heart</div>
    <span class="mdc-tab__text-label">Favorites</div>
  </div>
  <span class="mdc-tab-indicator">
    <span class="mdc-tab-indicator__content mdc-tab-indicator__content--underline"></span>
  </span>
  <div class="mdc-tab__ripple"></div>
</button>
```

### CSS Classes

CSS Class | Description
--- | ---
`mdc-tab` | Mandatory.
`mdc-tab__content` | Mandatory. Indicates the text label of the tab
`mdc-tab__ripple` | Mandatory. Denotes the ripple surface for the tab
`mdc-tab--active` | Optional. Indicates that the tab is active
`mdc-tab--stacked` | Optional. Indicates that the tab content should be displayed vertically instead of horizontally
`mdc-tab__text-label` | Optional. Indicates an icon in the tab
`mdc-tab__icon` | Optional. Indicates a leading icon in the tab

### Sass Mixins

To customize the colors of any part of the tab, use the following mixins.

Mixin | Description
--- | ---
`mdc-tab-text-label-color($color)` | Customizes the color of the tab text label
`mdc-tab-icon-color($color)` | Customizes the color of the tab icon

### `MDCTab`

Property | Value Type | Description
--- | --- | ---
`active` | `boolean` | Allows getting the active state of the tab

Method Signature | Description
--- | ---
`activate(previousIndicatorClientRect: ClientRect=) => void` | Activates the indicator.  `previousIndicatorClientRect` is an optional argument
`deactivate() => void` | Deactivates the indicator


### `MDCTabAdapter`

Method Signature | Description
--- | ---
`addClass(className: string) => void` | Adds a class to the root element
`removeClass(className: string) => void` | Removes a class from the root element
`hasClass(className: string) => boolean` | Returns true if the root element contains the given class
`registerEventHandler(evtType: string, handler: EventListener) => void` | Registers an event listener on the root element
`deregisterEventHandler(evtType: string, handler: EventListener) => void` | Deregisters an event listener on the root element
`setAttr(attr: string, value: string) => void` | Sets the given attribute on the root element to the given value
`activateIndicator(previousIndicatorClientRect: ClientRect=) => void` | Activates the tab indicator subcomponent. `previousIndicatorClientRect` is an optional argument
`deactivateIndicator() => void` | Deactivates the tab indicator subcomponent
`computeIndicatorClientRect() => ClientRect` | Returns the tab indicator subcomponent's content bounding client rect

### `MDCTabFoundation`

Method Signature | Description
--- | ---
`handleTransitionEnd(evt: Event) => void` | Handles the logic for the `"transitionend"` event
`isActive() => boolean` | Returns whether the tab is active
`activate(previousIndicatorClientRect: ClientRect=) => void` | Activates the tab. `previousIndicatorClientRect` is an optional argument
`deactivate() => void` | Deactivates the tab
`computeIndicatorClientRect() => ClientRect` | Returns the tab indicator subcomponent's content bounding client rect
