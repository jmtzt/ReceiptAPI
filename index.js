require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const comprovantes = require("./comprovantes");
const mongoose = require("mongoose");

const app = express();

app.use(cors());
app.use(fileUpload());

const mongouri =
  "mongodb+srv://" +
  process.env.DB_USER +
  ":" +
  process.env.DB_PASS +
  "@" +
  process.env.DB_HOST +
  "ReciboPadrao?retryWrites=true&w=majority";
mongoose.connect(mongouri, { useNewUrlParser: true, useUnifiedTopology: true });

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

app
  .route("/beneficiarios")
  .get(function (req, res) {
    Beneficiario.find(function (err, foundBeneficiario) {
      if (!err) {
        res.send(foundBeneficiario);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
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
  })
  .delete(function (req, res) {
    Beneficiario.deleteMany(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Deleted all beneficiarios sucessfully");
      }
    });
  });

app
  .route("/beneficiarios/:beneficiarioName")
  .get(function (req, res) {
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
  })
  .put(function (req, res) {
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
  })
  .patch(function (req, res) {
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
  })
  .delete(function (req, res) {
    Beneficiario.deleteOne({ Nome: req.params.beneficiarioName }, function (
      err
    ) {
      if (err) {
        res.send("Error deleting beneficiario.");
      } else {
        res.send("Sucessfully deleted beneficiario.");
      }
    });
  });

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

app
  .route("/empresas")
  .get(function (req, res) {
    Empresa.find(function (err, foundEmpresa) {
      if (!err) {
        res.send(foundEmpresa);
      } else {
        res.send(err);
      }
    });
  })
  .post(function (req, res) {
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
  })
  .delete(function (req, res) {
    Empresa.deleteMany(function (err) {
      if (err) {
        res.send(err);
      } else {
        res.send("Deleted all empresas sucessfully");
      }
    });
  });

app
  .route("/empresas/:empNome")
  .get(function (req, res) {
    Empresa.findOne({ NOME: req.params.empNome }, function (err, foundEmpresa) {
      if (foundEmpresa) {
        res.send(foundEmpresa);
      } else {
        res.send("No empresas matching that title was found.");
      }
    });
  })
  .put(function (req, res) {
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
  })
  .patch(function (req, res) {
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
  })
  .delete(function (req, res) {
    Empresa.deleteOne({ NOME: req.params.empNome }, function (err) {
      if (err) {
        res.send("Error deleting empresa.");
      } else {
        res.send("Sucessfully deleted empresa.");
      }
    });
  });

app.post("comprovantes/:comprType", (req, res) => {
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
