/**
 * @license
 * Copyright 2020 Google Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */


import {cssClasses, numbers, strings} from '../../mdc-ripple/constants';
import {MDCRippleFoundation} from '../../mdc-ripple/foundation';
import {captureHandlers, checkNumTimesSpyCalledWithArgs} from '../../../testing/helpers/foundation';
import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {setupTest, testFoundation} from './helpers';

describe('MDCRippleFoundation - Activation Logic', () => {
  setUpMdcTestEnvironment();

  testFoundation(
      'does nothing if component if isSurfaceDisabled is true',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        foundation.init();
        jasmine.clock().tick(1);

        adapter.isSurfaceDisabled.and.returnValue(true);

        handlers['mousedown']();

        expect(adapter.addClass)
            .not.toHaveBeenCalledWith(cssClasses.FG_ACTIVATION);
      });

  testFoundation(
      'adds activation classes on mousedown',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        foundation.init();
        jasmine.clock().tick(1);

        handlers['mousedown']();
        jasmine.clock().tick(1);
        expect(adapter.addClass).toHaveBeenCalledWith(cssClasses.FG_ACTIVATION);
      });

  testFoundation(
      'sets FG position from the coords to the center within surface on mousedown',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        const left = 50;
        const top = 50;
        const width = 200;
        const height = 100;
        const maxSize = Math.max(width, height);
        const initialSize = maxSize * numbers.INITIAL_ORIGIN_SCALE;
        const pageX = 100;
        const pageY = 75;

        adapter.computeBoundingRect.and.returnValue({width, height, left, top});
        foundation.init();
        jasmine.clock().tick(1);

        handlers['mousedown']({pageX, pageY});
        jasmine.clock().tick(1);

        const startPosition = {
          x: pageX - left - (initialSize / 2),
          y: pageY - top - (initialSize / 2),
        };

        const endPosition = {
          x: (width / 2) - (initialSize / 2),
          y: (height / 2) - (initialSize / 2),
        };

        expect(adapter.updateCssVariable)
            .toHaveBeenCalledWith(
                strings.VAR_FG_TRANSLATE_START,
                `${startPosition.x}px, ${startPosition.y}px`);
        expect(adapter.updateCssVariable)
            .toHaveBeenCalledWith(
                strings.VAR_FG_TRANSLATE_END,
                `${endPosition.x}px, ${endPosition.y}px`);
      });

  testFoundation(
      'adds activation classes on touchstart',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        foundation.init();
        jasmine.clock().tick(1);

        handlers['touchstart']({changedTouches: [{pageX: 0, pageY: 0}]});
        jasmine.clock().tick(1);
        expect(adapter.addClass).toHaveBeenCalledWith(cssClasses.FG_ACTIVATION);
      });

  testFoundation(
      'sets FG position from the coords to the center within surface on touchstart',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        const left = 50;
        const top = 50;
        const width = 200;
        const height = 100;
        const maxSize = Math.max(width, height);
        const initialSize = maxSize * numbers.INITIAL_ORIGIN_SCALE;
        const pageX = 100;
        const pageY = 75;

        adapter.computeBoundingRect.and.returnValue({width, height, left, top});
        foundation.init();
        jasmine.clock().tick(1);

        handlers['touchstart']({changedTouches: [{pageX, pageY}]});
        jasmine.clock().tick(1);

        const startPosition = {
          x: pageX - left - (initialSize / 2),
          y: pageY - top - (initialSize / 2),
        };

        const endPosition = {
          x: (width / 2) - (initialSize / 2),
          y: (height / 2) - (initialSize / 2),
        };

        expect(adapter.updateCssVariable)
            .toHaveBeenCalledWith(
                strings.VAR_FG_TRANSLATE_START,
                `${startPosition.x}px, ${startPosition.y}px`);
        expect(adapter.updateCssVariable)
            .toHaveBeenCalledWith(
                strings.VAR_FG_TRANSLATE_END,
                `${endPosition.x}px, ${endPosition.y}px`);
      });

  testFoundation(
      'adds activation classes on pointerdown',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        foundation.init();
        jasmine.clock().tick(1);

        handlers['pointerdown']();
        jasmine.clock().tick(1);
        expect(adapter.addClass).toHaveBeenCalledWith(cssClasses.FG_ACTIVATION);
      });

  testFoundation(
      'sets FG position from the coords to the center within surface on pointerdown',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        const left = 50;
        const top = 50;
        const width = 200;
        const height = 100;
        const maxSize = Math.max(width, height);
        const initialSize = maxSize * numbers.INITIAL_ORIGIN_SCALE;
        const pageX = 100;
        const pageY = 75;

        adapter.computeBoundingRect.and.returnValue({width, height, left, top});
        foundation.init();
        jasmine.clock().tick(1);

        handlers['pointerdown']({pageX, pageY});
        jasmine.clock().tick(1);

        const startPosition = {
          x: pageX - left - (initialSize / 2),
          y: pageY - top - (initialSize / 2),
        };

        const endPosition = {
          x: (width / 2) - (initialSize / 2),
          y: (height / 2) - (initialSize / 2),
        };

        expect(adapter.updateCssVariable)
            .toHaveBeenCalledWith(
                strings.VAR_FG_TRANSLATE_START,
                `${startPosition.x}px, ${startPosition.y}px`);
        expect(adapter.updateCssVariable)
            .toHaveBeenCalledWith(
                strings.VAR_FG_TRANSLATE_END,
                `${endPosition.x}px, ${endPosition.y}px`);
      });

  testFoundation(
      'adds activation classes on keydown when surface is made active on same frame',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        adapter.isSurfaceActive.and.returnValue(true);
        foundation.init();
        jasmine.clock().tick(1);

        handlers['keydown']();
        checkNumTimesSpyCalledWithArgs(
            adapter.addClass, [cssClasses.FG_ACTIVATION], 1);
      });

  testFoundation(
      'adds activation classes on keydown when surface only reflects :active on next frame for space keydown',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        adapter.isSurfaceActive.and.returnValues(false, true);
        foundation.init();
        jasmine.clock().tick(1);

        handlers['keydown']({key: ' '});
        expect(adapter.addClass)
            .not.toHaveBeenCalledWith(cssClasses.FG_ACTIVATION);

        jasmine.clock().tick(1);
        expect(adapter.addClass).toHaveBeenCalledWith(cssClasses.FG_ACTIVATION);
      });

  testFoundation(
      'does not add activation classes on keydown when surface is not made active',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        adapter.isSurfaceActive.and.returnValues(false, false);
        foundation.init();
        jasmine.clock().tick(1);

        handlers['keydown']({key: ' '});
        jasmine.clock().tick(1);

        expect(adapter.addClass)
            .not.toHaveBeenCalledWith(cssClasses.FG_ACTIVATION);
      });

  testFoundation(
      'sets FG position to center on non-pointer activation',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        const left = 50;
        const top = 50;
        const width = 200;
        const height = 100;
        const maxSize = Math.max(width, height);
        const initialSize = maxSize * numbers.INITIAL_ORIGIN_SCALE;

        adapter.computeBoundingRect.and.returnValue({width, height, left, top});
        adapter.isSurfaceActive.and.returnValue(true);
        foundation.init();
        jasmine.clock().tick(1);

        handlers['keydown']();
        jasmine.clock().tick(1);

        const position = {
          x: (width / 2) - (initialSize / 2),
          y: (height / 2) - (initialSize / 2),
        };

        expect(adapter.updateCssVariable)
            .toHaveBeenCalledWith(
                strings.VAR_FG_TRANSLATE_START,
                `${position.x}px, ${position.y}px`);
        expect(adapter.updateCssVariable)
            .toHaveBeenCalledWith(
                strings.VAR_FG_TRANSLATE_END,
                `${position.x}px, ${position.y}px`);
      });

  testFoundation(
      'adds activation classes on programmatic activation',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        adapter.isSurfaceActive.and.returnValue(true);
        foundation.init();
        jasmine.clock().tick(1);

        foundation.activate();
        jasmine.clock().tick(1);

        expect(adapter.addClass).toHaveBeenCalledWith(cssClasses.FG_ACTIVATION);
      });

  testFoundation(
      'programmatic activation immediately after interaction',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        const documentHandlers =
            captureHandlers(adapter, 'registerDocumentInteractionHandler');

        adapter.isSurfaceActive.and.returnValue(true);
        foundation.init();
        jasmine.clock().tick(1);

        handlers['touchstart']({changedTouches: [{pageX: 0, pageY: 0}]});
        jasmine.clock().tick(1);
        documentHandlers['touchend']();
        jasmine.clock().tick(1);

        foundation.activate();
        jasmine.clock().tick(1);

        checkNumTimesSpyCalledWithArgs(
            adapter.addClass, [cssClasses.FG_ACTIVATION], 2);
      });

  testFoundation(
      'sets FG position to center on non-pointer activation',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        const left = 50;
        const top = 50;
        const width = 200;
        const height = 100;
        const maxSize = Math.max(width, height);
        const initialSize = maxSize * numbers.INITIAL_ORIGIN_SCALE;

        adapter.computeBoundingRect.and.returnValue({width, height, left, top});
        adapter.isSurfaceActive.and.returnValue(true);
        foundation.init();
        jasmine.clock().tick(1);

        handlers['keydown']();
        jasmine.clock().tick(1);

        const position = {
          x: (width / 2) - (initialSize / 2),
          y: (height / 2) - (initialSize / 2),
        };

        expect(adapter.updateCssVariable)
            .toHaveBeenCalledWith(
                strings.VAR_FG_TRANSLATE_START,
                `${position.x}px, ${position.y}px`);
        expect(adapter.updateCssVariable)
            .toHaveBeenCalledWith(
                strings.VAR_FG_TRANSLATE_END,
                `${position.x}px, ${position.y}px`);
      });

  testFoundation(
      'does not redundantly add classes on touchstart followed by mousedown',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        foundation.init();
        jasmine.clock().tick(1);

        handlers['touchstart']({changedTouches: [{pageX: 0, pageY: 0}]});
        jasmine.clock().tick(1);
        handlers['mousedown']();
        jasmine.clock().tick(1);

        checkNumTimesSpyCalledWithArgs(
            adapter.addClass, [cssClasses.FG_ACTIVATION], 1);
      });

  testFoundation(
      'does not redundantly add classes on touchstart followed by pointerstart',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        foundation.init();
        jasmine.clock().tick(1);

        handlers['touchstart']({changedTouches: [{pageX: 0, pageY: 0}]});
        jasmine.clock().tick(1);
        handlers['pointerdown']();
        jasmine.clock().tick(1);

        checkNumTimesSpyCalledWithArgs(
            adapter.addClass, [cssClasses.FG_ACTIVATION], 1);
      });

  testFoundation(
      'removes deactivation classes on activate to ensure ripples can be retriggered',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        const documentHandlers =
            captureHandlers(adapter, 'registerDocumentInteractionHandler');
        foundation.init();
        jasmine.clock().tick(1);

        handlers['mousedown']();
        jasmine.clock().tick(1);
        documentHandlers['mouseup']();
        jasmine.clock().tick(1);
        handlers['mousedown']();
        jasmine.clock().tick(1);

        expect(adapter.removeClass)
            .toHaveBeenCalledWith(cssClasses.FG_DEACTIVATION);
      });

  testFoundation(
      'will not activate multiple ripples on same frame if one surface descends from another',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const secondRipple = setupTest();
        const firstHandlers =
            captureHandlers(adapter, 'registerInteractionHandler');
        const secondHandlers =
            captureHandlers(secondRipple.adapter, 'registerInteractionHandler');
        secondRipple.adapter.containsEventTarget.and.returnValue(true);
        foundation.init();
        secondRipple.foundation.init();
        jasmine.clock().tick(1);

        firstHandlers['mousedown']();
        secondHandlers['mousedown']();
        jasmine.clock().tick(1);

        expect(adapter.addClass).toHaveBeenCalledWith(cssClasses.FG_ACTIVATION);
        expect(secondRipple.adapter.addClass)
            .not.toHaveBeenCalledWith(cssClasses.FG_ACTIVATION);
      });

  testFoundation(
      'will not activate multiple ripples on same frame for parent surface w/ touch follow-on events',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const secondRipple = setupTest();
        const firstHandlers =
            captureHandlers(adapter, 'registerInteractionHandler');
        const secondHandlers =
            captureHandlers(secondRipple.adapter, 'registerInteractionHandler');
        secondRipple.adapter.containsEventTarget.and.returnValue(true);
        foundation.init();
        secondRipple.foundation.init();
        jasmine.clock().tick(1);

        firstHandlers['touchstart']({changedTouches: [{pageX: 0, pageY: 0}]});
        secondHandlers['touchstart']({changedTouches: [{pageX: 0, pageY: 0}]});
        // Simulated mouse events on touch devices always happen after a delay,
        // not on the same frame
        jasmine.clock().tick(1);
        firstHandlers['mousedown']();
        secondHandlers['mousedown']();
        jasmine.clock().tick(1);

        expect(adapter.addClass).toHaveBeenCalledWith(cssClasses.FG_ACTIVATION);
        expect(secondRipple.adapter.addClass)
            .not.toHaveBeenCalledWith(cssClasses.FG_ACTIVATION);
      });

  testFoundation(
      'will activate multiple ripples on same frame for surfaces without an ancestor/descendant relationship',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const secondRipple = setupTest();
        const firstHandlers =
            captureHandlers(adapter, 'registerInteractionHandler');
        const secondHandlers =
            captureHandlers(secondRipple.adapter, 'registerInteractionHandler');
        secondRipple.adapter.containsEventTarget.and.returnValue(false);
        foundation.init();
        secondRipple.foundation.init();
        jasmine.clock().tick(1);

        firstHandlers['mousedown']();
        secondHandlers['mousedown']();
        jasmine.clock().tick(1);

        expect(adapter.addClass).toHaveBeenCalledWith(cssClasses.FG_ACTIVATION);
        expect(secondRipple.adapter.addClass)
            .toHaveBeenCalledWith(cssClasses.FG_ACTIVATION);
      });

  testFoundation(
      'displays the foreground ripple on activation when unbounded',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');
        adapter.computeBoundingRect.and.returnValue(
            {width: 100, height: 100, left: 0, top: 0});
        adapter.isUnbounded.and.returnValue(true);
        foundation.init();
        jasmine.clock().tick(1);

        handlers['mousedown']({pageX: 0, pageY: 0});
        jasmine.clock().tick(1);

        expect(adapter.addClass).toHaveBeenCalledWith(cssClasses.FG_ACTIVATION);
      });

  testFoundation(
      'clears translation custom properties when unbounded in case ripple was switched from bounded',
      ({adapter,
        foundation}: {adapter: any, foundation: MDCRippleFoundation}) => {
        const handlers = captureHandlers(adapter, 'registerInteractionHandler');

        adapter.isUnbounded.and.returnValue(true);
        foundation.init();
        jasmine.clock().tick(1);

        handlers['pointerdown']({pageX: 100, pageY: 75});
        jasmine.clock().tick(1);

        expect(adapter.updateCssVariable)
            .toHaveBeenCalledWith(strings.VAR_FG_TRANSLATE_START, '');
        expect(adapter.updateCssVariable)
            .toHaveBeenCalledWith(strings.VAR_FG_TRANSLATE_END, '');
      });
});
