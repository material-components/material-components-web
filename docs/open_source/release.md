# Release Process

### Setup Local Environment

> Employees are suppose to do this as part of onboarding, but we've put it here
> as a reminder.

`npm login`

This will log you into NPM.

`gcloud init`

This will log you into Google Cloud account. Choose `material-components-web`
where necessary.

### Announce

Ping the Slack announcements channel first! This will let other members of the
team know NOT to merge PRs during this release process.

### Pull

> Ensure you are on the `master` branch

`git checkout master && git pull --tags`

This will pull the latest of `master` onto your git clone.

### Pre-Release

`./scripts/pre-release.sh`

This will print out a summary of all of the new versions that should be used
for changed components. The summary is printed out to both the console, as well
as a .new-versions.log file in the repo root.

### Release

`$(npm bin)/lerna publish -m "chore: Publish"`

When prompted for versions for each component, you should use the version info
output above.

### Post-Release

`./scripts/post-release.sh`

This will update our CHANGELOG.md and generate a vX.Y.Z semver tag.

### Push

`git push && git push --tags`

This will push the CHANGELOG.md and tags to the remote git repository.

### Deploy Catalog Server

`MDC_ENV=development npm run build && gcloud app deploy`

[Double check it is live](https://material-components-web.appspot.com/)
