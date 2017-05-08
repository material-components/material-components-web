# Developing MDC-Web Components

MDC-Web strives to seamlessly incorporate into a wide range of usage contexts - from simple static websites to complex, JavaScript-heavy applications to hybrid client/server rendering systems. To make this possible, our new component library is internally split into two parts:

- **MDC-Web Vanilla**: ready-to-use components (what the majority of our current users are interested in)
- **MDC-Web Foundation**: shared UI code (for lower-level usage by other frameworks or complex rendering scenarios)

On the whole, many of these changes will be transparent to Vanilla end-users, and are primarily intended to enable MDC-Web to work across the entire web platform.

## Component Architecture

There are several key design decisions that underpin MDC-Web Foundation:

- Event handling and DOM rendering responsibilities delegated to host framework
- Heavy reliance on CSS for code simplicity, portability, and graceful degradation
- Minimal assumptions about component lifecycle

The aim being to push forward a clear separation of concerns, with the Foundation code being entirely about UI-related matters - as opposed to data-binding, templating, key/input handling, etc. In the case of Vanilla, we take a plain JS approach towards wrapping Foundation and providing the necessary code to make things usable out-of-the-box.

For a tutorial on how to get started building components, check out [Authoring Components](./authoring-components.md)

For an in-depth look at MDC-Web's architecture, check out [architecture.md](./architecture.md)

## Infrastructure and Tooling

### Build System

[Webpack](https://webpack.github.io/) is our build system of choice, which provides:

- Bundling of Sass/JS into umbrella or per-component distributions
- Fast, modern development environment (incremental compilation, source maps, live reloading, etc.)

Check out our `webpack.config.js` for more details!

### Hosting

Demo pages of Material Components for Web are hosted in Google Cloud App Engine.

### A-la-carte Components

We use [Lerna JS](https://lernajs.io/) to allow individual components to co-exist and be built within the same repository. Builds via webpack will produce artifacts for each component, which can then be used independently or via the umbrella package (`material-components-web`).

When cloning the repo for the first time, you must run `lerna bootstrap` which installs all subpackage dependencies and symlinks any project cross-dependencies.

In this manner, each MDC-Web component is isolated and can be versioned and published independently.
