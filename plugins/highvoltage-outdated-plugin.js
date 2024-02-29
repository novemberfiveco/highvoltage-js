const exec = require("child_process").exec;

const getSummary = (data = {}) => {
  if (Object.keys(data).length === 0) return null;

  const { current, latest } = Object.values(data)[0];

  if (current === latest) return null;

  warn(
    `@novemberfiveco/highvoltage-js is outdated (${current}) please upgrade to the latest version (${latest})`,
  );
};

const execNpmAudit = (command) =>
  new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (stdout) {
        resolve(getSummary(JSON.parse(stdout)));
      }
      if (stderr) reject(stderr);
      if (error) reject(error);
    });
  });

const command = "npm outdated --json @novemberfiveco/highvoltage-js";

exports.highvoltageOutdatedPlugin = async () => {
  try {
    await execNpmAudit(command);
  } catch (err) {
    fail(`Npm outdated plugin error: ${err.message}`);
  }
};
