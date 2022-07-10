const {
  getResourcesForUpdateStats,
  upsertResources,
} = require("../utils/supabase");
const { runProcesses } = require("../utils/process");

const updateResourcesStats = async () => {
  const updateLimit = parseInt(process.env.UPDATE_LIMIT || "1000", 10);

  const resources = await getResourcesForUpdateStats(updateLimit);

  const result = await runProcesses(
    "./processes/fetchResourcesStats",
    resources,
    2
  );

  await upsertResources(result);

  return {
    result: result.length,
  };
};

module.exports = updateResourcesStats;
