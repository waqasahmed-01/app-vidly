const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const express = require('express');
const router = express.Router();

router.get('/', async function (req, res) {
  const movies = await Movie.find().sort('name');
  res.status(200).json({ result: true, data: movies });
});

router.get('/:id', async function (req, res) {
  const id = req.params.id;
  if (id.length !== 24)
    return res.status(400).send('Id length should be 24 characters');

  const movie = await Movie.findById(id);
  if (!movie)
    return res.status(404).send('The movie with the given ID was not found.');
  res.status(200).json({ result: true, data: movie });
});

module.exports = router;
