const { fetchInfo, ErrorNotFound } = require("../utils/telegram");

const fetchResourcesInfo = async (resources) => {
  console.log(
    `[fetchResourcesInfo]:`,
    resources.map(({ id, username }) => `${id} - ${username}`).join(", ")
  );

  const result = [];

  for (let { id, username, status } of resources) {
    try {
      const stats = await fetchInfo(username);
      const { name, description, birthdate, type } = stats;

      console.log(`[fetchResourcesInfo] pushed (${username}) ${status} > set`);

      result.push({
        id,
        name,
        description,
        birthdate,
        type,
        status: "set",
        info_updated_at: "now()",
      });
    } catch (error) {
      result.push({ id, info_updated_at: "now()" });

      if (error instanceof ErrorNotFound) {
        console.log(
          `[fetchResourcesInfo] error (${username}) ${status} > not_found`,
          error
        );
      } else {
        console.log(
          `[fetchResourcesInfo] error (${username}) ${status}`,
          error
        );
      }
    }
  }

  console.log(`[fetchResourcesInfo] result`, result.length);

  return result;
};

module.exports = fetchResourcesInfo;
