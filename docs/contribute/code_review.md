# Code Review

MDC Web team members review every single PR before it is merged into the code
base. We aim for a quick review process, but without sacrificing good component
APIs and code maintenance.

## PR Assignments

We currently have six team members, and we normally have bandwidth to respond to
two PRs each a day (thats twelve PRs total). We do NOT have an SLA to respond
to PRs within some timeframe. If there are lots of PRs to review, then we
simply might not get to yours for a couple days.

Once a MDC Web team member has started reviewing a PR, they will be the only
point of contact until the PR is closed. The reviewer should self-assign so that
other team members don't review the same code.

If an MDC Web team member requests changes, and the contributor hasn't responded
in more than two weeks, the reviewer might close the PR. This saves our sanity
of having too many open pull requests.

## Checklist

### Check The Obvious

*  Do tests pass?
*  Does the demo work?

If either of these don’t work, send that review first before diving into
API design

### API Design

An API should be in it's simplest form! Check each of these developer facing
APIs:

*  Sass Variables, Mixins, Functions
*  CSS classes
*  DOM structure
*  Utility JavaScript Functions
*  Foundation
*  Adapter
*  Component

Reference [naming best practices](../code/best_practices.md)
as necessary. Verify the documentation follows [README standards](../code/readme_standards.md).
If you have large concerns with the API design, send those comments first
before diving into the rest of this checklist.

### Catalog Coverage

CSS needs to be visually verified. So run the catalog server and:

*  Verify there is 100% coverage of CSS modifier classes on catalog page
*  Verify there is coverage of overflow situations, e.g. long text in a small container

### Code Maintainability

Once you're satisfied the component actually works, comment on ways to improve
the code. Reference [isolation best practices](../code/best_practices.md)
as necessary.

*  Every property of a CSS stanzas should be understandable without too much context
*  DOM structure should be should be understandable without too much context
*  Sass functions should not be too long, break up logic with smaller functions
*  JS Methods should not be too long, break up logic with smaller methods


