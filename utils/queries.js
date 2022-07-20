const { supabase } = require("./supabase");
const subMonths = require("date-fns/subMonths");

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
      subMonths(new Date(), 4).toISOString().split("T")[0]
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
};
