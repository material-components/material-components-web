/** @license Googler-authored internal-only code. */

import 'jasmine';

import {MDCDialog} from '@material/dialog/component';
import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {each, Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCDialog', () => {
  const env = new Environment(module);
  const frameElement = window.frameElement as HTMLElement;

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);

    for (const el of each('.test-container .mdc-dialog')) {
      const dialog = new MDCDialog(el);
      dialog.layout();
    }

    await requestAnimationFrameInLayout();
  });

  afterEach(() => {
    if (frameElement) {
      frameElement.style.removeProperty('width');
      frameElement.style.removeProperty('height');
    }
  });

  it('scroll divider color', async () => {
    expect(await env.diffElement(
               'scroll_divider_color', '.test-scroll-divider-color'))
        .toHavePassed();
  });

  it('scrim color', async () => {
    expect(await env.diffElement('scrim_color', '.test-scrim-color'))
        .toHavePassed();
  });

  it('container fill color', async () => {
    expect(await env.diffElement(
               'container_fill_color', '.test-container-fill-color'))
        .toHavePassed();
  });

  it('max height', async () => {
    expect(await env.diffElement('max_height', '.test-max-height'))
        .toHavePassed();
  });

  it('max height with content header and footer', async () => {
    expect(await env.diffElement(
               'max_height_with_content_header_and_footer',
               '.test-max-height-with-content-header-and-footer'))
        .toHavePassed();
  });

  it('min width', async () => {
    expect(await env.diffElement('min_width', '.test-min-width'))
        .toHavePassed();
  });

  it('max width', async () => {
    expect(await env.diffElement('max_width', '.test-max-width'))
        .toHavePassed();
  });

  it('content ink color', async () => {
    expect(
        await env.diffElement('content_ink_color', '.test-content-ink-color'))
        .toHavePassed();
  });

  it('title ink color', async () => {
    expect(await env.diffElement('title_ink_color', '.test-title-ink-color'))
        .toHavePassed();
  });

  it('shape radius', async () => {
    expect(await env.diffElement('shape_radius', '.test-shape-radius'))
        .toHavePassed();
  });

  it('3717', async () => {
    expect(await env.diffElement('3717', '.test-3717')).toHavePassed();
  });

  it('baseline simple', async () => {
    expect(await env.diffElement('baseline_simple', '.test-baseline-simple'))
        .toHavePassed();
  });

  it('baseline floating sheet', async () => {
    expect(await env.diffElement(
               'baseline_floating_sheet', '.test-baseline-floating-sheet'))
        .toHavePassed();
  });

  it('baseline floating sheet with title', async () => {
    expect(await env.diffElement(
               'baseline_floating_sheet_with_title',
               '.test-baseline-floating-sheet-with-title'))
        .toHavePassed();
  });

  it('overflow accessible font size', async () => {
    expect(await env.diffElement(
               'overflow_accessible_font_size',
               '.test-overflow-accessible-font-size'))
        .toHavePassed();
  });

  it('overflow top', async () => {
    expect(await env.diffElement('overflow_top', '.test-overflow-top'))
        .toHavePassed();
  });

  it('baseline alert above drawer', async () => {
    expect(
        await env.diffElement(
            'baseline_alert_above_drawer', '.test-baseline-alert-above-drawer'))
        .toHavePassed();
  });

  it('baseline alert', async () => {
    expect(await env.diffElement('baseline_alert', '.test-baseline-alert'))
        .toHavePassed();
  });

  it('baseline confirmation', async () => {
    expect(await env.diffElement(
               'baseline_confirmation', '.test-baseline-confirmation'))
        .toHavePassed();
  });

  it('baseline alert with title', async () => {
    expect(await env.diffElement(
               'baseline_alert_with_title', '.test-baseline-alert-with-title'))
        .toHavePassed();
  });

  it('manual window resize', async () => {
    expect(await env.diffElement(
               'manual_window_resize', '.test-manual-window-resize'))
        .toHavePassed();
  });

  it('overflow bottom', async () => {
    expect(await env.diffElement('overflow_bottom', '.test-overflow-bottom'))
        .toHavePassed();
  });

  it('fullscreen on mobile screen sizes', async () => {
    frameElement.style.width = '411px';
    frameElement.style.height = '731px';
    expect(await env.diffElement(
               'mobile_fullscreen_dialog', '.test-full-screen-dialog'))
        .toHavePassed();
  });

  it('modal on desktop screens', async () => {
    expect(await env.diffElement(
               'desktop_fullscreen_dialog', '.test-full-screen-dialog'))
        .toHavePassed();
  });

  it('position top left', async () => {
    expect(
        await env.diffElement('position_top_left', '.test--position-top-left'))
        .toHavePassed();
  });

  it('position bottom right', async () => {
    expect(await env.diffElement(
               'position_bottom_right', '.test--position-bottom-right'))
        .toHavePassed();
  });

  it('custom z index', async () => {
    expect(await env.diffElement('custom_z_index', '.test--custom-z-index'))
        .toHavePassed();
  });

  it('scroll divider on fullscreen dialog', async () => {
    // We re-initialize this dialog in order to call `layout` after scrolling
    // the content (to show the header scroll divider).
    const fsScrollableClass = '.test-scrollable-full-screen-dialog';
    const scrollableDialog = document.querySelector<HTMLElement>(
        `${fsScrollableClass} .mdc-dialog`)!;
    const dialog = new MDCDialog(scrollableDialog);

    const content = scrollableDialog.querySelector('.mdc-dialog__content');
    expect(content).toBeTruthy();
    content!.scrollTop = 20;
    dialog.layout();

    await requestAnimationFrameInLayout();

    expect(
        await env.diffElement(
            'scroll_fullscreen_dialog', '.test-scrollable-full-screen-dialog'))
        .toHavePassed();
  });

  it('hide modal header in fullscreen dialog', async () => {
    expect(await env.diffElement(
               'desktop_fullscreen_dialog_no_header',
               '.test-full-screen-dialog-hide-modal-header'))
        .toHavePassed();
  });

  it('persists fullscreen header in fullscreen dialog', async () => {
    frameElement.style.width = '411px';
    frameElement.style.height = '731px';
    expect(await env.diffElement(
               'mobile_fullscreen_dialog_header',
               '.test-full-screen-dialog-hide-modal-header'))
        .toHavePassed();
  });
});

// For waiting until requestAnimationFrame() in layout() is complete.
function requestAnimationFrameInLayout() {
  return new Promise<void>(resolve => {
    setTimeout(() => {
      resolve();
    }, 150);
  });
}
