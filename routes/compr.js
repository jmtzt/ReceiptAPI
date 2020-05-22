var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const authMiddleware = require("../middlewares/auth");

const comprovantes = require("../lib/comprovantes");
const connection = require("../lib/init-mongoose.js");

router.use(authMiddleware);

router.post("/:comprType", (req, res) => {
  if (!req.files) {
    return res.status(500).send({ msg: "file not found" });
  }

  const file = req.files.file.data.toString("utf-8");
  const type = req.params.comprType;
  var compr;

  switch (type) {
    case "titulos":
      compr = comprovantes.titulosF(file);
      break;
    case "daems":
      compr = comprovantes.daemsF(file);
      break;
    case "ted":
      compr = comprovantes.tedF(file);
      break;
    case "tcb":
      compr = comprovantes.tcbF(file);
      break;
    case "telefone":
      compr = comprovantes.telF(file);
      break;
    case "fgts":
      compr = comprovantes.daesF(file);
      break;
    case "darf":
      compr = comprovantes.darfF(file);
      break;
    case "gps":
      compr = comprovantes.gpsF(file);
      break;
    case "bbpj":
      compr = comprovantes.bbpjF(file);
      break;
    case "chequeBradesco":
      compr = comprovantes.chequeBradescoF(req.files.file);
      break;
    default:
      compr = [];
      break;
  }

  res.send(compr);
  compr = [];
});
module.exports = (app) => app.use("/comprovantes", router);
