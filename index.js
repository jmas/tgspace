const { runCommandFromPath } = require("./utils/commands");

runCommandFromPath("./commands", process.env.CMD);
