const fs = require('fs');
const path = require('path');
const sass = require('dart-sass');

// NOTE: This assumes it is run from the top-level directory (which is always the case when using npm run)
const projectRoot = process.cwd();

function tryAccess(scssPath) {
  const fullPath = path.join(projectRoot, scssPath);
  try {
    fs.accessSync(fullPath);
    return fullPath;
  } catch (e) {
    return undefined;
  }
}

function materialImporter(url) {
  if (url.startsWith('@material')) {
    // Support omission of .scss extension
    const normalizedUrl = url.endsWith('.scss') ? url : `${url}.scss`;
    // Convert @material/foo to packages/mdc-foo to load directly from packages folder in repository
    const scssPath = normalizedUrl.replace('@material/', 'packages/mdc-');
    // Support omission of leading _ for partials
    const resolved = tryAccess(scssPath) ||
      tryAccess(path.join(path.dirname(scssPath), `_${path.basename(scssPath)}`));
    return {file: resolved || url};
  }
  return {file: url};
}

// Verify that the Sass compiles when we ask for all features.
sass.renderSync({
  file: path.join(__dirname, 'feature-targeting-select-all.scss'),
  importer: materialImporter,
});

// Verify that the Sass produces no CSS when we ask for no features.
const result = sass.renderSync({
  file: path.join(__dirname, 'feature-targeting-select-none.scss'),
  importer: materialImporter,
});
const css = result.css.toString('utf8').trim();

if (css.length > 0) {
  console.error('All rules within applicable packages must be feature-targeted, but the following were not:');
  console.error(css);
  process.exit(1);
}
