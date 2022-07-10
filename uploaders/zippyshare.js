const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
const path = require("path");
const { getRandomInt, getFileExtension } = require('../utils/basic');

const upload = async (filePath) => {
  const serverId = `www${getRandomInt(11, 99)}`;

  const baseUrl = `https://${serverId}.zippyshare.com`;
  const url = `${baseUrl}/upload`;
  
  const formData = new FormData();

  formData.append("private", "true");

  formData.append('file', fs.createReadStream(filePath), `${new Date().getTime()}.${getFileExtension(path.basename(filePath))}`);

  const requestOptions = {
    headers: {
      ...formData.getHeaders()
    }
  };

  const result = await axios.post(url, formData, requestOptions);

  const matches = Array.from(result.data.matchAll(/\[url=.+?\]\[img=(.+?scaled.+?)\]\[\/img\]\[\/url\]/gm));

  if (matches.length === 0) {
    throw new Error(`Can't upload file.`);
  }

  const [[, imageUrl]] = matches;
  
  return `https:${imageUrl}`;
};

module.exports = { upload };
