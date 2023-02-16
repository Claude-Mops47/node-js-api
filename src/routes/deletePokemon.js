const { Pokemon } = require("../db/sequelize");
const auth = require("../auth/auth");

module.exports = (app) => {
  app.delete("/api/pokemons/:id", auth, (req, res) => {
    Pokemon.findByPk(req.params.id)
      .then((pokemon) => {
        if (pokemon === null) {
          return res
            .status(404)
            .json({
              message:
                "Le pokemon demandé n'existe pas. Réessayez avec un autre identifiant",
            });
        }
        const pokemonDelete = pokemon;
        return Pokemon.destroy({
          where: { id: pokemon.id },
        }).then((_) => {
          const message = `Le pokemon avec l'identifiant nº ${pokemonDelete.id} a bien été supprimé.`;
          res.json({ message, data: pokemonDelete });
        });
      })
      .catch((error) => {
        const message =
          "Le pokemon n'a pas pu supprimé. Réessayez dans un instants.";
        res.status(500).json({ message, data: error });
      });
  });
};

// Delete Data par la method Destroy
