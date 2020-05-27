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

import {normalizeKey} from '@material/dom/keyboard';

import {numbers} from './constants';
import {preventDefaultEvent} from './events';
import {MDCListTextAndIndex} from './types';

/**
 * State of a typeahead instance.
 */
export interface TypeaheadState {
  typeaheadBuffer: string;
  currentFirstChar: string;
  sortedIndexCursor: number;
  bufferClearTimeout: number;
}

/**
 * Initializes a state object for typeahead. Use the same reference for calls to
 * typeahead functions.
 *
 * @return The current state of the typeahead process. Each state reference
 *     represents a typeahead instance as the reference is typically mutated
 *     in-place.
 */
export function initState(): TypeaheadState {
  const state: TypeaheadState = {
    bufferClearTimeout: 0,
    currentFirstChar: '',
    sortedIndexCursor: 0,
    typeaheadBuffer: '',
  };
  return state;
};

/**
 * Initializes typeahead state by indexing the current list items by primary
 * text into the sortedIndexByFirstChar data structure.
 *
 * @param listItemCount numer of items in the list
 * @param getPrimaryTextByItemIndex function that returns the primary text at a
 *     given index
 *
 * @return Map that maps the first character of the primary text to the full
 *     list text and it's index
 */
export function initSortedIndex(
    listItemCount: number,
    getPrimaryTextByItemIndex: (index: number) =>
        string): Map<string, MDCListTextAndIndex[]> {
  const sortedIndexByFirstChar = new Map<string, MDCListTextAndIndex[]>();

  // Aggregate item text to index mapping
  for (let i = 0; i < listItemCount; i++) {
    const primaryText = getPrimaryTextByItemIndex(i).trim();
    if (!primaryText) {
      continue;
    }

    const firstChar = primaryText[0].toLowerCase();
    if (!sortedIndexByFirstChar.has(firstChar)) {
      sortedIndexByFirstChar.set(firstChar, []);
    }
    sortedIndexByFirstChar.get(firstChar)!.push(
        {text: primaryText.toLowerCase(), index: i});
  }

  // Sort the mapping
  // TODO(b/157162694): Investigate replacing forEach with Map.values()
  sortedIndexByFirstChar.forEach((values) => {
    values.sort((first: MDCListTextAndIndex, second: MDCListTextAndIndex) => {
      return first.index - second.index;
    });
  });

  return sortedIndexByFirstChar;
};

/**
 * Arguments for matchItem
 */
export interface TypeaheadMatchItemOpts {
  focusItemAtIndex: (index: number) => void;
  nextChar: string;
  focusedItemIndex: number;
  sortedIndexByFirstChar: Map<string, MDCListTextAndIndex[]>;
  skipFocus: boolean;
  isItemAtIndexDisabled: (index: number) => boolean;
}

/**
 * Given the next desired character from the user, it attempts to find the next
 * list option matching the buffer. Wraps around if at the end of options.
 *
 * @param opts Options and accessors
 *   - nextChar - the next character to match against items
 *   - sortedIndexByFirstChar - output of `initSortedIndex(...)`
 *   - focusedItemIndex - the index of the currently focused item
 *   - focusItemAtIndex - function that focuses a list item at given index
 *   - skipFocus - whether or not to focus the matched item
 *   - isItemAtIndexDisabled - function that determines whether an item at a
 *        given index is disabled
 * @param state The typeahead state instance. See `initState`.
 *
 * @return The index of the matched item, or -1 if no match.
 */
export function matchItem(
    opts: TypeaheadMatchItemOpts, state: TypeaheadState): number {
  const {
    nextChar,
    focusItemAtIndex,
    sortedIndexByFirstChar,
    focusedItemIndex,
    skipFocus,
    isItemAtIndexDisabled,
  } = opts;

  clearTimeout(state.bufferClearTimeout);

  state.bufferClearTimeout = setTimeout(() => {
    clearBuffer(state);
  }, numbers.TYPEAHEAD_BUFFER_CLEAR_TIMEOUT_MS);

  state.typeaheadBuffer = state.typeaheadBuffer + nextChar;

  let index: number;
  if (state.typeaheadBuffer.length === 1) {
    index = matchFirstChar(
        sortedIndexByFirstChar, focusedItemIndex, isItemAtIndexDisabled, state);
  } else {
    index = matchAllChars(sortedIndexByFirstChar, isItemAtIndexDisabled, state);
  }

  if (index !== -1 && !skipFocus) {
    focusItemAtIndex(index);
  }
  return index;
};

/**
 * Matches the user's single input character in the buffer to the
 * next option that begins with such character. Wraps around if at
 * end of options. Returns -1 if no match is found.
 */
function matchFirstChar(
    sortedIndexByFirstChar: Map<string, MDCListTextAndIndex[]>,
    focusedItemIndex: number, isItemAtIndexDisabled: (index: number) => boolean,
    state: TypeaheadState): number {
  const firstChar = state.typeaheadBuffer[0];
  const itemsMatchingFirstChar = sortedIndexByFirstChar.get(firstChar);
  if (!itemsMatchingFirstChar) {
    return -1;
  }

  // Has the same firstChar been recently matched?
  // Also, did starting index remain the same between key presses?
  // If both hold true, simply increment index.
  if (firstChar === state.currentFirstChar &&
      itemsMatchingFirstChar[state.sortedIndexCursor].index ===
          focusedItemIndex) {
    state.sortedIndexCursor =
        (state.sortedIndexCursor + 1) % itemsMatchingFirstChar.length;

    const newIndex = itemsMatchingFirstChar[state.sortedIndexCursor].index;
    if (!isItemAtIndexDisabled(newIndex)) {
      return newIndex;
    }
  }

  // If we're here, it means one of the following happened:
  // - either firstChar or startingIndex has changed, invalidating the
  // cursor.
  // - The next item of typeahead is disabled, so we have to look further.
  state.currentFirstChar = firstChar;

  let newCursorPosition = -1;
  let cursorPosition;
  // Find the first non-disabled item as a fallback.
  for (cursorPosition = 0; cursorPosition < itemsMatchingFirstChar.length;
       cursorPosition++) {
    if (!isItemAtIndexDisabled(itemsMatchingFirstChar[cursorPosition].index)) {
      newCursorPosition = cursorPosition;
      break;
    }
  }

  // Advance cursor to first item matching the firstChar that is positioned
  // after starting item. Cursor is unchanged from fallback if there's no
  // such item.
  for (; cursorPosition < itemsMatchingFirstChar.length; cursorPosition++) {
    if (itemsMatchingFirstChar[cursorPosition].index > focusedItemIndex &&
        !isItemAtIndexDisabled(itemsMatchingFirstChar[cursorPosition].index)) {
      newCursorPosition = cursorPosition;
      break;
    }
  }

  if (newCursorPosition !== -1) {
    state.sortedIndexCursor = newCursorPosition;
    return itemsMatchingFirstChar[state.sortedIndexCursor].index;
  }

  return -1;
};

/**
 * Attempts to find the next item that matches all of the typeahead buffer.
 * Wraps around if at end of options. Returns -1 if no match is found.
 */
function matchAllChars(
    sortedIndexByFirstChar: Map<string, MDCListTextAndIndex[]>,
    isItemAtIndexDisabled: (index: number) => boolean,
    state: TypeaheadState): number {
  const firstChar = state.typeaheadBuffer[0];
  const itemsMatchingFirstChar = sortedIndexByFirstChar.get(firstChar);
  if (!itemsMatchingFirstChar) {
    return -1;
  }

  // Do nothing if text already matches
  const startingItem = itemsMatchingFirstChar[state.sortedIndexCursor];
  if (startingItem.text.lastIndexOf(state.typeaheadBuffer, 0) === 0 &&
      !isItemAtIndexDisabled(startingItem.index)) {
    return startingItem.index;
  }

  // Find next item that matches completely; if no match, we'll eventually
  // loop around to same position
  let cursorPosition =
      (state.sortedIndexCursor + 1) % itemsMatchingFirstChar.length;
  let nextCursorPosition = -1;
  while (cursorPosition !== state.sortedIndexCursor) {
    const currentItem = itemsMatchingFirstChar[cursorPosition];

    const matches =
        currentItem.text.lastIndexOf(state.typeaheadBuffer, 0) === 0;
    const isEnabled = !isItemAtIndexDisabled(currentItem.index);
    if (matches && isEnabled) {
      nextCursorPosition = cursorPosition;
      break;
    }

    cursorPosition = (cursorPosition + 1) % itemsMatchingFirstChar.length;
  }

  if (nextCursorPosition !== -1) {
    state.sortedIndexCursor = nextCursorPosition;
    return itemsMatchingFirstChar[state.sortedIndexCursor].index;
  }

  return -1;
};

/**
 * Whether or not the given typeahead instaance state is currently typing.
 *
 * @param state The typeahead state instance. See `initState`.
 */
export function isTypingInProgress(state: TypeaheadState) {
  return state.typeaheadBuffer.length > 0;
};

/**
 * Options for handleKeydown.
 */
export interface HandleKeydownOpts {
  event: KeyboardEvent;
  isTargetListItem: boolean;
  focusItemAtIndex: (index: number) => void;
  focusedItemIndex: number;
  sortedIndexByFirstChar: Map<string, MDCListTextAndIndex[]>;
  isItemAtIndexDisabled: (index: number) => boolean;
}

/**
 * Clears the typeahaed buffer so that it resets item matching to the first
 * character.
 *
 * @param state The typeahead state instance. See `initState`.
 */
export function clearBuffer(state: TypeaheadState) {
  state.typeaheadBuffer = '';
};

/**
 * Given a keydown event, it calculates whether or not to automatically focus a
 * list item depending on what was typed mimicing the typeahead functionality of
 * a standard <select> element that is open.
 *
 * @param opts Options and accessors
 *   - event - the KeyboardEvent to handle and parse
 *   - sortedIndexByFirstChar - output of `initSortedIndex(...)`
 *   - focusedItemIndex - the index of the currently focused item
 *   - focusItemAtIndex - function that focuses a list item at given index
 *   - isItemAtFocusedIndexDisabled - whether or not the currently focused item
 *      is disabled
 *   - isTargetListItem - whether or not the event target is a list item
 * @param state The typeahead state instance. See `initState`.
 *
 * @returns index of the item matched by the keydown. -1 if not matched.
 */
export function handleKeydown(opts: HandleKeydownOpts, state: TypeaheadState) {
  const {
    event,
    isTargetListItem,
    focusedItemIndex,
    focusItemAtIndex,
    sortedIndexByFirstChar,
    isItemAtIndexDisabled,
  } = opts;

  const isArrowLeft = normalizeKey(event) === 'ArrowLeft';
  const isArrowUp = normalizeKey(event) === 'ArrowUp';
  const isArrowRight = normalizeKey(event) === 'ArrowRight';
  const isArrowDown = normalizeKey(event) === 'ArrowDown';
  const isHome = normalizeKey(event) === 'Home';
  const isEnd = normalizeKey(event) === 'End';
  const isEnter = normalizeKey(event) === 'Enter';
  const isSpace = normalizeKey(event) === 'Spacebar';

  if (isArrowLeft || isArrowUp || isArrowRight || isArrowDown || isHome ||
      isEnd || isEnter) {
    return -1;
  }

  const isCharacterKey = !isSpace && event.key.length === 1;

  if (isCharacterKey) {
    preventDefaultEvent(event);
    const matchItemOpts: TypeaheadMatchItemOpts = {
      focusItemAtIndex,
      focusedItemIndex,
      nextChar: event.key.toLowerCase(),
      sortedIndexByFirstChar,
      skipFocus: false,
      isItemAtIndexDisabled,
    };
    return matchItem(matchItemOpts, state);
  }

  if (!isSpace) {
    return -1;
  }

  if (isTargetListItem) {
    preventDefaultEvent(event);
  }

  const typeaheadOnListItem = isTargetListItem && isTypingInProgress(state);

  if (typeaheadOnListItem) {
    const matchItemOpts: TypeaheadMatchItemOpts = {
      focusItemAtIndex,
      focusedItemIndex,
      nextChar: ' ',
      sortedIndexByFirstChar,
      skipFocus: false,
      isItemAtIndexDisabled,
    };
    // space participates in typeahead matching if in rapid typing mode
    return matchItem(matchItemOpts, state);
  }

  return -1;
};
