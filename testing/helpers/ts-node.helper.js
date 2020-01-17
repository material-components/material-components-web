const path = require('path');
const tsconfigPath = path.join(__dirname, '../../tsconfig-node.json');
require('ts-node').register({
  project: tsconfigPath,
});
