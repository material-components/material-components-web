/** @license Googler-authored internal-only code. */

import 'jasmine';

import {MDCTooltip} from '@material/tooltip/component';
import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {each, Environment, showAll, showOnly} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

import {emitEvent} from '../../../testing/dom/events';
import {PositionWithCaret} from '../constants';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCTooltip', () => {
  const env = new Environment(module);
  const shownTooltips = new Map<string, MDCTooltip>();
  const frameElement = window.frameElement as HTMLElement;

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);

    for (const el of each('.mdc-tooltip')) {
      shownTooltips.set(el.getAttribute('id')!, MDCTooltip.attachTo(el));
    }
  });

  afterEach(() => {
    showAll();
    // Hide all tooltips shown during a test immediately
    emitEvent(document.body, 'click');
    if (frameElement) {
      frameElement.style.removeProperty('width');
      frameElement.style.removeProperty('height');
    }
  });

  it('renders as initially hidden', async () => {
    expect(await env.diffElement(
               'baseline-tooltip-hidden', '.test-baseline-tooltip-hidden'))
        .toHavePassed();
  });

  it('renders plain tooltip', async () => {
    // Call showOnly first, to ensure the anchor isn't moved during the
    // diffElement call (this will result in an incorrectly positioned tooltip).
    showOnly('.test-baseline-tooltip-shown');

    const startAnchor = document.querySelector<HTMLElement>(
        '[aria-describedby="tooltip-shown"]')!;
    emitEvent(startAnchor, 'mouseenter');
    expect(await env.diffElement(
               'baseline-tooltip-shown', '.test-baseline-tooltip-shown'))
        .toHavePassed();
  });

  it('positions tooltip based on anchor placement in the viewport',
     async () => {
       // Call showOnly first, to ensure the anchor isn't moved during the
       // diffElement call (this will result in an incorrectly positioned
       // tooltip).
       showOnly('.test-tooltip-positioning');

       const startAnchor =
           document.querySelector<HTMLElement>('[aria-describedby="tt0"]')!;
       const centerAnchor =
           document.querySelector<HTMLElement>('[aria-describedby="tt1"]')!;
       const endAnchor =
           document.querySelector<HTMLElement>('[aria-describedby="tt2"]')!;
       emitEvent(startAnchor, 'mouseenter');
       emitEvent(centerAnchor, 'mouseenter');
       emitEvent(endAnchor, 'mouseenter');
       expect(await env.diffElement(
                  'tooltip-positioning', '.test-tooltip-positioning'))
           .toHavePassed();
     });

  it('positions tooltip based on anchor placement in the viewport when RTL',
     async () => {
       document.documentElement.dir = 'rtl';

       // Call showOnly first, to ensure the anchor isn't moved during the
       // diffElement call (this will result in an incorrectly positioned
       // tooltip).
       showOnly('.test-tooltip-positioning');

       const startAnchor =
           document.querySelector<HTMLElement>('[aria-describedby="tt0"]')!;
       const centerAnchor =
           document.querySelector<HTMLElement>('[aria-describedby="tt1"]')!;
       const endAnchor =
           document.querySelector<HTMLElement>('[aria-describedby="tt2"]')!;
       emitEvent(startAnchor, 'mouseenter');
       emitEvent(centerAnchor, 'mouseenter');
       emitEvent(endAnchor, 'mouseenter');
       expect(await env.diffElement(
                  'tooltip-positioning-rtl', '.test-tooltip-positioning'))
           .toHavePassed();

       document.documentElement.dir = 'ltr';
     });

  it('positions tooltip based on anchor placement in the viewport (y-axis)',
     async () => {
       // Call showOnly first, to ensure the anchor isn't moved during the
       // diffElement call (this will result in an incorrectly positioned
       // tooltip).
       showOnly('.test-y-tooltip-positioning');

       const startAnchor =
           document.querySelector<HTMLElement>('[aria-describedby="tt0y"]')!;
       const centerAnchor =
           document.querySelector<HTMLElement>('[aria-describedby="tt1y"]')!;
       const endAnchor =
           document.querySelector<HTMLElement>('[aria-describedby="tt2y"]')!;
       emitEvent(startAnchor, 'mouseenter');
       emitEvent(centerAnchor, 'mouseenter');
       emitEvent(endAnchor, 'mouseenter');
       expect(await env.diffElement(
                  'tooltip-positioning-y-axis', '.test-y-tooltip-positioning'))
           .toHavePassed();
     });

  it('wraps tooltip label text that exceeds the maximum tooltip width',
     async () => {
       // Call showOnly first, to ensure the anchor isn't moved during the
       // diffElement call (this will result in an incorrectly positioned
       // tooltip).
       showOnly('.test-long-tooltip-label');

       const anchor = document.querySelector<HTMLElement>(
           '[aria-describedby="tt-long-label"]')!;
       const anchor2 = document.querySelector<HTMLElement>(
           '[aria-describedby="tt-long-label-no-space"]')!;
       emitEvent(anchor, 'mouseenter');
       emitEvent(anchor2, 'mouseenter');
       expect(await env.diffElement(
                  'tooltip-long-label', '.test-long-tooltip-label'))
           .toHavePassed();
     });

  it('places tooltip fully inside the viewport even if the anchor is partially off screen',
     async () => {
       // Call showOnly first, to ensure the anchor isn't moved during the
       // diffElement call (this will result in an incorrectly positioned
       // tooltip).
       showOnly('.test-tooltip-offscreen-anchor');

       const anchor = document.querySelector<HTMLElement>(
           '[aria-describedby="offscreen-left"]')!;
       const anchor2 = document.querySelector<HTMLElement>(
           '[aria-describedby="offscreen-right"]')!;
       emitEvent(anchor, 'mouseenter');
       emitEvent(anchor2, 'mouseenter');
       expect(await env.diffElement(
                  'tooltip-offscreen-anchor', '.test-tooltip-offscreen-anchor'))
           .toHavePassed();
     });

  it('plain tooltip hides on page scroll', async () => {
    // Call showOnly first, to ensure the anchor isn't moved during the
    // diffElement call (this will result in an incorrectly positioned tooltip).
    showOnly('.test-tooltip-scroll');

    const anchor = document.querySelector<HTMLElement>(
        '[aria-describedby="tooltip-scroll"]')!;
    emitEvent(anchor, 'mouseenter');
    expect(await env.diffPage('tooltip-before-scroll')).toHavePassed();

    window.scroll(0, 150);
    expect(await env.diffPage('tooltip-after-scroll')).toHavePassed();
  });

  it('renders rich tooltip as initially hidden', async () => {
    expect(await env.diffElement(
               'baseline-rich-tooltip-hidden',
               '.test-baseline-rich-tooltip-hidden'))
        .toHavePassed();
  });

  it('renders rich tooltip', async () => {
    // Call showOnly first, to ensure the anchor isn't moved during the
    // diffElement call (this will result in an incorrectly positioned
    // tooltip).
    showOnly('.test-baseline-rich-tooltip-shown');
    const anchor = document.querySelector<HTMLElement>(
        '[data-tooltip-id="rich-tooltip-shown"]')!;

    emitEvent(anchor, 'mouseenter');

    expect(
        await env.diffElement(
            'baseline-rich-tooltip-shown', '.test-baseline-rich-tooltip-shown'))
        .toHavePassed();
  });

  it('positions rich tooltip based on anchor placement in the viewport when RTL',
     async () => {
       document.documentElement.dir = 'rtl';
       // Call showOnly first, to ensure the anchor isn't moved during the
       // diffElement call (this will result in an incorrectly positioned
       // tooltip).
       showOnly('.test-rich-tooltip-positioning');

       const startAnchor = document.querySelector<HTMLElement>(
           '[data-tooltip-id="rich-tooltip-start"]')!;
       const endAnchor = document.querySelector<HTMLElement>(
           '[data-tooltip-id="rich-tooltip-end"]')!;
       emitEvent(startAnchor, 'mouseenter');
       emitEvent(endAnchor, 'mouseenter');

       expect(await env.diffElement(
                  'rich-tooltip-positioning-rtl',
                  '.test-rich-tooltip-positioning'))
           .toHavePassed();
       document.documentElement.dir = 'ltr';
     });

  it('positions rich tooltip based on anchor placement in the viewport',
     async () => {
       // Call showOnly first, to ensure the anchor isn't moved during the
       // diffElement call (this will result in an incorrectly positioned
       // tooltip).
       showOnly('.test-rich-tooltip-positioning');

       const startAnchor = document.querySelector<HTMLElement>(
           '[data-tooltip-id="rich-tooltip-start"]')!;
       const endAnchor = document.querySelector<HTMLElement>(
           '[data-tooltip-id="rich-tooltip-end"]')!;
       emitEvent(startAnchor, 'mouseenter');
       emitEvent(endAnchor, 'mouseenter');

       expect(await env.diffElement(
                  'rich-tooltip-positioning', '.test-rich-tooltip-positioning'))
           .toHavePassed();
     });

  it('positions rich tooltip based on anchor placement in the viewport (y-axis)',
     async () => {
       // Call showOnly first, to ensure the anchor isn't moved during the
       // diffElement call (this will result in an incorrectly positioned
       // tooltip).
       showOnly('.test-y-rich-tooltip-positioning');

       const startAnchor = document.querySelector<HTMLElement>(
           '[data-tooltip-id="rich-start-y"]')!;
       const endAnchor = document.querySelector<HTMLElement>(
           '[data-tooltip-id="rich-end-y"]')!;
       emitEvent(startAnchor, 'mouseenter');
       emitEvent(endAnchor, 'mouseenter');

       expect(await env.diffElement(
                  'rich-tooltip-positioning-y-axis',
                  '.test-y-rich-tooltip-positioning'))
           .toHavePassed();
     });

  it('places rich tooltip fully inside the viewport even if the anchor is partially off screen',
     async () => {
       // Call showOnly first, to ensure the anchor isn't moved during the
       // diffElement call (this will result in an incorrectly positioned
       // tooltip).
       showOnly('.test-rich-tooltip-offscreen-anchor');

       const anchor = document.querySelector<HTMLElement>(
           '[data-tooltip-id="rich-offscreen-left"]')!;
       const anchor2 = document.querySelector<HTMLElement>(
           '[data-tooltip-id="rich-offscreen-right"]')!;
       emitEvent(anchor, 'mouseenter');
       emitEvent(anchor2, 'mouseenter');
       expect(await env.diffElement(
                  'tooltip-rich-offscreen-anchor',
                  '.test-rich-tooltip-offscreen-anchor'))
           .toHavePassed();
     });

  it('renders persistent rich tooltip', async () => {
    // Call showOnly first, to ensure the anchor isn't moved during the
    // diffElement call (this will result in an incorrectly positioned
    // tooltip).
    showOnly('.test-baseline-rich-tooltip-persistent');
    const anchor = document.querySelector<HTMLElement>(
        '[data-tooltip-id="rich-tooltip-persistent"]')!;
    emitEvent(anchor, 'click');

    expect(await env.diffElement(
               'baseline-rich-tooltip-persistent',
               '.test-baseline-rich-tooltip-persistent'))
        .toHavePassed();
  });

  it('renders rich tooltip with caret, ABOVE_XX alignment', async () => {
    // TODO(b/188001876): Test is very flaky in Firefox. Enable once resolved.
    if (Environment.isFirefox()) return;
    // Call showOnly first, to ensure the anchor isn't moved during the
    // diffElement call (this will result in an incorrectly positioned
    // tooltip).
    showOnly('.test-baseline-rich-tooltip-caret');
    const tooltips = new Map<string, PositionWithCaret>([
      ['rich-tooltip-caret-1', PositionWithCaret.ABOVE_START],
      ['rich-tooltip-caret-2', PositionWithCaret.ABOVE_CENTER],
      ['rich-tooltip-caret-3', PositionWithCaret.ABOVE_END],
    ]);
    const testView = document.querySelector<HTMLElement>(
        '.test-baseline-rich-tooltip-caret')!;
    testView.classList.add('caret-test-above');

    for (const id of tooltips.keys()) {
      const anchor =
          document.querySelector<HTMLElement>(`[data-tooltip-id="${id}"]`)!;
      const pos = tooltips.get(id)!;
      const tooltipComponent = shownTooltips.get(id)!;
      tooltipComponent.setTooltipPosition({withCaretPos: pos});
      emitEvent(anchor, 'click');
    }

    expect(await env.diffElement(
               'top-aligned-rich-tooltip-caret',
               '.test-baseline-rich-tooltip-caret'))
        .toHavePassed();
    testView.classList.remove('caret-test-above');
  });

  it('renders rich tooltip with caret, BELOW_XX alignment', async () => {
    // TODO(b/188001876): Test is very flaky in Firefox. Enable once resolved.
    if (Environment.isFirefox()) return;
    // Call showOnly first, to ensure the anchor isn't moved during the
    // diffElement call (this will result in an incorrectly positioned
    // tooltip).
    showOnly('.test-baseline-rich-tooltip-caret');
    const tooltips = new Map<string, PositionWithCaret>([
      ['rich-tooltip-caret-1', PositionWithCaret.BELOW_START],
      ['rich-tooltip-caret-2', PositionWithCaret.BELOW_CENTER],
      ['rich-tooltip-caret-3', PositionWithCaret.BELOW_END],
    ]);
    const testView = document.querySelector<HTMLElement>(
        '.test-baseline-rich-tooltip-caret')!;
    testView.classList.add('caret-test-below');

    for (const id of tooltips.keys()) {
      const anchor =
          document.querySelector<HTMLElement>(`[data-tooltip-id="${id}"]`)!;
      const pos = tooltips.get(id)!;
      const tooltipComponent = shownTooltips.get(id)!;
      tooltipComponent.setTooltipPosition({withCaretPos: pos});
      emitEvent(anchor, 'click');
    }

    expect(await env.diffElement(
               'bottom-aligned-rich-tooltip-caret',
               '.test-baseline-rich-tooltip-caret'))
        .toHavePassed();
    testView.classList.remove('caret-test-below');
  });

  it('renders rich tooltip with caret, XX_SIDE_START alignment', async () => {
    // TODO(b/188001876): Test is very flaky in Firefox. Enable once resolved.
    if (Environment.isFirefox()) return;
    // Call showOnly first, to ensure the anchor isn't moved during the
    // diffElement call (this will result in an incorrectly positioned
    // tooltip).
    showOnly('.test-baseline-rich-tooltip-caret');
    const tooltips = new Map<string, PositionWithCaret>([
      ['rich-tooltip-caret-1', PositionWithCaret.TOP_SIDE_START],
      ['rich-tooltip-caret-2', PositionWithCaret.CENTER_SIDE_START],
      ['rich-tooltip-caret-3', PositionWithCaret.BOTTOM_SIDE_START],
    ]);
    const testView = document.querySelector<HTMLElement>(
        '.test-baseline-rich-tooltip-caret')!;
    testView.classList.add('caret-test-side-start');

    for (const id of tooltips.keys()) {
      const anchor =
          document.querySelector<HTMLElement>(`[data-tooltip-id="${id}"]`)!;
      const pos = tooltips.get(id)!;
      const tooltipComponent = shownTooltips.get(id)!;
      tooltipComponent.setTooltipPosition({withCaretPos: pos});
      emitEvent(anchor, 'click');
    }

    expect(await env.diffElement(
               'start-aligned-rich-tooltip-caret',
               '.test-baseline-rich-tooltip-caret'))
        .toHavePassed();
    testView.classList.remove('caret-test-side-start');
  });

  it('renders rich tooltip with caret, XX_SIDE_END alignment', async () => {
    // TODO(b/188001876): Test is very flaky in Firefox. Enable once resolved.
    if (Environment.isFirefox()) return;
    // Call showOnly first, to ensure the anchor isn't moved during the
    // diffElement call (this will result in an incorrectly positioned
    // tooltip).
    showOnly('.test-baseline-rich-tooltip-caret');
    const tooltips = new Map<string, PositionWithCaret>([
      ['rich-tooltip-caret-1', PositionWithCaret.TOP_SIDE_END],
      ['rich-tooltip-caret-2', PositionWithCaret.CENTER_SIDE_END],
      ['rich-tooltip-caret-3', PositionWithCaret.BOTTOM_SIDE_END],
    ]);
    const testView = document.querySelector<HTMLElement>(
        '.test-baseline-rich-tooltip-caret')!;
    testView.classList.add('caret-test-side-end');

    for (const id of tooltips.keys()) {
      const anchor =
          document.querySelector<HTMLElement>(`[data-tooltip-id="${id}"]`)!;
      const pos = tooltips.get(id)!;
      const tooltipComponent = shownTooltips.get(id)!;
      tooltipComponent.setTooltipPosition({withCaretPos: pos});
      emitEvent(anchor, 'click');
    }

    expect(await env.diffElement(
               'end-aligned-rich-tooltip-caret',
               '.test-baseline-rich-tooltip-caret'))
        .toHavePassed();
    testView.classList.remove('caret-test-side-end');
  });
});
