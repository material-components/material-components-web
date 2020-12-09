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

import {getFixture} from '../../../testing/dom';
import {emitEvent} from '../../../testing/dom/events';
import {createMockFoundation} from '../../../testing/helpers/foundation';
import {setUpMdcTestEnvironment} from '../../../testing/helpers/setup';
import {AnchorBoundaryType, CssClasses, numbers, XPosition, YPosition} from '../constants';
import {MDCTooltip, MDCTooltipFoundation} from '../index';

function setupTestWithMockFoundation(fixture: HTMLElement) {
  const tooltipElem = fixture.querySelector('#tt0') as HTMLElement;
  const anchorElem = fixture.querySelector('[aria-describedby]') as HTMLElement;
  const mockFoundation = createMockFoundation(MDCTooltipFoundation);
  const component = new MDCTooltip(tooltipElem, mockFoundation);
  return {anchorElem, tooltipElem, mockFoundation, component};
}

function isIE() {
  return navigator.userAgent.indexOf('MSIE') !== -1 ||
      navigator.userAgent.indexOf('Trident') !== -1;
}

describe('MDCTooltip', () => {
  let fixture: HTMLElement;
  setUpMdcTestEnvironment();
  describe('plain tooltip tests', () => {
    beforeEach(() => {
      fixture = getFixture(`<div>
        <button aria-describedby="tt0">
          anchor
        </button>
        <div id="tt0" class="mdc-tooltip" aria-role="tooltip" aria-hidden="true">
          <div class="mdc-tooltip__surface">
            demo tooltip
          </div>
        </div>
      </div>`);
      document.body.appendChild(fixture);
    });

    afterEach(() => {
      document.body.removeChild(fixture);
    });

    it('attachTo returns a component instance', () => {
      expect(MDCTooltip.attachTo(
                 fixture.querySelector('.mdc-tooltip') as HTMLElement))
          .toEqual(jasmine.any(MDCTooltip));
    });

    it('attachTo throws an error when anchor element is missing', () => {
      const container =
          fixture.querySelector('[aria-describedby]') as HTMLElement;
      container.parentElement!.removeChild(container);
      expect(
          () => MDCTooltip.attachTo(
              container.querySelector('.mdc-tooltip') as HTMLElement))
          .toThrow();
    });

    it('#initialSyncWithDOM registers mouseenter event handler on the anchor element',
       () => {
         const {anchorElem, mockFoundation, component} =
             setupTestWithMockFoundation(fixture);
         emitEvent(anchorElem, 'mouseenter');
         expect(mockFoundation.handleAnchorMouseEnter).toHaveBeenCalled();
         component.destroy();
       });

    it('#destroy deregisters mouseenter event handler on the anchor element',
       () => {
         const {anchorElem, mockFoundation, component} =
             setupTestWithMockFoundation(fixture);
         component.destroy();
         emitEvent(anchorElem, 'mouseenter');
         expect(mockFoundation.handleAnchorMouseEnter).not.toHaveBeenCalled();
       });

    it('#initialSyncWithDOM registers focus event handler on the anchor element',
       () => {
         const {anchorElem, mockFoundation, component} =
             setupTestWithMockFoundation(fixture);
         emitEvent(anchorElem, 'focus');
         expect(mockFoundation.handleAnchorFocus).toHaveBeenCalled();
         component.destroy();
       });

    it('#destroy deregisters focus event handler on the anchor element', () => {
      const {anchorElem, mockFoundation, component} =
          setupTestWithMockFoundation(fixture);
      component.destroy();
      emitEvent(anchorElem, 'focus');
      expect(mockFoundation.handleAnchorFocus).not.toHaveBeenCalled();
    });

    it('#initialSyncWithDOM registers mouseleave event handler on the anchor element',
       () => {
         const {anchorElem, mockFoundation, component} =
             setupTestWithMockFoundation(fixture);
         emitEvent(anchorElem, 'mouseleave');
         expect(mockFoundation.handleAnchorMouseLeave).toHaveBeenCalled();
         component.destroy();
       });

    it('#destroy deregisters mouseleave event handler on the anchor element',
       () => {
         const {anchorElem, mockFoundation, component} =
             setupTestWithMockFoundation(fixture);
         component.destroy();
         emitEvent(anchorElem, 'mouseleave');
         expect(mockFoundation.handleAnchorMouseLeave).not.toHaveBeenCalled();
       });

    it('#initialSyncWithDOM registers blur event handler on the anchor element',
       () => {
         const {anchorElem, mockFoundation, component} =
             setupTestWithMockFoundation(fixture);
         emitEvent(anchorElem, 'blur');
         expect(mockFoundation.handleAnchorBlur).toHaveBeenCalled();
         component.destroy();
       });

    it('#destroy deregisters blur event handler on the anchor element', () => {
      const {anchorElem, mockFoundation, component} =
          setupTestWithMockFoundation(fixture);
      component.destroy();
      emitEvent(anchorElem, 'blur');
      expect(mockFoundation.handleAnchorBlur).not.toHaveBeenCalled();
    });

    it('#initialSyncWithDOM registers transitionend event handler on the tooltip',
       () => {
         const {mockFoundation, component} =
             setupTestWithMockFoundation(fixture);
         emitEvent(component.root, 'transitionend');
         expect(mockFoundation.handleTransitionEnd).toHaveBeenCalled();
         component.destroy();
       });

    it('#destroy deregisters transitionend event handler on the tooltip',
       () => {
         const {mockFoundation, component} =
             setupTestWithMockFoundation(fixture);
         component.destroy();
         emitEvent(component.root, 'transitionend');
         expect(mockFoundation.handleTransitionEnd).not.toHaveBeenCalled();
       });

    it('#setTooltipPosition forwards to MDCFoundation#setTooltipPosition',
       () => {
         const {mockFoundation, component} =
             setupTestWithMockFoundation(fixture);
         component.setTooltipPosition(
             {xPos: XPosition.CENTER, yPos: YPosition.ABOVE});
         expect(mockFoundation.setTooltipPosition).toHaveBeenCalledWith({
           xPos: XPosition.CENTER,
           yPos: YPosition.ABOVE
         });
         component.destroy();
       });

    it('#setAnchorBoundaryType forwards to MDCFoundation#setAnchorBoundaryType',
       () => {
         const {mockFoundation, component} =
             setupTestWithMockFoundation(fixture);
         component.setAnchorBoundaryType(AnchorBoundaryType.UNBOUNDED);
         expect(mockFoundation.setAnchorBoundaryType)
             .toHaveBeenCalledWith(AnchorBoundaryType.UNBOUNDED);
         component.destroy();
       });

    it('sets aria-hidden to false when showing tooltip on an anchor annotated with `aria-describedby`',
       () => {
         const tooltipElem = fixture.querySelector<HTMLElement>('#tt0')!;
         const anchorElem =
             fixture.querySelector<HTMLElement>('[aria-describedby]')!;
         MDCTooltip.attachTo(tooltipElem);

         emitEvent(anchorElem, 'mouseenter');
         jasmine.clock().tick(numbers.SHOW_DELAY_MS);
         expect(tooltipElem.getAttribute('aria-hidden')).toEqual('false');
       });

    it('leaves aria-hidden as true when showing tooltip on an anchor annotated with `data-tooltip-id`',
       () => {
         document.body.removeChild(fixture);
         fixture = getFixture(`<div>
        <button data-tooltip-id="tt0">
          anchor
        </button>
        <div id="tt0"
             class="mdc-tooltip"
             aria-role="tooltip"
             aria-hidden="true">
          <div class="mdc-tooltip__surface">
            demo tooltip
          </div>
        </div>
      </div>`);
         document.body.appendChild(fixture);
         const tooltipElem = fixture.querySelector<HTMLElement>('#tt0')!;
         const anchorElem =
             fixture.querySelector<HTMLElement>('[data-tooltip-id]')!;
         MDCTooltip.attachTo(tooltipElem);

         emitEvent(anchorElem, 'mouseenter');
         jasmine.clock().tick(numbers.SHOW_DELAY_MS);
         expect(tooltipElem.getAttribute('aria-hidden')).toEqual('true');
       });

    it('detects tooltip labels that span multiple lines', () => {
      document.body.removeChild(fixture);
      fixture = getFixture(`<div>
        <button data-tooltip-id="tt0">
          anchor
        </button>
        <div id="tt0"
             class="mdc-tooltip"
             aria-role="tooltip"
             aria-hidden="true">
          <div class="mdc-tooltip__surface">
            this is as long tooltip label that will overflow the maximum width
            and will create a multi-line tooltip label
          </div>
        </div>
      </div>`);
      document.body.appendChild(fixture);
      const tooltipElem = fixture.querySelector<HTMLElement>('#tt0')!;
      // Add a max-width and min-height since styles are not loaded in
      // this test.
      tooltipElem.style.maxWidth = `${numbers.MAX_WIDTH}px`;
      tooltipElem.style.minHeight = `${numbers.MIN_HEIGHT}px`;
      const anchorElem =
          fixture.querySelector<HTMLElement>('[data-tooltip-id]')!;
      MDCTooltip.attachTo(tooltipElem);

      emitEvent(anchorElem, 'mouseenter');
      jasmine.clock().tick(numbers.SHOW_DELAY_MS);
      expect(tooltipElem.classList).toContain(CssClasses.MULTILINE_TOOLTIP);
    });
  });

  describe('default interactive rich tooltip tests', () => {
    beforeEach(() => {
      fixture = getFixture(`<div>
        <button aria-describedby="tt0" aria-haspopup="true" aria-expanded="false">
          anchor
        </button>
        <div id="tt0" class="mdc-tooltip mdc-tooltip--rich" aria-role="dialog" aria-hidden="true">
          <div class="mdc-tooltip__surface">
            <p class="mdc-tooltip__content">
              demo tooltip
            </p>
          </div>
        </div>
      </div>`);
      document.body.appendChild(fixture);
    });

    afterEach(() => {
      document.body.removeChild(fixture);
    });

    it('attachTo returns a component instance', () => {
      expect(MDCTooltip.attachTo(
                 fixture.querySelector('.mdc-tooltip--rich') as HTMLElement))
          .toEqual(jasmine.any(MDCTooltip));
    });

    it('sets aria-expanded on anchor to true when showing rich tooltip', () => {
      const tooltipElem = fixture.querySelector<HTMLElement>('#tt0')!;
      const anchorElem =
          fixture.querySelector<HTMLElement>('[aria-describedby]')!;
      MDCTooltip.attachTo(tooltipElem);

      emitEvent(anchorElem, 'mouseenter');
      jasmine.clock().tick(numbers.SHOW_DELAY_MS);

      expect(anchorElem.getAttribute('aria-expanded')).toEqual('true');
    });

    it('aria-expanded remains true on anchor when mouseleave anchor and mouseenter rich tooltip',
       () => {
         const tooltipElem = fixture.querySelector<HTMLElement>('#tt0')!;
         const anchorElem =
             fixture.querySelector<HTMLElement>('[aria-describedby]')!;
         MDCTooltip.attachTo(tooltipElem);

         emitEvent(anchorElem, 'mouseenter');
         jasmine.clock().tick(numbers.SHOW_DELAY_MS);
         emitEvent(anchorElem, 'mouseleave');
         emitEvent(tooltipElem, 'mouseenter');

         expect(anchorElem.getAttribute('aria-expanded')).toEqual('true');
       });

    it('aria-expanded remains true on anchor when mouseleave rich tooltip and mouseenter anchor',
       () => {
         const tooltipElem = fixture.querySelector<HTMLElement>('#tt0')!;
         const anchorElem =
             fixture.querySelector<HTMLElement>('[aria-describedby]')!;
         MDCTooltip.attachTo(tooltipElem);

         emitEvent(anchorElem, 'mouseenter');
         jasmine.clock().tick(numbers.SHOW_DELAY_MS);
         emitEvent(tooltipElem, 'mouseleave');
         emitEvent(anchorElem, 'mouseenter');

         expect(anchorElem.getAttribute('aria-expanded')).toEqual('true');
       });

    it('aria-expanded becomes false on anchor when anchor blurs and non-tooltip element is focused',
       () => {
         // FocusEvent is not supported on IE11 so this test will not be run on
         // it.
         if (isIE()) {
           return;
         }
         const tooltipElem = fixture.querySelector<HTMLElement>('#tt0')!;
         const anchorElem =
             fixture.querySelector<HTMLElement>('[aria-describedby]')!;
         MDCTooltip.attachTo(tooltipElem);

         emitEvent(anchorElem, 'focus');
         jasmine.clock().tick(numbers.SHOW_DELAY_MS);
         expect(anchorElem.getAttribute('aria-expanded')).toEqual('true');
         anchorElem.dispatchEvent(
             new FocusEvent('blur', {relatedTarget: document.body}));

         expect(anchorElem.getAttribute('aria-expanded')).toEqual('false');
       });

    it('aria-expanded remains true on anchor when anchor blurs and rich tooltip focuses',
       () => {
         // FocusEvent is not supported on IE11 so this test will not be run on
         // it.
         if (isIE()) {
           return;
         }
         const tooltipElem = fixture.querySelector<HTMLElement>('#tt0')!;
         const anchorElem =
             fixture.querySelector<HTMLElement>('[aria-describedby]')!;
         MDCTooltip.attachTo(tooltipElem);

         emitEvent(anchorElem, 'focus');
         jasmine.clock().tick(numbers.SHOW_DELAY_MS);
         expect(anchorElem.getAttribute('aria-expanded')).toEqual('true');
         anchorElem.dispatchEvent(
             new FocusEvent('blur', {relatedTarget: tooltipElem}));

         expect(anchorElem.getAttribute('aria-expanded')).toEqual('true');
       });

    it('aria-expanded becomes false on anchor when rich tooltip focuses out and anchor does not receive focus',
       () => {
         // FocusEvent is not supported on IE11 so this test will not be run on
         // it.
         if (isIE()) {
           return;
         }
         const tooltipElem = fixture.querySelector<HTMLElement>('#tt0')!;
         const anchorElem =
             fixture.querySelector<HTMLElement>('[aria-describedby]')!;
         MDCTooltip.attachTo(tooltipElem);

         emitEvent(anchorElem, 'focus');
         jasmine.clock().tick(numbers.SHOW_DELAY_MS);
         expect(anchorElem.getAttribute('aria-expanded')).toEqual('true');
         tooltipElem.dispatchEvent(new FocusEvent('focusout'));

         expect(anchorElem.getAttribute('aria-expanded')).toEqual('false');
       });

    it('aria-expanded remains true on anchor when rich tooltip focuses out and anchor receives focus',
       () => {
         // FocusEvent is not supported on IE11 so this test will not be run on
         // it.
         if (isIE()) {
           return;
         }
         const tooltipElem = fixture.querySelector<HTMLElement>('#tt0')!;
         const anchorElem =
             fixture.querySelector<HTMLElement>('[aria-describedby]')!;
         MDCTooltip.attachTo(tooltipElem);

         emitEvent(anchorElem, 'focus');
         jasmine.clock().tick(numbers.SHOW_DELAY_MS);
         expect(anchorElem.getAttribute('aria-expanded')).toEqual('true');
         tooltipElem.dispatchEvent(
             new FocusEvent('focusout', {relatedTarget: anchorElem}));

         expect(anchorElem.getAttribute('aria-expanded')).toEqual('true');
       });

    it('aria-expanded remains true on anchor when rich tooltip focuses out and element within tooltip receives focus',
       () => {
         // FocusEvent is not supported on IE11 so this test will not be run on
         // it.
         if (isIE()) {
           return;
         }
         const tooltipElem = fixture.querySelector<HTMLElement>('#tt0')!;
         const tooltipContent =
             fixture.querySelector<HTMLElement>('.mdc-tooltip__content')!;
         const anchorElem =
             fixture.querySelector<HTMLElement>('[aria-describedby]')!;
         MDCTooltip.attachTo(tooltipElem);

         emitEvent(anchorElem, 'focus');
         jasmine.clock().tick(numbers.SHOW_DELAY_MS);
         expect(anchorElem.getAttribute('aria-expanded')).toEqual('true');
         tooltipElem.dispatchEvent(
             new FocusEvent('focusout', {relatedTarget: tooltipContent}));

         expect(anchorElem.getAttribute('aria-expanded')).toEqual('true');
       });
  });

  describe('persistent rich tooltip tests', () => {
    beforeEach(() => {
      fixture = getFixture(`<div>
        <button aria-describedby="tt0" aria-haspopup="true" aria-expanded="false">
          anchor
        </button>
        <div id="tt0" class="mdc-tooltip mdc-tooltip--rich" aria-role="dialog" aria-hidden="true" data-mdc-tooltip-persistent="true">
          <div class="mdc-tooltip__surface">
            <p class="mdc-tooltip__content">
              demo tooltip
            </p>
          </div>
        </div>
      </div>`);
      document.body.appendChild(fixture);
    });

    afterEach(() => {
      document.body.removeChild(fixture);
    });

    it('aria-expanded remains false on anchor when mouseenter anchor', () => {
      const tooltipElem = fixture.querySelector<HTMLElement>('#tt0')!;
      const anchorElem =
          fixture.querySelector<HTMLElement>('[aria-describedby]')!;
      MDCTooltip.attachTo(tooltipElem);

      emitEvent(anchorElem, 'mouseenter');
      jasmine.clock().tick(numbers.SHOW_DELAY_MS);

      expect(anchorElem.getAttribute('aria-expanded')).toEqual('false');
    });

    it('set aria-expanded to true on anchor when anchor clicked while tooltip is hidden',
       () => {
         const tooltipElem = fixture.querySelector<HTMLElement>('#tt0')!;
         const anchorElem =
             fixture.querySelector<HTMLElement>('[aria-describedby]')!;
         MDCTooltip.attachTo(tooltipElem);
         expect(tooltipElem.getAttribute('aria-hidden')).toEqual('true');
         expect(anchorElem.getAttribute('aria-expanded')).toEqual('false');

         emitEvent(anchorElem, 'click');

         expect(tooltipElem.getAttribute('aria-hidden')).toEqual('false');
         expect(anchorElem.getAttribute('aria-expanded')).toEqual('true');
       });

    it('set aria-expanded to false on anchor when anchor clicked while tooltip is shown',
       () => {
         const tooltipElem = fixture.querySelector<HTMLElement>('#tt0')!;
         const anchorElem =
             fixture.querySelector<HTMLElement>('[aria-describedby]')!;
         MDCTooltip.attachTo(tooltipElem);

         emitEvent(anchorElem, 'click');
         expect(tooltipElem.getAttribute('aria-hidden')).toEqual('false');
         expect(anchorElem.getAttribute('aria-expanded')).toEqual('true');
         emitEvent(anchorElem, 'click');

         expect(tooltipElem.getAttribute('aria-hidden')).toEqual('true');
         expect(anchorElem.getAttribute('aria-expanded')).toEqual('false');
       });

    it('set aria-expanded to false on anchor when element other than anchor is clicked while tooltip is shown',
       () => {
         const tooltipElem = fixture.querySelector<HTMLElement>('#tt0')!;
         const anchorElem =
             fixture.querySelector<HTMLElement>('[aria-describedby]')!;
         MDCTooltip.attachTo(tooltipElem);

         emitEvent(anchorElem, 'click');
         expect(tooltipElem.getAttribute('aria-hidden')).toEqual('false');
         expect(anchorElem.getAttribute('aria-expanded')).toEqual('true');
         emitEvent(document.body, 'click');

         expect(tooltipElem.getAttribute('aria-hidden')).toEqual('true');
         expect(anchorElem.getAttribute('aria-expanded')).toEqual('false');
       });

    it('aria-expanded remains true on anchor when mouseleave anchor while tooltip is shown',
       () => {
         const tooltipElem = fixture.querySelector<HTMLElement>('#tt0')!;
         const anchorElem =
             fixture.querySelector<HTMLElement>('[aria-describedby]')!;
         MDCTooltip.attachTo(tooltipElem);

         emitEvent(anchorElem, 'click');
         expect(tooltipElem.getAttribute('aria-hidden')).toEqual('false');
         expect(anchorElem.getAttribute('aria-expanded')).toEqual('true');
         emitEvent(anchorElem, 'mouseleave');

         expect(anchorElem.getAttribute('aria-expanded')).toEqual('true');
       });

    it('aria-expanded remains true on anchor when mouseleave tooltip while tooltip is shown',
       () => {
         const tooltipElem = fixture.querySelector<HTMLElement>('#tt0')!;
         const anchorElem =
             fixture.querySelector<HTMLElement>('[aria-describedby]')!;
         MDCTooltip.attachTo(tooltipElem);

         emitEvent(anchorElem, 'click');
         expect(tooltipElem.getAttribute('aria-hidden')).toEqual('false');
         expect(anchorElem.getAttribute('aria-expanded')).toEqual('true');
         emitEvent(tooltipElem, 'mouseleave');

         expect(anchorElem.getAttribute('aria-expanded')).toEqual('true');
       });

    it('aria-expanded becomes false on anchor when anchor blurs and non-tooltip element is focused',
       () => {
         // FocusEvent is not supported on IE11 so this test will not be run on
         // it.
         if (isIE()) {
           return;
         }
         const tooltipElem = fixture.querySelector<HTMLElement>('#tt0')!;
         const anchorElem =
             fixture.querySelector<HTMLElement>('[aria-describedby]')!;
         MDCTooltip.attachTo(tooltipElem);

         emitEvent(anchorElem, 'click');
         jasmine.clock().tick(numbers.SHOW_DELAY_MS);
         expect(anchorElem.getAttribute('aria-expanded')).toEqual('true');
         anchorElem.dispatchEvent(
             new FocusEvent('blur', {relatedTarget: document.body}));

         expect(anchorElem.getAttribute('aria-expanded')).toEqual('false');
       });

    it('aria-expanded remains true on anchor when anchor blurs and rich tooltip focuses',
       () => {
         // FocusEvent is not supported on IE11 so this test will not be run on
         // it.
         if (isIE()) {
           return;
         }
         const tooltipElem = fixture.querySelector<HTMLElement>('#tt0')!;
         const anchorElem =
             fixture.querySelector<HTMLElement>('[aria-describedby]')!;
         MDCTooltip.attachTo(tooltipElem);

         emitEvent(anchorElem, 'click');
         jasmine.clock().tick(numbers.SHOW_DELAY_MS);
         expect(anchorElem.getAttribute('aria-expanded')).toEqual('true');
         anchorElem.dispatchEvent(
             new FocusEvent('blur', {relatedTarget: tooltipElem}));

         expect(anchorElem.getAttribute('aria-expanded')).toEqual('true');
       });
  });
});
