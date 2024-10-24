const { Genre, validate, saveDoc, displayDoc } = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//1, Read or Get.
router.get('/', async function (req, res) {
  const genres = await Genre.find().sort('name');
  res.status(200).json({ result: true, data: genres });
});

//Getting with single id,
router.get('/:id', async function (req, res) {
  const genreId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(genreId))
    return res.status(400).send('Invalid ObjectId.');

  const genre = await Genre.findById(genreId);
  if (!genre) return res.status(404).send('Genre with given Id not found');

  res.status(200).json({ result: true, data: genre });
});

//2, Put or update.
router.put('/:id', async function (req, res) {
  const genreId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(genreId))
    return res.status(400).send('Invalid ObjectId.');

  //Validating input.
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    genreId,
    { name: req.body.name },
    { new: true }
  );
  if (!genre) return res.status(404).send('Genre with given Id not found');

  res.status(200).json({ result: true, data: genre });
});

//3, Post or create.
router.post('/', async function (req, res) {
  //Validating.
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Creating.
  let genre = new Genre({
    name: req.body.name,
  });
  genre = await genre.save();

  res.status(200).json({ result: true, data: genre });
});

//Remove.
router.delete('/:id', async function (req, res) {
  const genreId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(genreId))
    return res.status(400).send('Invalid ObjectId.');

  //Delete directly.
  const genre = await Genre.findByIdAndDelete(genreId);
  if (!genre) return res.status(404).send('Given id does not exits');

  res.send('Succesfully deleted from database.');
});

module.exports = router;
