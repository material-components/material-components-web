/**
 * @license
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

class DurationConversionError extends Error {
  constructor(...args) {
    super(...args);
  }
}

class Duration {
  constructor() {
    this.spans_ = [];
  }

  static get conversionList_() {
    return [
      {
        unitNameFull: 'milliseconds',
        unitNameAbbr: 'ms',
        multiplierToMilliseconds: 1,
      },
      {
        unitNameFull: 'seconds',
        unitNameAbbr: 's',
        multiplierToMilliseconds: 1000,
      },
      {
        unitNameFull: 'minutes',
        unitNameAbbr: 'm',
        multiplierToMilliseconds: 60 * 1000,
      },
      {
        unitNameFull: 'hours',
        unitNameAbbr: 'h',
        multiplierToMilliseconds: 60 * 60 * 1000,
      },
      {
        unitNameFull: 'days',
        unitNameAbbr: 'd',
        multiplierToMilliseconds: 24 * 60 * 60 * 1000,
      },
      {
        unitNameFull: 'weeks',
        unitNameAbbr: 'w',
        multiplierToMilliseconds: 7 * 24 * 60 * 60 * 1000,
      },
      {
        unitNameFull: 'years',
        unitNameAbbr: 'y',
        multiplierToMilliseconds: 365 * 24 * 60 * 60 * 1000,
      },
    ];
  }

  static getConversion(unit) {
    unit = unit.toLowerCase();
    const sameUnit = (conv) => unit === conv.unitNameFull || unit === conv.unitNameAbbr;
    const conversion = Duration.conversionList_.filter(sameUnit)[0];
    if (conversion) {
      return conversion;
    }
    throw new DurationConversionError(`Unknown unit: "${unit}"`);
  }

  static convertToMilliseconds(unit, value) {
    return Duration.getConversion(unit).multiplierToMilliseconds * value;
  }

  static none() {
    return new Duration();
  }

  static milliseconds(milliseconds) {
    return new Duration().milliseconds(milliseconds);
  }

  static seconds(seconds) {
    return new Duration().seconds(seconds);
  }

  static minutes(minutes) {
    return new Duration().minutes(minutes);
  }

  static hours(hours) {
    return new Duration().hours(hours);
  }

  static days(days) {
    return new Duration().days(days);
  }

  static weeks(weeks) {
    return new Duration().weeks(weeks);
  }

  static years(years) {
    return new Duration().years(years);
  }

  add(unit, value) {
    const conversion = Duration.getConversion(unit);
    this.spans_.push(Object.assign({}, conversion, {
      amountInUnit: value,
      amountInMilliseconds: conversion.multiplierToMilliseconds * value,
    }));
    return this;
  }

  milliseconds(milliseconds) {
    return this.add('milliseconds', milliseconds);
  }

  seconds(seconds) {
    return this.add('seconds', seconds);
  }

  minutes(minutes) {
    return this.add('minutes', minutes);
  }

  hours(hours) {
    return this.add('hours', hours);
  }

  days(days) {
    return this.add('days', days);
  }

  weeks(weeks) {
    return this.add('weeks', weeks);
  }

  years(years) {
    return this.add('years', years);
  }

  totalMilliseconds() {
    return Math.ceil(this.spans_.reduce((sum, span) => sum + span.amountInMilliseconds, 0));
  }

  toString() {
    const totalMilliseconds = this.totalMilliseconds();
    const conversions = Duration.conversionList_;

    for (let i = 0; i < conversions.length; i++) {
      const curConversion = conversions[i];
      const prevConversion = conversions[i - 1];

      if (totalMilliseconds < curConversion.multiplierToMilliseconds) {
        const bestConversion = i === 0 ? curConversion : prevConversion;
        const value = Math.ceil(totalMilliseconds / bestConversion.multiplierToMilliseconds);
        return `${value}${bestConversion.unitNameAbbr}`;
      }
    }
  }
}

module.exports = {Duration, DurationConversionError};
