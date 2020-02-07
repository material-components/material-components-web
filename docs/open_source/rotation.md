# Rotation

[TOC]

This page outlines responsibilities for the oncall rotation and issue triaging
of MDC Web.

## Before you start

*   Complete MDC Web [onboarding](http://go/mdc-web-onboard) process.
*   Join
    [MDC Web rotation](https://rotations.corp.google.com/rotation/5708184800985088)
    calendar.
*   Add "Material Web Triage" meeting to your calendar.
*   Go to
    [MDC Web ZenHub Dashboard](https://goto.google.com/mdc-web-triage-bugs) to
    see Untriaged issues. (Sort Untriaged pipeline
    [by New](https://screenshot.googleplex.com/r90Yeco4ebw.png))
*   Set up notifications of your GitHub profile to receive emails for any
    activity on MDC Web
    [GitHub repository](https://github.com/material-components/material-components-web)
    when you're on-call.

## Rotation

Responsibilities of rotation on-call include:

*   Responding to GitHub
    [issues](https://github.com/material-components/material-components-web/issues)
*   Code reviewing external / internal GitHub
    [pull requests](https://github.com/material-components/material-components-web/pulls)
    (PR's)
*   Importing external GitHub PR's when they're ready to merge. See
    go/mdc-web-g3sync

### Issues

Being on-call does not mean you have be the one to actually fix issues, we
simply triage. Issues may fall in one of the following categories.

#### Feature Requests

First, check if this request is in the [spec](https://material.io/guidelines).
If you're not sure, reach out to Material System UX on-call - go/system-team or
open a thread in Material System chat room:

*   If it is not in spec, respond on the PR that we do not accept feature
    requests for components that are not in our spec, and close it.
*   If it is in the spec, discuss in triage meeting and move it to backlog.

#### Bugs

When a bug is reported, first ensure it has clear reproducible steps with
sufficient information. If not, point them to our
[bug template](https://github.com/material-components/material-components-web/issues/new?assignees=&labels=bug&template=--bug-report.md&title=%5BComponentName%5D+title)
and ask for more information.

If you're able to reproduce the bug and it is a legitimate bug in MDC Web,
respond that you were able to reproduce the bug and move it to backlog. If
you're not able to reproduce the bug, ask for more information.

If the bug is small, encourage them to open a PR before moving it to backlog.

#### Other issues

There are other issues outside of FR's or bugs, although try not to spend too
much time investigating issues that are out of scope for MDC Web. Issues can be
closed if you think they are out of scope.

*   There are a few **installation problems** that we can help with, such as,
    installing MDC Web components and usage. However, it's best if the answer to
    this question is a link to documentation. If it is out of scope, tell the
    reporter we do not have the expertise to help them with this question,
    suggest they ask on Stack Overflow for better results, and close the issue.
*   Respond to any **general questions** and see if we're missing any
    documentation. Encourage them to post on Stack Overflow instead and close
    it.

### Pull requests

Any external contributions received via GitHub
[pull requests](https://github.com/material-components/material-components-web/pulls)
on MDC Web repo needs to be reviewed or needs attention. Googlers should always
send CLs.

Follow these steps to address any external contributions:

*   When you're reviewing code, identify if PR contains any breaking change. If
    it is a huge breaking change, ask the author to revert any breaking changes
    or close the PR.
*   Follow go/mdc-web-g3sync to import a PR into google3/. (You may need to add
    additional changes in google3, such as updating BUILD rules.)
*   PR can't be merged without importing it into google3.
*   Always run a TGP (go/tgp) on the imported CL.

## Triage meeting

Triage meeting happens every Friday. If you're on-call that week, attendance is
mandatory.

On-call primary drives this meeting. Triaging involves the following steps:

*   Open [MDC Web ZenHub Dashboard](https://goto.google.com/mdc-web-triage-bugs)
    and present it to everyone.
*   Sort "Untriaged" pipeline by "New" (any new issues that are opened
    automatically appear here).
*   Go through issues that you think that needs team discussion.

In most of the cases, the oncall should have already gone through all new issues
and have a good understanding of the issue. This makes the triage meeting
smoother to discuss.
