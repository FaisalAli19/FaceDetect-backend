module.exports = (db, bcrypt) => (req, res) => {
  const { email, password } = req.body;
  if (!email || !password)
    return res.status(400).send("Email or Password cann't be blank!");
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
};
