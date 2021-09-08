<!--docs:
title: "Menus"
layout: detail
section: components
excerpt: "Non-cascading Material Design menus."
iconId: menu
path: /catalog/menus/
-->

# Menus

A menu displays a list of choices on a temporary surface. They appear when users interact with a button, action,
or other control.

## Important Changes

Menu is currently being updated to use the new List implementation. For now,
please continue to use the old implementation (`mdc-deprecated-list` and
associated DOM/classes) instead of the new one (`mdc-list`).

See the [List documentation](../mdc-list/README.md) for more information.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/go/design-menus">Material Design guidelines: Menus</a>
  </li>
  <li class="icon-list-item icon-list-item--link">
    <a href="https://material-components.github.io/material-components-web-catalog/#/component/menu">Demo</a>
  </li>
</ul>

## Installation

```
npm install @material/menu
```

## Basic Usage

### HTML Structure

```html
<div class="mdc-menu mdc-menu-surface">
  <ul class="mdc-deprecated-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
    <li class="mdc-deprecated-list-item" role="menuitem">
      <span class="mdc-deprecated-list-item__ripple"></span>
      <span class="mdc-deprecated-list-item__text">A Menu Item</span>
    </li>
    <li class="mdc-deprecated-list-item" role="menuitem">
      <span class="mdc-deprecated-list-item__ripple"></span>
      <span class="mdc-deprecated-list-item__text">Another Menu Item</span>
    </li>
  </ul>
</div>
```

### Styles

```scss
@use "@material/list/mdc-list";
@use "@material/menu-surface/mdc-menu-surface";
@use "@material/menu/mdc-menu";
```

### JavaScript Instantiation

```js
import {MDCMenu} from '@material/menu';

const menu = new MDCMenu(document.querySelector('.mdc-menu'));
menu.open = true;
```

> See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

## Variants

### Selection Group Menu

Menus can contain a group of list items that can represent the selection state of elements within the group.

```html
<div class="mdc-menu mdc-menu-surface" id="demo-menu">
  <ul class="mdc-deprecated-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
    <li>
      <ul class="mdc-menu__selection-group">
        <li class="mdc-deprecated-list-item" role="menuitem">
          <span class="mdc-deprecated-list-item__ripple"></span>
          <span class="mdc-deprecated-list-item__graphic mdc-menu__selection-group-icon">
            ...
          </span>
          <span class="mdc-deprecated-list-item__text">Single</span>
        </li>
        <li class="mdc-deprecated-list-item" role="menuitem">
          <span class="mdc-deprecated-list-item__ripple"></span>
          <span class="mdc-deprecated-list-item__graphic mdc-menu__selection-group-icon">
           ...
          </span>
          <span class="mdc-deprecated-list-item__text">1.15</span>
        </li>
      </ul>
    </li>
    <li class="mdc-deprecated-list-divider" role="separator"></li>
    <li class="mdc-deprecated-list-item" role="menuitem">
      <span class="mdc-deprecated-list-item__ripple"></span>
      <span class="mdc-deprecated-list-item__text">Add space before paragraph</span>
    </li>
    ...
  </ul>
</div>
```

### Disabled Menu Items

Menu items can be disabled by adding the `mdc-deprecated-list-item--disabled` modifier class (from [MDC List](../mdc-list)).
Disabled menu items will be excluded from keyboard navigation.

### Anchors and Positioning

#### Anchored To Parent

The menu can be positioned to automatically anchor to a parent element when opened.

```html
<div id="toolbar" class="toolbar mdc-menu-surface--anchor">
  <div class="mdc-menu mdc-menu-surface">
  ...
  </div>
</div>
```

#### Anchor To Element Within Wrapper

The menu can be positioned to automatically anchor to another element, by wrapping the other element with the anchor class.

```html
<div id="demo-menu" class="mdc-menu-surface--anchor">
  <button id="menu-button">Open Menu</button>
  <div class="mdc-menu mdc-menu-surface">
  ...
  </div>
</div>
```

#### Fixed Position

The menu can use fixed positioning when being displayed.

```html
<div class="mdc-menu mdc-menu-surface">
...
</div>
```

```js
// ...
menu.setFixedPosition(true);
```

#### Absolute Position

The menu can use absolutely positioned when being displayed.

```html
<div class="mdc-menu mdc-menu-surface">
...
</div>
```

```js
// ...
menu.setAbsolutePosition(100, 100);
```

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-menu` | Required on the root element
`mdc-menu-surface` | Required on the root element. See [`mdc-menu-surface` documentation](../mdc-menu-surface) for other `mdc-menu-surface` classes.
`mdc-deprecated-list` | Required on the nested `ul` element. See [`mdc-list` documentation](../mdc-list) for other `mdc-deprecated-list` classes.
`mdc-menu__selection-group` | Used to wrap a group of `mdc-deprecated-list-item` elements that will represent a selection group.
`mdc-menu__selection-group-icon` | Required when using a selection group to indicate which item is selected. Should contain an icon or svg that indicates the selected state of the list item.
`mdc-menu-item--selected` | Used to indicate which element in a selection group is selected.

### Sass Mixins

Mixin | Description
--- | ---
`width($width)` | Used to set the `width` of the menu. When used without units (e.g. `4` or `5`) it computes the `width` by multiplying by the base width (`56px`). When used with units (e.g. `240px`, `15%`, or `calc(200px + 10px)` it sets the `width` to the exact value provided.
`min-width($min-width)` | Sets the `min-width` of the menu. Use with units (e.g. `240px`, `15%`, or `calc(200px + 10px)` only.

> See [Menu Surface](../mdc-menu-surface/README.md#sass-mixins) and [List](../mdc-list/README.md#sass-mixins) documentation for additional style customization options.

### Accessibility

Please see [Menu Button](https://www.w3.org/TR/wai-aria-practices/#menubutton) WAI-ARIA practices article for details on recommended Roles, States, and Properties for menu button (button that opens a menu).

With focus on the menu button:

  * <kbd>Enter</kbd>, <kbd>Space</kbd> & <kbd>Down Arrow</kbd> opens the menu and places focus on the first menu item.
  * <kbd>Up Arrow</kbd> opens the menu and moves focus to the last menu item.
  * The focus is set to list root element (where `role="menu"` is set) when clicked or touched. MDC List handles the keyboard navigation once it receives the focus.

Use `setDefaultFocusState` method to set default focus state that will be focused every time when menu is opened.

Focus state | Description
--- | ---
`DefaultFocusState.FIRST_ITEM` | Focuses the first menu item. Set this when menu button receives <kbd>Enter</kbd>, <kbd>Space</kbd>, <kbd>Down Arrow</kbd>.
`DefaultFocusState.LAST_ITEM` | Focuses the last menu item. Set this when menu button receives <kbd>Up arrow</kbd>.
`DefaultFocusState.LIST_ROOT` | Focuses the list root. Set this when menu button Clicked or Touched.
`DefaultFocusState.NONE` | Does not change the focus. Set this if you do not want the menu to grab focus on open. (Autocomplete dropdown menu, for example).

## `MDCMenu` Properties and Methods

See [Importing the JS component](../../docs/importing-js.md) for more information on how to import JavaScript.

Property | Value Type | Description
--- | --- | ---
`open` | Boolean | Proxies to the menu surface's `open` property.
`items` | `Array<Element>` | Proxies to the list to query for all `.mdc-deprecated-list-item` elements.
`quickOpen` | Boolean | Proxies to the menu surface `quickOpen` property.
`wrapFocus` | Boolean | Proxies to list's `wrapFocus` property.
`hasTypeahead` | Boolean | Proxies to the list's `hasTypeahead` property.

Method Signature | Description
--- | ---
`setAnchorCorner(Corner) => void` | Proxies to the menu surface's `setAnchorCorner(Corner)` method.
`setAnchorMargin(Partial<MDCMenuDistance>) => void` | Proxies to the menu surface's `setAnchorMargin(Partial<MDCMenuDistance>)` method.
`setAbsolutePosition(x: number, y: number) => void` | Proxies to the menu surface's `setAbsolutePosition(x: number, y: number)` method.
`setFixedPosition(isFixed: boolean) => void` | Proxies to the menu surface's `setFixedPosition(isFixed: boolean)` method.
`setSelectedIndex(index: number) => void` | Sets the list item to the selected state at the specified index.
`setIsHoisted(isHoisted: boolean) => void` | Proxies to the menu surface's `setIsHoisted(isHoisted: boolean)` method.
`setAnchorElement(element: Element) => void` | Proxies to the menu surface's `setAnchorElement(element)` method.
`getOptionByIndex(index: number) => Element \| null` | Returns the list item at the `index` specified.
`getPrimaryTextAtIndex(index: number) => string` | Returns the primary text at the `index` specified.
`getDefaultFoundation() => MDCMenuFoundation` | Returns the foundation.
`setDefaultFocusState(focusState: DefaultFocusState) => void` | Sets default focus state where the menu should focus every time when menu is opened. Focuses the list root (`DefaultFocusState.LIST_ROOT`) element by default.
`setEnabled(index: number, isEnabled: boolean) => void` | Sets the enabled state to `isEnabled` for the menu item at given `index`.
`layout() => void` | Proxies to the list's layout method.
`typeaheadMatchItem(nextChar: string) => number` | Adds a character to the typeahead buffer and returns index of the next item in the list matching the buffer.

> See [Menu Surface](../mdc-menu-surface/README.md) and [List](../mdc-list/README.md) documentation for more information on proxied methods and properties.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create a Menu for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### `MDCMenuAdapter`

Method Signature | Description
--- | ---
`addClassToElementAtIndex(index: number, className: string) => void` | Adds the `className` class to the element at the `index` specified.
`removeClassFromElementAtIndex(index: number, className: string) => void` | Removes the `className` class from the element at the `index` specified.
`addAttributeToElementAtIndex(index: number, attr: string, value: string) => void` | Adds the `attr` attribute with value `value` to the element at the `index` specified.
`removeAttributeFromElementAtIndex(index: number, attr: string) => void` | Removes the `attr` attribute from the element at the `index` specified.
`elementContainsClass(element: Element, className: string) => boolean` | Returns true if the `element` contains the `className` class.
`closeSurface(skipRestoreFocus?: boolean) => void` | Closes the menu surface, skipping restoring focus to the previously focused element if `skipRestoreFocus` is true.
`getElementIndex(element: Element) => number` | Returns the `index` value of the `element`.
`notifySelected(index: number) => void` | Emits a `MDCMenu:selected` event for the element at the `index` specified.
`getMenuItemCount() => number` | Returns the menu item count.
`focusItemAtIndex(index: number)` | Focuses the menu item at given index.
`focusListRoot() => void` | Focuses the list root element.
`getSelectedSiblingOfItemAtIndex(index: number) => number` | Returns selected list item index within the same selection group which is a sibling of item at given `index`.
`isSelectableItemAtIndex(index: number) => boolean` | Returns true if menu item at specified index is contained within an `.mdc-menu__selection-group` element.

### `MDCMenuFoundation`

Method Signature | Description
--- | ---
`handleKeydown(evt: Event) => void` | Event handler for the `keydown` events within the menu.
`handleItemAction(listItem: Element) => void` | Event handler for list's action event.
`handleMenuSurfaceOpened() => void` | Event handler for menu surface's opened event.
`setDefaultFocusState(focusState: DefaultFocusState) => void` | Sets default focus state where the menu should focus every time when menu is opened. Focuses the list root (`DefaultFocusState.LIST_ROOT`) element by default.
`setSelectedIndex(index: number) => void` | Selects the list item at given `index`.
`setEnabled(index: number, isEnabled: boolean) => void` | Sets the enabled state of the menu item at given `index`.

### Events

Event Name | Data | Description
--- | --- | ---
`MDCMenu:selected` | `{detail: {item: Element, index: number}}` | Used to indicate when an element has been selected. This event also includes the item selected and the list index of that item.
