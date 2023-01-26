const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { User } = require("../db/sequelize");
const privateKey = require("../auth/private_key");

module.exports = (app) => {
  app.post("/api/register", (req, res) => {
    // Vérifiez si les informations d'inscription sont valides
    if (!req.body.username || !req.body.password) {
      return res.status(400).json({
        message:
          "Veuillez entrer un nom d'utilisateur et un mot de passe valides",
      });
    }
    // Vérifiez si le nom d'utilisateur existe déjà
    User.findOne({ where: { username: req.body.username } }).then(
      (existingUser) => {
        if (existingUser) {
          return res
            .status(400)
            .json({ message: "Ce nom d'utilisateur existe déjà" });
        }
        // Générez un sel pour le hachage
        bcrypt.genSalt(10, (err, salt) => {
          if (err) {
            return res.status(500).json({
              message: "Une erreur est survenue lors de l'inscription 1",
            });
          }
          // Hash le mot de passe
          bcrypt.hash(req.body.password, salt, (err, hash) => {
            if (err) {
              return res.status(500).json({
                message: "Une erreur est survenue lors de l'inscription 2",
              });
            }
            // Enregistrez l'utilisateur dans la base de données
            User.create({
              username: req.body.username,
              password: hash,
            })
              .then((user) => {
                // Générez un jeton d'authentification pour l'utilisateur
                const token = jwt.sign(
                  { id: user.id },
                  privateKey,
                  //   process.env.JWT_SECRET,
                  {
                    expiresIn: "1h",
                  }
                );
                // Renvoyez une réponse avec un statut de succès et le jeton d'authentification
                return res.status(201).json({
                  message: "Inscription réussie",
                  token: token,
                  user: {
                    id: user.id,
                    username: user.username,
                  },
                });
              })
              .catch((err) => {
                return res.status(500).json({
                  message: "Une erreur est survenue lors de l'inscription 3",
                });
              });
          });
        });
      }
    );
  });
};
