/**
 * @fileoverview Cleans top-level build directories (for OSS and internal processes),
 * dist subfolders under packages, and .js[.map] files in package directories.
 */

const {exec} = require('child_process');
const fs = require('fs');

const {sync: globSync} = require('glob');

if (require.main === module) {
  main();
}

function main() {
  removeDirectory('build');
  removeDirectory('.rewrite-tmp');
  removeFilesOfType('css');
  removeFilesOfType('js');
  removeFilesOfType('d.ts');
  removeFilesOfType('map');
}

function removeDirectory(directory) {
  exec(`del-cli ${directory}/ ${directory}`, (err) => {
    if (err) {
      throw err;
    }
  });
}

function removeFilesOfType(type) {
  const fileGlob = `packages/*/*.${type}`;
  const filePaths = globSync(fileGlob, {
    ignore: ['**/node_modules/**'],
  });
  filePaths.forEach((filePath) => {
    fs.unlink(filePath, (err) => {
      if (err) throw err;
    });
  });
}

module.exports = {main, removeDirectory};
