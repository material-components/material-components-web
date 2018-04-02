<!--docs:
title: "Tabs"
layout: detail
section: components
excerpt: "A tabbed navigation component."
iconId: tabs
path: /catalog/tabs/
-->

# MDC Tabs

The MDC Tabs component contains components which are used to create spec-aligned tabbed navigation components adhering to the
[Material Design tabs guidelines](https://material.io/guidelines/components/tabs.html). These components are:

- **mdc-tab**: The individual tab elements
- **mdc-tab-bar**: The main component which is composed of `mdc-tab` elements
- **mdc-tab-bar-scroller**: The component which controls the horizontal scrolling behavior of an `mdc-tab-bar` that overflows its container

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/tabs.html">Material Design guidelines: Tabs</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="http://material-components-web.appspot.com/tabs.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/tabs
```

## Tabs usage

`mdc-tab-bar` can be used as a CSS only component, or a more dynamic JavaScript
component.

There are also three different permutations of tab labels. These include text,
icon-only, and text with icon. An example of each is available on the demo site.

#### Tab Bar with text labels
```html
<nav id="basic-tab-bar" class="mdc-tab-bar">
  <a class="mdc-tab mdc-tab--active" href="#one">Home</a>
  <a class="mdc-tab" href="#two">Merchandise</a>
  <a class="mdc-tab" href="#three">About Us</a>
  <span class="mdc-tab-bar__indicator"></span>
</nav>
```

#### Tab Bar with icon labels
```html
<nav class="mdc-tab-bar mdc-tab-bar--icon-tab-bar">
  <a class="mdc-tab mdc-tab--active" href="#recents">
    <i class="material-icons mdc-tab__icon" aria-label="Recents">phone</i>
  </a>
  <a class="mdc-tab" href="#favorites">
    <i class="material-icons mdc-tab__icon" aria-label="Favorites">favorite</i>
  </a>
  <a class="mdc-tab" href="#nearby">
    <i class="material-icons mdc-tab__icon" aria-label="nearby">person_pin</i>
  </a>
  <span class="mdc-tab-bar__indicator"></span>
</nav>
```

#### Tab Bar with icon and text labels
```html
<nav id="icon-text-tab-bar" class="mdc-tab-bar mdc-tab-bar--icons-with-text">
  <a class="mdc-tab mdc-tab--with-icon-and-text mdc-tab--active" href="#recents">
    <i class="material-icons mdc-tab__icon" aria-hidden="true">phone</i>
    <span class="mdc-tab__icon-text">Recents</span>
  </a>
  <a class="mdc-tab mdc-tab--with-icon-and-text" href="#favorites">
    <i class="material-icons mdc-tab__icon" aria-hidden="true">favorite</i>
    <span class="mdc-tab__icon-text">Favorites</span>
  </a>
  <a class="mdc-tab mdc-tab--with-icon-and-text" href="#nearby">
    <i class="material-icons mdc-tab__icon" aria-hidden="true">person_pin</i>
    <span class="mdc-tab__icon-text">Nearby</span>
  </a>
  <span class="mdc-tab-bar__indicator"></span>
</nav>
```

#### CSS Only Support

In order for the indicator to appear, you will need to change your mark up if you are using CSS Only. Each `.mdc-tab` will have a child element with the class `.mdc-tab__indicator` as shown below:

```html
<nav id="basic-tab-bar" class="mdc-tab-bar">
  <a class="mdc-tab mdc-tab--active" href="#one">
    Home
    <span class="mdc-tab__indicator"></span>
  </a>
  <a class="mdc-tab" href="#two">
    Merchandise
    <span class="mdc-tab__indicator"></span>
  </a>
  <a class="mdc-tab" href="#three">
    About Us
    <span class="mdc-tab__indicator"></span>
  </a>
</nav>
```

#### RTL Support

Tab Bars will reverse the order of their tabs if they are placed within an
ancestor element with attribute `dir="rtl"`.

```html
<html dir="rtl">
  <!--...-->
  <nav id="basic-tab-bar" class="mdc-tab-bar">
    <a class="mdc-tab mdc-tab--active" href="#one">Home</a>
    <a class="mdc-tab" href="#two">Merchandise</a>
    <a class="mdc-tab" href="#three">About Us</a>
    <span class="mdc-tab-bar__indicator"></span>
  </nav>
</html>
```


### Dynamic view switching

While facilitating the view switching is left up to the developer, the demo site
provides a minimal example of how to do so using JavaScript, also shown below.

#### Markup:
```html
<section id="dynamic-demo-toolbar">
  <nav id="dynamic-tab-bar" class="mdc-tab-bar" role="tablist">
    <a role="tab" aria-controls="panel-1"
       class="mdc-tab mdc-tab--active" href="#panel-1">Item One</a>
    <a role="tab" aria-controls="panel-2"
       class="mdc-tab" href="#panel-2">Item Two</a>
    <a role="tab" aria-controls="panel-3"
       class="mdc-tab" href="#panel-3">Item Three</a>
    <span class="mdc-tab-bar__indicator"></span>
  </nav>
</section>
<section>
  <div class="panels">
    <p class="panel active" id="panel-1" role="tabpanel" aria-hidden="false">Item One</p>
    <p class="panel" id="panel-2" role="tabpanel" aria-hidden="true">Item Two</p>
    <p class="panel" id="panel-3" role="tabpanel" aria-hidden="true">Item Three</p>
  </div>
  <div class="dots">
    <a class="dot active" data-trigger="panel-1" href="#panel-1"></a>
    <a class="dot" data-trigger="panel-2" href="#panel-2"></a>
    <a class="dot" data-trigger="panel-3" href="#panel-3"></a>
  </div>
</section>
```

#### Script:
```js
var dynamicTabBar = window.dynamicTabBar = new mdc.tabs.MDCTabBar(document.querySelector('#dynamic-tab-bar'));
var dots = document.querySelector('.dots');
var panels = document.querySelector('.panels');

dynamicTabBar.tabs.forEach(function(tab) {
  tab.preventDefaultOnClick = true;
});

function updateDot(index) {
  var activeDot = dots.querySelector('.dot.active');
  if (activeDot) {
    activeDot.classList.remove('active');
  }
  var newActiveDot = dots.querySelector('.dot:nth-child(' + (index + 1) + ')');
  if (newActiveDot) {
    newActiveDot.classList.add('active');
  }
}

function updatePanel(index) {
  var activePanel = panels.querySelector('.panel.active');
  if (activePanel) {
    activePanel.classList.remove('active');
  }
  var newActivePanel = panels.querySelector('.panel:nth-child(' + (index + 1) + ')');
  if (newActivePanel) {
    newActivePanel.classList.add('active');
  }
}

dynamicTabBar.listen('MDCTabBar:change', function ({detail: tabs}) {
  var nthChildIndex = tabs.activeTabIndex;

  updatePanel(nthChildIndex);
  updateDot(nthChildIndex);
});

dots.addEventListener('click', function (evt) {
  if (!evt.target.classList.contains('dot')) {
    return;
  }

  evt.preventDefault();

  var dotIndex = [].slice.call(dots.querySelectorAll('.dot')).indexOf(evt.target);

  if (dotIndex >= 0) {
    dynamicTabBar.activeTabIndex = dotIndex;
  }

  updatePanel(dotIndex);
  updateDot(dotIndex);
})
```

### Sass Mixins

To customize the ink color of any part of the tab, use the following mixins. We recommend you apply these mixins within CSS selectors like `.foo-tab:not(.mdc-tab--active)` to select your inactive tabs, `foo-tab:hover` to select the hover state of your tabs, and `.foo-tab.mdc-tab--active` to select your active tabs.

#### `mdc-tab-ink-color`
Use this mixin to set the color of all ink on the tab.

#### `mdc-tab-icon-ink-color`
This mixin customizes the icon ink color.

#### `mdc-tab-label-ink-color`
This mixin customizes the label ink color.

#### `mdc-tab-bar-indicator-ink-color`
This mixin customizes the indicator ink color.

### Using the CSS-Only Component

`mdc-tab-bar` ships with css for styling a tab layout according to the Material
Design spec. To use CSS only tab bars, simply use the available class names.
Note the available `mdc-tab--active` modifier class. This is used to denote the
currently active tab.

```html
<nav class="mdc-tab-bar">
  <a class="mdc-tab mdc-tab--active" href="#one">Item One</a>
  <a class="mdc-tab" href="#two">Item Two</a>
  <a class="mdc-tab" href="#three">Three</a>
  <span class="mdc-tab-bar__indicator"></span>
</nav>
```

### Using the JavaScript Component

`mdc-tab-bar` ships with a Component/Foundation combo for ingesting instances of `mdc-tab` (a tab).
`mdc-tab-bar` uses its `initialize()` method call a factory function which gathers and instantiates
any tab elements that are children of the `mdc-tab-bar` root element.


#### Including in code

##### ES2015

```javascript
import {MDCTab, MDCTabFoundation} from '@material/tabs';
import {MDCTabBar, MDCTabBarFoundation} from '@material/tabs';
```

##### CommonJS

```javascript
const mdcTabs = require('@material/tabs');
const MDCTab = mdcTabs.MDCTab;
const MDCTabFoundation = mdcTabs.MDCTabFoundation;

const MDCTabBar = mdcTabs.MDCTabBar;
const MDCTabBarFoundation = mdcTabs.MDCTabBarFoundation;
```

##### AMD

```javascript
require(['path/to/@material/tabs'], mdcTabs => {
  const MDCTab = mdcTabs.MDCTab;
  const MDCTabFoundation = mdcTabs.MDCTabFoundation;

  const MDCTabBar = mdcTabs.MDCTabBar;
  const MDCTabBarFoundation = mdcTabs.MDCTabBarFoundation;
});
```

##### Global

```javascript
const MDCTab = mdc.tabs.MDCTab;
const MDCTabFoundation = mdc.tabs.MDCTabFoundation;

const MDCTabBar = mdc.tabs.MDCTabBar;
const MDCTabBarFoundation = mdc.tabs.MDCTabBarFoundation;
```

#### Automatic Instantiation

If you do not care about retaining the component instance for the tabs, simply
call `attachTo()` and pass it a DOM element.

```javascript
mdc.tabs.MDCTabBar.attachTo(document.querySelector('#my-mdc-tab-bar'));
```

#### Manual Instantiation

Tabs can easily be initialized using their default constructors as well, similar
to `attachTo`. This process involves a factory to create an instance of MDCTab
from each tab Element inside of the `mdc-tab-bar` node during the initialization phase
of `MDCTabBar`, e.g.:

```html
<nav id="my-mdc-tab-bar" class="mdc-tab-bar">
  <a class="mdc-tab mdc-tab--active" href="#one">Item One</a>
  <a class="mdc-tab" href="#two">Item Two</a>
  <a class="mdc-tab" href="#three">Three</a>
  <span class="mdc-tab-bar__indicator"></span>
</nav>
```

```javascript
import {MDCTabBar, MDCTabBarFoundation} from '@material/tabs';

const tabBar = new MDCTabBar(document.querySelector('#my-mdc-tab-bar'));
```


### Using the JavaScript Tab Bar Scroller Component

`mdc-tab-bar-scroller` ships with a Component/Foundation combo which wraps instances of `mdc-tab-bar`. `mdc-tab-bar-scroller` uses its `initialize()` method call a factory function which gathers and instantiates any tab bar elements that are children of the `mdc-tab-bar-scroller` root element.

The anatomy of `mdc-tab-bar-scroller` includes an instance of `mdc-tab-bar`, RTL-aware forward and back indicators which, when actioned on, move the tab bar left and right, and a scroll frame. The scroll frame is the parent element of the tab bar, and serves to mask the tabs in the tab bar when they overflow the available width.



#### Including in code

##### ES2015

```javascript
import {MDCTab, MDCTabFoundation} from '@material/tabs';
import {MDCTabBar, MDCTabBarFoundation} from '@material/tabs';
import {MDCTabBarScroller, MDCTabBarFoundationScroller} from '@material/tabs';
```

##### CommonJS

```javascript
const mdcTabs = require('@material/tabs');
const MDCTab = mdcTabs.MDCTab;
const MDCTabFoundation = mdcTabs.MDCTabFoundation;

const MDCTabBar = mdcTabs.MDCTabBar;
const MDCTabBarFoundation = mdcTabs.MDCTabBarFoundation;

const MDCTabBarScroller = mdcTabs.MDCTabBarScroller;
const MDCTabBarScrollerFoundation = mdcTabs.MDCTabBarScrollerFoundation;
```

##### AMD

```javascript
require(['path/to/@material/tabs'], mdcTabs => {
  const MDCTab = mdcTabs.MDCTab;
  const MDCTabFoundation = mdcTabs.MDCTabFoundation;

  const MDCTabBar = mdcTabs.MDCTabBar;
  const MDCTabBarFoundation = mdcTabs.MDCTabBarFoundation;

  const MDCTabBarScroller = mdcTabs.MDCTabBarScroller;
  const MDCTabBarScrollerFoundation = mdcTabs.MDCTabBarScrollerFoundation;
});
```

##### Global

```javascript
const MDCTab = mdc.tabs.MDCTab;
const MDCTabFoundation = mdc.tabs.MDCTabFoundation;

const MDCTabBar = mdc.tabs.MDCTabBar;
const MDCTabBarFoundation = mdc.tabs.MDCTabBarFoundation;

const MDCTabBarScroller = mdc.tabs.MDCTabBarScroller;
const MDCTabBarScrollerFoundation = mdc.tabs.MDCTabBarScrollerFoundation;
```

#### Automatic Instantiation

If you do not care about retaining the component instance for the tabs, simply
call `attachTo()` and pass it a DOM element.

```javascript
mdc.tabs.MDCTabBarScroller.attachTo(document.querySelector('#my-mdc-tab-bar-scroller'));
```

#### Manual Instantiation

Tab Bar Scrollers can easily be initialized using their default constructors as well, similar
to `attachTo`. This process involves a factory to create an instance of `MDCTabBar`
from the `mdc-tab-bar` Element inside of the `mdc-tab-bar-scroller` node during the initialization phase
of `MDCTabBarScroller`, e.g.:

```html
<div id="my-mdc-tab-bar-scroller" class="mdc-tab-bar-scroller">
  <div class="mdc-tab-bar-scroller__indicator mdc-tab-bar-scroller__indicator--back">
    <a class="mdc-tab-bar-scroller__indicator__inner material-icons" href="#" aria-label="scroll back button">
      navigate_before
    </a>
  </div>
  <div class="mdc-tab-bar-scroller__scroll-frame">
    <nav id="my-scrollable-tab-bar" class="mdc-tab-bar mdc-tab-bar-scroller__scroll-frame__tabs">
      <a class="mdc-tab mdc-tab--active" href="#one">Item One</a>
      <a class="mdc-tab" href="#two">Item Two</a>
      <a class="mdc-tab" href="#three">Item Three</a>
      <a class="mdc-tab" href="#four">Item Four</a>
      <a class="mdc-tab" href="#five">Item Five</a>
      <a class="mdc-tab" href="#six">Item Six</a>
      <a class="mdc-tab" href="#seven">Item Seven</a>
      <a class="mdc-tab" href="#eight">Item Eight</a>
      <a class="mdc-tab" href="#nine">Item Nine</a>
      <span class="mdc-tab-bar__indicator"></span>
    </nav>
  </div>
  <div class="mdc-tab-bar-scroller__indicator mdc-tab-bar-scroller__indicator--forward">
    <a class="mdc-tab-bar-scroller__indicator__inner material-icons" href="#" aria-label="scroll forward button">
      navigate_next
    </a>
  </div>
</div>
```

```javascript
import {MDCTabBarScroller, MDCTabBarScrollerFoundation} from '@material/tabs';

const tabBarScroller = new MDCTabBarScroller(document.querySelector('#my-mdc-tab-bar-scroller'));
```

Tab Bar Scrollers can also instantiate any `mdc-tab-bar` from a DOM element on the fly using a built in factory function:

```js
import {MDCTabBarScroller, MDCTabBarScrollerFoundation} from '@material/tabs';

const tabBarEl = document.querySelector('#my-mdc-tab-bar');
const scrollerEl = document.querySelector('#my-mdc-tab-bar-scroller');

const tabBarScroller = new MDCTabBarScroller(scrollerEl, undefined, tabBarEl);
```
This will create an instance of MDC Tab Bar during the initialization phase of Tab Bar Scroller.


## Tab

### Tab component API

#### Properties

| Property Name | Type | Description |
| --- | --- | --- |
| `computedWidth` | `number` | _(read-only)_ The width of the tab. |
| `computedLeft` | `number` | _(read-only)_ The left offset of the tab. |
| `isActive` | `boolean` | Whether or not the tab is active. Setting this makes the tab active. |
| `preventDefaultOnClick` | `boolean` | Whether or not the tab will call `preventDefault()` on an event. Setting this makes the tab call `preventDefault()` on events. |

### Tab Events

#### MDCTab:selected

Broadcast when a user actions on the tab.


### Using the Foundation Class

MDC Tab ships with an `MDCTabFoundation` class that external frameworks and libraries can
use to integrate the component. As with all foundation classes, an adapter object must be provided.


### Adapter API

| Method Signature | Description |
| --- | --- |
| `addClass(className: string) => void` | Adds a class to the root element. |
| `removeClass(className: string) => void` | Removes a class from the root element. |
| `registerInteractionHandler(evt: string, handler: EventListener) => void` | Adds an event listener to the root element, for the specified event name. |
| `deregisterInteractionHandler(evt: string, handler: EventListener) => void` | Removes an event listener from the root element, for the specified event name. |
| `getOffsetWidth() => number` | Return the width of the tab |
| `getOffsetLeft() => number` | Return distance between left edge of tab and left edge of its parent element |
| `notifySelected() => {}` | Broadcasts an event denoting that the user has actioned on the tab |


### The full foundation API

#### MDCTabFoundation.getComputedWidth() => number

Return the computed width for tab.

#### MDCTabFoundation.getComputedLeft() => number

Return the computed left offset for tab.

#### MDCTabFoundation.isActive() => boolean

Return true if tab is active.

#### MDCTabFoundation.setActive(isActive = false) => void

Set tab to active. If `isActive` is true, adds the active modifier class, otherwise removes it.

#### MDCTabFoundation.preventsDefaultOnClick() => boolean

Return true if the tab prevents the default click action

#### MDCTabFoundation.setPreventDefaultOnClick(preventDefaultOnClick = false) => void

Sets tabs `preventDefaultOnClick` property to the value of the `preventDefaultOnClick` argument passed.

#### MDCTabFoundation.measureSelf() => void

Sets `computedWidth_` and `computedLeft_` for a tab.


## Tab Bar

### Tab Bar component API

#### Properties

| Property Name | Type | Description |
| --- | --- | --- |
| `tabs` | `MDCTab[]` | _(read-only)_ An array of the tab bar's instances of MDC Tab. |
| `activeTab` | `MDCTab` | The currently active tab. Setting this makes the tab active. |
| `activeTabIndex` | `number` | The index of the currently active tab. Setting this makes the tab at the given index active. |

#### MDCTabBar.layout() => void

Proxies to the foundation's `layout()` method.

### Tab Bar Events

#### MDCTabBar:change

Broadcast when a user actions on a tab, resulting in a change in the selected tab.


### Using the Foundation Class

`mdc-tab-bar` ships with an `MDCTabBarFoundation` class that external frameworks
and libraries can use to integrate the component. As with all foundation
classes, an adapter object must be provided.


### Adapter API

| Method Signature | Description |
| --- | --- |
| `addClass(className: string) => void` | Adds a class to the root element. |
| `removeClass(className: string) => void` | Removes a class from the root element. |
| `bindOnMDCTabSelectedEvent() => void` | Adds `MDCTab:selected` event listener to root |
| `unbindOnMDCTabSelectedEvent() => void` | Removes `MDCTab:selected` event listener from root |
| `registerResizeHandler(handler: EventListener) => void` | Adds an event listener to the root element, for a resize event. |
| `deregisterResizeHandler(handler: EventListener) => void` | Removes an event listener from the root element, for a resize event. |
| `getOffsetWidth() => number` | Returns width of root element. |
| `setStyleForIndicator(propertyName: string, value: string) => void` | Sets style property for indicator. |
| `getOffsetWidthForIndicator() => number` | Returns width of indicator. |
| `notifyChange(evtData: Object) => void` | Emits `MDCTabBar:change` event, passes evtData. |
| `getNumberOfTabs() => number` | Returns number of tabs in MDC Tabs instance. |
| `getActiveTab() => MDCTab` | Returns the instance of MDCTab that is currently active. |
| `isTabActiveAtIndex(index: number) => boolean` | Returns true if tab at index is active. |
| `setTabActiveAtIndex(index: number) => void` | Sets tab active at given index. |
| `isDefaultPreventedOnClickForTabAtIndex(index: number) => boolean` | Returns true if tab does not prevent default click action. |
| `setPreventDefaultOnClickForTabAtIndex(index: number, preventDefaultOnClick: boolean)` | Sets preventDefaultOnClick for tab at given index |
| `measureTabAtIndex(index: number) => void` | sets measurements (width, left offset) for tab at given index. |
| `getComputedWidthForTabAtIndex(index: number) => number` | Returns width of tab at given index. |
| `getComputedLeftForTabAtIndex(index: number) => number` | Returns left offset of tab at given index. |


### The full foundation API

#### MDCTabBarFoundation.layout() => void

Sets layout for the Tab Bar component.

#### MDCTabBarFoundation.getActiveTabIndex() => number

Returns index of currently active tab

#### MDCTabBarFoundation.getComputedWidth() => number

Returns the width of the element containing the tabs.

#### MDCTabBarFoundation.switchToTabAtIndex(index, shouldNotify) => void

Updates the active tab to be the tab at the given index, emits `MDCTabBar:change` if `shouldNotify` is true.

#### MDCTabBarFoundation.getActiveTabIndex() => number

Returns the index of the currently active tab.


## Tab Bar Scroller

### Tab Bar Scroller component API

#### Properties

| Property Name | Type | Description |
| --- | --- | --- |
| `tabBar` | `MDCTabBar` | _(read-only)_ The scroller's tab bar. |

#### MDCTabBarScroller.layout() => void

Proxies to the foundation's `layout()` method.

### Using the Foundation Class

MDC Tab Bar Scroller ships with an `MDCTabBarScrollerFoundation` class that external frameworks and libraries can use to integrate the component. As with all foundation classes, an adapter object must be provided.


### Adapter API

| Method Signature | Description |
| --- | --- |
| `addClass(className: string) => void` | Adds a class to the root element. |
| `removeClass(className: string) => void` | Removes a class from the root element. |
| `eventTargetHasClass(target: HTMLElement, className: string) => boolean` | Returns true if target has a given class name |
| `addClassToForwardIndicator(className: string) => void` | Adds a given class to the forward indicator |
| `removeClassFromForwardIndicator(className: string) => void` | Removes a given class from the forward indicator |
| `addClassToBackIndicator(className: string) => void` | Adds a given class to the back indicator |
| `removeClassFromBackIndicator(className: string) => void` | Removes a given class from the back indicator |
| `isRTL() => boolean` | Returns true if in RTL context. False otherwise. |
| `registerBackIndicatorClickHandler(handler: EventListener) => void` | Registers an event handler to be called when a `click` event happens on the back indicator |
| `deregisterBackIndicatorClickHandler(handler: EventHandler) => void` | Deregisters an event handler from a `click` event happening on the back indicator |
| `registerForwardIndicatorClickHandler(handler: EventHandler) => void` | Registers an event handler to be called when a `click` event happens on the forward indicator |
| `deregisterForwardIndicatorClickHandler(handler: EventHandler) => void` | Deregisters an event handler from a `click` event happening on the forward indicator. |
| `registerCapturedInteractionHandler(evt: string, handler: EventHandler) => void` | Registers an event handler to be called when a `focus`, `touchstart`, or `mousedown` event happens on the root of the component. These events gets dispatched to the listener during the capture phase. They also govern the scrolling behavior when tabs are tabbed to or actioned on. |
| `deregisterCapturedInteractionHandler(evt: string, handler: EventHandler) => void` | Deregisters an event handler from a `focus`, `touchstart`, or `mousedown` events happening on the root of the component |
| `registerWindowResizeHandler(handler: EventHandler) => void` | Registers an event handler to be called when a `resize` event happens on the `window` |
| `deregisterWindowResizeHandler(handler: EventHandler) => void `| Deregisters an event handler from a `resize` event happening on the `window` |
| `getNumberOfTabs() => number` | Returns the number of tabs in the scroller's tab bar |
| `getComputedWidthForTabAtIndex(index: number) => number` | Returns the width of a tab at the given index |
| `getComputedLeftForTabAtIndex(index: number) => number` | Returns the left offset of a tab at the given index |
| `getOffsetWidthForScrollFrame() => number` | Returns the width of the scroll frame. This is the width of the visible tabs. |
| `getScrollLeftForScrollFrame() => number` | Returns the `scrollLeft` value of the scroll frame |
| `setScrollLeftForScrollFrame(scrollLeftAmount: number) => void` | Sets the value of `scrollLeft` for the scroll frame. |
| `getOffsetWidthForTabBar() => number` | Returns the width of the _entire_ tab bar, including that which is occluded. |
| `setTransformStyleForTabBar(value: string) => void` | Sets the `translateX` `transform` property for the tab bar. |
| `getOffsetLeftForEventTarget(target: HTMLElement) => number`| Returns the left offset of a given element. |
| `getOffsetWidthForEventTarget(target: HTMLElement) => number` | Returns the width of a given element. |


### The full foundation API

#### MDCTabBarScrollerFoundation.scrollBack() => void

Scrolls the tab bar such that the leftmost tab traverses the scroll frame and becomes the rightmost tab, potentially being partially, but not fully, occluded.

#### MDCTabBarScrollerFoundation.scrollForward() => void

Scrolls the tab bar such that the rightmost tab traverses the scroll frame and becomes the leftmost tab. This tabs left offset will line up with the left edge of the scroll frame, and never be partially or fully occluded.

> **NOTE:** Due to a quirk in event behavior, we allow the rightmost tab to be partially occluded even when tabbed to because clicking on such an element would shift the frame on the `focus` event. This would result in a scenario where the ripple persists and the intended tab would not be selected due to the tab bar shifting before the `mouseup` or `click` events get dispatched.

#### MDCTabBarScrollerFoundation.scrollToTabAtIndex(index: number) => void

Scrolls the tab bar such that the tab at the index provided traverses the scroll frame and becomes the leftmost tab.

#### MDCTabBarScrollerFoundation.layout() => void

If the tab bar is overflowing its available width, this method will reset the back and forward indicators to the correct states (visible/hidden) based on the new width.
