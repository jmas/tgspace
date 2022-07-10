const { fetchStats, ErrorNotAllowed, ErrorNotFound } = require("./utils/tg");
const { getResourcesForUpdate, upsertResources } = require("./utils/supabase");

const updateResourcesStats = async () => {
  const updateLimit = parseInt(process.env.UPDATE_LIMIT || "1000", 10);

  const resources = await getResourcesForUpdate(updateLimit);

  console.log(resources.map(({ id, username }) => `${id} - ${username}`));

  const resourcesReadyForUpdate = [];
  const resourcesForStatusUpdate = [];

  for (let { id, username, status } of resources) {
    try {
      const stats = await fetchStats(username);
      const {
        avatar: _avatar,
        name,
        description,
        createdAt: birthdate,
        lifetime,
        subscribers,
        rank,
        type,
      } = stats;

      console.log(`pushed (${username}) ${status} > set`);

      resourcesReadyForUpdate.push({
        id,
        username,
        name,
        description,
        birthdate,
        lifetime,
        subscribers,
        rank,
        type,
        status: "set",
      });
    } catch (error) {
      if (error instanceof ErrorNotFound) {
        console.log(`error (${username}) ${status} > not_found`, error);

        resourcesForStatusUpdate.push({
          id,
          status: error instanceof ErrorNotAllowed ? status : "not_found",
        });
      } else {
        console.log(`error (${username}) ${status}`, error);
      }
    }
  }

  await upsertResources(resourcesReadyForUpdate);
  await upsertResources(resourcesForStatusUpdate);
};

module.exports = { updateResourcesStats };
