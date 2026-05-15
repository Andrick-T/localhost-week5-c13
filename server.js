require("dotenv").config();

const http = require("http");
const fs = require("fs");
const { URL } = require("url");
const { readRecipes } = require("./utils/fileHelper");

const PORT = process.env.PORT || 3000;

function sendJSON(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
  });

  res.end(JSON.stringify(data, null, 2));
}

function logRequest(req) {
  const logLine = `${new Date().toISOString()} - ${req.method} ${req.url}\n`;

  fs.appendFile("server.log", logLine, (err) => {
    if (err) {
      console.error("Erreur de log:", err.message);
    }
  });
}

const server = http.createServer((req, res) => {
  logRequest(req);

  const parsedUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = parsedUrl.pathname;
  const cuisineQuery = parsedUrl.searchParams.get("cuisine");

  if (req.method === "GET" && pathname === "/") {
    return sendJSON(res, 200, {
      message: "Bienvenue sur Food Recipe Logger API",
      routes: ["/recipes", "/recipes?cuisine=Cameroonian", "/recipes/1"],
    });
  }

  if (req.method === "GET" && pathname === "/recipes") {
    readRecipes((err, data) => {
      if (err) {
        return sendJSON(res, 500, {
          error: "Erreur lors de la lecture des recettes",
        });
      }

      let recipes = data.recipes;

      if (cuisineQuery) {
        recipes = recipes.filter(
          (recipe) =>
            recipe.cuisine.toLowerCase() === cuisineQuery.toLowerCase(),
        );
      }

      return sendJSON(res, 200, {
        count: recipes.length,
        recipes,
      });
    });

    console.log(
      "Ce message s'affiche avant la réponse fichier: fs.readFile est non-bloquant.",
    );
    return;
  }

  if (req.method === "GET" && pathname.startsWith("/recipes/")) {
    const id = Number(pathname.split("/")[2]);

    if (!id) {
      return sendJSON(res, 400, {
        error: "ID invalide",
      });
    }

    readRecipes((err, data) => {
      if (err) {
        return sendJSON(res, 500, {
          error: "Erreur lors de la lecture des recettes",
        });
      }

      const recipe = data.recipes.find((item) => item.id === id);

      if (!recipe) {
        return sendJSON(res, 404, {
          error: "Recette non trouvée",
        });
      }

      return sendJSON(res, 200, recipe);
    });

    return;
  }

  return sendJSON(res, 404, {
    error: "Route non trouvée",
  });
});

server.listen(PORT, () => {
  console.log(`Serveur lancé sur http://localhost:${PORT}`);
  console.log(`Environnement: ${process.env.NODE_ENV}`);
});
