const fs = require("fs");
const { supabase } = require("../utils/supabase");

const insertResource = async () => {
  let count = 0;

  const files = fs.readdirSync("../usernames/");

  for (let file of files) {
    const content = require(`../usernames/${file}`);
    count = count + content.length;

    const [category, country] = file.replace(".json", "").split("-");

    const { data, error } = await supabase.from("resource").insert(
      content.map((username) => ({
        username,
        category,
        country,
        updated_at: "now()",
      }))
    );

    console.log("error", error);
  }
  console.log(count);
};

module.exports = insertResource;
