const { User } = require("../../db/sequelize");
const auth = require("../auth");

module.exports = (app) => {
  app.get("/api/users", auth, (req, res) => {
    User.findAll()
      .then((users) => {
        if (!users) {
          return res.status(404).json({ message: "Aucun utilisateur trouvé" });
        }
        return res.json({
          message: "La liste des utilisateurs a été bien récupérée",
          data: users,
        });
      })
      .catch((err) => {
        return res.status(500).json({
          message:
            "Une erreur est survenue lors de la récupération des utilisateurs",
          data: err,
        });
      });
  });
};
