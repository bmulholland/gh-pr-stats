/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

const SECONDS_IN_A_MINUTE = 60;
const SECONDS_IN_AN_HOUR = SECONDS_IN_A_MINUTE * 60;
const SECONDS_IN_A_DAY = SECONDS_IN_AN_HOUR * 24;


exports.format = (ms, format) => {
  let seconds = Math.floor(ms / 1000);
  let components = breakdown(seconds);

  return format
    .replace('%d', components.days)
    .replace('%h', components.hours)
    .replace('%m', components.minutes)
    .replace('%s', components.seconds);
};

function breakdown(seconds) {
  // days, hours, minutes, seconds;
  let days = Math.floor(seconds / SECONDS_IN_A_DAY);
  let hours = Math.floor((seconds % SECONDS_IN_A_DAY) / SECONDS_IN_AN_HOUR);
  let minutes = Math.floor((seconds % SECONDS_IN_AN_HOUR) / SECONDS_IN_A_MINUTE);
  let remainder = Math.floor(seconds % SECONDS_IN_A_MINUTE);

  return {
    days: days,
    hours: hours,
    minutes: minutes,
    seconds: remainder
  };
}

