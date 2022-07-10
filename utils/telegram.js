const { fetchContent } = require("./basic");

class ErrorNotAllowed extends Error {}
class ErrorNotFound extends Error {}

const fetchAvatar = async (username) => {
  const previewContent = await fetchContent(`https://t.me/${username}`);

  const [, avatar] = previewContent.match(/<img.+?src="(.+?)"/i) || [];

  return avatar;
};

const fetchInfo = async (username) => {
  if (!username) {
    throw new Error("tgId is required.");
  }

  const messageContentFirst = await fetchContent(
    `https://t.me/${username}/1?embed=1`
  );

  const [, birthdate = ""] =
    messageContentFirst.match(/datetime="(.+?)"/) || [];

  if (
    messageContentFirst.includes("can’t be displayed") ||
    messageContentFirst.includes("unavailable")
  ) {
    throw new ErrorNotAllowed("Not allowed");
  }

  if (messageContentFirst.includes("not found") || !birthdate) {
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

  // const [, avatar] = previewContent.match(/<img.+?src="(.+?)"/i) || [];

  const type = await getTgUrlTypeByContent(
    `https://t.me/${username}`,
    previewContent
  );

  return {
    subscribers,
    birthdate,
    name,
    description,
    type,
  };
};

const fetchSubscribers = async (username) => {
  const previewContent = await fetchContent(`https://t.me/${username}`);

  const [subscribersMatch = ""] =
    previewContent.match(/([\d ]+)(subscriber|subscribers|members|member)/gi) ||
    [];
  const subscribers = parseInt(
    subscribersMatch.replace(/[^\d]/g, "") || "-1",
    10
  );

  if (subscribers === -1) {
    const previewContent = await fetchContent(`https://t.me/s/${username}`);

    const [subscribersMatch = ""] =
      previewContent.match(
        /([\d ]+)(subscriber|subscribers|members|member)/gi
      ) || [];
    const subscribers = parseInt(
      subscribersMatch.replace(/[^\d]/g, "") || "-1",
      10
    );

    return subscribers;
  }

  return subscribers;
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
  fetchInfo,
  fetchAvatar,
  parseTgUrl,
  fetchSubscribers,
  fetchTgUrlType,
  ErrorNotAllowed,
  ErrorNotFound,
};
