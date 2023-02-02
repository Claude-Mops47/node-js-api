const { User } = require("../db/sequelize");

module.exports = (app) => {
  app.get("/api/users/:id", (req, res) => {
    User.findByPk(req.params.id)
      .then((user) => {
        if (!user) {
          const message = "Utilisateur non trouvé";
          return res.status(404).json({ message });
        }
        const message = "Utilisateur trouvé";
        return res.status(200).json({ message, data: user });
      })
      .catch((err) => {
        return res.status(500).json({
          message:
            "Une erreur est survenue lors de la récupération de l'utilisateur",
          err,
        });
      });
  });
};
