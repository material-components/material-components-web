[![Version](https://img.shields.io/npm/v/material-components-web.svg)](https://www.npmjs.com/package/material-components-web)
[![Build Status](https://travis-ci.com/material-components/material-components-web.svg?branch=master)](https://travis-ci.com/material-components/material-components-web/)
[![codecov](https://codecov.io/gh/material-components/material-components-web/branch/master/graph/badge.svg)](https://codecov.io/gh/material-components/material-components-web)
[![Chat](https://img.shields.io/discord/259087343246508035.svg)](https://discord.gg/material-components)
[![Screenshots](https://us-central1-material-components-web.cloudfunctions.net/screenshot-shield-svg)](https://us-central1-material-components-web.cloudfunctions.net/screenshot-shield-url)

# Material Components for the web

Material Components for the web (MDC Web) helps developers execute [Material Design](https://www.material.io).
Developed by a core team of engineers and UX designers at Google, these components enable a reliable development workflow to build beautiful and functional web projects.

Material Components for the web is the successor to [Material Design Lite](https://getmdl.io/), and has 3 high-level goals:

- Production-ready components consumable in an a-la-carte fashion
- Best-in-class performance and adherence to the [Material Design guidelines](https://material.io/guidelines)
- Seamless integration with other JS frameworks and libraries
  - [Material Components for React](https://github.com/material-components/material-components-web-react): MDC Web integration for React (using [foundations/adapters](./docs/integrating-into-frameworks.md#the-advanced-approach-using-foundations-and-adapters))
  - [Material Web Components](https://github.com/material-components/material-components-web-components): MDC Web integration for Web Components (using [vanilla components](./docs/integrating-into-frameworks.md#the-simple-approach-wrapping-mdc-web-vanilla-components))
  - Additional third-party integrations
    - [Preact Material Components](https://github.com/prateekbh/preact-material-components)
    - [RMWC: React Material Web Components](https://github.com/jamesmfriedman/rmwc)
    - [Angular MDC](https://github.com/trimox/angular-mdc-web)
    - [Blox Material](https://blox.src.zone/material): Angular Integration Library.
    - [Vue MDC Adapter](https://github.com/stasson/vue-mdc-adapter): MDC Web Integration for Vue.js (using [foundations/adapters](./docs/integrating-into-frameworks.md#the-advanced-approach-using-foundations-and-adapters).)
    - [Material Components Vue](https://github.com/matsp/material-components-vue): MDC Web Integration for Vue.js (using [vanilla components](./docs/integrating-into-frameworks.md#the-simple-approach-wrapping-mdc-web-vanilla-components))
    - [BalmUI](https://material.balmjs.com/): Next Generation Material UI for Vue.js
    - [Ember Material Components](https://github.com/onehilltech/ember-cli-mdc): MDC Web integration for Ember (using [vanilla components](./docs/integrating-into-frameworks.md#the-simple-approach-wrapping-mdc-web-vanilla-components))

  - More coming soon! Feel free to submit a pull request adding your library to this list, so long as you meet our [criteria](docs/integrating-into-frameworks.md).

MDC Web strives to seamlessly incorporate into a wider range of usage contexts, from simple static websites to complex, JavaScript-heavy applications to hybrid client/server rendering systems. In short, whether you're already heavily invested in another framework or not, it should be easy to incorporate Material Components into your site in a lightweight, idiomatic fashion.

**[Demos](https://material-components.github.io/material-components-web-catalog)** (updated with every release)

> Note: Material Components Web follows semver and is still in version 0.x, which means it is regularly subject to
> breaking changes. We typically follow a 2-week release schedule which includes one minor release per month with
> breaking changes, and intermediate patch releases with bug fixes.
> A list of changes is always available in the [CHANGELOG](./CHANGELOG.md),
> and a tentative schedule of what we are working on next is available in the [ROADMAP](./ROADMAP.md).

## Quick start

> Note: This guide assumes you have Node.js and npm installed locally.

### Include CSS for a component

> Note: This guide assumes you have webpack configured to compile Sass into CSS. See the [getting started guide](docs/getting-started.md) for pointers on how to configure webpack.

To include the Sass files for the Material Design button, install the Node dependency:

```
npm install @material/button
```

Then import the Sass files for `@material/button` into your application. You can also use Sass mixins to customize the button:

```scss
@import "@material/button/mdc-button";

.foo-button {
  @include mdc-button-ink-color(teal);
  @include mdc-states(teal);
}
```

You also need to configure sass-loader to understand the `@material` imports used by MDC Web. Update your `webpack.config.js` by changing `{ loader: 'sass-loader' }` to:

```js
{
  loader: 'sass-loader',
  options: {
    includePaths: ['./node_modules']
  }
}
```

`@material/button` has [documentation](packages/mdc-button/README.md) about the required HTML for a button. Update your application's HTML to include the MDC Button markup, and add the `foo-button` class to the element:

```html
<button class="foo-button mdc-button">
  Button
</button>
```

This will produce a customized Material Design button!

<img src="docs/button.png" alt="Button" width="90" height="36">

### Include JavaScript for a component

> Note: This guide assumes you have webpack configured to compile ES2015 into JavaScript. See the [getting started guide](docs/getting-started.md) for pointers on how to configure webpack.

To include the ES2015 files for the Material Design ripple, install the dependency:

```
npm install @material/ripple
```

Then import the ES2015 file for @material/ripple into your application, and initialize an MDCRipple with a DOM element:

```js
import {MDCRipple} from '@material/ripple/index';
const ripple = new MDCRipple(document.querySelector('.foo-button'));
```

> Note: Import `@material/ripple/index` if you wish to transpile MDC Web's ES2015 sources as part of your build process.
> If your build toolchain is configured to only transpile your own sources, import `@material/ripple` instead, which will
> reference the distributed UMD module instead.

This will produce a Material Design ripple on the button!

<img src="docs/button_with_ripple.png" alt="Button with Ripple" width="90" height="36">

## Useful links

- [Getting Started Guide](docs/getting-started.md)
- [All Components](packages/)
- [Demos](demos/)
- [Contributing](CONTRIBUTING.md)
- [Material.io](https://www.material.io) (external site)
- [Material Design Guidelines](https://material.io/guidelines) (external site)

## Need help?

We're constantly trying to improve our components. If Github Issues don't fit your needs, then please visit us on our [Discord Channel](https://discord.gg/material-components).

## Browser support

We officially support the last two versions of every major browser. Specifically, we test on the following browsers:

- **Chrome** on Android, Windows, macOS, and Linux
- **Firefox** on Windows, macOS, and Linux
- **Safari** on iOS and macOS
- **Edge** on Windows
- **IE 11** on Windows

## Thank you

Fast, reliable [automated screenshot testing](test/screenshot/) is generously provided by:

[![CrossBrowserTesting logo](test/screenshot/static/images/cbt-logo.png)](https://crossbrowsertesting.com/)

Free for open source projects!

Additional continuous integration services courtesy of:

- [Travis CI](https://travis-ci.com/)
- [Sauce Labs](https://saucelabs.com/)
