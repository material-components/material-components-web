<!--docs:
title: "Select Menus"
layout: detail
section: components
iconId: menu
path: /catalog/input-controls/select-menus/
-->

# Select Menus

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components-web.appspot.com/select.html">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/selects.png" width="376" alt="Select screenshot">
  </a>
</div>-->

MDC Select provides Material Design single-option select menus. It functions analogously to the
browser's native `<select>` element, and includes a gracefully degraded version that can be used
in conjunction with the browser's native element. Both are fully accessible, and fully RTL-aware.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/text-fields.html">Material Design guidelines: Text Fields</a>
  </li>
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/components/menus.html">Material Design guidelines: Menus</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components-web.appspot.com/select.html">Demo</a>
  </li>
</ul>

## Installation

```
npm install --save @material/select
```

## Usage

### Using the full-fidelity JS component

```html
<div class="mdc-select" role="listbox">
  <div class="mdc-select__surface" tabindex="0">
    <div class="mdc-select__label">Pick a Food Group</div>
    <div class="mdc-select__selected-text"></div>
    <div class="mdc-select__bottom-line"></div>
  </div>
  <div class="mdc-menu mdc-select__menu">
    <ul class="mdc-list mdc-menu__items">
      <li class="mdc-list-item" role="option" tabindex="0">
        Bread, Cereal, Rice, and Pasta
      </li>
      <li class="mdc-list-item" role="option" tabindex="0">
        Vegetables
      </li>
      <li class="mdc-list-item" role="option" tabindex="0">
        Fruit
      </li>
      <li class="mdc-list-item" role="option" tabindex="0">
        Milk, Yogurt, and Cheese
      </li>
      <li class="mdc-list-item" role="option" tabindex="0">
        Meat, Poultry, Fish, Dry Beans, Eggs, and Nuts
      </li>
      <li class="mdc-list-item" role="option" tabindex="0">
        Fats, Oils, and Sweets
      </li>
    </ul>
  </div>
</div>
```

Then with JS

```js
const select = new mdc.select.MDCSelect(document.querySelector('.mdc-select'));
select.listen('MDCSelect:change', () => {
  alert(`Selected "${select.selectedOptions[0].textContent}" at index ${select.selectedIndex} ` +
        `with value "${select.value}"`);
});
```

See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

Note that you can include mdc-select via a UMD bundle, which will be available post-alpha.

> Note that the full-fidelity version of MDC Select requires you to manually include the styles for
[mdc-menu](../mdc-menu) and [mdc-list](../mdc-list). If you are using the
[material-components-web](../material-components-web) package, this is taken care of for you and you
simply need to import the main stylesheet. Otherwise, _you must ensure that you manually include the
style dependencies for both the mdc-list and mdc-menu for this component to function properly._

#### Select with pre-selected option

When dealing with the select component that has pre-selected values, you'll want to ensure that you
render `mdc-select__label` with the `mdc-select__label--float-above` modifier class and the selected
option with `aria-selected`. This will ensure that the label moves out of the way of the select's value
and prevents a Flash Of Un-styled Content (**FOUC**).

```html
<div class="mdc-select" role="listbox">
  <div class="mdc-select__surface" tabindex="0">
    <div class="mdc-select__label mdc-select__label--float-above">Pick a Food Group</div>
    <div class="mdc-select__selected-text"></div>
    <div class="mdc-select__bottom-line"></div>
  </div>
  <div class="mdc-menu mdc-select__menu">
    <ul class="mdc-list mdc-menu__items">
      <li class="mdc-list-item" role="option" tabindex="0">
        Bread, Cereal, Rice, and Pasta
      </li>
      <li class="mdc-list-item" role="option" tabindex="0">
        Vegetables
      </li>
      <li class="mdc-list-item" role="option" tabindex="0">
        Fruit
      </li>
      <li class="mdc-list-item" role="option" aria-selected tabindex="0">
        Milk, Yogurt, and Cheese
      </li>
      <li class="mdc-list-item" role="option" tabindex="0">
        Meat, Poultry, Fish, Dry Beans, Eggs, and Nuts
      </li>
      <li class="mdc-list-item" role="option" tabindex="0">
        Fats, Oils, and Sweets
      </li>
    </ul>
  </div>
</div>
```

#### Disabled select

```html
<div class="mdc-select" role="listbox" aria-disabled="true">
  <div class="mdc-select__surface" tabindex="-1">
    <div class="mdc-select__label">Pick a Food Group</div>
    <div class="mdc-select__selected-text"></div>
    <div class="mdc-select__bottom-line"></div>
  </div>
  <div class="mdc-menu mdc-select__menu">
    <ul class="mdc-list mdc-menu__items">
      <li class="mdc-list-item" role="option" tabindex="0">
        Bread, Cereal, Rice, and Pasta
      </li>
      <li class="mdc-list-item" role="option" tabindex="0">
        Vegetables
      </li>
      <li class="mdc-list-item" role="option" tabindex="0">
        Fruit
      </li>
      <li class="mdc-list-item" role="option"  tabindex="0">
        Milk, Yogurt, and Cheese
      </li>
      <li class="mdc-list-item" role="option" tabindex="0">
        Meat, Poultry, Fish, Dry Beans, Eggs, and Nuts
      </li>
      <li class="mdc-list-item" role="option" tabindex="0">
        Fats, Oils, and Sweets
      </li>
    </ul>
  </div>
</div>
```

#### Disabled options

When used in components such as MDC Select, `mdc-list-item`s can be disabled.
To disable a list item, set `aria-disabled` to `"true"`, and set `tabindex` to `"-1"`.

```html
<div class="mdc-select" role="listbox">
  <div class="mdc-select__surface" tabindex="0">
    <div class="mdc-select__label">Pick a Food Group</div>
    <div class="mdc-select__selected-text"></div>
    <div class="mdc-select__bottom-line"></div>
  </div>
  <div class="mdc-menu mdc-select__menu">
    <ul class="mdc-list mdc-menu__items">
      <li class="mdc-list-item" role="option" tabindex="0">
        Bread, Cereal, Rice, and Pasta
      </li>
      <li class="mdc-list-item" role="option" aria-disabled="true" tabindex="-1">
        Vegetables
      </li>
      <li class="mdc-list-item" role="option" tabindex="0">
        Fruit
      </li>
      <li class="mdc-list-item" role="option"  tabindex="0">
        Milk, Yogurt, and Cheese
      </li>
      <li class="mdc-list-item" role="option" tabindex="0">
        Meat, Poultry, Fish, Dry Beans, Eggs, and Nuts
      </li>
      <li class="mdc-list-item" role="option" tabindex="0">
        Fats, Oils, and Sweets
      </li>
    </ul>
  </div>
</div>
```

#### CSS Classes

| Class                    | Description                                     |
| ------------------------ | ----------------------------------------------- |
| `mdc-select`             | Mandatory.                                      |
| `mdc-select--box`        | Styles the select as a box select.              |
| `mdc-list-group`         | A group of options.                             |
| `mdc-list-item`          | A list item.                                    |
| `mdc-list-divider`       | A divider.                                      |

It is advised that dividers also set `role="presentation"` to disable selection and not cloud accessibility.

### Sass Mixins

To customize the colors of any part of the select, use the following mixins. We recommend you use
these mixins within CSS selectors like `.foo-select` to apply styling.

Mixin | Description
--- | ---
`mdc-select-ink-color($color)` | Customizes the color of the selected item displayed in the select.
`mdc-select-container-fill-color($color)` | Customizes the background color of the select.
`mdc-select-label-color($color)` | Customizes the label color of the select in the unfocused state.
`mdc-select-focused-label-color($color, $opacity: 0.87)` | Customizes the label color of the select when focused. Changing opacity for the label when floating is optional.
`mdc-select-bottom-line-color($color)` | Customizes the color of the default bottom line of the select.
`mdc-select-focused-bottom-line-color($color)` | Customizes the color of the bottom line of the select when focused.

To customize the color of the list items, refer to the [List documentation](../mdc-list/README.md).

### MDC Select Component API

The MDC Select component API is modeled after a subset of the `HTMLSelectElement` functionality, and
is outlined below.

#### Properties

| Property Name | Type | Description |
| --- | --- | --- |
| `value` | `string` | _(read-only)_ The `id` of the currently selected option. If no `id` is present on the selected option, its `textContent` is used. Returns an empty string when no option is selected. |
| `options` | `HTMLElement[]` | _(read-only)_ An _array_ of menu items comprising the select's options. |
| `selectedIndex` | `number` | The index of the currently selected option. Set to -1 if no option is currently selected. Changing this property will update the select element. |
| `selectedOptions` | `HTMLElement[]` | _(read-only)_ A NodeList of either the currently selected option, or no elements if nothing is selected. |
| `disabled` | `boolean` | Whether or not the component is disabled. Settings this sets the disabled state on the component. |

#### Methods

| Method Signature | Description |
| --- | --- |
| `item(index: number) => HTMLElement?` | Analogous to `HTMLSelectElement.prototype.item`. Returns the option at the specified index, or `null` if the index is out of bounds. }
| `nameditem(key: string) => HTMLElement?` | Analogous to `HTMLSelectElement.prototype.nameditem`. Returns the options either whose `id` equals the given `key`, or whose `name` attribute equals the given `key`. Returns `null` if no item with an `id` or `name` attribute of the specified key is found. |

#### Events

The MDC Select JS component emits an `MDCSelect:change` event when the selected option changes as
the result of a user action.

## Using the foundation class

MDC Select ships with a foundation class that framework authors can use to integrate MDC Select
into their custom components. Note that due to the nature of MDC Select, the adapter is quite
complex. We try to provide as much guidance as possible, but we encourage developers to reach out
to us via GH Issues if they run into problems.

### Notes for component implementors

The `MDCSelectFoundation` expects that the select component conforms to the following two requirements:

1. The component owns an element that's used as its select menu, e.g. its **menu element**.

2. The component controls an instance of `MDCMenu`, which is attached to its menu element.

We achieve this by accepting a `menuFactory` optional constructor parameter, which is a function
which is passed our menu element, and is expected to return an `MDCMenu` component instance.
If you are attempting to implement mdc-select for your framework, and you find that this approach
does not work for you, and there is no suitable way to satisfy the above two requirements, please
[open an issue](https://github.com/material-components/material-components-web/issues/new).

`MDCSelectFoundation` also has the ability to resize itself whenever its options change, via the
`resize()` method. We recommend calling this method on initialization, or when the menu items are
modified. For example, if building a react component, it may be appropriate to call `resize()`
within `componentDidUpdate`.

### Adapter API

| Method Signature | Description |
| --- | --- |
| `addClass(className: string) => void` | Adds a class to the root element. |
| `removeClass(className: string) => void` | Removes a class from the root element. |
| `floatLabel(value: boolean) => void` | Float or defloats label as necessary |
| `addClassToBottomLine(className: string) => void` | Adds a class to the bottom line |
| `removeClassFromBottomLine(className: string) => void` | Removes a class from the bottom line |
| `setBottomLineAttr(attr: string, value: string) => void` | Adds an attribute to the bottom line |
| `addBodyClass(className: string) => void` | Adds a class to the body. |
| `removeBodyClass(className: string) => void` | Removes a class from the body. |
| `setAttr(attr: string, value: string) => void` | Sets attribute `attr` to value `value` on the root element. |
| `rmAttr(attr: string) => void` | Removes attribute `attr` from the root element. |
| `computeBoundingRect() => {left: number, top: number}` | Returns an object with a shape similar to a `ClientRect` object, with a `left` and `top` property specifying the element's position on the page relative to the viewport. The easiest way to achieve this is by calling `getBoundingClientRect()` on the surface element. |
| `registerInteractionHandler(type: string, handler: EventListener) => void` | Adds an event listener `handler` for event type `type` on the surface element. |
| `deregisterInteractionHandler(type: string, handler: EventListener) => void` | Removes an event listener `handler` for event type `type` on the surface element. |
| `focus() => void` | Focuses the surface element |
| `makeTabbable() => void` | Allows the surface element to be tab-focused via keyboard. We achieve this by setting the surface element's `tabIndex` property to `0`. |
| `makeUntabbable() => void` | Disallows the surface element from being tab-focused via keyboard. We achieve this by setting the surface element's `tabIndex` property to `-1`. |
| `getComputedStyleValue(propertyName: string) => string` | Get the surface element's computed style value of the given dasherized css property `propertyName`. We achieve this via `getComputedStyle(...).getPropertyValue(propertyName). `|
| `setStyle(propertyName: string, value: string) => void` | Sets a dasherized css property `propertyName` to the value `value` on the surface element. We achieve this via `root.style.setProperty(propertyName, value)`. |
| `create2dRenderingContext() => {font: string, measureText: (string) => {width: number}}` | Returns an object which has the shape of a CanvasRenderingContext2d instance. Namely, it has a string property `font` which is writable, and a method `measureText` which given a string of text returns an object containing a `width` property specifying how wide that text should be rendered in the `font` specified by the font property. An easy way to achieve this is simply `document.createElement('canvas').getContext('2d');`. |
| `setMenuElStyle(propertyName: string) => void` | Sets a dasherized css property `propertyName` to the value `value` on the menu element. |
| `setMenuElAttr(attr: string, value: string) => void` | Sets attribute `attr` to value `value` on the menu element. |
| `rmMenuElAttr(attr: string) => void` | Removes attribute `attr` from the menu element. |
| `getMenuElOffsetHeight() => number` | Returns the `offsetHeight` of the menu element. |
| `openMenu(focusIndex: string) => void` | Opens the select's menu with focus on the option at the given `focusIndex`. The focusIndex is guaranteed to be in bounds. |
| `isMenuOpen() => boolean` | Returns true if the menu is open, false otherwise. |
| `setSelectedTextContent(selectedTextContent: string) => void` | Sets the text content of the `.mdc-select__selected-text` element to `selectedTextContent`. |
| `getNumberOfOptions() => number` | Returns the number of options contained in the select's menu. |
| `getTextForOptionAtIndex(index: number) => string` | Returns the text content for the option at the specified index within the select's menu. |
| `getValueForOptionAtIndex(index: number) => string` | Returns the value for the option at the specified index within the select's menu. We adhere to the conventions of `HTMLSelectElement` - as described above - returning the value of the selected option's `id` in place of a `value` attribute and falling back to its `textContent`. Framework implementations may want to customize this method to suit their needs. |
| `setAttrForOptionAtIndex(index: number, attr: string, value: string) => void` | Sets an attribute `attr` to value `value` for the option at the specified index within the select's menu. |
| `rmAttrForOptionAtIndex(index: number, attr: string) => void` | Removes an attribute `attr` for the option at the specified index within the select's menu. |
| `getOffsetTopForOptionAtIndex(index: number) => number` | Returns the `offsetTop` of the option element at the specified index. The index is guaranteed to be in bounds. |
| `registerMenuInteractionHandler(type: string, handler: EventListener) => void` | Registers an event listener on the menu component's root element. Note that we will always listen for `MDCMenu:selected` for change events, and `MDCMenu:cancel` to know that we need to close the menu. If you are using a different events system, you could check the event type for either one of these strings and take the necessary steps to wire it up. |
| `deregisterMenuInteractionHandler(type: string, handler: EventListener) => void` | Opposite of `registerMenuInteractionHandler`. |
| `notifyChange() => void` | Broadcast a change event, similar to the `change` event emitted by an `HTMLSelectElement`. While we use custom events in our implementation for this, you can use any mechanism desired for notifications, such as callbacks, reactive streams, etc. Note that you can also pass data within your event if you'd like via `foundation.getValue()` and `foundation.getSelectedIndex()`. |
| `getWindowInnerHeight() => number` | Returns the `innerHeight` property of the `window` element. |

### The full foundation API

#### MDCSelectFoundation.getValue() => string

Returns the value of the currently selected option, or an empty string if no option is selected.

#### MDCSelectFoundation.getSelectedIndex() => number

Returns the index of the currently selected option. Returns -1 if no option is currently selected.

#### MDCSelectFoundation.setSelectedIndex(selectedIndex: number) => void

Sets the selected index of the component.

#### MDCSelectFoundation.isDisabled() => boolean

Returns whether or not the select is disabled.

#### MDCSelectFoundation.setDisabled(disabled: boolean) => void

Enables/disables the select.

## Theming

The select's bottom border is set to the current theme's primary color when focused.
