/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

const fs = require('fs');
const mkdirp = require('mkdirp');
const path = require('path');

exports.get = (username, reponame) => {
  return new Promise((resolve, reject) => {
    fs.readFile(getRepoCachePath(username, reponame), (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(JSON.parse(data));
      }
    });
  });
};

exports.save = (username, reponame, data) => {
  return new Promise((resolve, reject) => {
    mkdirp(getRepoCacheDirectory(username), (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  })
  .then(() => {
    return new Promise((resolve, reject) => {
      fs.writeFile(getRepoCachePath(username, reponame), JSON.stringify(data), (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  });
};

function getRepoCacheDirectory(username) {
  return path.join(__dirname, '..', '.repo-cache', username);
}

function getRepoCachePath(username, reponame) {
  return path.join(getRepoCacheDirectory(username), reponame);
}

