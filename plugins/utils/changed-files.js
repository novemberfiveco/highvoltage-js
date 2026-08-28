const Fs = require("fs");
const Path = require("path");
const { execFileSync } = require("child_process");

/**
 * Danger reports changed files relative to the *repository root*. That is the
 * right shape for Danger's own APIs (`git.diffForFile`), but the wrong shape for
 * a tool we invoke ourselves, which resolves paths against `process.cwd()`.
 *
 * In a single-package repo the two are the same directory, so nothing changes.
 * In a monorepo, Danger reports `frontend/src/a.ts` while the check runs from
 * `<repo>/frontend`, so the path resolves to `frontend/frontend/src/a.ts` and
 * the tool fails — ESLint throws NoFilesFoundError and takes the whole Danger
 * run down with it.
 *
 * Use `toLocalPaths` at the point where paths are handed to an external tool.
 * Never use it for paths passed back to Danger.
 */

// Workspace roots exported by the CI providers, used when `git` is unavailable.
const CI_WORKSPACE_VARS = [
  "BITRISE_SOURCE_DIR",
  "GITHUB_WORKSPACE",
  "CI_PROJECT_DIR",
  "BUILD_REPOSITORY_LOCALPATH",
];

/**
 * Locate the repository root, or null when it cannot be determined.
 */
const findRepositoryRoot = (cwd) => {
  try {
    return execFileSync("git", ["rev-parse", "--show-toplevel"], {
      cwd,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  } catch (e) {
    // No usable git — fall through to the CI-provided workspace root.
  }

  for (const key of CI_WORKSPACE_VARS) {
    if (process.env[key]) return process.env[key];
  }

  return null;
};

/**
 * Last resort when the repository root is unknown: drop leading path segments
 * until the remainder resolves inside `cwd`, so `frontend/src/a.ts` becomes
 * `src/a.ts`. Returns null when no suffix resolves, i.e. the file does not
 * belong to this package.
 *
 * A path is never returned unverified: handing a non-existent path to a linter
 * fails the entire run instead of just skipping that one file.
 */
const stripPrefixToLocalFile = (file, cwd) => {
  const segments = file.split(/[\\/]/).filter(Boolean);

  for (let i = 0; i < segments.length; i++) {
    const candidate = segments.slice(i).join(Path.sep);
    if (Fs.existsSync(Path.resolve(cwd, candidate))) return candidate;
  }

  return null;
};

/**
 * Convert repository-root-relative paths from Danger into paths relative to the
 * directory the check runs in, dropping anything that does not resolve inside
 * it — files belonging to a sibling package, and files that no longer exist.
 *
 * @param {string[]} files repository-root-relative paths
 * @param {{ cwd?: string, repositoryRoot?: string|null }} [options]
 * @returns {string[]} paths relative to `cwd`
 */
const toLocalPaths = (files, options = {}) => {
  const cwd = options.cwd || process.cwd();
  const repositoryRoot = Object.prototype.hasOwnProperty.call(
    options,
    "repositoryRoot",
  )
    ? options.repositoryRoot
    : findRepositoryRoot(cwd);

  return files
    .map((file) => {
      if (!repositoryRoot) return stripPrefixToLocalFile(file, cwd);

      const local = Path.relative(cwd, Path.resolve(repositoryRoot, file));
      // Outside this package (a sibling package, or above the root).
      if (local === "" || local.startsWith("..") || Path.isAbsolute(local)) {
        return null;
      }

      return Fs.existsSync(Path.resolve(cwd, local)) ? local : null;
    })
    .filter((file) => file !== null);
};

/**
 * True when `name` (a path relative to the directory the check runs in, e.g.
 * "package.json") is among the changed files. Needed because a bare
 * `files.includes("package.json")` silently never matches in a monorepo, where
 * Danger reports "frontend/package.json".
 */
const includesLocalFile = (files, name, options = {}) =>
  toLocalPaths(files, options).includes(name);

module.exports = {
  findRepositoryRoot,
  toLocalPaths,
  includesLocalFile,
};
