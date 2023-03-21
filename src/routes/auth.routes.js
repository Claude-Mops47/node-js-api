module.exports = (app) => {
  const auth = require("../controllers/auth.controller");

  var router = require("express").Router();

  router.post("/register", auth.register).post("/login", auth.login);

  app.use("/api/auth", router);
};
