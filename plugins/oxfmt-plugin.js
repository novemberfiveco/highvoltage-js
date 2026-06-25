const { execFileSync } = require("child_process");
const Path = require("path");

const { git } = danger;

// Ensure the project's local node_modules/.bin is on PATH so `oxfmt` resolves
// regardless of how Danger was launched.
const binEnv = () => ({
  ...process.env,
  PATH: `${Path.resolve(process.cwd(), "node_modules/.bin")}${Path.delimiter}${process.env.PATH}`,
});

/**
 * Check if oxfmt is available in the project.
 * Mirrors isPrettierInstalled() — the plugin self-skips when oxfmt is unused.
 */
const isOxfmtInstalled = () => {
  try {
    require.resolve("oxfmt/package.json");
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Check formatting of created / changed files with oxfmt.
 * oxfmt discovers the project's own .oxfmtrc.json itself.
 */
exports.oxfmtPlugin = async () => {
  if (!isOxfmtInstalled()) {
    message("oxfmt not found in project dependencies, skipping oxfmt check");
    return;
  }

  const filesToCheck = git.created_files.concat(git.modified_files);
  const filteredFiles = filesToCheck.filter(
    (file) =>
      !!file.match(/\.(tsx|ts|jsx|js|mjs|cjs|json|md|yml|yaml|css|scss|html)$/),
  );

  if (filteredFiles.length === 0) {
    message("No files to check with oxfmt");
    return;
  }

  try {
    // --list-different prints nothing and exits 0 when everything is formatted;
    // it lists differing files and exits non-zero otherwise. We drive the
    // pass/fail decision off the exit code, not a (fragile) English string.
    execFileSync("oxfmt", ["--list-different", ...filteredFiles], {
      encoding: "utf8",
      env: binEnv(),
    });
    message("oxfmt check success :clap:", { icon: ":white_check_mark:" });
  } catch (error) {
    const listed = (error.stdout || "").trim();
    if (listed) {
      listed
        .split("\n")
        .map((line) => line.trim())
        .filter(Boolean)
        .forEach((filePath) => fail(`File is not formatted: \`${filePath}\``));
    } else if (error.stderr) {
      fail(`oxfmt error: ${error.stderr.trim()}`);
    }
    fail(
      "oxfmt check failed, please run `oxfmt` (or `npm run format`) to fix formatting issues",
    );
  }
};
