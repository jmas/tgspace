const { runProcesses } = require("../utils/process");
const { upsert } = require("../utils/supabase");
const { getResourcesForUpdateAvatar } = require("../utils/queries");

const updateResourcesAvatars = async () => {
  const updateLimit = parseInt(process.env.UPDATE_LIMIT || "1000", 10);

  const resources = await getResourcesForUpdateAvatar(updateLimit);

  const result = await runProcesses(
    "./processes/fetchResourcesAvatar",
    resources,
    2
  );

  await upsert("resource", result);

  return {
    result: result.length,
  };
};

module.exports = updateResourcesAvatars;
