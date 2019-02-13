process.env.NODE_ENV = process.env.NODE_ENV || 'production';

const path = require('path');
const {execSync} = require('child_process');

const root = path.resolve(__dirname, '../../');

execSync(
  `$(npm bin)/tsc --project ${root}/tsconfig.json --module esnext`,
  {stdio: [0, 1, 2]}
);

console.log('Completed converting all TS files to ES Modules.');
