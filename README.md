[![Build Status](https://img.shields.io/travis/material-components/material-components-web/master.svg)](https://travis-ci.org/material-components/material-components-web/)
[![codecov](https://codecov.io/gh/material-components/material-components-web/branch/master/graph/badge.svg)](https://codecov.io/gh/material-components/material-components-web)
[![Chat](https://img.shields.io/discord/259087343246508035.svg)](https://discord.gg/material-components)

# Material Components for the web

Material Components for the web (MDC Web) helps developers execute [Material Design](https://www.material.io).
Developed by a core team of engineers and UX designers at Google, these components enable a reliable development workflow to build beautiful and functional web projects.

Material Components for the web is the successor to [Material Design Lite](https://getmdl.io/), and has 3 high-level goals:

- Production-ready components consumable in an a-la-carte fashion
- Best-in-class performance and adherence to the [Material Design guidelines](https://material.io/guidelines)
- Seamless integration with other JS frameworks and libraries
  - [Preact Material Components](https://github.com/prateekbh/preact-material-components)
  - [RMWC: React Material Web Components](https://github.com/jamesmfriedman/rmwc)
  - [Angular MDC](https://github.com/trimox/angular-mdc-web)
  - [Blox Material](https://blox.src.zone/material): Angular Integration Library.
  - [Vue MDC Adapter](https://github.com/stasson/vue-mdc-adapter): MDC Web Integration for Vue.js (using [foundation/adapters](./docs/integrating-into-frameworks.md#the-advanced-approach-using-foundations-and-adapters).)
  - [Material Components Vue](https://github.com/matsp/material-components-vue): MDC Web Integration for Vue.js (using [vanilla components](./docs/integrating-into-frameworks.md#the-simple-approach-wrapping-mdc-web-vanilla-components))
  - More coming soon! Feel free to submit a pull request adding your library to this list, so long as you meet our [criteria](docs/integrating-into-frameworks.md).

MDC Web strives to seamlessly incorporate into a wider range of usage contexts, from simple static websites to complex, JavaScript-heavy applications to hybrid client/server rendering systems. In short, whether you're already heavily invested in another framework or not, it should be easy to incorporate Material Components into your site in a lightweight, idiomatic fashion.

## Quick start

> Note: This guide assumes you have npm installed locally.

### Include CSS for a component

> Note: This guide assumes you have webpack configured to compile Sass into CSS. See this [getting started guide](docs/getting-started.md) for pointers on how to configure webpack.

To include the Sass files for the Material Design button, install the Node dependency:

```
npm install @material/button
```

Then import the Sass files for @material/button into your application. You can also use Sass mixins to customize the button:

```scss
@use "@material/button/mdc-button";
@use "@material/button;
@use "@material/ripple;

.foo-button {
  @include button.ink-color(teal);
  @include ripple.states(teal);
}
```
@material/button has [documentation](packages/mdcbutton/README.md) about the required HTML of a button. Update your application's HTML to include this HTML, and add the foo-button class onto the element:

```html
<button class="foo-button mdc-button">
  <div class="mdc-button__ripple"></div>
  <div class="mdc-button__label">Button</div>
</button>
```

You also need to configure the sass-loader to understand the @material syntax. Update your webpack.config.js by changing `{ loader: 'sass-loader' }` to:

```javascript
{
  loader: 'sass-loader',
  options: {
    importer: function(url, prev) {
      if(url.indexOf('@material') === 0) {
        var filePath = url.split('@material')[1];
        var nodeModulePath = `./node_modules/@material/${filePath}`;
        return { file: require('path').resolve(nodeModulePath) };
      }
      return { file: url };
    }
  }
}
```

This will produce a customized Material Design button!

![Button](docs/button.png)

### Include JavaScript for a component

> Note: This guide assumes you have webpack configured to compile ES2015 into JavaScript. See this [getting started guide](docs/getting-started.md) for pointers on how to configure webpack.

To include the ES2015 files for the Material Design ripple, install the Node dependency:

```
npm install @material/ripple
```

Then import the ES2015 file for @material/ripple into your application, and initialize an MDCRipple with a DOM element:

```javascript
import {MDCRipple} from '@material/ripple';
const ripple = new MDCRipple(document.querySelector('.foo-button'));
```

This will produce a Material Design ripple on the button!

![Button with Ripple](docs/button_with_ripple.png)

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
