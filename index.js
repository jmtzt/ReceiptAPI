const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const comprovantes = require("./comprovantes");

const app = express();

app.use(cors());
app.use(fileUpload());

app.post("/:comprType", (req, res) => {
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

app.listen(3001);
