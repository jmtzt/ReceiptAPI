const mongoose = require("mongoose");

const mongouri =
  "mongodb+srv://" +
  process.env.DB_USER +
  ":" +
  process.env.DB_PASS +
  "@" +
  process.env.DB_HOST +
  "Authentication?retryWrites=true&w=majority";

mongoose.connect(mongouri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

module.exports = mongoose;
