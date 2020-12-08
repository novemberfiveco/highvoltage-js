// This will be removed at runtime
import { schedule } from 'danger';

const eslintPlugin = require('./plugins/eslint-plugin').eslintPlugin;
const yarnAuditPlugin = require('./plugins/yarn-audit-plugin').yarnAudit;
const packageLockPlugin = require('./plugins/package-lock-plugin').packageLockPlugin;

// Run ES lint
schedule(eslintPlugin());

// Run Yarn audit
schedule(yarnAuditPlugin());

// Run Package lock consitency
schedule(packageLockPlugin())
