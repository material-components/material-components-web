# Code Review

MDC Web team members review every single pull request (PR) before it is merged
into the code base. We aim for a quick review process, but without sacrificing
good component APIs and code maintenance.

## Pull Request Assignments

We currently have six team members, and we normally have bandwidth to respond to
two PRs each a day (thats twelve PRs total). We do NOT have a service level agreement
to respond to PRs within some timeframe. If there are lots of PRs to review, then we
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
*  Are there corresponding (internal) screenshot tests?
*  Do types of the methods/variables/objects/etc. follow our [best practices and conventions](../code/best_practices.md#typescript)?

If the tests are failing, or the demo does not work, request changes from the
developer before reviewing the contents of the PR.

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

*  Verify there is 100% coverage of CSS modifier classes on the catalog page
*  Verify there is coverage of overflow situations, e.g. long text in a small container

### Test Coverage

Verify there is no decrease in code coverage!

### Code Maintainability

Once you're satisfied the component actually works, comment on ways to improve
the code. Reference [isolation best practices](../code/best_practices.md)
as necessary.

*  Every property of a CSS stanzas should be understandable without too much context
*  DOM structure should be understandable without too much context
*  Sass functions should not be too long, break up logic with smaller functions
*  JS Methods should not be too long, break up logic with smaller methods
*  Vanilla adapter method implementations should be as short as possible. Users will override these methods, so they must be atomic


