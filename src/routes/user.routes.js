module.exports = (app) => {
  const auth = require("../config/auth.config");
  const user = require("../controllers/user.controller");

  var router = require("express").Router();

  router
    .get("/", auth, user.findAll)
    .get("/:id", auth, user.findByPk)
    .patch("/:id", auth, user.patch)
    .delete("/:id", auth, user.delete);

  app.use("/api/users", router);
};
