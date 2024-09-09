const Joi = require('joi');
const mongoose = require('mongoose');

//Schema,

const genreSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 20,
  },
});

//Model,
const Genre = mongoose.model('Genre', genreSchema);

//Saving document in collection.
async function saveDocument() {
  const genre = new Genre({
    name: 'Romance',
  });
  const result = await genre.save();
  console.log(result);
}

//Retrieving documents from collection.
async function displayDocuments() {
  const result = await Genre.find().sort({ name: 1 }).select('name');
  console.log(result);
}

//Validation function,
function validateGenre(genre) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(20).required(),
  });
  return schema.validate(genre);
}

module.exports.Genre = Genre;
module.exports.validate = validateGenre;
module.exports.saveDoc = saveDocument;
module.exports.displayDoc = displayDocuments;
