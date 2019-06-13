import typescript from 'rollup-plugin-typescript';
import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import {terser} from "rollup-plugin-terser";

const {lstatSync, readdirSync} = require('fs');
const {join} = require('path');

const isDirectory = source => lstatSync(source).isDirectory();
const getDirectories = source =>
	readdirSync(source).map(name => join(source, name)).filter(isDirectory);
const getPackages = directories =>
	directories.map(directory => directory.split('packages/')[1]);
const getFormattedRollupInput = packages => {
	const input = {};
	packages.forEach(pkg => {
		input[pkg] = `packages/${pkg}/index.ts`;
	});
	return input;
}

const noJsPackages = [
  'mdc-button',
  'mdc-card',
  'mdc-data-table',
  'mdc-elevation',
  'mdc-fab',
  'mdc-feature-targeting',
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
  'mdc-divider',
  'mdc-side-sheet',
];

const packages = getPackages(getDirectories('./packages')).filter(pkg =>
  !denyList.includes(pkg) && !noJsPackages.includes(pkg));

export default packages.filter(pkg => pkg === 'mdc-textfield').map(pkg => {
  const pkgJson = require(`./packages/${pkg}/package.json`);
  const deps = Object.keys(pkgJson.dependencies);
  const outputPath = `./packages/${pkg}/dist`;
  const banner = `/**
  * @preserve
  * @license
  * Copyright Google LLC All Rights Reserved.
  *
  * Use of this source code is governed by an MIT-style license that can be
  * found in the LICENSE file at https://github.com/material-components/material-components-web/blob/master/LICENSE
  */`;

  return {
    input: `packages/${pkg}/index.ts`,
    external: (id) => deps.some(dep => id.includes(dep)),
    output: [{
      entryFileNames: `${pkg}.esm.js`,
      dir: outputPath,
      format: 'esm',
      banner,
    }, {
      entryFileNames: `${pkg}.umd.js`,
      dir: outputPath,
      name: `${pkg}.umd.js`,
      format: 'umd',
      banner,
    }, {
      entryFileNames: `${pkg}.cjs.js`,
      dir: outputPath,
      format: 'cjs',
      banner,
    }, {
      entryFileNames: `${pkg}.amd.js`,
      dir: outputPath,
      format: 'amd',
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
    ],
  }
});