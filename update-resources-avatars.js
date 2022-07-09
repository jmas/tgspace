const { upload: uploadZippyshare } = require("./uploaders/zippyshare");
const { upload: uploadImgbb } = require("./uploaders/imgbb");
const { download } = require("./utils");

const uploaders = [uploadImgbb]; // uploadZippyshare
const upload = uploaders.sort(() => 0.5 - Math.random())[0];

const updateResourcesAvatars = async () => {
  // const avatar = await upload(await download(avatar));
};

module.exports = {
  updateResourcesAvatars,
};
