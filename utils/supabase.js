const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const getResourcesForUpdateInfo = async (limit = 1000) => {
  const { data, error } = await supabase
    .from("resource")
    .select("id, username, status, updated_at")
    .in("type", ["channel", "group"])
    .order("info_updated_at", { ascending: true })
    .limit(limit);

  console.log("[getResourcesForUpdateInfo] error:", error);

  return data;
};

const getResourcesForUpdateStats = async (limit = 1000) => {
  const { data, error } = await supabase
    .from("resource")
    .select("id, username, subscribers, birthdate, updated_at")
    .in("type", ["channel", "group"])
    .order("stats_updated_at", { ascending: true })
    .limit(limit);

  console.log("[getResourcesForUpdateStats] error:", error);

  return data;
};

const upsert = async (table, items) => {
  const itemsGrouped = items.reduce((grouped, resource) => {
    const keys = Object.keys(resource).sort().join(",");
    if (grouped[keys]) {
      grouped[keys].push(resource);
    } else {
      grouped[keys] = [resource];
    }
    return grouped;
  }, {});

  for (let [key, items] of Object.entries(itemsGrouped)) {
    console.log(`[upsert] ${table}: (${key}): begin`);
    const { error } = await supabase.from(table).upsert(items);
    console.log(`[upsert] ${table}: (${key}): end`, error);
  }
};

module.exports = {
  supabase,
  getResourcesForUpdateInfo,
  getResourcesForUpdateStats,
  upsert,
};
