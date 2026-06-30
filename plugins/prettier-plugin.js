const { execFileSync } = require("child_process");
const Path = require("path");

const { git } = danger;

// Ensure the project's local node_modules/.bin is on PATH so `prettier` resolves
// regardless of how Danger was launched.
const binEnv = () => ({
  ...process.env,
  PATH: `${Path.resolve(process.cwd(), "node_modules/.bin")}${Path.delimiter}${process.env.PATH}`,
});

/**
 * Check if Prettier is installed in the project
 */
const isPrettierInstalled = () => {
  try {
    require.resolve("prettier");
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Run Prettier check on files in the PR
 */
exports.prettierPlugin = async () => {
  if (!isPrettierInstalled()) {
    message(
      "Prettier not found in project dependencies, skipping Prettier check",
    );
    return;
  }

  const filesToCheck = git.created_files.concat(git.modified_files);
  const filteredFiles = filesToCheck.filter(
    (file) => !!file.match(/\.(tsx|ts|js|json|md|yml|yaml)$/),
  );

  if (filteredFiles.length === 0) {
    message("No files to check with Prettier");
    return;
  }

  try {
    execFileSync("prettier", ["--check", ...filteredFiles], {
      encoding: "utf8",
      env: binEnv(),
    });
    message("Prettier check success :clap:", { icon: ":white_check_mark:" });
  } catch (error) {
    const errorLines = (error.stdout || "").split("\n");
    errorLines.forEach((line) => {
      if (line.includes("Code style issues found")) {
        fail(line);
      }
    });
    fail(
      "Prettier check failed, please run `prettier --write .` to fix formatting issues",
    );
  }
};
