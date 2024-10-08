const { Genre, validate, saveDoc, displayDoc } = require('../models/genre');
const express = require('express');
const router = express.Router();

//1, Read or Get.
router.get('/', async function (req, res) {
  const genres = await Genre.find().sort('name');
  res.status(200).json({ result: true, data: genres });
});

//Getting with single id,
router.get('/:id', async function (req, res) {
  const id = req.params.id;
  if (id.length !== 24)
    return res.status(400).send('Id length should be 24 characters');

  const genre = await Genre.findById(id);
  if (!genre) return res.status(404).send('Genre with given Id not found');

  res.status(200).json({ result: true, data: genre });
});

//2, Put or update.
router.put('/:id', async function (req, res) {
  const id = req.params.id;
  if (id.length !== 24)
    return res.status(400).send('Id length should be 24 characters');

  //Validating input.
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findByIdAndUpdate(
    id,
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
  const id = req.params.id;
  if (id.length !== 24)
    return res.status(400).send('Id length should be 24 character long');
  //Delete directly.
  const genre = await Genre.findByIdAndDelete(id);
  if (!genre) return res.status(404).send('Given id does not exits');

  res.send('Succesfully deleted from database.');
});

module.exports = router;
