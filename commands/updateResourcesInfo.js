const { getResourcesForUpdateInfo, upsert } = require("../utils/supabase");
const { runProcesses } = require("../utils/process");

const updateResourcesInfo = async () => {
  const updateLimit = parseInt(process.env.UPDATE_LIMIT || "1000", 10);

  const resources = await getResourcesForUpdateInfo(updateLimit);

  const result = await runProcesses(
    "./processes/fetchResourcesInfo",
    resources,
    2
  );

  await upsert("resource", result);

  return {
    result: result.length,
  };
};

module.exports = updateResourcesInfo;
