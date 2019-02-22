/**
 * Cleans top-level build directories (for OSS and internal processes),
 * dist subfolders under packages, and .js[.map] files in package directories.
 */

const {exec} = require('child_process');
const fs = require('fs');

const {sync: globSync} = require('glob');

function main() {
  removeDirectory('build');
  removeDirectory('.rewrite-tmp');
  removeFilesOfType('css');
  removeFilesOfType('js');
  removeFilesOfType('d.ts');
  removeFilesOfType('map');
}

function removeDirectory(directory) {
  exec(`rm -rf ${directory}`, (err) => {
    if (err) {
      throw err;
    }

    console.log(`deleted ${directory} directory`);
  });
}

function removeFilesOfType(type) {
  const fileGlob = `packages/*/*.${type}`;
  const nestedFileGlob = `packages/*/!(node_modules)/**/*.${type}`;
  const filePaths = globSync(fileGlob);
  const nestedFilePaths = globSync(nestedFileGlob);
  filePaths.forEach((filePath) => {
    fs.unlink(filePath, (err) => {
      if (err) throw err;
      console.log(`${filePath} was deleted`);
    });
  });

  nestedFilePaths.forEach((filePath) => {
    fs.unlink(filePath, (err) => {
      if (err) throw err;
      console.log(`${filePath} was deleted`);
    });
  });
}

module.exports = {main, removeDirectory};
