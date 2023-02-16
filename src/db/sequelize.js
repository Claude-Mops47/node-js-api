const { Sequelize, DataTypes } = require("sequelize");
const PokemonModel = require("../models/pokemon");
const UserModel = require("../models/user");
const pokemons = require("./mock-pokemon");
const bcrypt = require("bcrypt");

require("dotenv").config();

let sequelize;

const logging = process.env.NODE_ENV === "production" ? false : true;
// console.log(logging);

sequelize = new Sequelize("pokedex", "root", "Secret Key", {
  host: "localhost",
  dialect: "mysql",
  logging: logging,
});

const Pokemon = PokemonModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);

const initDb = async () => {
  await sequelize.sync({ force: true });

  const createdPokemons = await Promise.all(
    pokemons.map((pokemon) => Pokemon.create({ ...pokemon }))
  );

  const pass = "winds";
  const hashedPassword = await bcrypt.hash(pass, 10);
  const createdUser = await User.create({
    username: "mopeno",
    userType: "admin",
    password: hashedPassword,
  });
  // console.log(createdPokemons);
  // console.log(createdUser);

  console.log("La base de donnée a bien été initialisée!");
};

// Exportation de module
module.exports = {
  initDb,
  Pokemon,
  User,
};
