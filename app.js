const express = require("express");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const sequelize = require("./src/db/sequelize");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");
// morgan est un middleware qui répertorie les trafic
// Sever
const app = express();
const portNumber = process.env.PORT || 3001;

// Middleware
app
  .use(favicon(__dirname + "/egg.ico"))
  .use(morgan("dev"))
  .use(cors())
  .use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "font-src": ["'self'", "external-website.com"],
      "style-src": null,
    },
  }),

  helmet.hsts({
    // 60 days
    maxAge: 86400,
    includeSubDomains: false,
  })
);

sequelize.initDb();

app.get("/", (req, res) => {
  res.json("Hello, connexion réussi  !");
});

// Ici, nous placerons nos futurs points de terminaison.
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

// Handle 404 error
app.use(({ res }) => {
  const message =
    "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.";
  res.status(404).json({ message });
});

app.listen(portNumber, () =>
  console.log(
    `Serveur en cours d'exécution sur le port: http://localhost:${portNumber}`
  )
);
