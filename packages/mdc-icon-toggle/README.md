<!--docs:
title: "Icon Toggle Buttons"
layout: detail
section: components
iconId: button
path: /catalog/buttons/icon-toggle-buttons/
-->

# Icon Toggle Buttons

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/icon-toggle.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/icon-toggles.png" width="20" alt="Icon toggles screenshot">
  </a>
</div>-->

MDC Icon Toggle provides a Material Design icon toggle button. It is fully accessible, and is
designed to work with any icon set.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/buttons.html#buttons-toggle-buttons">Material Design guidelines: Toggle buttons</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/icon-toggle.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install --save @material/icon-toggle
```

## Usage

In order to use MDC Icon Toggle, you will need to import an icon set, such as [Material Icons](https://design.google.com/icons/) or [Font Awesome](http://fontawesome.io/).

```html
<i class="mdc-icon-toggle material-icons" role="button" aria-pressed="false"
   aria-label="Add to favorites" tabindex="0"
   data-toggle-on='{"label": "Remove from favorites", "content": "favorite"}'
   data-toggle-off='{"label": "Add to favorites", "content": "favorite_border"}'>
  favorite_border
</i>
```

Then in JS

```js
import {MDCIconToggle} from 'mdc-icon-toggle';

MDCIconToggle.attachTo(document.querySelector('.mdc-icon-toggle'));
```

Note that you can access `MDCIconToggle` via CommonJS/AMD using the `default` property of the
`require`d object, as well as globally via `mdc.IconToggle`.

Also note that you may omit the initial `aria-label` attribute and `favorite_border` content since
they will be added by the component. However, we recommend adding to prevent an initial flash of
un-styled content.

### Using with Font Awesome and similar libraries

Font Awesome - as well as other popular icon font libraries - use pseudo-elements in order to
provide the icon, via the `content` property. However, MDC-Web uses pseudo-elements for ripple styles.
In order to get around this, you can nest the icon itself inside the icon toggle.

```html
<span class="mdc-icon-toggle" role="button" aria-pressed="false"
      aria-label="Star this item" tabindex="0"
      data-icon-inner-selector=".fa"
      data-toggle-on='{"cssClass": "fa-star", "label": "Unstar this item"}'
      data-toggle-off='{"cssClass": "fa-star-o", "label": "Star this item"}'>
  <i class="fa fa-star-o" aria-hidden="true"></i>
</span>
```

`data-icon-inner-selector` tells MDCIconToggle to look for an element within itself that matches
that selector, and treat it as the element containing the icon. Also note the `aria-hidden`
attribute on the icon. This is important to ensure that screen readers produce the correct output
when reading this element.

### Configuring the icon toggle states

Note the use of `data-toggle-on` and `data-toggle-off` in the above examples. When an MDCIconToggle
instance is toggled, it looks at this data to determine how to update the element. This is what
allows MDCIconToggle to be so flexible. The `data-toggle-on` configuration will be used when the is
MDCIconToggle is toggled on, and vice versa for `data-toggle-off`. Both data attributes are encoded
as JSON and can contain the following properties:

| Property | Description |
| --- | --- |
| `label` | The value to apply to the element's "aria-label" attribute. |
| `content` | The text content to set on the element. Note that if an inner icon is used, the text content will be set on that element instead. |
| `cssClass` | A css class to apply to the icon element for the given toggle state. The same rules regarding inner icon elements described for `content` apply here as well. |

### Disabled icon toggles

```html
<i class="material-icon mdc-icon-toggle mdc-icon-toggle--disabled"
   role="button" tabindex="-1" aria-pressed="false" aria-disabled="true"
   data-toggle-on='{"content": "favorite"}' data-toggle-off='{"content": "favorite_border"}'></i>
```

### Theming

`mdc-icon-toggle` ships with two css classes, `mdc-icon-toggle--primary` and
`mdc-icon-toggle--accent` that allow you to color mdc-icon-toggle based on your primary and accent
colors, respectively.

### Listening for change events

`MDCIconToggle` emits an `MDCIconToggle:change` custom event when the value of the icon toggle
changes _as a result of user input_. This decision was made to align with how `change` events work
for normal inputs. In addition, these events do not bubble and cannot be cancelled.

The custom event's `detail` object contains a property `isOn` denoting whether or not the component
is toggled on.

```js
const iconEl = document.querySelector('.mdc-icon-toggle');
const status = document.getElementById('status');
iconEl.addEventListener('MDCIconToggle:change', ({detail}) => {
  status.textContent = `Icon Toggle is ${detail.isOn ? 'on' : 'off'}`;
});
```

### Refreshing the toggle data via the vanilla component.

When the icon toggle is initialized, the `data-toggle-on` and `data-toggle-off` attributes are
cached to prevent redundant JSON parsing whenever the element is interacted with. However, if you
need to, you can call `refreshToggleData()`:

```js
iconToggle.refreshToggleData();
```

This simply forwards a call to the foundation's `refreshToggleData()` method, causing the
`data-toggle-*` attributes to be re-parsed and updated.

This method is useful for frameworks that incrementally render DOM. If an icon toggle's data
attributes change, the component needs a way to update itself. This is the reason why this method is
exposed on the foundation, and simply proxied by the vanilla component.

### MDCIconToggle API

Similar to regular DOM elements, the `MDCIconToggle` functionality is exposed through accessor
methods.

#### MDCIconToggle.on

Boolean. Returns whether or not the icon toggle is currently toggled on. Setting this property
will update the toggle state.

#### MDCIconToggle.disabled

Boolean. Returns whether or not the icon toggle is currently disabled. Setting this property will
update the disabled state.

### Using the Foundation Class

MDCIconToggle ships with an `MDCIconToggleFoundation` class that external frameworks and libraries
can use to build their own MDCIconToggle components with minimal effort. As with all foundation
classes, an adapter object must be provided. The adapter for icon toggles must provide the following
functions, with correct signatures:

| Method Signature | Description |
| --- | --- |
| `addClass(className: string) => void` | Adds a class to the root element, or the inner icon element. |
| `removeClass(className: string) => void` | Removes a class from the root element, or the inner icon element. |
| `registerInteractionHandler(type: string, handler: EventListener) => void` | Registers an event handler for an interaction event, such as `click` or `keydown`. |
| `deregisterInteractionHandler(type: string, handler: EventListener) => void` | Removes an event handler for an interaction event, such as `click` or `keydown`. |
| `setText(text: string) => void` | Sets the text content of the root element, or the inner icon element. |
| `getTabIndex() => number` | Returns the tab index of the root element. |
| `setTabIndex(tabIndex: number) => void` | Sets the tab index of the root element. |
| `getAttr(name: string) => string` | Returns the value of the attribute `name` on the root element. Can also return `null`, similar to `getAttribute()`. |
| `setAttr(name: string, value: string) => void` | Sets the attribute `name` to `value` on the root element. |
| `rmAttr(name: string) => void` | Removes the attribute `name` on the root element. |
| `notifyChange(evtData: {isOn: boolean}) => void` | Broadcasts a change notification, passing along the `evtData` to the environment's event handling system. In our vanilla implementation, Custom Events are used for this. |

#### Adapter implementer considerations

If you are writing your own adapter, one thing that needs to be considered is the use of
`data-icon-inner-selector`. This is handled by us at the _component_ level, which means our
foundation is completely unaware of it. To that end, if your framework's Icon Toggle support inner
icon elements, you must ensure that `addClass`, `removeClass`, and `setText` apply to the correct
icon element.

Also note that _ripples require their own foundation at the component level_. Check out our vanilla
implementation in `index.js` as a starting point.

#### Full foundation API

##### MDCIconToggleFoundation.refreshToggleData() => void

As described above, the `data-toggle-*` attributes are cached so as not to have to perform redundant
parsing. If your framework performs incremental rendering, and these attributes change without
re-rendering the component itself, you can call this method to re-parse the data attributes and keep
the foundation updated.

##### MDCIconToggleFoundation.isOn() => boolean

Returns true if the foundation's state is toggled on, false otherwise.

##### MDCIconToggleFoundation.toggle(isOn: boolean = !this.isOn()) => void

Toggles the foundation's state, updating the component via the adapter methods. Defaults to the
toggling the opposite of the current state if no argument given. If an argument is given, will
toggle on if true, off if false.

##### MDCIconToggleFoundation.isDisabled() => boolean

Returns true if the foundation's state is disabled, false otherwise.

##### MDCIconToggleFoundation.setDisabled(isDisabled: boolean) => void

Enables / disables the foundation's state, updating the component via the adapter methods.

##### MDCIconToggleFoundation.isKeyboardActivated() => boolean

Returns true if the foundation is currently activated by a keyboard event, false otherwise.
Useful for MDCRippleFoundation's `isSurfaceActive()` adapter method.
