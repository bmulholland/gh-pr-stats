#!/usr/bin/env node

/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

const program = require('commodore');
const stats = require('../lib/index');

program
  .version('0.0.1')
  .option('-u, --user <repo owner username>', 'Repository owner username')
  .demand('user')
  .option('-n, --name <repo name>', 'Repository name')
  .demand('name')
  .option('-f, --force', 'Force fresh fetch from GitHub. Data is fetched from cache by default.')
  .option('-t, --token <token>', 'GitHub OAuth token. If not provided, read from GITHUB_PR_STATS_OAUTH_TOKEN environment variable')
  .parse(process.argv);

let OAuthToken = process.env.GITHUB_PR_STATS_OAUTH_TOKEN;
if (program.token) {
  OAuthToken = program.token;
}

stats(program.user, program.name, OAuthToken, {
  forceFetch: program.force
});

