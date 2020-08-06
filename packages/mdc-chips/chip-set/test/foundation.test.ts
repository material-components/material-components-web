/**
 * @license
 * Copyright 2017 Google Inc.
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


import {setUpFoundationTest} from '../../../../testing/helpers/setup';
import {MDCChipSetFoundation} from '../../../mdc-chips/chip-set/foundation';
import {EventSource, strings} from '../../../mdc-chips/chip/constants';

const {cssClasses} = MDCChipSetFoundation;

describe('MDCChipSetFoundation', () => {
  it('exports strings', () => {
    expect('strings' in MDCChipSetFoundation).toBeTruthy();
  });

  it('exports cssClasses', () => {
    expect('cssClasses' in MDCChipSetFoundation).toBeTruthy();
  });

  const setupTest = () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCChipSetFoundation);
    mockAdapter.hasClass.withArgs(cssClasses.CHOICE).and.returnValue(false);
    mockAdapter.hasClass.withArgs(cssClasses.FILTER).and.returnValue(false);
    return {foundation, mockAdapter};
  };

  it('in choice chips, #select does nothing if chip is already selected',
     () => {
       const {foundation, mockAdapter} =
           setupChipNavigationTest(['chipA', 'chipB']);
       mockAdapter.hasClass.withArgs(cssClasses.CHOICE).and.returnValue(true);
       foundation.select('chipA');
       foundation.select('chipA');
       expect(mockAdapter.selectChipAtIndex)
           .toHaveBeenCalledWith(0, true, false);
       expect(mockAdapter.selectChipAtIndex).toHaveBeenCalledTimes(1);
       expect(foundation.getSelectedChipIds().length).toEqual(1);
     });

  it('in choice chips, #select selects chip if no chips are selected', () => {
    const {foundation, mockAdapter} =
        setupChipNavigationTest(['chipA', 'chipB']);
    mockAdapter.hasClass.withArgs(cssClasses.CHOICE).and.returnValue(true);
    expect(foundation.getSelectedChipIds().length).toEqual(0);

    foundation.select('chipA');
    expect(mockAdapter.selectChipAtIndex).toHaveBeenCalledWith(0, true, false);
    expect(foundation.getSelectedChipIds().length).toEqual(1);
  });

  it('in choice chips, #select deselects chip if another chip is selected',
     () => {
       const {foundation, mockAdapter} =
           setupChipNavigationTest(['chipA', 'chipB']);
       mockAdapter.hasClass.withArgs(cssClasses.CHOICE).and.returnValue(true);
       foundation.select('chipB');
       expect(foundation.getSelectedChipIds().length).toEqual(1);

       foundation.select('chipA');
       expect(mockAdapter.selectChipAtIndex)
           .toHaveBeenCalledWith(1, false, false);
       expect(mockAdapter.selectChipAtIndex)
           .toHaveBeenCalledWith(0, true, false);
       expect(foundation.getSelectedChipIds().length).toEqual(1);
     });

  it('in filter chips, #select selects multiple chips', () => {
    const {foundation, mockAdapter} =
        setupChipNavigationTest(['chipA', 'chipB']);
    mockAdapter.hasClass.withArgs(cssClasses.FILTER).and.returnValue(true);
    expect(foundation.getSelectedChipIds().length).toEqual(0);

    foundation.select('chipA');
    expect(mockAdapter.selectChipAtIndex).toHaveBeenCalledWith(0, true, false);
    expect(foundation.getSelectedChipIds().length).toEqual(1);

    foundation.select('chipB');
    expect(mockAdapter.selectChipAtIndex).toHaveBeenCalledWith(1, true, false);
    expect(foundation.getSelectedChipIds().length).toEqual(2);
  });

  it('in filter chips, #select does nothing if chip is already selected',
     () => {
       const {foundation, mockAdapter} =
           setupChipNavigationTest(['chipA', 'chipB']);
       mockAdapter.hasClass.withArgs(cssClasses.FILTER).and.returnValue(true);
       foundation.select('chipA');
       foundation.select('chipA');
       expect(mockAdapter.selectChipAtIndex)
           .toHaveBeenCalledWith(0, true, false);
       expect(mockAdapter.selectChipAtIndex).toHaveBeenCalledTimes(1);
       expect(foundation.getSelectedChipIds().length).toEqual(1);
     });

  it('in filter chips, #handleChipInteraction deselects chip if in selectedChipId',
     () => {
       const {foundation, mockAdapter} =
           setupChipNavigationTest(['chipA', 'chipB']);
       mockAdapter.hasClass.withArgs(cssClasses.FILTER).and.returnValue(true);
       foundation.handleChipInteraction({chipId: 'chipA'});
       foundation.handleChipInteraction({chipId: 'chipB'});
       expect(foundation.getSelectedChipIds().length).toEqual(2);

       foundation.handleChipInteraction({chipId: 'chipB'});
       expect(mockAdapter.selectChipAtIndex)
           .toHaveBeenCalledWith(1, false, true);
       expect(foundation.getSelectedChipIds().length).toEqual(1);

       foundation.handleChipInteraction({chipId: 'chipA'});
       expect(mockAdapter.selectChipAtIndex)
           .toHaveBeenCalledWith(0, false, true);
       expect(foundation.getSelectedChipIds().length).toEqual(0);
     });

  it('#handleChipInteraction selects chip if the chip set is a filter chip set and notifies clients',
     () => {
       const {foundation, mockAdapter} =
           setupChipNavigationTest(['chipA', 'chipB']);
       mockAdapter.hasClass.withArgs(cssClasses.FILTER).and.returnValue(true);

       foundation.handleChipInteraction({chipId: 'chipA'});
       expect(mockAdapter.selectChipAtIndex)
           .toHaveBeenCalledWith(0, true, /** notifies clients */ true);
     });

  it('#handleChipInteraction selects chip if the chip set is a choice chip set and notifies clients',
     () => {
       const {foundation, mockAdapter} =
           setupChipNavigationTest(['chipA', 'chipB']);
       mockAdapter.hasClass.withArgs(cssClasses.CHOICE).and.returnValue(true);

       foundation.handleChipInteraction({chipId: 'chipA'});
       expect(mockAdapter.selectChipAtIndex)
           .toHaveBeenCalledWith(0, true, /** notifies clients */ true);
     });

  it('#handleChipInteraction removes focus from all chips except the selected one',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getChipListCount.and.returnValue(4);
       mockAdapter.getIndexOfChipById.and.returnValue(1);

       foundation.handleChipInteraction({chipId: 'chipA'});
       expect(mockAdapter.removeFocusFromChipAtIndex).toHaveBeenCalledWith(0);
       expect(mockAdapter.removeFocusFromChipAtIndex).toHaveBeenCalledWith(2);
       expect(mockAdapter.removeFocusFromChipAtIndex).toHaveBeenCalledWith(3);
     });

  it('#handleChipInteraction does nothing if the chip set is neither choice nor filter',
     () => {
       const {foundation, mockAdapter} =
           setupChipNavigationTest(['chipA', 'chipB', 'chipC']);

       foundation.handleChipInteraction({chipId: 'chipA'});
       expect(mockAdapter.selectChipAtIndex).not.toHaveBeenCalledWith(0, true);
     });

  it('#handleChipSelection selects an unselected chip if selected is true',
     () => {
       const {foundation} = setupTest();

       foundation.selectedChipIds_ = [];
       foundation.select = jasmine.createSpy('');
       foundation.handleChipSelection(
           {chipId: 'chipA', selected: true, shouldIgnore: false});
       expect(foundation.select).toHaveBeenCalledWith('chipA');
     });

  it('#handleChipSelection does nothing if selected is true and the chip is already selected',
     () => {
       const {foundation} = setupTest();

       foundation.selectedChipIds_ = ['chipA'];
       foundation.select = jasmine.createSpy('');
       foundation.handleChipSelection(
           {chipId: 'chipA', selected: true, shouldIgnore: false});
       expect(foundation.select).not.toHaveBeenCalledWith('chipA');
     });

  it('#handleChipSelection deselects a selected chip if selected is false',
     () => {
       const {foundation} = setupTest();

       foundation.selectedChipIds_ = ['chipA'];
       foundation.handleChipSelection(
           {chipId: 'chipA', selected: false, shouldIgnore: false});
       expect(foundation.selectedChipIds_.length).toEqual(0);
     });

  it('#handleChipSelection does nothing if selected is false and the chip is not selected',
     () => {
       const {foundation} = setupTest();

       foundation.selectedChipIds_ = ['chipB'];
       foundation.handleChipSelection(
           {chipId: 'chipA', selected: false, shouldIgnore: false});
       expect(foundation.selectedChipIds_.length).toEqual(1);
     });

  it('#handleChipSelection does nothing if shouldIgnore is true', () => {
    const {foundation} = setupTest();

    foundation.selectedChipIds_ = ['chipB'];
    foundation.select = jasmine.createSpy('');
    foundation.handleChipSelection(
        {chipId: 'chipA', selected: true, shouldIgnore: true});
    expect(foundation.select).not.toHaveBeenCalledWith('chipA');
  });

  it('#handleChipSelection emits no events', () => {
    const {foundation, mockAdapter} = setupTest();

    foundation.selectedChipIds_ = [];
    mockAdapter.getIndexOfChipById.and.returnValue(0);

    foundation.handleChipSelection(
        {chipId: 'chipA', selected: true, shouldIgnore: false});
    expect(mockAdapter.selectChipAtIndex)
        .toHaveBeenCalledWith(0, true, /** shouldNotify */ false);
    foundation.handleChipSelection(
        {chipId: 'chipA', selected: false, shouldIgnore: false});
    expect(mockAdapter.selectChipAtIndex)
        .toHaveBeenCalledWith(0, false, /** shouldNotify */ false);
  });

  it('#handleChipRemoval removes chip', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getIndexOfChipById.and.returnValue(1);

    foundation.handleChipRemoval({chipId: 'chipA', removedAnnouncement: null});
    expect(mockAdapter.removeChipAtIndex).toHaveBeenCalledWith(1);
  });

  it('#handleChipRemoval removes focus from all chips except the next one',
     () => {
       const {foundation, mockAdapter} = setupTest();
       mockAdapter.getChipListCount.and.returnValue(4);
       mockAdapter.getIndexOfChipById.and.returnValue(1);

       foundation.handleChipRemoval(
           {chipId: 'chipA', removedAnnouncement: null});
       expect(mockAdapter.removeFocusFromChipAtIndex).toHaveBeenCalledWith(0);
       expect(mockAdapter.removeFocusFromChipAtIndex).toHaveBeenCalledWith(2);
     });

  it('#handleChipRemoval gives focus to the next chip', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getChipListCount.and.returnValue(4);
    mockAdapter.getIndexOfChipById.and.returnValue(1);

    foundation.handleChipRemoval({chipId: 'chipA', removedAnnouncement: null});
    expect(mockAdapter.focusChipTrailingActionAtIndex).toHaveBeenCalledWith(1);
  });

  it('#handleChipRemoval if empty do not focus', () => {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getChipListCount.and.returnValue(0);
    mockAdapter.getIndexOfChipById.and.returnValue(1);

    foundation.handleChipRemoval({chipId: 'chipA', removedAnnouncement: null});
    expect(mockAdapter.focusChipTrailingActionAtIndex).not.toHaveBeenCalled();
  });

  function setupChipNavigationTest(chipIds: string[], isRTL = false) {
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getIndexOfChipById.and.callFake((id: string) => {
      for (let i = 0; i < chipIds.length; i++) {
        if (chipIds[i] === id) {
          return i;
        }
      }
      return -1;
    });
    mockAdapter.getChipListCount.and.returnValue(chipIds.length);
    mockAdapter.isRTL.and.returnValue(isRTL);
    return {foundation, mockAdapter};
  }

  it('#handleChipNavigation "Space" does nothing', () => {
    const {foundation, mockAdapter} =
        setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

    foundation.handleChipNavigation(
        {chipId: 'chip1', key: 'Space', source: EventSource.NONE});
    expect(mockAdapter.focusChipPrimaryActionAtIndex)
        .not.toHaveBeenCalledWith(jasmine.any(Number));
    expect(mockAdapter.focusChipTrailingActionAtIndex)
        .not.toHaveBeenCalledWith(jasmine.any(Number));
  });

  [strings.ARROW_RIGHT_KEY, strings.IE_ARROW_RIGHT_KEY].forEach((key) => {
    it(`#handleChipNavigation "${key}" focuses the next chip primary action`,
       () => {
         const {foundation, mockAdapter} =
             setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

         foundation.handleChipNavigation(
             {chipId: 'chip1', key, source: EventSource.PRIMARY});
         expect(mockAdapter.focusChipPrimaryActionAtIndex)
             .toHaveBeenCalledWith(2);
       });
  });

  [strings.ARROW_RIGHT_KEY, strings.IE_ARROW_RIGHT_KEY].forEach((key) => {
    it(`#handleChipNavigation "${
           key}" removes focus from all chips except the next one`,
       () => {
         const {foundation, mockAdapter} =
             setupChipNavigationTest(['chip0', 'chip1', 'chip2', 'chip3']);

         foundation.handleChipNavigation(
             {chipId: 'chip1', key, source: EventSource.PRIMARY});
         expect(mockAdapter.removeFocusFromChipAtIndex).toHaveBeenCalledWith(0);
         expect(mockAdapter.removeFocusFromChipAtIndex).toHaveBeenCalledWith(1);
         expect(mockAdapter.removeFocusFromChipAtIndex).toHaveBeenCalledWith(3);
       });
  });

  [strings.ARROW_LEFT_KEY,
   strings.IE_ARROW_LEFT_KEY,
   strings.ARROW_RIGHT_KEY,
   strings.IE_ARROW_RIGHT_KEY,
   strings.ARROW_UP_KEY,
   strings.IE_ARROW_UP_KEY,
   strings.ARROW_DOWN_KEY,
   strings.IE_ARROW_DOWN_KEY,
   strings.HOME_KEY,
   strings.END_KEY,
  ].forEach((key) => {
    it(`#handleChipNavigation "${
           key}" removes focus from N-1 chips (all except the next)`,
       () => {
         const {foundation, mockAdapter} =
             setupChipNavigationTest(['chip0', 'chip1', 'chip2', 'chip3']);

         foundation.handleChipNavigation(
             {chipId: 'chip1', source: EventSource.PRIMARY, key});
         expect(mockAdapter.removeFocusFromChipAtIndex)
             .toHaveBeenCalledWith(jasmine.any(Number));
         expect(mockAdapter.removeFocusFromChipAtIndex)
             .toHaveBeenCalledTimes(3);
       });
  });

  [strings.ARROW_RIGHT_KEY, strings.IE_ARROW_RIGHT_KEY].forEach((key) => {
    it(`#handleChipNavigation "${
           key}" focuses the previous chip trailing action in RTL`,
       () => {
         const {foundation, mockAdapter} =
             setupChipNavigationTest(['chip0', 'chip1', 'chip2'], true);

         foundation.handleChipNavigation(
             {chipId: 'chip1', key, source: EventSource.PRIMARY});
         expect(mockAdapter.focusChipTrailingActionAtIndex)
             .toHaveBeenCalledWith(0);
       });
  });

  [strings.ARROW_DOWN_KEY, strings.IE_ARROW_DOWN_KEY].forEach((key) => {
    it(`#handleChipNavigation "${key}" focuses the next chip primary action`,
       () => {
         const {foundation, mockAdapter} =
             setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

         foundation.handleChipNavigation(
             {chipId: 'chip1', key, source: EventSource.PRIMARY});
         expect(mockAdapter.focusChipPrimaryActionAtIndex)
             .toHaveBeenCalledWith(2);
       });
  });

  [strings.ARROW_DOWN_KEY, strings.IE_ARROW_DOWN_KEY].forEach((key) => {
    it('#handleChipNavigation "${key}" from the trailing action focuses the next chip trailing action',
       () => {
         const {foundation, mockAdapter} =
             setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

         foundation.handleChipNavigation(
             {chipId: 'chip1', key, source: EventSource.TRAILING});
         expect(mockAdapter.focusChipTrailingActionAtIndex)
             .toHaveBeenCalledWith(2);
       });
  });

  it('#handleChipNavigation "Home" focuses the first chip primary action',
     () => {
       const {foundation, mockAdapter} =
           setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

       foundation.handleChipNavigation({
         chipId: 'chip1',
         key: strings.HOME_KEY,
         source: EventSource.PRIMARY
       });
       expect(mockAdapter.focusChipPrimaryActionAtIndex)
           .toHaveBeenCalledWith(0);
     });

  it('#handleChipNavigation "End" focuses the last chip primary action', () => {
    const {foundation, mockAdapter} =
        setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

    foundation.handleChipNavigation(
        {chipId: 'chip1', key: strings.END_KEY, source: EventSource.PRIMARY});
    expect(mockAdapter.focusChipPrimaryActionAtIndex).toHaveBeenCalledWith(2);
  });

  [strings.ARROW_RIGHT_KEY, strings.IE_ARROW_RIGHT_KEY].forEach((key) => {
    it(`#handleChipNavigation "${
           key}" from the last chip does not focus any chip action`,
       () => {
         const {foundation, mockAdapter} =
             setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

         foundation.handleChipNavigation(
             {chipId: 'chip2', key, source: EventSource.PRIMARY});
         expect(mockAdapter.focusChipPrimaryActionAtIndex)
             .not.toHaveBeenCalledWith(jasmine.any(Number));
         expect(mockAdapter.focusChipTrailingActionAtIndex)
             .not.toHaveBeenCalledWith(jasmine.any(Number));
       });
  });

  [strings.ARROW_DOWN_KEY, strings.IE_ARROW_DOWN_KEY].forEach((key) => {
    it(`#handleChipNavigation "{$key}" from the last chip does not focus any chip action`,
       () => {
         const {foundation, mockAdapter} =
             setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

         foundation.handleChipNavigation(
             {chipId: 'chip2', key, source: EventSource.PRIMARY});
         expect(mockAdapter.focusChipPrimaryActionAtIndex)
             .not.toHaveBeenCalledWith(jasmine.any(Number));
         expect(mockAdapter.focusChipTrailingActionAtIndex)
             .not.toHaveBeenCalledWith(jasmine.any(Number));
       });
  });

  [strings.ARROW_LEFT_KEY, strings.IE_ARROW_LEFT_KEY].forEach((key) => {
    it(`#handleChipNavigation "{$key}" focuses the previous chip trailing action`,
       () => {
         const {foundation, mockAdapter} =
             setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

         foundation.handleChipNavigation(
             {chipId: 'chip1', key, source: EventSource.TRAILING});
         expect(mockAdapter.focusChipTrailingActionAtIndex)
             .toHaveBeenCalledWith(0);
       });
  });

  [strings.ARROW_LEFT_KEY, strings.IE_ARROW_LEFT_KEY].forEach((key) => {
    it(`#handleChipNavigation "${
           key}" focuses the next chip primary action in RTL`,
       () => {
         const {foundation, mockAdapter} =
             setupChipNavigationTest(['chip0', 'chip1', 'chip2'], true);

         foundation.handleChipNavigation(
             {chipId: 'chip1', key, source: EventSource.TRAILING});
         expect(mockAdapter.focusChipPrimaryActionAtIndex)
             .toHaveBeenCalledWith(2);
       });
  });

  [strings.ARROW_LEFT_KEY, strings.IE_ARROW_LEFT_KEY].forEach((key) => {
    it(`#handleChipNavigation "${
           key}" from the first chip does not focus any chip action`,
       () => {
         const {foundation, mockAdapter} =
             setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

         foundation.handleChipNavigation(
             {chipId: 'chip0', key, source: EventSource.PRIMARY});
         expect(mockAdapter.focusChipPrimaryActionAtIndex)
             .not.toHaveBeenCalledWith(jasmine.any(Number));
         expect(mockAdapter.focusChipTrailingActionAtIndex)
             .not.toHaveBeenCalledWith(jasmine.any(Number));
       });
  });

  [strings.ARROW_UP_KEY, strings.IE_ARROW_UP_KEY].forEach((key) => {
    it(`#handleChipNavigation "${
           key}" from the first chip does not focus any chip`,
       () => {
         const {foundation, mockAdapter} =
             setupChipNavigationTest(['chip0', 'chip1', 'chip2']);

         foundation.handleChipNavigation(
             {chipId: 'chip0', key, source: EventSource.PRIMARY});
         expect(mockAdapter.focusChipPrimaryActionAtIndex)
             .not.toHaveBeenCalledWith(jasmine.any(Number));
         expect(mockAdapter.focusChipTrailingActionAtIndex)
             .not.toHaveBeenCalledWith(jasmine.any(Number));
       });
  });
});
