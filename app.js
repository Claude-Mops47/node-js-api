const express = require("express");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const sequelize = require("./src/db/sequelize");
const cors = require("cors");
const morgan = require("morgan");

//* Sever
const app = express();
const port = process.env.PORT || 3001;

//* Middleware
app
  .use(favicon(__dirname + "/favicon.ico"))
  .use(morgan("dev"))
  .use(bodyParser.json())
  .use(cors());

sequelize.initDb();

app.get("/", (req, res) => {
  res.json("Hello, connexion réussi  !");
});

// app.use("/user", registerRoutes);

//* Ici, nous placerons nos futurs points de terminaison.
require("./src/routes/findAllPokemons")(app);
require("./src/routes/findPokemonByPk")(app);
require("./src/routes/createPokemon")(app);
require("./src/routes/updatePokemon")(app);
require("./src/routes/deletePokemon")(app);

// Users
require("./src/auth/login")(app);
require("./src/auth/register")(app);
// Routes users!!
require("./src/auth/routes/findUser")(app);
require("./src/auth/routes/findAllUsers")(app);
require("./src/auth/routes/deleteUser")(app);
require("./src/auth/routes/updateUser")(app);

//* On declare la gestion des erreurs 404
app.use(({ res }) => {
  const message =
    "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.";
  res.status(404).json({ message });
});

app.listen(port, () =>
  console.log(
    `Notre application Node est démarrée sur : http://localhost:${port}`
  )
);
