const exec = require("child_process").exec;

const getSummary = (data = {}) => {
  const { vulnerabilities = {}, totalDependencies = 0 } = data;
  const totalVulnerabilities = Object.values(vulnerabilities).reduce(
    (total, level) => total + level,
    0
  );

  const summary = Object.keys(vulnerabilities)
    .map((level) => ({ level, count: vulnerabilities[level] }))
    .filter((levelCount) => levelCount.count > 0)
    .map((levelCount) => `${levelCount.count} ${levelCount.level}`)
    .join(", ");

  if (totalVulnerabilities > 0) {
    return `Found ${totalVulnerabilities} vulnerabilities (${summary}) in ${totalDependencies} scanned packages`;
  }
};

const execYarnAudit = (auditCommand) =>
  new Promise((resolve, reject) => {
    exec(auditCommand, (error, stdout, stderr) => {
      if (stdout) {
        const { data } = JSON.parse(stdout);
        resolve(getSummary(data));
      }
      if (stderr) reject(error);
    });
  });

const auditCommand = "yarn audit --json --summary";

exports.yarnAudit = async () => {
  try {
    const severityLine = await execYarnAudit(auditCommand);
    if (severityLine) {
      warn(severityLine);
    }
  } catch (err) {
    fail(`Yarn audit plugin error: ${err.message}`);
  }
};
