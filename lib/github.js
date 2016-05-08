/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

const GitHub = require('github-api');

exports.fetchPRs = (userName, repoName, OAuthToken, state) => {
  console.log('Fetching PR data from GitHub. This might take a while.');

  const githubClient = new GitHub({
    token: OAuthToken
  });

  const repo = githubClient.getRepo(userName, repoName);
  return fetchPRs(repo, state);
};

function fetchPRs(repo, state, page, accumulator) {
  if (! accumulator) {
    accumulator = [];
  }

  if (! page) {
    page = 0;
  }

  console.log('page', page + 1, accumulator.length);

  return repo.listPullRequests({ state: state, page: page })
    .then((response) => {
      accumulator = accumulator.concat(response.data);

      if (/rel="next"/.test(response.headers.link)) {
        return fetchPRs(repo, state, page + 1, accumulator);
      }

      return accumulator;
    });
}
