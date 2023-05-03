const express = require("express");
const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const cors = require("cors");
const morgan = require("morgan");
const helmet = require("helmet");

// Sever
const app = express();

const corsOptions = {
  origin: "http://localhost:3001",
};
// Middleware
app
  .use(favicon(__dirname + "/egg.ico"))
  .use(morgan("dev"))
  .use(cors(corsOptions))
  .use(bodyParser.json())
  .use(helmet())
  .use(express.urlencoded({ extended: true }));

const db = require("./src/models");
const initial = require("./src/models/initial.model");

db.sequelize
  .sync({ force: true })
  .then(() => {
    initial.initDB();
    console.log("La base de donnée a bien été initialisée!");
  })
  .catch((err) => {
    console.log("La base de donnée n'a pas été initialisée!" + err.message);
  });

app.get("/", (req, res) => {
  res.json("Hello, POKEDEX APP  !");
});

// Ici, nous placerons nos futurs points de terminaisons
require("./src/routes/auth.routes")(app);
require("./src/routes/user.routes")(app);
require("./src/routes/pokemon.routes")(app);
//
// Handle 404 error
app.use(({ res }) => {
  const message =
    "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.";
  res.status(404).json({ message });
});
// lister
const portNumber = process.env.PORT || 3001;
app.listen(portNumber, () =>
  console.log(`Serveur en cours d'exécution sur le port: ${portNumber}.`)
);
