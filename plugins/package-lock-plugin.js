const { includesLocalFile } = require("./utils/changed-files");

const { git } = danger;

exports.packageLockPlugin = async () => {
  // Matched against paths relative to the directory the check runs in, so this
  // still fires for `frontend/package.json` in a monorepo.
  const packageChanged = includesLocalFile(git.modified_files, "package.json");
  const lockfileChanged = includesLocalFile(
    git.modified_files,
    "package-lock.json",
  );
  if (packageChanged && !lockfileChanged) {
    const message =
      "Changes were made to package.json, but not to package-lock.json";
    const idea = "Perhaps you need to run `npm install`?";
    warn(`${message} - **${idea}**`);
  }
};
