/** @license Googler-authored internal-only code. */

import 'jasmine';

import {MDCTextField} from '@material/textfield/component';
import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {each, Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCTextfield', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);

    for (const el of each('.test-container .mdc-text-field')) {
      const textField = MDCTextField.attachTo(el);
      if (el.getAttribute('data-native-input-validation') === 'false') {
        textField.useNativeValidation = false;
        textField.valid = false;
      }

      el.querySelector<HTMLInputElement>(
            '.mdc-text-field__input')!.addEventListener('blur', () => {
        // Focusing out from empty text field input shouldn't trigger shake
        // animation.
        textField.valid = false;
      });
    }

    for (const el of each('.mdc-text-field__input[value=" "]')) {
      (el as HTMLInputElement).value = '';
    }
  });

  it('4170', async () => {
    expect(await env.diffElement('4170', '.test-4170')).toHavePassed();
  });

  it('3332', async () => {
    expect(await env.diffElement('3332', '.test-3332')).toHavePassed();
  });

  it('invalid focused helper text', async () => {
    expect(
        await env.diffElement(
            'invalid_focused_helper_text', '.test-invalid-focused-helper-text'),
        )
        .toHavePassed();
  });

  it('baseline without label', async () => {
    expect(await env.diffElement(
               'baseline_without_label', '.test-baseline-without-label'))
        .toHavePassed();
  });

  it('baseline placeholder', async () => {
    expect(
        await env.diffElement(
            'baseline_placeholder', '.test-baseline-placeholder'),
        )
        .toHavePassed();
  });

  it('invalid', async () => {
    expect(await env.diffElement('invalid', '.test-invalid')).toHavePassed();
  });

  it('baseline character counter', async () => {
    expect(
        await env.diffElement(
            'baseline_character_counter', '.test-baseline-character-counter'))
        .toHavePassed();
  });

  it('focused helper text validation msg', async () => {
    expect(await env.diffElement(
               'focused_helper_text_validation_msg',
               '.test-focused-helper-text-validation-msg'))
        .toHavePassed();
  });

  it('baseline leading trailing icons', async () => {
    expect(await env.diffElement(
               'baseline_leading_trailing_icons',
               '.test-baseline-leading-trailing-icons'))
        .toHavePassed();
  });

  it('disabled helper text', async () => {
    expect(await env.diffElement(
               'disabled_helper_text', '.test-disabled-helper-text'))
        .toHavePassed();
  });

  it('focused leading icon', async () => {
    expect(await env.diffElement(
               'focused_leading_icon', '.test-focused-leading-icon'))
        .toHavePassed();
  });

  it('focused helper text persistent validation msg', async () => {
    expect(await env.diffElement(
               'focused_helper_text_persistent_validation_msg',
               '.test-focused-helper-text-persistent-validation-msg'))
        .toHavePassed();
  });

  it('invalid leading trailing icons', async () => {
    expect(await env.diffElement(
               'invalid_leading_trailing_icons',
               '.test-invalid-leading-trailing-icons'))
        .toHavePassed();
  });

  it('disabled leading icon', async () => {
    expect(await env.diffElement(
               'disabled_leading_icon', '.test-disabled-leading-icon'))
        .toHavePassed();
  });

  it('disabled helper text persistent', async () => {
    expect(await env.diffElement(
               'disabled_helper_text_persistent',
               '.test-disabled-helper-text-persistent'))
        .toHavePassed();
  });

  it('textarea without label', async () => {
    expect(await env.diffElement(
               'textarea_without_label',
               '.test-textarea-without-label',
               ))
        .toHavePassed();
  });

  it('focused trailing icon', async () => {
    expect(await env.diffElement(
               'focused_trailing_icon', '.test-focused-trailing-icon'))
        .toHavePassed();
  });

  it('focused placeholder', async () => {
    expect(await env.diffElement(
               'focused_placeholder', '.test-focused-placeholder'))
        .toHavePassed();
  });

  it('textarea invalid', async () => {
    expect(await env.diffElement('textarea_invalid', '.test-textarea-invalid'))
        .toHavePassed();
  });

  it('disabled placeholder', async () => {
    expect(await env.diffElement(
               'disabled_placeholder', '.test-disabled-placeholder'))
        .toHavePassed();
  });

  it('invalid helper text persistent', async () => {
    expect(await env.diffElement(
               'invalid_helper_text_persistent',
               '.test-invalid-helper-text-persistent'))
        .toHavePassed();
  });

  it('focused', async () => {
    expect(await env.diffElement('focused', '.test-focused')).toHavePassed();
  });

  it('baseline helper text persistent character counter', async () => {
    expect(await env.diffElement(
               'baseline_helper_text_persistent_character_counter',
               '.test-baseline-helper-text-persistent-character-counter'))
        .toHavePassed();
  });

  it('invalid focused', async () => {
    expect(await env.diffElement('invalid_focused', '.test-invalid-focused'))
        .toHavePassed();
  });

  it('invalid focused leading trailing icons', async () => {
    expect(await env.diffElement(
               'invalid_focused_leading_trailing_icons',
               '.test-invalid-focused-leading-trailing-icons'))
        .toHavePassed();
  });

  it('invalid disabled', async () => {
    expect(await env.diffElement('invalid_disabled', '.test-invalid-disabled'))
        .toHavePassed();
  });

  it('baseline no js', async () => {
    expect(await env.diffElement('baseline_no_js', '.test-baseline-no-js'))
        .toHavePassed();
  });

  it('disabled character counter', async () => {
    expect(
        await env.diffElement(
            'disabled_character_counter', '.test-disabled-character-counter'))
        .toHavePassed();
  });

  it('disabled leading trailing icons', async () => {
    expect(await env.diffElement(
               'disabled_leading_trailing_icons',
               '.test-disabled-leading-trailing-icons'))
        .toHavePassed();
  });

  it('baseline helper text persistent', async () => {
    expect(await env.diffElement(
               'baseline_helper_text_persistent',
               '.test-baseline-helper-text-persistent'))
        .toHavePassed();
  });

  it('focused helper text persistent', async () => {
    expect(await env.diffElement(
               'focused_helper_text_persistent',
               '.test-focused-helper-text-persistent'))
        .toHavePassed();
  });

  it('disabled helper text validation msg', async () => {
    expect(await env.diffElement(
               'disabled_helper_text_validation_msg',
               '.test-disabled-helper-text-validation-msg'))
        .toHavePassed();
  });

  it('invalid helper text persistent validation msg', async () => {
    expect(await env.diffElement(
               'invalid_helper_text_persistent_validation_msg',
               '.test-invalid-helper-text-persistent-validation-msg'))
        .toHavePassed();
  });

  it('textarea disabled', async () => {
    expect(
        await env.diffElement('textarea_disabled', '.test-textarea-disabled'))
        .toHavePassed();
  });

  it('invalid focused helper text persistent', async () => {
    expect(await env.diffElement(
               'invalid_focused_helper_text_persistent',
               '.test-invalid-focused-helper-text-persistent'))
        .toHavePassed();
  });

  it('textarea focused', async () => {
    expect(await env.diffElement('textarea_focused', '.test-textarea-focused'))
        .toHavePassed();
  });

  it('baseline helper text validation msg', async () => {
    expect(await env.diffElement(
               'baseline_helper_text_validation_msg',
               '.test-baseline-helper-text-validation-msg'))
        .toHavePassed();
  });

  it('baseline', async () => {
    expect(await env.diffElement('baseline', '.test-baseline')).toHavePassed();
  });

  it('invalid focused leading icon', async () => {
    expect(await env.diffElement(
               'invalid_focused_leading_icon',
               '.test-invalid-focused-leading-icon'))
        .toHavePassed();
  });

  it('disabled', async () => {
    expect(await env.diffElement('disabled', '.test-disabled')).toHavePassed();
  });

  it('baseline trailing icon', async () => {
    expect(await env.diffElement(
               'baseline_trailing_icon', '.test-baseline-trailing-icon'))
        .toHavePassed();
  });

  it('invalid helper text', async () => {
    expect(await env.diffElement(
               'invalid_helper_text', '.test-invalid-helper-text'))
        .toHavePassed();
  });

  it('invalid focused helper text persistent validation msg', async () => {
    expect(await env.diffElement(
               'invalid_focused_helper_text_persistent_validation_msg',
               '.test-invalid-focused-helper-text-persistent-validation-msg'))
        .toHavePassed();
  });

  it('invalid focused helper text validation msg', async () => {
    expect(await env.diffElement(
               'invalid_focused_helper_text_validation_msg',
               '.test-invalid-focused-helper-text-validation-msg'))
        .toHavePassed();
  });

  it('baseline leading icon', async () => {
    expect(await env.diffElement(
               'baseline_leading_icon', '.test-baseline-leading-icon'))
        .toHavePassed();
  });

  it('textarea end aligned', async () => {
    expect(await env.diffElement(
               'textarea_end_aligned', '.test-textarea-end-aligned'))
        .toHavePassed();
  });

  it('baseline helper text persistent validation msg', async () => {
    expect(await env.diffElement(
               'baseline_helper_text_persistent_validation_msg',
               '.test-baseline-helper-text-persistent-validation-msg'))
        .toHavePassed();
  });

  it('invalid focused helper text persistent validation msg character counter',
     async () => {
       expect(
           await env.diffElement(
               'invalid_focused_helper_text_persistent_validation_msg_character_counter',
               '.test-invalid-focused-helper-text-persistent-validation-msg-character-counter'))
           .toHavePassed();
     });

  it('textarea', async () => {
    expect(await env.diffElement('textarea', '.test-textarea')).toHavePassed();
  });

  it('baseline helper text', async () => {
    expect(await env.diffElement(
               'baseline_helper_text', '.test-baseline-helper-text'))
        .toHavePassed();
  });

  it('baseline end aligned', async () => {
    expect(await env.diffElement(
               'baseline_end_aligned', '.test-baseline-end-aligned'))
        .toHavePassed();
  });

  it('focused helper text', async () => {
    expect(await env.diffElement(
               'focused_helper_text', '.test-focused-helper-text'))
        .toHavePassed();
  });

  it('baseline without label with icon', async () => {
    expect(await env.diffElement(
               'baseline_without_label_with_icon',
               '.test-baseline-without-label-with-icon'))
        .toHavePassed();
  });

  it('focused leading trailing icons', async () => {
    expect(await env.diffElement(
               'focused_leading_trailing_icons',
               '.test-focused-leading-trailing-icons'))
        .toHavePassed();
  });

  it('invalid focused trailing icon', async () => {
    expect(await env.diffElement(
               'invalid_focused_trailing_icon',
               '.test-invalid-focused-trailing-icon'))
        .toHavePassed();
  });

  it('textarea character counter', async () => {
    expect(
        await env.diffElement(
            'textarea_character_counter', '.test-textarea-character-counter'))
        .toHavePassed();
  });

  it('invalid trailing icon', async () => {
    expect(await env.diffElement(
               'invalid_trailing_icon', '.test-invalid-trailing-icon'))
        .toHavePassed();
  });

  it('disabled helper text persistent validation msg', async () => {
    expect(await env.diffElement(
               'disabled_helper_text_persistent_validation_msg',
               '.test-disabled-helper-text-persistent-validation-msg'))
        .toHavePassed();
  });

  it('invalid leading icon', async () => {
    expect(await env.diffElement(
               'invalid_leading_icon', '.test-invalid-leading-icon'))
        .toHavePassed();
  });

  it('invalid helper text validation msg', async () => {
    expect(await env.diffElement(
               'invalid_helper_text_validation_msg',
               '.test-invalid-helper-text-validation-msg'))
        .toHavePassed();
  });

  it('disabled trailing icon', async () => {
    expect(await env.diffElement(
               'disabled_trailing_icon', '.test-disabled-trailing-icon'))
        .toHavePassed();
  });

  it('disabled 2', async () => {
    expect(await env.diffElement('disabled_2', '.test-disabled-2'))
        .toHavePassed();
  });

  it('outline shape radius', async () => {
    expect(await env.diffElement(
               'outline_shape_radius', '.test-outline-shape-radius'))
        .toHavePassed();
  });

  it('density leading icon invalid', async () => {
    expect(await env.diffElement(
               'density_leading_icon_invalid',
               '.test-density-leading-icon-invalid'))
        .toHavePassed();
  });

  it('density leading icon', async () => {
    expect(await env.diffElement(
               'density_leading_icon', '.test-density-leading-icon'))
        .toHavePassed();
  });

  it('disabled 1', async () => {
    expect(await env.diffElement('disabled_1', '.test-disabled-1'))
        .toHavePassed();
  });

  it('density', async () => {
    expect(await env.diffElement('density', '.test-density')).toHavePassed();
  });

  it('density invalid', async () => {
    expect(await env.diffElement('density_invalid', '.test-density-invalid'))
        .toHavePassed();
  });

  it('baseline calculation', async () => {
    expect(await env.diffElement(
               'baseline_caluclation', '.test-baseline-calculation'))
        .toHavePassed();
  });

  it('prefix and suffix', async () => {
    expect(await env.diffElement('prefix_suffix', '.test-prefix-suffix'))
        .toHavePassed();
  });
});
