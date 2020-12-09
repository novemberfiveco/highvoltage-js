// This will be removed at runtime
import { schedule } from "danger";
const configAngular = require('@commitlint/config-angular');

const eslintPlugin = require("./plugins/eslint-plugin").eslintPlugin;
const yarnAuditPlugin = require("./plugins/yarn-audit-plugin").yarnAudit;
const packageLockPlugin = require("./plugins/package-lock-plugin")
  .packageLockPlugin;
const commitlint = require('./plugins/commit-lint-plugin').commitlint;

// Run ES lint
schedule(eslintPlugin());

// Run Yarn audit
schedule(yarnAuditPlugin());

// Run Package lock consitency
schedule(packageLockPlugin());

// Run commit lint based on angular config
const commitlintConfig = { severity: 'warn' };
schedule(commitlint(configAngular.rules, commitlintConfig));
