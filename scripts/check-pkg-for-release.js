/**
 * Copyright 2016 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Used within pre-release.sh, this checks a component's package.json
 * to ensure that if it's a new component (version = "0.0.0"), it will have a proper
 * "publishConfig.access" property set to "public".
 * The argument should be the package.json file to check.
 */

const path = require('path');
const pkg = require(path.join(process.env.PWD, process.argv[process.argv.length - 1]));
if (pkg.version !== '0.0.0') {
  process.exit(0);
}

const missingPublishConfig = !pkg.publishConfig;
if (missingPublishConfig || pkg.publishConfig.access !== 'public') {
  process.exit(1);
}
