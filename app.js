const express = require("express");
const morgan = require("morgan");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const { Sequelize, DataTypes } = require("sequelize");
const { success, getUniqueId } = require("./helper");
let pokemons = require("./mock-pokemon");
const PokemonModel = require("./src/models/pokemon");

const app = express();
const port = 3000;

const sequelize = new Sequelize("pokedex", "root", "Secret Key", {
  host: "localhost",
  dialect: "mysql",
  //   dialectOptions: {
  //     timezone: "Etc/GMT-2",
  //   },
  logging: false,
});

sequelize
  .authenticate()
  .then((_) =>
    console.log("La connexion à la base de données a bien été établie.")
  )
  .catch((error) =>
    console.error(`Imposible de se connecter à la base de données ${error}`)
  );

const Pokemon = PokemonModel(sequelize, DataTypes);
sequelize.sync({ force: true }).then((_) => {
  console.log("La base de données 'Pokedex' a bien été synchronisée.");
  Pokemon.create({
    name: "Bulbizzare",
    hp: 25,
    cp: 5,
    picture:
      "https://assets.pokemon.com/assets/cms2/img/pokedex/detail/001.png",
    types: ["Plante", "Poison"].join(),
  }).then((bulbizzare) => console.log(bulbizzare.toJSON()));
});

//* Middleware
app
  .use(favicon(__dirname + "/favicon.ico"))
  .use(morgan("dev"))
  .use(bodyParser.json());

app.get("/", (req, res) => res.send("Hello, Express 2!"));

//* On retourne la liste des pokémons au format JSON, avec un message :
app.get("/api/pokemons", (req, res) => {
  const message = "La liste des pokemons à bien été récupéré.";
  res.json(success(message, pokemons));
});

app.get("/api/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pokemon = pokemons.find((pokemon) => pokemon.id === id);
  const message = "Un pokémon a bien été trouvé.";
  res.json(success(message, pokemon));
});

app.post("/api/pokemons", (req, res) => {
  const id = getUniqueId(pokemons);
  const pokemonCreated = { ...req.body, ...{ id: id, created: new Date() } };
  pokemons.push(pokemonCreated);
  const message = `Le pokemon ${pokemonCreated.name} a bien été crée.`;
  res.json(success(message, pokemonCreated));
});

//* Modifier
app.put("/api/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pokemonUpdated = { ...req.body, id: id };
  pokemons = pokemons.map((pokemon) => {
    return pokemon.id === id ? pokemonUpdated : pokemon;
  });
  const message = `Le pokemon ${pokemonUpdated.name} a bien été modifié`;
  res.json(success(message, pokemonUpdated));
});

//* Supprimer
app.delete("/api/pokemons/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const pokemonDeleted = pokemons.find((pokemon) => pokemon.id === id);
  pokemons = pokemons.filter((pokemon) => pokemon.id !== id);
  const message = `Le pokémon ${pokemonDeleted.name} a bien été supprimé.`;
  res.json(success(message, pokemonDeleted));
});

app.listen(port, () =>
  console.log(
    `Notre application Node est démarrée sur : http://localhost:${port}`
  )
);
