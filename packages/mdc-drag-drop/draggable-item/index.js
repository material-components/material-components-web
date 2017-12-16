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
import * as util from '../util';

export class MDCDraggableItem extends MDCComponent {
  static attachTo(root) {
    return new MDCDraggableItem(root);
  }

  initialize() {
    this.dragCollectionEl = util.closest(this.root_, '.mdc-drag-collection');
    this.dragCollectionOffsetRect = util.getElementOffset(this.root_, this.dragCollectionEl);
    this.offsetX_ = 0;
    this.offsetY_ = 0;

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

  clearOffsets() {
    this.offsetX_ = 0;
    this.offsetY_ = 0;
    this.root_.style.transform = '';
  }

  get offsetX() {
    return this.offsetX_;
  }

  set offsetX(offsetX) {
    this.offsetX_ = offsetX;
    // TODO(acdvorak): Find a way to do this that won't prevent clients from being able to use `transform`.
    this.root_.style.transform = this.offsetX_ ? `translateX(${this.offsetX_}px)` : '';
  }

  get offsetY() {
    return this.offsetY_;
  }

  set offsetY(offsetY) {
    this.offsetY_ = offsetY;
    // TODO(acdvorak): Find a way to do this that won't prevent clients from being able to use `transform`.
    this.root_.style.transform = this.offsetY_ ? `translateY(${this.offsetY_}px)` : '';
  }

  isDragSource() {
    return this.root_.getAttribute('aria-grabbed') === 'true';
  }

  static isVisible(item) {
    return item.dragCollectionOffsetRect.width > 0 && item.dragCollectionOffsetRect.height > 0;
  }

  static orderByCoordinate(firstItem, secondItem) {
    const topDelta = firstItem.dragCollectionOffsetRect.top - secondItem.dragCollectionOffsetRect.top;
    const leftDelta = firstItem.dragCollectionOffsetRect.left - secondItem.dragCollectionOffsetRect.left;
    return topDelta || leftDelta;
  }
}
