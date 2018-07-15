# Screenshot Tests

Prevent visual regressions by running screenshot tests on every PR.

## Quick start

### API credentials

Add the following to your `~/.bash_profile` or `~/.bashrc` file:

```bash
export MDC_CBT_USERNAME='you@example.com'
export MDC_CBT_AUTHKEY='example'
```

Credentials can be found here:

* [CrossBrowserTesting.com > Account](https://crossbrowsertesting.com/account) \
    `Authkey` is listed under the `User Profile` section
* [Google Cloud Console > IAM & admin > Service accounts](https://console.cloud.google.com/iam-admin/serviceaccounts?project=material-components-web) \
    Click the `︙` icon on the right side of the service account, then choose `Create key` 

### Test your changes

Modify a Sass file:

```bash
echo '.mdc-button:not(:disabled){color:red}' >> packages/mdc-button/mdc-button.scss
```
 
Run the tests:

```bash
npm run screenshot:test
```

You should see something like this in the terminal:

```
Changed 1 screenshot:
  - mdc-fab/classes/baseline.html > desktop_windows_edge@latest

https://storage.googleapis.com/mdc-web-screenshot-tests/advorak/2018/07/14/03_37_19_142/report/report.html
```

## Basic usage

### Updating "golden" screenshots

On the
[report page](https://storage.googleapis.com/mdc-web-screenshot-tests/advorak/2018/07/14/03_37_19_142/report/report.html),
select the checkboxes for all screenshots you want to approve, and click the "Approve" button at the bottom of the page.

This will display a modal dialog containing a CLI command to copy/paste:

```bash
npm run screenshot:approve -- \
  --all \
  --report=https://storage.googleapis.com/mdc-web-screenshot-tests/advorak/2018/07/14/03_37_19_142/report/report.json
```

**IMPORTANT:** Note the `--` between the script name and its arguments. This is required by `npm`.

This command will update your local `test/screenshot/golden.json` file with the newly captured screenshots.

### Rerunning a subset of tests

You can rerun a subset of the tests without running the entire suite, filtering by browser and/or URL.

On the
[report page](https://storage.googleapis.com/mdc-web-screenshot-tests/advorak/2018/07/14/03_37_19_142/report/report.html),
select the checkboxes for all screenshots you want to retry, and click the "Retry" button at the bottom of the page.

This will display a modal dialog containing a CLI command to copy/paste:

```bash
npm run screenshot:test -- \
  --url=mdc-button/classes/dense \
  --browser=ie@11
```

**IMPORTANT:** Note the `--` between the script name and its arguments. This is required by `npm`.

You can rerun multiple screenshots by passing an argument multiple times:

```bash
npm run screenshot:test -- \
  --url=mdc-button/classes/dense \
  --url=mdc-fab/classes/mini \
  --browser=ie@11 \
  --browser=chrome
```

These options are treated as regular expressions, so partial matches are possible. For example:

* `ie@11` matches `desktop_windows_ie@11`
* `chrome` matches `desktop_windows_chrome@latest` and `mobile_android_chrome@latest`

See `test/screenshot/browser.json` for the full list of supported browsers.

### Local dev server

The deprecated `npm run dev` command has been replaced by:

```bash
npm start
```

Open http://localhost:8080/ in your browser to view the test pages.

Source files are automatically recompiled when they change.

## Advanced usage

Use `--help` to see all available CLI options:

```bash
npm run screenshot:approve -- --help
npm run screenshot:build -- --help
npm run screenshot:demo -- --help
npm run screenshot:serve -- --help
npm run screenshot:test -- --help
```

**IMPORTANT:** Note the `--` between the script name and its arguments. This is required by `npm`.

### Public demos

```bash
npm run screenshot:demo
```

This will upload all test assets (HTML/CSS/JS files) to a public URL and print the URL to the terminal.

The URL can then be shared with designers or other developers.

### Excluding a subset of tests

You can exclude specific browsers and URLs by prefixing them with a `-`:

```bash
npm run screenshot:test -- \
  --url=-button \
  --browser=-edge
```

Positive and negative patterns can be mixed and matched:

```bash
npm run screenshot:test -- \
  --url=button,-mixins \
  --browser=desktop,-ie@11
```

**NOTE:** Negative patterns _always_ take precedence over positive patterns, regardless of the order they appear in the
command line.

### Diffing against other git branches and tags

By default, screenshots are diffed against your local `test/screenshot/golden.json` file.
This enables incremental diff reports, which are typically smaller and easier to review.

You can diff against a local/remote git branch, tag, or commit with the `--diff-base` flag:

```bash
npm run screenshot:test -- --diff-base=origin/master
npm run screenshot:test -- --diff-base=fix/fab/icon-alignment-ie11
npm run screenshot:test -- --diff-base=v0.37.0
npm run screenshot:test -- --diff-base=01abc11e0
```

URLs and file paths are also supported:

```bash
npm run screenshot:test -- --diff-base=/tmp/golden.json
npm run screenshot:test -- --diff-base=https://storage.googleapis.com/mdc-web-screenshot-tests/advorak/2018/07/12/05_07_59_278/golden.json
```

### Local Selenium browsers

By default, screenshot tests run remotely on CrossBrowserTesting.com's Selenium VMs.

However, it's also possible to run the tests on your own machine using the `--offline` CLI flag, which disables all
external network requests. Local tests typically take about 1/4 as long to run as remote tests, which makes them useful 
for rapid iterative development.

You should expect to see a large number of rendering differences between your machine and CBT's VMs. The idea is to run
the offline tests first with no local changes, approve the rendering diffs, and then begin making changes to the CSS.

When you're ready to create a PR, you would then run the tests remotely on CBT.

For example:

1. Create a new feature branch:

    ```bash
    $ git checkout -b feat/button/fancy
    ```

2. Capture baseline screenshots in all browsers installed on the user's machine:

    ```bash
    $ npm run screenshot:test -- --url=mdc-button --retries=0 --offline
    34 screenshots changed!
    ```

3. Approve rendering differences:

    ```bash
    $ npm run screenshot:approve -- --all --report=http://localhost:9000/advorak/2018/07/15/04_11_46_560/report/report.json
    ```

4. Rerun the tests locally - there should be zero diffs:

    ```bash
    $ npm run screenshot:test -- --url=mdc-button --retries=0 --offline
    0 screenshots changed!
    ```

5. Make changes to a component's CSS:

    ```bash
    $ echo '.mdc-button:not(:disabled){color:red}' >> packages/mdc-button/mdc-button.scss
    ```

6. Rerun the tests locally:

    ```bash
    $ npm run screenshot:test -- --url=mdc-button --retries=0 --offline
    30 screenshots changed!
    ```

7. Run the tests remotely and create a PR:

    ```bash
    $ npm run screenshot:test -- --url=mdc-button --retries=0
    $ npm run screenshot:approve -- --all --report=https://.../report.json
    $ git add test/screenshot/golden.json
    $ git commit -m 'feat(button): Fancy'
    $ git push -u origin
    ```

## Writing tests

**Goal**: Cover of every line of CSS generated by our Sass. This includes all CSS selectors.

### Guidelines

1.  Keep HTML files _small_ and _focused_. This makes it easier to review diffs.

2.  Each page should target a single logical "variant" of a component. For example:
    - One "block" CSS class (e.g., `mdc-button`)
    - One "modifier" CSS class (e.g., `mdc-button--dense`)
    - One Sass mixin (e.g., `mdc-button-ink-color`)

3.  File structure:

        /test/screenshot
            /mdc-foo
                /classes
                    - baseline.html
                    - dense.html
                    - ...
                /mixins
                    - custom.scss
                    - fill-color.html
                    - filled-accessible.html
                    - ink-color.html
                    - ...

4.  Do not test _combinations_ of mixins and modifier classes unless:
    1. It's necessary to prevent a regression; or
    2. We explicitly support the combination, and the implementation is likely to have bugs (e.g., `mdc-button--dense` and `mdc-button-outline-width` both set `line-height`)

### Example test page

![filled button screenshot](https://user-images.githubusercontent.com/409245/40395978-7f3e0476-5ddf-11e8-9262-eb0dfacb05e5.png)
