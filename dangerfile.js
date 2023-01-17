// This will be removed at runtime
import { schedule } from "danger";

const eslintPlugin = require("./plugins/eslint-plugin").eslintPlugin;
const npmAuditPlugin = require("./plugins/npm-audit-plugin").npmAudit;
const packageLockPlugin =
  require("./plugins/package-lock-plugin").packageLockPlugin;
const highvoltageOutdatedPlugin =
  require("./plugins/npm-highvoltage-outdated.js").highvoltageOutdated;

// Run ES lint
schedule(eslintPlugin());

// // Run NPM audit
schedule(npmAuditPlugin());

// // Run Package lock consitency
schedule(packageLockPlugin());

// Ensure highvoltage is on latest version
schedule(highvoltageOutdatedPlugin());
