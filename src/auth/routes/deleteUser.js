const { User } = require("../../db/sequelize");
const auth = require("../auth");

module.exports = (app) => {
  app.delete("/api/users/:id", auth, (req, res) => {
    User.destroy({
      where: {
        id: req.params.id,
      },
    })
      .then((deleted) => {
        if (!deleted) {
          return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        return res.json({ message: "Utilisateur supprimé avec succès" });
      })
      .catch((err) => {
        return res.status(500).json({
          message:
            "Une erreur est survenue lors de la suppression de l'utilisateur",
          data: err,
        });
      });
  });
};
