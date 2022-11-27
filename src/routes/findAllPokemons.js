const { Pokemon } = require("../db/sequelize");
const { Op } = require("sequelize");

module.exports = (app) => {
  app.get("/api/pokemons", (req, res) => {
    // recherche par name :
    if (req.query.name) {
      const name = req.query.name;
      return Pokemon.findAndCountAll({
        where: {
          name: {
            // 'name' est la propriété du modèle pokémon
            [Op.like]: `%${name}%`, // 'name' est le critère de la recherche
          },
        },
        // la limite de la recherche
        limit: 5,
      }).then(({ count, rows }) => {
        const message = `Il y a ${count} pokemons qui correspondent au terme de recherche ${name}`;
        res.json({ message, data: rows });
      });
    } else {
      // recupéré tout les pokemons dans la base de données
      Pokemon.findAll()
        .then((pokemons) => {
          const message = "La liste des pokémons a bien été récupérée.";
          res.json({ message, data: pokemons });
        })
        // Gestion des erreurs avant d'envoyer la requête à la base de données.
        .catch((error) => {
          const message = `La liste des pokemons n'a pas pu être récupérée. Réessayez dans quelques instants.`;
          res.status(500).json({ message, data: error });
        });
    }
  });
};

// Get All Data
