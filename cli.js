const { readRecipes, writeRecipes } = require("./utils/fileHelper");

const args = process.argv.slice(2);
const command = args[0];

function showHelp() {
  console.log(`
Food Recipe Logger CLI

Commandes disponibles:

node cli.js list
  Affiche toutes les recettes

node cli.js add "Egusi Soup" "Nigerian" 40
  Ajoute une nouvelle recette

node cli.js search "rice"
  Recherche une recette par nom

node cli.js delete 2
  Supprime une recette par id
`);
}

if (command === "list") {
  readRecipes((err, data) => {
    if (err) {
      console.error("Erreur de lecture:", err.message);
      return;
    }

    console.log("Liste des recettes:");
    data.recipes.forEach((recipe) => {
      console.log(
        `${recipe.id}. ${recipe.name} - ${recipe.cuisine} - ${recipe.prepTime} min`,
      );
    });
  });

  console.log(
    "Ce message s'affiche avant le contenu du fichier: fs.readFile est non-bloquant.",
  );
} else if (command === "add") {
  const name = args[1];
  const cuisine = args[2];
  const prepTime = Number(args[3]);

  if (!name || !cuisine || !prepTime) {
    console.log('Usage: node cli.js add "Egusi Soup" "Nigerian" 40');
    process.exit(1);
  }

  readRecipes((err, data) => {
    if (err) {
      console.error("Erreur de lecture:", err.message);
      return;
    }

    const newId =
      data.recipes.length > 0
        ? Math.max(...data.recipes.map((recipe) => recipe.id)) + 1
        : 1;

    const newRecipe = {
      id: newId,
      name,
      cuisine,
      prepTime,
      ingredients: [],
    };

    data.recipes.push(newRecipe);

    writeRecipes(data, (err) => {
      if (err) {
        console.error("Erreur d'écriture:", err.message);
        return;
      }

      console.log("Recette ajoutée avec succès:");
      console.log(newRecipe);
    });
  });
} else if (command === "search") {
  const searchTerm = args[1];

  if (!searchTerm) {
    console.log('Usage: node cli.js search "rice"');
    process.exit(1);
  }

  readRecipes((err, data) => {
    if (err) {
      console.error("Erreur de lecture:", err.message);
      return;
    }

    const results = data.recipes.filter((recipe) =>
      recipe.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    if (results.length === 0) {
      console.log("Aucune recette trouvée.");
      return;
    }

    console.log("Résultats de recherche:");
    results.forEach((recipe) => {
      console.log(
        `${recipe.id}. ${recipe.name} - ${recipe.cuisine} - ${recipe.prepTime} min`,
      );
    });
  });
} else if (command === "delete") {
  const id = Number(args[1]);

  if (!id) {
    console.log("Usage: node cli.js delete 2");
    process.exit(1);
  }

  readRecipes((err, data) => {
    if (err) {
      console.error("Erreur de lecture:", err.message);
      return;
    }

    const recipeExists = data.recipes.some((recipe) => recipe.id === id);

    if (!recipeExists) {
      console.log("Aucune recette trouvée avec cet id.");
      return;
    }

    data.recipes = data.recipes.filter((recipe) => recipe.id !== id);

    writeRecipes(data, (err) => {
      if (err) {
        console.error("Erreur d'écriture:", err.message);
        return;
      }

      console.log(`Recette avec l'id ${id} supprimée avec succès.`);
    });
  });
} else {
  showHelp();
}
