<!--docs:
title: "5. Lay out the product items"
layout: landing
section: codelab
path: /codelab/5-layout/
-->

<!--
This is a simplified version of Building Beautiful Sites with MDC web
edited for a non-technical audience
-->

<link rel="stylesheet" href="css/codelab.css" />

# Lay out the product items

Duration: 4:00
{: .duration}

The Shrine app is coming along nicely! The designers are very pleased. The final step in the design is to lay out the product items to look better than a bunch of vertical cards. Use [mdc-layout-grid](https://github.com/material-components/material-components-web/tree/master/packages/mdc-layout-grid) because it implements Material Design's [Responsive UI Grid](https://material.io/guidelines/layout/responsive-ui.html#responsive-ui-grid), making product items look great across all form factors.

## Turn the main content element into a layout grid

In `index.html`, alter the `<main>` element so that it looks like the following:

```html
<main id="shrine-products" class="mdc-layout-grid mdc-toolbar-fixed-adjust">
```

## Wrap all of the product items in grid cells

Wrap each one of the `mdc-card` product items in a `mdc-layout-grid__cell` div, like this:

```html
<div class="mdc-layout-grid__cell">
  <div class="mdc-card shrine-product-card">
    <section class="mdc-card__primary">
      <span class="mdc-card__title shrine-product-card__price">$20</span>
    </section>
    <img class="shrine-product-card__image" width="240" height="240" alt="Sunglasses" src="assets/sunnies.png">
  </div>
</div>
<!-- ... -->
```

## Add the custom styles for the Shrine product grid

Add the following at the bottom of `app.css`:

```css
#shrine-products {
  --mdc-layout-grid-gutter: 8px;
}

#shrine-products .mdc-layout-grid__cell {
  display: flex;
  justify-content: center;
}
```

## Remove the unneeded styles from the shrine-product-card css class

Alter the `.shrine-product-card` class so that it looks like the following:

```css
.shrine-product-card {
  width: 320px;
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: white;
}
```

That's it! You should have a responsive product grid that looks great across all form factors. Test it out yourself by resizing the browser window.
