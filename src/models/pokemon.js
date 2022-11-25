const validTypes = require("./listValidTypes");

module.exports = (sequelize, DataTypes) => {
  return sequelize.define(
    "Pokemon",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        // Verification name unique dans la base de données.
        unique: { msg: "Le nom est déjà pris." },
        // Validation avant d'envoyer la requête à la base de données.
        validate: {
          notEmpty: { msg: "Le nom ne peut pas être vide" },
          notNull: { msg: "Le nom est une propriété require." },
          max: { args: [25], msg: "maxi 25 caractères." },
        },
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // Validation avant d'envoyer la requête à la base de données.
        validate: {
          isInt: {
            msg: "Utilisez uniquement des entiers pour les points de vie.",
          },
          notNull: { msg: "Les points de vie sont une propriété require." },
          min: {
            args: [0],
            msg: "Les points de vie doivent être supérieurs ou égales à 0.",
          },
          max: {
            args: [999],
            msg: "Les points de vie doivent être inférieurs ou égales à 999.",
          },
        },
      },
      cp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        // Validation avant d'envoyer la requête à la base de données.
        validate: {
          isInt: {
            msg: "Utilisez uniquement des entiers pour les points de degâts.",
          },
          notNull: { msg: "Les points de degâts sont une propriété require." },
          min: {
            args: [0],
            msg: "Les points de degâts doivent être supérieurs ou égales à 0.",
          },
          max: {
            args: [99],
            msg: "Les points de degâts doivent être inférieurs ou égales à 99.",
          },
        },
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false,
        // Validation avant d'envoyer la requête à la base de données.
        validate: {
          isUrl: { msg: "Utilisez uniquement une URL valide pour l'image." },
          notNull: { msg: "L'image est propriété require." },
        },
      },
      types: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
          return this.getDataValue("types").split(",");
        },
        set(types) {
          this.setDataValue("types", types.join());
        },
        // Validation avant d'envoyer la requête à la base de données.
        validate: {
          isTypeValid(value) {
            if (!value) {
              throw new Error("Un pokémon doit au moins avoir un type.");
            }
            // Contrainte avant d'envoyer la requête à la base de données.
            if (value.split(",").length > 3) {
              throw new Error(
                "Un pokémon ne peux pas avoir plus de trois types."
              );
            }
            value.split(",").forEach((type) => {
              if (!validTypes.includes(type)) {
                throw new Error(
                  `Le type d'un pokémon doit appartenir à la liste suivante : ${validTypes}`
                );
              }
            });
          },
        },
      },
    },
    {
      timestamps: true,
      createdAt: "created",
      updatedAt: false,
    }
  );
};
