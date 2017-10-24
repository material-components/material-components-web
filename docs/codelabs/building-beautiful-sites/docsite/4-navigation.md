<!--docs:
title: "4. Add a navigation drawer"
layout: landing
section: codelabs
path: /codelabs/beautiful-sites-simplified/4-navigation/
-->

<!--
This is a simplified version of Building Beautiful Sites with MDC web
edited for a non-technical audience
-->


# Add a navigation drawer

Duration: 6:00
 {: .codelab-duration}

Let's add this to our app.

## Add the drawer markup

Replace the entire `index.html` file with this:

```html
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta http-equiv="x-ua-compatible" content="ie=edge">
  <title>Shrine (MDC-Web Example App)</title>
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <link rel="icon" sizes="192x192" href="https://material.io/static/images/simple-lp/favicons/components-192x192.png">
  <link rel="shortcut icon" href="https://material.io/static/images/simple-lp/favicons/components-72x72.png">

  <link rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/normalize/6.0.0/normalize.min.css">
  <link href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700" rel="stylesheet">
	<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
	<link rel="stylesheet"
        href="https://unpkg.com/material-components-web@0.9.1/dist/material-components-web.min.css">
  <link rel="stylesheet" href="app.css">
</head>
<body class="mdc-typography">
<header id="shrine-header"
        class="mdc-toolbar mdc-toolbar--fixed mdc-theme--text-primary-on-background">
  <div class="mdc-toolbar__row">
    <section class="mdc-toolbar__section mdc-toolbar__section--align-start">
			<a id="shrine-nav-icon" class="material-icons mdc-ripple-surface"
			    href="#"
			   aria-label="Click to show the navigation menu"
			   aria-controls="shrine-nav-menu"
			   data-mdc-auto-init="MDCRipple"
			   data-mdc-ripple-is-unbounded>menu</a>
      <h1 id="shrine-logo"
          class="mdc-toolbar__title"><span>Shrine</span></h1>
    </section>
  </div>
	</header>
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
  <main class="mdc-toolbar-fixed-adjust">
    <div class="mdc-card shrine-product-card">
      <section class="mdc-card__primary">
        <span class="mdc-card__title shrine-product-card__price">$20</span>
      </section>
      <img class="shrine-product-card__image" width="240" height="240" alt="Sunglasses" src="assets/sunnies.png">
    </div>
    <div class="mdc-card shrine-product-card">
      <section class="mdc-card__primary">
        <span class="mdc-card__title shrine-product-card__price">$80</span>
      </section>
      <img class="shrine-product-card__image" width="240" height="240" alt="Shoes" src="assets/chucks.png">
    </div>
    <div class="mdc-card shrine-product-card">
      <section class="mdc-card__primary">
        <span class="mdc-card__title shrine-product-card__price">$90</span>
      </section>
      <img class="shrine-product-card__image" width="240" height="240" alt="Beach ball" src="assets/beachball.png">
    </div>
    <div class="mdc-card shrine-product-card">
      <section class="mdc-card__primary">
        <span class="mdc-card__title shrine-product-card__price">$30</span>
      </section>
      <img class="shrine-product-card__image" width="240" height="240" alt="Backpack" src="assets/backpack.png">
    </div>
    <div class="mdc-card shrine-product-card">
      <section class="mdc-card__primary">
        <span class="mdc-card__title shrine-product-card__price">$90</span>
      </section>
      <img class="shrine-product-card__image" width="240" height="240" alt="Clock" src="assets/clock.png">
    </div>
    <div class="mdc-card shrine-product-card">
      <section class="mdc-card__primary">
        <span class="mdc-card__title shrine-product-card__price">$30</span>
      </section>
      <img class="shrine-product-card__image" width="240" height="240" alt="Fish bowl" src="assets/fishbowl.png">
    </div>
  </main>
	<script src="https://unpkg.com/material-components-web@0.9.1/dist/material-components-web.min.js">
	</script>
	<script>
	  mdc.autoInit();
	  document.getElementById('shrine-nav-icon').addEventListener('click', function(evt) {
	    evt.preventDefault();
	    document.getElementById('shrine-nav-menu').MDCTemporaryDrawer.open = true;
	  });
	</script>
	</body>
</html>

```

And save.

## Add the drawer custom styles

Copy and paste the following to the bottom of `app.css`:

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

And save.

## Open sesame

Go over to the browser to see your work.

Clicking the navigation icon within the toolbar will display a navigation drawer.

![Drawer](img/06-drawer.png)
{: .codelab-img}

[Next step: Lay out the product items](./5-layout.md)
