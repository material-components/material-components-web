# Release Process

> **Note**: This process changed somewhat when we switched lerna to fixed mode
> for v0.23.0. Look at older versions for reference of how this worked in
> independent mode.

### Setup Local Environment

> Employees are supposed to do this as part of onboarding, but we've put it here
> as a reminder.

`npm login`

This will log you into NPM.

`gcloud init`

This will log you into Google Cloud account. Choose `material-components-web`
where necessary.

### Announce

Ping the Slack announcements channel first! This will let other members of the
team know NOT to merge PRs during this release process.

### Pre-Release

`./scripts/pre-release.sh`

This will:
 
1. Check out the `master` branch and pull down the latest commits from GitHub
1. Ensure that you can publish/tag on GitHub and NPM
1. Verify that all tests pass

### Release

`./scripts/release.sh`

This will:
 
1. Run lerna to generate a new version number
1. Compile our code and write distributable JS/CSS files to `packages/*/dist/`
1. Generate a new `CHANGELOG.md`

When lerna prompts for version, you should pick `Minor` for typical releases,
or `Patch` for hotfix releases with no breaking changes.

**Note:** lerna asks "Are you sure you want to publish the above changes?", but
it will _not_ actually publish anything. We'll do that in the next step.

### Post-Release

`./scripts/post-release.sh`

This will:

1. Commit the new package versions
1. Commit the updated `CHANGELOG.md`
1. Generate a new `vX.Y.Z` semver tag
1. Push the commits up to GitHub
1. Publish packages to NPM
1. Deploy the catalog server

> Make sure that a CHANGELOG commit actually appears in your `git log`!

[Double check that the catalog server is live](https://material-components-web.appspot.com/)

> If you run into CLI errors such as:
> ```
> remote: error: GH006: Protected branch update failed for refs/heads/master.
> remote: error: Required status check "cla/google" is expected. At least one approved review is required by reviewers with write access.
> To github.com:material-components/material-components-web.git
> ! [remote rejected]   master -> master (protected branch hook declined)
> ```
> You may need to update Github's master branch protection:
> 1. Go to: [settings page](https://github.com/material-components/material-components-web/settings/branches/master)
> 1. Uncheck `Include administrators`
> 1. Click Save changes
> 1. Perform `git push && git push --tags`
> 1. Don't forget to toggle on `Include administrators` & click Save changes
