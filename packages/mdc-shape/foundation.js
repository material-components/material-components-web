/**
 * Copyright 2017 Google Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import {MDCFoundation} from '@material/base';
import {constants} from '@material/elevation';
import {cssClasses, strings, numbers} from './constants';

export default class MDCShapeFoundation extends MDCFoundation {
  static get cssClasses() {
    return cssClasses;
  }

  static get strings() {
    return strings;
  }

  static get defaultAdapter() {
    return {
      setCanvasWidth: ( /* value: number */ ) => {},
      setCanvasHeight: ( /* value: number */ ) => {},
      getCanvasWidth: () => /* number */ 0,
      getCanvasHeight: () => /* number */ 0,
      getDevicePixelRatio: () => /* number */ 1,
      create2dRenderingContext: () =>
        /* {shadowColor: string,
                  shadowBlur: number,
                  shadowOffsetY: number,
                  fillStyle: string,
                  scale: (number, number) => void,
                  clearRect: (number, number, number, number) => void,
                  fill: (Path2D) => void}  */ ({
          shadowColor: '',
          shadowBlur: 0,
          shadowOffsetY: 0,
          fillStyle: '',
          scale: ( /* xScale: number, yScale: number */ ) => {},
          clearRect: ( /* x: number, y: number, width: number, height: number */ ) => {},
          fill: ( /* path2d: Path2D */ ) => {},
        }),
      createPath2D: ( /* path: string */ ) => /* Path2D */ {},
      setClipPathData: ( /* value: string */ ) => {},
    };
  }

  constructor(adapter) {
    super(Object.assign(MDCShapeFoundation.defaultAdapter, adapter));
    this.ctx_ = null;
    this.elevation_ = 0;
    this.ambientShadowBlur_ = 0;
    this.ambientShadowOffsetY_ = 0;
    this.penumbraShadowBlur_ = 0;
    this.penumbraShadowOffsetY_ = 0;
    this.umbraShadowBlur_ = 0;
    this.umbraShadowOffsetY_ = 0;
    this.umbraShadowSpread_ = 0;
    this.elevating_ = false;
    this.animationFrameId_ = null;
  }

  init() {
    this.ctx_ = this.adapter_.create2dRenderingContext();
    this.syncWithCanvas_();
  }

  destroy() {
    if (this.animationFrameId_) {
      cancelAnimationFrame(this.animationFrameId_);
    }
  }

  setBackground(background) {
    this.background_ = background;
  }

  setElevation(value, animate) {
    this.elevating_ = false;
    this.elevation_ = value;

    if (animate) {
      const factor = 1 / numbers.ELEVATION_ANIMATION_FRAME_COUNT;
      this.ambientShadowBlurIncrement_ =
              (this.finalAmbientShadowBlur_ - this.ambientShadowBlur_) * factor;
      this.ambientShadowOffsetYIncrement_ =
              (this.finalAmbientShadowOffsetY_ - this.ambientShadowOffsetY_) * factor;
      this.penumbraShadowBlurIncrement_ =
              (this.finalPenumbraShadowBlur_ - this.penumbraShadowBlur_) * factor;
      this.penumbraShadowOffsetYIncrement_ =
              (this.finalPenumbraShadowOffsetY_ - this.penumbraShadowOffsetY_) * factor;
      this.umbraShadowBlurIncrement_ =
              (this.finalUmbraShadowBlur_ - this.umbraShadowBlur_) * factor;
      this.umbraShadowOffsetYIncrement_ =
              (this.finalUmbraShadowOffsetY_ - this.umbraShadowOffsetY_) * factor;
      this.umbraShadowSpreadIncrement_ =
              (this.finalUmbraShadowSpread_ - this.umbraShadowSpread_) * factor;
      this.elevating_ = true;
      this.animationFrameId_ = requestAnimationFrame(() => this.elevate_());
    } else {
      this.ambientShadowBlur_ = this.finalAmbientShadowBlur_;
      this.ambientShadowOffsetY_ = this.finalAmbientShadowOffsetY_;
      this.penumbraShadowBlur_ = this.finalPenumbraShadowBlur_;
      this.penumbraShadowOffsetY_ = this.finalPenumbraShadowOffsetY_;
      this.umbraShadowBlur_ = this.finalUmbraShadowBlur_;
      this.umbraShadowOffsetY_ = this.finalUmbraShadowOffsetY_;
      this.umbraShadowSpread_ = this.finalUmbraShadowSpread_;
    }
  }

  redraw() {
    this.syncWithCanvas_();
    this.clear_();
    this.draw_();
  }

  syncWithCanvas_() {
    const devicePixelRatio = this.adapter_.getDevicePixelRatio();
    this.adapter_.setCanvasWidth(this.adapter_.getCanvasWidth() * devicePixelRatio);
    this.adapter_.setCanvasHeight(this.adapter_.getCanvasHeight() * devicePixelRatio);
    this.ctx_.scale(devicePixelRatio, devicePixelRatio);
  }

  generateClipPath_() {
    return this.generatePath_(
      this.adapter_.getCanvasWidth() - (numbers.SHADOW_PADDING * 2),
      this.adapter_.getCanvasHeight() - (numbers.SHADOW_PADDING * 2),
      0);
  }

  generateShadowPath_(shadowSpread) {
    return this.generatePath_(
      this.adapter_.getCanvasWidth(),
      this.adapter_.getCanvasHeight(),
      numbers.SHADOW_PADDING - shadowSpread);
  }

  generatePath_( /* width: number, height: number, padding: number */) {
    // Subclasses should override this method to generate path data given a width, height, and padding
    return 'm 0 0';
  }

  elevate_() {
    this.ambientShadowBlur_ += this.ambientShadowBlurIncrement_;
    this.ambientShadowOffsetY_ += this.ambientShadowOffsetYIncrement_;
    this.penumbraShadowBlur_ += this.penumbraShadowBlurIncrement_;
    this.penumbraShadowOffsetY_ += this.penumbraShadowOffsetYIncrement_;
    this.umbraShadowBlur_ += this.umbraShadowBlurIncrement_;
    this.umbraShadowOffsetY_ += this.umbraShadowOffsetYIncrement_;
    this.umbraShadowSpread_ += this.umbraShadowSpreadIncrement_;

    let finished = false;
    if (Math.abs(this.finalAmbientShadowBlur_ - this.ambientShadowBlur_)
          <= Math.abs(this.ambientShadowBlurIncrement_)) {
      this.ambientShadowBlur_ = this.finalAmbientShadowBlur_;
      this.ambientShadowOffsetY_ = this.finalAmbientShadowOffsetY_;
      this.penumbraShadowBlur_ = this.finalPenumbraShadowBlur_;
      this.penumbraShadowOffsetY_ = this.finalPenumbraShadowOffsetY_;
      this.umbraShadowBlur_ = this.finalUmbraShadowBlur_;
      this.umbraShadowOffsetY_ = this.finalUmbraShadowOffsetY_;
      this.umbraShadowSpread_ = this.finalUmbraShadowSpread_;
      finished = true;
    }

    this.redraw();

    if (!finished && this.elevating_) {
      this.animationFrameId_ = requestAnimationFrame(() => this.elevate_());
    } else {
      this.elevating_ = false;
    }
  }

  clear_() {
    this.ctx_.clearRect(0, 0, this.adapter_.getCanvasWidth(), this.adapter_.getCanvasHeight());
  }

  draw_() {
    const devicePixelRatio = this.adapter_.getDevicePixelRatio();
    const noSpreadPath = this.generateShadowPath_(0);
    this.drawAmbientShadow_(devicePixelRatio, noSpreadPath);
    this.drawPenumbraShadow_(devicePixelRatio, noSpreadPath);
    this.drawUmbraShadow_(devicePixelRatio);
    this.drawColoredShape_(noSpreadPath);
    this.adapter_.setClipPathData(this.generateClipPath_());
  }

  drawAmbientShadow_(devicePixelRatio, noSpreadPath) {
    this.ctx_.fillStyle = '#FFF';
    this.ctx_.shadowColor = 'rgba(0, 0, 0, 0.12)';
    this.ctx_.shadowBlur = this.ambientShadowBlur_ * devicePixelRatio;
    this.ctx_.shadowOffsetY = this.ambientShadowOffsetY_ * devicePixelRatio;
    this.ctx_.fill(this.adapter_.createPath2D(noSpreadPath));
  }

  drawPenumbraShadow_(devicePixelRatio, noSpreadPath) {
    this.ctx_.shadowColor = 'rgba(0, 0, 0, 0.14)';
    this.ctx_.shadowBlur = this.penumbraShadowBlur_ * devicePixelRatio;
    this.ctx_.shadowOffsetY = this.penumbraShadowOffsetY_ * devicePixelRatio;
    this.ctx_.fill(this.adapter_.createPath2D(noSpreadPath));
  }

  drawUmbraShadow_(devicePixelRatio) {
    const umbraPath = this.generateShadowPath_(this.umbraShadowSpread_);
    this.ctx_.shadowColor = 'rgba(0, 0, 0, 0.2)';
    this.ctx_.shadowBlur = this.umbraShadowBlur_ * devicePixelRatio;
    this.ctx_.shadowOffsetY = this.umbraShadowOffsetY_ * devicePixelRatio;
    this.ctx_.fill(this.adapter_.createPath2D(umbraPath));
  }

  drawColoredShape_(noSpreadPath) {
    this.ctx_.fillStyle = this.background_;
    this.ctx_.shadowColor = 'rgba(0, 0, 0, 0)';
    this.ctx_.shadowBlur = 0;
    this.ctx_.shadowOffsetY = 0;
    this.ctx_.fill(this.adapter_.createPath2D(noSpreadPath));
  }

  get finalAmbientShadowOffsetY_() {
    return constants.AMBIENT_OFFSET_Y[this.elevation_];
  }

  get finalAmbientShadowBlur_() {
    return constants.AMBIENT_BLUR[this.elevation_];
  }

  get finalPenumbraShadowOffsetY_() {
    return this.elevation_;
  }

  get finalPenumbraShadowBlur_() {
    return constants.PENUMBRA_BLUR[this.elevation_];
  }

  get finalUmbraShadowOffsetY_() {
    return constants.UMBRA_OFFSET_Y[this.elevation_];
  }

  get finalUmbraShadowBlur_() {
    return constants.UMBRA_BLUR[this.elevation_];
  }

  get finalUmbraShadowSpread_() {
    return constants.UMBRA_SPREAD[this.elevation_];
  }
}
