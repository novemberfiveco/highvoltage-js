import { danger, fail, message, warn } from 'danger';
import { CLIEngine } from 'eslint';
import * as Path from 'path';

/**
 * Eslint your code with Danger, this only lints created / changed files
 */
function eslint() {
  const filesToLint = danger.git.created_files.concat(danger.git.modified_files);
  // Eslint extension list only works for directories so do it ourselfs
  const filteredFiles = filesToLint.filter(file => !!file.match('(tsx|ts|js)$'));
  const cli = new CLIEngine({ useEslintrc: true });

  const report = cli.executeOnFiles(filteredFiles);
  let failed = false;
  report.results.forEach(result => {
    const path = Path.relative('.', result.filePath);
    result.messages.forEach(msg => {
      failed = true;
      if (msg.fatal) {
        fail(`Fatal error linting ${path} with eslint.`, path, 1);
      } else {
        const fn = { 1: warn, 2: fail }[msg.severity];
        fn(`${msg.message} (${msg.ruleId})`, path, msg.line);
      }
    });
  });

  if (failed) {
    fail(`ESLint check failed, see inline comments`);
  } else {
    message(`ESLint check success`, { icon: ':clap:' });
  }
}

// run eslint on created / changed files
eslint();

// Ensure lock files are up to date
const packageChanged = danger.git.modified_files.includes('package.json');
const lockfileChanged = danger.git.modified_files.includes('yarn.lock');
if (packageChanged && !lockfileChanged) {
  const message = 'Changes were made to package.json, but not to yarn.lock';
  const idea = 'Perhaps you need to run `yarn install`?';
  warn(`${message} - **${idea}**`);
}
