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

MDC Select provides Material Design single-option and multi-option select menus. It functions analogously to the
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
<div class="mdc-select" role="listbox" tabindex="0">
  <span class="mdc-select__selected-text">Pick a food group</span>
  <div class="mdc-simple-menu mdc-select__menu">
    <ul class="mdc-list mdc-simple-menu__items">
      <li class="mdc-list-item" role="option" id="grains" aria-disabled="true">
        Pick a food group
      </li>
      <li class="mdc-list-item" role="option" id="grains" tabindex="0">
        Bread, Cereal, Rice, and Pasta
      </li>
      <li class="mdc-list-item" role="option" id="vegetables" tabindex="0">
        Vegetables
      </li>
      <li class="mdc-list-item" role="option" id="fruit" tabindex="0">
        Fruit
      </li>
      <li class="mdc-list-item" role="option" id="dairy" tabindex="0">
        Milk, Yogurt, and Cheese
      </li>
      <li class="mdc-list-item" role="option" id="meat" tabindex="0">
        Meat, Poultry, Fish, Dry Beans, Eggs, and Nuts
      </li>
      <li class="mdc-list-item" role="option" id="fats" tabindex="0">
        Fats, Oils, and Sweets
      </li>
    </ul>
  </div>
</div>
```

Then with JS

```js
import {MDCSelect} from '@material/select';

const select = new MDCSelect(document.querySelector('.mdc-select'));
select.listen('MDCSelect:change', () => {
  alert(`Selected "${select.selectedOptions[0].textContent}" at index ${select.selectedIndex} ` +
        `with value "${select.value}"`);
});
```

Note that you can include mdc-select via a UMD bundle, which will be available post-alpha.

> Note that the full-fidelity version of MDC Select requires you to manually include the styles for
[mdc-menu](../mdc-menu) and [mdc-list](../mdc-list). If you are using the
[material-components-web](../material-components-web) package, this is taken care of for you and you
simply need to import the main stylesheet. Otherwise, _you must ensure that you manually include the
style dependencies for both the mdc-list and mdc-menu for this component to function properly._

#### Select with pre-selected option

```html
<div class="mdc-select" role="listbox" tabindex="0">
  <span class="mdc-select__selected-text">Vegetables</span>
  <div class="mdc-simple-menu mdc-select__menu">
    <ul class="mdc-list mdc-simple-menu__items">
      <li class="mdc-list-item" role="option" id="grains" tabindex="0">
        Bread, Cereal, Rice, and Pasta
      </li>
      <li class="mdc-list-item" role="option" aria-selected id="vegetables" tabindex="0">
        Vegetables
      </li>
      <li class="mdc-list-item" role="option" id="fruit" tabindex="0">
        Fruit
      </li>
      <li class="mdc-list-item" role="option" id="dairy" tabindex="0">
        Milk, Yogurt, and Cheese
      </li>
      <li class="mdc-list-item" role="option" id="meat" tabindex="0">
        Meat, Poultry, Fish, Dry Beans, Eggs, and Nuts
      </li>
      <li class="mdc-list-item" role="option" id="fats" tabindex="0">
        Fats, Oils, and Sweets
      </li>
    </ul>
  </div>
</div>
```

#### Disabled select

```html
<div class="mdc-select mdc-select--disabled" role="listbox" aria-disabled="true" tabindex="-1">
  <span class="mdc-select__selected-text">Pick a food group</span>
  <div class="mdc-simple-menu mdc-select__menu">
    <ul class="mdc-list mdc-simple-menu__items">
      <li class="mdc-list-item" role="option" id="grains" tabindex="0">
        Bread, Cereal, Rice, and Pasta
      </li>
      <li class="mdc-list-item" role="option" id="vegetables" tabindex="0">
        Vegetables
      </li>
      <li class="mdc-list-item" role="option" id="fruit" tabindex="0">
        Fruit
      </li>
      <li class="mdc-list-item" role="option" id="dairy" tabindex="0">
        Milk, Yogurt, and Cheese
      </li>
      <li class="mdc-list-item" role="option" id="meat" tabindex="0">
        Meat, Poultry, Fish, Dry Beans, Eggs, and Nuts
      </li>
      <li class="mdc-list-item" role="option" id="fats" tabindex="0">
        Fats, Oils, and Sweets
      </li>
    </ul>
  </div>
</div>
```

#### Disabled options

When used in components such as MDC Select, `mdc-list-item`'s can be disabled.
To disable a list item, set `aria-disabled` to `"true"`, and set `tabindex` to `"-1"`.

```html
<div class="mdc-select" role="listbox">
  <span class="mdc-select__selected-text">Pick a food group</span>
  <div class="mdc-simple-menu mdc-select__menu">
    <ul class="mdc-list mdc-simple-menu__items">
      <li class="mdc-list-item" role="option" id="grains" tabindex="0">
        Bread, Cereal, Rice, and Pasta
      </li>
      <li class="mdc-list-item" role="option" id="vegetables" tabindex="-1" aria-disabled="true">
        Vegetables (Disabled)
      </li>
      <li class="mdc-list-item" role="option" id="fruit" tabindex="0">
        Fruit
      </li>
      <li class="mdc-list-item" role="option" id="dairy" tabindex="0">
        Milk, Yogurt, and Cheese
      </li>
      <li class="mdc-list-item" role="option" id="meat" tabindex="0">
        Meat, Poultry, Fish, Dry Beans, Eggs, and Nuts
      </li>
      <li class="mdc-list-item" role="option" id="fats" tabindex="0">
        Fats, Oils, and Sweets
      </li>
    </ul>
  </div>
</div>
```

### Using the Pure CSS Select

The `mdc-select` CSS class also works on browser's native `<select>` elements, allowing for a
seamless, un-invasive experience in browsers where a native select may be more appropriate, such as
on a mobile device. It does not require any javascript, nor any CSS for `mdc-menu` or `mdc-list`.

```html
<select class="mdc-select">
  <option value="" selected>Pick a food</option>
  <option value="grains">Bread, Cereal, Rice, and Pasta</option>
  <option value="vegetables">Vegetables</option>
  <optgroup label="Fruits">
    <option value="apple">Apple</option>
    <option value="oranges">Orange</option>
    <option value="banana">Banana</option>
  </optgroup>
  <option value="dairy">Milk, Yogurt, and Cheese</option>
  <option value="meat">Meat, Poultry, Fish, Dry Beans, Eggs, and Nuts</option>
  <option value="fats">Fats, Oils, and Sweets</option>
</select>
```

### Multi Select

MDC-Web implements multi-select on top of the `<select multiple>` element.

```html
<select multiple size="6" class="mdc-multi-select mdc-list" >
  <optgroup class="mdc-list-group" label="Starches">
    <option class="mdc-list-item">
      Potato
    </option>
    <option class="mdc-list-item">
      Cereal
    </option>
  </optgroup>
  <option class="mdc-list-divider" role="presentation" disabled />
  <option>
    misc...
  </option>
</select>
```

Select elements take a `size` attribute to determine the height of the select box.

If you'd like to maintain the width or height outside of the attribute, you'll need to set it in your styles:

```css
.my-select-container .mdc-select {
  width: 300px;
  height: 550px;
}
```

#### Classes

| Class                    | Description                                     |
| ------------------------ | ----------------------------------------------- |
| `mdc-select`             | A pure css `select` element                     |
| `mdc-list-group`         | A group of options.                             |
| `mdc-list-item`          | A list item.                                    |
| `mdc-list-divider`       | A divider.                                      |

It is advised that dividers also set `role="presentation"` to disable selection and not cloud accessibility.

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

#### Instantiating using a custom `MDCSimpleMenu` component.

`MDCSelect` controls an [MDCSimpleMenu](../mdc-menu) instance under the hood in order to display
its options. If you'd like to instantiate a custom menu instance, you can provide an optional 3rd
`menuFactory` argument to `MDCSelect`'s constructor.

```js
const menuFactory = menuEl => {
  const menu = new MDCSimpleMenu(menuEl);
  // Do stuff with menu...
  return menu;
};
const selectEl = document.querySelector('.mdc-select');
const select = new MDCSelect(selectEl, /* foundation */ undefined, menuFactory);
```

The `menuFactory` function is passed an `HTMLElement` and is expected to return an `MDCSimpleMenu`
instance attached to that element. This is mostly used for testing purposes, but it's there if you
need it nonetheless.

## Using the foundation class

MDC Select ships with a foundation class that framework authors can use to integrate MDC Select
into their custom components. Note that due to the nature of MDC Select, the adapter is quite
complex. We try to provide as much guidance as possible, but we encourage developers to reach out
to us via GH Issues if they run into problems.

### Notes for component implementors

The `MDCSelectFoundation` expects that the select component conforms to the following two requirements:

1. The component owns an element that's used as its select menu, e.g. its **menu element**.

2. The component controls an instance of `MDCSimpleMenu`, which is attached to its menu element.

We achieve this by accepting a `menuFactory` optional constructor parameter, which is a function
which is passed our menu element, and is expected to return an `MDCSimpleMenu` component instance.
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
| `addBodyClass(className: string) => void` | Adds a class to the body. |
| `removeBodyClass(className: string) => void` | Removes a class from the body. |
| `setAttr(attr: string, value: string) => void` | Sets attribute `attr` to value `value` on the root element. |
| `rmAttr(attr: string) => void` | Removes attribute `attr` from the root element. |
| `computeBoundingRect() => {left: number, top: number}` | Returns an object with a shape similar to a `ClientRect` object, with a `left` and `top` property specifying the element's position on the page relative to the viewport. The easiest way to achieve this is by calling `getBoundingClientRect()` on the root element. |
| `registerInteractionHandler(type: string, handler: EventListener) => void` | Adds an event listener `handler` for event type `type` on the root element. |
| `deregisterInteractionHandler(type: string, handler: EventListener) => void` | Removes an event listener `handler` for event type `type` on the root element. |
| `focus() => void` | Focuses the root element |
| `makeTabbable() => void` | Allows the root element to be tab-focused via keyboard. We achieve this by setting the root element's `tabIndex` property to `0`. |
| `makeUntabbable() => void` | Disallows the root element to be tab-focused via keyboard. We achieve this by setting the root element's `tabIndex` property to `-1`. |
| `getComputedStyleValue(propertyName: string) => string` | Get the root element's computed style value of the given dasherized css property `propertyName`. We achieve this via `getComputedStyle(...).getPropertyValue(propertyName). `|
| `setStyle(propertyName: string, value: string) => void` | Sets a dasherized css property `propertyName` to the value `value` on the root element. We achieve this via `root.style.setProperty(propertyName, value)`. |
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
| `registerMenuInteractionHandler(type: string, handler: EventListener) => void` | Registers an event listener on the menu component's root element. Note that we will always listen for `MDCSimpleMenu:selected` for change events, and `MDCSimpleMenu:cancel` to know that we need to close the menu. If you are using a different events system, you could check the event type for either one of these strings and take the necessary steps to wire it up. |
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

The select's bottom border is set to the current theme's primary color when focused. The select is
fully dark theme aware.

## Tips / Tricks

### Switching between selects for better cross-device UX

Selects are a tricky beast on the web. Many times, a custom select component will work well on large
devices with mouse/keyboard capability, but fail miserably on smaller-scale devices without
fine-grained pointer capability, such as a phone. Because `mdc-select` works on native selects, you
can easily switch between a custom select on larger devices and a native element on smaller ones.

First, wrap both a custom select and a native select within a wrapper element, let's call it the
`select-manager`.

```html
<div class="select-manager">
  <!-- Custom MDC Select, shown on desktop -->
  <div class="mdc-select" role="listbox" tabindex="0">
    <span class="mdc-select__selected-text">Pick one</span>
    <div class="mdc-simple-menu mdc-select__menu">
      <ul class="mdc-list mdc-simple-menu__items">
        <li class="mdc-list-item" role="option" id="a" tabindex="0">A</li>
        <li class="mdc-list-item" role="option" id="b" tabindex="0">B</li>
        <li class="mdc-list-item" role="option" id="c" tabindex="0">C</li>
      </ul>
    </div>
  </div>
  <!-- Native element, shown on mobile devices -->
  <select class="mdc-select">
    <option value="" selected disabled>Pick one</option>
    <option value="a">A</option>
    <option value="b">B</option>
    <option value="c">C</option>
  </select>
</div>
```

Then, write some CSS that implements a media query checking for a small screen as well as
[course pointer interaction](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/pointer). This
will ensure that the custom select will still be present on smaller devices that do have
mouse/keyboard capability, such as a hybrid tablet or a small browser window on a desktop.

```css
.select-manager > select.mdc-select {
  display: none;
}

@media (max-width: 600px) and (pointer: coarse) {
  .select-manager > .mdc-select[role="listbox"] {
    display: none;
  }

  .select-manager > select.mdc-select {
    display: block;
  }
}
```

Finally, we need to be able to react to events and keep each component in sync. We can do this in
a few lines of JS, and check where the event came from by looking at its `type`. If it came from the
custom component, the type will be `MDCSelect:change`, otherwise it will simply be `change`.

```js
const selectManager = document.querySelector('.select-manager');
const selects = {
  custom: MDCSelect.attachTo(selectManager.querySelector('.mdc-select[role="listbox"]')),
  native: MDCSelect.attachTo(selectManager.querySelector('select.mdc-select'))
};
const changeHandler = ({type}) =>  {
  let changedSelect, selectToUpdate, value;
  if (type === 'MDCSelect:change') {
    changedSelect = selects.custom;
    selectToUpdate = selects.native;
    value = changedSelect.selectedOptions[0].id;
  } else {
    changeSelect = selects.native;
    selectToUpdate = selects.custom;
    value = changedSelect.selectedOptions[0].value;
  }
  selectToUpdate.selectedIndex = changedSelect.selectedIndex;
  console.info('Selected value', value);
};
selects.custom.listen('MDCSelect:change', changeHandler);
selects.native.addEventListener('change', changeHandler);
```

We are looking into building this functionality into `MDCSelect` in the future.
