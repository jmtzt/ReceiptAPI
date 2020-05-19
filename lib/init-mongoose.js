const mongoose = require("mongoose");
const mongouri =
  "mongodb+srv://" +
  process.env.DB_USER +
  ":" +
  process.env.DB_PASS +
  "@" +
  process.env.DB_HOST +
  "ReciboPadrao?retryWrites=true&w=majority";

const connection = mongoose.connect(mongouri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
module.exports = connection;
