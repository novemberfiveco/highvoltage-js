const lint = require('@commitlint/lint').default;

const defaultConfig = { severity: "fail" };

const lintCommitMessage = async (commitMessage, rules, severity) => {
  return lint(commitMessage, rules).then((report) => {
    if (!report.valid) {
      let failureMessage = `There is a problem with the commit message\n> ${commitMessage}`;
      report.errors.forEach((error) => {
        failureMessage = `${failureMessage}\n- ${error.message}`;
      });
      switch (severity) {
        case "fail":
          fail(failureMessage);
          break;
        case "warn":
          warn(failureMessage);
          break;
        case "message":
          message(failureMessage);
          break;
        case "disable":
          break;
      }
    }
  });
}

exports.commitlint = async (rules, userConfig) => {
  const config = { ...defaultConfig, ...userConfig };

  for (const commit of danger.git.commits) {
    await lintCommitMessage(commit.message, rules, config.severity);
  }
};
