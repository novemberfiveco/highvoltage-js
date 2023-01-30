const { git } = danger;
const keywords = ["TODO", "FIXME"];

const getMatches = (diffString, keyword) => {
  if (!diffString) return [];
  const regex = new RegExp(
    `(?:\\/\\/|#|<!--|;|\\/\\*|^|\\--|\\/\\*\\*\\s*\\**)\\s*${keyword}(?::\\s*|\\s+)(.+)`,
    "gi"
  );
  const matches = diffString.match(regex);
  if (!matches || !matches.length) return [];

  return matches;
};

const getFormattedSrcLink = (filepath) => {
  return `\`${filepath}\``;
};

const prepareTodosForDanger = (addedText, filepath, keywordMatches) => {
  const result = keywordMatches;
  keywords.forEach((keyword) => {
    const addedMatches = getMatches(addedText, keyword);
    const srcLink = getFormattedSrcLink(filepath);

    addedMatches.forEach((match) => {
      result[keyword].push(`\`\`${match}\`\`: ${srcLink}`);
    });
  });
  return result;
};

/**
 * A danger-js plugin to list all todos/fixmes/etc added/changed in a PR
 */
exports.todoPlugin = async () => {
  const keywordMatches = {};

  keywords.forEach((keyword) => {
    keywordMatches[keyword] = [];
  });

  const filesToCheck = git.created_files.concat(git.modified_files);

  const results = await Promise.all(
    filesToCheck.map(async (filepath) => {
      let addedText = "";

      try {
        const diff = await danger.git.diffForFile(filepath);
        if (diff) {
          addedText = diff.added;
        }
      } catch (err) {
        throw err;
      }

      if (!addedText) return;

      return prepareTodosForDanger(addedText, filepath, keywordMatches);
    })
  );

  const mergedKeywordMatches = { ...keywordMatches, ...results };
  // output can be used to show in comments. ex: ${output.join("\n- ")}
  const output = [];
  Object.values(mergedKeywordMatches).forEach((matches) => {
    if (matches.length) {
      output.push(...matches);
    }
  });

  if (!output.length) return;

  message(
    `Found open TODO's in your PR, are you sure you want to merge this? When intentional, make sure they have a clear description`,
    { icon: ":construction:" }
  );
};
