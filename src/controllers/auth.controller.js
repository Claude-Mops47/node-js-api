const db = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config().parsed;
const User = db.user;

// Register User
exports.register = async (req, res) => {
  try {
    const { username, password } = req.body;
    const { type } = req.query;

    if (username && password) {
      const count = await User.count({ where: { username } });

      if (count > 0) {
        return res.status(400).json({ message: "Cet identifiant existe déjà" });
      }

      const salt = await bcrypt.genSalt(10);
      const hash = await bcrypt.hash(password, salt);

      const user = await User.create({
        username,
        userType: type,
        password: hash,
      });

      const token = jwt.sign({ id: user.id }, process.env.API_KEY, {
        expiresIn: "1h",
      });

      return res.status(201).json({
        message: "inscription réussi!",
        token,
        user: { id: user.id, username: user.username },
      });
    }

    return res.status(400).json({
      message: "Veuillez saisir un identifiant et un mot de passe valides",
    });
  } catch (err) {
    console.log(err);
    return res
      .status(500)
      .json({ message: "Une erreur s'est produite lors de l'inscription" });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ where: { username } });

    if (!user) {
      return res
        .status(401)
        .json({ message: "L'utilisateur demandé n'existe pas." });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

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

    const token = jwt.sign({ userId: user.id }, process.env.API_KEY, {
      expiresIn: "3600s",
    });

    return res.cookie("authToken", token, { httpOnly: true }).status(200).json({
      message: "L'utilisateur a été connecté avec succès",
      data: user,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message:
        "L'utilisateur n'a pas pu être connecté. Réessayez dans un instants.",
      data: error,
    });
  }
};
