module.exports = (db, bcrypt) => (req, res) => {
  const { email, password, name } = req.body;
  if (!email || !password || !name)
    return res.status(400).send("All Fields are required!");
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
};
