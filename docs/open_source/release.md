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

### Pull

> Ensure you are on the `master` branch

`git checkout master && git pull --tags`

This will pull the latest of `master` onto your git clone.

### Pre-Release

`./scripts/pre-release.sh`

This will ensure you can publish/tag, build all release files, and ensure all tests
pass prior to releasing (lerna will update versions for us in the next step).

### Release

```
$(npm bin)/lerna publish --skip-git
git commit -am "chore: Publish"
```

When lerna prompts for version, you should pick Minor for typical releases,
or Patch for hotfix releases with no breaking changes.

> **Do not forget** `--skip-git` - we want to generate the changelog before
> generating and pushing the new tag.

### Post-Release

`./scripts/post-release.sh`

This will update our CHANGELOG.md and generate a vX.Y.Z semver tag.

> Make sure that a CHANGELOG commit actually appears in your `git log`!

### Push

`git push && git push --tags`

This will ensure the commits *and* tags are pushed to the remote git repository.
(This shouldn't be necessary; lerna should already do this in fixed mode.)

### Deploy Catalog Server

`MDC_ENV=development npm run build && gcloud app deploy`

[Double check it is live](https://material-components-web.appspot.com/)
