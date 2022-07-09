const { upload: uploadZippyshare } = require("./uploaders/zippyshare");
const { upload: uploadImgbb } = require("./uploaders/imgbb");
const { fetchStats, parseTgUrl } = require("./utils/tg");
const { download } = require("./utils");
const { searchGeo } = require("./utils/geo");
const { supabase } = require("./utils/supabase");

(async () => {
  const uploaders = [uploadImgbb];
  const upload = uploaders.sort(() => 0.5 - Math.random())[0];

  try {
    const username = "google";

    const stats = await fetchStats(username);
    const {
      avatar: _avatar,
      name,
      description,
      createdAt,
      lifetime,
      subscribers,
      rank,
      type,
    } = stats;
    const avatar = await upload(await download(_avatar));

    const { data, error } = await supabase.from("resource").insert([
      {
        birthdate: createdAt,
        username,
        status: "verified",
        lifetime,
        subscribers,
        rank,
        type,
        avatar,
        name,
        description,
      },
    ]);

    console.log(stats);
    console.log(data);
    console.log(error);

    // console.log(result);
    // let geo;
    // try {
    //   geo = await searchGeo(name);
    // } catch (_error) {
    //   console.log(_error);
    // }
    // console.log({ ...stats, name, avatar, geo });
  } catch (error) {
    console.log(error);
  }
})();
