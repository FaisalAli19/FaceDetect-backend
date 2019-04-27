const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: process.env.CLARIFAI_FACEDETECT_API
});

const handleApiCall = (req, res) => {
  app.models
    .predict(Clarifai.FACE_DETECT_MODEL, req.body.input)
    .then(data => res.json(data))
    .catch(err => res.status(400).send(err));
};

const handleImage = db => (req, res) => {
  const { id } = req.body;
  if (!id) return res.status(400).send("Id not provided");
  db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries")
    .then(entries => res.send(entries[0]))
    .catch(err => res.status(400).json("Unable to update the entries"));
};

module.exports = {
  handleImage,
  handleApiCall
};
