const { User } = require("../db/sequelize");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const privateKey = require("../auth/private_key");

module.exports = (app) => {
  app.post("/api/login", async (req, res) => {
    try {
      // find user
      const user = await User.findOne({
        where: { username: req.body.username },
      });
      if (!user) {
        return res
          .status(401)
          .json({ message: "L'utilisateur demandé n'existe pas." });
      }
      const isPasswordValid = await bcrypt.compare(
        req.body.password,
        user.password
      );
      if (!isPasswordValid) {
        return res
          .status(401)
          .json({ message: "Le mot de passe est incorrect." });
      }
      if (user.userType === "user") {
        return res.status(401).json({
          message: "Les simples utilisateurs ne peuvent pas se connecter ici.",
        });
      }

      const token = jwt.sign({ userId: user.id }, privateKey, {
        expiresIn: "3600s",
      });
      return res
        .cookie("authToken", token, { httpOnly: true })
        .status(200)
        .json({
          message: "L'utilisateur a été connecté avec succès",
          data: user,
          token,
        });
    } catch (error) {
      return res.json({
        message:
          "L'utilisateur n'a pas pu être connecté. Réessayez dans un instants.",
        data: error,
      });
    }
  });
};

// module.exports = (app) => {
//   app.post("/api/login", (req, res) => {
//     User.findOne({ where: { username: req.body.username } })
//       .then((user) => {
//         if (!user) {
//           const message = "L'utilisateur demandé n'existe pas.";
//           return res.status(404).json({ message });
//         }

//         bcrypt
//           .compare(req.body.password, user.password)
//           .then((isPasswordValid) => {
//             if (!isPasswordValid) {
//               const message = "Le mot de passe est incorrect.";
//               return res.status(401).json({ message });
//             }

//             // JWT
//             const token = jwt.sign({ userId: user.id }, privateKey, {
//               expiresIn: "12h",
//             });

//             const message = "L'utilisateur a été connecté avec succès";
//             return res.json({ message, data: user, token });
//           });
//       })
//       .catch((error) => {
//         const message =
//           "L'utilisateur n'a pas pu être connecté. Réessayez dans un instants.";
//         return res.json({ message, data: error });
//       });
//   });
// };
