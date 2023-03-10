/** @license Googler-authored internal-only code. */

import 'jasmine';

import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {each, Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

import {MDCList} from '../component';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCList', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);

    for (
        const el of each(
            '.test-container .mdc-deprecated-list, .test-container .mdc-list')) {
      MDCList.attachTo(el);
    }
  });

  describe('legacy', () => {
    it('disabled radio', async () => {
      expect(await env.diffElement('disabled_radio', '.test-disabled-radio'))
          .toHavePassed();
    });

    it('disabled items', async () => {
      expect(await env.diffElement('disabled_items', '.test-disabled-items'))
          .toHavePassed();
    });

    it('meta text', async () => {
      expect(await env.diffElement('meta_text', '.test-meta-text'))
          .toHavePassed();
    });

    it('checkbox', async () => {
      expect(await env.diffElement('checkbox', '.test-checkbox'))
          .toHavePassed();
    });

    it('selected', async () => {
      expect(await env.diffElement('selected', '.test-selected'))
          .toHavePassed();
    });

    it('disabled checkbox', async () => {
      expect(
          await env.diffElement('disabled_checkbox', '.test-disabled-checkbox'))
          .toHavePassed();
    });

    it('two line', async () => {
      expect(await env.diffElement('two_line', '.test-two-line'))
          .toHavePassed();
    });

    it('baseline', async () => {
      expect(await env.diffElement('baseline', '.test-baseline'))
          .toHavePassed();
    });

    it('list group', async () => {
      expect(await env.diffElement('list_group', '.test-list-group'))
          .toHavePassed();
    });

    it('radio', async () => {
      expect(await env.diffElement('radio', '.test-radio')).toHavePassed();
    });

    it('density', async () => {
      expect(await env.diffElement('density', '.test-density')).toHavePassed();
    });

    it('shape single line', async () => {
      expect(
          await env.diffElement('shape_single_line', '.test-shape-single-line'))
          .toHavePassed();
    });

    it('density checkbox', async () => {
      expect(
          await env.diffElement('density_checkbox', '.test-density-checkbox'))
          .toHavePassed();
    });

    it('selected item text color', async () => {
      expect(await env.diffElement(
                 'selected_item_text_color', '.test-selected-item-text-color'))
          .toHavePassed();
    });
  });

  describe('evolution', () => {
    it('one line variants', async () => {
      expect(await env.diffElement(
                 'evolution_one_line_variants',
                 '.test-evolution-one-line-variants'))
          .toHavePassed();
    });

    it('one line meta variants', async () => {
      expect(await env.diffElement(
                 'evolution_one_line_meta_variants',
                 '.test-evolution-one-line-meta-variants'))
          .toHavePassed();
    });

    it('two line meta variants', async () => {
      expect(await env.diffElement(
                 'evolution_two_line_meta_variants',
                 '.test-evolution-two-line-meta-variants'))
          .toHavePassed();
    });

    it('three line meta variants', async () => {
      expect(await env.diffElement(
                 'evolution_three_line_meta_variants',
                 '.test-evolution-three-line-meta-variants'))
          .toHavePassed();
    });

    it('one line icon variants', async () => {
      expect(await env.diffElement(
                 'evolution_one_line_icon_variants',
                 '.test-evolution-one-line-icon-variants'))
          .toHavePassed();
    });

    it('two line icon variants', async () => {
      expect(await env.diffElement(
                 'evolution_two_line_icon_variants',
                 '.test-evolution-two-line-icon-variants'))
          .toHavePassed();
    });

    it('three line icon variants', async () => {
      expect(await env.diffElement(
                 'evolution_three_line_icon_variants',
                 '.test-evolution-three-line-icon-variants'))
          .toHavePassed();
    });

    it('one line radio variants', async () => {
      expect(await env.diffElement(
                 'evolution_one_line_radio_variants',
                 '.test-evolution-one-line-radio-variants'))
          .toHavePassed();
    });

    it('two line radio variants', async () => {
      expect(await env.diffElement(
                 'evolution_two_line_radio_variants',
                 '.test-evolution-two-line-radio-variants'))
          .toHavePassed();
    });

    it('three line radio variants', async () => {
      expect(await env.diffElement(
                 'evolution_three_line_radio_variants',
                 '.test-evolution-three-line-radio-variants'))
          .toHavePassed();
    });

    it('one line checkbox variants', async () => {
      expect(await env.diffElement(
                 'evolution_one_line_checkbox_variants',
                 '.test-evolution-one-line-checkbox-variants'))
          .toHavePassed();
    });

    it('two line checkbox variants', async () => {
      expect(await env.diffElement(
                 'evolution_two_line_checkbox_variants',
                 '.test-evolution-two-line-checkbox-variants'))
          .toHavePassed();
    });

    it('three line checkbox variants', async () => {
      expect(await env.diffElement(
                 'evolution_three_line_checkbox_variants',
                 '.test-evolution-three-line-checkbox-variants'))
          .toHavePassed();
    });

    it('disabled option', async () => {
      expect(
          await env.diffElement(
              'evolution_disabled_option', '.test-evolution-disabled-option'))
          .toHavePassed();
    });

    it('selected option', async () => {
      expect(
          await env.diffElement(
              'evolution_selected_option', '.test-evolution-selected-option'))
          .toHavePassed();
    });

    it('disabled radio', async () => {
      expect(await env.diffElement(
                 'evolution_disabled_radio', '.test-evolution-disabled-radio'))
          .toHavePassed();
    });

    it('selected radio', async () => {
      expect(await env.diffElement(
                 'evolution_selected_radio', '.test-evolution-selected-radio'))
          .toHavePassed();
    });

    it('disabled checkbox', async () => {
      expect(await env.diffElement(
                 'evolution_disabled_checkbox',
                 '.test-evolution-disabled-checkbox'))
          .toHavePassed();
    });

    it('selected checkbox', async () => {
      expect(await env.diffElement(
                 'evolution_selected_checkbox',
                 '.test-evolution-selected-checkbox'))
          .toHavePassed();
    });

    it('dividers', async () => {
      expect(await env.diffElement(
                 'evolution_dividers', '.test-evolution-dividers'))
          .toHavePassed();
    });

    it('one line density', async () => {
      expect(
          await env.diffElement(
              'evolution_one_line_density', '.test-evolution-one-line-density'))
          .toHavePassed();
    });

    it('two line density', async () => {
      expect(
          await env.diffElement(
              'evolution_two_line_density', '.test-evolution-two-line-density'))
          .toHavePassed();
    });

    it('three line density', async () => {
      expect(await env.diffElement(
                 'evolution_three_line_density',
                 '.test-evolution-three-line-density'))
          .toHavePassed();
    });
  });
});
