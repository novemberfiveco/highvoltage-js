import { schedule } from 'danger';

import eslintPlugin from './plugins/eslint-plugin';
import yarnAuditPlugin from './plugins/yarn-audit-plugin';
import packageLockPlugin from './plugins/package-lock-plugin';

// Run ES lint
schedule(eslintPlugin());

// Run Yarn audit
schedule(yarnAuditPlugin());

// Run Package lock consitency
schedule(packageLockPlugin())
