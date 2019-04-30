/**
 * @license
 * Copyright 2019 Google Inc.
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

import {assert} from 'chai';
import {html, render} from 'lit-html';
import domEvents from 'dom-events';
import td from 'testdouble';
import {install as installClock} from '../helpers/clock';
import {strings, cssClasses} from '../../../packages/mdc-data-table/constants';
import {MDCDataTable, MDCDataTableFoundation, util} from '../../../packages/mdc-data-table/index';
import {supportsCssVariables} from '../../../packages/mdc-ripple/util';


const mdcCheckboxTemplate = (props) => {
  return html`<div class="mdc-checkbox ${props.classNames}">
  <input type="checkbox" class="mdc-checkbox__native-control" ${props.isChecked ? 'checked' : ''} />
  <div class="mdc-checkbox__background">
    <svg class="mdc-checkbox__checkmark" viewbox="0 0 24 24">
      <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59" />
    </svg>
    <div class="mdc-checkbox__mixedmark"></div>
  </div>
</div>`;
};

const mdcDataTableHeaderCellTemplate = (props) => {
  return html`<th class="mdc-data-table__header-cell" role="columnheader" scope="col">${props.content}</th>`;
};

const mdcDataTableCellTemplate = (props) => {
  const classNames = props.isNumeric ? cssClasses.CELL_NUMERIC : '';
  return html`<td class="${cssClasses.CELL} ${classNames} ${props.classNames}">${props.content}</td>`;
};

const mdcDataTableRowTemplate = (props) => {
  const classNames = props.isSelected ? 'mdc-data-table__row--selected' : '';
  const ariaSelectedAttr = `aria-selected="${props.isSelected ? 'true' : 'false'}"`;
  return html`
    <tr data-row-id="${props.rowId}" class="${cssClasses.ROW} ${classNames} ${props.classNames}" ${ariaSelectedAttr}>
      ${mdcDataTableCellTemplate({
        content: mdcCheckboxTemplate({classNames: cssClasses.ROW_CHECKBOX}),
        isChecked: props.isSelected,
      })}
      ${props.content}
    </tr>`;
};

const mdcDataTableData = {
  headers: ['Dessert', 'Calories', 'Fat', 'Carbs', 'Protein (g)'],
  rows: [
    ['Frozen yogurt', 159, 6.0, 24, 4.0],
    ['Ice cream sandwich', 237, 9.0, 37, 4.3],
    ['Eclair', 262, 16.0, 24, 6.0],
  ],
};

/** @return {!HTMLTemplateElement} */
function renderComponent(props) {
  const templateResult = html`
    <div class="${cssClasses.ROOT}">
      <table class="mdc-data-table__table">
        <thead>
          <tr class="${cssClasses.HEADER_ROW}">
            ${mdcDataTableHeaderCellTemplate({content: mdcCheckboxTemplate({classNames: cssClasses.HEADER_ROW_CHECKBOX})})}

            ${props.data.headers.map((header) => mdcDataTableHeaderCellTemplate({content: header}))}
          </tr>
        </thead>
        <tbody class="mdc-data-table__content">
        ${props.data.rows.map((row, index) => {
          return mdcDataTableRowTemplate({
            rowId: `u${index}`,
            content: row.map((cell) => {
                  const isNumeric = typeof cell === 'number';
                  mdcDataTableCellTemplate({content: cell, isNumeric});
              }),
            });
          })}
        </tbody>
      </table>
    </div>`;

  render(templateResult, document.body);
  return document.querySelector(`.${cssClasses.ROOT}`);
}

class MockMDCCheckbox {
  constructor() {
    this.destroy = td.func('.destroy');
  }
}

function setupTest() {
  const root = renderComponent({data: mdcDataTableData});
  const component = new MDCDataTable(root);
  const adapter = component.getDefaultFoundation().adapter_;
  return {root, component, adapter};
}

function setupTestWithMocks() {
  const root = renderComponent({data: mdcDataTableData});
  const MockFoundationCtor = td.constructor(MDCDataTableFoundation);
  const mockFoundation = new MockFoundationCtor();
  const mockCheckboxFactory = td.function('checkboxFactory');
  const component = new MDCDataTable(root, mockFoundation, mockCheckboxFactory);
  const adapter = component.getDefaultFoundation().adapter_;
  return {root, component, mockFoundation, mockCheckboxFactory, adapter};
}

suite('MDCDataTable');

test('#attachTo returns a component instance', () => {
  const root = renderComponent({data: mdcDataTableData});
  const component = MDCDataTable.attachTo(root);
  assert.instanceOf(component, MDCDataTable);
  component.destroy();
});

test('#initialSyncWithDOM registers change events on header row & row checkboxes', () => {
  const {root, component, mockFoundation} = setupTestWithMocks();

  root.querySelector(strings.HEADER_ROW_CHECKBOX_SELECTOR).querySelector('input').click();
  td.verify(mockFoundation.handleHeaderRowCheckboxChange(), {times: 1});

  root.querySelector(strings.ROW_CHECKBOX_SELECTOR).querySelector('input').click();
  td.verify(mockFoundation.handleRowCheckboxChange(td.matchers.isA(Event)), {times: 1});

  component.destroy();
});

test('#initialSyncWithDOM calls foundation.layout() method', () => {
  const {component, mockFoundation} = setupTestWithMocks();
  td.verify(mockFoundation.layout(), {times: 1});
  component.destroy();
});

test('#getRows calls foundation.getRows() method', () => {
  const {component, mockFoundation} = setupTestWithMocks();
  component.getRows();
  td.verify(mockFoundation.getRows(), {times: 1});
  component.destroy();
});

test('#setSelectedRowIds calls foundation.setSelectedRowIds() method', () => {
  const {component, mockFoundation} = setupTestWithMocks();
  component.setSelectedRowIds(['u1', 'u2']);
  td.verify(mockFoundation.setSelectedRowIds(['u1', 'u2']), {times: 1});
  component.destroy();
});

test('adapter#isHeaderRowCheckboxChecked returns true if header row checkbox is checked', () => {
  const {component, root, adapter} = setupTest();

  assert.isTrue(adapter.isHeaderRowCheckboxChecked());
  root.querySelector(strings.HEADER_ROW_CHECKBOX_SELECTOR).querySelector('input').click();
  assert.isFalse(adapter.isHeaderRowCheckboxChecked());

  component.destroy();
});

test('adapter#addClassAtRowIndex adds class name at given row index ', () => {
  const {component, adapter} = setupTest();

  adapter.addClassAtRowIndex(1, 'test-class-name');
  assert.isTrue(component.getRows()[1].classList.contains('test-class-name'));

  component.destroy();
});

test('adapter#removeClassAtRowIndex removes class name from given row index ', () => {
  const {component, adapter} = setupTest();

  adapter.addClassAtRowIndex(1, 'test-remove-class-name');
  adapter.removeClassAtRowIndex(1, 'test-remove-class-name');
  assert.isFalse(component.getRows()[1].classList.contains('test-remove-class-name'));

  component.destroy();
});

test('adapter#getAttributeAtRowIndex', () => {
  const {component, adapter} = setupTest();

  assert.equal(adapter.getAttributeAtRowIndex(1, strings.DATA_ROW_ID_ATTR), 'u1');

  component.destroy();
});

test('adapter#setAttributeAtRowIndex', () => {
  const {component, adapter} = setupTest();

  adapter.setAttributeAtRowIndex(1, 'data-test-set-attr', 'test-val-1');
  assert.equal(adapter.getAttributeAtRowIndex(1, 'data-test-set-attr'), 'test-val-1');

  component.destroy();
});

test('adapter#registerRowCheckboxes Initiates all row checkboxes', () => {
  const {mockCheckboxFactory, mockFoundation, root, component, adapter} = setupTestWithMocks();

  const rows = [].slice.call(root.querySelectorAll(strings.ROW_SELECTOR));
  td.when(mockFoundation.getRows()).thenReturn(rows);

  adapter.registerRowCheckboxes();

  td.verify(mockCheckboxFactory(td.matchers.isA(Element)), {times: 3});
  component.destroy();
});

test('adapter#registerRowCheckboxes subsequent call destroys previous checkbox instances of all row checkboxes', () => {
  const {mockFoundation, mockCheckboxFactory, component, root, adapter} = setupTestWithMocks();

  const mockDestroy = td.function('checkbox.destroy');
  const rows = [].slice.call(root.querySelectorAll(strings.ROW_SELECTOR));
  td.when(mockFoundation.getRows()).thenReturn(rows);
  td.when(mockCheckboxFactory(td.matchers.isA(Element))).thenReturn({destroy: mockDestroy});
  adapter.registerRowCheckboxes();
  adapter.registerRowCheckboxes();

  td.verify(mockDestroy(), {times: 3});
  component.destroy();
});

test('adapter#getRowElements', () => {
  const {component, adapter} = setupTest();

  assert.equal(adapter.getRowElements().length, 3);
  component.destroy();
});

test('adapter#registerHeaderRowCheckbox Initializes header row checkbox', () => {
  const {component, mockCheckboxFactory, adapter} = setupTestWithMocks();

  adapter.registerHeaderRowCheckbox();
  td.verify(mockCheckboxFactory(td.matchers.isA(Element)), {times: 3});

  component.destroy();
});

test('adapter#registerHeaderRowCheckbox re-initializing header row checkbox destroys previous checkbox', () => {
  const {component, mockCheckboxFactory, adapter} = setupTestWithMocks();

  const mockDestroy = td.function('checkbox.destroy');
  td.when(mockCheckboxFactory(td.matchers.isA(Element))).thenReturn({destroy: mockDestroy});
  adapter.registerHeaderRowCheckbox();
  adapter.registerHeaderRowCheckbox();
  td.verify(mockDestroy(), {times: 1});

  component.destroy();
});

test('adapter#isRowsSelectable', () => {
  const {component, adapter} = setupTest();

  assert.isTrue(adapter.isRowsSelectable());

  component.destroy();
});

test('adapter#getRowIndexByChildElement', () => {
  const {component, root, adapter} = setupTest();

  const rows = [].slice.call(root.querySelectorAll(strings.ROW_SELECTOR));
  const inputEl = rows[2].querySelector('input');
  assert.equal(adapter.getRowIndexByChildElement(inputEl), 2);

  component.destroy();
});

test('adapter# ', () => {
  const {component, root, adapter} = setupTest();

  component.destroy();
});

test('adapter# ', () => {
  const {component, root, adapter} = setupTest();

  component.destroy();
});
