const { User } = require("../../db/sequelize");

module.exports = (app) => {
  app.delete("/api/users/:id", (req, res) => {
    User.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then((deleted) => {
        if (!deleted) {
          const message = "Utilisateur non trouvé";
          return res.status(404).json({ message });
        }
        const message = "Utilisateur supprimé avec succès";
        return res.json({ message });
      })
      .catch((err) => {
        const message =
          "Une erreur est survenue lors de la suppression de l'utilisateur";
        return res.status(500).json({
          message,
          data: err,
        });
      });
  });
};
