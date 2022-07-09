const axios = require("axios");

// const input = `Бог любит тебя!;Чат 73 - Ульяновск / Ulyanovsk;Депрессия/Шизофрения чат;Новинки кино;Граница ДНР - РФ;Plaisir de la chaleur;Шизофрения чат;СВои;Моя Москва;MUSIC AUTO;Аниме и К-рор Приют!;Метро Гольяново;Хабаровск - общение города;ВЗАИМНЫЕ ПОДПИСКИ #ВП;MySpace`;
// const input = `Laurel Club;Христианский чат знакомства и общение верующих;Создание и Продвижение сайтов;Ювентус / Juventus;Ищу с кем выпить!;❄️ Чатик ❄️;WarFace|:tm:.Russia .i. 18+ |Все в сборе;AltTG;Любовь в Одинцово;Башкортостан;Pandao (sale);Знакомства! ХАРЬКОВ;CryptoOn;MotoBiker chat;Техническая поддержка ботов`;
// const input = `Пиар чат #1;Чат Хабаровска;Нужен кредит;ЖК Рождественский, Воронеж, Ямное;♥️ Чат - Знакомства для отношений | Дружбы | Общения ♥️;Chat Poker Stars;Нуль-конь / чатик;Пиар группа. Бесплатный пиар. Каталог Ботов;ПоДвАлИк😊;Чат Барнаула;Горящие туры Киев;Чат для любителей книг;Эйфория 18+;Dubai, Дубай, ОАЭ;ВПадике 18+`;
// const input = `Болталка чат;Technology Chat;PR без  рамок;Toyota Corolla Club;СтЕрЖеНь;Чат Традиции Великих Древних;Сообщество Компьютерщиков;Крипта;Маникюр;КУПИ И ПРОДАЙ;ОПТ Продукты питания;Flibusta Free Books 📚 - Книги;РАБОТА;Фото-чат;Строители Мастера Москва`;

const searchNominatim = async (q, options = { country: "ru", lang: "ru" }) => {
  const { lang, country } = options;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
    q
  )}&place=city;country&accept-language=${lang.toLowerCase()}&countrycodes=${country.toLowerCase()}&limit=1&format=json`;
  const response = await axios.get(url, {
    headers: {
      "accept-language": `${lang}`,
    },
  });

  if (response.data.length > 0) {
    return {
      name: response.data[0].display_name,
      lat: parseFloat(response.data[0].lat),
      lon: parseFloat(response.data[0].lon),
    };
  }

  throw new Error(`Can't find geo for query '${q}'.`);
};

const searchGeonames = async (q, options = { country: "ru" }) => {
  const { country } = options;
  const url = `http://www.geonames.org/advanced-search.html?q=${encodeURIComponent(
    q
  )}&country=${country.toUpperCase()}&featureClass=A&continentCode=EU`;
  const response = await axios.get(url);

  if (
    response.data.includes("no records found in geonames database") ||
    response.data.includes("We have found no places with the name")
  ) {
    throw new Error(`Can't find geo for query '${q}'.`);
  }

  const matches1 = response.data
    .replace(/\n/g, "")
    .match(/<small>1<\/small>(.+?)<\/tr>/gim);

  if (matches1) {
    const matchesName = matches1[0].match(/<td>\s?<a.+?>(.+?)<\/a>/);
    const matchesN = matches1[0].match(/N\s?(\d+)°\s?(\d+)'\s?(\d+)''/);
    const matchesE = matches1[0].match(/E\s?(\d+)°\s?(\d+)'\s?(\d+)''/);
    const name = matchesName ? matchesName[1] : null;
    const lat =
      parseInt(matchesN[1], 10) +
      parseInt(matchesN[2], 10) / 60 +
      parseInt(matchesN[3], 10) / 3600;
    const lon =
      parseInt(matchesE[1], 10) +
      parseInt(matchesE[2], 10) / 60 +
      parseInt(matchesE[3], 10) / 3600;

    return {
      name,
      lat,
      lon,
    };
  }

  throw new Error(`Can't find geo for query '${q}'.`);
};

const reverseLocation = async (lat, lon, options = { lang: "ru" }) => {
  const { lang } = options;

  const url = `https://nominatim.openstreetmap.org/reverse?lat=${encodeURIComponent(
    lat
  )}&lon=${encodeURIComponent(lon)}&zoom=10&format=json`;
  const response = await axios.get(url, {
    headers: {
      "accept-language": `${lang}`,
    },
  });

  return response.data;
};

const searchGeo = async (
  q,
  options = { lang: "ru", country: "ru" },
  searchers = [searchGeonames, searchNominatim]
) => {
  const { lang } = options;

  const regexps = {
    ru: /[^а-я\- ]/gi,
    en: /[^a-z\- ]/gi,
  };
  const chunks = q
    .toLowerCase()
    .replace(/\./g, " ")
    .split(" ")
    .map((chunk) => chunk.replace(regexps[lang], ""))
    .filter((name) => name.length >= 3);

  if (chunks.length === 0) {
    throw new Error(`Can't find geo for query '${q}'.`);
  }

  const errors = [];

  for (let search of searchers) {
    for (let chunk of chunks) {
      try {
        const { lat, lon } = await search(chunk, options);
        return await reverseLocation(lat, lon, options);
      } catch (error) {
        errors.push(error);
      }
    }
  }

  throw new AggregateError(errors);
};

module.exports = { searchGeo };

// (async () => {
//   const options = { lang: "ru", country: "ua" };

//   for (let name of input.split(";")) {
//     try {
//       const { lat, lon } = await searchGeo(name, options);
//       const location = await reverseLocation(lat, lon, options);
//       console.log(name, location);
//     } catch (error) {
//       console.log(name, error);
//     }
//   }
// })();
