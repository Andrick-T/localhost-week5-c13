1. Différence entre fs.readFile et fs.readFileSync

fs.readFile est asynchrone. Cela veut dire que Node.js lance la lecture du fichier, puis continue d’exécuter le reste du programme sans attendre.

fs.readFileSync est synchrone. Cela veut dire que Node.js bloque tout le programme jusqu’à ce que le fichier soit lu.

Dans un serveur, il faut utiliser fs.readFile parce qu’un serveur doit pouvoir gérer plusieurs requêtes en même temps. Si on utilise fs.readFileSync, une grosse lecture de fichier peut bloquer tous les autres utilisateurs.

2. C’est quoi module.exports ?

module.exports permet d’exporter des fonctions depuis un fichier pour les utiliser dans un autre fichier.

Exemple :

module.exports = {
readRecipes,
writeRecipes
};

Puis dans un autre fichier :

const { readRecipes } = require("./utils/fileHelper");

On crée des modules séparés pour organiser le code, éviter les répétitions et rendre le projet plus professionnel.

3. Pourquoi ne jamais commiter .env ?

Le fichier .env peut contenir des informations sensibles comme des mots de passe, des clés API, des accès à la base de données ou des tokens secrets.

Il ne faut jamais le mettre sur GitHub, car quelqu’un pourrait voler ces informations. C’est pour cela qu’on ajoute .env dans .gitignore.
