const express = require("express");
const cors = require("cors");
const { search } = require("./search.controller");

const app = express();

var corsOptions = {
  origin: `http://localhost:${process.env.NODE_LOCAL_PORT ?? 8000}`
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.get("/search", search);

const PORT = process.env.NODE_LOCAL_PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});