const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");
require("dotenv").config();

// Routes controller function
const { handleImage, handleApiCall } = require("./controllers/image");
const handleLogin = require("./controllers/signin");
const handleProfile = require("./controllers/profile");
const handleRegister = require("./controllers/register");

const app = express();

// Initialize db
const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "Faisal",
    database: "FaceDetect"
  }
});

// Parse data passed from front end
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Allow cors to avoid cross origin error
app.use(cors());

// Handle routes
app.get("/", (req, res) => {
  res.send("this is working");
});
app.post("/signin", handleLogin(db, bcrypt));
app.post("/register", handleRegister(db, bcrypt));
app.get("/profile/:id", handleProfile(db));
app.put("/image", handleImage(db));
app.post("/imageUrl", handleApiCall);

// Get the port from env if not found then default to 5000
const PORT = process.env.PORT || 5000;

// Start the server and listen on give port
app.listen(PORT, () => {
  console.log(`Server started on ${PORT}`);
});
