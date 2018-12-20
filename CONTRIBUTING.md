# Contributing to Material Components Web (MDC Web)

We'd love for you to contribute and make Material Components for the web even better than it is today!
Here are the guidelines we'd like you to follow:

- [General Contributing Guidelines](#general-contributing-guidelines)
- [Development Process](#development-process)
  - [Setting up your development environment](#setting-up-your-development-environment)
  - [Building components](#building-components)
  - [Running the development server](#running-the-development-server)
  - [Building MDC Web](#building-mdc-web)
  - [Linting / Testing / Coverage Enforcement](#linting--testing--coverage-enforcement)
  - [Coding Style](#coding-style)
  - [Submitting Pull Requests](#submitting-pull-requests)

## General Contributing Guidelines

The Material Components contributing policies and procedures can be found in the main Material Components documentation repository’s [contributing page](https://github.com/material-components/material-components/blob/develop/CONTRIBUTING.md).

## Development Process

We strive to make developing Material Components Web as frictionless as possible, both for ourselves and for our community. This section should get you up and running working on the MDC Web codebase. Before beginning development, you may want to read through our overview on [architecture and best practices](./docs/code) to get a better understanding of our overall structure.

### Setting up your development environment

You'll need a recent version of [Node.js](https://nodejs.org/) to work on MDC Web. We typically perform local development against the latest LTS (i.e. even-major-numbered) release.

> _NOTE_: You can use [nvm](https://github.com/creationix/nvm) to easily install and manage different versions of node on your system.

> _NOTE_: If you expect to commit updated or new dependencies, please ensure you are using the latest stable version of npm, which will update `package-lock.json` appropriately as well. (Run `npm i -g npm` to update.)

Once Node.js is installed, simply clone our repo (or your fork of it) and install its dependencies:

```
git clone git@github.com:material-components/material-components-web.git  # or a path to your fork
cd material-components-web
npm i
```

### Building components

> **NOTE**: Before building a new component, it is important to open (or comment on) an issue to confirm that the component is appropriate to be contributed to MDC Web, as the core team must then
> share responsibility in maintaining it. Components not featured within the Material Design guidelines, or features with overly complex or specific use cases, are likely to be declined,
> as MDC Web's goal is to provide baseline implementations of components and systems appearing in the guidelines. In these cases, you are encouraged to create your own "contrib" repository instead.

Each component requires the following items in order to be complete:

- An **Engineering Outline Document**, which should be linked to in a comment on the GitHub issue
  where we're tracking the component. This way, the core team can review and sign off on the
  outline doc. Outline docs should be signed off on _before_ submitting a PR.
  Please [copy this google doc template](https://docs.google.com/document/d/1Kybm7XJDTy0KUcuMaw5bzirQNBsDqCPCae8U_ag_a1k/edit?usp=sharing) in order to make your outline.

  We have found that enforcing an eng outline doc has allowed us to speed up development by
  offering more informed feedback on component implementations. This results in components that
  take into account all of the concepts MDC Web components should account for (RTL, a11y,
  etc.) before they even reach the PR stage, meaning faster review and merge times :smile:.
- A **foundation class** which is integrated into actual components
- A **component class** using vanilla JS + SCSS
- A **README.md** in its subfolder which contains developer documentation on the component, following the [template](docs/code/readme_template.md) and [standards](docs/code/readme_standards.md)
- A **set of unit tests** within `test/unit/` with adequate coverage (which we enforce automatically)
- **Screenshot test pages** within `test/screenshot/spec/` that shows example usage of the component, including its variant classes and mixins

You can find much more information with respect to building components within our [authoring components guide](./docs/authoring-components.md)

### Running the development server

#### Screenshot tests

MDC Web has a full screenshot testing infrastructure. For development, you can run a development server that serves the screenshot tests and updates when JS/SCSS is changed:

```
npm start
```

The screenshot test pages are served at http://localhost:8080.

See the [screenshot test documentation](test/screenshot) for more information, and look under [test/screenshot/spec](test/screenshot/spec) to see existing components' screenshot test pages for examples.

All new components should include screenshot test pages.

#### Local demos (legacy)

Some components do not yet have screenshot tests. These components typically still have demo pages under the `demos` folder, which is served using the `dev` task:

```
npm run dev
```

The demos are served at http://localhost:8080.

### Building MDC Web

```
npm run build # Cleans out build/ and builds unminified files for each MDC Web package
npm run build:min # Builds minified files for each MDC Web package
npm run dist # Runs both of the above commands sequentially
npm run build:demos # Cleans out build/ and builds demo CSS/JS files, e.g. for deploying to App Engine
```

### Linting / Testing / Coverage Enforcement

```
npm run lint:js # Lints javascript using eslint
npm run lint:css # Lints (S)CSS using stylelint
npm run lint # Runs both of the above commands in parallel

npm run fix:js # Runs eslint with the --fix option enabled
npm run fix:css # Runs stylefmt, which helps fix simple stylelint errors
npm run fix # Runs both of the above commands in parallel

npm test # Lints all files, runs karma, runs closure tests, and then runs coverage enforcement checks.
npm run test:unit # Only runs the karma tests
npm run test:watch # Runs the karma tests on Chrome, re-running when source files change
npm run test:closure # Runs closure build tests against all closurized files
```

When running `npm run test:watch`, you can use the "DEBUG" button in the browser that is opened to open a separate debugging window which will show all test results in the browser.

You can add `?grep=...` to the debug URL in order to only run tests whose suite/test name include a given string. Additionally, you can click the arrow to the right of any test result to only run that test.
This can be very helpful for debugging failing unit tests.

### Coding Style

Our entire coding style is enforced automatically through the use of linters. Check out our [eslint config](https://github.com/material-components/material-components-web/blob/master/.eslintrc.yaml) (heavily influenced by [Google's Javascript Styleguide][js-style-guide]) as well as our [stylelint config][css-style-guide] (heavily annotated, with justifications for each rule) for further details.

### Submitting Pull Requests

When submitting PRs, make sure you're following our commit message conventions (which are the same as [angular's](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#commits)); our `commit-msg` hook should automatically enforce this. We also support [commitizen](https://www.npmjs.com/package/commitizen), which you can
use to auto-format commit messages for you.

When submitting PRs for large changes, be sure to include an adequate background in the description
so that reviewers of the PR know what the changes entail at a high-level, the motivations for making
these changes, and what they affect.

Finally, it helps to make sure that your branch/fork is up to date with what's currently on master. You can ensure this by running `git pull --rebase origin master` on your branch before opening a PR.

[js-style-guide]: https://google.github.io/styleguide/jsguide.html
[css-style-guide]: https://github.com/material-components/material-components-web/blob/master/.stylelintrc.yaml
