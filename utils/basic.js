const fs = require("fs");
const os = require("os");
const path = require("path");
const axios = require("axios");
const rateLimit = require("axios-rate-limit");

const download = async (url) => {
  const _path = path.resolve(
    os.tmpdir(),
    `${new Date().getTime()}_${Math.ceil(Math.random() * 1000)}.jpg`
  );
  const writer = fs.createWriteStream(_path);

  const response = await axios({
    url,
    method: "GET",
    responseType: "stream",
  });

  response.data.pipe(writer);

  return new Promise((resolve, reject) => {
    writer.on("finish", () => resolve(_path));
    writer.on("error", reject);
  });
};

const getRandomInt = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getFileExtension = (filename) => {
  var ext = /^.+\.([^.]+)$/.exec(filename);
  return ext == null ? "" : ext[1];
};

function shuffleArray(array) {
  return array.sort(() => 0.5 - Math.random());
}

const isDaysAreEqual = (date1, date2) => {
  return (
    new Date(date1).toISOString().split("T")[0] ===
    new Date(date2).toISOString().split("T")[0]
  );
};

const getDaysBetween = (date1, date2) => {
  const difference = new Date(date1).getTime() - new Date(date2).getTime();
  return Math.ceil(difference / (1000 * 3600 * 24));
};

const fetchContent = async (url, headers = {}, maxRPS = 2) => {
  const http = rateLimit(axios.create(), {
    maxRPS,
  });

  const response = await http.get(url, {
    headers,
  });

  if (response.status === 200) {
    return response.data;
  }

  return undefined;
};

const splitArrayToChunks = (inputArray, perChunk) => {
  return inputArray.reduce((resultArray, item, index) => {
    const chunkIndex = Math.floor(index / perChunk);

    if (!resultArray[chunkIndex]) {
      resultArray[chunkIndex] = []; // start a new chunk
    }

    resultArray[chunkIndex].push(item);

    return resultArray;
  }, []);
};

module.exports = {
  splitArrayToChunks,
  shuffleArray,
  getRandomInt,
  getFileExtension,
  isDaysAreEqual,
  getDaysBetween,
  fetchContent,
  download,
};
