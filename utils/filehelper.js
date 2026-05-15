const fs = require("fs");
const path = require("path");

const filePath = path.join(__dirname, "..", "recipes.json");

function readRecipes(callback) {
  fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      return callback(err, null);
    }

    try {
      const parsedData = JSON.parse(data);
      callback(null, parsedData);
    } catch (parseError) {
      callback(parseError, null);
    }
  });
}

function writeRecipes(data, callback) {
  const jsonData = JSON.stringify(data, null, 2);

  fs.writeFile(filePath, jsonData, "utf8", (err) => {
    if (err) {
      return callback(err);
    }

    callback(null);
  });
}

module.exports = {
  readRecipes,
  writeRecipes,
};
