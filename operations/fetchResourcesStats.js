const { fetchSubscribers } = require("../utils/telegram");
const { getDaysBetween } = require("../utils/basic");

const fetchResourcesStats = async (resources) => {
  console.log(
    `[fetchResourcesStats]:`,
    resources.map(({ id, username }) => `${id} - ${username}`).join(", ")
  );

  const result = [];

  for (let resource of resources) {
    const { id, username, subscribers: oldSubscribers, birthdate } = resource;

    const subscribers = await fetchSubscribers(username);

    if (subscribers >= 0) {
      const lifetime = getDaysBetween(new Date(), birthdate);
      const rank = subscribers / lifetime;

      if (String(oldSubscribers) !== String(subscribers)) {
        result.push({
          id,
          lifetime,
          rank,
          subscribers,
          stats_updated_at: "now()",
        });

        console.log(
          `[fetchResourcesStats] ${username}: update stats (${oldSubscribers} > ${subscribers})`
        );
      } else {
        console.log(
          `[fetchResourcesStats] ${username}: skip stats (count the same) ${oldSubscribers} ${subscribers}`
        );

        result.push({ id, stats_updated_at: "now()" });
      }
    } else {
      console.log(
        `[fetchResourcesStats] ${username}: skip stats (can't fetch ${subscribers})`
      );

      result.push({ id, stats_updated_at: "now()" });
    }
  }

  console.log(`[fetchResourcesStats] result`, result.length);

  return result;
};

module.exports = fetchResourcesStats;
