const fs = require('fs');
const path = require('path');
const {sync: globSync} = require('glob');

const isValidCwd = fs.existsSync('packages') && fs.existsSync(path.join('packages', 'material-components-web', 'dist'));

if (!isValidCwd) {
  console.error(
    'Invalid CWD. Please ensure you are running this from the root of the repo, and that you have run ' +
    '`npm run dist` and `node scripts/cp-pkgs.js`'
  );
  process.exit(1);
}

let invalidMains = 0;
globSync('packages/*/package.json').forEach((jsonPath) => {
  const packageInfo = JSON.parse(fs.readFileSync(jsonPath));
  if (!packageInfo.main) {
    return;
  }

  const mainPath = path.join(path.dirname(jsonPath), packageInfo.main);
  let isInvalid = false;
  if (mainPath.indexOf('dist') < 0) {
    isInvalid = true;
    console.error(`${jsonPath} main property does not reference a file under dist`);
  }
  if (!fs.existsSync(mainPath)) {
    isInvalid = true;
    console.error(`${jsonPath} main property points to nonexistent ${mainPath}`);
  }

  if (isInvalid) {
    // Multiple checks could have failed, but only increment the counter once for one package.
    invalidMains++;
  }
});

if (invalidMains > 0) {
  console.error(`${invalidMains} incorrect main property values found; please fix.`);
} else {
  console.log('Success: All packages with main properties reference valid files under dist!');
}
