// const { runProcesses } = require("../utils/process");
const { upsert } = require("../utils/supabase");
const { getResourcesForUpdateAvatar } = require("../utils/queries");
const fetchResourcesAvatar = require("../operations/fetchResourcesAvatar");

const updateResourcesAvatars = async () => {
  const updateLimit = 500; // parseInt(process.env.UPDATE_LIMIT || "1000", 10);

  const resources = await getResourcesForUpdateAvatar(updateLimit);

  // const result = await runProcesses(
  //   "./processes/fetchResourcesAvatar",
  //   resources,
  //   2
  // );

  const result = await fetchResourcesAvatar(resources);

  await upsert("resource", result);

  return {
    result: result.length,
  };
};

module.exports = updateResourcesAvatars;
