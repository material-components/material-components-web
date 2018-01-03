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

/** @enum {string} */
const PageSides = {
  top: 'top',
  left: 'left',
  bottom: 'bottom',
  right: 'right',
}

class MDCDragManager extends MDCComponent {
  initialize({draggable, delay, longPressToleranceInPx, classes} = {}) {
    this.delay_ = delay;
    this.longPressToleranceInPx_ = longPressToleranceInPx;
    this.itemSelector_ = draggable;
    this.classes_ = classes;
    this.rootEventListeners_ = util.createMap();
    this.globalEventListeners_ = util.createMap();
    this.setDragState_(DragState.IDLE);

    const keyboardEventNames = [
      util.EventMap.key.down,
    ];
    const pointerEventNames = [
      util.EventMap.pointer.down,
      util.EventMap.touch.down,
      util.EventMap.mouse.down,
    ];

    this.addRootEventListeners_(keyboardEventNames, (e) => this.handleKeyDown_(e));
    this.addRootEventListeners_(pointerEventNames, (e) => this.handlePointerDown_(e));

    // Prevent accidental scrolling while dragging on iOS. Don't ask me why this works.
    // Alternative techniques that seem to work:
    // 1. document.ontouchmove = function() { return true; }
    // 2. document.body.addEventListener('touchmove', function() {}, false)
    this.addRootEventListeners_(util.EventMap.touch.move, function() {}, false);

    // Mark all items as draggable and ensure that they are focusable.
    const itemEls = [].slice.call(this.root_.querySelectorAll(this.itemSelector_));
    itemEls.forEach((itemEl) => {
      if (!itemEl.hasAttribute('aria-grabbed')) {
        itemEl.setAttribute('aria-grabbed', 'false');
      }
      if (!util.matches(itemEl, '[tabindex], a[href], button')) {
        itemEl.setAttribute('tabindex', '0');
      }
    });
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

  addRootEventListeners_(eventNames, handlerFn, listenerOpts) {
    if (!eventNames) {
      return;
    }
    if (typeof eventNames === 'string') {
      eventNames = [eventNames];
    }
    eventNames.filter((eventName) => !!eventName).forEach((eventName) => {
      if (!this.rootEventListeners_.has(eventName)) {
        this.rootEventListeners_.set(eventName, []);
      }
      this.rootEventListeners_.get(eventName).push({handlerFn, listenerOpts});
      this.root_.addEventListener(eventName, handlerFn, listenerOpts);
    });
  }

  removeRootEventListeners_(...eventNames) {
    eventNames.forEach((eventName) => {
      this.rootEventListeners_.get(eventName).forEach(({handlerFn, listenerOpts}) => {
        this.root_.removeEventListener(eventName, handlerFn, listenerOpts);
      });
      this.rootEventListeners_.delete(eventName);
    });
  }

  removeAllRootEventListeners_() {
    this.removeRootEventListeners_(...this.rootEventListeners_.keys());
    this.rootEventListeners_.clear();
  }

  /*
   * Global event listeners
   */

  addGlobalEventListeners_(eventNames, handlerFn, listenerOpts) {
    if (!eventNames) {
      return;
    }
    if (typeof eventNames === 'string') {
      eventNames = [eventNames];
    }
    eventNames.filter((eventName) => !!eventName).forEach((eventName) => {
      if (!this.globalEventListeners_.has(eventName)) {
        this.globalEventListeners_.set(eventName, []);
      }
      this.globalEventListeners_.get(eventName).push({handlerFn, listenerOpts});
      document.addEventListener(eventName, handlerFn, listenerOpts);
    });
  }

  removeGlobalEventListeners_(...eventNames) {
    eventNames.forEach((eventName) => {
      this.globalEventListeners_.get(eventName).forEach(({handlerFn, listenerOpts}) => {
        document.removeEventListener(eventName, handlerFn, listenerOpts);
      });
      this.globalEventListeners_.delete(eventName);
    });
  }

  removeAllGlobalEventListeners_() {
    this.removeGlobalEventListeners_(...this.globalEventListeners_.keys());
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
    // NOTE(acdvorak): Uncommenting this line breaks some native interactions (e.g., scrolling) on mobile.
    // e.preventDefault();

    const eventPrefix = util.getEventPrefix(e);
    const eventMap = util.EventMap[eventPrefix];
    const isTouch = e.pointerType === 'touch' || eventPrefix === util.EventPrefix.TOUCH;

    if (this.dragState_ !== DragState.IDLE) {
      return;
    }

    // Ignore "mousedown" if it occurs immediately after "pointerdown" (which happens on mobile).
    if (this.currentEventPrefix_ && this.currentEventPrefix_ !== eventPrefix) {
      return;
    }

    if ('button' in e && e.button !== util.MouseButton.LEFT) {
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
    this.initialPointerPositionRelativeToItem_ = util.getPointerOffsetFromElement(e, this.itemSourceEl_);

    this.currentEventPrefix_ = eventPrefix;
    this.currentEventIsTouch_ = isTouch;

    this.addGlobalEventListeners_(eventMap.move, (e) => this.handlePointerMove_(e));
    this.addGlobalEventListeners_(eventMap.up, (e) => this.handlePointerUp_(e));
    this.addGlobalEventListeners_(eventMap.cancel, (e) => this.handlePointerCancel_(e));

    // Prevent the Chrome Dev Tools mobile emulator from displaying a context menu on long press.
    this.addGlobalEventListeners_('contextmenu', (e) => e.preventDefault());

    this.setDragState_(DragState.LONG_PRESS_WAITING);

    if (isTouch) {
      this.delayTimer_ = setTimeout(() => this.handleDragStart_(), this.delay_);
    } else {
      this.handleDragStart_(e);
    }
  }

  handlePointerMove_(e) {
    // console.log('handlePointerMove_(' + e.type + ')');

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

    const xToleranceExceeded = Math.abs(pointerOffsetFromStartPosition.x) > this.longPressToleranceInPx_;
    const yToleranceExceeded = Math.abs(pointerOffsetFromStartPosition.y) > this.longPressToleranceInPx_;

    console.log(`
handlePointerMoveWhileWaitingForLongPress_(e):
  x: ${Math.abs(pointerOffsetFromStartPosition.x)} > ${this.longPressToleranceInPx_} = ${xToleranceExceeded}
  y: ${Math.abs(pointerOffsetFromStartPosition.y)} > ${this.longPressToleranceInPx_} = ${yToleranceExceeded}
`.trim());

    if (xToleranceExceeded || yToleranceExceeded) {
      console.warn(
        'handlePointerMoveWhileWaitingForLongPress_(e): long press delay did NOT elapse. \n' +
        '(user moved pointer outside of tolerance zone):',
        pointerOffsetFromStartPosition, this.longPressToleranceInPx_);
      // TODO(acdvorak): Emit 'fakeout' event

      this.handleDragEnd_(e);
    }
  }

  handlePointerMoveWhileDragging_(e) {
    // console.log('handlePointerMoveWhileDragging_(' + e.type + ')');

    this.itemCloneEl_.style.opacity = '1';
    this.itemSourceEl_.style.opacity = '0';

    document.documentElement.classList.add('mdc-drag-touch-disabled');
    document.documentElement.classList.add('mdc-drag-select-disabled');

    this.emit('drag:move', {originalEvent: e, originalSource: this.itemSourceEl_});
    this.setClonePosition_();
  }

  handlePointerUp_(e) {
    console.log('handlePointerUp_(' + e.type + ')');

    this.emit('drag:release', {originalEvent: e, originalSource: this.itemSourceEl_});
    this.handleDragEnd_(e);
  }

  handlePointerCancel_(e) {
    console.error('handlePointerCancel_(' + e.type + '):', e);

    this.emit('drag:cancel', {originalEvent: e, originalSource: this.itemSourceEl_});
    this.handleDragEnd_(e);
  }

  /*
   * Drag event handlers
   */

  // eslint-disable-next-line no-unused-vars, camelcase
  handleDragStart_(opt_e) {
    if (this.dragState_ !== DragState.LONG_PRESS_WAITING) {
      return;
    }

    console.log('handleDragStart_()');

    this.setDragState_(DragState.DRAGGING);

    const includeAncestors = true;
    this.itemCloneEl_ = this.itemSourceEl_.cloneNode(includeAncestors);
    this.itemCloneEl_.setAttribute('dir', util.getDirectionality(this.itemSourceEl_));
    this.itemCloneEl_.classList.add(this.classes_['mirror']);
    this.itemSourceEl_.classList.add(this.classes_['source:dragging']);
    this.itemSourceEl_.setAttribute('aria-grabbed', 'true');
    this.root_.classList.add(this.classes_['container:dragging']);

    this.itemCloneEl_.style.opacity = '0';
    this.itemSourceEl_.style.opacity = '1';

    this.setClonePosition_();
    document.body.appendChild(this.itemCloneEl_);

    // Prevent native scroll/pan/zoom gestures
    this.addGlobalEventListeners_('dragstart', (e) => e.preventDefault());
    this.addGlobalEventListeners_('touchmove', (e) => e.preventDefault(), {passive: false});

    this.emit('drag:start', {originalEvent: null, originalSource: this.itemSourceEl_});
  }

  handleDragEnd_(e) {
    const prevDragState = this.dragState_;
    this.setDragState_(DragState.IDLE);

    clearTimeout(this.delayTimer_);
    this.removeAllGlobalEventListeners_();

    console.log('handleDragEnd_(' + e.type + ')');

    if (this.itemCloneEl_) {
      util.detach(this.itemCloneEl_);
      this.itemCloneEl_.classList.remove(this.classes_['mirror']);
      this.itemCloneEl_.style.opacity = '0';
    }

    if (this.itemSourceEl_) {
      this.itemSourceEl_.classList.remove(this.classes_['source:dragging']);
      this.itemSourceEl_.setAttribute('aria-grabbed', 'false');
      this.itemSourceEl_.style.opacity = '1';
    }

    this.root_.classList.remove(this.classes_['container:dragging']);
    document.documentElement.classList.remove('mdc-drag-touch-disabled');
    document.documentElement.classList.remove('mdc-drag-select-disabled');

    if (prevDragState === DragState.DRAGGING) {
      this.emit('drag:stop', {originalEvent: e, originalSource: this.itemSourceEl_});
    }
  }

  // eslint-disable-next-line camelcase
  setClonePosition_(opt_offset) {
    const pos = util.computePointOffset(
      this.currentPointerPositionInViewport_,
      this.initialPointerPositionRelativeToItem_);

    // eslint-disable-next-line camelcase
    if (opt_offset) {
      pos.x += opt_offset.x;
      pos.y += opt_offset.y;
    }

    if (this.currentEventIsTouch_) {
      // TODO(acdvorak): Parameterize
      // pos.x += 16;
      // pos.y += 16;
    }

    this.itemCloneEl_.style.transform = `translate3d(${pos.x}px, ${pos.y}px, 0)`;
    this.itemCloneEl_.style.margin = '0';
  }
}

// NOTE(acdvorak): This code assumes:
// 1. ALL ITEMS ARE THE SAME SIZE
// 2. HORIZONTAL AND VERTICAL GUTTERS BETWEEN ITEMS ARE IDENTICAL
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
    const opts = {
      draggable: '.mdc-draggable-item',
      delay: 300,
      longPressToleranceInPx: 25,
      classes: {
        'container:dragging': 'mdc-drag-collection--dragging',
        'source:dragging': 'mdc-draggable-item--source',
        'mirror': 'mdc-draggable-item--clone',
      },
    };

    this.dragManager_ = new MDCDragManager(this.root_, undefined, opts);
    this.dragManager_.on('drag:start', (e) => this.handleDragStart_(e));
    this.dragManager_.on('drag:move', (e) => this.handleDragMove_(e));
    this.dragManager_.on('drag:stop', (e) => this.handleDragStop_(e));

    // TODO(acdvorak): Remove handler in destruct method
    util.resizeListener.registerResizeHandler((e) => this.handleResize_(e));

    const {dropSpacerEl, dropIndicatorEl} = MDCDragCollection.createDropEls_();
    this.dropSpacerEl_ = dropSpacerEl;
    this.dropIndicatorEl_ = dropIndicatorEl;

    // This element only appears in the DOM when the user is able to drop an item, so we can just hard-code the
    // `aria-dropeffect` property to `move`. There's no need to reset it back to `none` when dragging ends, because the
    // element is simply detached from the DOM.
    this.dropIndicatorEl_.setAttribute('aria-dropeffect', 'move');

    this.scrollZones_ = MDCDragCollection.getScrollZones_();

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

    this.rowGutterInPx_ = MDCDragCollection.getRowGutterInPx_(rows);
    this.colGutterInPx_ = MDCDragCollection.getColGutterInPx_(rows);
    this.draggableItemList_ = items;
    this.rows_ = rows;
    this.dropZones_ = this.getDropZones_(rows, this.rowGutterInPx_, this.colGutterInPx_);
    this.activeDropZone_ = null;
    this.activeScrollZone_ = null;
    this.sourceItemEl_ = null;
    this.spacerThicknessInPx_ = MDCDragCollection.getSpacerThicknessInPx_(this.root_, rows);

    this.autoSetSingleColumnClass_();
  }

  removeDraggingStateElements_() {
    util.detach(this.dropSpacerEl_);
    util.detach(this.dropIndicatorEl_);
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
    const scrollZone = MDCDragCollection.getScrollZone_(e, this.scrollZones_);

    if(!scrollZone) {
      this.stopScrolling();
    } else {
      this.handleScrollZone_(scrollZone);
      return;
    }

    this.handleDragZone_(e);
  }

  handleDragZone_(e) {
    const dropZone = this.activeDropZone_ = MDCDragCollection.getDropZone_(e, this.dropZones_);

    // TODO(acdvorak): Avoid thrashing the DOM, especially on low-end devices.
    this.resetDropShifts_(this.draggableItemList_);

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
        this.setVerticalDropShift_(curRowIndex, curItemInCol);
      });
    } else {
      const curRow = this.rows_[dropZone.rowIndex];
      curRow.forEach((curItemInRow, curColIndex) => {
        this.setHorizontalDropShift_(curColIndex, curItemInRow);
      });
    }
  }

  handleScrollZone_(scrollZone) {
    if(!this.scrollZones_) {
      return;
    }

    const isActiveScrollZone = this.activeScrollZone_ && this.activeScrollZone_.type === scrollZone.type;

    if (isActiveScrollZone) {
      return;
    }

    this.stopScrolling();
    this.activeScrollZone_ = scrollZone;

    const scrollLoop = () => {
      const { type } = scrollZone;
      const defaultScrollSpeed = 10;
      const multiplier = type === PageSides.top || type === PageSides.left ? -1 : 1;
      const isTopOrBottom = type === PageSides.top || type === PageSides.bottom;
      const x = isTopOrBottom ? 0 : defaultScrollSpeed;
      const y = isTopOrBottom ? defaultScrollSpeed : 0;
      window.scrollBy(multiplier * x, multiplier * y);
      this.activeScrollTimer_ = requestAnimationFrame(scrollLoop);
    };
    this.activeScrollTimer_ = requestAnimationFrame(scrollLoop);
  }

  handleDragStop_(e) {
    this.resetDropShifts_(this.draggableItemList_);
    this.removeDraggingStateElements_();

    if (this.activeDropZone_) {
      this.dropItLikeItsHot_(e);
    }

    this.stopScrolling();

    if (this.sourceItemEl_ && this.sourceItemEl_.ripple) {
      // TODO(acdvorak): Submit PR to "draggable" repo to pass through originalEvent to drag:stop
      // TODO(acdvorak): Submit PR to "draggable" repo to listen for ESC key
      // TODO(acdvorak): Submit PR to fix Ripple so that it doesn't require an event object
      const eventPrefix = util.getEventPrefix(e.originalEvent || e.detail.originalEvent);
      this.sourceItemEl_.ripple.deactivate({type: util.EventMap[eventPrefix].up});

      // A second synthetic `deactivate` call (hard-coded with 'mouseup') is needed because of this check in mdc-ripple:
      // https://github.com/material-components/material-components-web/blob/a983c01676e7b2a9b4aa743f722588ecb2019e4f/packages/mdc-ripple/foundation.js#L396
      // TODO(acdvorak): Update ripple so that we don't need to call `deactivate` twice with different event types.
      this.sourceItemEl_.ripple.deactivate({type: util.EventMap['mouse'].up});
    }

    this.resetState_();
  }

  // eslint-disable-next-line no-unused-vars
  handleResize_(e) {
    this.resetState_();
  }

  stopScrolling() {
    this.activeScrollZone_ = null;
    if (this.activeScrollTimer_) {
      cancelAnimationFrame(this.activeScrollTimer_);
    }
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

  setVerticalDropShift_(itemRowIndex, item) {
    const dzIsAfterItem = this.activeDropZone_.isAfterItem();
    const multiplier = (dzIsAfterItem || (itemRowIndex < this.activeDropZone_.rowIndex)) ? -1 : +1;
    item.setDropShift({x: 0, y: multiplier * (this.activeDropZone_.rowGutterInPx_ / 2)});
  }

  setHorizontalDropShift_(itemColIndex, item) {
    const dzIsAfterItem = this.activeDropZone_.isAfterItem();
    const multiplier = (dzIsAfterItem || (itemColIndex < this.activeDropZone_.colIndex)) ? -1 : +1;
    item.setDropShift({x: multiplier * (this.colGutterInPx_ / 2), y: 0});
  }

  resetDropShifts_(items) {
    items.forEach((item) => {
      item.resetDropShift();
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

    const rowBuckets = util.createMap();
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

  getDropZones_(rows, rowGutterInPx, colGutterInPx) {
    const dropZones = [];
    const columnMode = this.isSingleColumnMode() ? ColumnMode.SINGLE_COLUMN : ColumnMode.MULTI_COLUMN;

    rows.forEach((curRow, rowIndex) => {
      curRow.forEach((curItemInRow, colIndex) => {
        const createDropZone = (dropSide) => {
          return new DropZone({
            associatedItem: curItemInRow,
            dropSide,
            rowGutterInPx,
            colGutterInPx,
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
    for (let i = 0; i < dropZones.length; i++) {
      const curDropZone = dropZones[i];
      if (curDropZone.intersectsViewportPoint(pointerPositionInViewport)) {
        if (curDropZone.isAdjacentToDragSource()) {
          return null;
        }
        return curDropZone;
      }
    }
    return null;
  }

  static getScrollZones_() {
    return Object.keys(PageSides)
      .map(k => {
        const side = PageSides[k];
        return new ScrollZone({type: side});
      });
  }

  static getScrollZone_(e, scrollZones) {
    const pointerPositionInViewport = util.getPointerPositionInViewport(e);
    for (let i = 0; i < scrollZones.length; i++) {
      const curScrollZone = scrollZones[i];
      if (curScrollZone.pointInsideOrExtendsRect(pointerPositionInViewport)) {
        return curScrollZone;
      }
    }
    return null;
  }

  /**
   * @param {!Array<!MDCDraggableItem>} rows
   * @returns {number}
   * @private
   */
  static getColGutterInPx_(rows) {
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
  static getRowGutterInPx_(rows) {
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
  constructor({associatedItem, dropSide, rows, rowIndex, colIndex, rowGutterInPx, colGutterInPx, columnMode} = {}) {
    this.associatedItem = associatedItem;
    this.dropSide = dropSide;
    this.rows_ = rows;
    this.rowIndex = rowIndex;
    this.colIndex = colIndex;
    this.colGutterInPx_ = colGutterInPx;
    this.rowGutterInPx_ = rowGutterInPx;
    this.columnMode_ = columnMode;

    if (this.isSingleColumnMode()) {
      this.horizontalToleranceInPx_ = this.colGutterInPx_ / 2;
      this.verticalToleranceInPx_ = this.associatedItem.dragCollectionOffsetRect.height / 2;
    } else {
      this.horizontalToleranceInPx_ = this.associatedItem.dragCollectionOffsetRect.width / 2;
      this.verticalToleranceInPx_ = this.rowGutterInPx_ / 2;
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
          ? associatedItemParentOffsetRect.top - this.rowGutterInPx_
          : associatedItemParentOffsetRect.bottom);
      parentOffsetRect.bottom = parentOffsetRect.top + this.rowGutterInPx_;
      parentOffsetRect.right = associatedItemParentOffsetRect.right;
    } else {
      parentOffsetRect.top = parentOffsetRect.y = associatedItemParentOffsetRect.top;
      parentOffsetRect.left = parentOffsetRect.x =
        (this.isBeforeItem()
          ? associatedItemParentOffsetRect.left - this.colGutterInPx_
          : associatedItemParentOffsetRect.right);
      parentOffsetRect.right = parentOffsetRect.left + this.colGutterInPx_;
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


class ScrollZone {
  constructor({type, verticalToleranceInPx_ = 15, horizontalToleranceInPx_ = 15}) {
    this.type = type;
    this.verticalToleranceInPx_ = verticalToleranceInPx_;
    this.horizontalToleranceInPx_ = horizontalToleranceInPx_;
  }

  getRectCoords() {
    const pos = {
      [PageSides.top]: {
        top: -Infinity,
        left: 0,
        bottom: this.verticalToleranceInPx_,
        right: window.innerWidth
      },
      [PageSides.left]: {
        top: 0,
        left: -Infinity,
        bottom: window.innerHeight,
        right: this.horizontalToleranceInPx_
      },
      [PageSides.bottom]: {
        top: window.innerHeight - this.verticalToleranceInPx_,
        left: 0,
        bottom: Infinity,
        right: window.innerWidth
      },
      [PageSides.right]: {
        top: 0,
        left: window.innerWidth - this.horizontalToleranceInPx_,
        bottom: window.innerHeight,
        right: Infinity
      },
    };
    return pos[this.type];
  }

  pointInsideOrExtendsRect({x, y}) {
    const {top, left, bottom, right} = this.getRectCoords();
    const isPointInHorizontalBounds = left <= x && x <= right;
    const isPointInVerticalBounds = top <= y && y <= bottom;
    const isInBounds = isPointInVerticalBounds && isPointInHorizontalBounds;

    return isInBounds;
  }

}
