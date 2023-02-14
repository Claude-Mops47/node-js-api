const validTypes = ["admin", "user"];

module.exports = (Sequelize, DataTypes) => {
  return Sequelize.define("User", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: {
        msg: "Le nom est déjà pris.",
      },
    },
    password: {
      type: DataTypes.STRING,
    },
    userType: {
      type: DataTypes.ENUM,
      values: ["admin", "user"],
      defaultValue: "user",
      validate: {
        isTypeValid(value) {
          if (!value) {
            throw new Error("Un utilisateur doit au moins avoir un type.");
          }
          value.split(",").forEach((type) => {
            if (!validTypes.includes(type)) {
              throw new Error(
                `Le type d'un utilisateur doit appartenir à la liste suivante : ${validTypes}`
              );
            }
          });
        },
      },
    },
  });
};
