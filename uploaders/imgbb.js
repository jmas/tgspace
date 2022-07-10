const FormData = require('form-data');
const axios = require('axios');
const fs = require('fs');
const path = require("path");
const { getFileExtension } = require('../utils/basic');

const upload = async (filePath) => {
  const url = `https://imgbb.com/json`;
  
  const formData = new FormData();

  formData.append("action", "upload");
  formData.append("expiration", "6M");
  formData.append("type", "file");

  formData.append('source', fs.createReadStream(filePath), `${new Date().getTime()}.${getFileExtension(path.basename(filePath))}`);

  const requestOptions = {
    headers: {
      referrer: 'https://imgbb.com/',
      ...formData.getHeaders()
    }
  };

  const result = await axios.post(url, formData, requestOptions);

  if (!result.data.image.display_url) {
    throw new Error(`Can't upload file.`);
  }
  
  return result.data.image.display_url;
};

module.exports = { upload };
