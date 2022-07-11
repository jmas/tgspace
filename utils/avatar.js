const getAvatarLettersFromName = (name) => {
  const _name = name
    .toUpperCase()
    .split(/[^a-zа-яіїєґ]/i)
    .filter((chunk) => chunk.length > 2);

  if (_name.length === 1) {
    return chunk[0].split("").slice(0, 2).join("");
  }

  return _name
    .map((chunk) => chunk[0])
    .slice(0, 2)
    .join("");
};

module.exports = { getAvatarLettersFromName };
