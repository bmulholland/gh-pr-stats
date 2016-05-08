/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. */

'use strict';

const commodore = require('commodore');
const github = require('./github');
const githubCache = require('./github-cache');
const humanTime = require('./human-time');
const Stats = require('think-stats');

module.exports = function (repoOwner, repoName, OAuthToken, options) {
  options = options || {};

  fetchPRs(repoOwner, repoName, OAuthToken, options.forceFetch)
    .then((pullRequests) => {
      let stats = mergedUnmergedStats(pullRequests);
      console.log('merged: %s, unmerged: %s', stats.merged, stats.unmerged);

      let mergedPRs = findMergedPRs(pullRequests);
      let diffs = mergeTimeStats(mergedPRs);

      const diffStats = new Stats({ store_data: true });
      diffs.forEach(diffStats.push.bind(diffStats));

      console.log('mean: %s', humanTime.format(diffStats.amean(), '%d days %h hours %m minutes %s seconds'));
      console.log('median: %s', humanTime.format(diffStats.median(), '%d days %h hours %m minutes %s seconds'));
      console.log('75%: %s', humanTime.format(diffStats.percentile(75), '%d days %h hours %m minutes %s seconds'));
      console.log('90%: %s', humanTime.format(diffStats.percentile(90), '%d days %h hours %m minutes %s seconds'));

      let range = diffStats.range();
      console.log('low:', humanTime.format(range[0], '%d days %h hours %m minutes %s seconds'));
      console.log('high:', humanTime.format(range[1], '%d days %h hours %m minutes %s seconds'));

      console.log('stddev:', humanTime.format(diffStats.stddev(), '%d days %h hours %m minutes %s seconds'));
    })
    .catch((err) => {
      console.error('fatal error:', err.message);
      process.exit(1);
    });
};

function fetchPRs (repoOwner, repoName, OAuthToken, forceFetch) {
  if (forceFetch) {
    return fetchPRsFromGitHub(repoOwner, repoName, OAuthToken);
  } else {
    return fetchPRsFromCache(repoOwner, repoName)
      .catch((err) => {
        return fetchPRsFromGitHub(repoOwner, repoName);
      });
  }
}

function fetchPRsFromCache(repoOwner, repoName) {
  return githubCache.get(repoOwner, repoName, 'closed');
}

function fetchPRsFromGitHub(repoOwner, repoName, OAuthToken) {
  return github.fetchPRs(repoOwner, repoName, 'closed', OAuthToken)
    .then((pullRequests) => {
      return githubCache.save(repoOwner, repoName, pullRequests)
        .then(() => {
          return pullRequests;
        });
    });
}

function mergedUnmergedStats(pullRequests) {
  return pullRequests.reduce((accumulator, pullRequest) => {
    if (pullRequest.merged_at) {
      accumulator.merged++;
    } else {
      accumulator.unmerged++;
    }

    return accumulator;
  }, { merged: 0, unmerged: 0 });
}

function findMergedPRs(pullRequests) {
  return pullRequests.filter((pullRequest) => {
    return !! pullRequest.merged_at;
  });
}

function mergeTimeStats(pullRequests) {
  return pullRequests.map((pullRequest) => {
    let openedAt = new Date(pullRequest.created_at);
    let closedAt = new Date(pullRequest.closed_at);

    return (closedAt.getTime() - openedAt.getTime());
  });
}
