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

import {html} from '../../../testing/dom';
import {MDCDataTable} from '../component';
import {cssClasses, events, strings} from '../constants';

interface ClassMap {
  [className: string]: boolean;
}

const classMap = (classesMap: ClassMap) => {
  return Object.keys(classesMap)
      .filter((className: string) => {
        return classesMap[className];
      })
      .join(' ');
};

interface CheckboxTemplateProps {
  classNames: string;
  isChecked: boolean;
}

const mdcCheckboxTemplate = (props: Partial<CheckboxTemplateProps>): string => {
  return html`
    <div class="mdc-checkbox ${props.classNames || ''}">
      <input type="checkbox" class="mdc-checkbox__native-control" ${
      props.isChecked ? 'checked' : ''}></input>
      <div class="mdc-checkbox__background">
        <svg class="mdc-checkbox__checkmark" viewbox="0 0 24 24">
          <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
        </svg>
        <div class="mdc-checkbox__mixedmark"></div>
      </div>
    </div>`;
};

interface DataTableHeaderCellTemplateProps {
  content: string;
}

const mdcDataTableHeaderCellTemplate =
    (props: DataTableHeaderCellTemplateProps): string => {
      return html`
    <th class="mdc-data-table__header-cell" role="columnheader" scope="col">
      ${props.content}
    </th>
  `;
    };

interface DataTableCellTemplateProps {
  isNumeric: boolean;
  content: string|number;
}

const mdcDataTableCellTemplate =
    (props: Partial<DataTableCellTemplateProps>): string => {
      const classes = {
        [cssClasses.CELL_NUMERIC]: !!props.isNumeric,
      };
      return html`
    <td class="${classMap(classes)}">${props.content}</td>
  `;
    };

interface DataTableRowTemplateProps {
  isSelected: boolean;
  rowId: string;
  content: string;
}

const mdcDataTableRowTemplate = (props: DataTableRowTemplateProps): string => {
  const classes = {
    [cssClasses.ROW]: true,
    [cssClasses.ROW_SELECTED]: props.isSelected,
  };
  const ariaSelectedValue = props.isSelected ? 'true' : 'false';
  const rowCheckbox = mdcDataTableCellTemplate({
    content: mdcCheckboxTemplate({
      classNames: cssClasses.ROW_CHECKBOX,
      isChecked: props.isSelected,
    }),
  });

  return html`
    <tr
      data-row-id="${props.rowId}"
      class="${classMap(classes)}"
      aria-selected="${ariaSelectedValue}"
    >
      ${rowCheckbox} ${props.content}
    </tr>
  `;
};

interface DataTableData {
  headers: string[];
  rows: Array<Array<string|number>>;
  selectedRowIndexes: number[];
}

const mdcDataTableData = {
  headers: ['Dessert', 'Calories', 'Fat', 'Carbs', 'Protein (g)'],
  rows: [
    ['Frozen yogurt', 159, 6.0, 24, 4.0],
    ['Ice cream sandwich', 237, 9.0, 37, 4.3],
    ['Eclair', 262, 16.0, 24, 6.0],
  ],
  selectedRowIndexes: [1],
};

interface RenderComponentProps {
  data: DataTableData;
}

function renderComponent(props: RenderComponentProps): HTMLElement {
  const headerRowContent = mdcDataTableHeaderCellTemplate({
                             content: mdcCheckboxTemplate({
                               classNames: cssClasses.HEADER_ROW_CHECKBOX,
                             }),
                           }) +
      props.data.headers
          .map(
              (header: string) =>
                  mdcDataTableHeaderCellTemplate({content: header}))
          .join('');
  const bodyContent =
      props.data.rows.map((row: Array<string|number>, index: number) => {
        const isSelected = props.data.selectedRowIndexes.indexOf(index) >= 0;
        return mdcDataTableRowTemplate({
          rowId: `u${index}`,
          isSelected,
          content: row.map((cell: string|number) => {
                        const isNumeric = typeof cell === 'number';
                        return mdcDataTableCellTemplate(
                            {content: cell, isNumeric});
                      })
                       .join(''),
        });
      });

  const blobHtml = html`
    <div class="${cssClasses.ROOT}">
      <table class="mdc-data-table__table">
        <thead>
          <tr class="${cssClasses.HEADER_ROW}">
            ${headerRowContent}
          </tr>
        </thead>
        <tbody class="mdc-data-table__content">
          ${bodyContent}
        </tbody>
      </table>
    </div>
  `;

  const prevTable = document.querySelector(`.${cssClasses.ROOT}`);
  if (prevTable) {
    document.body.removeChild(prevTable.parentElement as HTMLElement);
  }

  const container = document.createElement('div');
  container.innerHTML = blobHtml;
  document.body.appendChild(container);
  return document.querySelector(`.${cssClasses.ROOT}`) as HTMLElement;
}

function setupTest() {
  const root = renderComponent({data: mdcDataTableData});
  const component = new MDCDataTable(root);
  // This is an intentionally reference to adapter instance for testing.
  // tslint:disable-next-line:no-any
  const adapter = (component.getDefaultFoundation() as any).adapter_;
  return {root, component, adapter};
}

describe('MDCDataTable', () => {
  it('#attachTo returns a component instance', () => {
    const root = renderComponent({data: mdcDataTableData});
    const component = MDCDataTable.attachTo(root);
    expect(component).toEqual(jasmine.any(MDCDataTable));
    component.destroy();
  });

  it('Checking at least 1 row checkbox sets header row checkbox to indeterminate',
     () => {
       const {root} = setupTest();

       const rowCheckbox =
           root.querySelector(strings.ROW_CHECKBOX_SELECTOR)!.querySelector(
               'input') as HTMLInputElement;
       rowCheckbox.click();

       const headerRowCheckbox =
           root.querySelector(strings.HEADER_ROW_CHECKBOX_SELECTOR)!
               .querySelector('input') as HTMLInputElement;
       expect(headerRowCheckbox.indeterminate).toBe(true);
     });

  it('#setSelectedRowIds sets selected row ids', () => {
    const {component} = setupTest();

    component.setSelectedRowIds(['u1', 'u2']);
    expect(component.getSelectedRowIds()).toEqual(['u1', 'u2']);
    component.destroy();
  });

  it('#getSelectedRowIds returns empty array when no rows selected', () => {
    const {component} = setupTest();

    component.setSelectedRowIds([]);
    expect(component.getSelectedRowIds()).toEqual([]);
    component.destroy();
  });

  it('adapter#isHeaderRowCheckboxChecked returns true if header row checkbox is checked',
     () => {
       const {component, root, adapter} = setupTest();

       const nativeCheckbox =
           root.querySelector(strings.HEADER_ROW_CHECKBOX_SELECTOR)!
               .querySelector('input') as HTMLInputElement;

       nativeCheckbox.checked = false;
       expect(adapter.isHeaderRowCheckboxChecked()).toBe(false);

       nativeCheckbox.checked = true;
       expect(adapter.isHeaderRowCheckboxChecked()).toBe(true);

       component.destroy();
     });

  it('adapter#addClassAtRowIndex adds class name at given row index ', () => {
    const {component, adapter} = setupTest();

    adapter.addClassAtRowIndex(1, 'test-class-name');
    expect(component.getRows()[1].classList.contains('test-class-name'))
        .toBe(true);

    component.destroy();
  });

  it('adapter#removeClassAtRowIndex removes class name from given row index ',
     () => {
       const {component, adapter} = setupTest();

       adapter.addClassAtRowIndex(1, 'test-remove-class-name');
       adapter.removeClassAtRowIndex(1, 'test-remove-class-name');
       expect(
           component.getRows()[1].classList.contains('test-remove-class-name'))
           .toBe(false);

       component.destroy();
     });

  it('adapter#setAttributeAtRowIndex', () => {
    const {component, adapter} = setupTest();

    adapter.setAttributeAtRowIndex(1, 'data-test-set-attr', 'test-val-1');
    expect(adapter.getRowElements()[1].getAttribute('data-test-set-attr'))
        .toBe('test-val-1');

    component.destroy();
  });

  it('adapter#getRowElements', () => {
    const {component, adapter} = setupTest();

    expect(adapter.getRowElements().length).toEqual(3);
    component.destroy();
  });

  it('adapter#isRowsSelectable', () => {
    const {component, adapter} = setupTest();

    expect(adapter.isRowsSelectable()).toBe(true);

    component.destroy();
  });

  it('adapter#getRowIndexByChildElement', () => {
    const {component, root, adapter} = setupTest();

    const rows = [].slice.call(root.querySelectorAll(strings.ROW_SELECTOR)) as
        HTMLElement[];
    const inputEl = rows[2].querySelector('input') as HTMLInputElement;
    expect(adapter.getRowIndexByChildElement(inputEl)).toEqual(2);

    component.destroy();
  });

  it('adapter#getRowCount calls foundation.getRows() method', () => {
    const {component, adapter} = setupTest();

    expect(adapter.getRowCount()).toEqual(3);

    component.destroy();
  });

  it('adapter#getSelectedRowCount', () => {
    const {component, adapter} = setupTest();

    expect(adapter.getSelectedRowCount())
        .toBe(mdcDataTableData.selectedRowIndexes.length);

    component.destroy();
  });

  it('adapter#notifyRowSelectionChanged', () => {
    const {component, adapter} = setupTest();
    const handler = jasmine.createSpy('notifyRowSelectionChangedHandler');

    component.listen(events.ROW_SELECTION_CHANGED, handler);
    adapter.notifyRowSelectionChanged(
        {rowIndex: 1, rowId: 'u1', selected: true});
    expect(handler).toHaveBeenCalledWith(jasmine.anything());

    component.unlisten(events.ROW_SELECTION_CHANGED, handler);
    component.destroy();
  });

  it('adapter#setHeaderRowCheckboxIndeterminate', () => {
    const {component, root, adapter} = setupTest();

    const nativeCheckbox =
        root.querySelector(strings.HEADER_ROW_CHECKBOX_SELECTOR)!.querySelector(
            'input') as HTMLInputElement;

    nativeCheckbox.indeterminate = false;
    adapter.setHeaderRowCheckboxIndeterminate(true);
    expect(nativeCheckbox.indeterminate).toBe(true);

    component.destroy();
  });

  it('adapter#setHeaderRowCheckboxChecked', () => {
    const {component, root, adapter} = setupTest();

    const nativeCheckbox =
        root.querySelector(strings.HEADER_ROW_CHECKBOX_SELECTOR)!.querySelector(
            'input') as HTMLInputElement;
    expect(nativeCheckbox.checked).toBe(false);
    adapter.setHeaderRowCheckboxChecked(true);
    expect(nativeCheckbox.checked).toBe(true);

    component.destroy();
  });

  it('adapter#getRowIdAtIndex', () => {
    const {component, adapter} = setupTest();

    expect(adapter.getRowIdAtIndex(1)).toEqual('u1');
    component.destroy();
  });

  it('adapter#setRowCheckboxCheckedAtIndex', () => {
    const {component, root, adapter} = setupTest();
    const nativeCheckbox =
        ([].slice.call(root.querySelectorAll(
             strings.ROW_CHECKBOX_SELECTOR))[0] as HTMLInputElement)
            .querySelector('input');

    expect(nativeCheckbox!.checked).toBe(false);
    adapter.setRowCheckboxCheckedAtIndex(0, true);
    expect(nativeCheckbox!.checked).toBe(true);

    component.destroy();
  });

  it('adapter#notifySelectedAll', () => {
    const {component, adapter} = setupTest();
    const handler = jasmine.createSpy('notifySelectedAll');

    component.listen(events.SELECTED_ALL, handler);
    adapter.notifySelectedAll();
    expect(handler).toHaveBeenCalledWith(jasmine.anything());

    component.unlisten(events.SELECTED_ALL, handler);
    component.destroy();
  });

  it('adapter#notifyUnselectedAll', () => {
    const {component, adapter} = setupTest();
    const handler = jasmine.createSpy('notifyUnselectedAll');

    component.listen(events.UNSELECTED_ALL, handler);
    adapter.notifyUnselectedAll();
    expect(handler).toHaveBeenCalledWith(jasmine.anything());

    component.unlisten(events.UNSELECTED_ALL, handler);
    component.destroy();
  });
});
