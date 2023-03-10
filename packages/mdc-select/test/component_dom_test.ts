/** @license Googler-authored internal-only code. */

import 'jasmine';

import {MDCSelect} from '@material/select/component';
import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {each, Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCSelect', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);

    for (const el of each('.mdc-select')) {
      const select = new MDCSelect(el);
      select.layout();
    }
  });

  it('ink color', async () => {
    expect(await env.diffElement('ink_color', '.test-ink-color'))
        .toHavePassed();
  });

  it('container fill color', async () => {
    expect(await env.diffElement(
               'container_fill_color', '.test-container-fill-color'))
        .toHavePassed();
  });

  it('outline color', async () => {
    expect(await env.diffElement('outline_color', '.test-outline-color'))
        .toHavePassed();
  });

  it('label color', async () => {
    expect(await env.diffElement('label_color', '.test-label-color'))
        .toHavePassed();
  });

  it('bottom line color', async () => {
    expect(
        await env.diffElement('bottom_line_color', '.test-bottom-line-color'))
        .toHavePassed();
  });

  it('shape radius', async () => {
    expect(await env.diffElement('shape_radius', '.test-shape-radius'))
        .toHavePassed();
  });

  it('disabled', async () => {
    expect(await env.diffElement('disabled', '.test-disabled')).toHavePassed();
  });

  it('helper text', async () => {
    expect(await env.diffElement('helper_text', '.test-helper-text'))
        .toHavePassed();
  });

  it('helper text validation msg', async () => {
    expect(
        await env.diffElement(
            'helper_text_validation_msg', '.test-helper-text-validation-msg'))
        .toHavePassed();
  });

  it('helper text validation msg persistent', async () => {
    expect(await env.diffElement(
               'helper_text_validation_msg_persistent',
               '.test-helper-text-validation-msg-persistent'))
        .toHavePassed();
  });

  it('leading icon', async () => {
    expect(await env.diffElement('leading_icon', '.test-leading-icon'))
        .toHavePassed();
  });

  it('invalid', async () => {
    expect(await env.diffElement('invalid', '.test-invalid')).toHavePassed();
  });

  it('leading icon svg', async () => {
    expect(await env.diffElement('leading_icon_svg', '.test-leading-icon-svg'))
        .toHavePassed();
  });

  it('invalid helper text', async () => {
    expect(await env.diffElement(
               'invalid_helper_text', '.test-invalid-helper-text'))
        .toHavePassed();
  });

  it('invalid helper text validation msg', async () => {
    expect(await env.diffElement(
               'invalid_helper_text_validation_msg',
               '.test-invalid-helper-text-validation-msg'))
        .toHavePassed();
  });

  it('baseline', async () => {
    expect(await env.diffElement('baseline', '.test-baseline')).toHavePassed();
  });

  it('no label', async () => {
    expect(await env.diffElement('no_label', '.test-no-label')).toHavePassed();
  });

  it('leading icon no label', async () => {
    expect(await env.diffElement(
               'leading_icon_no_label', '.test-leading-icon-no-label'))
        .toHavePassed();
  });

  it('density', async () => {
    expect(await env.diffElement('density', '.test-density')).toHavePassed();
  });


  it('leading icon density', async () => {
    expect(await env.diffElement(
               'density_leading_icon', '.test-density-leading-icon'))
        .toHavePassed();
  });
});
