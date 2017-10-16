# How to Contribute

MDC Web is an open source project, so we encourage contributions! If you are
looking for a bug to fix, check out [Help Wanted Issues](https://github.com/material-components/material-components-web/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22) on GitHub. (Or you can file
new bugs, which will fall into our [Triage Process](../open_source/triage.md).)

### Fix a Bug

If you want to fix a bug, check out the workflow [here](bug_fix.md).

### Add a Feature

We consider any new API to be a new feature. An API is any of the following:

* Sass Variables, Mixins, Functions
* CSS classes
* DOM structure
* Utility JavaScript Functions
* Foundation
* Adapter
* Component

> API changes should be done in a backwards compatible way, a.k.a add _new_ APIs,
do not _remove_ old APIs. DOM structure and Adapter methods are the opposite,
you cannot add new _required_ DOM structure or Adapter methods, because this is
backwards incompatible

If you want to add a feature, check out the workflow [here](feat.md). You can
also check out our [Code Review Process](code_review.md)

