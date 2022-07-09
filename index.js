const { insertResources } = require("./insert-resources");
const { updateResourcesStats } = require("./update-resources-stats");
const { updateResourcesAvatars } = require("./update-resources-avatars");

const commands = {
  insertResources,
  updateResourcesStats,
  updateResourcesAvatars,
};

const cmd = process.env.CMD;
const commandToRun = commands[cmd];

(async () => {
  if (commandToRun) {
    console.log(`Start command: ${cmd}`);
    console.log(`Command result: `, await commandToRun());
    console.log(`End command: ${cmd}`);
  } else {
    console.log(`Command is not found: ${cmd}`);
  }
})();
