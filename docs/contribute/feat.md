# Add a Feature

Adding a feature begins with a new branch and a new API.
_All new APIs require test coverage_. This test can be either a JavaScript
test, _or_ it can be a demo page. CSS only APIs can only be verified with a
demo page.

![MDC Web New Feature](feat.jpg?raw=true)

> If your feature spans multiple packages, then you'll have to break your PR
into multiple PRs. First create a new feature PR for the package which does not
depend on any of the other packages. After that PR is merged, continue working
your way up the dependency tree, submiting new PRs until the last PR is merged.

### Format Commit Message

The final commit message for a feature to the `mdc-foo` package should look like this:

```
feat(foo): Short description of feature
```

This commit message is pulled into our CHANGELOG when we [release](../open_source/README.md) and is based on [Angular's Git commit guidelines](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit).
