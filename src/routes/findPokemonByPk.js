const { Pokemon } = require("../db/sequelize");

module.exports = (app) => {
  app.get("/api/pokemons/:id", (req, res) => {
    Pokemon.findByPk(req.params.id)
      .then((pokemon) => {
        if (pokemon === null) {
          const message =
            "Le pokemon demandé n'existe pas. Réessayez avec un autre identifiant";
          return res.status(404).json({ message });
        }
        const message = "Un pokemon a bien été trouvé.";
        res.json({ message, data: pokemon });
      })
      // Gestion des erreurs avant d'envoyer la requête à la base de données.
      .catch((error) => {
        const message =
          "Le pokemon n'a pas pu être récupéré. Réessayez dans un instants.";
        res.status(500).json({ message, data: error });
      });
  });
};

// Get By Primary Key
