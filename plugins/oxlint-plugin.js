const { execFileSync } = require("child_process");
const Path = require("path");

const { git } = danger;

// Ensure the project's local node_modules/.bin is on PATH so `oxlint` resolves
// regardless of how Danger was launched (npm run usually adds it; this is belt-and-braces).
const binEnv = () => ({
  ...process.env,
  PATH: `${Path.resolve(process.cwd(), "node_modules/.bin")}${Path.delimiter}${process.env.PATH}`,
});

/**
 * Check if oxlint is available in the project.
 * Mirrors the prettier-plugin's isPrettierInstalled() so HighVoltage stays
 * config-agnostic: the plugin self-skips on projects that don't use oxlint.
 */
const isOxlintInstalled = () => {
  try {
    require.resolve("oxlint/package.json");
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Lint created / changed files with oxlint, reporting inline via Danger.
 * oxlint discovers the project's own .oxlintrc.json itself (same delegation
 * model as the eslint plugin) — every custom rule/category is respected.
 */
exports.oxlintPlugin = async () => {
  if (!isOxlintInstalled()) {
    message("oxlint not found in project dependencies, skipping oxlint check");
    return;
  }

  const filesToLint = git.created_files.concat(git.modified_files);
  const filteredFiles = filesToLint.filter(
    (file) => !!file.match(/\.(tsx|ts|jsx|js|mjs|cjs)$/),
  );

  if (filteredFiles.length === 0) {
    message("No files to check with oxlint");
    return;
  }

  // oxlint exits non-zero when it finds errors, so capture stdout on both paths.
  let stdout = "";
  let stderr = "";
  try {
    stdout = execFileSync("oxlint", ["--format=json", ...filteredFiles], {
      encoding: "utf8",
      env: binEnv(),
    });
  } catch (error) {
    stdout = error.stdout || "";
    stderr = error.stderr || "";
  }

  let diagnostics = [];
  try {
    diagnostics = JSON.parse(stdout || "{}").diagnostics || [];
  } catch (e) {
    fail(
      `oxlint produced output that could not be parsed as JSON.${stderr ? ` stderr: ${stderr.trim()}` : ""}`,
    );
    return;
  }

  let failed = false;
  for (const diag of diagnostics) {
    const path = diag.filename ? Path.relative(".", diag.filename) : undefined;
    const span = diag.labels && diag.labels[0] && diag.labels[0].span;
    const line = span ? span.line : undefined;
    // Mirror the eslint plugin: any diagnostic fails the check; errors and
    // warnings are surfaced inline with their matching Danger severity.
    failed = true;
    const fn = diag.severity === "error" ? fail : warn;
    // diag.code is already e.g. "eslint(no-debugger)" — don't wrap in parens.
    fn(`${diag.message} ${diag.code}`, path, line);
  }

  if (failed) {
    fail("oxlint check failed, see inline comments");
  } else {
    message("oxlint check success :clap:", { icon: ":white_check_mark:" });
  }
};
