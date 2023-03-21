module.exports = (app) => {
  const auth = require("../config/auth.config");
  const pokemon = require("../controllers/pokemon.controller");

  var router = require("express").Router();

  router
    .post("/", auth, pokemon.create) // Create a new pokemon
    .get("/", auth, pokemon.findAll) // Retrieve all pokemon
    .get("/:id", auth, pokemon.findByPk) // Retrieve a single pokemon with id
    .put("/:id", auth, pokemon.update) // Update a pokemon with id
    .delete("/:id", auth, pokemon.delete); // Delete a pokemon with id

  app.use("/api/pokemons", router);
};
