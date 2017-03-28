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

import {assert} from 'chai';
import td from 'testdouble';
import * as util from '../../../packages/mdc-ripple/util';

suite('MDCRipple - util');

test('#supportsCssVariables returns true when CSS.supports() returns true for css vars', () => {
  const windowObj = {
    CSS: {
      supports: td.func('.supports'),
    },
  };
  td.when(windowObj.CSS.supports('--css-vars', td.matchers.anything())).thenReturn(true);
  assert.isOk(util.supportsCssVariables(windowObj));
});

test('#supportsCssVariables returns true when feature-detecting its way around Safari < 10', () => {
  const windowObj = {
    CSS: {
      supports: td.func('.supports'),
    },
  };
  td.when(windowObj.CSS.supports('--css-vars', td.matchers.anything())).thenReturn(false);
  td.when(windowObj.CSS.supports(td.matchers.contains('(--css-vars:'))).thenReturn(true);
  td.when(windowObj.CSS.supports('color', '#00000000')).thenReturn(true);
  assert.isOk(util.supportsCssVariables(windowObj), 'true iff both CSS Vars and #rgba are supported');

  td.when(windowObj.CSS.supports(td.matchers.contains('(--css-vars:'))).thenReturn(false);
  assert.isNotOk(util.supportsCssVariables(windowObj), 'false if CSS Vars are supported but not #rgba');
  td.when(windowObj.CSS.supports(td.matchers.contains('(--css-vars:'))).thenReturn(true);

  td.when(windowObj.CSS.supports('color', '#00000000')).thenReturn(false);
  assert.isNotOk(util.supportsCssVariables(windowObj), 'false if #rgba is supported but not CSS Vars');
});

test('#supportsCssVariables returns false when CSS.supports() returns false for css vars', () => {
  const windowObj = {
    CSS: {
      supports: td.function('.supports'),
    },
  };
  td.when(windowObj.CSS.supports('--css-vars', td.matchers.anything())).thenReturn(false);
  assert.isNotOk(util.supportsCssVariables(windowObj));
});

test('#supportsCssVariables returns false when CSS.supports is not a function', () => {
  const windowObj = {
    CSS: {
      supports: 'nope',
    },
  };
  assert.isNotOk(util.supportsCssVariables(windowObj));
});

test('#supportsCssVariables returns false when CSS is not an object', () => {
  const windowObj = {
    CSS: null,
  };
  assert.isNotOk(util.supportsCssVariables(windowObj));
});

test('#getMatchesProperty returns the correct property for selector matching', () => {
  assert.equal(util.getMatchesProperty({matches: () => {}}), 'matches');
  assert.equal(util.getMatchesProperty({webkitMatchesSelector: () => {}}), 'webkitMatchesSelector');
  assert.equal(util.getMatchesProperty({msMatchesSelector: () => {}}), 'msMatchesSelector');
});

test('#getMatchesProperty returns the standard function if more than one method is present', () => {
  assert.equal(util.getMatchesProperty({matches: () => {}, webkitMatchesSelector: () => {}}), 'matches');
});

test('#getNormalizedEventCoords maps event coords into the relative coordinates of the given rect', () => {
  const ev = {type: 'mousedown', pageX: 70, pageY: 70};
  const pageOffset = {x: 10, y: 10};
  const clientRect = {left: 50, top: 50};

  assert.deepEqual(util.getNormalizedEventCoords(ev, pageOffset, clientRect), {
    x: 10,
    y: 10,
  });
});

test('#getNormalizedEventCoords works with touchstart events', () => {
  const ev = {type: 'touchstart', changedTouches: [{pageX: 70, pageY: 70}]};
  const pageOffset = {x: 10, y: 10};
  const clientRect = {left: 50, top: 50};

  assert.deepEqual(util.getNormalizedEventCoords(ev, pageOffset, clientRect), {
    x: 10,
    y: 10,
  });
});
