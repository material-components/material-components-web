# Fix a Bug

Fixing a bug begins with a GitHub issue, a new branch, and a failing test.
_All bug fixes require test coverage_. This test can be either a JavaScript
test, _or_ it can be a demo page. A lot of our fixes are CSS only fixes, and
this can only be verified with a demo page.

![MDC Web Bug Fix](bug_fix.jpg?raw=true)

> If your fix requires a new API, then you'll have to break your PR into two.
First create a new PR with a new feature, following [this feature workflow](feat.md).
After that PR is merged, then submit the fix PR.

### Format Commit Message

The final commit message for a fix to the mdc-foo package, for GitHub issue 1234, should look like this:

```
fix(foo): Short description of fix
Resolves #1234
```

This commit message is pulled into our CHANGELOG when we [release](../open_source/README.md) and is based on [Angular's Git commit guidelines](https://github.com/angular/angular.js/blob/master/CONTRIBUTING.md#commit).
