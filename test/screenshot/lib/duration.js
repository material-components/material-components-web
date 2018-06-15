/*
 * Copyright 2018 Google Inc. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

class Duration {
  /**
   * @param {number} ms
   */
  constructor(ms) {
    /**
     * @type {number}
     * @private
     */
    this.ms_ = ms;
  }

  /**
   * @param {number} sec
   * @return {!Duration}
   */
  static seconds(sec) {
    return new Duration(sec * 1000);
  }

  /**
   * @param {number} min
   * @return {!Duration}
   */
  static minutes(min) {
    return new Duration(min * 1000 * 60);
  }

  /**
   * @param {number} durationMs
   * @param {number} startTimeMs
   * @return {boolean}
   */
  static hasElapsed(durationMs, startTimeMs) {
    return (Date.now() - startTimeMs) >= durationMs;
  }

  /**
   * @param {number} startTimeMs
   * @return {!Duration}
   */
  static getElapsed(startTimeMs) {
    return new Duration(Date.now() - startTimeMs);
  }

  /**
   * @return {number}
   */
  toMillis() {
    return this.ms_;
  }

  /**
   * @return {string}
   */
  toHuman() {
    const oneMillisecond = 1;
    const oneSecond = 1000;
    const oneMinute = 1000 * 60;
    const oneHour = 1000 * 60 * 60;
    const oneDay = 1000 * 60 * 60 * 24;

    const magnitudes = [
      {
        matches: (ms) => ms < oneSecond,
        format: (ms) => format(ms, oneMillisecond, 'millisecond'),
      },
      {
        matches: (ms) => ms < oneMinute,
        format: (ms) => format(ms, oneSecond, 'second'),
      },
      {
        matches: (ms) => ms < oneHour,
        format: (ms) => format(ms, oneMinute, 'minute'),
      },
      {
        matches: (ms) => ms < oneDay,
        format: (ms) => format(ms, oneHour, 'hour'),
      },
      {
        matches: () => true, // fallback that always matches
        format: (ms) => format(ms, oneDay, 'day'),
      },
    ];

    function format(ms, divisor, unit, digits = 1) {
      const multiplier = Math.pow(10, digits);
      const rawValue = ms / divisor;
      const roundedValue = Math.round(multiplier * rawValue) / multiplier;
      const plural = roundedValue === 1 ? '' : 's';
      return `${roundedValue} ${unit}${plural}`;
    }

    return magnitudes.find((magnitude) => magnitude.matches(this.ms_)).format(this.ms_);
  }
}

module.exports = Duration;
