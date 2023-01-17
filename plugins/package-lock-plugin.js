const { git } = danger;

exports.packageLockPlugin = async () => {
  const packageChanged = git.modified_files.includes("package.json");
  const lockfileChanged = git.modified_files.includes("package-lock.json");
  if (packageChanged && !lockfileChanged) {
    const message =
      "Changes were made to package.json, but not to package-lock.json";
    const idea = "Perhaps you need to run `npm install`?";
    warn(`${message} - **${idea}**`);
  }
};
