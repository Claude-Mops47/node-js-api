module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define("User", {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    username: {
      type: Sequelize.STRING,
      required: true,
      unique: {
        message: "Le nom est déjà pris.",
      },
    },
    password: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    userType: {
      type: Sequelize.STRING(8),
      defaultValue: "user",
      allowNull: false,
      validate: {
        isIn: {
          args: [["admin", "user"]],
          message: "admin ou user",
        },
      },
    },
  });
  return User;
};
