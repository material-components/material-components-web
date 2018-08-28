# Release Process

## Vocabulary

This document reuses the [terminology for release types](./releases-and-branches.md#release-types) summarized in the
Releases and Branches documentation.

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
git checkout master && git pull && git fetch --tags
```

This will pull the latest tags and `master` commits into your local repository.

### Additional Step for Patch Releases

Run the following script to automatically cherry-pick new bugfixes on top of the last release:

```
node scripts/cherry-pick-patch-commits
```

> Note: After running the script, you are in a detached HEAD state. You can create a temporary local branch if desired,
> but all that needs to be pushed is the tag produced at the end of the release process.

Read the output carefully:

* You may need to cherry-pick commits that the script could not cherry-pick cleanly without conflict
* The script may have cherry-picked fixes that rely on breaking changes or new features; these need to be removed.
  This is especially likely if the script reports that either the build or the unit tests failed.
* Examine `git log` to ensure there are no unexpected commits beyond the previous tag (in case any breaking changes
  weren't flagged properly, or features were mislabeled as fixes, etc.)

If you find you need to remove commits that should not have been cherry-picked, perform the following steps:

1. Find the base tag that the cherry-pick script identified and used (find the "Checking out v0.x.y" line in the output)
1. Run `git rebase -i <base tag>` - this will open the sequence of cherry-picked commits in an editor (probably vim)
1. Find and delete lines for commits that should not have been included (in vim, type `dd` on the line in question)
1. Save and exit (`:x` in vim)
1. Re-check `git log` to confirm that the commits are no longer present

> Note: In the rare event that zero commits were skipped, you can simply checkout master and cut the release as you
> would normally do for a minor release, and skip all of the cherry-picking back and forth.

## Preparation

Run the pre-release script:

`./scripts/pre-release.sh`

This will ensure you can publish/tag, build all release files, and ensure all tests
pass prior to releasing (lerna will update versions for us in the next step).

## Publish to npm

### For Pre-releases

```
$(npm bin)/lerna publish --skip-git --npm-tag=next --since=<previous-patch-tag>
```

When lerna prompts for version, choose **Pre-minor** for the first pre-release in a cycle, or **Prerelease** for
subsequent pre-releases.
(The resulting version number should always have the same minor version as the next planned release.)

Be sure to include the command-line flags:

* `--skip-git` avoids immediately applying a git tag, which we will do later after updating the changelog
* `--npm-tag=next` avoids updating the `latest` tag on npm, since pre-releases should not be installed by default
* `--since=<previous-patch-tag>` (e.g. `--since=v0.36.1`) forces lerna to diff against the latest patch; otherwise,
  it diffs against the previous minor release which may cause some packages without changes to be published (this
  happens when bugfix releases aren't tagged from the master branch)

### For Minor Releases

```
$(npm bin)/lerna publish --skip-git --since=<previous-patch-tag>
```

When lerna prompts for version, choose Minor.

Be sure to include the command-line flags:

* `--skip-git` avoids immediately applying a git tag, which we will do later after updating the changelog
* `--since=<previous-patch-tag>` (e.g. `--since=v0.36.1`) forces lerna to diff against the latest patch; otherwise,
  it diffs against the previous minor release which may cause some packages without changes to be published (this
  happens when bugfix releases aren't tagged from the master branch)

### For Patch Releases

```
$(npm bin)/lerna publish --skip-git
```

When lerna prompts for version, choose Patch.

Be sure to include the command-line flag; `--skip-git` avoids immediately applying a git tag, which we will do later
after updating the changelog.

## Commit Version Bumps

Regardless of which arguments were passed to `lerna publish` above, at this point the packages will have been
published to npm, but you will have local changes to update the versions of each package that was published,
which need to be committed:

```
git commit -am "chore: Publish"
```

## Update Changelog and Create Git Tag

It's recommended to generate the changelog prior to running the post-release script so you can double-check the changes
before it creates a tag:

```
npm run changelog
git diff # Review the changelog and make sure it looks OK
```

In certain cases, there are some typical edits to make the changelog easier to read:

* **For a minor release or pre-release after an off-master patch release:**
  Remove any duplicated items in the new minor release that were already listed under patch releases.
* **For a minor release after any pre-releases:**
  Bring any changes from any prior pre-releases under their respective headings for the new final release, then
  remove the pre-release headings ([example](https://github.com/material-components/material-components-web/commit/13fd6784))

Once you're sure about the changes, run the `post-release` script to commit and create an annotated git tag:

```
./scripts/post-release.sh
```

## Push

### Common First Step for All Releases

You will need to temporarily alter Github's master branch protection in order to push after the release:

1. Go to the [Branches settings page](https://github.com/material-components/material-components-web/settings/branches)
1. Under Branch Protection Rules, click Edit next to `master`
1. Uncheck "Include administrators"
1. Click "Save changes"
1. Perform the process outlined in one of the sections below
1. Don't forget to re-enable "Include administrators" & click "Save changes" afterwards

### For Pre-releases and Minor Releases

```
git push origin master <tag>
```

This will ensure the new commits *and* tag are pushed to the remote git repository.
(e.g. `git push origin master v0.39.0`)

### For Patch Releases

```
git push origin <tag>
```

We don't need to push a branch for bugfix releases since we only cherry-pick commits for them at release time and they
are not tagged from master (which contains all commits, not just bugfixes).

However, we *do* need to sync the new release versions and changelog with master. Run `git log` and take note of the
publish and changelog commit hashes. Then switch to master and cherry-pick them:

```
git checkout master
git cherry-pick -x <publish-hash> <changelog-hash>
git push
```

## Update and Deploy Catalog Repository

### For Patch Releases

1. Update the `material-components-web` dependency in the catalog's `package.json` to the new patch version
1. Run `npm start` and glance through the catalog pages to make sure everything looks normal
1. Send a PR for the dependency update, then run `npm deploy` once it's merged to master

### For Minor Releases

We typically maintain a `next` branch on the MDC Web Catalog repository which follows MDC Web pre-releases, to keep
ahead of breaking changes in new releases.

In the event no pre-releases were tagged, the above process for patch releases would be followed, but would require
checking for necessary updates to accommodate breaking changes in MDC Web.

Below is the process when a `next` branch is used:

1. Ensure you have the latest `master` checked out: `git checkout master && git pull`
1. Create a new branch, e.g.: `git checkout -b chore/0.36.0`
1. Merge `next` into the branch: `git merge next`
1. Deal with any conflicts if necessary
1. Update `package.json` to reference the newly-released minor version of `material-components-web`
1. `rm -rf node_modules && npm i` to cause `package-lock.json` to update
1. `npm start` and test the catalog, in case any further breaking changes occurred since the last pre-release
1. `npm run build` to double-check that there are no unforeseen errors when building resources for deployment
1. If necessary, perform additional changes and commit them to the chore branch
1. Push the chore branch and send a pull request for one last review
1. Squash and merge the PR in GitHub
1. Update your local `master` branch and deploy:
   1. `git checkout master && git pull`
   1. `npm start` if you want to double-check one last time (`master` should contain the same changes you tested in your PR)
   1. `npm run deploy`
1. Reset the `next` branch against master to be reused for the next release (this will change the `next` branch's history):
   1. `git checkout next`
   1. `git fetch origin && git reset --hard origin/master`
   1. [Temporarily unprotect the next branch](https://github.com/material-components/material-components-web-catalog/settings/branches)
      by changing the `[mn][ae][sx]t*` rule match to just `master`
      (this looks weird, but GitHub chose to use limited fnmatch syntax rather than RegExp, for some reason)
   1. `git push -f origin next`
   1. Re-protect the `next` branch by changing the `master` rule match back to `[mn][ae][sx]t*`

## Log Issues in MDC React Repository

MDC React does not currently maintain a branch that gets updated ahead of release against pre-releases.
After release, ensure that any breaking changes likely to require MDC React changes have issues logged on the
MDC React repository, with the "required for sync" label.

## Notify material.io Team

Our markdown documentation is transformed and mirrored to the Develop section of material.io.

Currently, this requires some manual work by the Tools team, so we need to notify them to update the site content.

## (Deprecated) Deploy Catalog Server

> Note: We now promote the [MDC Web Catalog](https://github.com/material-components/material-components-web-catalog)
> instead. The old catalog server is no longer linked from our documentation.

`MDC_ENV=development npm run build:demos && gcloud app deploy`

[Double check it is live](https://material-components-web.appspot.com/)
