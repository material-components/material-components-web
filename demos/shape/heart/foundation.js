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
    + this.generateLeftBase_(width, height, padding)
    + this.generateTopLeftCurve_(width, height, padding)
    + this.generateTopRightCurve_(width, height, padding)
    + this.generateRightBase_(width, height, padding);
  }

  generateBaseWidth_(width, padding) {
    return ((width - padding * 2) / 2);
  }

  generateBaseFlatWidth_(width, padding) {
    return this.generateBaseWidth_(width, padding) * 0.14;
  }

  generateBaseCurveWidth_(width, padding) {
    return this.generateBaseWidth_(width, padding) * 0.52;
  }

  generateBaseHeight_(height, padding) {
    return (height - padding * 2) * 0.67;
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
    const negativeFlatWidth = -1 * flatWidth;
    const negativeFlatHeight = -1 * flatHeight;
    const baseCurveWidth = -1 * this.generateBaseCurveWidth_(width, padding);
    const baseCurveHeight = -1 * this.generateBaseCurveHeight_(height, padding);
    const negativeRealWidth = -1 * realWidth;
    const baseCurveHeight2 = -1 * this.generateBaseCurveHeight2_(height, padding);
    const baseHeight = -1 * (this.generateBaseHeight_(height, padding) - flatHeight);
    return `l ${negativeFlatWidth},${negativeFlatHeight}` +
      ` c ${baseCurveWidth},${baseCurveHeight}` +
      ` ${negativeRealWidth},${baseCurveHeight2}` +
      ` ${negativeRealWidth},${baseHeight}`;
  }

  generateRightBase_(width, height, padding) {
    const flatWidth = this.generateBaseFlatWidth_(width, padding);
    const flatHeight = this.generateBaseFlatHeight_(height, padding);
    const curveHeight = this.generateBaseHeight_(height, padding) - flatHeight;
    const realWidth = this.generateBaseWidth_(width, padding) - flatWidth;
    const controlY = curveHeight - this.generateBaseCurveHeight2_(height, padding);
    const controlX2 = -1 * (realWidth - this.generateBaseCurveWidth_(width, padding));
    const controlY2 = curveHeight - this.generateBaseCurveHeight_(height, padding);
    const negativeRealWidth = -1 * realWidth;
    const negativeFlatWidth = -1 * flatWidth;
    return `c 0,${controlY} ${controlX2},${controlY2} ${negativeRealWidth},${curveHeight}` +
      ` l ${negativeFlatWidth},${flatHeight}`;
  }

  generateOutsideWidth_(width, padding) {
    return ((width - padding * 2) / 2) * 0.55;
  }

  generateOutsideCurveWidth_(width, padding) {
    return this.generateOutsideWidth_(width, padding) * 0.44;
  }

  generateInsideWidth_(width, padding) {
    return ((width - padding * 2) / 2) * 0.45;
  }

  generateInsideCurveWidth_(width, padding) {
    return this.generateInsideWidth_(width, padding) * 0.37;
  }

  generateInsideCurveWidth2_(width, padding) {
    return this.generateInsideWidth_(width, padding) * 0.76;
  }

  generateTopHeight_(height, padding) {
    return (height - padding * 2) * (1 - 0.67);
  }

  generateTopCurveHeight_(height, padding) {
    return this.generateTopHeight_(height, padding) * 0.56;
  }

  generateDipHeight_(height, padding) {
    return (height - padding * 2) * 0.15;
  }

  generateDipCurveHeight_(height, padding) {
    return this.generateDipHeight_(height, padding) * 0.38;
  }

  generateTopLeftCurve_(width, height, padding) {
    const topHeight = this.generateTopHeight_(height, padding);
    const negativeTopCurveHeight = -1 * this.generateTopCurveHeight_(height, padding);
    const outsideCurveWidth = this.generateOutsideCurveWidth_(width, padding);
    const negativeTopHeight = -1 * topHeight;
    const outsideWidth = this.generateOutsideWidth_(width, padding);
    const insideCurveWidth = this.generateInsideCurveWidth_(width, padding);
    const insideCurveWidth2 = this.generateInsideCurveWidth2_(width, padding);
    const dipCurveHeight = this.generateDipCurveHeight_(height, padding);
    const insideWidth = this.generateInsideWidth_(width, padding);
    const dipHeight = this.generateDipHeight_(height, padding);

    return `c 0,${negativeTopCurveHeight} ${outsideCurveWidth},${negativeTopHeight} ` +
      ` ${outsideWidth},${negativeTopHeight}` +
      ` c ${insideCurveWidth},0 ${insideCurveWidth2},${dipCurveHeight}` +
      ` ${insideWidth},${dipHeight}`;
  }

  generateTopRightCurve_(width, height, padding) {
    const outsideWidth = this.generateOutsideWidth_(width, padding);
    const insideWidth = this.generateInsideWidth_(width, padding);
    const topHeight = this.generateTopHeight_(height, padding);
    const dipHeight = this.generateDipHeight_(height, padding);
    const controlX = insideWidth - this.generateInsideCurveWidth2_(width, padding);
    const controlY = -1 * (dipHeight - this.generateDipCurveHeight_(height, padding));
    const controlX2 = insideWidth - this.generateInsideCurveWidth_(width, padding);
    const negativeDipHeight = -1 * dipHeight;
    const controlX3 = outsideWidth - this.generateOutsideCurveWidth_(width, padding);
    const controlY4 = topHeight - this.generateTopCurveHeight_(height, padding);

    return `c ${controlX},${controlY} ${controlX2},${negativeDipHeight}` +
      ` ${insideWidth},${negativeDipHeight}` +
      `c ${controlX3},0 ${outsideWidth},${controlY4}` +
      ` ${outsideWidth},${topHeight}`;
  }
}
