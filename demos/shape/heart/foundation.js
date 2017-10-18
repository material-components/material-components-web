/**
 * Copyright 2017 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import MDCShapeFoundation from '../../../packages/mdc-shape/foundation';

export default class DemoHeartFoundation extends MDCShapeFoundation {
  generatePath_(width, height, padding) {
    return 'm ' + (width / 2) + ' ' + (height - padding)
    +this.generateLeftBase_(width, height, padding)
    +this.generateTopLeftCurve_(width, height, padding)
    +this.generateTopRightCurve_(width, height, padding)
    +this.generateRightBase_(width, height, padding);
  }
  generateBaseWidth_(width, padding) {
    return ((width - (padding * 2)) / 2);
  }
  generateBaseFlatWidth_(width, padding) {
    return this.generateBaseWidth_(width, padding) * 0.14;
  }
  generateBaseCurveWidth_(width, padding) {
    return this.generateBaseWidth_(width, padding) * 0.52;
  }
  generateBaseHeight_(height, padding) {
    return (height - (padding * 2)) * 0.67;
  }
  generateBaseFlatHeight_(height, padding) {
    return this.generateBaseHeight_(height, padding) * 0.11;
  }
  generateBaseCurveHeight_(height, padding) {
    return this.generateBaseHeight_(height, padding) * 0.4;
  }
  generateBaseCurveHeight2_(height, padding) {
    return this.generateBaseHeight_(height, padding) * 0.67;
  }
  generateLeftBase_(width, height, padding) {
    const flatWidth = this.generateBaseFlatWidth_(width, padding);
    const flatHeight = this.generateBaseFlatHeight_(height, padding);
    const realWidth = this.generateBaseWidth_(width, padding) - flatWidth;
    return 'l ' + (-1 * flatWidth) + ',' + (-1 * flatHeight)
      +'c ' + (-1 * this.generateBaseCurveWidth_(width, padding)) + ','
      + (-1 * this.generateBaseCurveHeight_(height, padding))
      + ' ' + (-1 * realWidth) + ',' + (-1 * this.generateBaseCurveHeight2_(height, padding))
      + ' ' + (-1 * realWidth)
      + ',' + (-1 * (this.generateBaseHeight_(height, padding) - flatHeight));
  }
  generateRightBase_(width, height, padding) {
    const flatWidth = this.generateBaseFlatWidth_(width, padding);
    const flatHeight = this.generateBaseFlatHeight_(height, padding);
    const curveHeight = this.generateBaseHeight_(height, padding) - flatHeight;
    const realWidth = this.generateBaseWidth_(width, padding) - flatWidth;
    return 'c 0,' + (curveHeight - this.generateBaseCurveHeight2_(height, padding))
      + (-1 * (realWidth - this.generateBaseCurveWidth_(width, padding)))
      + ',' + (curveHeight - this.generateBaseCurveHeight_(height, padding))
      + (-1 * realWidth) + ',' + curveHeight
      +'l ' + (-1 * flatWidth) + ',' + flatHeight;
  }
  generateOutsideWidth_(width, padding) {
    return ((width - (padding * 2)) / 2) * 0.55;
  }
  generateOutsideCurveWidth_(width, padding) {
    return this.generateOutsideWidth_(width, padding) * 0.44;
  }
  generateInsideWidth_(width, padding) {
    return ((width - (padding * 2)) / 2) * 0.45;
  }
  generateInsideCurveWidth_(width, padding) {
    return this.generateInsideWidth_(width, padding) * 0.37;
  }
  generateInsideCurveWidth2_(width, padding) {
    return this.generateInsideWidth_(width, padding) * 0.76;
  }
  generateTopHeight_(height, padding) {
    return (height - (padding * 2)) * (1 - 0.67);
  }
  generateTopCurveHeight_(height, padding) {
    return this.generateTopHeight_(height, padding) * 0.56;
  }
  generateDipHeight_(height, padding) {
    return (height - (padding * 2)) * 0.15;
  }
  generateDipCurveHeight_(height, padding) {
    return this.generateDipHeight_(height, padding) * 0.38;
  }
  generateTopLeftCurve_(width, height, padding) {
    const topHeight = this.generateTopHeight_(height, padding);
    return 'c 0,' + (-1 * this.generateTopCurveHeight_(height, padding)) + ' '
      + this.generateOutsideCurveWidth_(width, padding) + ',' + (-1 * topHeight) + ' '
      + this.generateOutsideWidth_(width, padding) + ',' + (-1 * topHeight)
      +'c ' + this.generateInsideCurveWidth_(width, padding) + ',0, '
      + this.generateInsideCurveWidth2_(width, padding)
      + ',' + (this.generateDipCurveHeight_(height, padding)) + ', '
      + this.generateInsideWidth_(width, padding) + ',' + this.generateDipHeight_(height, padding);
  }
  generateTopRightCurve_(width, height, padding) {
    const outsideWidth = this.generateOutsideWidth_(width, padding);
    const insideWidth = this.generateInsideWidth_(width, padding);
    const topHeight = this.generateTopHeight_(height, padding);
    const dipHeight = this.generateDipHeight_(height, padding);
    return 'c ' + (insideWidth - this.generateInsideCurveWidth2_(width, padding))
    + ',' + (-1 * (dipHeight - this.generateDipCurveHeight_(height, padding))) + ' '
      + (insideWidth - this.generateInsideCurveWidth_(width, padding))
      + ',' + (-1 * dipHeight) + ' '
      + insideWidth + ',' + (-1 * dipHeight)
      +'c ' + (outsideWidth - this.generateOutsideCurveWidth_(width, padding)) + ',0 '
      + outsideWidth + ',' + (topHeight - this.generateTopCurveHeight_(height, padding)) + ' '
      + outsideWidth + ',' + topHeight;
  }
}
