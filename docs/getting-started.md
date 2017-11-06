<!--docs:
title: "Getting Started"
layout: landing
section: docs
path: /docs/getting-started/
-->

# Getting Started

This guide will help you get started using MDC-Web on your own sites and within your own projects.

> If you are interested in integrating MDC-Web into a framework, or building a component library for
your framework that wraps MDC-Web, check out our [framework integration guide](./integrating-into-frameworks.md).

## MDC-Web quick start: building a simple greeting app

The best way to learn any new technology is to get your hands dirty and build something with it, so
that is what we will do here!  You will be building a simple greeting page which lets you enter a name and greets you as such.

As you go through this guide, we encourage you to code along with it. By the end, you will have
learned the fundamentals incorporating MDC-Web into simple sites, as well as worked with some of the
components we have to offer.

### Setting up the project

Create a directory for the project where we'll serve our application out of.

```
mkdir greeting-app
cd greeting-app
```

Additionally, if you have [NodeJS](https://nodejs.org) installed, we recommend installing and using
[live-server](http://tapiov.net/live-server/) as your local development server. Live-server is
simple to use and will reload the page whenever you make a change to your HTML. You can install it
via [npm](https://www.npmjs.com/) by typing the following:

```
npm install --global live-server
```

> NOTE: You may need to use `sudo` to install npm packages globally, depending on how your node
installation is configured.

The `--global` flag tells npm to install the package globally, so that the `live-server` program
will be available on your `$PATH`.

### Creating the skeleton index.html file

Now that you have a directory set up, create a simple `index.html` file, and include
the assets needed for MDC-Web. Put the following within `index.html` in the `greeting-app` directory:

```html
<!DOCTYPE html>
<html class="mdc-typography">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width,initial-scale=1">
    <title>Greeting App</title>
    <link
      rel="stylesheet"
      href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css">
  </head>
  <body>
    <h1 class="mdc-typography--display1">Hello, World!</h1>
    <button type="button" class="mdc-button mdc-button--raised">
      Press Me
    </button>
  </body>
</html>
```

View this page by running `live-server` (or the web server of your choice) within the
`greeting-app` directory.

If you're using `live-server`, this will open up your browser to the URL which is serving our
`index.html` file. You can leave `live-server` running for the duration of this guide. If you're
not using `live-server`, navigate to the web server's base URL and view the page. Also be sure to
refresh after every change you make!

Let's take a look at a few aspects of the above HTML.

* **No JavaScript necessary (yet)** - Because we aren't using any dynamic components, we only need
  to include the MDC-Web CSS, so that we can apply the proper CSS classes to our elements. With MDC-Web,
  JavaScript is only necessary for dynamic components whose UI needs to be made aware of events
  happening on the page. As we develop our greeting app, we'll
  add in the necessary JavaScript.
* **No automatic DOM rendering** - For all components, MDC-Web does not render _any_ DOM elements
  itself. MDC-Web is similar to [Bootstrap](http://getbootstrap.com/) in this respect; it expects you to render the DOM using the proper CSS classes. This avoids a litany of problems for integrating MDC-Web into
  complex applications.
* **Elements are not natively styled** - Notice how above, we give the `<html>` element a class of
  `mdc-typography`, the `<h1>` element a class of `mdc-typography--display1`, and the button a class
  of `mdc-button`, along with multiple _modifier classes_. MDC-Web _never_ makes any assumptions about
  which elements are being used for our components, instead relying on CSS classes for maximum
  flexibility. MDC-Web's CSS class names follow a slightly modified version of the [BEM](http://getbem.com/) system.

### Adding in JavaScript for dynamic components

Now that we've gotten the gist of MDC-Web, let us continue to build our greeting app.

The app consists of two input fields and a submit button. Material Design text input
fields and buttons contain a lot of dynamism and animation that require the usage of JavaScript.

Replace the contents of the `<body>` tag in `index.html` with the following:

```html
<main>
  <h1 class="mdc-typography--display1">Tell us about yourself!</h1>

  <form action="#" id="greeting-form">
    <div>
      <div class="mdc-form-field">
        <div class="mdc-text-field" data-mdc-auto-init="MDCTextField">
          <input id="firstname" type="text" class="mdc-text-field__input">
          <label for="firstname" class="mdc-text-field__label">
            First Name
          </label>
          <div class="mdc-text-field__bottom-line"></div>
        </div>
      </div>

      <div class="mdc-form-field">
        <div class="mdc-text-field" data-mdc-auto-init="MDCTextField">
          <input id="lastname" type="text" class="mdc-text-field__input">
          <label for="lastname" class="mdc-text-field__label">
            Last Name
          </label>
          <div class="mdc-text-field__bottom-line"></div>
        </div>
      </div>
    </div>

    <button type="submit"
            class="mdc-button
                   mdc-button--raised
                   mdc-ripple-surface"
            data-mdc-auto-init="MDCRipple">
      Print Greeting
    </button>
  </form>

  <!-- The p element below is where we'll eventually output our greeting -->
  <p class="mdc-typography--headline" id="greeting"></p>
</main>

<script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"></script>
<script>window.mdc.autoInit();</script>
```

Once the changes are made, return to your browser and you will see two very nicely styled form
fields along with a Material Design styled button. The button shows an ink ripple effect when pressed. For now, the ripple is a fairly subtle that will be addressed shortly.

Two important points that are demonstrated in the code that was added:

#### MDC-Web does not instantiate any components automatically

This avoids the headaches involved with lifecycle handlers management in Material Design Lite (the predecessor to MDC-Web).
Initialization is done through the `data-mdc-auto-init` attributes added
to those elements that are initialized when mdc.autoInit() is called.

When `mdc.autoInit()` is called, it looks for all elements with a `data-mdc-auto-init` attribute,
and attaches the MDC-Web JS Component with the given class name to that element.. So when it sees `MDCTextField`,
it instantiates a [MDCTextField](../packages/mdc-textfield) instance to the corresponding elements.
It does the same thing for the button, attaching a [MDCRipple](../packages/mdc-ripple) instance to the element.

It is worth noting that `mdc.autoInit` is provided _purely_ as a convenience function, and is not
required to actually use the components. It is, however, the simplest way to get up and running
quickly, and recommended for static sites that use the comprehensive `material-components-web` library.


#### All components are modular

Although when you initially set up this project you installed the `material-components-web` package, that
package is simply a thin wrapper around individual component packages, such as [mdc-typography](../packages/mdc-typography), [mdc-button](../packages/mdc-button), [mdc-text-field](../packages/mdc-textfield), and [mdc-ripple](../packages/mdc-ripple).
Even the `autoInit()` function [lives in its own package](../packages/mdc-auto-init), which the
`material-components-web` package uses to register all of the individual components to their names used
within `data-mdc-auto-init`. Each component can be used as a standalone package, and can be mixed
and matched at will. This allows for custom builds requiring the minimum possible amount of CSS/JS
code. It also means that MDC-Web works extremely well with module loading systems and modern
front-end toolchains.

### Adding the business logic

Finally, let's add our (very simple) business logic to the bottom of the page, which intercepts the
form submission and uses the input field values to print out an appropriate greeting. Add the
following below the last `<script>` tag within the `<body>`:

```html
<script>
  document.getElementById('greeting-form').addEventListener('submit', function(evt) {
    evt.preventDefault();
    var firstname = evt.target.elements.firstname.value;
    var lastname = evt.target.elements.lastname.value;
    var greeting = 'Hello';
    if (firstname || lastname) {
      greeting += ', ';
      if (firstname && lastname) {
        greeting += firstname + ' ' + lastname;
      } else if (lastname) {
        greeting += 'Mx. ' + lastname;
      } else {
        greeting += firstname;
      }
    }
    greeting += '!';

    document.getElementById('greeting').textContent = greeting;
  });
</script>
```

When you save the file and the page reloads, you should be able to type your name into the form,
hit the button, and get a pleasant greeting :wave:

### Changing the theme

You may have noticed that the button background, as well as the label and underline on focused text
input fields, defaults to the Indigo 500 (`#673AB7`) color from the [Material Design color palette](https://material.io/guidelines/style/color.html#color-color-palette).
This is part of the default theme that ships with MDC-Web; it uses Indigo 500 for a primary color, and
Pink A200 (`#FF4081`) for a secondary color. Let's change the theme's primary color.

A common misconception when implementing Material Design is that the colors you use _must_ come from
the Material Design color palette. This is not true at all. The only defining guideline for color within Material
Design is that it has "bold hues juxtaposed with muted environments, deep shadows, and bright
highlights". Let's change our theme's primary color to `#0E4EAD`, the "Afternoon_Skyblue" color from
the [Deep_Skyblues Colourlovers Palette](http://www.colourlovers.com/palette/334208/Deep_Skyblues).

The easiest way to change the theme of an MDC-Web application is via [CSS Variables](https://developer.mozilla.org/en-US/docs/Web/CSS/Using_CSS_variables). Simply add the
following to the `<head>` tag of `index.html`:

```html
<style>
  :root {
    --mdc-theme-primary: #0e4ead;
  }
</style>
```

If you're using any supported browser, besides IE 11, you'll see that the button background as well as the focused underline and label on text
fields are now a nice, dark shade of blue.

> Note that using CSS Variables is just one way of theming using MDC-Web. Check out our
[theming documentation](./theming.md) for more info.

### Finishing touches: adding custom styles

Every site is different, and we cannot hope to build a user interface library that
anticipates every design choice a user may want.

#### SASS mixins

MDC-Web provides SASS mixins to some components to help users do customization. Let's
change the background color of the raised button to be a bright orange color (#FF9800)
using one of those mixins.

Add the following to your `scss` file if you are using SASS:

```scss
@import "@material/mdc-button/mixins";
.mdc-button.mdc-button--raised {
  @include mdc-button-filled-accessible(#FF9800);
}
```

#### CSS

MDC-Web also uses plain old CSS to make it trivial to customize and modify its
styles to your liking. Let's add some auxiliary styles to bump up the vertical spacing
between the form fields and the submit button.

Add the following to the `<style>` tag within `<head>`:

```css
#greeting-form > button {
  margin-top: 8px;
}
```

Congrats! You've built your first MDC-Web app! In the process, you've learned the basics of MDC-Web,
how to easily add components to a page, and how to customize and theme MDC-Web to your liking.

## Next steps

If you're looking to incorporate MDC-Web Components into a framework like Angular or React, check our
[framework integration guide](./integrating-into-frameworks.md). 

If you'd like to contribute to
MDC-Web and build your own components, or extend one of ours to fit your own purposes, check out our
guide on [authoring components](./authoring-components.md).
