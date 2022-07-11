const { splitArrayToChunks } = require("./basic");
const child_process = require("child_process");

const SYSTEM_CPU_NUM = require("os").cpus().length;

const runProcesses = async (path, items, childsNum = SYSTEM_CPU_NUM) => {
  let done = 0;

  const _childsNum = Math.min(childsNum, SYSTEM_CPU_NUM);

  const chunks = splitArrayToChunks(
    items,
    Math.ceil(items.length / _childsNum)
  );

  const result = [];

  return new Promise((resolve) => {
    for (let i = 0; i < _childsNum; i++) {
      const child = child_process.fork(path);

      console.log(`[parent] send to child ${i}`);

      child.send(chunks[i] || []);

      child.on("message", async (message) => {
        console.log("[parent] received message from child:", message.length);

        result.push(message);

        child.kill();
      });

      child.on("close", async () => {
        done++;

        if (done === _childsNum) {
          console.log("[parent] received all results");

          resolve(result.reduce((result, chunk) => [...result, ...chunk], []));
        }
      });
    }
  });
};

const createProcess = (fn) => {
  process.on("message", async (message) => {
    console.log("[child] received message from parent:", message.length);

    try {
      const result = await fn(message);
      console.log("[child] send result to parent", result.length);

      process.send(result || []);
    } catch (error) {
      console.log("[child] error");
    }
  });
};

module.exports = { runProcesses, createProcess };
