const { User } = require("../db/sequelize");

module.exports = (app) => {
  app.put("/api/users/:id", (req, res) => {
    User.findByPk(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        user
          .update(req.body)
          .then((updatedUser) => {
            return res.json(updatedUser);
          })
          .catch((err) => {
            return res.status(500).json({
              message:
                "Une erreur est survenue lors de la mise à jour de l'utilisateur",
            });
          });
      })
      .catch((err) => {
        return res.status(500).json({
          message:
            "Une erreur est survenue lors de la récupération de l'utilisateur",
        });
      });
  });
};
