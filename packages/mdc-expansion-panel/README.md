<!--docs:
title: "Expansion Panels"
layout: detail
section: components
excerpt: "Summary and details. Expandible content."
iconId: expand_more
path: /catalog/expansion-panel/
-->

# Expansion Panels

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/expansion panel.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/expansion panels.png" width="714" alt="Expansion Panels screenshot">
  </a>
</div>-->

> JS **is required** for this component.

The MDC Expansion Panel component is a spec-aligned expansion panel component adhering to the
[Material Design expansion panel pattern](https://material.io/guidelines/components/expansion-panels.html).
A typical expansion panel has three main sections: header, body, and footer. The header is the only section visible when the panel is collapsed. Upon expansion, the body and/or footer, if present, will become visible below the header.

The body can have a flexible height to allow for many different types of content but the header and footer have fixed heights.

The spec gives no guidance or restriction as to the types of content that an expansion panel can contain so it is assumed that the content is arbitrary and possibly distinct. That is, the panel may have entirely different content depending on its state of expansion.

The expansion panel component makes no assumptions about the type of content it will contain but does provide functionality for common use cases, namely styling for header section, expansion icon, and footer button bar.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/expansion-panels.html">Material Design guidelines: Expansion Panels</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/expansion-panel.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install --save @material/expansion-panel
```

## Expansion Panel (Single) Usage

Expansion Panels provide an expandible section where you can display different content based on the expanded state of the panel.

A single expansion panel has no special behavior when grouped with other expansion panels.

```html
<div id="my-expansion-panel" class="mdc-expansion-panel mdc-expansion-panel--collapsed">
  <div class="mdc-expansion-panel__header">
    <i class="material-icons mdc-expansion-panel__expansion-icon"></i>
    <i class="mdc-expansion-panel__icon material-icons mdc-expansion-panel__header__section">done</i>
    <span class="mdc-expansion-panel__text mdc-expansion-panel__header__section">Title</span>
  </div>
  <div class="mdc-expansion-panel__body">
    <p>Body</p>
  </div>
</div>
```

> **Note**: While not mandatory, you should manually set the `mdc-expansion-panel--collapsed` class on the root element to avoid the panel being expanded until the JS component initializes. If you want the panel to be expanded initially, set the `mdc-expansion-panel--expanded` class.

In the example above, we've placed a material icon inside the header and designated it as the expansion icon using a specific CSS class. Note that the icon can be placed anywhere inside the header, so long as it is an immediate child of the header element. While its not strictly necessary to only have one expansion icon, animation will not function correctly if more than one icon is marked as the expansion icon.

An expansion panel can have different content based upon the state it is in. To mark content that should only be displayed when the panel is expanded, apply the `mdc-expansion-panel--details` class. For collapsed-specific content, apply the `mdc-expansion-panel--summary` class.

By default, clicking anywhere inside the bounds of the expansion panel will toggle its expansion state. To prevent this, set the `mdc-expansion-panel--no-click` class on an element. Note that this works by default with the vanilla JS component. If you implement the foundation, you will need to implement the logic yourself.

```html
<div id="my-expansion-panel" class="mdc-expansion-panel mdc-expansion-panel--collapsed">
  <div class="mdc-expansion-panel__header">
    <i class="material-icons mdc-expansion-panel__expansion-icon"></i>
    <span class="mdc-expansion-panel__header__section">
      <i class="mdc-expansion-panel__icon material-icons mdc-expansion-panel--summary">done</i>
      <i class="mdc-expansion-panel__icon material-icons mdc-expansion-panel--details">done_all</i>
    </span>
    <span class="mdc-expansion-panel__text mdc-expansion-panel--no-click mdc-expansion-panel__header__section">
      <span class="mdc-expansion-panel--summary">Title</span>
      <span class="mdc-expansion-panel--details">Expanded Title</span>
    </span>
  </div>
  <div class="mdc-expansion-panel__body">
    <p>Body</p>
  </div>
  <div class="mdc-expansion-panel__footer">
    <span>Footer</span>
    <div class="mdc-expansion-panel__footer__button-bar ">
      <button class="mdc-button mdc-expansion-panel--no-click">cancel</button>
      <button class="mdc-button mdc-expansion-panel--no-click">accept</button>
    </div>
  </div>
</div>
```

#### Auto Init

MDC Expansion Panel supports [auto init](../mdc-auto-init/README.md). Simply set `data-mdc-auto-init="MDCExpansionPanel"` on the root element of your expansion panel and all the JS functionality will be automatically enabled once you call `mdc.autoInit()`.

### Using the Component

MDC Expansion Panel ships with a Component / Foundation combo which allows for frameworks to richly integrate the
correct expansion panel behaviors into idiomatic components.

#### Including in code

##### ES2015

```javascript
import {MDCExpansionPanel, MDCExpansionPanelFoundation} from '@material/expansion-panel';
```

##### CommonJS

```javascript
const mdcExpansionPanel = require('@material/expansion-panel');
const MDCExpansionPanel = mdcExpansionPanel.MDCExpansionPanel;
const MDCExpansionPanelFoundation = mdcExpansionPanel.MDCExpansionPanelFoundation;
```

##### AMD

```javascript
require(['path/to/@material/expansion-panel'], mdcExpansionPanel => {
  const MDCExpansionPanel = mdcExpansionPanel.MDCExpansionPanel;
  const MDCExpansionPanelFoundation = mdcExpansionPanel.MDCExpansionPanelFoundation;
});
```

##### Global

```javascript
const MDCExpansionPanel = mdc.expansionPanel.MDCExpansionPanel;
const MDCExpansionPanelFoundation = mdc.expansionPanel.MDCExpansionPanelFoundation;
```

#### Automatic Instantiation

If you do not care about retaining the component instance for the expansion panel, simply call `attachTo()`
and pass it a DOM element. This however, is only useful if you do not need to pass a callback to the expansion panel
when the user expands or collapses the panel.

```javascript
mdc.expansionPanel.MDCExpansionPanel.attachTo(document.querySelector('#my-mdc-expansion-panel'));
```

#### Manual Instantiation

Expansion Panels can easily be initialized using their default constructors as well, similar to `attachTo`.

```javascript
import {MDCExpansionPanel} from '@material/expansion-panel';

const expansionPanel = new MDCExpansionPanel(document.querySelector('#my-mdc-expansion-panel'));
```

#### Using the expansion panel component
```js
var expansionPanel = new mdc.expansionPanel.MDCExpansionPanel(document.querySelector('#mdc-expansion-panel-default'));

expansionPanel.listen('MDCExpansionPanel:expand', function() {
  console.log('expanded');
})

expansionPanel.listen('MDCExpansionPanel:collapse', function() {
  console.log('collapsed');
})

expansionPanel.listen('MDCExpansionPanel:change', function(component) {
  console.log(component.expanded);
})
```

### Expansion Panel component API

#### `MDCExpansionPanel#expanded`

Boolean. True when the expansion panel is expanded, false otherwise.

#### `MDCExpansionPanel#expand() => void`

Expands the expansion panel

#### `MDCExpansionPanel#collapse() => void`

Collapses the expansion panel

### Expansion Panel Events

#### MDCExpansionPanel:change

Broadcast when the expansion panel is either expanded or collapsed.

#### MDCExpansionPanel:expand

Broadcast when the expansion panel is expanded.

#### MDCExpansionPanel:collapse

Broadcast when the expansion panel is collapsed.

### Using the Foundation Class

MDC Expansion Panel ships with an `MDCExpansionPanelFoundation` class that external frameworks and libraries can
use to integrate the component. As with all foundation classes, an adapter object should be provided.

> **NOTE**: Components themselves must manage adding ripples to expansion panel buttons, should they choose to
do so. We provide instructions on how to add ripples to buttons within the [mdc-button README](../mdc-button#adding-ripples-to-buttons).

### Adapter API

| Method Signature | Description |
| --- | --- |
| `blur() => void` | Calls `blur()` on the root element. |
| `hasClass(className: string) => boolean` | Returns true if the root element has the specified class. |
| `addClass(className: string) => void` | Adds a class to the root element. |
| `removeClass(className: string) => void` | Removes a class from the root element. |
| `getStyle(propertyName: string) => void` | Gets a style property `propertyName` on the root element. |
| `setStyle(propertyName: string, value: string) => void` | Sets a style property `propertyName` on the root element to the `value` specified. |
| `getComputedHeight() => string` | Returns the height property of the computed style of the root element. |
| `offsetHeight() => number` | Returns the `offsetHeight` of the root element. |
| `setAttribute: (attributeName: string, value: string) => void` | Sets the attribute `attributeName` to `value`. |
| `registerInteractionHandler(type: string, handler: EventListener) => void` | Adds an event listener to the root element for the specified event name. |
| `deregisterInteractionHandler(type: string, handler: EventListener) => void` | Removes an event listener from the root element for the specified event name. |
| `notifyChange() => {}` | Broadcasts a "change" event notifying clients that a change to the expansion panel’s state has been triggered. The implementation should choose to pass along any relevant information pertaining to this event. In our case we pass along the instance of the component for which the event is triggered for. |
| `notifyExpand() => {}` | Broadcasts an "expand" event notifying clients that a change to the slider's value has been committed by the user. Similar guidance applies here as for `notifyChange()` |
| `notifyCollapse() => {}` | Broadcasts a "collapse" event notifying clients that a change to the slider's value has been committed by the user. Similar guidance applies here as for `notifyChange()`. |
| `setExpansionIconInnerHTML(innerHTML: string) => void` | Sets the inner HTML of any and all expansion icons to the value of `innerHTML`. |
| `shouldRespondToClickEvent(event: MouseEvent) => boolean` | Returns true if the expansion panel should respond (by toggling the expansion state) to the given click event. |

### The full foundation API

#### `MDCExpansionPanelFoundation#expanded`

Boolean. True when the expansion panel is expanded, false otherwise.

#### `MDCExpansionPanelFoundation#expand() => void`

Expands the expansion panel

#### `MDCExpansionPanelFoundation#collapse() => void`

Collapses the expansion panel

## Theming - Dark Theme Considerations

When `$mdc-theme-background` is set to a dark tone, the expansion panel automatically sets its own color scheme to a dark color pallete.
However it will not automatically style all content in the panel, particularly the button. Ensure that your buttons are dark-theme aware.

# Accordion

> JS **is required** for this component.

Expansion Panels behave independently by default but by placing them together as children of an accordion you can link their behavior. Expanded accordion panels are collapsed when one of their sibling accordion panels is expanded.

By default, all children panels are part of the accordion. To exclude a child panel from the accordion, set the `mdc-expansion-panel-accordion--excluded` class on the root element of the excluded child.

> **Note** In the vanilla component, children with the `mdc-expansion-panel-accordion--excluded` are not included with the accordion. However if you use the foundation, *you* must implement the logic to exclude any unwanted children.

```html
<div class="mdc-expansion-panel-accordion">
  <div class="mdc-expansion-panel mdc-expansion-panel--collapsed">...</div>
  <div class="mdc-expansion-panel mdc-expansion-panel--collapsed">...</div>
  <div class="mdc-expansion-panel mdc-expansion-panel--collapsed">...</div>
  <div class="mdc-expansion-panel mdc-expansion-panel--collapsed mdc-expansion-panel-accordion--excluded">...</div>
</div>
```

#### Auto Init

MDC Expansion Panel Accordion supports [auto init](../mdc-auto-init/README.md). Simply set `data-mdc-auto-init="MDCExpansionPanelAccordion"` on the root element of your expansion panel and all the JS functionality will be automatically enabled once you call `mdc.autoInit()`.

### Using the Component

MDC Expansion Panel ships with a Component / Foundation combo which allows for frameworks to richly integrate the
correct expansion panel behaviors into idiomatic components.

#### Including in code

##### ES2015

```javascript
import {MDCExpansionPanelAccordion, MDCExpansionPanelAccordionFoundation} from '@material/expansion-panel';
```

##### CommonJS

```javascript
const mdcExpansionPanel = require('@material/expansion-panel');
const MDCExpansionPanelAccordion = mdcExpansionPanel.MDCExpansionPanelAccordion;
const MDCExpansionPanelAccordionFoundation = mdcExpansionPanel.MDCExpansionPanelAccordionFoundation;
```

##### AMD

```javascript
require(['path/to/@material/expansion-panel'], mdcExpansionPanel => {
  const MDCExpansionPanelAccordion = mdcExpansionPanel.MDCExpansionPanelAccordion;
  const MDCExpansionPanelAccordionFoundation = mdcExpansionPanel.MDCExpansionPanelAccordionFoundation;
});
```

##### Global

```javascript
const MDCExpansionPanelAccordion = mdc.expansionPanel.MDCExpansionPanelAccordion;
const MDCExpansionPanelAccordionFoundation = mdc.expansionPanel.MDCExpansionPanelAccordionFoundation;
```

#### Automatic Instantiation

If you do not care about retaining the component instance for the expansion panel, simply call `attachTo()`
and pass it a DOM element. This however, is only useful if you do not need to pass a callback to the expansion panel
when the user expands or collapses the panel.

```javascript
mdc.expansionPanel.MDCExpansionPanelAccordion.attachTo(document.querySelector('#my-mdc-accordion'));
```

#### Manual Instantiation

Expansion Panels can easily be initialized using their default constructors as well, similar to `attachTo`.

```javascript
import {MDCExpansionPanelAccordion} from '@material/expansion-panel';

const accordion = new MDCExpansionPanelAccordion(document.querySelector('#my-mdc-accordion'));
```

#### Using the expansion panel component
```js
var accordion = new mdc.expansionPanel.MDCExpansionPanelAccordion(document.querySelector('#mdc-accordion-default'));


accordion.listen('MDCExpansionPanelAccordion:change', function(component) {
  console.log(component.expandedChild);
})
```

### Expansion Panel component API

#### `MDCExpansionPanelAccordion#expandedChild`

The component instance that is currently expanded.

### Expansion Panel Events

#### MDCExpansionPanelAccordion:change

Broadcast when a child expansion panel is expanded.

### Using the Foundation Class

MDC Expansion Panel Accordion ships with an `MDCExpansionPanelAccordionFoundation` class that external frameworks and libraries can
use to integrate the component. As with all foundation classes, an adapter object must be provided.

### Adapter API

| Method Signature | Description |
| --- | --- |
| `registerChildrenExpansionPanelInteractionListener(type: string, handler: EventListener) => void` | Adds an event listener `handler` to all children of the accordion, except those that should be excluded. |
| `deregisterChildrenExpansionPanelInteractionListener(type: string, handler: EventListener) => void` | Removes the event listener `handler` from all children of the accordion, except those that have been excluded. |
| `notifyChange() => {}` | Broadcasts a "change" event notifying clients that a child expansion panel's state has been changed. The implementation should choose to pass along any relevant information pertaining to this event. In our case we pass along the instance of the component for which the event is triggered. |
| `getComponentInstanceFromEvent(event: Event) => Object` | Gets the component instance from the event. If the event was emitted from the vanilla component, this is `event.detail`. This component should have the method `collapse()` which should collapse the component that triggered the event. |

### The full foundation API

#### `MDCExpansionPanelAccordionFoundation#expandedChild`

The component instance that is currently expanded.
