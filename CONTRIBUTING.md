# Contributing to Material Components Web (MDC-Web)

We'd love for you to contribute and make Material Components for the web even better than it is today!
Here are the guidelines we'd like you to follow:

- [General Contributing Guidelines](#general-contributing-guidelines)
- [Finding an Issue to Work On](#finding-an-issue-to-work-on)
- [Development Process](#development-process)
  - [Setting up your development environment](#setting-up-your-development-environment)
  - [Building Components](#building-components)
  - [Running the development server](#running-the-development-server)
  - [Building MDC-Web](#building-mdc-web)
  - [Linting / Testing / Coverage Enforcement](#linting--testing--coverage-enforcement)
    - [Running Tests across browsers](#running-tests-across-browsers)
  - [Coding Style](#coding-style)
  - [Submitting Pull Requests](#submitting-pull-requests)
  - [Releasing MDC-Web](#releasing-mdc-web)
- ["What's the core team up to?"](#whats-the-core-team-up-to)

## General Contributing Guidelines

The Material Components contributing policies and procedures can be found in the main Material Components documentation repository’s [contributing page](https://github.com/material-components/material-components/blob/develop/CONTRIBUTING.md).

## Finding an Issue to Work On

Material Components Web uses GitHub to file and track issues. To find an issue you'd like to work on, filter the issues list by the [help wanted](https://github.com/material-components/material-components-web/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) label. If you have found a bug, or would like to request a feature not represented in the list of GitHub issues, please refer to the documentation for [Contributing](https://github.com/material-components/material-components/blob/develop/CONTRIBUTING.md#issues-and-bugs)

## Development Process

We strive to make developing Material Components Web as frictionless as possible, both for ourselves and for our community. This section should get you up and running working on the MDC-Web codebase. Before beginning development, you may want to read through our brief [developer guide](./docs/developer.md) to get a better understanding of our overall architecture.

### Setting up your development environment

You'll need a recent version of [nodejs](https://nodejs.org/en/) to work on MDC-Web. We [test our builds](https://travis-ci.org/material-components/material-components-web) using both the latest and LTS node versions, so use of one of those is recommended. You can use [nvm](https://github.com/creationix/nvm) to easily install and manage different versions of node on your system.

Once node is installed, simply clone our repo (or your fork of it) and run `npm install`

```
git clone git@github.com:material-components/material-components-web.git  # or a path to your fork
cd material-components-web && npm i
```

### Building Components

Each component requires the following items in order to be complete:

- A **foundation class** which is integrated into actual components
- A **component class** using vanilla JS + SCSS
- A **README.md** in its subdir which contains developer documentation on the component, including usage.
- A **set of unit tests** within `test/unit/` with adequate coverage (which we enforce automatically).
- A **demo page** within `demos/` that shows example usage of the component.

You can find much more information with respect to building components within our [authoring components guide](./docs/authoring-components.md)

### Running the development server

```
npm run dev
open http://localhost:8080
```

`npm run dev` runs a [webpack-dev-server](https://webpack.github.io/docs/webpack-dev-server.html) instance that uses `demos/` as its content base. This should aid you in initial development of a component. It's served on port 8080.

### Building MDC-Web

```
npm run build # Builds an unminified version of MDC-Web within build/
npm run build:min # Same as above, but enables minification
npm run dist # Cleans out build/ and runs both of the above commands sequentially
```

### Linting / Testing / Coverage Enforcement

```
npm run lint:js # Lints javascript using eslint
npm run lint:css # Lints (S)CSS using stylelint
npm run lint # Runs both of the above commands in parallel

npm run fix:js # Runs eslint with the --fix option enabled
npm run fix:css # Runs stylefmt, which helps fix simple stylelint errors
npm run fix # Runs both of the above commands in parallel

npm run test:watch # Runs karma on Chrome, re-running when source files change

npm test # Lints all files, runs karma, and then runs coverage enforcement checks.
```

#### Running Tests across browsers

If you're making big changes or developing new components, we encourage you to be a good citizen and test your changes across browsers! A super simple way to do this is to use [sauce labs](https://saucelabs.com/), which is how we tests our collaborator PRs on TravisCI:

1. [Sign up](https://saucelabs.com/beta/signup) for a sauce labs account (choose "Open Sauce" as your selected plan; [it's free](https://saucelabs.com/opensauce/)!)
2. [Download sauce connect](https://wiki.saucelabs.com/display/DOCS/Setting+Up+Sauce+Connect) for your OS and make sure that the `bin` folder in the downloaded zip is somewhere on your `$PATH`.
3. Navigate to your dashboard, scroll down to where it says "Access Key", and click "Show"
4. Enter your password when prompted
5. Copy your access key
6. Run `SAUCE_USERNAME=<your-saucelabs-username> SAUCE_ACCESS_KEY=<your-saucelabs-access-key> npm test`

This will have karma run our unit tests across all browsers we support, and ensure your changes will not introduce regressions.

Alternatively, you can run `npm run test:watch` and manually open browsers / use VMs / use emulators to test your changes.

### Coding Style

Our entire coding style is enforced automatically through the use of linters. Check out our [eslint config](https://github.com/material-components/material-components-web/blob/master/.eslintrc.yaml) (heavily influenced by [Google's Javascript Styleguide][js-style-guide]) as well as our [stylelint config][css-style-guide] (heavily annotated, with justifications for each rule) for further details.

### Submitting Pull Requests

When submitting PRs, make sure you're following our commit message conventions (which are the same as [angular's](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit)); our `commit-msg` hook should automatically enforce this. We also support [commitizen](https://www.npmjs.com/package/commitizen), which you can
use to auto-format commit messages for you.

If you've done some experimental work on your branch/fork and committed these via `git commit --no-verify`, you can rebase them into one correctly-formatted commit before submitting.

Finally, it helps to make sure that your branch/fork is up to date with what's currently on master. You can ensure this by running `git pull --rebase origin master` on your branch.

> **NOTE**: Please do _not merge_ master into your branch. _Always_ `pull --rebase` instead. This ensures a linear history by always putting the work you've done after the work that's already on master, regardless of the date in which those commits were made.

### Releasing MDC-Web

> NOTE: This section is for collaborators only. Contributors without repo write access can ignore
> this section.

#### Pre-requisites

Before releasing MDC-Web, ensure that you have the following:

- Write access to the material-components-web repo
- Correct credentials for npm
- The [Google Cloud SDK](https://cloud.google.com/sdk/) installed. Please run `gcloud init` command
to login to your Google Cloud account and choose `material-components-web` if this is your first
time working with the SDK.
- Access to the `material-components-web` Google Cloud project

You should ping a core team member regarding any/all of these items if you're unsure whether or not
they are all set up.

#### Performing the release.

To release MDC-Web, you perform the following steps.

1. Run `./scripts/pre-release.sh`. This will run `npm test`, build MDC-Web, copy the built assets over
   to each module's `dist/` folder, and then print out a summary of all of the new versions that
   should be used for changed components. The summary is printed out to both the console, as well
   as a `.new-versions.log` file in the repo root. This information should be used within the
   following steps.
1. From the root directory of the repo, run `$(npm bin)/lerna publish -m "chore: Publish"`. When prompted for versions for each component, you should use the
   version info output above. In some cases, e.g. repo-wide refactors that cause all component
   versions to be updated, you can ignore this info. However, _it is strongly recommended to adhere
   to those specified versions in order to minimize human error_.
1. Run `./scripts/post-release.sh`. This will update our `CHANGELOG.md` with information for the
   current release of the overarching `material-components-web` library, and commit those changes. It will also generate a `vX.Y.Z` semver tag for the entire repo, and commit the tag as such.
1. Run `git push && git push --tags` to push the changelog changes and semver tag to master.
1. Run `MDC_ENV=development npm run build && gcloud app deploy`. This will deploy demo pages to our [App Engine demo site](https://material-components-web.appspot.com).
1. Call it a day! :tada: :rocket: :package:

## "What's the core team up to?"

The core team maintains a [public Pivotal Tracker](https://www.pivotaltracker.com/n/projects/1664011) (**tracker** for short) which details all the items we're working on within our current two-week [iteration](https://www.agilealliance.org/glossary/iteration/). This tracker mirrors in what's in our GH issues. It is used _purely for planning and prioritization purposes, **not** for discussions or community issue filing_. That being said, it's a great place to look at the overall state of our project as well as some the big ticket issues we're working on.

Each tracker story contains a link to its corresponding GH issue within its description. Each GH issue present in tracker is tagged with an `in-tracker` label. This will hopefully make it easy to move between the two if so desired.


[js-style-guide]: https://google.github.io/styleguide/jsguide.html
[css-style-guide]: https://github.com/material-components/material-components-web/blob/master/.stylelintrc.yaml
