/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

function print(key, varName) {
  console.log('varName:', varName);
  const value = process.env[varName];
  if (!value) {
    console.error(`WARNING: Env var ${varName} not found!`);
    return;
  }
  const middle = Math.floor(value.length / 2);
  console.log(`${key}=${value.substr(0, middle)} + ${value.substr(middle)}`);
}

foldStart('screenshot.env', 'env');
console.log(process.env);
print('x1', 'encrypted_eead2343bb2344_iv');
print('x2', 'encrypted_eead2345bb2346_key');
print('x3', 'SAUCE_ACCESS_KEY');
print('x4', 'SAUCE_USERNAME');
foldEnd('screenshot.env');

/**
 * @param {string} foldId
 * @param {string} shortMessage
 */
function foldStart(foldId, shortMessage) {
  console.log(`travis_fold:start:${foldId}`);
  console.log(shortMessage);
}

/**
 * @param {string} foldId
 */
function foldEnd(foldId) {
  console.log(`travis_fold:end:${foldId}`);
}
