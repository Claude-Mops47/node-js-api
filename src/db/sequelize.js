const { Sequelize, DataTypes } = require("sequelize");
const PokemonModel = require("../models/pokemon");
const UserModel = require("../models/user");
const pokemons = require("./mock-pokemon");
const bcrypt = require("bcrypt");

let sequelize;

if (process.env.NODE_ENV === "production") {
  sequelize = new Sequelize("pokedex", "root", "Secret Key", {
    host: "localhost",
    dialect: "mysql",
    // dialectOptions: { timezone: "Etc/GMT-2" },
    logging: true,
  });
} else {
  sequelize = new Sequelize("pokedex", "root", "Secret Key", {
    host: "localhost",
    dialect: "mysql",
    // dialectOptions: { timezone: "Etc/GMT-2" },
    logging: false,
  });
}

const Pokemon = PokemonModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);

const initDb = () => {
  return sequelize.sync({ force: true }).then((_) => {
    pokemons.map((pokemon) => {
      Pokemon.create({
        name: pokemon.name,
        hp: pokemon.hp,
        cp: pokemon.cp,
        picture: pokemon.picture,
        types: pokemon.types,
      }).then((pokemon) => console.log(pokemon.toJSON()));
    });

    bcrypt
      .hash("winds", 10)
      .then((hash) => User.create({ username: "mopeno", password: hash }))
      .then((user) => console.log(user.toJSON()));

    console.log("La base de donnée a bien été initialisée !");
  });
};

// Exportation de module
module.exports = {
  initDb,
  Pokemon,
  User,
};
