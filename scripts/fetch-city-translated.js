const fs = require("fs");
const axios = require("axios");

const main = async () => {
  const cityList = fs
    .readFileSync("../data/city-by-population/ua-ru.csv", "utf-8")
    .split("\n")
    .filter(Boolean);

  const result = [];

  for (let city of cityList) {
    const { data: resultList } = await axios.get(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
        city
      )}&place=city;town&namedetails=1&accept-language=uk&country=ua&format=json`
    );

    const name = resultList.at(0)?.namedetails["name:uk"];

    result.push([city, /[а-я]/i.test(name) ? name : ""]);
  }

  fs.writeFileSync(
    "../data/city-by-population/ua-ru-uk.csv",
    result.map((item) => item.join("\t")).join("\n")
  );
};

main();
