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
git checkout master && git pull
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
$(npm bin)/lerna publish --skip-git --npm-tag=next
```

When lerna prompts for version, choose Prerelease.

Be sure to include the command-line flags:

* `--skip-git` avoids immediately applying a git tag, which we will do later after updating the changelog
* `--npm-tag=next` avoids updating the `latest` tag on npm, since pre-releases should not be installed by default

### For Minor Releases

```
$(npm bin)/lerna publish --skip-git --since=<previous-patch-tag>
```

When lerna prompts for version, choose Minor.

Be sure to include the command-line flags:

* `--skip-git` avoids immediately applying a git tag, which we will do later after updating the changelog
* `--since=<previous-patch-tag>` (e.g. `--since=v0.36.1`) forces lerna to diff against the latest patch; otherwise,
  it diffs against the previous minor release which may cause some packages without changes to be published (this
  happens because bugfix releases aren't tagged from the master branch)

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

### For Pre-Releases and Patch Releases

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

### For Minor Releases

First, update the changelog without committing it:

```
npm run changelog
```

Next, edit the changelog:

* Bring any changes from any prior pre-releases under their respective headings for the new final release
* Remove headings for the pre-releases
* Remove any duplicated items in the new minor release that were already listed under patch releases

See [this v0.36.0 commit](https://github.com/material-components/material-components-web/commit/13fd6784866864839d0d287b3703b3beb0888d9c)
for an example of the resulting changes after moving the pre-release notes.

This will make the changelog easier to read, since users won't be interested in the pre-releases once the final is
tagged, and shouldn't need to read the new release's changes across multiple headings.

Finally, run the post-release script to commit the updated changelog and apply a git tag:

```
./scripts/post-release.sh
```

## Push

### Common First Step for All Releases

You will need to temporarily alter Github's master branch protection in order to push after the release:

1. Go to the [settings page](https://github.com/material-components/material-components-web/settings/branches/master)
1. Uncheck "Include administrators"
1. Click "Save changes"
1. Perform the process outlined in one of the sections below
1. Don't forget to re-enable "Include administrators" & click "Save changes" afterwards

### For Pre-releases and Feature/Breaking-Change Releases

`git push origin master && git push origin <tag>`

This will ensure the new commits *and* tag are pushed to the remote git repository.

### For Bugfix Releases

`git push origin <tag>`

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

We maintain a `next` branch on the MDC Web Catalog repository to keep ahead of breaking changes in new releases.

1. Ensure you have the latest `master` checked out: `git checkout master && git pull`
1. Create a new branch, e.g.: `git checkout -b chore/0.36.0`
1. Merge `next` into the branch: `git merge next`
1. Deal with any conflicts if necessary
1. Update `package.json` to reference the newly-released final versions of MDC Web packages
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
   1. Temporarily turn off branch protection *completely* for the `next` branch (to enable force-push)
   1. `git push -f origin next`
   1. Re-protect the `next` branch - check the following, then click Save changes:
      * Protect this branch
      * Require pull request reviews before merging
      * Require status checks to pass before merging
      * Require branches to be up to date before merging
      * cla/google status check
      * Include administrators
      * Restrict who can push to this branch

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
