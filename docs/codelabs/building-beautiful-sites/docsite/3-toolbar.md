<!--docs:
title: "3. Add a toolbar"
layout: landing
section: codelab
path: /codelab/3-toolbar/
-->

<!--
This is a simplified version of Building Beautiful Sites with MDC web
edited for a non-technical audience
-->

<link rel="stylesheet" href="css/codelab.css" />

# Add a Toolbar

Duration: 6:00
{: .duration}

Let’s say you bring your beautiful e-commerce skeleton site to a designer on your team. The first thing the designer suggests is to add a [toolbar](https://material.io/guidelines/components/toolbars.html) to better convey the branding and ensure the user always knows where they are.

It is easy to implement the toolbar using MDC-Web’s [mdc-toolbar](https://github.com/material-components/material-components-web/tree/master/packages/mdc-toolbar) component. Use a [fixed toolbar](https://github.com/material-components/material-components-web/tree/master/packages/mdc-toolbar#fixed-toolbars), because it has elevation and floats above the main content.

## Add the Material Icons font

To show the hamburger menu navigation icon in the mocks, add the [Material Icons](http://google.github.io/material-design-icons/#icon-font-for-the-web) font to the web page.

In index.html, add the following directly before `<link rel="stylesheet" href="https://unpkg.com/material-components-web@0.9.1/dist/material-components-web.min.css">`

```html
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
```

You may use the icon font as soon as it loads onto the web page.

## Add the proper mdc-toolbar markup

In `index.html`, replace the `h1` tag with the following markup:

```html
<header id="shrine-header"
        class="mdc-toolbar mdc-toolbar--fixed mdc-theme--text-primary-on-background">
  <div class="mdc-toolbar__row">
    <section class="mdc-toolbar__section mdc-toolbar__section--align-start">
      <a id="shrine-nav-icon" class="material-icons" href="#"
         aria-label="Click to show the navigation menu"
         aria-controls="shrine-nav-menu">menu</a>
      <h1 id="shrine-logo"
          class="mdc-toolbar__title"><span>Shrine</span></h1>
    </section>
  </div>
</header>
```

## Add the custom mdc-toolbar styles

Add the following styles to `app.css`:

```css
#shrine-header {
  background-color: var(--mdc-theme-background);
  color: var(--mdc-theme-text-primary-on-background);
}

#shrine-header .mdc-toolbar__section {
  overflow: visible;
}

#shrine-logo {
  background: url(assets/logo.png) left center no-repeat;
  background-size: contain;
  width: 100%;
  height: 100%;
}

/* Hide actual text for screen readers */
#shrine-logo > span {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0,0,0,0);
  border: 0;
}

#shrine-nav-icon {
  width: 24px;
  height: 24px;
  margin-right: 40px;
  text-decoration: none;
}

#shrine-nav-icon:visited,
#shrine-nav-icon:active,
#shrine-nav-icon:focus {
  color: var(--mdc-theme-text-primary-on-background);
}
```

## Adjust the main content margin to account for a fixed toolbar

Alter the opening `<main>` tag so it will look like this:

```html
<main class="mdc-toolbar-fixed-adjust">
```

You will now see a toolbar! There was no JavaScript required!

Explanation:

- To add basic fixed toolbar markup to our site, we used the `mdc-toolbar` markup along with the `mdc-toolbar--fixed` modifier class.
- To move the main content down so that it won't be occluded by the fixed toolbar, we used the `mdc-toolbar-fixed-adjust` class.
- To get the design treatments correct, we added custom styles for some singleton elements on the page, such as the logo, navigation icon, and header. Note the use of [CSS custom properties here](https://developer.mozilla.org/en-US/docs/Web/CSS/--*), e.g. `var(--mdc-theme-text-primary-on-background)`. Custom properties are the primary means of how mdc-web handles theming. All of the thematic elements within all components are provided via theme variables, which you can both reference and modify.

> While encouraged, CSS custom properties are simply one way to theme an MDC-Web app. Check out our [theming guide](https://github.com/material-components/material-components-web/blob/master/docs/theming.md), as well as the [mdc-theme package](https://github.com/material-components/material-components-web/tree/master/packages/mdc-theme), for all of the different ways to handle customizing the theme of your Material Design application.
{: .hint}

## Finishing Touch: Add an ink ripple to the nav icon

The user will touch or click on options in the navigation menu and receive feedback from the ink ripple, the insignia of Material Design. The ink ripple is the first component we're using that requires JavaScript, so we'll add it to the page. Thankfully, instantiating MDC-Web JS components is simple.

Alter the `<a id="shrine-nav-icon" ...>` element to look like this:

```html
<a id="shrine-nav-icon" class="material-icons mdc-ripple-surface"
   href="#"
   aria-label="Click to show the navigation menu"
   aria-controls="shrine-nav-menu"
   data-mdc-auto-init="MDCRipple"
   data-mdc-ripple-is-unbounded>menu</a>
```

Add the following markup at the bottom of `index.html`, right above the closing `</body>` tag:

```html
<script src="https://unpkg.com/material-components-web@0.9.1/dist/material-components-web.min.js">
</script>
<script>mdc.autoInit()</script>
```

That's it! You will see an ink ripple when you click on the navigation icon.

There are a few key items to notice:

- To make arbitrary elements ripple-compatible, use the `mdc-ripple-surface` from the [mdc-ripple](https://github.com/material-components/material-components-web/tree/master/packages/mdc-ripple) package. While most of our interactive components have ripples included by default, we need to add `mdc-ripple-surface` for the navigation icon element.
- To style the navigation icon ripples as [unbounded](https://github.com/material-components/material-components-web/tree/master/packages/mdc-ripple#unbounded-ripples), use `data-mdc-ripple-is-unbounded`.
- To automatically instantiate the JavaScript necessary for the ripple, use `data-mdc-auto-init="MDCRipple"`  with the one-line `mdc.autoInit()` call at the bottom of the page. These idioms come from our [mdc-auto-init package](https://github.com/material-components/material-components-web/tree/master/packages/mdc-auto-init), which is responsible for transparently instantiating MDC-Web elements for static sites.

The toolbar is complete. To make the navigation icon functional, let's add a navigation drawer.
