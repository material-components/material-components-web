<!--docs:
title: "RTL"
layout: detail
section: components
excerpt: "Right-to-left and bi-directional text layout via SCSS helpers."
path: /catalog/rtl/
-->

# RTL

MDC RTL provides sass mixins to assist with RTL / bi-directional layouts within MDC-Web components.
Because we would like to achieve a standard approach to RTL throughout MDC-Web, we highly recommend
that any MDC-Web component that needs RTL support leverage this package.

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

Simply `@import "@material/rtl/mixins";` and start using the mixins. Each mixin is described below.

### mdc-rtl

```scss
@mixin mdc-rtl($root-selector: null)
```

Creates a rule that will be applied when an MDC-Web component is within the context of an RTL layout.

Usage Example:

```scss
.mdc-foo {
  position: absolute;
  left: 0;

  @include mdc-rtl {
    left: auto;
    right: 0;
  }

  &__bar {
    margin-left: 4px;
    @include mdc-rtl(".mdc-foo") {
      margin-left: auto;
      margin-right: 4px;
    }
  }
}

.mdc-foo--mod {
  padding-left: 4px;

  @include mdc-rtl {
    padding-left: auto;
    padding-right: 4px;
  }
}
```

will emit the following css:

```css
.mdc-foo {
  position: absolute;
  left: 0;
}
[dir="rtl"] .mdc-foo, .mdc-foo[dir="rtl"] {
  left: auto;
  right: 0;
}
.mdc-foo__bar {
  margin-left: 4px;
}
[dir="rtl"] .mdc-foo .mdc-foo__bar, .mdc-foo[dir="rtl"] .mdc-foo__bar {
  margin-left: auto;
  margin-right: 4px;
}

.mdc-foo--mod {
  padding-left: 4px;
}
[dir="rtl"] .mdc-foo--mod, .mdc-foo--mod[dir="rtl"] {
  padding-left: auto;
  padding-right: 4px;
}
```
*N.B.**: checking for `[dir="rtl"]` on an ancestor element works in most cases, it will sometimes
lead to false negatives for more complex layouts, e.g.

```html
<html dir="rtl">
  <!-- ... -->
  <div dir="ltr">
    <div class="mdc-foo">Styled incorrectly as RTL!</div>
  </div>
</html>
```

Unfortunately, we've found that this is the best we can do for now. In the future, selectors such
as [:dir](http://mdn.io/:dir) will help us mitigate this.

### mdc-rtl-reflexive-box

```scss
@mixin mdc-rtl-reflexive-box($base-property, $default-direction, $value, $root-selector: null)
```

Takes a base box-model property - e.g. margin / border / padding - along with a default
direction and value, and emits rules which apply the value to the
`#{$base-property}-#{$default-direction}` property by default, but flips the direction
when within an RTL context.

For example:

```scss
.mdc-foo {
  @include mdc-rtl-reflexive-box(margin, left, 8px);
}
```
is equivalent to:

```scss
.mdc-foo {
  margin-left: 8px;

  @include mdc-rtl {
    margin-right: 8px;
    margin-left: 0;
  }
}
```

Whereas:

```scss
.mdc-foo {
  @include mdc-rtl-reflexive-box(margin, right, 8px);
}
```
is equivalent to:

```scss
.mdc-foo {
  margin-right: 8px;

  @include mdc-rtl {
    margin-right: 0;
    margin-left: 8px;
  }
}
```

You can also pass a 4th optional $root-selector argument which will be forwarded to `mdc-rtl`,
e.g. `@include mdc-rtl-reflexive-box-property(margin, left, 8px, ".mdc-component")`.

Note that this function will always zero out the original value in an RTL context. If you're
trying to flip the values, use `mdc-rtl-reflexive-property`.

### mdc-rtl-reflexive-property

```scss
@mixin mdc-rtl-reflexive-property($base-property, $left-value, $right-value, $root-selector: null)
```

Takes a base property and emits rules that assign <base-property>-left to <left-value> and
<base-property>-right to <right-value> in a LTR context, and vice versa in a RTL context.

For example:

```scss
.mdc-foo {
  @include mdc-rtl-reflexive-property(margin, auto, 12px);
}
```
is equivalent to:

```scss
.mdc-foo {
  margin-left: auto;
  margin-right: 12px;

  @include mdc-rtl {
    margin-left: 12px;
    margin-right: auto;
  }
}
```

A 4th optional $root-selector argument can be given, which will be passed to `mdc-rtl`.

### mdc-rtl-reflexive-position

```scss
@mixin mdc-rtl-reflexive-position($pos, $value, $root-selector: null)
```

Takes an argument specifying a horizontal position property (either "left" or "right") as well
as a value, and applies that value to the specified position in a LTR context, and flips it in a
RTL context.

For example:

```scss
.mdc-foo {
  @include mdc-rtl-reflexive-position(left, 0);
  position: absolute;
}
```
is equivalent to:

```scss
 .mdc-foo {
   position: absolute;
   left: 0;
   right: initial;

   @include mdc-rtl {
     right: 0;
     left: initial;
   }
 }
```

An optional third $root-selector argument may also be given, which is passed to `mdc-rtl`.
