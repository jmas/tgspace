const { getResourcesForUpdateStats, upsert } = require("../utils/supabase");
const { runProcesses } = require("../utils/process");

const updateResourcesStats = async () => {
  const updateLimit = parseInt(process.env.UPDATE_LIMIT || "1000", 10);

  const resources = await getResourcesForUpdateStats(updateLimit);

  const result = await runProcesses(
    "./processes/fetchResourcesStats",
    resources,
    2
  );

  await upsert("resource", result);

  const updates = [];

  for (const { id, subscribers } of result) {
    if (subscribers !== undefined) {
      updates.push({
        resource_id: id,
        date: new Date().toISOString().split("T").slice(0, 1)[0],
        key: "subscribers",
        value: subscribers,
      });
    }
  }

  await upsert("update", updates);

  return {
    result: result.length,
  };
};

module.exports = updateResourcesStats;
