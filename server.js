const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const cors = require("cors");
const knex = require("knex");

const app = express();

const db = knex({
  client: "pg",
  connection: {
    host: "127.0.0.1",
    user: "postgres",
    password: "Faisal",
    database: "FaceDetect"
  }
});

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("this is working");
});

app.post("/signin", (req, res) => {
  const { email, password } = req.body;
  db.select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .then(data => {
      bcrypt.compare(password, data[0].hash, (err, result) => {
        if (err) return err;
        else if (!result) return res.json("Email or Password is invalid");
        return db
          .select("*")
          .from("users")
          .where("email", "=", email)
          .then(user => res.json(user[0]))
          .catch(err => res.status(400).json("Unable to get user"));
      });
    });
});

app.post("/register", (req, res) => {
  const { email, password, name } = req.body;
  bcrypt.hash(password, null, null, (err, hash) => {
    if (err) console.log(err);
    else {
      db.transaction(trx => {
        trx
          .insert({
            hash,
            email
          })
          .into("login")
          .returning("email")
          .then(loginEmail => {
            return trx("users")
              .returning("*")
              .insert({
                email: loginEmail[0],
                name,
                joined: new Date()
              })
              .then(user => {
                res.json(user[0]);
              });
          })
          .then(trx.commit)
          .catch(trx.rollback);
      }).catch(err => res.status(400).json("Registration failed"));
    }
  });
});

app.get("/profile/:id", (req, res) => {
  const { id } = req.params;
  db.select("*")
    .from("users")
    .where({ id })
    .then(user => {
      if (user.length) return res.json(user[0]);
      return res.status(400).json("User not found!");
    })
    .catch(err => res.status(400).json(`error fetching user`));
});

app.put("/image", (req, res) => {
  const { id } = req.body;

  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries =>
      res
        .json(entries[0])
        .catch(err => res.status(400).json("Unable to update the entries"))
    );
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server started on ${port}`);
});
