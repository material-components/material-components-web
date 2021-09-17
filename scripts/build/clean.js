/**
 * @fileoverview Cleans top-level build directories (for OSS and internal processes),
 * dist subfolders under packages, and .js[.map] files in package directories.
 */

const del = require('del');
const fs = require('fs');

const {sync: globSync} = require('glob');

function main() {
  removeDirectory('build');
  removeDirectory('.rewrite-tmp');
  removeFilesOfType('css');
  removeFilesOfType('js');
  removeFilesOfType('d.ts', [
    // This file is hand-written.
    'packages/mdc-base/externs.d.ts',
  ]);
  removeFilesOfType('map');
}

function removeDirectory(directory) {
  del.sync([directory]);
}

function removeFilesOfType(type, extraIgnore = []) {
  const fileGlob = `packages/**/*.${type}`;
  const filePaths = globSync(fileGlob, {
    ignore: ['**/node_modules/**', ...extraIgnore],
  });
  filePaths.forEach((filePath) => {
    fs.unlink(filePath, (err) => {
      if (err) throw err;
    });
  });
}

main();
