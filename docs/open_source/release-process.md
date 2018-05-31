# Release Process

> **Note**: This process changed somewhat when we switched lerna to fixed mode
> for v0.23.0. Look at older versions for reference of how this worked in
> independent mode.

## First-time Setup

> Employees are supposed to do this as part of onboarding, but we've put it here
> as a reminder.

`npm login`

This will log you into NPM.

`gcloud init`

This will log you into Google Cloud account. Choose `material-components-web`
where necessary.

## Announce

Ping the Slack announcements channel first! This will let other members of the
team know NOT to merge PRs during this release process.

## Check Out Code

Check out the master branch and update:

```
git checkout master && git pull
```

This will pull the latest tags and `master` commits into your local repository.

### Additional Step for Bugfix Releases

Run the following script to automatically cherry-pick new bugfixes on top of the last release:

```
node scripts/cherry-pick-patch-commits
```

Read the output carefully:

* You may need to cherry-pick commits that the script could not cherry-pick cleanly without conflict
* The script may have cherry-picked fixes that rely on breaking changes or new features; these need to be removed.
  This is especially likely if the script reports that either the build or the unit tests failed.
* Examine `git log` to ensure there are no unexpected commits beyond the previous tag (in case any breaking changes
  weren't flagged properly)

After running the script, you are in a detached HEAD state. You can create a temporary local branch if desired, but all
that should need to be pushed is the tag produced at the end of the release process.

## Preparation

Run the pre-release script:

`./scripts/pre-release.sh`

This will ensure you can publish/tag, build all release files, and ensure all tests
pass prior to releasing (lerna will update versions for us in the next step).

## Release

### For Pre-releases

```
$(npm bin)/lerna publish --skip-git --npm-tag=next
git commit -am "chore: Publish"
```

When lerna prompts for version, choose prerelease.

> **Do not forget** both arguments to `publish` - we want to avoid updating the `latest` tag, and we want to
> generate the changelog before generating and pushing the new tag.

### For All Other Releases (Minor/Patch)

```
$(npm bin)/lerna publish --skip-git
git commit -am "chore: Publish"
```

When lerna prompts for version, you should pick Minor for feature/breaking-change releases,
or Patch for bugfix releases.

> **Do not forget** the `--skip-git` argument - we want to generate the changelog before generating and pushing the
> new tag.

## Post-Release

### For Pre-Releases and Bugfix Releases

Simply run the post-release script to update and commit the changelog and apply an annotated vX.Y.Z git tag:

```
./scripts/post-release.sh
```

Make sure that a CHANGELOG commit actually appears in your `git log`! If you need to retry the process:

```
git tag -d <tag> # Delete the tag that the script created
git reset --hard HEAD^ # Rewind to the previous commit
```

Alternatively, if you would like to be extra sure of the changelog, you can generate it manually prior to running the
post-release script, in which case it will skip `npm run changelog` and commit your local changes:

```
npm run changelog
git diff # Review the changelog and make sure it looks OK
./scripts/post-release.sh
```

### For Feature/Breaking-Change Releases

> Note: In the rare case there were no pre-releases leading up to this release, you can follow the same steps above.

First, update the changelog without committing it:

```
npm run changelog
```

Next, edit the changelog:

* Bring any changes from the prior pre-releases under their respective headings for the new final release
* Remove headings for the pre-releases

See [this v0.36.0 commit](https://github.com/material-components/material-components-web/commit/13fd6784866864839d0d287b3703b3beb0888d9c)
for an example of the resulting changes.

This will make the changelog easier to read, since users won't be interested in the pre-releases once the final is
tagged, and shouldn't need to read the new release's changes across multiple headings.

Finally, run the post-release script to commit the updated changelog and apply a git tag:

```
./scripts/post-release.sh
```

## Push

### For All Releases

You will need to temporarily alter Github's master branch protection in order to push after the release:

1. Go to: [settings page](https://github.com/material-components/material-components-web/settings/branches/master)
1. Uncheck `Include administrators`
1. Click Save changes
1. Perform the process outlined in one of the sections below
1. Don't forget to toggle on `Include administrators` & click Save changes afterwards

### For Pre-releases and Feature/Breaking-Change Releases

`git push origin master && git push origin <tag>`

This will ensure the new commits *and* tag are pushed to the remote git repository.

### For Bugfix Releases

`git push origin <tag>`

We don't need to push a branch for bugfix releases since we only cherry-pick commits for them at release time and they
are not tagged from master (which contains all commits, not just bugfixes). However, we *do* need to sync the new
release versions and changelog with master.

Run `git log` and take note of the publish and changelog commit hashes. Then switch to master and cherry-pick them:

```
git checkout master
git cherry-pick -x <publish hash> <changelog hash>
git push
```

## (Deprecated) Deploy Catalog Server

> Note: We now update and redeploy the [MDC Web Catalog](https://github.com/material-components/material-components-web-catalog)
> repository instead.

`MDC_ENV=development npm run build:demos && gcloud app deploy`

[Double check it is live](https://material-components-web.appspot.com/)

## Notify material.io Team

Our markdown documentation is transformed and mirrored to the Develop section of material.io.

Currently, this requires some manual work by the Tools team, so we need to notify them to update the site content.
