const dts = require('dts-bundle');
const fs = require('fs');
const path = require('path');

const dTsDirectory = path.resolve(__dirname, '../../build/packages');

function dtsBundler() {
  const packageDirectories = fs.readdirSync(dTsDirectory)
  packageDirectories.forEach((packageDirectory) => {
    const main = path.resolve(dTsDirectory, packageDirectory, './index.d.ts');
    dts.bundle({
      name: packageDirectory,
      main,
    });
  });
}

module.exports = {
  dtsBundler,
};
