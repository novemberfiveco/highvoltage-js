// This will be removed at runtime
import { schedule } from "danger";

const { eslintPlugin } = require("./plugins/eslint-plugin");
const { npmAuditPlugin } = require("./plugins/npm-audit-plugin");
const { packageLockPlugin } = require("./plugins/package-lock-plugin");
const {
  highvoltageOutdatedPlugin,
} = require("./plugins/highvoltage-outdated-plugin");
const { todoPlugin } = require("./plugins/todo-plugin");

// Run ES lint
schedule(eslintPlugin());

// Run NPM audit
schedule(npmAuditPlugin());

// Run Package lock consitency
schedule(packageLockPlugin());

// Ensure highvoltage is on latest version
schedule(highvoltageOutdatedPlugin());

// Check for open TODO's
schedule(todoPlugin());
