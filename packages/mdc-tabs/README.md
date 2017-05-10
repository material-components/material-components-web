# MDC Tabs

The MDC Tabs component contains components which are used to create spec-aligned tabbed navigation components adhering to the
[Material Design tabs guidelines](https://material.io/guidelines/components/tabs.html). These components are:

- **mdc-tab**: The individual tab elements
- **mdc-tab-bar**: The main component which is composed of `mdc-tab` elements

## Installation

```
npm install --save @material/tab-bar
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

#### Dark Mode Support

Like other MDC-Web components, tabs support dark mode either when an
`mdc-tab--theme-dark` class is attached to the root element, or the element has
an ancestor with class `mdc-theme--dark`.

```html
<html class="mdc-theme--dark">
  <!-- ... -->
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
  <nav id="dynamic-tab-bar" class="mdc-tab-bar mdc-tab-bar--indicator-accent" role="tablist">
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
var dynamicTabBar = window.dynamicTabBar = new mdc.tabBar.MDCTabBar(document.querySelector('#dynamic-tab-bar'));
var dots = document.querySelector('.dots');
var panels = document.querySelector('.panels');

dynamicTabBar.preventDefaultOnClick = true;

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
from each tab Element inside of the `mdc-tab-bar` node during the intialization phase
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
