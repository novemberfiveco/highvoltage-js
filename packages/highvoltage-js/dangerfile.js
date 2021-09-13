// This will be removed at runtime
import { schedule } from "danger";
const configAngular = require('@commitlint/config-conventional');

const eslintPlugin = require("./plugins/eslint-plugin").eslintPlugin;
const yarnAuditPlugin = require("./plugins/yarn-audit-plugin").yarnAudit;
const packageLockPlugin = require("./plugins/package-lock-plugin")
  .packageLockPlugin;
const commitlint = require('./plugins/commit-lint-plugin').commitlint;
const highvoltageOutdatedPlugin = require('./plugins/yarn-highvoltage-outdated.js').highvoltageOutdated;
const noConsolePlugin = require('./plugins/no-console-plugin').noConsole;

// Run ES lint
schedule(eslintPlugin());

// Run Yarn audit
schedule(yarnAuditPlugin());

// Run Package lock consitency
schedule(packageLockPlugin());

// Ensure highvoltage is on latest version
schedule(highvoltageOutdatedPlugin());

// Ensure we dont have a console statement somewhere
schedule(noConsolePlugin({ whitelist: ['error', 'warn'] }));
