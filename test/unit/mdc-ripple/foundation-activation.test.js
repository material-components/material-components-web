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

import td from 'testdouble';

import {testFoundation, captureHandlers} from './helpers';
import {cssClasses, strings, numbers} from '../../../packages/mdc-ripple/constants';

suite('MDCRippleFoundation - Activation Logic');

testFoundation('does nothing if component if isSurfaceDisabled is true',
  ({foundation, adapter, mockRaf}) => {
    const handlers = captureHandlers(adapter);
    foundation.init();
    mockRaf.flush();

    td.when(adapter.isSurfaceDisabled()).thenReturn(true);

    handlers.mousedown();

    td.verify(adapter.addClass(cssClasses.BG_ACTIVE_FILL), {times: 0});
    td.verify(adapter.addClass(cssClasses.FG_ACTIVATION), {times: 0});
  });

testFoundation('adds activation classes on mousedown', ({foundation, adapter, mockRaf}) => {
  const handlers = captureHandlers(adapter);
  foundation.init();
  mockRaf.flush();

  handlers.mousedown();
  mockRaf.flush();
  td.verify(adapter.addClass(cssClasses.BG_ACTIVE_FILL));
  td.verify(adapter.addClass(cssClasses.FG_ACTIVATION));
});

testFoundation('sets FG position from the coords to the center within surface on mousedown',
  ({foundation, adapter, mockRaf}) => {
    const handlers = captureHandlers(adapter);
    const left = 50;
    const top = 50;
    const width = 200;
    const height = 100;
    const maxSize = Math.max(width, height);
    const initialSize = maxSize * numbers.INITIAL_ORIGIN_SCALE;
    const pageX = 100;
    const pageY = 75;

    td.when(adapter.computeBoundingRect()).thenReturn({width, height, left, top});
    foundation.init();
    mockRaf.flush();

    handlers.mousedown({pageX, pageY});
    mockRaf.flush();

    const startPosition = {
      x: pageX - left - (initialSize / 2),
      y: pageY - top - (initialSize / 2),
    };

    const endPosition = {
      x: (width / 2) - (initialSize / 2),
      y: (height / 2) - (initialSize / 2),
    };

    td.verify(adapter.updateCssVariable(
      strings.VAR_FG_TRANSLATE_START, `${startPosition.x}px, ${startPosition.y}px`
    ));
    td.verify(adapter.updateCssVariable(
      strings.VAR_FG_TRANSLATE_END, `${endPosition.x}px, ${endPosition.y}px`
    ));
  });

testFoundation('adds activation classes on touchstart', ({foundation, adapter, mockRaf}) => {
  const handlers = captureHandlers(adapter);
  foundation.init();
  mockRaf.flush();

  handlers.touchstart({changedTouches: [{pageX: 0, pageY: 0}]});
  mockRaf.flush();
  td.verify(adapter.addClass(cssClasses.BG_ACTIVE_FILL));
  td.verify(adapter.addClass(cssClasses.FG_ACTIVATION));
});

testFoundation('sets FG position from the coords to the center within surface on touchstart',
  ({foundation, adapter, mockRaf}) => {
    const handlers = captureHandlers(adapter);
    const left = 50;
    const top = 50;
    const width = 200;
    const height = 100;
    const maxSize = Math.max(width, height);
    const initialSize = maxSize * numbers.INITIAL_ORIGIN_SCALE;
    const pageX = 100;
    const pageY = 75;

    td.when(adapter.computeBoundingRect()).thenReturn({width, height, left, top});
    foundation.init();
    mockRaf.flush();

    handlers.touchstart({changedTouches: [{pageX, pageY}]});
    mockRaf.flush();

    const startPosition = {
      x: pageX - left - (initialSize / 2),
      y: pageY - top - (initialSize / 2),
    };

    const endPosition = {
      x: (width / 2) - (initialSize / 2),
      y: (height / 2) - (initialSize / 2),
    };

    td.verify(
      adapter.updateCssVariable(strings.VAR_FG_TRANSLATE_START, `${startPosition.x}px, ${startPosition.y}px`)
    );
    td.verify(
      adapter.updateCssVariable(strings.VAR_FG_TRANSLATE_END, `${endPosition.x}px, ${endPosition.y}px`)
    );
  });

testFoundation('adds activation classes on pointerdown', ({foundation, adapter, mockRaf}) => {
  const handlers = captureHandlers(adapter);
  foundation.init();
  mockRaf.flush();

  handlers.pointerdown();
  mockRaf.flush();
  td.verify(adapter.addClass(cssClasses.BG_ACTIVE_FILL));
  td.verify(adapter.addClass(cssClasses.FG_ACTIVATION));
});

testFoundation('sets FG position from the coords to the center within surface on pointerdown',
  ({foundation, adapter, mockRaf}) => {
    const handlers = captureHandlers(adapter);
    const left = 50;
    const top = 50;
    const width = 200;
    const height = 100;
    const maxSize = Math.max(width, height);
    const initialSize = maxSize * numbers.INITIAL_ORIGIN_SCALE;
    const pageX = 100;
    const pageY = 75;

    td.when(adapter.computeBoundingRect()).thenReturn({width, height, left, top});
    foundation.init();
    mockRaf.flush();

    handlers.pointerdown({pageX, pageY});
    mockRaf.flush();

    const startPosition = {
      x: pageX - left - (initialSize / 2),
      y: pageY - top - (initialSize / 2),
    };

    const endPosition = {
      x: (width / 2) - (initialSize / 2),
      y: (height / 2) - (initialSize / 2),
    };

    td.verify(adapter.updateCssVariable(
      strings.VAR_FG_TRANSLATE_START, `${startPosition.x}px, ${startPosition.y}px`
    ));
    td.verify(adapter.updateCssVariable(
      strings.VAR_FG_TRANSLATE_END, `${endPosition.x}px, ${endPosition.y}px`
    ));
  });

testFoundation('adds activation classes on keydown when surface is made active',
  ({foundation, adapter, mockRaf}) => {
    const handlers = captureHandlers(adapter);
    td.when(adapter.isSurfaceActive()).thenReturn(true);
    foundation.init();
    mockRaf.flush();

    handlers.keydown();
    mockRaf.flush();

    td.verify(adapter.addClass(cssClasses.BG_ACTIVE_FILL));
    td.verify(adapter.addClass(cssClasses.FG_ACTIVATION));
  });

testFoundation('sets FG position to center on non-pointer activation', ({foundation, adapter, mockRaf}) => {
  const handlers = captureHandlers(adapter);
  const left = 50;
  const top = 50;
  const width = 200;
  const height = 100;
  const maxSize = Math.max(width, height);
  const initialSize = maxSize * numbers.INITIAL_ORIGIN_SCALE;

  td.when(adapter.computeBoundingRect()).thenReturn({width, height, left, top});
  td.when(adapter.isSurfaceActive()).thenReturn(true);
  foundation.init();
  mockRaf.flush();

  handlers.keydown();
  mockRaf.flush();

  const position = {
    x: (width / 2) - (initialSize / 2),
    y: (height / 2) - (initialSize / 2),
  };

  td.verify(adapter.updateCssVariable(strings.VAR_FG_TRANSLATE_START,
    `${position.x}px, ${position.y}px`));
  td.verify(adapter.updateCssVariable(strings.VAR_FG_TRANSLATE_END,
    `${position.x}px, ${position.y}px`));
});

testFoundation('adds activation classes on programmatic activation', ({foundation, adapter, mockRaf}) => {
  td.when(adapter.isSurfaceActive()).thenReturn(true);
  foundation.init();
  mockRaf.flush();

  foundation.activate();
  mockRaf.flush();

  td.verify(adapter.addClass(cssClasses.BG_ACTIVE_FILL));
  td.verify(adapter.addClass(cssClasses.FG_ACTIVATION));
});

testFoundation('sets FG position to center on non-pointer activation', ({foundation, adapter, mockRaf}) => {
  const handlers = captureHandlers(adapter);
  const left = 50;
  const top = 50;
  const width = 200;
  const height = 100;
  const maxSize = Math.max(width, height);
  const initialSize = maxSize * numbers.INITIAL_ORIGIN_SCALE;

  td.when(adapter.computeBoundingRect()).thenReturn({width, height, left, top});
  td.when(adapter.isSurfaceActive()).thenReturn(true);
  foundation.init();
  mockRaf.flush();

  handlers.keydown();
  mockRaf.flush();

  const position = {
    x: (width / 2) - (initialSize / 2),
    y: (height / 2) - (initialSize / 2),
  };

  td.verify(adapter.updateCssVariable(strings.VAR_FG_TRANSLATE_START,
    `${position.x}px, ${position.y}px`));
  td.verify(adapter.updateCssVariable(strings.VAR_FG_TRANSLATE_END,
    `${position.x}px, ${position.y}px`));
});

testFoundation('does not redundantly add classes on touchstart followed by mousedown',
  ({foundation, adapter, mockRaf}) => {
    const handlers = captureHandlers(adapter);
    foundation.init();
    mockRaf.flush();

    handlers.touchstart({changedTouches: [{pageX: 0, pageY: 0}]});
    mockRaf.flush();
    handlers.mousedown();
    mockRaf.flush();
    td.verify(adapter.addClass(cssClasses.BG_ACTIVE_FILL), {times: 1});
    td.verify(adapter.addClass(cssClasses.FG_ACTIVATION), {times: 1});
  });

testFoundation('does not redundantly add classes on touchstart followed by pointerstart',
  ({foundation, adapter, mockRaf}) => {
    const handlers = captureHandlers(adapter);
    foundation.init();
    mockRaf.flush();

    handlers.touchstart({changedTouches: [{pageX: 0, pageY: 0}]});
    mockRaf.flush();
    handlers.pointerdown();
    mockRaf.flush();
    td.verify(adapter.addClass(cssClasses.BG_ACTIVE_FILL), {times: 1});
    td.verify(adapter.addClass(cssClasses.FG_ACTIVATION), {times: 1});
  });

testFoundation('removes deactivation classes on activate to ensure ripples can be retriggered',
  ({foundation, adapter, mockRaf}) => {
    const handlers = captureHandlers(adapter);
    foundation.init();
    mockRaf.flush();

    handlers.mousedown();
    mockRaf.flush();
    handlers.mouseup();
    mockRaf.flush();
    handlers.mousedown();
    mockRaf.flush();

    td.verify(adapter.removeClass(cssClasses.FG_DEACTIVATION));
  });

testFoundation('displays the foreground ripple on activation when unbounded', ({foundation, adapter, mockRaf}) => {
  const handlers = captureHandlers(adapter);
  td.when(adapter.computeBoundingRect()).thenReturn({width: 100, height: 100, left: 0, top: 0});
  td.when(adapter.isUnbounded()).thenReturn(true);
  foundation.init();
  mockRaf.flush();

  handlers.mousedown({pageX: 0, pageY: 0});
  mockRaf.flush();

  td.verify(adapter.addClass(cssClasses.FG_ACTIVATION));
});

testFoundation('clears translation custom properties when unbounded in case ripple was switched from bounded',
  ({foundation, adapter, mockRaf}) => {
    const handlers = captureHandlers(adapter);

    td.when(adapter.isUnbounded()).thenReturn(true);
    foundation.init();
    mockRaf.flush();

    handlers.pointerdown({pageX: 100, pageY: 75});
    mockRaf.flush();

    td.verify(adapter.updateCssVariable(strings.VAR_FG_TRANSLATE_START, ''));
    td.verify(adapter.updateCssVariable(strings.VAR_FG_TRANSLATE_END, ''));
  });
