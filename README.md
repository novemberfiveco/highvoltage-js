# Highvoltage JS

[![Danger High Voltage](https://img.youtube.com/vi/2a4gyJsY0mc/0.jpg)](https://www.youtube.com/watch?v=2a4gyJsY0mc)

Highvoltage JS is a thin wrapper around [Danger](https://danger.systems/js/). It allows to perform automated code review tasks on pull requests in Bitbucket. Highvoltage JS allows to have a central [danger.js](./danger.js) file.

## Getting Started

Install Highvoltage by running:

```
npm install --save-dev @novemberfiveco/highvoltage-js
```

## Batteries included

The following checks are performed in the following order

1. ESLint: ESLint is run on the created / changed files only and will
   use the projects ESLint configuration
2. Npm Audit: Npm Audit is run and a summary is printed as a warning
3. Package Lock consistency: Displays a warning if `package.json` is updated but `package-lock.json` not
4. Highvoltage version: Npm checks if highvoltage is running on the latest version
5. Display a message when there are open TODOs found in your PR.
6. ... your check here!

## Running on CI

If you are following the bitrise default configuration template (you should) then you are all set. On your new PR Danger will automatically run and fail the build if needed.

If you are not on the default bitrise configuration you must add a NPM step containing

```

npm run highvoltage

```

## Local Development

The easiest way for local development is creating a PR in bitbucket on a project to test out your code, then you can use the following command to run Highvoltage locally. This will perform the same checks as on CI but wont place any comments on the PR.

Inside the repo you want to test add the following script to your package.json

```
"highvoltage": "node_modules/.bin/highvoltage",
```

In order to run this, you'll need to add the following env variables `DANGER_BITBUCKETCLOUD_USERNAME` and `DANGER_BITBUCKETCLOUD_PASSWORD`, more info on what those are can be found [here](https://danger.systems/js/usage/bitbucket_cloud.html)

Use NPM link to link your new local version to the repo that you want to test
https://docs.npmjs.com/cli/v9/commands/npm-link

Inside your test repo go to `node_modules/.bin/highvoltage` and replace the node modules link so that it's correctly linked for local development

```
 $PWD/node_modules/@novemberfiveco/highvoltage-js/ $1 --dangerfile $PWD/node_modules/@novemberfiveco/highvoltage-js/dangerfile.js "${@:2}"
```

then you should be able to run

```

npm run highvoltage pr https://bitbucket.org/appstrakt/<PROJECT NAME>/pull-requests/<PR ID>

```

## FAQ

**Q**: Why is this project written in Javascript?

**A**: A choice was made to use Javascript since this could run on anything that has node installed. This lowers the overall complexicy of the project and possible typescript version conflicts.

**Q**: I cannot believe you didn't add a check for _insert awesome plugin here_?!

**A**: Feel free to create a PR with the plugin

## TODO

- [ ] Enable commit lint, after verification which standard to follow
- [ ] Add tests for the plugin
