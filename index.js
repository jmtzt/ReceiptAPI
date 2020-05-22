require("dotenv").config();
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
//var beneficiarios = require("./routes/ben.js");
//var empresas = require("./routes/emp.js");
//var comprovantes = require("./routes/compr.js");

const app = express();

app.use(cors());
app.use(fileUpload());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

require("./lib/authController")(app);
require("./routes/ben")(app);
require("./routes/emp")(app);
require("./routes/compr")(app);

app.listen(3001);
