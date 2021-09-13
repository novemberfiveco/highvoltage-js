const exec = require("child_process").exec;
const warnLevels = ['critical', 'high'];

const getSummary = (data = {}) => {
  const { vulnerabilities = {}, totalDependencies = 0 } = data;
  const totalVulnerabilities = Object.values(vulnerabilities).reduce(
    (total, level) => total + level,
    0
  );

  const relevantSummary = Object.keys(vulnerabilities)
    .map((level) => ({ level, count: vulnerabilities[level] }))
    .filter((levelCount) => levelCount.count > 0);

  const highSeverity = relevantSummary.some((result) => warnLevels.includes(result.level))

  const summary = relevantSummary
    .map((levelCount) => `${levelCount.count} ${levelCount.level}`)
    .join(", ");

  if (totalVulnerabilities > 0) {
    const dangerMessage = `Found ${totalVulnerabilities} vulnerabilities (${summary}) in ${totalDependencies} scanned packages`;
    if (highSeverity) {
      warn(dangerMessage)
    } else {
      message(dangerMessage)
    }
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

const auditCommand = "yarn audit --groups dependencies --json --summary | tail -1";

exports.yarnAudit = async () => {
  try {
    await execYarnAudit(auditCommand);
  } catch (err) {
    fail(`Yarn audit plugin error: ${err.message}`);
  }
};
