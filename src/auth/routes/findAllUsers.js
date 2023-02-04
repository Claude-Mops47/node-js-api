const { User } = require("../../db/sequelize");

module.exports = (app) => {
  app.get("/api/users", (req, res) => {
    User.findAll()
      .then((users) => {
        if (!users) {
          const message = "Aucun utilisateur trouvé";
          return res.status(404).json({ message });
        }
        const message = "La liste des utilisateurs a été bien récupérée";
        return res.json({ message, data: users });
      })
      .catch((err) => {
        const message =
          "Une erreur est survenue lors de la récupération des utilisateurs";
        return res.status(500).json({ message, data: err });
      });
  });
};
