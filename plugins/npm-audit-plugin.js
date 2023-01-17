const exec = require("child_process").exec;
const warnLevels = ["critical", "high"];

const getSummary = (metadata = {}) => {
  const { vulnerabilities = {}, dependencies = 0 } = metadata;
  const totalVulnerabilities = Object.values(vulnerabilities).reduce(
    (total, level) => total + level,
    0
  );
  const relevantSummary = Object.keys(vulnerabilities)
    .map((level) => ({ level, count: vulnerabilities[level] }))
    .filter((levelCount) => levelCount.count > 0);

  const highSeverity = relevantSummary.some((result) =>
    warnLevels.includes(result.level)
  );

  const summary = relevantSummary
    .map((levelCount) => `${levelCount.count} ${levelCount.level}`)
    .join(", ");

  if (totalVulnerabilities > 0) {
    const dangerMessage = `Found ${totalVulnerabilities} vulnerabilities (${summary}) in ${dependencies.total} scanned packages`;
    if (highSeverity) {
      warn(dangerMessage);
    } else {
      message(dangerMessage);
    }
  }
};

const execNpmAudit = (auditCommand) => {
  return new Promise((resolve, reject) => {
    exec(auditCommand, function (error, stdout, stderr) {
      if (stdout) {
        const { metadata } = JSON.parse(stdout);
        resolve(getSummary(metadata));
      }
      if (error !== null) {
        reject(error);
      }
    });
  });
};

exports.npmAudit = async (options = {}) => {
  let auditCommand = "npm audit --json";
  if (options.registry) {
    auditCommand += ` --registry ${options.registry}`;
  }

  try {
    const severityline = await execNpmAudit(auditCommand);
    if (severityline) {
      message(severityline);
    }
  } catch (err) {
    fail("npm audit plugin error: " + err.message);
  }
};
