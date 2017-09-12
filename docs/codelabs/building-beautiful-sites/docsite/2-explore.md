<!--docs:
title: "2. Explore the starter code"
layout: landing
section: codelab
path: /codelab/2-explore/
-->

<!--
This is a simplified version of Building Beautiful Sites with MDC web
edited for a non-technical audience
-->

<link rel="stylesheet" href="css/codelab.css" />

# Explore the starter code

While far from the end result we want, our skeleton site is looking pretty good already! Let’s take a look around.

## Explore index.html

Open up `index.html` in the starter directory. It should look like the following:

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
  <link rel="stylesheet"
        href="https://unpkg.com/material-components-web@0.9.1/dist/material-components-web.min.css">
  <link rel="stylesheet" href="app.css">
</head>
<body class="mdc-typography">
  <h1 class="mdc-typography--display4">Shrine</h1>
  <main>
    <div class="mdc-card shrine-product-card">
      <section class="mdc-card__primary">
        <span class="mdc-card__title shrine-product-card__price">$20</span>
      </section>
      <img class="shrine-product-card__image" width="240" height="240" alt="Sunglasses" src="assets/sunnies.png">
    </div>
    <!-- ... -->
```

The first thing to notice here is that we’re using a `<link>` tag to load a fully-built version of MDC-Web via the [unpkg CDN](https://unpkg.com/#/). We publish MDC-Web via NPM. Using unpkg is a great way to experiment with MDC-Web without the need to immediately include it as a dependency. Note that we include [normalize.css](https://necolas.github.io/normalize.css/) for consistent cross-browser rendering, as well as the [Roboto font](https://fonts.google.com/specimen/Roboto) from Google Fonts.

> Note that we pinned the version to `0.9.1` for the purpose of this codelab, as the `latest` version is under active development. For available components and the latest APIs, please checkout our [Github Repository](https://github.com/material-components/material-components-web) and [demo site](http://material-components-web.appspot.com/).
{: .hint}


Let’s look at what’s in the `<body>` of the document. What you’ll mainly notice is a bunch of mdc-* CSS classes. These css classes are provided to you by MDC-Web (free of charge 😉). Some of the classes already in use are:

- [mdc-typography](https://github.com/material-components/material-components-web/tree/master/packages/mdc-typography) - Provides typographic treatments which conform to the [Material Design typography guidelines](https://material.google.com/style/typography.html). Notice the use of `mdc-typography--display4` on the `h1` element.
- [mdc-card](https://github.com/material-components/material-components-web/tree/master/packages/mdc-card) -  Provides a versatile collection of css classes which can be used to implement [Material Design card components](https://material.io/guidelines/components/cards.html).

> One final thing to note about this HTML: There is absolutely no JavaScript required to render or use these components. While our more interactive components require JavaScript, many of the core MDC-Web components either do not require JavaScript at all, or gracefully degrade to use CSS only. We’ve tried extremely hard on MDC-Web to make Material Design as simple and intuitive as possible on the web platform.
{: .hint}

## Explore app.css

You might have noticed some additional css classes in the HTML above, like `shrine-product-card`. These styles are defined in `app.css`. Open `app.css` and you will see the following:

```css
html, body {
  height: 100%;
  background-color: #f2f2f2;
}

.shrine-product-card {
  margin: 0 auto;
  width: 320px;
  border-radius: 4px;
  margin-bottom: 8px;
  background-color: white;
}

.shrine-product-card__price {
  display: block;
  text-align: right;
}

.shrine-product-card__image {
  margin: 0 auto;
}
```

The top style declaration is used to add some basic styling to the page. However, the subsequent style declarations are attached to classes present within our `mdc-card` elements. MDC-Web treats its DOM structure as part of its public API. It is highly encouraged for you to create the design your product requires, by making custom style modifications to components via your own classes.

> Note: The __ formatting in these selectors comes from the [BEM pattern](http://getbem.com/), a method used to semantically structure CSS classes. MDC-Web follows a [modified version](https://csswizardry.com/2013/01/mindbemding-getting-your-head-round-bem-syntax/) of this pattern, thus we use it here in our example custom styles.
{: .hint}

Now that you’re familiar with the starter code, let’s implement our first feature.
