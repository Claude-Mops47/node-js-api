const jwt = require("jsonwebtoken");
const privateKey = require("../auth/private_key");

module.exports = (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader) {
    return res.status(401).json({
      message:
        "Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en dans l'en-tête de la requête.",
    });
  }

  try {
    const token = authorizationHeader.split(" ")[1];
    const decoderToken = jwt.verify(token, privateKey);
    const userId = decoderToken.userId;
    if (req.body.userId && req.body.userId !== userId) {
      return res
        .status(401)
        .json({ message: "L'identifiant de l'utilisateur est invalide." });
    }
  } catch (error) {
    return res.status(401).json({
      message: "L'utilisateur n'est pas autorisé à accèder à cette resource.",
      data: error,
    });
  }

  next();
};

// module.exports = (req, res, next) => {
//   const authorizationHeader = req.headers.authorization;

//   if (!authorizationHeader) {
//     const message =
//       "Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en dans l'en-tête de la requête.";
//     return res.status(401).json({ message });
//   }

//   const token = authorizationHeader.split(" ")[1];
//   const decoderToken = jwt.verify(token, privateKey, (error, decoderToken) => {
//     if (error) {
//       const message =
//         "L'utilisateur n'est pas autorisé à accèder à cette resource.";
//       return res.status(401).json({ message, data: error });
//     }

//     const userId = decoderToken.userId;
//     if (req.body.userId && req.body.userId !== userId) {
//       const message = "L'identifiant de l'utilisateur est invalide.";
//       res.status(401).json({ message });
//     } else {
//       next();
//     }
//   });
// };
