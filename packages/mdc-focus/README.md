# Focus

This package contains focus-related utilities.

## Focus rings

To add a focus ring to an element, ensure the following requirements:
- The focus ring should be a child of the element which it is offset from.
- The element which the focus ring is offset from should have a
  non-static `position` CSS value. This is because the focus ring has
  `position: absolute` and is then positioned relative to its container
  element.
- The focus ring can be shown in Sass via `focus-ring-theme.show-focus-ring()`.


See the following example:

```html
<button class="mdc-button">
	<span>Click me!</span>
	<div class="mdc-focus-ring"></div>
</button>
```

```scss
.mdc-button {
  position: relative;
}

.mdc-focus-ring {
  @include focus-ring-theme.static-styles();
  @include focus-ring-theme.theme-styles(focus-ring-theme.$light-theme);
}

.mdc-button:focus-visible .mdc-focus-ring {
  @include focus-ring-theme.show-focus-ring();
}
```
