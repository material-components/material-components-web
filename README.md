[![Build Status](https://img.shields.io/travis/material-components/material-components-web/master.svg)](https://travis-ci.org/material-components/material-components-web/)
[![codecov](https://codecov.io/gh/material-components/material-components-web/branch/master/graph/badge.svg)](https://codecov.io/gh/material-components/material-components-web)
[![Chat](https://img.shields.io/discord/259087343246508035.svg)](https://discord.gg/material-components)

# Material Components for the web

Material Components for the web (MDC-Web) helps developers execute [Material Design](https://www.material.io).
Developed by a core team of engineers and UX designers at Google, these components enable a reliable development workflow to build beautiful and functional web projects.

Material Components for the web is the successor to [Material Design Lite](https://getmdl.io/), and has 3 high-level goals:

- Production-ready components consumable in an a-la-carte fashion
- Best-in-class performance and adherence to the [Material Design guidelines](https://material.io/guidelines)
- Seamless integration with other JS frameworks and libraries
  - [Preact Material Components](https://github.com/prateekbh/preact-material-components)
  - [RMWC: React Material Web Components](https://github.com/jamesmfriedman/rmwc)
  - [Blox Material](https://blox.src.zone/material): Angular Integration Library.
  - More coming soon! Feel free to submit a pull request adding your library to this list, so long as you meet our [criteria](docs/integrating-into-frameworks.md).

MDC-Web strives to seamlessly incorporate into a wider range of usage contexts, from simple static websites to complex, JavaScript-heavy applications to hybrid client/server rendering systems. In short, whether you're already heavily invested in another framework or not, it should be easy to incorporate Material Components into your site in a lightweight, idiomatic fashion.

**[Demos](https://material-components-web.appspot.com/)** (updated with every release)

## Quick start

Install the library

```
npm install --save material-components-web
```

Then simply include the correct files, write some HTML, and call `mdc.autoInit()` within a closing
`<script>` tag.

```html
<!DOCTYPE html>
<html class="mdc-typography">
  <head>
    <title>Material Components for the web</title>
    <link rel="stylesheet"
          href="node_modules/material-components-web/dist/material-components-web.css">
  </head>
  <body>
    <h2 class="mdc-typography--display2">Hello, Material Components!</h2>
    <div class="mdc-text-field" data-mdc-auto-init="MDCTextField">
      <input type="text" class="mdc-text-field__input" id="demo-input">
      <label for="demo-input" class="mdc-text-field__label">Tell us how you feel!</label>
    </div>
    <script src="node_modules/material-components-web/dist/material-components-web.js"></script>
    <script>mdc.autoInit()</script>
  </body>
</html>
```

That's all there is to it! This is the easiest way to get up and running with Material Components
for web. Check out our [Getting Started guide](./docs/getting-started.md) for a more in-depth
introduction to the library.

## Installing individual components

MDC-Web is modular by design. Each component lives within its own packages under the
[@material npm org](https://www.npmjs.com/org/material).

```
npm install --save @material/button @material/card @material/textfield @material/typography
```

All our components can be found in the [packages](./packages) directory. Each component has a
README documenting installation and usage.

## Including components

### JavaScript

If you are using a module loader such as Webpack or SystemJS to load your JS modules, you can simply
`import` every component you need from `material-components-web` and use it as such.

```js
import {checkbox as mdcCheckbox} from 'material-components-web';

const {MDCCheckbox, MDCCheckboxFoundation} = mdcCheckbox;
// Use MDCCheckbox and/or MDCCheckboxFoundation
```

You can do the same with individual components

```js
import {MDCCheckbox, MDCCheckboxFoundation} from '@material/checkbox';
// Use MDCCheckbox and/or MDCCheckboxFoundation
```

We also provide [UMD](http://bob.yexley.net/umd-javascript-that-runs-anywhere/) bundles for both `material-components-web` as
well as all individual components.

```js
const {checkbox: mdcCheckbox} = require('material-components-web/dist/material-components-web');
// Use mdcCheckbox

const {MDCCheckbox, MDCCheckboxFoundation} = require('@material/checkbox/dist/mdc.checkbox');
// Use MDCCheckbox, MDCCheckboxFoundation
```

When no module system is used, every component is added under the global `mdc` namespace. This
occurs regardless of whether or not the entire library or the individual components are used.

Every component also ships with a minified version of its UMD bundle, which can be found at
`dist/mdc.COMPONENT.min.js`.

### CSS

All components which include styles provide them at `dist/mdc.COMPONENT.css`, as well as a
complementary minified version at `dist/mdc.COMPONENT.min.css`. Note that _CSS files for a
component's dependencies are not included within the component's CSS file_, so if you are using
individual components you'll have to include each separately.

Each component also comes with a Sass source file that can be included in your application's Sass

```scss
// Using the whole library
@import "material-components-web/material-components-web";

// Using individual components / mixins
@import '@material/checkbox';
@import '@material/typography';
@import '@material/elevation/mixins'; // Mixins for elevation.
```

> NOTE: The components' Sass files expect that the `node_modules` directory containing the
`@material` scope folder is present on the Sass include path.

## Running the demos

Setup the repo:

```
git clone https://github.com/material-components/material-components-web.git && cd material-components-web
npm i
```

Run the development server (served out of `demos/`):

```
cd /path/to/material-components-web
npm run dev
open http://localhost:8080
```

## Useful Links

- [Getting Started Guide](docs/getting-started.md)
- [All Components](packages/)
- [Demos](demos/)
- [Contributing](CONTRIBUTING.md)
- [Material.io](https://www.material.io) (external site)
- [Material Design Guidelines](https://material.io/guidelines) (external site)

## Browser Support

We officially support the last two versions of every major browser. Specifically, we test on the following browsers:

- Chrome
- Safari
- Firefox
- IE 11/Edge
- Opera
- Mobile Safari
- Chrome on Android
