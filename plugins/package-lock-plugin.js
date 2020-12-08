const { git } = danger;

exports.packageLockPlugin = async () => {
  const packageChanged = git.modified_files.includes("package.json");
  const lockfileChanged = git.modified_files.includes("yarn.lock");
  if (packageChanged && !lockfileChanged) {
    const message = "Changes were made to package.json, but not to yarn.lock";
    const idea = "Perhaps you need to run `yarn install`?";
    warn(`${message} - **${idea}**`);
  }
};
