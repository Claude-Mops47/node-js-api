const db = require("../models");
const bcrypt = require("bcrypt");
const User = db.user;
const Pokemon = db.pokemon;
const pokemons = require("../models/mock-pokemon");

exports.initDB = async () => {
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
};
