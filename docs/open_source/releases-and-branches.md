# Releases and Branches

This document describes the branching and release strategy we use for MDC Web, and how it affects dependent repositories
we maintain, namely the [MDC Web Catalog](https://github.com/material-components/material-components-web-catalog) and
[MDC React](https://github.com/material-components/material-components-web-react).

For an explanation of the steps needed to cut a release of MDC Web, see [Release Process](./release-process.md).

## Branches

- The `master` branch is the default branch for any non-breaking changes.
- The `develop` branch is the target branch for breaking changes.

## MDC Web Release Schedule and Versioning

MDC Web follows a 2-week release cycle. We expect to have 2 - 4 releases per year containing breaking changes.
Any other interim releases will be patch or minor releases including any non-breaking changes.

By having a lower rate of releases with breaking changes, we will decrease the amount of overhead that users experience trying to upgrade.

## Release Types

In summary, MDC Web has the following types of releases:

* **Major release:** A release with new features and breaking changes; this revs the major version number (e.g. 2.0.0)
* **Minor release:** A release with non breaking changes including new features and/or bugfixes; this revs the minor version number (e.g. 1.1.0)
* **Patch release:** A release consisting primarily of bugfixes, with no features or breaking changes; this revs the patch version number (e.g. 1.0.1)
* **Pre-release:** A preview release containing breaking changes, cut before the next scheduled major release (e.g. 2.0.0-0)

See [Release Process](./release-process.md) for steps to perform for different types of releases.

### About Pre-releases

MDC Web Catalog and MDC React both depend on MDC Web via npm dependencies. In order to be able to integrate
breaking changes for the upcoming release ahead of time - preferably while the necessary changes are fresh in someone's
mind - we will cut pre-releases of MDC Web when breaking changes are merged which warrant updates in the other
repositories. These will be cut on an as-needed basis, with no set schedule.

The Catalog repository will each have a `next` branch, which will be updated
to point to the pre-release (or tested against unreleased code using
[this script](https://gist.github.com/kfranqueiro/d06c7073c5012de3edb6c5875d6a4a50)).
Pull requests should be filed against this branch for changes needed for the upcoming MDC Web release.

After the next major release is cut and the `next` branch is squashed and merged into `master`, we will hard-reset the
`next` branch against `master` and force-push it to accommodate the subsequent minor release.

## Feature Branches

If we foresee a new component requiring a large amount of work across multiple PRs and release cycles, we
should keep the work in a collective feature branch first, in an attempt to avoid API churn across releases.
(The TypeScript rewrite is one example, which occured in v1.0.0.)

This allows work on the feature to be performed across multiple separate PRs, which will each be merged into the feature
branch, before finally merging the feature branch into `master` after all aspects of the feature are complete.
