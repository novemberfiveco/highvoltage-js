// This will be removed at runtime
import { schedule } from "danger";

const { eslintPlugin } = require("./plugins/eslint-plugin");
const { prettierPlugin } = require("./plugins/prettier-plugin");
const { oxlintPlugin } = require("./plugins/oxlint-plugin");
const { oxfmtPlugin } = require("./plugins/oxfmt-plugin");
const { npmAuditPlugin } = require("./plugins/npm-audit-plugin");
const { packageLockPlugin } = require("./plugins/package-lock-plugin");
const {
  highvoltageOutdatedPlugin,
} = require("./plugins/highvoltage-outdated-plugin");
const { todoPlugin } = require("./plugins/todo-plugin");

// Run ESLint (skips automatically on projects without an ESLint config)
schedule(eslintPlugin());

// Run Prettier (skips automatically when prettier is not a project dependency)
schedule(prettierPlugin());

// Run oxlint (skips automatically when oxlint is not a project dependency)
schedule(oxlintPlugin());

// Run oxfmt (skips automatically when oxfmt is not a project dependency)
schedule(oxfmtPlugin());

// Run NPM audit
schedule(npmAuditPlugin());

// Run Package lock consitency
schedule(packageLockPlugin());

// Ensure highvoltage is on latest version
schedule(highvoltageOutdatedPlugin());

// Check for open TODO's
schedule(todoPlugin());
