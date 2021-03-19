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

import {setUpFoundationTest} from '../../../../testing/helpers/setup';
import {ActionType, FocusBehavior} from '../../action/constants';
import {Animation} from '../../chip/constants';
import {Attributes, Events} from '../constants';
import {MDCChipSetFoundation} from '../foundation';
import {ChipAnimationEvent, ChipInteractionEvent, ChipNavigationEvent} from '../types';

interface FakeAction {
  type: ActionType;
  isSelectable: boolean;
  isSelected: boolean;
  isFocusable: boolean;
}

interface FakeChip {
  actions: FakeAction[];
  id: string;
}

function fakeMultiActionChip(id: string): FakeChip {
  return {
    actions: [
      {
        type: ActionType.PRIMARY,
        isSelectable: false,
        isSelected: false,
        isFocusable: true
      },
      {
        type: ActionType.TRAILING,
        isSelectable: false,
        isSelected: false,
        isFocusable: true
      },
    ],
    id,
  };
}

function fakeSingleActionChip(id: string): FakeChip {
  return {
    actions: [
      {
        type: ActionType.PRIMARY,
        isSelectable: false,
        isSelected: false,
        isFocusable: true
      },
      {
        type: ActionType.TRAILING,
        isSelectable: false,
        isSelected: false,
        isFocusable: false
      },
    ],
    id,
  };
}

function fakeDisabledMultiActionChip(id: string): FakeChip {
  return {
    actions: [
      {
        type: ActionType.PRIMARY,
        isSelectable: false,
        isSelected: false,
        isFocusable: false
      },
      {
        type: ActionType.TRAILING,
        isSelectable: false,
        isSelected: false,
        isFocusable: false
      },
    ],
    id,
  };
}

function fakeSelectableChip(id: string, isSelected: boolean = false): FakeChip {
  return {
    actions: [{
      type: ActionType.PRIMARY,
      isSelectable: true,
      isFocusable: true,
      isSelected
    }],
    id,
  };
}

interface TestOptions {
  chips: FakeChip[];
  supportsMultiSelection: boolean;
}

describe('MDCChipSetFoundation', () => {
  const setupTest = () => {
    const {foundation, mockAdapter} = setUpFoundationTest(MDCChipSetFoundation);
    return {foundation, mockAdapter};
  };

  function setupChipSetTest(options: TestOptions) {
    const {chips, supportsMultiSelection} = options;
    const {foundation, mockAdapter} = setupTest();
    mockAdapter.getChipIdAtIndex.and.callFake((index: number) => {
      if (index < 0 || index >= chips.length) return '';
      return chips[index].id;
    });
    mockAdapter.getChipIndexById.and.callFake((id: string) => {
      return chips.findIndex((chip) => chip.id === id);
    });
    mockAdapter.getChipActionsAtIndex.and.callFake((index: number) => {
      if (index < 0 || index >= chips.length) {
        return [];
      }
      return chips[index].actions.map((a) => a.type);
    });
    mockAdapter.getChipCount.and.callFake(() => {
      return chips.length;
    });
    mockAdapter.getAttribute.and.callFake((attr: Attributes) => {
      if (attr === Attributes.ARIA_MULTISELECTABLE && supportsMultiSelection) {
        return 'true';
      }
      return null;
    });
    mockAdapter.isChipSelectableAtIndex.and.callFake(
        (index: number, action: ActionType) => {
          if (index < 0 || index >= chips.length) {
            return false;
          }
          const actions = chips[index].actions.filter((a) => a.type === action);
          if (actions.length === 0) {
            return false;
          }
          return actions[0].isSelectable;
        });
    mockAdapter.isChipSelectedAtIndex.and.callFake(
        (index: number, action: ActionType) => {
          if (index < 0 || index >= chips.length) {
            return false;
          }
          const actions = chips[index].actions.filter((a) => a.type === action);
          if (actions.length === 0) {
            return false;
          }
          return actions[0].isSelected;
        });
    mockAdapter.isChipFocusableAtIndex.and.callFake(
        (index: number, action: ActionType) => {
          if (index < 0 || index >= chips.length) {
            return false;
          }
          const chipAction =
              chips[index].actions.find((a) => a.type === action);
          if (chipAction) {
            return chipAction.isFocusable;
          }
          return false;
        });
    mockAdapter.removeChipAtIndex.and.callFake((index: number) => {
      if (index < 0 || index >= chips.length) return;
      chips.splice(index, 1);
    });
    return {foundation, mockAdapter};
  }

  it(`#handleChipInteraction emits an interaction event`, () => {
    const {foundation, mockAdapter} = setupChipSetTest({
      chips: [
        fakeMultiActionChip('c0'),
        fakeMultiActionChip('c1'),
        fakeMultiActionChip('c2'),
      ],
      supportsMultiSelection: false,
    });
    foundation.handleChipInteraction({
      detail: {source: ActionType.PRIMARY, chipID: 'c0'},
    } as ChipInteractionEvent);

    expect(mockAdapter.emitEvent).toHaveBeenCalledWith(Events.INTERACTION, {
      chipID: 'c0',
      chipIndex: 0,
    });
  });

  it(`#handleChipInteraction focuses the source chip action`, () => {
    const {foundation, mockAdapter} = setupChipSetTest({
      chips: [
        fakeMultiActionChip('c0'),
        fakeMultiActionChip('c1'),
        fakeMultiActionChip('c2'),
      ],
      supportsMultiSelection: false,
    });
    foundation.handleChipInteraction({
      detail: {source: ActionType.PRIMARY, chipID: 'c0'},
    } as ChipInteractionEvent);

    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(0, ActionType.PRIMARY, FocusBehavior.FOCUSABLE);
  });

  it(`#handleChipInteraction unfocuses all other chip actions`, () => {
    const {foundation, mockAdapter} = setupChipSetTest({
      chips: [
        fakeMultiActionChip('c0'),
        fakeMultiActionChip('c1'),
        fakeMultiActionChip('c2'),
      ],
      supportsMultiSelection: false,
    });
    foundation.handleChipInteraction({
      detail: {source: ActionType.PRIMARY, chipID: 'c0'},
    } as ChipInteractionEvent);

    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            0, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            1, ActionType.PRIMARY, FocusBehavior.NOT_FOCUSABLE);
    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            1, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            2, ActionType.PRIMARY, FocusBehavior.NOT_FOCUSABLE);
    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            2, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
  });

  it(`#handleChipInteraction emits a selection event when the chip is selectable`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeSelectableChip('c0'),
           fakeSelectableChip('c1'),
           fakeSelectableChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipInteraction({
         detail: {
           source: ActionType.PRIMARY,
           chipID: 'c0',
           isSelectable: true,
           isSelected: false
         },
       } as ChipInteractionEvent);

       expect(mockAdapter.emitEvent).toHaveBeenCalledWith(Events.SELECTION, {
         chipID: 'c0',
         chipIndex: 0,
         isSelected: true,
       });
     });

  it(`#handleChipInteraction selects the source chip when not multiselectable`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeSelectableChip('c0'),
           fakeSelectableChip('c1'),
           fakeSelectableChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipInteraction({
         detail: {
           source: ActionType.PRIMARY,
           chipID: 'c0',
           isSelectable: true,
           isSelected: false
         },
       } as ChipInteractionEvent);

       expect(mockAdapter.setChipSelectedAtIndex)
           .toHaveBeenCalledWith(0, ActionType.PRIMARY, true);
     });

  it(`#handleChipInteraction unselects other chips when not multiselectable`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeSelectableChip('c0'),
           fakeSelectableChip('c1'),
           fakeSelectableChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipInteraction({
         detail: {
           source: ActionType.PRIMARY,
           chipID: 'c0',
           isSelectable: true,
           isSelected: false
         },
       } as ChipInteractionEvent);

       expect(mockAdapter.setChipSelectedAtIndex)
           .toHaveBeenCalledWith(1, ActionType.PRIMARY, false);
       expect(mockAdapter.setChipSelectedAtIndex)
           .toHaveBeenCalledWith(2, ActionType.PRIMARY, false);
     });

  it(`#handleChipInteraction only selects the source chip when multiselectable`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeSelectableChip('c0'),
           fakeSelectableChip('c1'),
           fakeSelectableChip('c2'),
         ],
         supportsMultiSelection: true,
       });
       foundation.handleChipInteraction({
         detail: {
           source: ActionType.PRIMARY,
           chipID: 'c0',
           isSelectable: true,
           isSelected: false
         },
       } as ChipInteractionEvent);

       // Only expect it to be called once for the selection
       expect(mockAdapter.setChipSelectedAtIndex).toHaveBeenCalledTimes(1);
     });

  it(`#handleChipInteraction selects the source chip when multiselectable`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeSelectableChip('c0'),
           fakeSelectableChip('c1'),
           fakeSelectableChip('c2'),
         ],
         supportsMultiSelection: true,
       });
       foundation.handleChipInteraction({
         detail: {
           source: ActionType.PRIMARY,
           chipID: 'c0',
           isSelectable: true,
           isSelected: false
         },
       } as ChipInteractionEvent);

       expect(mockAdapter.setChipSelectedAtIndex)
           .toHaveBeenCalledWith(0, ActionType.PRIMARY, true);
     });

  it(`#handleChipInteraction does not unselect other chips when multiselectable`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeSelectableChip('c0'),
           fakeSelectableChip('c1'),
           fakeSelectableChip('c2'),
         ],
         supportsMultiSelection: true,
       });
       foundation.handleChipInteraction({
         detail: {
           source: ActionType.PRIMARY,
           chipID: 'c0',
           isSelectable: true,
           isSelected: false
         },
       } as ChipInteractionEvent);

       // Only expect it to be called once for the selection
       expect(mockAdapter.setChipSelectedAtIndex).toHaveBeenCalledTimes(1);
     });

  it(`#handleChipInteraction starts the exit animation on the source chip when removable`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeMultiActionChip('c0'),
           fakeMultiActionChip('c1'),
           fakeMultiActionChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipInteraction({
         detail: {
           chipID: 'c1',
           shouldRemove: true,
         },
       } as ChipInteractionEvent);

       expect(mockAdapter.startChipAnimationAtIndex)
           .toHaveBeenCalledWith(1, Animation.EXIT);
     });

  it(`#handleChipInteraction emits a removal event when the source chip is removable`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeMultiActionChip('c0'),
           fakeMultiActionChip('c1'),
           fakeMultiActionChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipInteraction({
         detail: {
           chipID: 'c1',
           shouldRemove: true,
         },
       } as ChipInteractionEvent);

       expect(mockAdapter.emitEvent).toHaveBeenCalledWith(Events.REMOVAL, {
         chipID: 'c1',
         chipIndex: 1,
         isComplete: false,
       });
     });

  it(`#handleChipInteraction does not emit an interaction event when the source chip is removable`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeMultiActionChip('c0'),
           fakeMultiActionChip('c1'),
           fakeMultiActionChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipInteraction({
         detail: {
           chipID: 'c1',
           shouldRemove: true,
         },
       } as ChipInteractionEvent);

       expect(mockAdapter.emitEvent)
           .not.toHaveBeenCalledWith(Events.INTERACTION, jasmine.anything());
     });

  it(`#handleChipInteraction does not change focus when the source chip is removable`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeMultiActionChip('c0'),
           fakeMultiActionChip('c1'),
           fakeMultiActionChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipInteraction({
         detail: {
           chipID: 'c1',
           shouldRemove: true,
         },
       } as ChipInteractionEvent);

       expect(mockAdapter.setChipFocusAtIndex).not.toHaveBeenCalled();
     });

  it(`#handleChipAnimation announces the added message when present`, () => {
    const {foundation, mockAdapter} = setupChipSetTest({
      chips: [
        fakeDisabledMultiActionChip('c0'),
        fakeMultiActionChip('c1'),
        fakeDisabledMultiActionChip('c2'),
      ],
      supportsMultiSelection: false,
    });
    foundation.handleChipAnimation({
      detail: {
        chipID: 'c1',
        animation: Animation.ENTER,
        addedAnnouncement: 'Added foo',
        isComplete: true,
      },
    } as ChipAnimationEvent);

    expect(mockAdapter.announceMessage).toHaveBeenCalledWith('Added foo');
  });

  it(`#handleChipAnimation removes the source chip when exit animation is complete`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeMultiActionChip('c0'),
           fakeMultiActionChip('c1'),
           fakeMultiActionChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipAnimation({
         detail: {
           chipID: 'c1',
           animation: Animation.EXIT,
           isComplete: true,
         },
       } as ChipAnimationEvent);

       expect(mockAdapter.removeChipAtIndex).toHaveBeenCalledWith(1);
     });

  it(`#handleChipAnimation emits a removal event when the source chip exit animation is complete`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeMultiActionChip('c0'),
           fakeMultiActionChip('c1'),
           fakeMultiActionChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipAnimation({
         detail: {
           chipID: 'c1',
           animation: Animation.EXIT,
           isComplete: true,
         },
       } as ChipAnimationEvent);

       expect(mockAdapter.emitEvent).toHaveBeenCalledWith(Events.REMOVAL, {
         chipID: 'c1',
         chipIndex: 1,
         isComplete: true,
       });
     });

  it(`#handleChipAnimation does not remove the source chip when the animation is incomplete`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeMultiActionChip('c0'),
           fakeMultiActionChip('c1'),
           fakeMultiActionChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipAnimation({
         detail: {
           chipID: 'c1',
           animation: Animation.EXIT,
           isComplete: false,
         },
       } as ChipAnimationEvent);

       expect(mockAdapter.removeChipAtIndex).not.toHaveBeenCalled();
     });

  it(`#handleChipAnimation does not remove the source chip for non-exit animations`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeMultiActionChip('c0'),
           fakeMultiActionChip('c1'),
           fakeMultiActionChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipAnimation({
         detail: {
           chipID: 'c1',
           animation: Animation.ENTER,
           isComplete: true,
         },
       } as ChipAnimationEvent);

       expect(mockAdapter.removeChipAtIndex).not.toHaveBeenCalled();
     });

  it(`#handleChipAnimation focuses the nearest focusable chip with a preference for the source index`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeMultiActionChip('c0'),
           fakeMultiActionChip('c1'),
           fakeMultiActionChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipAnimation({
         detail: {
           chipID: 'c1',
           animation: Animation.EXIT,
           isComplete: true,
         },
       } as ChipAnimationEvent);

       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               1, ActionType.TRAILING, FocusBehavior.FOCUSABLE_AND_FOCUSED);
     });

  it(`#handleChipAnimation focuses the nearest focusable chip (0), avoiding disabled chips`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeMultiActionChip('c0'),
           fakeDisabledMultiActionChip('c1'),
           fakeDisabledMultiActionChip('c2'),
           fakeDisabledMultiActionChip('c3'),
           fakeMultiActionChip('c4'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipAnimation({
         detail: {
           chipID: 'c4',
           animation: Animation.EXIT,
           isComplete: true,
         },
       } as ChipAnimationEvent);

       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               0, ActionType.TRAILING, FocusBehavior.FOCUSABLE_AND_FOCUSED);
     });

  it(`#handleChipAnimation focuses the nearest focusable chip (3), avoiding disabled chips`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeMultiActionChip('c0'),
           fakeDisabledMultiActionChip('c1'),
           fakeDisabledMultiActionChip('c2'),
           fakeDisabledMultiActionChip('c3'),
           fakeMultiActionChip('c4'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipAnimation({
         detail: {
           chipID: 'c0',
           animation: Animation.EXIT,
           isComplete: true,
         },
       } as ChipAnimationEvent);

       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               3, ActionType.TRAILING, FocusBehavior.FOCUSABLE_AND_FOCUSED);
     });

  it(`#handleChipAnimation focuses no chip when all remaining are disabled`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeDisabledMultiActionChip('c0'),
           fakeMultiActionChip('c1'),
           fakeDisabledMultiActionChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipAnimation({
         detail: {
           chipID: 'c1',
           animation: Animation.EXIT,
           removedAnnouncement: undefined,
           isComplete: true,
         },
       } as ChipAnimationEvent);

       expect(mockAdapter.setChipFocusAtIndex)
           .not.toHaveBeenCalledWith(0, jasmine.anything(), jasmine.anything());
       expect(mockAdapter.setChipFocusAtIndex)
           .not.toHaveBeenCalledWith(1, jasmine.anything(), jasmine.anything());
     });

  it(`#handleChipAnimation announces the removed message when present`, () => {
    const {foundation, mockAdapter} = setupChipSetTest({
      chips: [
        fakeDisabledMultiActionChip('c0'),
        fakeMultiActionChip('c1'),
        fakeDisabledMultiActionChip('c2'),
      ],
      supportsMultiSelection: false,
    });
    foundation.handleChipAnimation({
      detail: {
        chipID: 'c1',
        animation: Animation.EXIT,
        removedAnnouncement: 'Removed foo',
        isComplete: true,
      },
    } as ChipAnimationEvent);

    expect(mockAdapter.announceMessage).toHaveBeenCalledWith('Removed foo');
  });

  it(`#handleChipNavigation focuses the next available action with ArrowRight`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeMultiActionChip('c0'),
           fakeMultiActionChip('c1'),
           fakeMultiActionChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipNavigation({
         detail: {
           source: ActionType.TRAILING,
           chipID: 'c0',
           key: 'ArrowRight',
           isRTL: false,
         },
       } as ChipNavigationEvent);

       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               1, ActionType.PRIMARY, FocusBehavior.FOCUSABLE_AND_FOCUSED);
     });

  it(`#handleChipNavigation unfocuses all other actions with ArrowRight`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeMultiActionChip('c0'),
           fakeMultiActionChip('c1'),
           fakeMultiActionChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipNavigation({
         detail: {
           source: ActionType.TRAILING,
           chipID: 'c0',
           key: 'ArrowRight',
           isRTL: false,
         },
       } as ChipNavigationEvent);

       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               0, ActionType.PRIMARY, FocusBehavior.NOT_FOCUSABLE);
       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               0, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               1, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               2, ActionType.PRIMARY, FocusBehavior.NOT_FOCUSABLE);
       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               2, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
     });

  it(`#handleChipNavigation focuses the next available action with ArrowLeft`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeMultiActionChip('c0'),
           fakeMultiActionChip('c1'),
           fakeMultiActionChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipNavigation({
         detail: {
           source: ActionType.PRIMARY,
           chipID: 'c1',
           key: 'ArrowLeft',
           isRTL: false,
         },
       } as ChipNavigationEvent);

       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               0, ActionType.TRAILING, FocusBehavior.FOCUSABLE_AND_FOCUSED);
     });

  it(`#handleChipNavigation unfocuses all other actions with ArrowLeft`, () => {
    const {foundation, mockAdapter} = setupChipSetTest({
      chips: [
        fakeMultiActionChip('c0'),
        fakeMultiActionChip('c1'),
        fakeMultiActionChip('c2'),
      ],
      supportsMultiSelection: false,
    });
    foundation.handleChipNavigation({
      detail: {
        source: ActionType.PRIMARY,
        chipID: 'c1',
        key: 'ArrowLeft',
        isRTL: false,
      },
    } as ChipNavigationEvent);

    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            0, ActionType.PRIMARY, FocusBehavior.NOT_FOCUSABLE);
    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            1, ActionType.PRIMARY, FocusBehavior.NOT_FOCUSABLE);
    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            1, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            2, ActionType.PRIMARY, FocusBehavior.NOT_FOCUSABLE);
    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            2, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
  });

  it(`#handleChipNavigation focuses the next available action with ArrowRight in RTL`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeMultiActionChip('c0'),
           fakeMultiActionChip('c1'),
           fakeMultiActionChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipNavigation({
         detail: {
           source: ActionType.PRIMARY,
           chipID: 'c1',
           key: 'ArrowRight',
           isRTL: true,
         },
       } as ChipNavigationEvent);

       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               0, ActionType.TRAILING, FocusBehavior.FOCUSABLE_AND_FOCUSED);
     });

  it(`#handleChipNavigation unfocuses all other actions with ArrowRight in RTL`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeMultiActionChip('c0'),
           fakeMultiActionChip('c1'),
           fakeMultiActionChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipNavigation({
         detail: {
           source: ActionType.PRIMARY,
           chipID: 'c1',
           key: 'ArrowRight',
           isRTL: true,
         },
       } as ChipNavigationEvent);

       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               0, ActionType.PRIMARY, FocusBehavior.NOT_FOCUSABLE);
       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               1, ActionType.PRIMARY, FocusBehavior.NOT_FOCUSABLE);
       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               1, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               2, ActionType.PRIMARY, FocusBehavior.NOT_FOCUSABLE);
       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               2, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
     });

  it(`#handleChipNavigation focuses the next available action with ArrowLeft in TRL`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeMultiActionChip('c0'),
           fakeMultiActionChip('c1'),
           fakeMultiActionChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipNavigation({
         detail: {
           source: ActionType.TRAILING,
           chipID: 'c1',
           key: 'ArrowLeft',
           isRTL: true,
         },
       } as ChipNavigationEvent);

       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               2, ActionType.PRIMARY, FocusBehavior.FOCUSABLE_AND_FOCUSED);
     });

  it(`#handleChipNavigation unfocuses all other actions with ArrowLeft in RTL`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeMultiActionChip('c0'),
           fakeMultiActionChip('c1'),
           fakeMultiActionChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipNavigation({
         detail: {
           source: ActionType.TRAILING,
           chipID: 'c1',
           key: 'ArrowLeft',
           isRTL: true,
         },
       } as ChipNavigationEvent);

       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               0, ActionType.PRIMARY, FocusBehavior.NOT_FOCUSABLE);
       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               0, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               1, ActionType.PRIMARY, FocusBehavior.NOT_FOCUSABLE);
       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               1, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               2, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
     });

  it(`#handleChipNavigation does not focus unfocusable actions`, () => {
    const {foundation, mockAdapter} = setupChipSetTest({
      chips: [
        fakeMultiActionChip('c0'),
        fakeDisabledMultiActionChip('c1'),
        fakeMultiActionChip('c2'),
      ],
      supportsMultiSelection: false,
    });
    foundation.handleChipNavigation({
      detail: {
        source: ActionType.TRAILING,
        chipID: 'c0',
        key: 'ArrowRight',
        isRTL: false,
      },
    } as ChipNavigationEvent);

    expect(mockAdapter.setChipFocusAtIndex)
        .not.toHaveBeenCalledWith(
            1, ActionType.PRIMARY, FocusBehavior.FOCUSABLE_AND_FOCUSED);
    expect(mockAdapter.setChipFocusAtIndex)
        .not.toHaveBeenCalledWith(
            1, ActionType.TRAILING, FocusBehavior.FOCUSABLE_AND_FOCUSED);
  });

  it(`#handleChipNavigation focuses the next matching action with ArrowUp`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeMultiActionChip('c0'),
           fakeMultiActionChip('c1'),
           fakeMultiActionChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipNavigation({
         detail: {
           source: ActionType.PRIMARY,
           chipID: 'c1',
           key: 'ArrowUp',
           isRTL: false,
         },
       } as ChipNavigationEvent);

       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               0, ActionType.PRIMARY, FocusBehavior.FOCUSABLE_AND_FOCUSED);
     });

  it(`#handleChipNavigation unfocuses all other actions with ArrowUp`, () => {
    const {foundation, mockAdapter} = setupChipSetTest({
      chips: [
        fakeMultiActionChip('c0'),
        fakeMultiActionChip('c1'),
        fakeMultiActionChip('c2'),
      ],
      supportsMultiSelection: false,
    });
    foundation.handleChipNavigation({
      detail: {
        source: ActionType.PRIMARY,
        chipID: 'c1',
        key: 'ArrowUp',
        isRTL: false,
      },
    } as ChipNavigationEvent);

    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            0, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            1, ActionType.PRIMARY, FocusBehavior.NOT_FOCUSABLE);
    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            1, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            2, ActionType.PRIMARY, FocusBehavior.NOT_FOCUSABLE);
    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            2, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
  });

  it(`#handleChipNavigation focuses the previous matching action with ArrowDown`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeMultiActionChip('c0'),
           fakeMultiActionChip('c1'),
           fakeMultiActionChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipNavigation({
         detail: {
           source: ActionType.PRIMARY,
           chipID: 'c1',
           key: 'ArrowDown',
           isRTL: false,
         },
       } as ChipNavigationEvent);

       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               2, ActionType.PRIMARY, FocusBehavior.FOCUSABLE_AND_FOCUSED);
     });

  it(`#handleChipNavigation unfocuses all other actions with ArrowDown`, () => {
    const {foundation, mockAdapter} = setupChipSetTest({
      chips: [
        fakeMultiActionChip('c0'),
        fakeMultiActionChip('c1'),
        fakeMultiActionChip('c2'),
      ],
      supportsMultiSelection: false,
    });
    foundation.handleChipNavigation({
      detail: {
        source: ActionType.PRIMARY,
        chipID: 'c1',
        key: 'ArrowDown',
        isRTL: false,
      },
    } as ChipNavigationEvent);

    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            0, ActionType.PRIMARY, FocusBehavior.NOT_FOCUSABLE);
    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            0, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            1, ActionType.PRIMARY, FocusBehavior.NOT_FOCUSABLE);
    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            1, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            2, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
  });

  it(`#handleChipNavigation focuses the first matching action with Home`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeMultiActionChip('c0'),
           fakeMultiActionChip('c1'),
           fakeMultiActionChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipNavigation({
         detail: {
           source: ActionType.PRIMARY,
           chipID: 'c2',
           key: 'Home',
           isRTL: false,
         },
       } as ChipNavigationEvent);

       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               0, ActionType.PRIMARY, FocusBehavior.FOCUSABLE_AND_FOCUSED);
     });

  it(`#handleChipNavigation unfocuses all other actions with Home`, () => {
    const {foundation, mockAdapter} = setupChipSetTest({
      chips: [
        fakeMultiActionChip('c0'),
        fakeMultiActionChip('c1'),
        fakeMultiActionChip('c2'),
      ],
      supportsMultiSelection: false,
    });
    foundation.handleChipNavigation({
      detail: {
        source: ActionType.PRIMARY,
        chipID: 'c2',
        key: 'Home',
        isRTL: false,
      },
    } as ChipNavigationEvent);

    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            0, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            1, ActionType.PRIMARY, FocusBehavior.NOT_FOCUSABLE);
    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            1, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            2, ActionType.PRIMARY, FocusBehavior.NOT_FOCUSABLE);
    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            2, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
  });

  it(`#handleChipNavigation focuses the first matching action with End`, () => {
    const {foundation, mockAdapter} = setupChipSetTest({
      chips: [
        fakeMultiActionChip('c0'),
        fakeMultiActionChip('c1'),
        fakeMultiActionChip('c2'),
      ],
      supportsMultiSelection: false,
    });
    foundation.handleChipNavigation({
      detail: {
        source: ActionType.PRIMARY,
        chipID: 'c0',
        key: 'End',
        isRTL: false,
      },
    } as ChipNavigationEvent);

    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            2, ActionType.PRIMARY, FocusBehavior.FOCUSABLE_AND_FOCUSED);
  });

  it(`#handleChipNavigation unfocuses all other actions with End`, () => {
    const {foundation, mockAdapter} = setupChipSetTest({
      chips: [
        fakeMultiActionChip('c0'),
        fakeMultiActionChip('c1'),
        fakeMultiActionChip('c2'),
      ],
      supportsMultiSelection: false,
    });
    foundation.handleChipNavigation({
      detail: {
        source: ActionType.PRIMARY,
        chipID: 'c0',
        key: 'End',
        isRTL: false,
      },
    } as ChipNavigationEvent);

    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            0, ActionType.PRIMARY, FocusBehavior.NOT_FOCUSABLE);
    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            0, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            1, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            1, ActionType.PRIMARY, FocusBehavior.NOT_FOCUSABLE);
    expect(mockAdapter.setChipFocusAtIndex)
        .toHaveBeenCalledWith(
            2, ActionType.TRAILING, FocusBehavior.NOT_FOCUSABLE);
  });

  it(`#handleChipNavigation does not focus unfocusable actions with ArrowUp`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeSingleActionChip('c0'),  // Trailing action is not focusable
           fakeMultiActionChip('c1'),
           fakeMultiActionChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipNavigation({
         detail: {
           source: ActionType.TRAILING,
           chipID: 'c1',
           key: 'ArrowUp',
           isRTL: false,
         },
       } as ChipNavigationEvent);

       // Verify that the 0th index trailing action is not focused
       expect(mockAdapter.setChipFocusAtIndex)
           .not.toHaveBeenCalledWith(
               0, ActionType.TRAILING, FocusBehavior.FOCUSABLE_AND_FOCUSED);
     });

  it(`#handleChipNavigation focuses the available focusable action with ArrowUp`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeSingleActionChip('c0'),  // Trailing action is not focusable
           fakeMultiActionChip('c1'),
           fakeMultiActionChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipNavigation({
         detail: {
           source: ActionType.TRAILING,
           chipID: 'c1',
           key: 'ArrowUp',
           isRTL: false,
         },
       } as ChipNavigationEvent);

       // Verify that the primary action is focused
       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               0, ActionType.PRIMARY, FocusBehavior.FOCUSABLE_AND_FOCUSED);
     });

  it(`#handleChipNavigation does not focus unfocusable actions with ArrowDown`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeMultiActionChip('c0'),
           fakeSingleActionChip('c1'),  // Trailing action is not focusable
           fakeMultiActionChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipNavigation({
         detail: {
           source: ActionType.TRAILING,
           chipID: 'c0',
           key: 'ArrowDown',
           isRTL: false,
         },
       } as ChipNavigationEvent);

       // Verify that the 0th index trailing action is not focused
       expect(mockAdapter.setChipFocusAtIndex)
           .not.toHaveBeenCalledWith(
               1, ActionType.TRAILING, FocusBehavior.FOCUSABLE_AND_FOCUSED);
     });

  it(`#handleChipNavigation focuses the available focusable action with ArrowDown`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeMultiActionChip('c0'),
           fakeSingleActionChip('c1'),  // Trailing action is not focusable
           fakeMultiActionChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.handleChipNavigation({
         detail: {
           source: ActionType.TRAILING,
           chipID: 'c0',
           key: 'ArrowDown',
           isRTL: false,
         },
       } as ChipNavigationEvent);

       // Verify that the primary action is focused
       expect(mockAdapter.setChipFocusAtIndex)
           .toHaveBeenCalledWith(
               1, ActionType.PRIMARY, FocusBehavior.FOCUSABLE_AND_FOCUSED);
     });

  it(`#setChipSelected emits a selection event`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeSelectableChip('c0'),
           fakeSelectableChip('c1'),
           fakeSelectableChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.setChipSelected(0, ActionType.PRIMARY, true);

       expect(mockAdapter.emitEvent).toHaveBeenCalledWith(Events.SELECTION, {
         chipID: 'c0',
         chipIndex: 0,
         isSelected: true,
       });
     });

  it(`#setChipSelected selects the target chip when not multiselectable`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeSelectableChip('c0'),
           fakeSelectableChip('c1'),
           fakeSelectableChip('c2'),
         ],
         supportsMultiSelection: false,
       });
       foundation.setChipSelected(0, ActionType.PRIMARY, true);

       expect(mockAdapter.setChipSelectedAtIndex)
           .toHaveBeenCalledWith(0, ActionType.PRIMARY, true);
     });

  it(`#setChipSelected unselects other chips when not multiselectable`, () => {
    const {foundation, mockAdapter} = setupChipSetTest({
      chips: [
        fakeSelectableChip('c0'),
        fakeSelectableChip('c1'),
        fakeSelectableChip('c2'),
      ],
      supportsMultiSelection: false,
    });
    foundation.setChipSelected(0, ActionType.PRIMARY, true);

    expect(mockAdapter.setChipSelectedAtIndex)
        .toHaveBeenCalledWith(1, ActionType.PRIMARY, false);
    expect(mockAdapter.setChipSelectedAtIndex)
        .toHaveBeenCalledWith(2, ActionType.PRIMARY, false);
  });

  it(`#setChipSelected selects the target chip when multiselectable`, () => {
    const {foundation, mockAdapter} = setupChipSetTest({
      chips: [
        fakeSelectableChip('c0'),
        fakeSelectableChip('c1'),
        fakeSelectableChip('c2'),
      ],
      supportsMultiSelection: true,
    });
    foundation.setChipSelected(0, ActionType.PRIMARY, true);

    expect(mockAdapter.setChipSelectedAtIndex)
        .toHaveBeenCalledWith(0, ActionType.PRIMARY, true);
  });

  it(`#setChipSelected does not unselect other chips when multiselectable`,
     () => {
       const {foundation, mockAdapter} = setupChipSetTest({
         chips: [
           fakeSelectableChip('c0'),
           fakeSelectableChip('c1'),
           fakeSelectableChip('c2'),
         ],
         supportsMultiSelection: true,
       });
       foundation.setChipSelected(0, ActionType.PRIMARY, true);

       // Only expect it to be called once for the selection
       expect(mockAdapter.setChipSelectedAtIndex).toHaveBeenCalledTimes(1);
     });

  it(`#isChipSelected returns true if the chip is selected`, () => {
    const {foundation} = setupChipSetTest({
      chips: [
        fakeSelectableChip('c0', true),
        fakeSelectableChip('c1'),
        fakeSelectableChip('c2'),
      ],
      supportsMultiSelection: true,
    });

    expect(foundation.isChipSelected(0, ActionType.PRIMARY)).toBe(true);
  });

  it(`#isChipSelected returns false if the chip is not selected`, () => {
    const {foundation} = setupChipSetTest({
      chips: [
        fakeSelectableChip('c0'),
        fakeSelectableChip('c1'),
        fakeSelectableChip('c2'),
      ],
      supportsMultiSelection: true,
    });

    expect(foundation.isChipSelected(1, ActionType.PRIMARY)).toBe(false);
  });

  it(`#getSelectedChipIndexes returns the selected chip indexes`, () => {
    const {foundation} = setupChipSetTest({
      chips: [
        fakeSelectableChip('c0', true),
        fakeSelectableChip('c1'),
        fakeSelectableChip('c2', true),
      ],
      supportsMultiSelection: true,
    });

    expect(foundation.getSelectedChipIndexes().has(0)).toBe(true);
    expect(foundation.getSelectedChipIndexes().has(1)).toBe(false);
    expect(foundation.getSelectedChipIndexes().has(2)).toBe(true);
  });

  it(`#removeChip starts the removal animation at the given index`, () => {
    const {foundation, mockAdapter} = setupChipSetTest({
      chips: [
        fakeMultiActionChip('c0'),
        fakeMultiActionChip('c1'),
        fakeMultiActionChip('c2'),
      ],
      supportsMultiSelection: false,
    });
    foundation.removeChip(1);

    expect(mockAdapter.startChipAnimationAtIndex)
        .toHaveBeenCalledWith(1, Animation.EXIT);
  });

  it(`#removeChip emits the removal event at the given index`, () => {
    const {foundation, mockAdapter} = setupChipSetTest({
      chips: [
        fakeMultiActionChip('c0'),
        fakeMultiActionChip('c1'),
        fakeMultiActionChip('c2'),
      ],
      supportsMultiSelection: false,
    });
    foundation.removeChip(1);

    expect(mockAdapter.emitEvent).toHaveBeenCalledWith(Events.REMOVAL, {
      chipID: 'c1',
      chipIndex: 1,
      isComplete: false,
    });
  });

  it(`#removeChip does nothing if the index is out of bounds`, () => {
    const {foundation, mockAdapter} = setupChipSetTest({
      chips: [
        fakeMultiActionChip('c0'),
        fakeMultiActionChip('c1'),
        fakeMultiActionChip('c2'),
      ],
      supportsMultiSelection: false,
    });
    foundation.removeChip(-1);
    foundation.removeChip(3);

    expect(mockAdapter.startChipAnimationAtIndex).not.toHaveBeenCalled();
    expect(mockAdapter.emitEvent).not.toHaveBeenCalled();
  });

  it(`#addChip starts the enter animation at the given index`, () => {
    const {foundation, mockAdapter} = setupChipSetTest({
      chips: [
        fakeMultiActionChip('c0'),
        fakeMultiActionChip('c1'),
        fakeMultiActionChip('c2'),
      ],
      supportsMultiSelection: false,
    });
    foundation.addChip(0);

    expect(mockAdapter.startChipAnimationAtIndex)
        .toHaveBeenCalledWith(0, Animation.ENTER);
  });

  it(`#addChip does nothing if the index is out of bounds`, () => {
    const {foundation, mockAdapter} = setupChipSetTest({
      chips: [
        fakeMultiActionChip('c0'),
        fakeMultiActionChip('c1'),
        fakeMultiActionChip('c2'),
      ],
      supportsMultiSelection: false,
    });
    foundation.addChip(-1);
    foundation.addChip(3);

    expect(mockAdapter.startChipAnimationAtIndex).not.toHaveBeenCalled();
  });
});
