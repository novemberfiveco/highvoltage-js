const CLIEngine = require('eslint').CLIEngine;
const Path = require('path');

const { git } = danger;

/**
 * Eslint your code with Danger, this only lints created / changed files
 */
exports.eslintPlugin = async () => {
  const filesToLint = git.created_files.concat(git.modified_files);
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
