require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const mongoose = require("mongoose");
var beneficiarios = require("./routes/ben.js");
var empresas = require("./routes/emp.js");
var comprovantes = require("./routes/compr.js");

const app = express();

app.use(cors());
app.use(fileUpload());

app.use("/beneficiarios", beneficiarios);

app.use("/empresas", empresas);

app.use("/comprovantes", comprovantes);

app.listen(3001);
