const fs = require("fs");
const path = require("path");

const runCommandFromPath = async (_path, name) => {
  const files = fs.readdirSync(_path);

  const names = files.map((file) => file.replace(".js", ""));

  if (!names.includes(name)) {
    throw new Error(`Command ${name} is not found.`);
  }

  const target = require(path.resolve(`${_path}/${name}.js`));

  if (target) {
    console.log(`[runCommand] Start command: ${name}`);
    console.log(`[runCommand] Command result: `, await target());
    console.log(`[runCommand] End command: ${name}`);
  }
};

module.exports = { runCommandFromPath };
