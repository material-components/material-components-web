import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import {terser} from "rollup-plugin-terser";
import sass from 'rollup-plugin-sass';

const {lstatSync, readdirSync} = require('fs');
const {join} = require('path');

const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source =>
	readdirSync(source).map(name => join(source, name)).filter(isDirectory);
const getPackages = directories =>
	directories.map(directory => directory.split('packages/')[1]);

const noJsPackages = [
  'mdc-button',
  'mdc-card',
  'mdc-data-table',
  'mdc-elevation',
  'mdc-fab',
  'mdc-image-list',
  'mdc-layout-grid',
  'mdc-rtl',
  'mdc-selection-control',
  'mdc-shape',
  'mdc-theme',
  'mdc-tooltip',
  'mdc-typography',
];

const denyList = [
  'mdc-backdrop',
  'mdc-banner',
  'mdc-bottom-app-bar',
  'mdc-bottom-navigation',
  'mdc-bottom-sheet',
  'mdc-data-table',
  'mdc-divider',
  'mdc-feature-targeting',
  'mdc-side-sheet',
  'mdc-tooltip',
];

const noStylePackages = [
  'mdc-animation',
  'mdc-auto-init',
  'mdc-base',
  'mdc-dom',
  'mdc-rtl',
  'mdc-shape',
];

const banner = `/**
* @preserve
* @license
* Copyright Google LLC All Rights Reserved.
*
* Use of this source code is governed by an MIT-style license that can be
* found in the LICENSE file at https://github.com/material-components/material-components-web/blob/master/LICENSE
*/`;

const allPackages = getPackages(getDirectories('./packages')).filter(pkg =>
  !denyList.includes(pkg));
const jsPackagesOnly = allPackages.filter(pkg =>
  !noJsPackages.includes(pkg));
const stylePackagesOnly = allPackages.filter((pkg) => !noStylePackages.includes(pkg));

const inputFileName = (pkg, isSass) => {
  let fileName = 'index.ts';
  if (isSass) {
    fileName = pkg === 'mdc-textfield' ? 'mdc-text-field.scss' : `${pkg}.scss`;
  }
  return `packages/${pkg}/${fileName}`;
}

const buildConfigurations = ({pkg, isSass = false, shouldBuildUMD = false}) => {
  const pkgJson = require(`./packages/${pkg}/package.json`);
  const deps = pkgJson.dependencies ? Object.keys(pkgJson.dependencies) : null;
  const outputPath = `./packages/${pkg}/dist`;

  const configuration = {
    input: inputFileName(pkg, isSass),
    external: (id) =>  deps && deps.some(dep => id.includes(dep)),
    output: [{
      // TODO - format to current filename style, so to not introduce a breaking change
      entryFileNames: `${pkg}.esm.js`,
      dir: outputPath,
      format: 'esm',
      banner,
    }],
    plugins: [
      typescript(),
			resolve(),
      commonjs(), // so Rollup can convert externals to an ES module
      terser({
        output: {
          comments: function(node, comment) {
            var text = comment.value;
            var type = comment.type;
            if (type == "comment2") {
              // multiline comment
              return /@preserve/i.test(text);
            }
          }
        }
      }),
      sass({
        output: `${outputPath}/${pkg}.css`,
        options: {
          includePaths: [`./packages/material-components-web/node_modules`]
        }
      }),
    ],
  }

  if (shouldBuildUMD) {
    configuration.output.push({
      entryFileNames: `${pkg}.umd.js`,
      dir: outputPath,
      name: `${pkg}.umd.js`,
      format: 'umd',
      banner,
    });
  }
  return configuration;
}

const jsConfigurations = jsPackagesOnly.map(pkg => buildConfigurations({
  pkg,
  shouldBuildUMD: true,
}));

const sassConfigurations = stylePackagesOnly.map(pkg => buildConfigurations({
  pkg,
  isSass: true,
}));

export default [].concat(sassConfigurations, jsConfigurations);
