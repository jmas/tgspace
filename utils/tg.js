const { fetchContent, getDaysBetween } = require(".");

class ErrorNotAllowed extends Error {}
class ErrorNotFound extends Error {}

const fetchStats = async (username) => {
  if (!username) {
    throw new Error("tgId is required.");
  }

  const messageContentFirst = await fetchContent(
    `https://t.me/${username}/1?embed=1`
  );

  const [, createdAt = ""] =
    messageContentFirst.match(/datetime="(.+?)"/) || [];

  if (
    messageContentFirst.includes("can’t be displayed") ||
    messageContentFirst.includes("unavailable")
  ) {
    throw new ErrorNotAllowed("Not allowed");
  }

  if (messageContentFirst.includes("not found") || !createdAt) {
    throw new ErrorNotFound("Not found");
  }

  const previewContent = await fetchContent(`https://t.me/${username}`);

  const [subscribersMatch = "0"] =
    previewContent.match(/([\d ]+)(subscriber|subscribers|members|member)/gi) ||
    [];
  const subscribers = parseInt(
    subscribersMatch.replace(/[^\d]/g, "") || "0",
    10
  );
  const [, name = ""] =
    previewContent.match(
      /<div.+?class="tgme_page_title".+?>.+?<.+?>(.+?)<\/.+?><\/div>/is
    ) || [];
  const [, description = ""] =
    previewContent.match(
      /<div.+?class="tgme_page_description".+?>(.+?)<\/div>/is
    ) || [];

  const lifetime = getDaysBetween(new Date(), createdAt);
  const rank = subscribers / lifetime;

  const [, avatar] = previewContent.match(/<img.+?src="(.+?)"/i) || [];

  const type = await getTgUrlTypeByContent(
    `https://t.me/${username}`,
    previewContent
  );

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

const getTgUrlTypeByContent = async (url, content) => {
  // const content = await fetchContent(url);

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
  ErrorNotAllowed,
  ErrorNotFound,
};
