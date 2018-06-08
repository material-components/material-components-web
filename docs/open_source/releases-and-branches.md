# Releases and Branches

This document describes the branching and release strategy we use for MDC Web, and how it affects dependent repositories
we maintain, namely the [MDC Web Catalog](https://github.com/material-components/material-components-web-catalog) and
[MDC React](https://github.com/material-components/material-components-web-react).

For an explanation of the steps needed to cut a release of MDC Web, see [Release Process](./release-process.md).

## MDC Web Release Schedule and Versioning

MDC Web follows a 2-week release cycle. We expect to have one release per month containing breaking changes, to coincide
with the [Material Design Roadmap](https://github.com/material-components/material-components/blob/develop/ROADMAP.md).
Any other interim releases will be patch releases including any non-breaking / non-feature changes that can be
cherry-picked from master in a straightforward manner.

This is a change from our earlier process, where we simply tagged a release with whatever has been merged to master
within the two-week cycle, and would rev the version number accordingly based on whether there were breaking changes.

## Release Types

In summary, MDC Web has the following types of releases:

* **Minor release:** A release with new features and/or breaking changes; this revs the minor version number (e.g. 0.36.0)
* **Patch release:** A release consisting primarily of bugfixes, with no features or breaking changes; this revs the patch version number (e.g. 0.36.1)
* **Pre-release:** A preview release containing breaking changes, cut before the next scheduled minor release (e.g. 0.37.0-pre.0)

See [Release Process](./release-process.md) for steps to perform for each type of release.

### About Pre-releases

MDC Web Catalog and MDC React both depend on MDC Web via npm dependencies. In order to be able to integrate
breaking changes for the upcoming release ahead of time - preferably while the necessary changes are fresh in someone's
mind - we will cut pre-releases of MDC Web when breaking changes are merged which warrant updates in the other
repositories. These will be cut on an as-needed basis, with no set schedule.

The Catalog repository (and possibly also MDC React, eventually) will each have a `next` branch, which will be updated
to point to the pre-release. Pull requests should be filed against this branch for changes needed for the upcoming
MDC Web release.

After the next minor release is cut and the `next` branch is squashed and merged into `master`, we will hard-reset the
`next` branch against `master` and force-push it to accommodate the subsequent minor release.

## Feature Branches

The `master` branch remains the default target of development, for both bug fixes and breaking changes.

If we foresee a new component requiring a large amount of work across multiple PRs and release cycles, we
should keep the work in a collective feature branch first, in an attempt to avoid API churn across releases.
(The new work on MDC Tab and associated packages is one example.)

This allows work on the feature to be performed across multiple separate PRs, which will each be merged into the feature
branch, before finally merging the feature branch into `master` after all aspects of the feature are complete.
