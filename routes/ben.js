var express = require("express");
var router = express.Router();
var mongoose = require("mongoose");
const authMiddleware = require("../middlewares/auth");

router.use(authMiddleware);

const connection = require("../lib/init-mongoose.js");

const benSchema = {
  Codigo: {
    type: String,
    required: true,
  },
  Nome: {
    type: String,
    required: true,
  },
  CPF: {
    type: String,
    required: true,
  },
  RG: {
    type: String,
    required: false,
  },
  Endereço: {
    type: String,
    required: true,
  },
  Bairro: {
    type: String,
    required: true,
  },
  UF: {
    type: String,
    required: true,
  },
  Fone: {
    type: String,
    required: false,
  },
  INSS: {
    type: String,
    required: false,
  },
};

const Beneficiario = mongoose.model("beneficiario", benSchema);

router.get("/", function (req, res) {
  Beneficiario.find(function (err, foundBeneficiario) {
    if (!err) {
      res.send(foundBeneficiario);
    } else {
      res.send(err);
    }
  });
});
router.post("/", function (req, res) {
  const beneficiario = new Beneficiario({
    Nome: req.body.nome,
    CPF: req.body.cpf,
    RG: req.body.rg,
    Endereço: req.body.endereco,
    Bairro: req.body.bairro,
    UF: req.body.uf,
    Fone: req.body.fone,
    INSS: req.body.inss,
  });

  beneficiario.save(function (err) {
    if (err) {
      console.log(err);
    } else {
      res.send("Beneficiario added sucessfully!");
    }
  });
});
router.delete("/", function (req, res) {
  Beneficiario.deleteMany(function (err) {
    if (err) {
      res.send(err);
    } else {
      res.send("Deleted all beneficiarios sucessfully");
    }
  });
});

router.get("/:beneficiarioName", function (req, res) {
  Beneficiario.findOne({ Nome: req.params.beneficiarioName }, function (
    err,
    foundBeneficiario
  ) {
    if (foundBeneficiario) {
      res.send(foundBeneficiario);
    } else {
      res.send("No beneficiarios matching that title was found.");
    }
  });
});
router.put("/:beneficiarioName", function (req, res) {
  Beneficiario.updateOne(
    { Nome: req.params.beneficiarioName },
    {
      Codigo: req.body.codigo,
      Nome: req.body.nome,
      CPF: req.body.cpf,
      RG: req.body.rg,
      Endereço: req.body.endereco,
      Bairro: req.body.bairro,
      UF: req.body.uf,
      Fone: req.body.fone,
      INSS: req.body.inss,
    },
    { overwrite: true },
    function (err) {
      if (err) {
        res.send("Error updating beneficiario.");
      } else {
        res.send("Sucessfully updated beneficiario.");
      }
    }
  );
});
router.patch(":beneficiarioName", function (req, res) {
  Beneficiario.updateOne(
    { Nome: req.params.beneficiarioName },
    { $set: req.body },
    { overwrite: false },
    function (err) {
      if (err) {
        res.send("Error patching beneficiario.");
      } else {
        res.send("Sucessfully patched beneficiario.");
      }
    }
  );
});
router.delete(":beneficiarioName", function (req, res) {
  Beneficiario.deleteOne({ Nome: req.params.beneficiarioName }, function (err) {
    if (err) {
      res.send("Error deleting beneficiario.");
    } else {
      res.send("Sucessfully deleted beneficiario.");
    }
  });
});

module.exports = (app) => app.use("/beneficiarios", router);
