const runCommand = async (commands, commandName) => {
  const commandTarget = commands[commandName];

  if (commandTarget) {
    console.log(`[runCommand] Start command: ${commandName}`);
    console.log(`[runCommand] Command result: `, await commandTarget());
    console.log(`[runCommand] End command: ${commandName}`);
  } else {
    console.log(`[runCommand] Command is not found: ${commandName}`);
  }
};

module.exports = { runCommand };
