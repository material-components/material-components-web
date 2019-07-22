<!--docs:
title: "Menus"
layout: detail
section: components
excerpt: "Non-cascading Material Design menus."
iconId: menu
path: /catalog/menus/
-->

# Menus

<!--<div class="article__asset">
  <a class="article__asset-link"
     href="https://material-components.github.io/material-components-web-catalog/#/component/menu">
    <img src="{{ site.rootpath }}/images/mdc_web_screenshots/menus.png" width="178" alt="Menus screenshot">
  </a>
</div>-->

A menu displays a list of choices on a temporary surface. They appear when users interact with a button, action,
or other control.

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
  <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
    <li class="mdc-list-item" role="menuitem">
      <span class="mdc-list-item__text">A Menu Item</span>
    </li>
    <li class="mdc-list-item" role="menuitem">
      <span class="mdc-list-item__text">Another Menu Item</span>
    </li>
  </ul>
</div>
```

### Styles

```scss
@import "@material/list/mdc-list";
@import "@material/menu-surface/mdc-menu-surface";
@import "@material/menu/mdc-menu";
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
  <ul class="mdc-list" role="menu" aria-hidden="true" aria-orientation="vertical" tabindex="-1">
    <li>
      <ul class="mdc-menu__selection-group">
        <li class="mdc-list-item" role="menuitem">
          <span class="mdc-list-item__graphic mdc-menu__selection-group-icon">
            ...
          </span>
          <span class="mdc-list-item__text">Single</span>
        </li>
        <li class="mdc-list-item" role="menuitem">
          <span class="mdc-list-item__graphic mdc-menu__selection-group-icon">
           ...
          </span>
          <span class="mdc-list-item__text">1.15</span>
        </li>
      </ul>
    </li>
    <li class="mdc-list-divider" role="separator"></li>
    <li class="mdc-list-item" role="menuitem">
      <span class="mdc-list-item__text">Add space before paragraph</span>
    </li>
    ...
  </ul>
</div>
```

### Disabled Menu Items

Menu items can be disabled by adding the `mdc-list-item--disabled` modifier class (from [MDC List](../mdc-list)).
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
menu.hoistMenuToBody(); // Not required if the menu is already positioned on the body.
menu.setAbsolutePosition(100, 100);
```

## Style Customization

### CSS Classes

CSS Class | Description
--- | ---
`mdc-menu` | Required on the root element
`mdc-menu-surface` | Required on the root element. See [`mdc-menu-surface` documentation](../mdc-menu-surface) for other `mdc-menu-surface` classes.
`mdc-list` | Required on the nested `ul` element. See [`mdc-list` documentation](../mdc-list) for other `mdc-list` classes.
`mdc-menu__selection-group` | Used to wrap a group of `mdc-list-item` elements that will represent a selection group.
`mdc-menu__selection-group-icon` | Required when using a selection group to indicate which item is selected. Should contain an icon or svg that indicates the selected state of the list item.
`mdc-menu-item--selected` | Used to indicate which element in a selection group is selected.

### Sass Mixins

Mixin | Description
--- | ---
`mdc-menu-width($width)` | Used to set the `width` of the menu. When used without units (e.g. `4` or `5`) it computes the `width` by multiplying by the base width (`56px`). When used with units (e.g. `240px`, `15%`, or `calc(200px + 10px)` it sets the `width` to the exact value provided.

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

> See [Menu Surface](../mdc-menu-surface/README.md) and [List](../mdc-list/README.md) documentation for more information on proxied methods and properties.

<!-- docgen-tsdoc-replacer:start __DO NOT EDIT, This section is automatically generated__ -->
### MDCMenu
#### Methods

Signature | Description
--- | ---
`getOptionByIndex(index: number) => Element | null` | Returns the list item at the `index` specified.
`listen(evtType: K, handler: SpecificEventListener<K>, options?: AddEventListenerOptions | boolean) => void` | Wrapper method to add an event listener to the component's root element. This is most useful when listening for custom events.
`setAbsolutePosition(x: number, y: number) => void` | Proxies to the menu surface's `setAbsolutePosition(x: number, y: number)` method.
`emit(evtType: string, evtData: T, shouldBubble?: boolean) => void` | Fires a cross-browser-compatible custom event from the component root of the given type, with the given data.
`setAnchorElement(element: Element) => void` | Sets the element that the menu-surface is anchored to. Proxies to the menu surface's `setAnchorElement(element)` method.
`setAnchorMargin(margin: Partial<MDCMenuDistance>) => void` | Proxies to the menu surface's `setAnchorMargin(Partial<MDCMenuDistance>)` method.
`setDefaultFocusState(focusState: DefaultFocusState) => void` | Sets default focus state where the menu should focus every time when menu is opened. Focuses the list root (`DefaultFocusState.LIST_ROOT`) element by default.
`setFixedPosition(isFixed: boolean) => void` | Proxies to the menu surface's `setFixedPosition(isFixed: boolean)` method.
`setIsHoisted(isHoisted: boolean) => void` | Proxies to the menu surface's `setIsHoisted(isHoisted: boolean)` method.
`setSelectedIndex(index: number) => void` | Sets the list item as the selected row at the specified index.
`unlisten(evtType: K, handler: SpecificEventListener<K>, options?: AddEventListenerOptions | boolean) => void` | Wrapper method to remove an event listener to the component's root element. This is most useful when unlistening for custom events.
`setAnchorCorner(corner: Corner) => void` | Proxies to the menu surface's `setAnchorCorner(Corner)` method.

#### Properties

Name | Type | Description
--- | --- | ---
items | `Element[]` | Return the items within the menu. Note that this only contains the set of elements within the items container that are proper list items, and not supplemental / presentational DOM elements. Proxies to the list to query for all `.mdc-list-item` elements.
open | `boolean` | Proxies to the menu surface's `open` property.
quickOpen | `boolean` | Proxies to the menu surface `quickOpen` property.
wrapFocus | `boolean` | Proxies to list's `wrapFocus` property.

#### Events
- `MDCMenu:selected {detail: {item: Element, index: number}}` Used to indicate when an element has been selected. This event also includes the item selected and the list index of that item.

## Usage within Web Frameworks

If you are using a JavaScript framework, such as React or Angular, you can create this component for your framework. Depending on your needs, you can use the _Simple Approach: Wrapping MDC Web Vanilla Components_, or the _Advanced Approach: Using Foundations and Adapters_. Please follow the instructions [here](../../docs/integrating-into-frameworks.md).

### MDCMenuAdapter
#### Methods

Signature | Description
--- | ---
`getElementIndex(element: Element) => number` | Returns the `index` value of the `element`.
`addAttributeToElementAtIndex(index: number, attr: string, value: string) => void` | Adds an attribute, with value, to the element at the index provided.
`closeSurface(skipRestoreFocus?: undefined | false | true) => void` | Closes the menu surface, skipping restoring focus to the previously focused element if `skipRestoreFocus` is true.
`elementContainsClass(element: Element, className: string) => boolean` | Returns true if the `element` contains the `className` class.
`focusItemAtIndex(index: number) => void` | Focuses the menu item at given index.
`focusListRoot() => void` | Focuses the list root element.
`addClassToElementAtIndex(index: number, className: string) => void` | Adds a class to the element at the index provided.
`getMenuItemCount() => number` | Returns the menu item count.
`getSelectedSiblingOfItemAtIndex(index: number) => number` | Returns selected list item index within the same selection group which is a sibling of item at given `index`.
`isSelectableItemAtIndex(index: number) => boolean` | Returns true if menu item at specified index is contained within an `.mdc-menu__selection-group` element.
`notifySelected(evtData: MDCMenuItemEventDetail) => void` | Emits a `MDCMenu:selected` event for the element at the `index` specified. Emit an event when a menu item is selected.
`removeAttributeFromElementAtIndex(index: number, attr: string) => void` | Removes an attribute from an element at the index provided.
`removeClassFromElementAtIndex(index: number, className: string) => void` | Removes a class from the element at the index provided

### MDCMenuFoundation
#### Methods

Signature | Description
--- | ---
`setDefaultFocusState(focusState: DefaultFocusState) => void` | Sets default focus state where the menu should focus every time when menu is opened. Focuses the list root (`DefaultFocusState.LIST_ROOT`) element by default.
`setSelectedIndex(index: number) => void` | Selects the list item at `index` within the menu.


<!-- docgen-tsdoc-replacer:end -->
