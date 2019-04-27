module.exports = db => (req, res) => {
  const { id } = req.params;
  if (!id) return res.status(400).send("Id not provided");
  db.select("*")
    .from("users")
    .where({ id })
    .then(user => {
      if (user.length) return res.json(user[0]);
      return res.status(400).json("User not found!");
    })
    .catch(err => res.status(400).json(`error fetching user`));
};
