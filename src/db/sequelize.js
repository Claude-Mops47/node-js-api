const { Sequelize, DataTypes } = require("sequelize");
const PokemonModel = require("../models/pokemon");
const UserModel = require("../models/user");
const pokemons = require("./mock-pokemon");
const bcrypt = require("bcrypt");

let sequelize;

const logging = process.env.NODE_ENV === "production" ? false : true;

sequelize = new Sequelize("pokedex", "root", "Secret Key", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
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
