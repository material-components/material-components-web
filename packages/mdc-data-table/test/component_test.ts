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

import {createFixture, html} from '../../../testing/dom';
import {createMouseEvent} from '../../../testing/dom/events';
import {MDCDataTable} from '../component';
import {cssClasses, dataAttributes, events, selectors, SortValue} from '../constants';

interface ClassMap {
  [className: string]: boolean;
}

function classMap(classesMap: ClassMap) {
  return Object.keys(classesMap)
      .filter((className: string) => {
        return classesMap[className];
      })
      .join(' ');
}

interface CheckboxTemplateProps {
  classNames: string;
  isChecked: boolean;
}

function mdcCheckboxTemplate(props: Partial<CheckboxTemplateProps>) {
  return html`
    <div class="mdc-checkbox ${props.classNames || ''}">
      <input type="checkbox" class="mdc-checkbox__native-control" ${
      props.isChecked ? 'checked' : ''}>
      <div class="mdc-checkbox__background">
        <svg class="mdc-checkbox__checkmark" viewBox="0 0 24 24">
          <path class="mdc-checkbox__checkmark-path" fill="none" d="M1.73,12.91 8.1,19.28 22.79,4.59"></path>
        </svg>
        <div class="mdc-checkbox__mixedmark"></div>
      </div>
    </div>`;
}

interface IconButtonProps {
  iconName: string;
  classNames: string;
}

function mdcIconButtonTemplate(props: IconButtonProps) {
  const classes = {
    'mdc-icon-button': true,
    'material-icons': true,
    [props.classNames]: !!props.classNames,
  };

  return html`<button class="${classMap(classes)}">${props.iconName}</button>`;
}

interface DataTableHeaderCellTemplateProps {
  content: string|ReturnType<typeof html>;
  isSortable?: boolean;
  columnId?: string;
}


function mdcDataTableHeaderCellTemplate(
    props: DataTableHeaderCellTemplateProps) {
  const classes = {
    [cssClasses.HEADER_CELL]: true,
    [cssClasses.HEADER_CELL_WITH_SORT]: !!props.isSortable,
  };
  const columnId = props.columnId || '';
  const sortButton = props.isSortable ?
      mdcIconButtonTemplate(
          {iconName: 'arrow_upward', classNames: cssClasses.SORT_ICON_BUTTON}) :
      '';

  return html`
      <th class="${classMap(classes)}" role="columnheader" scope="col" ${
      dataAttributes.COLUMN_ID}="${columnId}">
        <div class="${cssClasses.HEADER_CELL_WRAPPER}">
          <div class="${cssClasses.HEADER_CELL_LABEL}">
            ${props.content}
          </div>
          ${sortButton}
          <div class="${cssClasses.SORT_STATUS_LABEL}"></div>
        </div>
      </th>
      `;
}

interface DataTableCellTemplateProps {
  isNumeric: boolean;
  content: string|number|ReturnType<typeof html>;
}

function mdcDataTableCellTemplate(props: Partial<DataTableCellTemplateProps>) {
  const classes = {
    [cssClasses.CELL_NUMERIC]: !!props.isNumeric,
  };
  return html`
      <td class="${classMap(classes)}">${props.content}</td>
    `;
}

interface DataTableRowTemplateProps {
  isSelected: boolean;
  rowId: string;
  content: string;
  withoutRowSelection?: boolean;
}

function mdcDataTableRowTemplate(props: DataTableRowTemplateProps) {
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
    ${props.withoutRowSelection ? '' : rowCheckbox} ${props.content}
  </tr>
  `;
}

function progressIndicatorTemplate() {
  return html`
      <div class="mdc-data-table__progress-indicator">
        <div class="mdc-data-table__scrim"></div>
        <div class="mdc-linear-progress mdc-linear-progress--indeterminate mdc-data-table__linear-progress" role="progressbar" aria-label="Data is being loaded...">
          <div class="mdc-linear-progress__buffer">
            <div class="mdc-linear-progress__buffer-bar"></div>
            <div class="mdc-linear-progress__buffer-dots"></div>
          </div>
          <div class="mdc-linear-progress__bar mdc-linear-progress__primary-bar">
            <span class="mdc-linear-progress__bar-inner"></span>
          </div>
          <div class="mdc-linear-progress__bar mdc-linear-progress__secondary-bar">
            <span class="mdc-linear-progress__bar-inner"></span>
          </div>
        </div>
      </div>
      `;
}

interface DataTableHeader {
  name: string;
  isSortable?: boolean;
  columnId?: string;
}

interface DataTableData {
  headers: DataTableHeader[];
  rows: Array<Array<string|number>>;
  selectedRowIndexes: number[];
}

const mdcDataTableData = {
  headers: [
    {
      name: 'Dessert',
      isSortable: true,
      columnId: 'dessert',
    },
    {
      name: 'Calories',
      isSortable: true,
      columnId: 'calories',
    },
    {
      name: 'Fat',
      columnId: 'fat',
    },
    {
      name: 'Carbs',
      columnId: 'carbs',
    },
    {
      name: 'Protein (g)',
      columnId: 'protein',
    },
  ],
  rows: [
    ['Frozen yogurt', 159, 6.0, 24, 4.0],
    ['Ice cream sandwich', 237, 9.0, 37, 4.3],
    ['Eclair', 262, 16.0, 24, 6.0],
  ],
  selectedRowIndexes: [1],
};

interface RenderComponentProps {
  data: DataTableData;
  excludeProgressIndicator?: boolean;
  withoutRowSelection?: boolean;
}

function renderComponent(props: RenderComponentProps): HTMLElement {
  const headerRowContent =
      html`${props.withoutRowSelection ? '' : mdcDataTableHeaderCellTemplate({
        content: mdcCheckboxTemplate({
          classNames: cssClasses.HEADER_ROW_CHECKBOX,
        }),
      })}
      ${props.data.headers.map((header) => mdcDataTableHeaderCellTemplate({
                                 content: header.name,
                                 isSortable: header.isSortable,
                                 columnId: header.columnId,
                               }))}`;
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
          withoutRowSelection: props.withoutRowSelection,
        });
      });

  const blobHtml = html`
    <div class="${cssClasses.ROOT}">
      <div class="${cssClasses.TABLE_CONTAINER}">
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
      ${props.excludeProgressIndicator ? '' : progressIndicatorTemplate()}
    </div>
  `;

  const preventable = document.querySelector<HTMLElement>(`.${cssClasses.ROOT}`);
  if (preventable) {
    document.body.removeChild(preventable.parentElement as HTMLElement);
  }

  return createFixture(blobHtml);
}

interface SetupProps {
  excludeProgressIndicator?: boolean;
  withoutRowSelection?: boolean;
}

function setupTest(props: SetupProps = {}) {
  const root = renderComponent({
    data: mdcDataTableData,
    excludeProgressIndicator: props.excludeProgressIndicator,
    withoutRowSelection: props.withoutRowSelection,
  });
  const component = new MDCDataTable(root);
  // This is an intentionally reference to adapter instance for testing.
  // tslint:disable-next-line:no-any
  const adapter = (component.getDefaultFoundation() as any).adapter;
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
           root.querySelector(selectors.ROW_CHECKBOX)!.querySelector('input')!;
       rowCheckbox.click();

       const headerRowCheckbox =
           root.querySelector(selectors.HEADER_ROW_CHECKBOX)!.querySelector(
               'input')!;
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
           root.querySelector(selectors.HEADER_ROW_CHECKBOX)!.querySelector(
               'input')!;

       nativeCheckbox.checked = false;
       expect(adapter.isHeaderRowCheckboxChecked()).toBe(false);

       nativeCheckbox.checked = true;
       expect(adapter.isHeaderRowCheckboxChecked()).toBe(true);

       component.destroy();
     });

  it('adapter#addClassAtRowIndex adds class name at given row index ', () => {
    const {component, adapter} = setupTest();

    adapter.addClassAtRowIndex(1, 'test-class-name');
    expect(component.getRows()[1]).toHaveClass('test-class-name');

    component.destroy();
  });

  it('adapter#removeClassAtRowIndex removes class name from given row index ',
     () => {
       const {component, adapter} = setupTest();

       adapter.addClassAtRowIndex(1, 'test-remove-class-name');
       adapter.removeClassAtRowIndex(1, 'test-remove-class-name');
       expect(component.getRows()[1]).not.toHaveClass('test-remove-class-name');

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

    const rows = Array.from(root.querySelectorAll<HTMLElement>(selectors.ROW));
    const inputEl = rows[2].querySelector('input')!;
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
        root.querySelector(selectors.HEADER_ROW_CHECKBOX)!.querySelector(
            'input')!;

    nativeCheckbox.indeterminate = false;
    adapter.setHeaderRowCheckboxIndeterminate(true);
    expect(nativeCheckbox.indeterminate).toBe(true);

    component.destroy();
  });

  it('adapter#setHeaderRowCheckboxChecked', () => {
    const {component, root, adapter} = setupTest();

    const nativeCheckbox =
        root.querySelector(selectors.HEADER_ROW_CHECKBOX)!.querySelector(
            'input')!;
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
        root.querySelector(selectors.ROW_CHECKBOX)!.querySelector('input');

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

  it('Should trigger row click event when clicked on data row', () => {
    const {component} = setupTest();

    const handler = jasmine.createSpy('mockRowClickListener');
    component.listen(events.ROW_CLICK, handler);
    component.getRows()[1].click();
    expect(handler).toHaveBeenCalledWith(jasmine.objectContaining({
      detail: {
        rowId: 'u1',
        row: component.getRows()[1],
        altKey: false,
        ctrlKey: false,
        metaKey: false,
        shiftKey: false,
      }
    }));

    component.unlisten(events.ROW_CLICK, handler);
    component.destroy();
  });

  it('Should trigger row click event with modifiers when clicked on data row',
     () => {
       const {component} = setupTest();

       const handler = jasmine.createSpy('mockRowClickListener');
       component.listen(events.ROW_CLICK, handler);
       component.getRows()[1].dispatchEvent(createMouseEvent('click', {
         bubbles: true,
         cancelable: true,
         altKey: true,
         ctrlKey: true,
         metaKey: true,
         shiftKey: true
       }));

       expect(handler).toHaveBeenCalledWith(jasmine.objectContaining({
         detail: {
           rowId: 'u1',
           row: component.getRows()[1],
           altKey: true,
           ctrlKey: true,
           metaKey: true,
           shiftKey: true,
         }
       }));

       component.unlisten(events.ROW_CLICK, handler);
       component.destroy();
     });

  it('Should not trigger row click event when clicked on header cell', () => {
    const {component, root} = setupTest();

    const handler = jasmine.createSpy('mockRowClickListener');
    component.listen(events.ROW_CLICK, handler);
    root.querySelector<HTMLElement>('th')!.click();
    expect(handler).not.toHaveBeenCalled();

    component.unlisten(events.ROW_CLICK, handler);
    component.destroy();
  });

  describe('Removing Rows', () => {
    it('removes all rows while the header checkbox is checked.', () => {
      const {component, root, adapter} = setupTest();
      adapter.setHeaderRowCheckboxChecked(true);
      expect(adapter.isHeaderRowCheckboxChecked()).toBe(true);
      const tableContent =
          root.querySelector<HTMLElement>(`.${cssClasses.CONTENT}`);
      tableContent!.textContent = ``;
      component.layout();
      expect(adapter.isHeaderRowCheckboxChecked()).toBe(false);
    });
  });

  describe('Column sorting', () => {
    it('emits sort event when clicked on sort button of sortable column header',
       () => {
         const {component, root} = setupTest();
         const handler = jasmine.createSpy('handleSorted');

         component.listen(events.SORTED, handler);
         const columnId = 'dessert';
         const headerCell = root.querySelector<HTMLElement>(
             `[${dataAttributes.COLUMN_ID}="${columnId}"]`);
         headerCell!
             .querySelector<HTMLElement>(
                 `.${cssClasses.SORT_ICON_BUTTON}`)!.click();
         const matchEventDetail = {
           columnId,
           columnIndex: 1,
           headerCell,
           sortValue: SortValue.ASCENDING,
         };
         expect(handler).toHaveBeenCalledWith(
             jasmine.objectContaining({detail: matchEventDetail}));
         component.unlisten(events.SORTED, handler);
         component.destroy();
       });

    it('emits sort event when clicked on sortable column header text', () => {
      const {component, root} = setupTest();
      const handler = jasmine.createSpy('handleSorted');

      component.listen(events.SORTED, handler);
      const columnId = 'dessert';
      const headerCell = root.querySelector<HTMLElement>(
          `[${dataAttributes.COLUMN_ID}="${columnId}"]`);
      headerCell!
          .querySelector<HTMLElement>(
              `.${cssClasses.HEADER_CELL_LABEL}`)!.click();
      const matchEventDetail = {
        columnId,
        columnIndex: 1,
        headerCell,
        sortValue: SortValue.ASCENDING,
      };
      expect(handler).toHaveBeenCalledWith(
          jasmine.objectContaining({detail: matchEventDetail}));
      component.unlisten(events.SORTED, handler);
      component.destroy();
    });

    it('does not emit sort event when clicked on non sortable column header',
       () => {
         const {component, root} = setupTest();
         const handler = jasmine.createSpy('handleSorted');

         component.listen(events.SORTED, handler);

         const headerCell = root.querySelector<HTMLElement>(
             `[${dataAttributes.COLUMN_ID}="protein"]`);
         const testButton = document.createElement('button');
         headerCell!.appendChild(testButton);
         testButton.click();
         expect(handler).not.toHaveBeenCalled();
         headerCell!.removeChild(testButton);
         component.unlisten(events.SORTED, handler);
         component.destroy();
       });

    it('does not emit sort event after component is destroyed', () => {
      const {component, root} = setupTest();
      component.destroy();
      const handler = jasmine.createSpy('handleSorted');

      component.listen(events.SORTED, handler);
      const columnId = 'dessert';
      const headerCell = root.querySelector<HTMLElement>(
          `[${dataAttributes.COLUMN_ID}="${columnId}"]`);
      headerCell!.querySelector<HTMLElement>(
                     `.${cssClasses.SORT_ICON_BUTTON}`)!.click();
      expect(handler).not.toHaveBeenCalled();
      component.unlisten(events.SORTED, handler);
    });

    it('clicking on header cell when in idle state sorts that column in ascending order by default',
       () => {
         const {component, root} = setupTest();

         const columnId = 'dessert';
         const headerCell = root.querySelector<HTMLElement>(
             `[${dataAttributes.COLUMN_ID}="${columnId}"]`);
         expect(headerCell!.getAttribute('aria-sort')).toBe(null);
         headerCell!
             .querySelector<HTMLElement>(
                 `.${cssClasses.SORT_ICON_BUTTON}`)!.click();
         expect(headerCell!.getAttribute('aria-sort')).toBe('ascending');
         component.destroy();
       });

    it('clicking on header cell toggles sort status if already sorted', () => {
      const {component, root} = setupTest();

      const columnId = 'dessert';
      const headerCell = root.querySelector<HTMLElement>(
          `[${dataAttributes.COLUMN_ID}="${columnId}"]`);
      const sortButton = headerCell!.querySelector<HTMLElement>(
          `.${cssClasses.SORT_ICON_BUTTON}`);
      sortButton!.click();
      expect(headerCell!.getAttribute('aria-sort')).toBe('ascending');

      sortButton!.click();
      expect(headerCell!.getAttribute('aria-sort')).toBe('descending');
      component.destroy();
    });

    it('clicking on header cells deactivates sorting state on other header cells',
       () => {
         const {component, root} = setupTest();

         const dessertHeaderCell = root.querySelector<HTMLElement>(
             `[${dataAttributes.COLUMN_ID}="dessert"]`);
         dessertHeaderCell!
             .querySelector<HTMLElement>(
                 `.${cssClasses.SORT_ICON_BUTTON}`)!.click();
         expect(dessertHeaderCell!.getAttribute('aria-sort')).toBe('ascending');

         const caloriesHeaderCell = root.querySelector<HTMLElement>(
             `[${dataAttributes.COLUMN_ID}="calories"]`);
         caloriesHeaderCell!
             .querySelector<HTMLElement>(
                 `.${cssClasses.SORT_ICON_BUTTON}`)!.click();

         expect(caloriesHeaderCell!.getAttribute('aria-sort'))
             .toBe('ascending');

         // Resets previous column sort state.
         expect(dessertHeaderCell!.getAttribute('aria-sort')).toBe('none');
         component.destroy();
       });

    it('clicking on sortable header cell sets appropriate sort status label that is visually hidden',
       () => {
         const {component, root} = setupTest();

         const caloriesHeaderCell = root.querySelector<HTMLElement>(
             `[${dataAttributes.COLUMN_ID}="calories"]`);
         expect(caloriesHeaderCell!
                    .querySelector<HTMLElement>(
                        selectors.SORT_STATUS_LABEL)!.textContent)
             .toBe('');
         caloriesHeaderCell!
             .querySelector<HTMLElement>(
                 `.${cssClasses.SORT_ICON_BUTTON}`)!.click();
         expect(caloriesHeaderCell!
                    .querySelector<HTMLElement>(
                        selectors.SORT_STATUS_LABEL)!.textContent)
             .toMatch(/ascending/);
         caloriesHeaderCell!
             .querySelector<HTMLElement>(
                 `.${cssClasses.SORT_ICON_BUTTON}`)!.click();
         expect(caloriesHeaderCell!
                    .querySelector<HTMLElement>(
                        selectors.SORT_STATUS_LABEL)!.textContent)
             .toMatch(/descending/);

         // Should reset previous column sort status label.
         const dessertHeaderCell = root.querySelector<HTMLElement>(
             `[${dataAttributes.COLUMN_ID}="dessert"]`);
         dessertHeaderCell!
             .querySelector<HTMLElement>(
                 `.${cssClasses.SORT_ICON_BUTTON}`)!.click();
         expect(caloriesHeaderCell!
                    .querySelector<HTMLElement>(
                        selectors.SORT_STATUS_LABEL)!.textContent)
             .toBe('');

         component.destroy();
       });

    it('should not throw error when destroy() is called without row selection',
       () => {
         const {component} = setupTest({withoutRowSelection: true});
         expect(() => {
           component.destroy();
         }).not.toThrowError();
       });
  });

  describe('Progress indicator', () => {
    it('Should show progress indicator blocking the content when calling showProgress()',
       () => {
         const {component, root} = setupTest();

         const progressIndicator = root.querySelector<HTMLElement>(
             `.${cssClasses.PROGRESS_INDICATOR}`);
         expect(progressIndicator!.style.cssText).toBe('');

         component.showProgress();
         expect(progressIndicator!.style.cssText).toMatch(/(height|top)/);
         expect(root).toHaveClass(cssClasses.IN_PROGRESS);

         destroyProgress(component, root);
         component.destroy();
       });

    it('Should hide progress indicator when hideProgress() called', () => {
      const {component, root} = setupTest();

      component.showProgress();
      component.hideProgress();
      expect(root).not.toHaveClass(cssClasses.IN_PROGRESS);

      destroyProgress(component, root);
      component.destroy();
    });

    it('Should throw error when showProgress() is called without progress indicator element',
       () => {
         const {component} = setupTest({excludeProgressIndicator: true});

         expect(() => {
           component.showProgress();
         }).toThrowError();
         component.destroy();
       });

    it('Should throw error when hideProgress() is called without progress indicator element',
       () => {
         const {component} = setupTest({excludeProgressIndicator: true});

         expect(() => {
           component.hideProgress();
         }).toThrowError();
         component.destroy();
       });
  });
});

function destroyProgress(component: MDCDataTable, root: HTMLElement) {
  const progressIndicator =
      root.querySelector<HTMLElement>(`.${cssClasses.PROGRESS_INDICATOR}`);
  component.hideProgress();
  progressIndicator!.setAttribute('style', '');
}
