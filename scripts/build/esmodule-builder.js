process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const path = require('path');
const fs = require('fs-extra');
const { exec, execSync } = require('child_process');
const glob = require('glob');

const root = path.resolve(__dirname, '../../');

execSync(
  `$(npm bin)/tsc --project ${root}/tsconfig.json --module esnext`,
  {stdio: [0, 1, 2]}
);

// const getTsPackageDirs = () => {
//   const packagesDir = path.resolve(__dirname, '../../packages');
//   const packages = fs.readdirSync(packagesDir);
//   const tsPackageDirs = [];
//   packages.forEach((package) => {
//     const packageDir = path.resolve(packagesDir, package);
//     const stat = fs.statSync(packageDir);
    
//     if (!stat.isDirectory()) return;
//     const files = fs.readdirSync(packageDir);

//     if (files.some((file) => path.extname(file) === '.ts')) {
//       tsPackageDirs.push(packageDir);
//     }
//   });

//   return tsPackageDirs;
// }

// const moveDTsFiles = (dir, outDir) => {
//   const files = fs.readdirSync(dir);
//   const isDTsFile = (file) => file.endsWith('.d.ts');
//   files.forEach((file) => {
//     if (isDTsFile(file)) {
//       console.log(file)
//     }
//   });

// }


// const main = () => {

  // const packageDirs = getTsPackageDirs();
  
  // console.log(packageDirs, distDir);
  
  // packageDirs.forEach((packageDir) => {
  //   const distDir = path.resolve(packageDir, 'dist');
  //   moveDTsFiles(packageDir, distDir);
  // });
// }

// main();