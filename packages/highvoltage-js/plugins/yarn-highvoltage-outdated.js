const exec = require("child_process").exec;

const getSummary = (data = {}) => {
  const { body } = data;
  const currentVersion = body[0][1];
  const wantedVersion = body[0][3];

  if (currentVersion === wantedVersion) return null;

  return `@novemberfiveco/highvoltage-js is outdated (${currentVersion}) please upgrade to the latest version (${wantedVersion})`;
};

const execYarnAudit = (command) =>
  new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (stdout) {
        // First line contains some info, second line contains the data we need
        const { data } = JSON.parse(stdout);
        resolve(getSummary(data));
      }
      if (stderr) reject(stderr);
      if (error) reject(error);
    });
  });

const command = "yarn outdated --json @novemberfiveco/highvoltage-js | tail -1";

exports.highvoltageOutdated = async () => {
  try {
    const severityLine = await execYarnAudit(command);
    if (severityLine) {
      warn(severityLine);
    }
  } catch (err) {
    fail(`Yarn outdated plugin error: ${err.message}`);
  }
};
