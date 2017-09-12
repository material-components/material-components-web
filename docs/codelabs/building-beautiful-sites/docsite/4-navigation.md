<!--docs:
title: "4. Add a navigation drawer"
layout: landing
section: codelab
path: /codelab/4-navigation/
-->

<!--
This is a simplified version of Building Beautiful Sites with MDC web
edited for a non-technical audience
-->

<link rel="stylesheet" href="css/codelab.css" />

# Add a navigation drawer

Duration: 6:00
{: .duration}

Now that our app is set up to use JavaScript, adding a navigation drawer should be simple. Here's the mock our designer has given us for the navigation drawer:

Let's add this to our app. Use the Temporary Drawer from the [mdc-drawer](https://github.com/material-components/material-components-web/tree/master/packages/mdc-drawer) package in order to achieve this functionality.

## Add the drawer markup

Add the markup below for the temporary drawer in `index.html`, right below the markup for the toolbar and before the `<main>` element:

```html
<aside id="shrine-nav-menu" class="mdc-temporary-drawer" data-mdc-auto-init="MDCTemporaryDrawer">
  <nav class="mdc-temporary-drawer__drawer">
    <header class="mdc-temporary-drawer__header"></header>
    <nav class="mdc-temporary-drawer__content mdc-list">
      <a class="mdc-list-item" href="#">Home</a>
      <a class="mdc-list-item" href="#">Clothing</a>
      <a class="mdc-list-item" href="#">Popsicles</a>
    </nav>
  </nav>
</aside>
```

## Add the drawer custom styles

Add the following to `app.css` to style the drawer to reflect the mocks:

```css
#shrine-nav-menu {
  text-transform: uppercase;
  padding-left: 16px;
}

#shrine-nav-menu .mdc-temporary-drawer__drawer {
  background-color: #fafafa;
}

#shrine-nav-menu .mdc-temporary-drawer__header {
  background: url(assets/logo.png) 32px 32px no-repeat;
  background-size: 30%;
}

#shrine-nav-menu .mdc-temporary-drawer__header::before {
  padding-top: 30%;
}

#shrine-nav-menu .mdc-temporary-drawer__content {
  background: url(assets/diamond.svg) -32px bottom no-repeat;
  background-size: 50%;
}

#shrine-nav-menu .mdc-list-item {
  height: 32px;
  padding-left: 32px;
  letter-spacing: .2em;
}
```

## Add JavaScript to open the drawer when the navigation icon is clicked

Alter the `<script>mdc.autoInit()</script>` tag to show the following:

```html
<script>
  mdc.autoInit();
  document.getElementById('shrine-nav-icon').addEventListener('click', function(evt) {
    evt.preventDefault();
    document.getElementById('shrine-nav-menu').MDCTemporaryDrawer.open = true;
  });
</script>
```

> Note that the `MDCTemporaryDrawer` property on the `shrine-nav-menu` element is the automatically instantiated `MDCTemporaryDrawer` instance, attached as part of `mdc-auto-init`.
{: .hint}

Clicking the navigation icon within the toolbar will display a navigation drawer.

> Bonus: Opening the devtools menu in [device mode](https://developers.google.com/web/tools/chrome-devtools/device-mode/). Notice that with touch events, you can drag the navigation drawer and swipe it off screen!
{: .hint}
