/**
 * @license
 * Copyright 2020 Google Inc.
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

import {checkNumTimesSpyCalledWithArgs, createMockAdapter} from '../../../testing/helpers/foundation';
import {cssClasses, numbers, strings} from '../constants';
import {MDCSelectFoundation} from '../foundation';

const LABEL_WIDTH = 100;

describe('MDCSelectFoundation', () => {
  it('exports cssClasses', () => {
    expect(MDCSelectFoundation.cssClasses).toEqual(cssClasses);
  });

  it('exports numbers', () => {
    expect(MDCSelectFoundation.numbers).toEqual(numbers);
  });

  it('exports strings', () => {
    expect(MDCSelectFoundation.strings).toEqual(strings);
  });

  function setupTest(hasLeadingIcon = true, hasHelperText = false) {
    const mockAdapter = createMockAdapter(MDCSelectFoundation);
    const leadingIcon = jasmine.createSpyObj('leadingIcon', [
      'setDisabled', 'setAriaLabel', 'setContent', 'registerInteractionHandler',
      'deregisterInteractionHandler', 'handleInteraction'
    ]);
    const helperText = jasmine.createSpyObj('helperText', [
      'setContent',
      'setPersistent',
      'setValidation',
      'showToScreenReader',
      'setValidity',
    ]);
    const foundationMap = {
      leadingIcon: hasLeadingIcon ? leadingIcon : undefined,
      helperText: hasHelperText ? helperText : undefined,
    };

    mockAdapter.hasLabel.and.returnValue(true);
    mockAdapter.getMenuItemValues.and.returnValue(['foo', 'bar']);
    mockAdapter.getMenuItemTextAtIndex.withArgs(0).and.returnValue('foo');
    mockAdapter.getMenuItemTextAtIndex.withArgs(1).and.returnValue('bar');
    mockAdapter.getMenuItemCount.and.returnValue(2);

    const foundation = new MDCSelectFoundation(mockAdapter, foundationMap);
    return {foundation, mockAdapter, leadingIcon, helperText};
  }

  it('#getDisabled() returns true if disabled', () => {
    const {foundation} = setupTest();
    foundation.setDisabled(true);
    expect(foundation.getDisabled()).toEqual(true);
  });

  it('#getDisabled() returns false if not disabled', () => {
    const {foundation} = setupTest();
    foundation.setDisabled(false);
    expect(foundation.getDisabled()).toEqual(false);
  });

  it('#setDisabled(true) calls adapter.addClass', () => {
    const {mockAdapter, foundation} = setupTest();
    foundation.setDisabled(true);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.DISABLED);
  });

  it('#setDisabled(false) calls adapter.removeClass', () => {
    const {mockAdapter, foundation} = setupTest();
    foundation.setDisabled(false);
    expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.DISABLED);
  });

  it('#setDisabled sets disabled on leading icon', () => {
    const {foundation, leadingIcon} = setupTest();
    foundation.setDisabled(true);
    expect(leadingIcon.setDisabled).toHaveBeenCalledWith(true);
  });

  it('#setDisabled false adds tabindex 0', () => {
    const {mockAdapter, foundation} = setupTest();
    foundation.setDisabled(false);
    expect(mockAdapter.setSelectAnchorAttr)
        .toHaveBeenCalledWith('tabindex', '0');
  });

  it('#setDisabled true removes tabindex attr', () => {
    const {mockAdapter, foundation} = setupTest();
    foundation.setDisabled(true);
    expect(mockAdapter.removeSelectAnchorAttr).toHaveBeenCalledWith('tabindex');
  });

  it('#notchOutline updates the width of the outline element', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasOutline.and.returnValue(true);
    mockAdapter.getLabelWidth.and.returnValue(LABEL_WIDTH);

    foundation.notchOutline(true);
    expect(mockAdapter.notchOutline)
        .toHaveBeenCalledWith(LABEL_WIDTH * numbers.LABEL_SCALE);
  });

  it('#notchOutline does nothing if no outline is present', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasOutline.and.returnValue(false);
    mockAdapter.getLabelWidth.and.returnValue(LABEL_WIDTH);

    foundation.notchOutline(true);
    expect(mockAdapter.notchOutline)
        .not.toHaveBeenCalledWith(jasmine.anything());
  });

  it('#notchOutline width is set to 0 if no label is present', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasOutline.and.returnValue(true);
    mockAdapter.getLabelWidth.and.returnValue(0);

    foundation.notchOutline(true);
    expect(mockAdapter.notchOutline).toHaveBeenCalledWith(0);
    expect(mockAdapter.notchOutline).toHaveBeenCalledTimes(1);
  });

  it('#notchOutline(false) closes the outline', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasOutline.and.returnValue(true);
    mockAdapter.getLabelWidth.and.returnValue(LABEL_WIDTH);

    foundation.notchOutline(false);
    expect(mockAdapter.closeOutline).toHaveBeenCalled();
  });

  it('#notchOutline does not close the notch if the select is still focused',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasOutline.and.returnValue(true);
       mockAdapter.hasClass.withArgs(cssClasses.FOCUSED).and.returnValue(true);
       mockAdapter.getLabelWidth.and.returnValue(LABEL_WIDTH);

       foundation.notchOutline(false);
       expect(mockAdapter.closeOutline).not.toHaveBeenCalled();
     });

  it('#handleMenuOpened focuses last selected element', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();
    mockAdapter.getSelectedIndex.and.returnValue(2);
    foundation.handleMenuOpened();
    expect(mockAdapter.focusMenuItemAtIndex).toHaveBeenCalledWith(2);
    expect(mockAdapter.focusMenuItemAtIndex).toHaveBeenCalledTimes(1);
  });

  it(`#handleMenuClosed removes ${cssClasses.ACTIVATED} class name`, () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.handleMenuClosed();
    checkNumTimesSpyCalledWithArgs(
        mockAdapter.removeClass, [cssClasses.ACTIVATED], 1);
  });

  it('#handleMenuClosed sets isMenuOpen to false', () => {
    const {foundation} = setupTest();
    foundation.handleMenuClosed();
    expect((foundation as any).isMenuOpen).toBe(false);
  });

  it('#handleMenuClosed set aria-expanded attribute to false', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.handleMenuClosed();
    expect(mockAdapter.setSelectAnchorAttr)
        .toHaveBeenCalledWith('aria-expanded', 'false');
  });

  it('#handleChange calls adapter.floatLabel(true) when there is a value',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.init();
       mockAdapter.floatLabel.calls.reset();
       mockAdapter.getSelectedIndex.and.returnValue(1);

       foundation.handleChange();
       expect(mockAdapter.floatLabel).toHaveBeenCalledWith(true);
       expect(mockAdapter.floatLabel).toHaveBeenCalledTimes(1);
     });

  it('#handleChange calls adapter.floatLabel(false) when there is no value and the select is not focused',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getSelectedIndex.and.returnValue(numbers.UNSET_INDEX);

       foundation.handleChange();
       expect(mockAdapter.floatLabel).toHaveBeenCalledWith(false);
       expect(mockAdapter.floatLabel).toHaveBeenCalledTimes(1);
     });

  it('#handleChange does not call adapter.floatLabel(false) when there is no value if the select is focused',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getSelectedIndex.and.returnValue(numbers.UNSET_INDEX);
       mockAdapter.hasClass.withArgs(cssClasses.FOCUSED).and.returnValue(true);

       foundation.handleChange();
       expect(mockAdapter.floatLabel).not.toHaveBeenCalledWith(false);
     });

  it('#handleChange does not call adapter.floatLabel() when no label is present',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasLabel.and.returnValue(false);

       foundation.handleChange();
       expect(mockAdapter.floatLabel)
           .not.toHaveBeenCalledWith(jasmine.anything());
     });

  it('#handleChange calls foundation.notchOutline(true) when there is a value',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getSelectedIndex.and.returnValue(1);
       foundation.init();
       foundation.notchOutline = jasmine.createSpy('');

       foundation.handleChange();
       expect(foundation.notchOutline).toHaveBeenCalledWith(true);
       expect(foundation.notchOutline).toHaveBeenCalledTimes(1);
     });

  it('#handleChange calls foundation.notchOutline(false) when there is no value',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.notchOutline = jasmine.createSpy('');
       mockAdapter.getSelectedIndex.and.returnValue(numbers.UNSET_INDEX);

       foundation.handleChange();
       expect(foundation.notchOutline).toHaveBeenCalledWith(false);
       expect(foundation.notchOutline).toHaveBeenCalledTimes(1);
     });

  it('#handleChange does not call foundation.notchOutline() when there is no label',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.notchOutline = jasmine.createSpy('');
       mockAdapter.hasLabel.and.returnValue(false);

       foundation.handleChange();
       expect(foundation.notchOutline)
           .not.toHaveBeenCalledWith(jasmine.anything());
     });

  it('#handleChange calls adapter.notifyChange()', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.handleChange();
    expect(mockAdapter.notifyChange).toHaveBeenCalledWith(jasmine.anything());
    expect(mockAdapter.notifyChange).toHaveBeenCalledTimes(1);
  });

  it('#handleFocus calls foundation.layout()', () => {
    const {foundation} = setupTest();
    foundation.layout = jasmine.createSpy('layout');
    foundation.handleFocus();
    expect(foundation.layout).toHaveBeenCalledTimes(1);
  });

  it('#handleFocus calls adapter.activateBottomLine()', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.handleFocus();
    expect(mockAdapter.activateBottomLine).toHaveBeenCalledTimes(1);
  });

  it('#handleFocus calls adapter.activateBottomLine() if isMenuOpen=true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       (foundation as any).isMenuOpen = true;
       foundation.handleFocus();
       expect(mockAdapter.activateBottomLine).toHaveBeenCalledTimes(1);
     });

  it('#handleBlur calls foundation.layout()', () => {
    const {foundation} = setupTest();
    (foundation as any).layout = jasmine.createSpy('');
    foundation.handleBlur();
    expect((foundation as any).layout).toHaveBeenCalledTimes(1);
  });

  it('#handleBlur calls adapter.deactivateBottomLine()', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.handleBlur();
    expect(mockAdapter.deactivateBottomLine).toHaveBeenCalledTimes(1);
  });

  it('#handleBlur does not call deactivateBottomLine if isMenuOpen=true',
     () => {
       const {foundation, mockAdapter} = setupTest();
       (foundation as any).isMenuOpen = true;
       foundation.handleBlur();
       expect(mockAdapter.deactivateBottomLine).not.toHaveBeenCalled();
     });

  it('#handleBlur calls helperText.setValidity(true) if menu is not open',
     () => {
       const hasIcon = true;
       const hasHelperText = true;
       const {foundation, mockAdapter, helperText} =
           setupTest(hasIcon, hasHelperText);
       mockAdapter.hasClass.withArgs(cssClasses.REQUIRED).and.returnValue(true);
       mockAdapter.getSelectedIndex.and.returnValue(0);
       foundation.init();
       foundation.handleBlur();
       expect(helperText.setValidity).toHaveBeenCalledWith(true);
       expect(helperText.setValidity).toHaveBeenCalledTimes(1);
     });

  it('#openMenu opens the menu', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.openMenu();
    expect(mockAdapter.openMenu).toHaveBeenCalledTimes(1);
  });

  it('#openMenu sets aria-expanded', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.openMenu();
    expect(mockAdapter.setSelectAnchorAttr)
        .toHaveBeenCalledWith('aria-expanded', 'true');
  });

  it('#openMenu adds activated class', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.openMenu();
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.ACTIVATED);
  });

  it('#handleClick closes menu if isMenuOpen=true', () => {
    const {foundation, mockAdapter} = setupTest();
    (foundation as any).isMenuOpen = true;
    foundation.handleClick(0);
    expect(mockAdapter.closeMenu).toHaveBeenCalled();
  });

  it('#handleClick does nothing if disabled', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation['disabled'] = true;
    foundation.handleClick(0);
    expect(mockAdapter.setRippleCenter).not.toHaveBeenCalled();
    expect(mockAdapter.addClass).not.toHaveBeenCalled();
  });

  it('#handleClick sets the ripple center if isMenuOpen=false', () => {
    const {foundation, mockAdapter} = setupTest();
    (foundation as any).isMenuOpen = false;
    foundation.handleClick(0);
    expect(mockAdapter.setRippleCenter).toHaveBeenCalledWith(0);
    expect(mockAdapter.setRippleCenter).toHaveBeenCalledTimes(1);
  });

  it('#handleClick opens the menu if the select is focused and isMenuOpen=false',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.FOCUSED).and.returnValue(true);
       (foundation as any).isMenuOpen = false;
       foundation.handleClick(0);
       expect(mockAdapter.openMenu).toHaveBeenCalledTimes(1);
     });

  it('#handleClick sets the aria-expanded', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.handleClick(0);
    expect(mockAdapter.setSelectAnchorAttr)
        .toHaveBeenCalledWith('aria-expanded', 'true');
  });

  it('#handleClick adds activated class if isMenuOpen=false', () => {
    const {foundation, mockAdapter} = setupTest();
    (foundation as any).isMenuOpen = false;
    foundation.handleClick(0);
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.ACTIVATED);
  });

  it('#handleKeydown calls adapter.openMenu if valid keys are pressed, menu is not open and select is focused',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('');
       const event = {key: 'Enter', preventDefault} as any;
       mockAdapter.hasClass.withArgs(cssClasses.FOCUSED).and.returnValue(true);
       foundation.handleKeydown(event);
       event.key = 'Spacebar';
       (foundation as any).isMenuOpen = false;
       foundation.handleKeydown(event);
       event.key = 'ArrowUp';
       (foundation as any).isMenuOpen = false;
       foundation.handleKeydown(event);
       event.key = 'ArrowDown';
       (foundation as any).isMenuOpen = false;
       foundation.handleKeydown(event);
       event.key = '';
       event.keyCode = 13;  // Enter
       (foundation as any).isMenuOpen = false;
       foundation.handleKeydown(event);
       event.keyCode = 32;  // Space
       (foundation as any).isMenuOpen = false;
       foundation.handleKeydown(event);
       event.keyCode = 38;  // Up
       (foundation as any).isMenuOpen = false;
       foundation.handleKeydown(event);
       event.keyCode = 40;  // Down
       (foundation as any).isMenuOpen = false;
       foundation.handleKeydown(event);
       expect(mockAdapter.openMenu).toHaveBeenCalledTimes(8);

       checkNumTimesSpyCalledWithArgs(
           mockAdapter.addClass, [cssClasses.ACTIVATED], 8);
       checkNumTimesSpyCalledWithArgs(
           mockAdapter.setSelectAnchorAttr, ['aria-expanded', 'true'], 8);
       expect(preventDefault).toHaveBeenCalledTimes(8);
     });

  it('#handleKeydown does not call adapter.openMenu if Enter/Space key is pressed, and select is not focused',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('');
       const event = {key: 'Enter', preventDefault} as any;
       mockAdapter.hasClass.withArgs(cssClasses.FOCUSED).and.returnValue(false);
       foundation.handleKeydown(event);
       event.key = 'Spacebar';
       foundation.handleKeydown(event);
       event.key = 'ArrowUp';
       foundation.handleKeydown(event);
       event.key = 'ArrowDown';
       foundation.handleKeydown(event);
       event.key = '';
       event.keyCode = 13;  // Enter
       foundation.handleKeydown(event);
       event.keyCode = 32;  // Space
       foundation.handleKeydown(event);
       event.keyCode = 38;  // Up
       foundation.handleKeydown(event);
       event.keyCode = 40;  // Down
       foundation.handleKeydown(event);
       expect(mockAdapter.openMenu).not.toHaveBeenCalled();
       expect(preventDefault).not.toHaveBeenCalled();
     });

  it('#handleKeydown does not call adapter.openMenu if menu is opened', () => {
    const {foundation, mockAdapter} = setupTest();
    const preventDefault = jasmine.createSpy('');
    const event = {key: 'Enter', preventDefault} as any;
    (foundation as any).isMenuOpen = true;
    foundation.handleKeydown(event);
    event.key = 'Spacebar';
    foundation.handleKeydown(event);
    event.key = 'ArrowUp';
    foundation.handleKeydown(event);
    event.key = 'ArrowDown';
    foundation.handleKeydown(event);
    event.key = '';
    event.keyCode = 13;  // Enter
    foundation.handleKeydown(event);
    event.keyCode = 32;  // Space
    foundation.handleKeydown(event);
    event.keyCode = 38;  // Up
    foundation.handleKeydown(event);
    event.keyCode = 40;  // Down
    foundation.handleKeydown(event);
    expect(mockAdapter.openMenu).not.toHaveBeenCalled();
    expect(preventDefault).not.toHaveBeenCalled();
  });

  it('#handleKeydown arrowUp decrements selected index when select is focused',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('');

       mockAdapter.hasClass.withArgs(cssClasses.FOCUSED).and.returnValue(true);
       mockAdapter.getMenuItemValues.and.returnValue(['zero', 'one', 'two']);
       mockAdapter.getMenuItemCount.and.returnValue(3);
       mockAdapter.getSelectedIndex.and.returnValue(2);

       foundation.init();

       const event = {key: 'ArrowUp', preventDefault} as any;
       foundation.handleKeydown(event);
       expect(mockAdapter.setSelectedIndex).toHaveBeenCalledWith(1);

       mockAdapter.getSelectedIndex.and.returnValue(1);
       foundation['isMenuOpen'] = false;
       event.key = '';
       event.keyCode = 38;  // Up
       foundation.handleKeydown(event);
       expect(mockAdapter.setSelectedIndex).toHaveBeenCalledWith(0);

       // Further ArrowUps should be no-ops once we're at first item
       mockAdapter.getSelectedIndex.and.returnValue(0);
       foundation['isMenuOpen'] = false;
       event.key = 'ArrowUp';
       event.keyCode = undefined;
       foundation.handleKeydown(event);

       event.key = '';
       event.keyCode = 38;  // Up
       foundation.handleKeydown(event);

       expect(foundation.getSelectedIndex()).toEqual(0);
       expect(mockAdapter.notifyChange).toHaveBeenCalledTimes(2);
     });

  it('#handleKeydown arrowDown increments selected index when select is focused',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('');

       mockAdapter.hasClass.withArgs(cssClasses.FOCUSED).and.returnValue(true);
       mockAdapter.getMenuItemValues.and.returnValue(['zero', 'one', 'two']);
       mockAdapter.getMenuItemCount.and.returnValue(3);
       mockAdapter.getSelectedIndex.and.returnValue(0);
       foundation.init();

       const event = {key: 'ArrowDown', preventDefault} as any;
       foundation.handleKeydown(event);
       expect(mockAdapter.setSelectedIndex).toHaveBeenCalledWith(1);

       mockAdapter.getSelectedIndex.and.returnValue(1);
       foundation['isMenuOpen'] = false;
       event.key = '';
       event.keyCode = 40;  // Down
       foundation.handleKeydown(event);
       expect(mockAdapter.setSelectedIndex).toHaveBeenCalledWith(2);

       // Further ArrowDowns should be no-ops once we're at last item
       mockAdapter.getSelectedIndex.and.returnValue(2);
       foundation['isMenuOpen'] = false;
       event.key = 'ArrowDown';
       event.keyCode = undefined;
       foundation.handleKeydown(event);

       event.key = '';
       event.keyCode = 40;  // Down
       foundation.handleKeydown(event);

       expect(mockAdapter.notifyChange).toHaveBeenCalledTimes(2);
     });

  it('#handleKeydown with alphanumeric characters calls adapter.getTypeaheadNextIndex',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('');
       const event = {key: 'a', preventDefault} as any;
       mockAdapter.hasClass.withArgs(cssClasses.FOCUSED).and.returnValue(true);

       foundation.handleKeydown(event);
       event.key = 'Z';
       foundation.handleKeydown(event);
       event.key = '1';
       foundation.handleKeydown(event);

       expect(mockAdapter.typeaheadMatchItem).toHaveBeenCalledTimes(3);
       expect(preventDefault).toHaveBeenCalledTimes(3);
     });

  it('#handleKeydown with spacebar character when typeahead is in progress ' +
         'calls adapter.getTypeaheadNextIndex',
     () => {
       const {foundation, mockAdapter} = setupTest();
       const preventDefault = jasmine.createSpy('');
       const event = {key: 'Spacebar', preventDefault} as any;
       mockAdapter.hasClass.withArgs(cssClasses.FOCUSED).and.returnValue(true);
       mockAdapter.isTypeaheadInProgress.and.returnValue(true);
       foundation.handleKeydown(event);

       expect(mockAdapter.typeaheadMatchItem).toHaveBeenCalledTimes(1);
       expect(preventDefault).toHaveBeenCalledTimes(1);
     });

  it('#handleKeydown sets selected index based on typeahead results', () => {
    const {foundation, mockAdapter} = setupTest();
    const preventDefault = jasmine.createSpy('');
    const event = {key: 'a', preventDefault} as any;
    spyOn(foundation, 'setSelectedIndex');

    mockAdapter.hasClass.withArgs(cssClasses.FOCUSED).and.returnValue(true);
    mockAdapter.typeaheadMatchItem.and.returnValue(2);

    foundation.handleKeydown(event);

    expect(foundation.setSelectedIndex).toHaveBeenCalledWith(2);
  });

  it('#layout notches outline and floats label if unfocused and value is nonempty',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.init();
       foundation.notchOutline = jasmine.createSpy('');
       mockAdapter.getSelectedIndex.and.returnValue(1);

       foundation.layout();
       expect(foundation.notchOutline).toHaveBeenCalledWith(true);
       expect(mockAdapter.floatLabel).toHaveBeenCalledWith(true);
     });

  it('#layout un-notches outline and un-floats label if unfocused and value is empty',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.notchOutline = jasmine.createSpy('');
       foundation.layout();
       expect(foundation.notchOutline).toHaveBeenCalledWith(false);
       expect(mockAdapter.floatLabel).toHaveBeenCalledWith(false);
     });

  it('#layout notches outline and floats label if select is focused', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.notchOutline = jasmine.createSpy('');
    mockAdapter.hasClass.withArgs(cssClasses.FOCUSED).and.returnValue(true);
    foundation.layout();
    expect(foundation.notchOutline).toHaveBeenCalledWith(true);
    expect(mockAdapter.floatLabel).toHaveBeenCalledWith(true);
  });

  it('#layout does not notch outline nor floats label if label does not exist',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.notchOutline = jasmine.createSpy('');
       mockAdapter.hasLabel.and.returnValue(false);
       foundation.layout();
       expect(foundation.notchOutline).not.toHaveBeenCalled();
       expect(mockAdapter.floatLabel).not.toHaveBeenCalled();
     });

  it('#layout sets label as required if select is required', () => {
     const {foundation, mockAdapter} = setupTest();
     mockAdapter.hasLabel.and.returnValue(true);
     mockAdapter.hasClass.withArgs(cssClasses.REQUIRED).and.returnValue(true);
     foundation.layout();
     expect(mockAdapter.setLabelRequired).toHaveBeenCalledWith(true);
   });

  it('#layoutOptions refetches menu item values to cache', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.layoutOptions();
    expect(mockAdapter.getMenuItemValues).toHaveBeenCalled();
  });

  it('#layoutOptions reinitializes selected nonempty value', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();
    mockAdapter.getMenuItemCount.and.returnValue(3);
    mockAdapter.getMenuItemValues.and.returnValue(['zero', 'one', 'two']);
    mockAdapter.getSelectedIndex.and.returnValue(2);

    foundation.layoutOptions();
    expect(mockAdapter.setSelectedIndex).toHaveBeenCalledWith(2);
  });

  it('#layoutOptions reinitializes selected empty value', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();
    mockAdapter.getMenuItemCount.and.returnValue(3);
    mockAdapter.getMenuItemValues.and.returnValue(['', 'one', 'two']);
    mockAdapter.getSelectedIndex.and.returnValue(0);

    foundation.layoutOptions();
    expect(mockAdapter.setSelectedIndex).toHaveBeenCalledWith(0);
  });

  it('#setLeadingIconAriaLabel sets the aria-label of the leading icon element',
     () => {
       const {foundation, leadingIcon} = setupTest();
       foundation.setLeadingIconAriaLabel('foo');
       expect(leadingIcon.setAriaLabel).toHaveBeenCalledWith('foo');
       expect(leadingIcon.setAriaLabel).toHaveBeenCalledTimes(1);
     });

  it('#setLeadingIconContent sets the content of the leading icon element',
     () => {
       const {foundation, leadingIcon} = setupTest();
       foundation.setLeadingIconContent('foo');
       expect(leadingIcon.setContent).toHaveBeenCalledWith('foo');
       expect(leadingIcon.setContent).toHaveBeenCalledTimes(1);
     });

  it('#setLeadingIconAriaLabel does nothing if the leading icon element is undefined',
     () => {
       const hasLeadingIcon = false;
       const {foundation, leadingIcon} = setupTest(hasLeadingIcon);
       expect(() => foundation.setLeadingIconAriaLabel).not.toThrow();
       expect(leadingIcon.setAriaLabel).not.toHaveBeenCalledWith('foo');
     });

  it('#setLeadingIconContent does nothing if the leading icon element is undefined',
     () => {
       const hasLeadingIcon = false;
       const {foundation, leadingIcon} = setupTest(hasLeadingIcon);
       expect(() => foundation.setLeadingIconContent).not.toThrow();
       expect(leadingIcon.setContent).not.toHaveBeenCalledWith('foo');
     });

  it('#setHelperTextContent sets the content of the helper text element',
     () => {
       const hasIcon = false;
       const hasHelperText = true;
       const {foundation, helperText} = setupTest(hasIcon, hasHelperText);
       foundation.setHelperTextContent('foo');
       expect(helperText.setContent).toHaveBeenCalledWith('foo');
     });

  it('#setHelperTextContent does not throw an error if there is no helperText element',
     () => {
       const hasIcon = false;
       const hasHelperText = false;
       const {foundation} = setupTest(hasIcon, hasHelperText);
       expect(() => foundation.setHelperTextContent).not.toThrow();
     });

  it('#setSelectedIndex', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.setSelectedIndex(1);
    expect(mockAdapter.setSelectedIndex).toHaveBeenCalledWith(1);

    foundation.setSelectedIndex(0);
    // We intentionally call this twice, expecting notifyChange to be called
    // only once for these two calls.
    foundation.setSelectedIndex(0);
    expect(mockAdapter.setSelectedIndex).toHaveBeenCalledWith(0);

    foundation.setSelectedIndex(-1);
    expect(mockAdapter.setSelectedIndex).toHaveBeenCalledWith(-1);

    expect(mockAdapter.notifyChange).toHaveBeenCalledTimes(3);
  });

  it('#setValue', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.init();
    foundation.setValue('bar');
    expect(mockAdapter.setSelectedIndex).toHaveBeenCalledWith(1);
    expect(mockAdapter.notifyChange).toHaveBeenCalledTimes(1);
  });

  it('#setValid true sets aria-invalid to false and removes invalid classes',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.setValid(true);
       expect(mockAdapter.setSelectAnchorAttr)
           .toHaveBeenCalledWith('aria-invalid', 'false');
       expect(mockAdapter.removeClass).toHaveBeenCalledWith(cssClasses.INVALID);
       expect(mockAdapter.removeMenuClass)
           .toHaveBeenCalledWith(cssClasses.MENU_INVALID);
     });

  it('#setValid false sets aria-invalid to true and adds invalid class', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setValid(false);
    expect(mockAdapter.setSelectAnchorAttr)
        .toHaveBeenCalledWith('aria-invalid', 'true');
    expect(mockAdapter.addClass).toHaveBeenCalledWith(cssClasses.INVALID);
    expect(mockAdapter.addMenuClass)
        .toHaveBeenCalledWith(cssClasses.MENU_INVALID);
  });

  it('#isValid returns false if using default validity check and no index is selected',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.REQUIRED).and.returnValue(true);
       mockAdapter.hasClass.withArgs(cssClasses.DISABLED)
           .and.returnValue(false);
       mockAdapter.getSelectedIndex.and.returnValue(-1);
       foundation.init();

       expect(foundation.isValid()).toBe(false);
     });

  it('#isValid returns false if using default validity check and first index ' +
         'with empty value is selected',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.REQUIRED).and.returnValue(true);
       mockAdapter.hasClass.withArgs(cssClasses.DISABLED)
           .and.returnValue(false);
       mockAdapter.getSelectedIndex.and.returnValue(0);
       mockAdapter.getMenuItemValues.and.returnValue(['', '<--empty']);
       foundation.init();

       expect(foundation.isValid()).toBe(false);
     });

  it('#isValid returns true if using default validity check and an index is selected that has value',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.init();
       mockAdapter.hasClass.withArgs(cssClasses.REQUIRED).and.returnValue(true);
       mockAdapter.hasClass.withArgs(cssClasses.DISABLED)
           .and.returnValue(false);
       mockAdapter.getSelectedIndex.and.returnValue(0);
       foundation.init();

       expect(foundation.isValid()).toBe(true);
     });

  it('#isValid returns false if using custom false validity', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.hasClass.withArgs(cssClasses.REQUIRED).and.returnValue(false);
    mockAdapter.hasClass.withArgs(cssClasses.DISABLED).and.returnValue(false);

    foundation.setUseDefaultValidation(false);
    foundation.setValid(false);
    mockAdapter.getSelectedIndex.and.returnValue(2);

    expect(foundation.isValid()).toBe(false);
  });

  it('#isValid returns true if using custom true validity with unset index',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.REQUIRED).and.returnValue(true);
       mockAdapter.hasClass.withArgs(cssClasses.DISABLED)
           .and.returnValue(false);

       foundation.setUseDefaultValidation(false);
       foundation.setValid(true);
       mockAdapter.getSelectedIndex.and.returnValue(-1);

       expect(foundation.isValid()).toBe(true);
     });

  it('#isValid returns true if using custom true validity with first option ' +
         'selected that has empty value',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.hasClass.withArgs(cssClasses.REQUIRED).and.returnValue(true);
       mockAdapter.hasClass.withArgs(cssClasses.DISABLED)
           .and.returnValue(false);

       foundation.setUseDefaultValidation(false);
       foundation.setValid(true);
       mockAdapter.getSelectedIndex.and.returnValue(0);

       expect(foundation.isValid()).toBe(true);
     });

  it('#setRequired adds/removes ${cssClasses.REQUIRED} class name', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setRequired(true);
    checkNumTimesSpyCalledWithArgs(
        mockAdapter.addClass, [cssClasses.REQUIRED], 1);
    foundation.setRequired(false);
    checkNumTimesSpyCalledWithArgs(
        mockAdapter.removeClass, [cssClasses.REQUIRED], 1);
  });

  it('#setRequired sets aria-required through adapter', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setRequired(true);
    expect(mockAdapter.setSelectAnchorAttr)
        .toHaveBeenCalledWith('aria-required', 'true');
    foundation.setRequired(false);
    expect(mockAdapter.setSelectAnchorAttr)
        .toHaveBeenCalledWith('aria-required', 'false');
  });

  it('#setRequired sets label as required', () => {
    const {foundation, mockAdapter} = setupTest();
    foundation.setRequired(true);
    expect(mockAdapter.setLabelRequired).toHaveBeenCalledWith(true);
    mockAdapter.setLabelRequired.calls.reset();
    foundation.setRequired(false);
    expect(mockAdapter.setLabelRequired).toHaveBeenCalledWith(false);
  });

  it('#getRequired returns true if aria-required is true', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getSelectAnchorAttr.withArgs('aria-required')
        .and.returnValue('true');
    expect(foundation.getRequired()).toBe(true);
  });

  it('#getRequired returns false if aria-required is false', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getSelectAnchorAttr.withArgs('aria-required')
        .and.returnValue('false');
    expect(foundation.getRequired()).toBe(false);
  });

  it('#init calls adapter methods', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getAnchorElement.and.returnValue(true);
    foundation.init();
    expect(mockAdapter.setMenuWrapFocus).toHaveBeenCalledWith(false);
    expect(mockAdapter.setMenuAnchorElement)
        .toHaveBeenCalledWith(jasmine.anything());
    expect(mockAdapter.setMenuAnchorCorner)
        .toHaveBeenCalledWith(jasmine.anything());
  });

  it('#init emits no change events when value is preselected', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getSelectedIndex.and.returnValue(1);
    foundation.init();
    expect(mockAdapter.notifyChange).not.toHaveBeenCalled();
  });

  it('#init computes whether to notch outline exactly once when value is preselected',
     () => {
       const {foundation, mockAdapter} = setupTest();
       foundation.notchOutline = jasmine.createSpy('notchOutline');
       mockAdapter.getSelectedIndex.and.returnValue(1);
       foundation.init();
       expect(foundation.notchOutline).toHaveBeenCalledTimes(1);
     });
});
