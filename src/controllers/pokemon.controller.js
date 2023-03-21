// const { ValidationError, UniqueConstraintError, Op } = require("sequelize");
// const auth = require("../config/auth.config");
// const db = require("../models");
// const Pokemon = db.pokemon;
// // Create
// (exports.create = auth),
//   (req, res) => {
//     Pokemon.create(req.body)
//       .then((pokemon) => {
//         const message = `Le pokemon ${req.body.name} a bien été crée.`;
//         res.json({ message, data: pokemon });
//       })
//       //* Gestion des errors
//       .catch((error) => {
//         const message =
//           "Le pokemon n'a pas pu être ajouté. Réessayez dans un instants.";

//         if (error instanceof ValidationError) {
//           return res.status(400).json({ message: error.message, data: error });
//         }
//         if (error instanceof UniqueConstraintError) {
//           return res.status(400).json({ message: error.message, data: error });
//         }
//         res.status(500).json({ message, data: error });
//       });
//   };

// // Get all pokemon
// (exports.findAll = auth),
//   (req, res) => {
//     // recherche par name :
//     if (req.query.name) {
//       const name = req.query.name;
//       const limit = parseInt(req.query.limit) || 5;

//       if (name.length < 2) {
//         return res.status(400).json({
//           message: "Le terme de recherche doit contenir au moins 2 caractères.",
//         });
//       }
//       return Pokemon.findAndCountAll({
//         where: {
//           name: {
//             // 'name' est la propriété du modèle pokémon
//             [Op.like]: `%${name}%`, // 'name' est le critère de la recherche
//           },
//         },
//         // la limite de la recherche
//         limit: limit,
//         order: ["name"],
//       }).then(({ count, rows }) => {
//         const message = `Il y a ${count} pokemons qui correspondent au terme de recherche ${name}`;
//         res.json({ message, data: rows });
//       });
//     } else {
//       // recupéré tout les pokemons dans la base de données
//       Pokemon.findAll({ order: ["name"] })
//         .then((pokemons) => {
//           const message = "La liste des pokémons a bien été récupérée.";
//           res.json({ message, data: pokemons });
//         })
//         // Gestion des erreurs avant d'envoyer la requête à la base de données.
//         .catch((error) => {
//           const message = `La liste des pokemons n'a pas pu être récupérée. Réessayez dans quelques instants.`;
//           res.status(500).json({ message, data: error });
//         });
//     }
//   };

// // Get By Primary Key
// (exports.findByPk = auth),
//   (req, res) => {
//     Pokemon.findByPk(req.params.id)
//       .then((pokemon) => {
//         if (pokemon === null) {
//           return res.status(404).json({
//             message:
//               "Le pokemon demandé n'existe pas. Réessayez avec un autre identifiant",
//           });
//         }
//         const message = "Un pokemon a bien été trouvé.";
//         res.json({ message, data: pokemon });
//       })
//       // Gestion des erreurs avant d'envoyer la requête à la base de données.
//       .catch((error) => {
//         const message =
//           "Le pokemon n'a pas pu être récupéré. Réessayez dans un instants.";
//         res.status(500).json({ message, data: error });
//       });
//   };

// // Update Data
// (exports.update = auth),
//   (req, res) => {
//     const id = req.params.id;
//     Pokemon.update(req.body, {
//       where: { id: id },
//     })
//       .then((_) => {
//         return Pokemon.findByPk(id).then((pokemon) => {
//           if (pokemon === null) {
//             return res.status(404).json({
//               message:
//                 "Le pokemon demandé n'existe pas. Réessayez avec un autre identifiant",
//             });
//           }
//           const message = `Le pokemon ${pokemon.name} a bien été modifié.`;
//           res.json({ message, data: pokemon });
//         });
//       })
//       //* Gestion des errors !
//       .catch((error) => {
//         if (error instanceof ValidationError) {
//           return res.status(400).json({ message: error.message, data: error });
//         }
//         if (error instanceof UniqueConstraintError) {
//           return res.status(400).json({ message: error.message, data: error });
//         }
//         const message =
//           "Le pokemon n'a pas pu modifié. Réessayez dans un instants.";
//         res.status(500).json({ message, data: error });
//       });
//   };

// // Delete Data par la method Destroy
// (exports.delete = auth),
//   (req, res) => {
//     Pokemon.findByPk(req.params.id)
//       .then((pokemon) => {
//         if (pokemon === null) {
//           return res.status(404).json({
//             message:
//               "Le pokemon demandé n'existe pas. Réessayez avec un autre identifiant",
//           });
//         }
//         const pokemonDelete = pokemon;
//         return Pokemon.destroy({
//           where: { id: pokemon.id },
//         }).then((_) => {
//           const message = `Le pokemon avec l'identifiant nº ${pokemonDelete.id} a bien été supprimé.`;
//           res.json({ message, data: pokemonDelete });
//         });
//       })
//       .catch((error) => {
//         const message =
//           "Le pokemon n'a pas pu supprimé. Réessayez dans un instants.";
//         res.status(500).json({ message, data: error });
//       });
//   };

const { Op } = require("sequelize");
const db = require("../models");
const Pokemon = db.pokemon;

// Create
exports.create = (req, res) => {
  Pokemon.create(req.body)
    .then((pokemon) => {
      const message = `Le pokemon ${req.body.name} a bien été crée.`;
      res.json({ message, data: pokemon });
    })
    // Gestion des errors
    .catch(({ message }) => {
      res.status(400).json({ message });
    });
};

// Get all pokemon
exports.findAll = (req, res) => {
  // recherche par name :
  if (req.query.name) {
    const name = req.query.name;
    const limit = parseInt(req.query.limit) || 5;

    if (name.length < 2) {
      return res.status(400).json({
        message: "Le terme de recherche doit contenir au moins 2 caractères.",
      });
    }
    return Pokemon.findAndCountAll({
      where: {
        name: {
          [Op.like]: `%${name}%`,
        },
      },
      limit,
      order: ["name"],
    }).then(({ count, rows }) => {
      const message = `Il y a ${count} pokemons qui correspondent au terme de recherche ${name}`;
      res.json({ message, data: rows });
    });
  } else {
    Pokemon.findAll({ order: ["name"] })
      .then((pokemons) => {
        const message = "La liste des pokémons a bien été récupérée.";
        res.json({ message, data: pokemons });
      })
      .catch(({ message }) => {
        res.status(500).json({ message });
      });
  }
};

// Get By Primary Key
exports.findByPk = (req, res) => {
  Pokemon.findByPk(req.params.id)
    .then((pokemon) => {
      if (pokemon === null) {
        return res.status(404).json({
          message:
            "Le pokemon demandé n'existe pas. Réessayez avec un autre identifiant",
        });
      }
      const message = "Un pokemon a bien été trouvé.";
      res.json({ message, data: pokemon });
    })
    .catch(({ message }) => {
      res.status(500).json({ message });
    });
};

// Update Data
exports.update = (req, res) => {
  const id = req.params.id;
  Pokemon.update(req.body, {
    where: { id },
  })
    .then((_) => {
      return Pokemon.findByPk(id).then((pokemon) => {
        if (pokemon === null) {
          return res.status(404).json({
            message:
              "Le pokemon demandé n'existe pas. Réessayez avec un autre identifiant",
          });
        }
        const message = `Le pokemon ${pokemon.name} a bien été modifié.`;
        res.json({ message, data: pokemon });
      });
    })
    .catch(({ message }) => {
      res.status(400).json({ message });
    });
};

// Delete Data par la method Destroy
exports.delete = (req, res) => {
  Pokemon.findByPk(req.params.id)
    .then((pokemon) => {
      if (pokemon === null) {
        return res.status(404).json({
          message:
            "Le pokemon demandé n'existe pas. Réessayez avec un autre identifiant",
        });
      }
      const pokemonDelete = pokemon;
      return Pokemon.destroy({
        where: { id: pokemon.id },
      }).then(() => {
        const message = `Le pokemon avec l'identifiant nº ${pokemonDelete.id} a bien été supprimé.`;
        res.json({ message, data: pokemonDelete });
      });
    })
    .catch(({ message }) => {
      res.status(500).json({ message });
    });
};
