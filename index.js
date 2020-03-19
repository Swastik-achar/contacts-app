const express = require("express");

const setUpDB = require("./config/database");

const router = require("./config/routes");

const app = express();
const port = 3075;

app.use(express.json());
app.use("/", router);

setUpDB();

app.listen(port, () => {
  console.log("listening to port ", port);
});
