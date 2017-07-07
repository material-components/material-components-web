<!--docs:
title: "RTL"
layout: detail
section: components
excerpt: "Right-to-left and bi-directional text layout via SCSS helpers."
path: /catalog/rtl/
-->

# RTL

UIs for languages that are read from right-to-left (RTL), such as Arabic and Hebrew, should be mirrored to ensure content is easy to understand.

## Design & API Documentation

<ul class="icon-list">
  <li class="icon-list-item icon-list-item--spec">
    <a href="https://material.io/guidelines/usability/bidirectionality.html">Material Design guidelines: Bidirectionality</a>
  </li>
</ul>

## Installation

```
npm install --save @material/rtl
```

## Usage

### Sass Mixins

`$base-property` is a base box-model property. e.g. margin / border / padding.
`$pos` is a horizontal position property, either "left" or "right".


| Mixin | Description |
| ----------------------------------------------- | - |
| `mdc-rtl($root-selector)` | Creates a rule that is applied when the root element is within an RTL context |
| `mdc-rtl-reflexive-box($base-property, $default-direction, $value, $root-selector)` | Applies the value to the `#{$base-property}-#{$default-direction}` property  in a LTR context, and flips the direction in an RTL context. This mixin zeros out the original value in an RTL context. |
| `mdc-rtl-reflexive-property($base-property, $left-value, $right-value, $root-selector)` | Emits rules that assign `#{$base-property}`-left to `#{left-value}` and `#{base-property}`-right to `#{right-value}` in a LTR context, and vice versa in a RTL context. |
| `mdc-rtl-reflexive-position($pos, $value, $root-selector)` | Applies the value to the specified position in a LTR context, and flips the direction in an RTL context. |

**A note about [dir="rtl"]**: `mdc-rtl($root-selector)` checks for `[dir="rtl"]` on the ancestor element. This works in most cases, it will sometimes lead to false negatives for more complex layouts, e.g.

```html
<html dir="rtl">
  <!-- ... -->
  <div dir="ltr">
    <div class="mdc-foo">Styled incorrectly as RTL!</div>
  </div>
</html>
```

Unfortunately, we've found that this is the best we can do for now. In the future, selectors such as [:dir](http://mdn.io/:dir) will help us mitigate this.
