const { User } = require("../../db/sequelize");

const bcrypt = require("bcrypt");

module.exports = (app) => {
  app.patch("/api/users/:id", async (req, res) => {
    try {
      const user = await User.findByPk(req.params.id);
      if (!user) {
        return res.status(404).json({ message: "Utilisateur non trouvé" });
      }
      const passwordIsValid = await bcrypt.compare(
        req.body.oldPassword,
        user.password
      );
      if (!passwordIsValid) {
        return res.status(401).json({
          message: "L'ancien mot de passe n'est pas correct",
        });
      }
      if (req.body.password) {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;
      }
      const updatedUser = await user.update(req.body);
      return res.json(updatedUser);
    } catch (err) {
      return res.status(500).json({
        message:
          "Une erreur est survenue lors de la mise à jour de l'utilisateur",
      });
    }
  });
};
