/** @license Googler-authored internal-only code. */

import 'jasmine';

import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {each, Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

import {MDCSlider} from '../component';
import {cssClasses} from '../constants';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCSlider', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);
  });

  afterEach(async () => {
    // Reset focus
    for (const el of each(`.test-container .mdc-slider .${cssClasses.INPUT}`)) {
      el.blur();
    }
    // This seems to be needed to remove ie11 flakiness.
    document.body.focus();

    // Reset to LTR.
    for (const el of each('.test-container')) {
      el.removeAttribute('dir');
    }
  });

  it('baseline_continuous', async () => {
    // Arrange
    attachComponent('.test-baseline_continuous');

    // Assert
    expect(await env.diffElement(
               'baseline_continuous', '.test-baseline_continuous'))
        .toHavePassed();
  });

  it('baseline_discrete', async () => {
    // Arrange
    attachComponent('.test-baseline_discrete');

    // Assert
    expect(
        await env.diffElement('baseline_discrete', '.test-baseline_discrete'))
        .toHavePassed();
  });

  it('baseline_discrete_value_indicator', async () => {
    // Arrange
    const {input} = attachComponent('.test-baseline_discrete');

    // Act
    input.focus();

    // Assert
    expect(await env.diffElement(
               'baseline_discrete_value_indicator', '.test-baseline_discrete'))
        .toHavePassed();
  });

  it('baseline_discrete_long_value_indicator', async () => {
    // Arrange
    const {input} =
        attachComponent('.test-baseline_discrete_long_value_indicator');

    // Act
    input.focus();

    // Assert
    expect(await env.diffElement(
               'baseline_discrete_long_value_indicator',
               '.test-baseline_discrete_long_value_indicator'))
        .toHavePassed();
  });

  it('baseline_discrete_long_value_indicator_min', async () => {
    // Arrange
    const {input} =
        attachComponent('.test-baseline_discrete_long_value_indicator_min');

    // Act
    input.focus();

    // Assert
    expect(await env.diffElement(
               'baseline_discrete_long_value_indicator_min',
               '.test-baseline_discrete_long_value_indicator_min'))
        .toHavePassed();
  });

  it('baseline_discrete_long_value_indicator_max', async () => {
    // Arrange
    const {input} =
        attachComponent('.test-baseline_discrete_long_value_indicator_max');

    // Act
    input.focus();

    // Assert
    expect(await env.diffElement(
               'baseline_discrete_long_value_indicator_max',
               '.test-baseline_discrete_long_value_indicator_max'))
        .toHavePassed();
  });

  it('baseline_range_continuous', async () => {
    // Arrange
    attachComponent('.test-baseline_range_continuous');

    // Assert
    expect(await env.diffElement(
               'baseline_range_continuous', '.test-baseline_range_continuous'))
        .toHavePassed();
  });

  it('baseline_range_discrete', async () => {
    // Arrange
    attachComponent('.test-baseline_range_discrete');

    // Assert
    expect(await env.diffElement(
               'baseline_range_discrete', '.test-baseline_range_discrete'))
        .toHavePassed();
  });

  it('baseline_range_overlapping_thumbs', async () => {
    // Arrange
    attachComponent('.test-baseline_range_overlapping_thumbs');

    // Assert
    expect(await env.diffElement(
               'baseline_range_overlapping_thumbs',
               '.test-baseline_range_overlapping_thumbs'))
        .toHavePassed();
  });

  it('disabled_discrete', async () => {
    // Arrange
    attachComponent('.test-disabled_discrete');

    // Assert
    expect(
        await env.diffElement('disabled_discrete', '.test-disabled_discrete'))
        .toHavePassed();
  });

  it('rtl_discrete', async () => {
    // Arrange
    const {root, component} = attachComponent('.test-baseline_discrete');
    root.setAttribute('dir', 'rtl');
    component.layout();

    // Assert
    expect(await env.diffElement('rtl_discrete', '.test-baseline_discrete'))
        .toHavePassed();
  });

  it('rtl_range_discrete', async () => {
    // Arrange
    const {root, component} = attachComponent('.test-baseline_range_discrete');
    root.setAttribute('dir', 'rtl');
    component.layout();

    // Assert
    expect(await env.diffElement(
               'rtl_range_discrete', '.test-baseline_range_discrete'))
        .toHavePassed();
  });

  /**
   * Attach the MDCSlider component to the element found at the provided
   * selector. This also returns the HTMLElement and the input element.
   */
  function attachComponent(selector: string) {
    const root = document.querySelector<HTMLElement>(selector)!;
    const componentElement = root.querySelector<HTMLElement>('.mdc-slider')!;
    const component = MDCSlider.attachTo(componentElement);
    const input = root.querySelector<HTMLElement>(`.${cssClasses.INPUT}`)!;

    return {root, input, component};
  }
});
