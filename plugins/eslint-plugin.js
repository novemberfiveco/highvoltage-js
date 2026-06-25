const { ESLint } = require("eslint");
const Path = require("path");

const { git } = danger;

/**
 * ESLint 9 throws when a repo has no resolvable config (the post-migration,
 * oxc-only state). Detect that specific failure so we can skip gracefully
 * instead of crashing the whole Danger run. Any other error must still surface.
 */
const isMissingConfigError = (error) =>
  /could not find.*config|couldn't find.*config|no eslint configuration/i.test(
    (error && error.message) || "",
  );

/**
 * Eslint your code with Danger, this only lints created / changed files
 */
exports.eslintPlugin = async () => {
  const filesToLint = git.created_files.concat(git.modified_files);
  // Eslint extension list only works for directories so do it ourselfs
  const filteredFiles = filesToLint.filter(
    (file) => !!file.match("(tsx|ts|js)$"),
  );

  if (filteredFiles.length === 0) {
    message("No files to check with ESLint");
    return;
  }

  let eslint;
  let results;
  try {
    eslint = new ESLint();
    results = await eslint.lintFiles(filteredFiles);
  } catch (error) {
    if (isMissingConfigError(error)) {
      message("No ESLint config found in project, skipping ESLint check");
      return;
    }
    throw error;
  }

  let failed = false;

  for (const result of results) {
    const isPathIgnored = await eslint.isPathIgnored(result.filePath);
    if (isPathIgnored) continue;
    const path = Path.relative(".", result.filePath);
    for (const msg of result.messages) {
      failed = true;
      if (msg.fatal) {
        fail(`Fatal error linting ${path} with eslint.`, path, 1);
      } else {
        const fn = { 1: warn, 2: fail }[msg.severity] ?? warn;
        fn(`${msg.message} (${msg.ruleId})`, path, msg.line);
      }
    }
  }

  if (failed) {
    fail(`ESLint check failed, see inline comments`);
  } else {
    message(`ESLint check success :clap:`, { icon: ":white_check_mark:" });
  }
};
