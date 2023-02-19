const { User } = require("../../db/sequelize");
const auth = require("../auth");

module.exports = (app) => {
  app.get("/api/users/:id", auth, (req, res) => {
    User.findByPk(req.params.id)
      .then((user) => {
        if (!user) {
          return res.status(404).json({ message: "Utilisateur non trouvé" });
        }
        return res
          .status(200)
          .json({ message: "Utilisateur trouvé", data: user });
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
