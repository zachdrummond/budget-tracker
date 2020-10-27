// DEPENDENCIES
const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");

const PORT = process.env.PORT || 3000;

const app = express();

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});

// MIDDLEWARE

app.use(logger("dev"));
app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

// ROUTES
app.use(require("./routes/api.js"));

// DATABASE CONNECTION
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/budget",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  }
);

// EVENT LISTENERS FOR DATABASE CONNECTION
mongoose.connection.on("connected", () => {
  console.log("Mongoose successfully connected.");
});

mongoose.connection.on("error", (error) => {
  console.log("Mongoose connection error " + error);
});
