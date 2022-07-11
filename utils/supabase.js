const { createClient } = require("@supabase/supabase-js");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

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
  upsert,
};
