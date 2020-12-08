import { fail } from 'danger';
import { exec } from 'child_process';

interface SummaryData {
  vulnerabilities: {
    info: number;
    low: number;
    moderate: number;
    high: number;
    critical: number;
  };
  devDependencies: number;
  dependencies: number;
  optionalDependencies: number;
  totalDependencies: number;
}

const getSummary = (data: SummaryData) => {
  const { vulnerabilities = {} as SummaryData['vulnerabilities'], totalDependencies = 0 } = data;
  const totalVulnerabilities = Object.values(vulnerabilities).reduce<number>(
    (total, level) => total + level,
    0,
  );

  const summary = Object.keys(vulnerabilities)
    .map(level => ({ level, count: vulnerabilities[level] }))
    .filter(levelCount => levelCount.count > 0)
    .map(levelCount => `${levelCount.count} ${levelCount.level}`)
    .join(', ');

  if (totalVulnerabilities > 0) {
    return `Found ${totalVulnerabilities} vulnerabilities (${summary}) in ${totalDependencies} scanned packages`;
  }
};

const execYarnAudit = (auditCommand: string) =>
  new Promise((resolve, reject) => {
    exec(auditCommand, (error, stdout, stderr) => {
      if (stdout) {
        const { data } = JSON.parse(stdout);
        resolve(getSummary(data));
      }
      if (error !== null) reject(error);
      if (stderr !== null) reject(stderr);
    });
  });

const auditCommand = 'yarn audit --json --summary';

export default async function yarnAudit() {
  try {
    const severityLine = await execYarnAudit(auditCommand);
    if (severityLine) {
      fail(severityLine as string);
    }
  } catch (err) {
    fail(`Yarn audit plugin error: ${err.message}`);
  }
}
