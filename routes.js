const favicon = require("serve-favicon");
const bodyParser = require("body-parser");
const sequelize = require("./src/db/sequelize");
const cors = require("cors");
const morgan = require("morgan");
const login = require("./src/auth/login");

module.exports = (app) => {
  //* Middleware
  app
    .use(favicon((__dirname, "favicon.ico")))
    .use(morgan("dev"))
    .use(bodyParser.json())
    .use(cors());

  sequelize.initDb();

  app.get("/", (req, res) => {
    res.json("Hello, connexion réussi !");
  });

  //   app.use("/pokemon", findAllPokemonsRoutes);
  //   app.use("/pokemon/:id", findPokemonByPkRoutes);
  //   app.use("/pokemon", createPokemonRoutes);
  //   app.use("/pokemon/:id", updatePokemonRoutes);
  //   app.use("/pokemon/:id", deletePokemonRoutes);

  //   // Users
  //   app.use("/auth/login", loginRoutes);
  //   app.use("/auth/register", registerRoutes);
  //   // Routes users!!
  //   app.use("/auth/users/:id", findUserRoutes);
  //   app.use("/auth/users", findAllUsersRoutes);
  //   app.use("/auth/users/:id", deleteUserRoutes);
  //   app.use("/auth/users/:id", updateUserRoutes);
  app.use("/api/login", login);

  //* On declare la gestion des erreurs 404
  app.use(({ res }) => {
    const message =
      "Impossible de trouver la ressource demandée ! Vous pouvez essayer une autre URL.";
    res.status(404).json({ message });
  });
};
