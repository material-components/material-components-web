/**
 * @license
 * Copyright 2017 Google Inc. All Rights Reserved.
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
 * @param {string} query
 * @param {!Document|!Element=} root
 * @return {!Array<!Element>}
 */
export function getAll(query, root = document) {
  return [].slice.call(root.querySelectorAll(query));
}

/**
 * @param {!Window|!Document|!Element} root
 * @return {!Document|undefined}
 */
export function getDocument(root) {
  return root.ownerDocument || root.document || (root.documentElement ? root : undefined);
}

/**
 * @param {!Window|!Document|!Element} root
 * @return {!Window|undefined}
 */
export function getWindow(root) {
  const doc = getDocument(root);
  return doc.defaultView || doc.parentWindow || (root.document ? root : undefined);
}
