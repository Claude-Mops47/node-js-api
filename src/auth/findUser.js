const { User } = require("../db/sequelize");

module.exports = (app) => {
  app.get("/api/users/:id", (req, res) => {
    User.findByPk(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        return res.json(user);
      })
      .catch((err) => {
        return res.status(500).json({
          message:
            "Une erreur est survenue lors de la récupération de l'utilisateur",
        });
      });
  });
};
