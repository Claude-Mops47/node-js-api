const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../db/sequelize");
const privateKey = require("../auth/private_key");

module.exports = (app) => {
  app.post("/api/register", async (req, res) => {
    try {
      // Vérifier si les informations d'inscription sont valides
      if (!req.body.username || !req.body.password) {
        return res.status(400).json({
          message: "Veuillez saisir un identifiant et un mot de passe valides",
        });
      }
      // Vérifie si le nom d'utilisateur existe déjà
      const existingUser = await User.findOne({
        where: { username: req.body.username },
      });
      if (existingUser) {
        return res.status(400).json({ message: "Cet identifiant existe déjà" });
      }

      // Génère un sel pour le hachage
      const salt = await bcrypt.genSalt(10);

      // Hachage du mot de passe
      const hash = await bcrypt.hash(req.body.password, salt);

      // Enregistre l'utilisateur dans la base de données
      const user = await User.create({
        username: req.body.username,
        password: hash,
      });

      // Génère un jeton d'authentification pour l'utilisateur
      const token = jwt.sign({ id: user.id }, privateKey, { expiresIn: "1h" });

      // Renvoie une réponse avec le statut de réussite et le jeton d'authentification
      return res.status(201).json({
        message: "inscription réussi!",
        token,
        user: {
          id: user.id,
          username: user.username,
        },
      });
    } catch (err) {
      return res.status(500).json({
        message: "Une erreur s'est produite lors de l'inscription",
      });
    }
  });
};
