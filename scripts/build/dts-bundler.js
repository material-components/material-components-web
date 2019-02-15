const dts = require('dts-bundle');
const fs = require('fs');
const path = require('path');

const dTsDirectory = path.resolve(__dirname, '../../build/packages');

function dtsBundler() {
  fs.readdir(dTsDirectory, (err, packageDirectories) => {
    packageDirectories.forEach((packageDirectory) => {
      const main = path.resolve(dTsDirectory, packageDirectory, './index.d.ts');
      dts.bundle({
        name: packageDirectory,
        main,
      });
    });
  });
}

module.exports = {
  dtsBundler,
};
