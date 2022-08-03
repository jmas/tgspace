const { supabase } = require("./supabase");
const { subWeeks, subDays, formatISO } = require("date-fns");

const cleanupUpdates = async () => {
  const date = formatISO(subDays(new Date(), 14), { representation: "date" });

  console.log("[cleanupUpdates] date:", date);

  const { data, error, count } = await supabase.rpc("cleanup");

  console.log("[cleanupUpdates] data:", data);
  console.log("[cleanupUpdates] count:", count);
  console.log("[cleanupUpdates] error:", error);

  return data;
};

const getResourcesForUpdateInfo = async (limit = 1000) => {
  const { data, error } = await supabase
    .from("resource")
    .select("id, username, status, info_updated_at")
    .order("info_updated_at", { ascending: true })
    .limit(limit);

  console.log("[getResourcesForUpdateInfo] error:", error);

  return data;
};

const getResourcesForUpdateAvatar = async (limit = 1000) => {
  const { data, error } = await supabase
    .from("resource")
    .select("id, username")
    .order("avatar_updated_at", { ascending: true })
    .lte(
      "avatar_updated_at",
      subWeeks(new Date(), 1).toISOString().split("T")[0]
    )
    .limit(limit);

  console.log("[getResourcesForUpdateAvatar] error:", error);

  return data;
};

const getResourcesForUpdateStats = async (limit = 1000) => {
  const { data, error } = await supabase
    .from("resource")
    .select("id, username, subscribers, birthdate")
    .in("type", ["channel", "group"])
    // .eq('username', 'lu_di_z')
    .order("stats_updated_at", { ascending: true })
    .limit(limit);

  console.log("[getResourcesForUpdateStats] error:", error);

  return data;
};

module.exports = {
  getResourcesForUpdateInfo,
  getResourcesForUpdateStats,
  getResourcesForUpdateAvatar,
  cleanupUpdates,
};
