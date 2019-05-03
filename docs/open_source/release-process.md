# Release Process

**TIP:** Run the following script in the dev console to automatically expand the appropriate sections in this page for
the type of release you're interested in performing.
(You can replace `'minor'` on the last line with `'major'` or `'patch'`.)

```js
(function(type) {
  document.querySelectorAll('details').forEach((el) => {
    const summary = el.querySelector('summary');
    el.open = summary && summary.textContent.toLowerCase().includes(`${type} release`);
  })
})('minor');
```

### Vocabulary

This document reuses the [terminology for release types](./releases-and-branches.md#release-types) summarized in the
Releases and Branches documentation.

## 0. First-time Setup

> Employees are supposed to do this as part of onboarding, but we've put it here
> as a reminder.

`npm login`

This will log you into NPM.

## 1. Announce

Ping the announcements channel first! This will let other members of the
team know NOT to merge PRs during this release process.

## 2. Check Out Code

Check out the master branch and update:

```
git checkout master && git pull && git fetch --tags
```

This will pull the latest tags and `master` commits into your local repository.

<details open>
  <summary><strong>Additional Step for Minor Releases and Patch Releases</strong></summary>

<details open>
  <summary>For Minor Releases</summary>

First, checkout the latest previous patch version (e.g. `vX.0.1`).

Then run the following script to automatically cherry-pick only the appropriate commits on top of the last release.

```
node scripts/cherry-pick-commits --minor
```

</details>

<details open>
  <summary>For Patch Releases</summary>

First, make sure you checkout the correct branch or tag based on what you're releasing:

* If you're releasing the first non-major version ever after a major version (typically X.0.1), checkout `master`.
* If you're releasing the first patch after a minor version (e.g. X.1.1), checkout the minor version (e.g. `vX.1.0`).
* If you're releasing a subsequent patch (e.g. X.Y.2), checkout `vX.Y.1`.

Once you're on the correct base, run the following script to automatically cherry-pick only the appropriate commits on
top of the last release.

```
node scripts/cherry-pick-commits --patch
```

</details>

Read the output of the cherry-pick script carefully:

* You may need to cherry-pick commits that the script could not cherry-pick cleanly without conflict
* The script may have cherry-picked commits that rely on skipped commits; these need to be removed.
  This is especially likely if the script reports that either the build or the unit tests failed.
* Examine `git log` to ensure there are no unexpected commits beyond the previous tag (in case any breaking changes
  weren't flagged properly, or features were mislabeled as fixes, etc.)

> NOTE: After running the script, you are in a detached HEAD state. You can create a temporary local branch if desired,
> but all that needs to be pushed is the tag produced at the end of the release process.

If you find you need to remove commits that should not have been cherry-picked, perform the following steps:

1. Find the base tag that the cherry-pick script identified and used (find the "Checking out vX.Y.Z" line in the output)
1. Run `git rebase -i <base tag>` - this will open the sequence of cherry-picked commits in an editor (probably vim)
1. Find and delete lines for commits that should not have been included (in vim, type `dd` on the line in question)
1. Save and exit (`:x` in vim)
1. Re-check `git log` to confirm that the commits are no longer present

</details>

## 3. Preparation

Run the pre-release script:

`./scripts/pre-release.sh`

This will ensure you can publish/tag, build all release files, and ensure all tests
pass prior to releasing (lerna will update versions for us in the next step).

### Disable 2FA

If you have two-factor authentication enabled on your NPM account (you should), you'll need to temporarily disable it:

```bash
npm profile disable-2fa
```

See Lerna issues [#1137](https://github.com/lerna/lerna/issues/1137) and [#1091](https://github.com/lerna/lerna/issues/1091) for more information.

## 4. Publish to npm

> TIP: You can use `npx lerna updated [--since=...]` to preview which packages it would publish before running the
> commands in this section.

```
npx lerna publish --skip-git --since=<previous-tag>
```

When lerna prompts for version, choose Major, Minor, or Patch as appropriate.

Be sure to include the command-line flags:

* `--skip-git` avoids immediately applying a git tag, which we will do later after updating the changelog
* `--since=<previous-tag>` (e.g. `--since=v1.0.1`) forces lerna to diff against the latest tag; otherwise,
  it may cause some packages without changes to be published if it diffs against the wrong release based on git history

### Enable 2FA

If you temporarily disabled two-factor authentication on your NPM account, you'll need to re-enable it:

```bash
npm profile enable-2fa auth-and-writes
```

See Lerna issues [#1137](https://github.com/lerna/lerna/issues/1137) and [#1091](https://github.com/lerna/lerna/issues/1091) for more information.

## 5. Commit Version Bumps

At this point the packages will have been published to npm, but you will have local changes to update the versions of
each package that was published, which need to be committed:

```
git commit -am "chore: Publish"
```

## 6. Update Changelog and Create Git Tag

It's recommended to generate the changelog prior to running the post-release script so you can double-check the changes
before it creates a tag:

```
npm run changelog
git diff # Review the changelog and make sure it looks OK
```

In certain cases, there are some typical edits to make the changelog easier to read:

<details open>
  <summary><strong>For a major release after a minor/patch, or a minor release after a patch</strong></summary>

* Remove any duplicated items in the new release that were already listed under previous releases

</details>

Once you're sure about the changes, run the `post-release` script to commit and create an annotated git tag:

```
./scripts/post-release.sh
```

## 7. Push

You will need to temporarily alter Github's master branch protection in order to push after the release:

1. Go to the [Branches settings page](https://github.com/material-components/material-components-web/settings/branches)
1. Under Branch Protection Rules, click Edit next to `master`
1. Uncheck "Include administrators"
1. Click "Save changes"
1. Perform the process outlined in one of the sections below
1. Don't forget to re-enable "Include administrators" & click "Save changes" afterwards

<details open>
  <summary><strong>For Major Releases</strong></summary>

```
git push origin master <tag>
```

This will ensure the new commits *and* tag are pushed to the remote git repository.
(e.g. `git push origin master v0.39.0`)

</details>

<details open>
  <summary><strong>For Minor Releases or Patch Releases</strong></summary>

```
git push origin <tag>
```

We don't need to push a branch for these releases since we only cherry-pick commits for them at release time and they
are not tagged from master (which contains all commits, including breaking changes).

However, we *do* need to sync the new release versions and changelog with master. Run `git log` and take note of the
publish and changelog commit hashes. Then switch to master and cherry-pick them:

```
git checkout master
git cherry-pick -x <publish-hash> <changelog-hash>
git push
```

> NOTE: The `-x` argument above adds the original cherry-picked commit's hash in the commit description.
> This is referenced by the cherry-pick script to tie minor/patch releases to their cherry-picked commits on master.

  <details open>
    <summary><strong>Additional Note for Minor Releases</strong></summary>

Minor releases are likely to experience conflicts when cherry-picking the `chore: Publish` commit back into master.
This is because master already had the patch version bumps cherry-picked in, and then can't resolve the diffs generated
by the minor branch which go directly from the previous minor version to the new one.

You may wish to abort the cherry-pick and then retry with the recursive/theirs strategy:

```
git cherry-pick --abort
git cherry-pick -x --strategy=recursive -X theirs <publish-hash>
```

You should examine the generated changeset (with `git show`) to ensure that it didn't unintentionally steamroll any
newer version numbers (which could happen if a package previously had a patch release but did not receive a minor bump).

Once you're sure it's OK, continue with the changelog commit and push:

```
git cherry-pick -x <changelog-hash>
git push
```

  </details>

</details>

## 8. Update and Deploy Catalog Repository

<details open>
  <summary><strong>For Major Releases or Minor Releases</strong></summary>

We typically maintain a `next` branch on the MDC Web Catalog repository which works ahead of MDC Web releases
(using [this script](https://gist.github.com/kfranqueiro/d06c7073c5012de3edb6c5875d6a4a50)), to keep ahead of breaking changes.

In the event no work was done on the `next` branch, the process below for patch releases would be followed, but would require
checking for necessary updates to accommodate new features or breaking changes in MDC Web.

  <details>
    <summary>Process for when a <code>next</code> branch is used</summary>

1. Ensure you have the latest `master` checked out: `git checkout master && git pull`
1. Create a new branch, e.g.: `git checkout -b chore/1.0.0`
1. Merge `next` into the branch: `git merge next`
1. Deal with any conflicts if necessary
1. Update `package.json` to reference the newly-released minor version of `material-components-web`
1. `rm -rf node_modules && npm i` to cause `package-lock.json` to update
1. `npm start` and test the catalog, in case any further breaking changes occurred since the updates on `next`
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

  </details>

</details>

<details open>
  <summary><strong>For Patch Releases</strong></summary>

1. Update the `material-components-web` dependency in the catalog's `package.json` to the new patch version
1. Run `npm start` and glance through the catalog pages to make sure everything looks normal
1. Send a PR for the dependency update, then run `npm run deploy` once it's merged to master

</details>

## 9. Log Issues in MDC React Repository

MDC React does not currently maintain a branch that gets updated ahead of release.
After release, ensure that any breaking changes likely to require MDC React changes have issues logged on the
MDC React repository, with the "required for sync" label.

## 10. Notify material.io Team

Our markdown documentation is transformed and mirrored to the Develop section of material.io.

Currently, this requires some manual work by the Tools team, so we need to notify them to update the site content.
