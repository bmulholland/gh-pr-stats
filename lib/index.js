/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

const GitHub = require('github-api');
const Promise = require('bluebird');

const OAUTH_TOKEN = process.env.GITHUB_PR_STATS_OAUTH_TOKEN;

const githubClient = new GitHub({
  auth: 'oauth',
  token: OAUTH_TOKEN
});

const repo = githubClient.getRepo('mozilla', 'fxa-content-server');

Promise.promisify(repo.listPulls)('open').then((pullRequests) => {
  /*console.log(JSON.stringify(pullRequests, null, 2));*/
  console.log('open PRs', pullRequests.length);
});

