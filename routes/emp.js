var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware);

const connection = require("../lib/init-mongoose.js");

const empSchema = {
  SIGLA: { type: String, required: false },
  CODIGO: { type: String, required: true },
  NOME: { type: String, required: true },
  CNPJ: { type: String, required: true },
  ENDERECO: { type: String, required: true },
  BAIRO: { type: String, required: true },
  CEP: { type: String, required: true },
  MUNICIPIO: { type: String, required: true },
  UF: { type: String, required: true },
};

const Empresa = mongoose.model("empresa", empSchema);

router.get("/", function (req, res) {
  Empresa.find(function (err, foundEmpresa) {
    if (!err) {
      res.send(foundEmpresa);
    } else {
      res.send(err);
    }
  });
});

router.post("/", function (req, res) {
  const empresa = new Empresa({
    CODIGO: req.body.cod,
    NOME: req.body.nome,
    CNPJ: req.body.cnpj,
    ENDERECO: req.body.endereco,
    BAIRRO: req.body.bairro,
    UF: req.body.uf,
    MUNICIPIO: req.body.mun,
    CEP: req.body.cep,
  });

  empresa.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.send("Empresa added sucessfully!");
    }
  });
});
router.delete("/", function (req, res) {
  Empresa.deleteMany(function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send("Deleted all empresas sucessfully");
    }
  });
});

router.get("/:empNome", function (req, res) {
  Empresa.findOne({ NOME: req.params.empNome }, function (err, foundEmpresa) {
    if (foundEmpresa) {
      res.send(foundEmpresa);
    } else {
      res.send("No empresas matching that title was found.");
    }
  });
});
router.put("/:empNome", function (req, res) {
  Empresa.updateOne(
    { NOME: req.params.empNome },
    {
      CODIGO: req.body.cod,
      NOME: req.body.nome,
      CNPJ: req.body.cnpj,
      ENDERECO: req.body.endereco,
      BAIRRO: req.body.bairro,
      UF: req.body.uf,
      MUNICIPIO: req.body.mun,
      CEP: req.body.cep,
    },
    { overwrite: true },
    function (err) {
      if (err) {
        res.send("Error updating empresa.");
      } else {
        res.send("Sucessfully updated empresa.");
      }
    }
  );
});
router.patch("/:empNome", function (req, res) {
  Empresa.updateOne(
    { NOME: req.params.empNome },
    { $set: req.body },
    { overwrite: false },
    function (err) {
      if (err) {
        res.send("Error patching empresa.");
      } else {
        res.send("Sucessfully patched empresa.");
      }
    }
  );
});
router.delete("/:empNome", function (req, res) {
  Empresa.deleteOne({ NOME: req.params.empNome }, function (err) {
    if (err) {
      res.send("Error deleting empresa.");
    } else {
      res.send("Sucessfully deleted empresa.");
    }
  });
});

module.exports = (app) => app.use("/empresas", router);
