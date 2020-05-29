/**
 * Sass configuration file used by Parcel.js for running local demos.
 */
const path = require('path')
const glob = require('glob');

const CWD = process.cwd()
const includePaths = glob.sync(path.join(CWD, 'packages/mdc-*/node_modules'));

module.exports = {
  "includePaths": includePaths,
}
