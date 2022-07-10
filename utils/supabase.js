const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const getResourcesForUpdateInfo = async (limit = 1000) => {
  const { data, error } = await supabase
    .from("resource")
    .select("id, username, status, updated_at")
    // .not("status", "eq", "not_found")
    .order("updated_at", { ascending: true })
    .limit(limit);

  console.log("[getResourcesForUpdateInfo] error:", error);

  return data;
};

const getResourcesForUpdateStats = async (limit = 1000) => {
  const { data, error } = await supabase
    .from("resource")
    .select("id, username, subscribers, birthdate, updated_at")
    // .eq("status", "set")
    .order("updated_at", { ascending: true })
    .limit(limit);

  console.log("[getResourcesForUpdateStats] error:", error);

  return data;
};

const upsertResources = async (resources) => {
  const grouped = resources.reduce((grouped, resource) => {
    const keys = Object.keys(resource).sort().join(",");
    if (grouped[keys]) {
      grouped[keys].push(resource);
    } else {
      grouped[keys] = [resource];
    }
    return grouped;
  }, {});

  for (let [key, items] of Object.entries(grouped)) {
    console.log(`[upsert] (${key}): begin`);
    const { error } = await supabase.from("resource").upsert(items);
    console.log(`[upsert] (${key}): end`, error);
  }
};

module.exports = {
  supabase,
  getResourcesForUpdateInfo,
  getResourcesForUpdateStats,
  upsertResources,
};
