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
  logging,
});

// if (process.env.NODE_ENV === "production") {
//   sequelize = new Sequelize("pokedex", "root", "Secret Key", {
//     host: "localhost",
//     dialect: "mysql",
//     // dialectOptions: { timezone: "Etc/GMT-2" },
//     logging: true,
//   });
// } else {
//   sequelize = new Sequelize("pokedex", "root", "Secret Key", {
//     host: "localhost",
//     dialect: "mysql",
//     // dialectOptions: { timezone: "Etc/GMT-2" },
//     logging: false,
//   });
// }

const Pokemon = PokemonModel(sequelize, DataTypes);
const User = UserModel(sequelize, DataTypes);

const initDb = async () => {
  await sequelize.sync({ force: true });

  const pokemonsData = pokemons.map((pokemon) => ({
    name: pokemon.name,
    hp: pokemon.hp,
    cp: pokemon.cp,
    picture: pokemon.picture,
    types: pokemon.types,
  }));

  const createdPokemons = await Promise.all(
    pokemonsData.map((pokemonData) => Pokemon.create(pokemonData))
  );

  createdPokemons.forEach((pokemon) => console.log(pokemon.toJSON()));

  const pass = "winds";
  const hashedPassword = await bcrypt.hash(pass, 10);
  const createdUser = await User.create({
    username: "mopeno",
    password: hashedPassword,
  });
  console.log(createdUser.toJSON());

  console.log("The database was successfully initialized!");
};

// const initDb = () => {
//   return sequelize.sync({ force: true }).then((_) => {
//     pokemons.map((pokemon) => {
//       Pokemon.create({
//         name: pokemon.name,
//         hp: pokemon.hp,
//         cp: pokemon.cp,
//         picture: pokemon.picture,
//         types: pokemon.types,
//       }).then((pokemon) => console.log(pokemon.toJSON()));
//     });
//     // modifier pass
//     pass = "winds";
//     bcrypt
//       .hash(pass, 10)
//       .then((hash) => User.create({ username: "mopeno", password: hash }))
//       .then((user) => console.log(user.toJSON()));

//     console.log("La base de donnée a bien été initialisée !");
//   });
// };

// Exportation de module
module.exports = {
  initDb,
  Pokemon,
  User,
};
