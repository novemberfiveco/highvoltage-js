const test = require("node:test");
const assert = require("node:assert/strict");
const Fs = require("node:fs");
const Os = require("node:os");
const Path = require("node:path");

const {
  toLocalPaths,
  includesLocalFile,
} = require("../plugins/utils/changed-files");

/**
 * Build a throwaway repo layout on disk. Existence is part of the contract, so
 * these have to be real files.
 */
const fixture = (files) => {
  const root = Fs.mkdtempSync(Path.join(Os.tmpdir(), "highvoltage-"));
  for (const file of files) {
    const target = Path.join(root, file);
    Fs.mkdirSync(Path.dirname(target), { recursive: true });
    Fs.writeFileSync(target, "");
  }
  return root;
};

test("single-package repo: paths are unchanged", () => {
  // Backwards compatibility: repository root and cwd are the same directory,
  // which is every consumer that existed before monorepo support.
  const root = fixture(["src/a.ts", "package.json"]);

  assert.deepEqual(
    toLocalPaths(["src/a.ts", "package.json"], {
      cwd: root,
      repositoryRoot: root,
    }),
    ["src/a.ts", "package.json"],
  );
});

test("monorepo: the package prefix is stripped", () => {
  const root = fixture(["frontend/src/a.ts", "frontend/metro.config.js"]);

  assert.deepEqual(
    toLocalPaths(["frontend/src/a.ts", "frontend/metro.config.js"], {
      cwd: Path.join(root, "frontend"),
      repositoryRoot: root,
    }),
    [Path.join("src", "a.ts"), "metro.config.js"],
  );
});

test("monorepo: files in sibling packages are dropped", () => {
  const root = fixture(["frontend/src/a.ts", "serverless/handler.py"]);

  assert.deepEqual(
    toLocalPaths(["frontend/src/a.ts", "serverless/handler.py"], {
      cwd: Path.join(root, "frontend"),
      repositoryRoot: root,
    }),
    [Path.join("src", "a.ts")],
  );
});

test("non-existent files are dropped rather than passed on", () => {
  // A missing path makes ESLint throw NoFilesFoundError, which fails the whole
  // Danger run instead of skipping one file.
  const root = fixture(["src/a.ts"]);

  assert.deepEqual(
    toLocalPaths(["src/a.ts", "src/deleted.ts"], {
      cwd: root,
      repositoryRoot: root,
    }),
    ["src/a.ts"],
  );
});

test("no repository root: falls back to stripping the prefix", () => {
  // Neither git nor a CI workspace variable is available. The old behaviour
  // returned the paths untouched, which reproduced the very failure this
  // helper prevents.
  const root = fixture(["frontend/src/a.ts"]);

  assert.deepEqual(
    toLocalPaths(["frontend/src/a.ts"], {
      cwd: Path.join(root, "frontend"),
      repositoryRoot: null,
    }),
    [Path.join("src", "a.ts")],
  );
});

test("no repository root: unresolvable paths are still dropped", () => {
  const root = fixture(["frontend/src/a.ts"]);

  assert.deepEqual(
    toLocalPaths(["serverless/handler.py"], {
      cwd: Path.join(root, "frontend"),
      repositoryRoot: null,
    }),
    [],
  );
});

test("includesLocalFile matches a root lockfile in both layouts", () => {
  const single = fixture(["package.json"]);
  assert.equal(
    includesLocalFile(["package.json"], "package.json", {
      cwd: single,
      repositoryRoot: single,
    }),
    true,
  );

  const mono = fixture(["frontend/package.json"]);
  assert.equal(
    includesLocalFile(["frontend/package.json"], "package.json", {
      cwd: Path.join(mono, "frontend"),
      repositoryRoot: mono,
    }),
    true,
  );
});

test("includesLocalFile ignores a sibling package's lockfile", () => {
  const root = fixture(["frontend/package.json", "serverless/package.json"]);

  assert.equal(
    includesLocalFile(["serverless/package.json"], "package.json", {
      cwd: Path.join(root, "frontend"),
      repositoryRoot: root,
    }),
    false,
  );
});
