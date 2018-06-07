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

### Breaking-change Releases

These are currently our minor releases, e.g. 0.35.0, 0.36.0, etc. These follow the currently-outlined
[Release Process](./release-process.md) and are performed against `master`.

### Pre-releases

MDC Web Catalog and MDC React both depend on MDC Web via npm dependencies. In order to be able to integrate
breaking changes for the upcoming release ahead of time - preferably while the necessary changes are fresh in someone's
mind - we will cut pre-releases of MDC Web when breaking changes are merged which warrant updates in the other
repositories. These will be cut on an as-needed basis, with no set schedule.

The Catalog and React repositories will each have a `next` branch, which will be updated to point to the pre-release.
Pull requests should be filed against this branch for changes needed for the upcoming MDC Web release.

Later, when the new version of MDC Web is released, the `next` branch will again be updated to point to the new release,
and we will open a PR to squash & merge its contents onto `master`. Once this is done, the `next` branch will be
hard-reset against `master` and force-pushed to accommodate the subsequent release.

The process for pre-releases should be largely similar to the process for regular releases, with minor changes
(such as the addition of a very important `lerna` option to avoid updating the `latest` tag on npm).

Pre-releases will also involve updates to the CHANGELOG. We should consolidate these when tagging the final
release to make it easier to read, since the pre-releases will be irrelevant at that point.

### Bugfix Releases

Bugfix releases for MDC Web will be released based on the last tagged release, with any commits not involving
breaking changes or features cherry-picked in. The process would look as follows (using 0.36.x as an example):

1. `git checkout v0.36.0` (or e.g. `v0.36.1` if this is the second bugfix release since the last breaking-change release)
2. `git cherry-pick -x <commits>`
3. Follow the [release process](./release-process.md), choosing "patch" when lerna prompts for version
4. Cherry-pick the publish and CHANGELOG commits onto `master` to ensure that bugfix releases are included in the overall history

A branch can be created in/after step 1 if desired, but should be temporary - the bugfix release can be referenced via
its git tag once the release process is done.

We're working on automating the task of finding non-breaking/non-feature commits, cherry-picking them, and test-running
the build and unit tests, but it will still require manually checking for commits dependent on features or breaking
changes that were pruned.

We may refine this process (and move some documentation to the Release Process page) based on our experiences after our
next bugfix release.

> Note: In the rare occasion that no breaking changes have been committed since the last breaking-change release,
> a bugfix release can simply be released directly against `master` as documented for breaking-change releases above.

## Feature Branches

The `master` branch remains the default target of development, for both bug fixes and breaking changes.

If we foresee a new component requiring a large amount of work across multiple PRs and release cycles, we
should keep the work in a collective feature branch first, in an attempt to avoid API churn across releases.
(The new work on MDC Tab and associated packages is one example.)

This allows work on the feature to be performed across multiple separate PRs, which will each be merged into the feature
branch, before finally merging the feature branch into `master` after all aspects of the feature are complete.
