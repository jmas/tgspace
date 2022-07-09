const { fetchContent, getDaysBetween } = require(".");

const fetchStats = async (username) => {
  if (!username) {
    throw new Error("tgId is required.");
  }

  const messageContentFirst = await fetchContent(
    `https://t.me/${username}/1?embed=1`
  );

  if (
    messageContentFirst.includes("not found") ||
    messageContentFirst.includes("can’t be displayed") ||
    messageContentFirst.includes("unavailable")
  ) {
    throw new Error("Not found");
  }

  const previewContent = await fetchContent(`https://t.me/${username}`);

  const [subscribersMatch = "0"] =
    previewContent.match(/([\d ]+)(subscriber|subscribers|members|member)/gi) ||
    [];
  const subscribers = parseInt(
    subscribersMatch.replace(/[^\d]/g, "") || "0",
    10
  );
  const [, createdAt = ""] =
    messageContentFirst.match(/datetime="(.+?)"/) || [];
  const [, name = ""] =
    previewContent.match(
      /<div.+?class="tgme_page_title".+?>.+?<.+?>(.+?)<\/.+?><\/div>/is
    ) || [];
  const [, description = ""] =
    previewContent.match(
      /<div.+?class="tgme_page_description".+?>(.+?)<\/div>/is
    ) || [];

  if (!createdAt) {
    throw new Error("Not found");
  }

  const lifetime = getDaysBetween(new Date(), createdAt);
  const rank = subscribers / lifetime;

  const [, avatar] = previewContent.match(/<img.+?src="(.+?)"/i) || [];

  const type = await fetchTgUrlType(`https://t.me/${username}`);

  return {
    subscribers,
    createdAt,
    lifetime,
    rank,
    name,
    description,
    avatar,
    type,
  };
};

const parseTgUrl = (urlOrName) => {
  const [channel] = urlOrName.split("/").slice(-1);

  return channel;
};

const fetchTgUrlType = async (url) => {
  const content = await fetchContent(url);

  if (!content) {
    return "";
  }

  if (url.toLowerCase().endsWith("bot")) {
    return "bot";
  }

  if (content.includes("Preview channel")) {
    return "channel";
  }

  return "group";
};

module.exports = {
  fetchStats,
  parseTgUrl,
  getTgUrlType: fetchTgUrlType,
};
