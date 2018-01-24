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
import MDCShapeFoundation from './foundation';

export default class MDCShape extends MDCComponent {
  set background(value) {
    this.foundation_.setBackground(value);
  }

  set elevation(value) {
    this.foundation_.setElevation(value, true);
  }

  redraw() {
    this.foundation_.redraw();
  }

  createAdapter() {
    return {setCanvasWidth: (value) => this.canvas_.width = value,
      setCanvasHeight: (value) => this.canvas_.height = value,
      getCanvasWidth: () => this.canvas_.offsetWidth,
      getCanvasHeight: () => this.canvas_.offsetHeight,
      getDevicePixelRatio: () => window.devicePixelRatio,
      create2dRenderingContext: () => this.canvas_.getContext('2d'),
      createPath2D: (path) => new Path2D(path),
      setClipPathData: (value) => this.path_.setAttribute('d', value)};
  }

  get canvas_() {
    return this.root_.querySelector(MDCShapeFoundation.strings.CANVAS_SELECTOR);
  }

  get path_() {
    return this.root_.querySelector(MDCShapeFoundation.strings.PATH_SELECTOR);
  }
}
