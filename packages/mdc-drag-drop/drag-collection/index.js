/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {MDCComponent} from '@material/base';
// import {MDCRipple} from '@material/ripple';

// import MDCDialogFoundation from './foundation';
import {MDCDraggableItem} from '../draggable-item';
import * as util from '../util';

/** @enum {string} */
const ColumnMode = {
  MULTI_COLUMN: 'MULTI_COLUMN',
  SINGLE_COLUMN: 'SINGLE_COLUMN',
};

/** @enum {string} */
const DropSide = {
  BEFORE: 'BEFORE',
  AFTER: 'AFTER',
};

/** @enum {string} */
const DragState = {
  IDLE: 'IDLE',
  LONG_PRESS_WAITING: 'LONG_PRESS_WAITING',
  DRAGGING: 'DRAGGING',
};

const EventMap = {
  pointer: {
    down: 'pointerdown',
    up: 'pointerup',
    move: 'pointermove',
    cancel: 'pointercancel',
  },
  touch: {
    down: 'touchstart',
    up: 'touchend',
    move: 'touchmove',
    cancel: 'touchcancel',
  },
  mouse: {
    down: 'mousedown',
    up: 'mouseup',
    move: 'mousemove',
    cancel: null,
  },
  key: {
    down: 'keydown',
    up: 'keyup',
    move: null,
    cancel: null,
  },
};

class MDCDragManager extends MDCComponent {
  constructor(root, {draggable, delay, longPressToleranceInPx, classes} = {}) {
    super(root);
    this.delay_ = delay;
    this.longPressToleranceInPx_ = longPressToleranceInPx;
    this.itemSelector_ = draggable;
    this.classes_ = classes;
  }

  initialize() {
    this.rootEventListeners_ = new Map();
    this.globalEventListeners_ = new Map();
    this.setDragState_(DragState.IDLE);

    const keyboardEventNames = [
      EventMap.key.down,
    ];
    const pointerEventNames = [
      EventMap.pointer.down,
      EventMap.touch.down,
      EventMap.mouse.down,
    ];

    this.setRootEventListeners_(keyboardEventNames, (e) => this.handleKeyDown_(e));
    this.setRootEventListeners_(pointerEventNames, (e) => this.handlePointerDown_(e));
  }

  destroy() {
    this.removeAllRootEventListeners_();
    this.removeAllGlobalEventListeners_();
  }

  getDefaultFoundation() {
    return {
      init: () => {},
    };
  }

  on(...args) {
    return this.listen(...args);
  }

  off(...args) {
    return this.unlisten(...args);
  }

  setDragState_(newDragState) {
    console.warn(`setDragState_(${this.dragState_} -> ${newDragState})`);
    this.dragState_ = newDragState;
  }

  /*
   * Root element event listeners
   */

  setRootEventListeners_(eventNames, handlerFn) {
    if (!eventNames) {
      return;
    }
    if (typeof eventNames === 'string') {
      eventNames = [eventNames];
    }
    for (const eventName of eventNames.filter((eventName) => !!eventName)) {
      this.rootEventListeners_.set(eventName, handlerFn);
      this.root_.addEventListener(eventName, handlerFn);
    }
  }

  removeRootEventListeners_(...eventNames) {
    for (const eventName of eventNames) {
      this.root_.removeEventListener(eventName, this.rootEventListeners_.get(eventName));
      this.rootEventListeners_.delete(eventName);
    }
  }

  removeAllRootEventListeners_() {
    this.removeRootEventListeners_(...this.rootEventListeners_);
    this.rootEventListeners_.clear();
  }

  /*
   * Global event listeners
   */

  setGlobalEventListeners_(eventNames, handlerFn) {
    if (!eventNames) {
      return;
    }
    if (typeof eventNames === 'string') {
      eventNames = [eventNames];
    }
    for (const eventName of eventNames.filter((eventName) => !!eventName)) {
      this.globalEventListeners_.set(eventName, handlerFn);
      document.addEventListener(eventName, handlerFn);
    }
  }

  removeGlobalEventListeners_(...eventNames) {
    for (const eventName of eventNames) {
      document.removeEventListener(eventName, this.globalEventListeners_.get(eventName));
      this.globalEventListeners_.delete(eventName);
    }
  }

  removeAllGlobalEventListeners_() {
    this.removeGlobalEventListeners_(...Array.from(this.globalEventListeners_.keys()));
    this.globalEventListeners_.clear();
  }

  /*
   * Keyboard event handlers
   */

  handleKeyDown_(e) {

  }

  /*
   * Pointer event handlers
   */

  handlePointerDown_(e) {
    // TODO(acdvorak): Figure out how to allow both scrolling AND long press on mobile
    e.preventDefault();

    if (this.dragState_ !== DragState.IDLE) {
      return;
    }

    this.itemSourceEl_ = util.closest(e.target, this.itemSelector_);
    if (!this.itemSourceEl_) {
      return;
    }

    console.log('handlePointerDown_(' + e.type + ')');

    this.currentPointerPositionInViewport_ = util.getPointerPositionInViewport(e);
    this.currentPointerPositionRelativeToCollection_ = util.getPointerOffsetFromElement(e, this.root_);
    this.initialPointerPositionRelativeToCollection_ = util.getPointerOffsetFromElement(e, this.root_);

    const eventPrefix = util.getEventPrefix(e);
    const eventMap = EventMap[eventPrefix];

    this.setGlobalEventListeners_(eventMap.move, (e) => this.handlePointerMove_(e));
    this.setGlobalEventListeners_(eventMap.up, (e) => this.handlePointerUp_(e));
    this.setGlobalEventListeners_(eventMap.cancel, (e) => this.handlePointerCancel_(e));

    this.setDragState_(DragState.LONG_PRESS_WAITING);
    this.delayTimer_ = setTimeout(() => this.handleDragStart_(), this.delay_);

    // set timeout for delay
    // after delay, remove `pointerout` listener
  }

  handlePointerMove_(e) {
    e.preventDefault();

    console.log('handlePointerMove_(' + e.type + ')');

    this.currentPointerPositionInViewport_ = util.getPointerPositionInViewport(e);
    this.currentPointerPositionRelativeToCollection_ = util.getPointerOffsetFromElement(e, this.root_);

    if (this.dragState_ === DragState.LONG_PRESS_WAITING) {
      this.handlePointerMoveWhileWaitingForLongPress_(e);
    } else {
      this.handlePointerMoveWhileDragging_(e);
    }
  }

  handlePointerMoveWhileWaitingForLongPress_(e) {
    const pointerOffsetFromStartPosition = util.computePointOffset(
      this.currentPointerPositionRelativeToCollection_,
      this.initialPointerPositionRelativeToCollection_);

    console.log('');
    console.log('handlePointerMoveWhileWaitingForLongPress_(e):');
    console.log('x:', Math.abs(pointerOffsetFromStartPosition.x), this.longPressToleranceInPx_);
    console.log('y:', Math.abs(pointerOffsetFromStartPosition.y), this.longPressToleranceInPx_);
    console.log('');

    if (Math.abs(pointerOffsetFromStartPosition.x) > this.longPressToleranceInPx_ ||
        Math.abs(pointerOffsetFromStartPosition.y) > this.longPressToleranceInPx_) {
      this.handleDragEnd_();

      console.warn(
        'handlePointerMoveWhileWaitingForLongPress_(e): long press delay did NOT elapse. \n' +
        '(user moved pointer outside of tolerance zone):',
        pointerOffsetFromStartPosition, this.longPressToleranceInPx_);
      // TODO(acdvorak): Emit 'fakeout' event
    }
  }

  handlePointerMoveWhileDragging_(e) {
    console.log('handlePointerMoveWhileDragging_(' + e.type + ')');

    this.emit('drag:move', {originalEvent: e, originalSource: this.itemSourceEl_});
    this.setClonePosition_();
  }

  handlePointerUp_(e) {
    if (this.dragState_ !== DragState.DRAGGING) {
      // return;
    }

    console.log('handlePointerUp_(' + e.type + ')');

    this.emit('drag:release', {originalEvent: e, originalSource: this.itemSourceEl_});
    this.handleDragEnd_(e);
  }

  handlePointerCancel_(e) {
    if (this.dragState_ !== DragState.DRAGGING) {
      // return;
    }

    console.log('handlePointerCancel_(' + e.type + ')');

    this.emit('drag:cancel', {originalEvent: e, originalSource: this.itemSourceEl_});
    this.handleDragEnd_(e);
  }

  /*
   * Drag event handlers
   */

  handleDragStart_() {
    if (this.dragState_ !== DragState.LONG_PRESS_WAITING) {
      return;
    }

    console.log('handleDragStart_()');

    this.setDragState_(DragState.DRAGGING);

    const includeAncestors = true;
    this.itemCloneEl_ = this.itemSourceEl_.cloneNode(includeAncestors);
    this.itemCloneEl_.classList.add(this.classes_['mirror']);
    this.itemSourceEl_.classList.add(this.classes_['source:dragging']);
    this.itemSourceEl_.setAttribute('aria-grabbed', 'true');
    this.root_.classList.add(this.classes_['container:dragging']);

    this.setClonePosition_();
    document.body.appendChild(this.itemCloneEl_);

    this.emit('drag:start', {originalEvent: null, originalSource: this.itemSourceEl_});
  }

  handleDragEnd_(e) {
    const prevDragState = this.dragState_;
    this.setDragState_(DragState.IDLE);

    clearTimeout(this.delayTimer_);
    this.removeAllGlobalEventListeners_();

    if (prevDragState !== DragState.DRAGGING) {
      return;
    }

    console.log('handleDragEnd_(' + e.type + ')');

    this.itemCloneEl_.remove();
    this.itemCloneEl_.classList.remove(this.classes_['mirror']);
    this.itemSourceEl_.classList.remove(this.classes_['source:dragging']);
    this.itemSourceEl_.removeAttribute('aria-grabbed');
    this.root_.classList.remove(this.classes_['container:dragging']);

    this.emit('drag:stop', {originalEvent: e, originalSource: this.itemSourceEl_});
  }

  setClonePosition_() {
    const pos = this.currentPointerPositionInViewport_;
    this.itemCloneEl_.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    this.itemCloneEl_.style.margin = '0';
  }
}

// NOTE(acdvorak): This code assumes:
// 1. ALL ITEMS ARE THE SAME SIZE
// 2. HORIZONTAL AND VERTICAL ALLEYS BETWEEN ITEMS ARE IDENTICAL
//
// TODO(acdvorak): Fix bug where Drop Spacer is placed incorrectly:
// 1. Resize window so that 2 columns are visible
// 2. Drag Card #7 _before_ #3, but DON'T LET GO
// 3. Drag #7 _before_ #1
export class MDCDragCollection extends MDCComponent {
  static attachTo(root) {
    return new MDCDragCollection(root);
  }

  initialize() {
    // TODO(acdvorak): If the container is RTL, make sure the cloned "mirror" element has `dir="rtl"`.
    // const DragManager = Draggable.Draggable;
    const DragManager = MDCDragManager;
    this.dragManager_ = new DragManager(this.root_, {
      draggable: '.mdc-draggable-item',
      delay: 300,
      longPressToleranceInPx: 25,
      classes: {
        'container:dragging': 'mdc-drag-collection--dragging',
        'source:dragging': 'mdc-draggable-item--source',
        'mirror': 'mdc-draggable-item--clone',
      },
    });
    this.dragManager_.on('drag:start', (e) => this.handleDragStart_(e));
    this.dragManager_.on('drag:move', (e) => this.handleDragMove_(e));
    this.dragManager_.on('drag:stop', (e) => this.handleDragStop_(e));

    // TODO(acdvorak): Remove handler in destruct method
    util.resizeListener.registerResizeHandler((e) => this.handleResize_(e));

    const {dropSpacerEl, dropIndicatorEl} = MDCDragCollection.createDropEls_();
    this.dropSpacerEl_ = dropSpacerEl;
    this.dropIndicatorEl_ = dropIndicatorEl;

    this.resetState_();

    // this.focusTrap_ = util.createFocusTrapInstance(this.dialogSurface_, this.acceptButton_);
    // this.footerBtnRipples_ = [];
    //
    // const footerBtns = this.root_.querySelectorAll('.mdc-dialog__footer__button');
    // for (let i = 0, footerBtn; footerBtn = footerBtns[i]; i++) {
    //   this.footerBtnRipples_.push(new MDCRipple(footerBtn));
    // }
  }

  destroy() {
    // this.footerBtnRipples_.forEach((ripple) => ripple.destroy());
    super.destroy();
  }

  getDefaultFoundation() {
    return {
      init: () => {},
    };
    // return new MDCDialogFoundation({
    //   addClass: (className) => this.root_.classList.add(className),
    //   removeClass: (className) => this.root_.classList.remove(className),
    //   addBodyClass: (className) => document.body.classList.add(className),
    //   removeBodyClass: (className) => document.body.classList.remove(className),
    //   eventTargetHasClass: (target, className) => target.classList.contains(className),
    //   registerInteractionHandler: (evt, handler) => this.root_.addEventListener(evt, handler),
    //   deregisterInteractionHandler: (evt, handler) => this.root_.removeEventListener(evt, handler),
    //   registerSurfaceInteractionHandler: (evt, handler) => this.dialogSurface_.addEventListener(evt, handler),
    //   deregisterSurfaceInteractionHandler: (evt, handler) => this.dialogSurface_.removeEventListener(evt, handler),
    //   registerDocumentKeydownHandler: (handler) => document.addEventListener('keydown', handler),
    //   deregisterDocumentKeydownHandler: (handler) => document.removeEventListener('keydown', handler),
    //   registerTransitionEndHandler: (handler) => this.dialogSurface_.addEventListener('transitionend', handler),
    //   deregisterTransitionEndHandler: (handler) => this.dialogSurface_.removeEventListener('transitionend', handler),
    //   notifyAccept: () => this.emit(MDCDialogFoundation.strings.ACCEPT_EVENT),
    //   notifyCancel: () => this.emit(MDCDialogFoundation.strings.CANCEL_EVENT),
    //   trapFocusOnSurface: () => this.focusTrap_.activate(),
    //   untrapFocusOnSurface: () => this.focusTrap_.deactivate(),
    //   isDialog: (el) => el === this.dialogSurface_,
    //   layoutFooterRipples: () => this.footerBtnRipples_.forEach((ripple) => ripple.layout()),
    // });
  }

  isLTR() {
    return util.isLTR(this.root_);
  }

  static createDropEls_() {
    const dropZoneElDummyParent = document.createElement('div');
    dropZoneElDummyParent.innerHTML = `
<div class="mdc-drop-spacer"></div>
<div class="mdc-drop-indicator"></div>
  `.trim();
    const dropSpacerEl = dropZoneElDummyParent.children[0];
    const dropIndicatorEl = dropZoneElDummyParent.children[1];
    return {dropSpacerEl, dropIndicatorEl};
  }

  resetState_() {
    this.removeSingleColumnClass_();

    // TODO(acdvorak): Destroy or reuse old objects; optimize performance on low-end devices.
    const {items, rows} = this.getDraggableItems_();

    this.rowAlleyInPx_ = MDCDragCollection.getRowAlleyInPx_(rows);
    this.colAlleyInPx_ = MDCDragCollection.getColAlleyInPx_(rows);
    this.draggableItemList_ = items;
    this.rows_ = rows;
    this.dropZones_ = this.getDropZones_(rows, this.rowAlleyInPx_, this.colAlleyInPx_);
    this.activeDropZone_ = null;
    this.sourceItemEl_ = null;
    this.spacerThicknessInPx_ = MDCDragCollection.getSpacerThicknessInPx_(this.root_, rows);

    this.autoSetSingleColumnClass_();
  }

  removeDraggingStateElements_() {
    this.dropSpacerEl_.remove();
    this.dropIndicatorEl_.remove();
  }

  handleDragStart_(e) {
    this.resetState_();
    this.sourceItemEl_ = e.originalSource || e.detail.originalSource;
  }

  autoSetSingleColumnClass_() {
    if (this.isSingleColumnMode()) {
      this.addSingleColumnClass_();
    }
  }

  handleDragMove_(e) {
    // (e.originalEvent || e.detail.originalEvent).preventDefault();

    const dropZone = this.activeDropZone_ = MDCDragCollection.getDropZone_(e, this.dropZones_);

    // TODO(acdvorak): Avoid thrashing the DOM, especially on low-end devices.
    this.resetItemOffsets_(this.draggableItemList_);

    if (!dropZone) {
      this.removeDraggingStateElements_();
      return;
    }

    this.insertDropZoneElement_(dropZone);

    if (this.needsSpacer_(dropZone, this.root_)) {
      this.insertDropSpacerElement_(dropZone);
    }

    if (this.isSingleColumnMode()) {
      const curCol = this.rows_.map((row) => row[0]);
      curCol.forEach((curItemInCol, curRowIndex) => {
        this.setItemOffsetY_(curRowIndex, curItemInCol);
      });
    } else {
      const curRow = this.rows_[dropZone.rowIndex];
      curRow.forEach((curItemInRow, curColIndex) => {
        this.setItemOffsetX_(curColIndex, curItemInRow);
      });
    }
  }

  handleDragStop_(e) {
    this.resetItemOffsets_(this.draggableItemList_);
    this.removeDraggingStateElements_();

    if (this.activeDropZone_) {
      this.dropItLikeItsHot_(e);
    }

    if (this.sourceItemEl_.ripple) {
      // TODO(acdvorak): Submit PR to "draggable" repo to pass through originalEvent to drag:stop
      // TODO(acdvorak): Submit PR to "draggable" repo to listen for ESC key
      // TODO(acdvorak): Submit PR to fix Ripple so that it doesn't require an event object
      this.sourceItemEl_.ripple.deactivate({type: 'pointerup'});
    }

    this.resetState_();
  }

  // eslint-disable-next-line no-unused-vars
  handleResize_(e) {
    this.resetState_();
  }

  insertDropZoneElement_(dropZone) {
    if (this.isSingleColumnMode()) {
      this.dropIndicatorEl_.style.height = '';
      this.dropIndicatorEl_.style.width = `${dropZone.associatedItem.dragCollectionOffsetRect.width}px`;
    } else {
      this.dropIndicatorEl_.style.height = `${dropZone.associatedItem.dragCollectionOffsetRect.height}px`;
      this.dropIndicatorEl_.style.width = '';
    }

    this.insertAdjacentElement_(dropZone.associatedItem.root_, this.dropIndicatorEl_, dropZone.dropSide);
  }

  insertDropSpacerElement_(dropZone) {
    if (this.isSingleColumnMode()) {
      this.dropSpacerEl_.style.height = '';
      this.dropSpacerEl_.style.width = '';
    } else {
      this.dropSpacerEl_.style.width = `${this.spacerThicknessInPx_}px`;
      this.dropSpacerEl_.style.height = 'unset';
    }

    this.insertAdjacentElement_(this.dropIndicatorEl_, this.dropSpacerEl_, dropZone.dropSide);
  }

  isSingleColumnMode() {
    return !this.isMultiColumnMode();
  }

  isMultiColumnMode() {
    return Boolean(this.rows_) && this.rows_.length > 0 && this.rows_[0].length > 1;
  }

  addSingleColumnClass_() {
    this.root_.classList.add('mdc-drag-collection--single-column');
  }

  removeSingleColumnClass_() {
    this.root_.classList.remove('mdc-drag-collection--single-column');
  }

  needsSpacer_(dropZone) {
    if (!this.isMultiColumnMode()) {
      return false;
    }

    // TODO(acdvorak): Create a method for this in DropZone class
    const isFirstRow = dropZone.rowIndex === 0;
    // TODO(acdvorak): Create a method for this in DropZone class
    const isFirstItemInRow = this.isLTR()
      ? dropZone.isBeforeItem() && dropZone.colIndex === 0
      : dropZone.isAfterItem() && dropZone.colIndex === dropZone.lastIndexInCurRow();
    return !isFirstRow && isFirstItemInRow;
  }

  setItemOffsetY_(itemRowIndex, item) {
    const dzIsAfterItem = this.activeDropZone_.isAfterItem();
    const multiplier = (dzIsAfterItem || (itemRowIndex < this.activeDropZone_.rowIndex)) ? -1 : +1;
    item.offsetX = 0;
    item.offsetY = multiplier * (this.activeDropZone_.rowAlleyInPx_ / 2);
  }

  setItemOffsetX_(itemColIndex, item) {
    const dzIsAfterItem = this.activeDropZone_.isAfterItem();
    const multiplier = (dzIsAfterItem || (itemColIndex < this.activeDropZone_.colIndex)) ? -1 : +1;
    item.offsetY = 0;
    item.offsetX = multiplier * (this.colAlleyInPx_ / 2);
  }

  resetItemOffsets_(items) {
    items.forEach((item) => {
      item.clearOffsets();
    });
  }

  dropItLikeItsHot_(e) {
    const associatedItemEl = this.activeDropZone_.associatedItem.root_;
    const dragSourceEl = e.originalSource || e.detail.originalSource;
    const dropSide = this.activeDropZone_.dropSide;
    setTimeout(() => {
      this.insertAdjacentElement_(associatedItemEl, dragSourceEl, dropSide);
    });
  }

  /**
   * @param {!Element} refEl
   * @param {!Element} newEl
   * @param {!DropSide} dropSide
   * @private
   */
  insertAdjacentElement_(refEl, newEl, dropSide) {
    const beforeItem = dropSide === DropSide.BEFORE;

    let relPos;
    if (this.isSingleColumnMode() || util.isLTR(refEl.parentNode)) {
      relPos = beforeItem ? 'beforebegin' : 'afterend';
    } else {
      relPos = beforeItem ? 'afterend' : 'beforebegin';
    }

    // Avoid needless DOM thrashing from reinserting an element in the exact same position it already is.
    if ((relPos === 'beforebegin' && refEl.previousElementSibling !== newEl) ||
        (relPos === 'afterend' && refEl.nextElementSibling !== newEl)) {
      refEl.insertAdjacentElement(relPos, newEl);
    }
  }

  getDraggableItems_() {
    const itemEls = [].slice.call(this.root_.querySelectorAll('.mdc-draggable-item'));
    const items = itemEls
      .map(MDCDraggableItem.attachTo)
      .filter(MDCDraggableItem.isVisible)
      .sort(MDCDraggableItem.orderByCoordinate);

    const rowBuckets = new Map();
    items.forEach((item) => {
      const top = item.dragCollectionOffsetRect.top;
      if (!rowBuckets.has(top)) {
        rowBuckets.set(top, []);
      }
      rowBuckets.get(top).push(item);
    });

    const rows = [];
    rowBuckets.forEach((row) => {
      rows.push(row);
    });

    return {items, rows};
  }

  getDropZones_(rows, rowAlleyInPx, colAlleyInPx) {
    const dropZones = [];
    const columnMode = this.isSingleColumnMode() ? ColumnMode.SINGLE_COLUMN : ColumnMode.MULTI_COLUMN;

    rows.forEach((curRow, rowIndex) => {
      curRow.forEach((curItemInRow, colIndex) => {
        const createDropZone = (dropSide) => {
          return new DropZone({
            associatedItem: curItemInRow,
            dropSide,
            rowAlleyInPx,
            colAlleyInPx,
            rows,
            rowIndex,
            colIndex,
            columnMode,
          });
        };
        dropZones.push(createDropZone(DropSide.BEFORE));
        const addAfterRow = this.isMultiColumnMode() && colIndex === curRow.length - 1;
        const addAfterCol = this.isSingleColumnMode() && rowIndex === rows.length - 1;
        if (addAfterRow || addAfterCol) {
          dropZones.push(createDropZone(DropSide.AFTER));
        }
      });
    });

    return dropZones;
  }

  static getDropZone_(e, dropZones) {
    const pointerPositionInViewport = util.getPointerPositionInViewport(e);
    for (const curDropZone of dropZones) {
      if (curDropZone.intersectsViewportPoint(pointerPositionInViewport)) {
        if (curDropZone.isAdjacentToDragSource()) {
          return null;
        }
        return curDropZone;
      }
    }
    return null;
  }

  /**
   * @param {!Array<!MDCDraggableItem>} rows
   * @returns {number}
   * @private
   */
  static getColAlleyInPx_(rows) {
    if (rows.length < 1 || rows[0].length < 2) {
      return 0;
    }
    const firstRow = rows[0];
    return firstRow[1].dragCollectionOffsetRect.left - firstRow[0].dragCollectionOffsetRect.right;
  }

  /**
   * @param {!Array<!MDCDraggableItem>} rows
   * @returns {number}
   * @private
   */
  static getRowAlleyInPx_(rows) {
    if (rows.length < 2) {
      return 0;
    }
    const firstRow = rows[0];
    const secondRow = rows[1];
    return secondRow[0].dragCollectionOffsetRect.top - firstRow[0].dragCollectionOffsetRect.bottom;
  }

  /**
   * @param {!Element} dragCollectionEl
   * @param {!Array<!MDCDraggableItem>} rows
   * @returns {number}
   * @private
   */
  static getSpacerThicknessInPx_(dragCollectionEl, rows) {
    if (rows.length === 0 || rows[0].length === 0) {
      return 0;
    }

    const firstRow = rows[0];

    if (util.isLTR(dragCollectionEl)) {
      const lastItem = firstRow[firstRow.length - 1];
      // TODO(acdvorak): Don't assume px units
      const lastItemMarginRight = parseInt(getComputedStyle(lastItem.root_).marginRight, 10);
      const lastItemOffsetRight = lastItem.dragCollectionOffsetRect.right + lastItemMarginRight;
      const offsetParentWidth = lastItem.dragCollectionEl.getBoundingClientRect().width;
      return offsetParentWidth - lastItemOffsetRight;
    } else {
      const lastItem = firstRow[0];
      // TODO(acdvorak): Don't assume px units
      const lastItemMarginLeft = parseInt(getComputedStyle(lastItem.root_).marginLeft, 10);
      return lastItem.dragCollectionOffsetRect.left - lastItemMarginLeft;
    }
  }
}

/** Represents an area of the screen where a draggable item can be dropped. */
class DropZone {
  constructor({associatedItem, dropSide, rows, rowIndex, colIndex, rowAlleyInPx, colAlleyInPx, columnMode} = {}) {
    this.associatedItem = associatedItem;
    this.dropSide = dropSide;
    this.rows_ = rows;
    this.rowIndex = rowIndex;
    this.colIndex = colIndex;
    this.colAlleyInPx_ = colAlleyInPx;
    this.rowAlleyInPx_ = rowAlleyInPx;
    this.columnMode_ = columnMode;

    if (this.isSingleColumnMode()) {
      this.horizontalToleranceInPx_ = this.colAlleyInPx_ / 2;
      this.verticalToleranceInPx_ = this.associatedItem.dragCollectionOffsetRect.height / 2;
    } else {
      this.horizontalToleranceInPx_ = this.associatedItem.dragCollectionOffsetRect.width / 2;
      this.verticalToleranceInPx_ = this.rowAlleyInPx_ / 2;
    }

    this.dragCollectionOffsetRect = this.calculateParentOffsetRect_();
  }

  isSingleColumnMode() {
    return this.columnMode_ === ColumnMode.SINGLE_COLUMN;
  }

  calculateParentOffsetRect_() {
    const associatedItemParentOffsetRect = this.associatedItem.dragCollectionOffsetRect;
    const parentOffsetRect = {};

    if (this.isSingleColumnMode()) {
      parentOffsetRect.left = parentOffsetRect.x = associatedItemParentOffsetRect.left;
      parentOffsetRect.top = parentOffsetRect.y =
        (this.isBeforeItem()
          ? associatedItemParentOffsetRect.top - this.rowAlleyInPx_
          : associatedItemParentOffsetRect.bottom);
      parentOffsetRect.bottom = parentOffsetRect.top + this.rowAlleyInPx_;
      parentOffsetRect.right = associatedItemParentOffsetRect.right;
    } else {
      parentOffsetRect.top = parentOffsetRect.y = associatedItemParentOffsetRect.top;
      parentOffsetRect.left = parentOffsetRect.x =
        (this.isBeforeItem()
          ? associatedItemParentOffsetRect.left - this.colAlleyInPx_
          : associatedItemParentOffsetRect.right);
      parentOffsetRect.right = parentOffsetRect.left + this.colAlleyInPx_;
      parentOffsetRect.bottom = associatedItemParentOffsetRect.bottom;
    }

    // Include tolerances
    parentOffsetRect.top -= this.verticalToleranceInPx_;
    parentOffsetRect.bottom += this.verticalToleranceInPx_;
    parentOffsetRect.left -= this.horizontalToleranceInPx_;
    parentOffsetRect.right += this.horizontalToleranceInPx_;

    parentOffsetRect.width = parentOffsetRect.right - parentOffsetRect.left;
    parentOffsetRect.height = parentOffsetRect.bottom - parentOffsetRect.top;

    return parentOffsetRect;
  }

  intersectsViewportPoint(viewportPoint) {
    // The properties below need to be recalculated every time the pointer moves to ensure that scrolling while dragging
    // works (and uses the correct coordinates).
    const collectionViewportRect = this.associatedItem.dragCollectionEl.getBoundingClientRect();
    const parentOffsetPoint = {
      x: viewportPoint.x - collectionViewportRect.left,
      y: viewportPoint.y - collectionViewportRect.top,
    };
    return util.pointIntersectsRect(parentOffsetPoint, this.dragCollectionOffsetRect);
  }

  // TODO(acdvorak): Abstract away LTR logic?
  isAdjacentToDragSource() {
    if (this.isSingleColumnMode()) {
      return this.associatedItem.isDragSource() || this.prevItemInPrevRowIsDragSource_();
    }
    return this.userDraggedAssociatedItemInCurRow_() ||
           this.userDraggedFirstItemInCurRowToAfterLastItemInPrevRow_() ||
           this.userDraggedLastItemInCurRowToBeforeFirstItemInNextRow_();
  }

  userDraggedAssociatedItemInCurRow_() {
    // prevent drag to adjacent left || prevent drag to adjacent right
    return this.associatedItem.isDragSource() || this.prevAssociatedItemInSameRowIsDragSource_();
  }

  // LTR: User dragged first item in row (N) to after last item in row (N - 1).
  // TODO(acdvorak): It feels like this function (and everything it calls) should belong to a different class.
  userDraggedFirstItemInCurRowToAfterLastItemInPrevRow_() {
    return this.isAdjacentToLastItemInCurRow_() && this.nextItemInNextRowIsDragSource_();
  }

  // LTR: User dragged last item in row (N) to before first item in row (N + 1).
  // TODO(acdvorak): It feels like this function (and everything it calls) should belong to a different class.
  userDraggedLastItemInCurRowToBeforeFirstItemInNextRow_() {
    return this.isAdjacentToFirstItemInNextRow_() && this.prevItemInPrevRowIsDragSource_();
  }

  prevAssociatedItemInSameRowIsDragSource_() {
    // A drop zone attached to the *right* side of a item will always have the same associatedItem value as its
    // sister drop zone on the *left* side of the same item. As a result, if the user drags the second-to-last
    // item to after the last item in a row, omitting this check would lead to the drag being blocked, which is
    // incorrect behavior.
    if (this.isAfterItem()) {
      return false;
    }

    const prevItemInSameRow = this.prevItemInSameRow_();
    return Boolean(prevItemInSameRow) && prevItemInSameRow.isDragSource();
  }

  isAdjacentToLastItemInCurRow_() {
    return this.colIndex === (this.isLTR() ? this.lastIndexInCurRow() : 0);
  }

  isAdjacentToFirstItemInNextRow_() {
    return this.colIndex === (this.isLTR() ? 0 : this.lastIndexInCurRow());
  }

  nextItemInNextRowIsDragSource_() {
    const nextItemInNextRow = this.nextItemInNextRow_();
    const nextItemIsDragSource = Boolean(nextItemInNextRow) && nextItemInNextRow.isDragSource();
    const isLTRish = this.isSingleColumnMode() || this.isLTR();
    return nextItemIsDragSource && (isLTRish ? this.isAfterItem() : this.isBeforeItem());
  }

  prevItemInPrevRowIsDragSource_() {
    const prevItemInPrevRow = this.prevItemInPrevRow_();
    const prevItemIsDragSource = Boolean(prevItemInPrevRow) && prevItemInPrevRow.isDragSource();
    const isLTRish = this.isSingleColumnMode() || this.isLTR();
    return prevItemIsDragSource && (isLTRish ? this.isBeforeItem() : this.isAfterItem());
  }

  nextItemInNextRow_() {
    const nextRow = this.nextRow_();
    return nextRow ? nextRow[this.isLTR() ? 0 : nextRow.length - 1] : null;
  }

  prevItemInPrevRow_() {
    const prevRow = this.prevRow_();
    return prevRow ? prevRow[this.isLTR() ? prevRow.length - 1 : 0] : null;
  }

  prevItemInSameRow_() {
    return this.curRow_()[this.colIndex - 1];
  }

  isBeforeItem() {
    // In multi-column mode LTR, 'before' means 'to the left of'.
    // In multi-column mode RTL, 'before' means 'to the right of'.
    // In single-column mode, 'before' means 'above'.
    return this.dropSide === DropSide.BEFORE;
  }

  isAfterItem() {
    // In multi-column mode LTR, 'after' means 'to the right of'.
    // In multi-column mode RTL, 'after' means 'to the left of'.
    // In single-column mode, 'after' means 'below'.
    return this.dropSide === DropSide.AFTER;
  }

  lastIndexInCurRow() {
    return this.curRow_().length - 1;
  }

  curRow_() {
    return this.rows_[this.rowIndex];
  }

  nextRow_() {
    return this.rows_[this.rowIndex + 1];
  }

  prevRow_() {
    return this.rows_[this.rowIndex - 1];
  }

  isLTR() {
    return util.isLTR(this.associatedItem.root_.parentNode);
  }
}
