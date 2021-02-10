// This will be removed at runtime
import { schedule } from "danger";
const configAngular = require('@commitlint/config-conventional');

const eslintPlugin = require("./plugins/eslint-plugin").eslintPlugin;
const yarnAuditPlugin = require("./plugins/yarn-audit-plugin").yarnAudit;
const packageLockPlugin = require("./plugins/package-lock-plugin")
  .packageLockPlugin;
const commitlint = require('./plugins/commit-lint-plugin').commitlint;
const highvoltageOutdatedPlugin = require('./plugins/yarn-highvoltage-outdated.js').highvoltageOutdated;

// Run ES lint
schedule(eslintPlugin());

// Run Yarn audit
schedule(yarnAuditPlugin());

// Run Package lock consitency
schedule(packageLockPlugin());

// Ensure highvoltage is on latest version
schedule(highvoltageOutdatedPlugin())

// Run commit lint based on angular config
// const commitlintConfig = { severity: 'warn' };
// TODO: Only enable this again after commitizen is in line with commitlint
//schedule(commitlint(configAngular.rules, commitlintConfig));
