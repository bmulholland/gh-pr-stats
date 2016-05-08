# GitHub Pull Request Stats

Fetch GitHub pull request statistics.

Only statistics about merged pull requests are currently displayed.

## Installation
```bash
npm install -g gh-pr-stats
```

## Usage

1. First, ensure you have a GitHub API token. One can be generated
under [Profile->Personal access tokens](https://github.com/settings/tokens).
1. To avoid passing in the token to the CLI for every run, set the
   `GITHUB_PR_STATS_OAUTH_TOKEN` environment variable with the token
   from step 1.
1. Run the CLI:
```bash
gh-pr-stats -u <repo owner username> -n <repo name>
```

## Author

* Shane Tomlinson
* shane@shanetomlinson.com
* https://shanetomlinson.com
* http://github.com/shane-tomlinson
* @shane_tomlinson

## License

This software is available under version 2.0 of the MPL:

https://www.mozilla.org/MPL/


