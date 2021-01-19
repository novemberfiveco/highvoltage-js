# Highvoltage JS

[![Danger High Voltage](https://img.youtube.com/vi/2a4gyJsY0mc/0.jpg)](https://www.youtube.com/watch?v=2a4gyJsY0mc)


Highvoltage JS is a thin wrapper around [Danger](https://danger.systems/js/). It allows to perform automated code review tasks on pull requests in Bitbucket. Highvoltage JS allows to have a central [danger.js](./danger.js) file.

## Getting Started

If you don't already configured the N5 NPM repository, do so first by running:

```
npm login --scope=@novemberfive --registry=https://npm.novemberfive.co
```

Install Highvoltage by running:

```
yarn add -D @novemberfive/highvoltage-js
```

## Batteries included

The following checks are performed:

- ESLint: ESLint is run on the created / changed files only and will use the projects ESLint configuration
- Yarn Audit: Yarn Audit is run and a summaray is printed as a warning
- Package Lock consitency: Displays a warning if `package.json` is updated but `yarn.lock` not
- ... your check here!


## Running on CI

If you are following the bitrise default configuration template (you should) then you are all set. On your new PR Danger will automatically run and fail the build if needed.

If you are not on the default bitrise configuration you must add a Yarn step containing

```
yarn run highvoltage
```

## Local Development

The easiest way for local development is creating a PR in bitbucket on a project to test out your code, then you can use the following command to run Highvoltage locally. This will perform the same checks as on CI but wont place any comments on the PR.

```
yarn run highvoltage pr https://bitbucket.org/appstrakt/<PROJECT NAME>/pull-requests/<PR ID>
```

## FAQ

**Q**: Why is this project written in Javascript?

**A**: A choice was made to use Javascript since this could run on anything that has node installed. This lowers the overall complexicy of the project and possible typescript version conflicts.

**Q**: Why are you using outdated eslint v6?

**A**: For the moment N5 is running on CRA3 and that has eslint pinned at v6. If we upgrade to CRA v4 this project should also be upgraded

**Q**: I cannot believe you didn't add a check for *insert awesome plugin here*?!

**A**: Feel free to create a PR with the plugin

## TODO

- [ ] Enable commit lint, after verification which standard to follow
- [ ] Add tests for the plugin

