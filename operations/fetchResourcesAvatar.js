const { fetchAvatar } = require("../utils/telegram");
const { upload: uploadZippyshare } = require("../uploaders/zippyshare");
const { upload: uploadImgbb } = require("../uploaders/imgbb");
const { download } = require("../utils/basic");

const uploaders = [uploadImgbb]; // uploadZippyshare
const upload = uploaders.sort(() => 0.5 - Math.random())[0];

const fetchResourcesAvatar = async (resources) => {
  console.log(
    `[fetchResourcesAvatar]:`,
    resources.map(({ id, username }) => `${id} - ${username}`).join(", ")
  );

  const result = [];

  for (let resource of resources) {
    const { id, username } = resource;

    const _avatar = await fetchAvatar(username);

    if (_avatar) {
      const avatar = await upload(await download(_avatar));

      result.push({
        id,
        avatar,
        avatar_updated_at: "now()",
      });

      console.log(`[fetchResourcesAvatar] ${username}: avatar exists`);
    } else {
      console.log(`[fetchResourcesAvatar] ${username}: avatar doesn't exists`);

      result.push({ id, avatar_updated_at: "now()" });
    }
  }

  console.log(`[fetchResourcesAvatar] result`, result.length);

  return result;
};

module.exports = fetchResourcesAvatar;
