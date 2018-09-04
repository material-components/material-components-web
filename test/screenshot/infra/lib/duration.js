/**
 * @license
 * Copyright 2018 Google Inc.
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
   * @param {number} ms
   * @return {!Duration}
   */
  static millis(ms) {
    return new Duration(ms);
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
   * @param {!Date|number|string} startDateTime
   * @param {!Date|number|string=} endDateTime
   * @return {!Duration}
   */
  static elapsed(startDateTime, endDateTime = new Date()) {
    return Duration.millis(new Date(endDateTime) - new Date(startDateTime));
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
   * @return {number}
   */
  toNanos() {
    return this.ms_ * 1000 * 1000;
  }

  /**
   * TODO(acdvorak): Create `toHumanLong` method that outputs "4d 23h 5m 11s" (or w/e)
   * @param {number=} numDecimalDigits
   * @return {string}
   */
  toHumanShort(numDecimalDigits = 1) {
    const oneMillisecond = 1;
    const oneSecond = 1000;
    const oneMinute = 1000 * 60;
    const oneHour = 1000 * 60 * 60;
    const oneDay = 1000 * 60 * 60 * 24;
    const oneWeek = 1000 * 60 * 60 * 24 * 7;
    const oneMonth = 1000 * 60 * 60 * 24 * 30;
    const oneYear = 1000 * 60 * 60 * 24 * 365;

    function format(ms, divisor, unit) {
      const multiplier = Math.pow(10, numDecimalDigits);
      const rawValue = ms / divisor;
      const roundedValue = Math.round(multiplier * rawValue) / multiplier;
      const plural = roundedValue === 1 ? '' : 's';
      return `${roundedValue} ${unit}${plural}`;
    }

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
        matches: (ms) => ms < oneWeek,
        format: (ms) => format(ms, oneDay, 'day'),
      },
      {
        matches: (ms) => ms < oneMonth,
        format: (ms) => format(ms, oneWeek, 'day'),
      },
      {
        matches: (ms) => ms < oneYear,
        format: (ms) => format(ms, oneMonth, 'day'),
      },
      {
        matches: () => true, // fallback that always matches
        format: (ms) => format(ms, oneYear, 'year'),
      },
    ];

    return magnitudes.find((magnitude) => magnitude.matches(this.ms_)).format(this.ms_);
  }
}

// This JS file is used on the report page as well as the screenshot testing infra.
if (typeof module !== 'undefined') {
  module.exports = Duration;
}
