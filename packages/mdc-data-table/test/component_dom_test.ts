/** @license Googler-authored internal-only code. */

import 'jasmine';

import {MDCDataTable} from '@material/data-table/component';
import {cssClasses} from '@material/data-table/constants';
import {MDCSelect} from '@material/select/component';
import {customMatchers} from 'google3/testing/karma/karma_scuba_framework';
import {each, Environment} from 'google3/third_party/javascript/material_components_web/testing/screenshot/environment';

jasmine.DEFAULT_TIMEOUT_INTERVAL = 30_000;

describe('MDCDataTable', () => {
  const env = new Environment(module);

  beforeAll(async () => {
    jasmine.addMatchers(customMatchers);

    for (
        const el of each(
            '.test-container .mdc-data-table:not([data-no-initialize="true"])')) {
      MDCDataTable.attachTo(el);
    }
  });

  it('fill color', async () => {
    expect(await env.diffElement('fill_color', '.test-fill-color'))
        .toHavePassed();
  });

  it('density', async () => {
    expect(await env.diffElement('density', '.test-density')).toHavePassed();
  });

  it('baseline checkbox', async () => {
    expect(
        await env.diffElement('baseline_checkbox', '.test-baseline-checkbox'))
        .toHavePassed();
  });

  it('baseline', async () => {
    expect(await env.diffElement('baseline', '.test-baseline')).toHavePassed();
  });

  it('baseline full width', async () => {
    document.body.style.width = '100%';
    expect(await env.diffPage('baseline_full_width', {
      showOnlySelector: '.test-baseline-full-width'
    })).toHavePassed();
    document.body.style.width = '';
  });

  it('baseline with buttons', async () => {
    expect(await env.diffElement(
               'baseline_with_buttons', '.test-baseline-with-buttons'))
        .toHavePassed();
  });

  it('column sorting in idle state', async () => {
    expect(await env.diffElement(
               'column_sorting_idle', '.test-column-sorting-idle'))
        .toHavePassed();
  });

  it('column sorting with sorted column', async () => {
    expect(await env.diffElement(
               'column_sorting_sorted', '.test-column-sorting-sorted'))
        .toHavePassed();
  });

  it('column sorting with sorted numeric column', async () => {
    expect(await env.diffElement(
               'column_sorting_sorted_numeric',
               '.test-column-sorting-sorted-numeric'))
        .toHavePassed();
  });

  it('column sorting with sorted column in descending order', async () => {
    expect(await env.diffElement(
               'column_sorting_sorted_descending',
               '.test-column-sorting-sorted-descending'))
        .toHavePassed();
  });

  it('in progress', async () => {
    const el = document.querySelector<HTMLElement>(
        '#test-data-table-in-progress-table');
    if (!el) {
      throw new Error('Data table element not found.');
    }
    const dataTable = MDCDataTable.attachTo(el);
    dataTable.showProgress();

    expect(await env.diffElement('in_progress', '.test-in-progress'))
        .toHavePassed();
  });

  it('pagination', async () => {
    const testClassName = 'test-pagination';
    initializeSelectByTestClassName(testClassName);

    expect(await env.diffElement('pagination', `.${testClassName}`))
        .toHavePassed();
  });

  it('sticky header', async () => {
    const tableContainer = document.querySelector<HTMLElement>(
        '[data-test-sticky-header-table-container]');
    if (tableContainer) {
      tableContainer.scrollTop = 180;
    }

    expect(await env.diffElement('sticky_header', '.test-sticky-header'))
        .toHavePassed();
  });

  it('theme', async () => {
    expect(await env.diffElement('theme', '.test-theme')).toHavePassed();
  });
});

/**
 * Initializes MDCSelect component by test class name.
 * @return Returns MDCSelect instance for given test selector.
 */
function initializeSelectByTestClassName(className: string): MDCSelect {
  const el = document.querySelector<HTMLElement>(
      `.${className} .${cssClasses.PAGINATION_ROWS_PER_PAGE_SELECT}`);

  if (!el) {
    throw new Error('Select element not found');
  }

  return MDCSelect.attachTo(el);
}
