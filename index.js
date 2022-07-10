const { runCommand } = require("./utils/commands");

runCommand(
  {
    insertResource: require("./commands/insertResources"),
    updateResourcesInfo: require("./commands/updateResourcesInfo"),
    updateResourcesStats: require("./commands/updateResourcesStats"),
    updateResourcesAvatars: require("./commands/updateResourcesAvatars"),
  },
  process.env.CMD
);
