const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const getResourcesForUpdate = async (limit = 1000) => {
  const { data, error } = await supabase
    .from("resource")
    .select("id, username, updated_at")
    .not("status", "eq", "not_found")
    .order("updated_at", { ascending: true })
    .limit(limit);

  console.log("getResourcesForUpdate error", error);

  return data;
};

const upsertResources = async (
  resources,
  updateDateColumnName = "updated_at"
) => {
  const { error } = await supabase.from("resource").upsert(
    resources.map((resource) => ({
      ...resource,
      [updateDateColumnName]: "now()",
    }))
  );
  console.log("upsertResources error", error);
};

module.exports = { supabase, getResourcesForUpdate, upsertResources };
