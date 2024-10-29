const { Movie, validate } = require('../models/movie');
const { Genre } = require('../models/genre');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.get('/', async function (req, res) {
  const movies = await Movie.find().sort('name');
  res.status(200).json({ result: true, data: movies });
});

//Single id,
router.get('/:id', async function (req, res) {
  const movieId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(movieId))
    return res.status(400).send('Invalid objectId');

  const movie = await Movie.findById(movieId);
  if (!movie)
    return res.status(404).send('The movie with the given ID was not found.');
  res.status(200).json({ result: true, data: movie });
});

//Update,
router.put('/:id', async function (req, res) {
  const movieId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(movieId))
    return res.status(400).send('Invalid objectId');

  //Validations,
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send('Inavlid genre');

  const movie = await Movie.findByIdAndUpdate(
    movieId,
    {
      title: req.body.title,
      genre: {
        _id: genre._id,
        name: genre.name,
      },
      numberInStock: req.body.numberInStock,
      dailyRentalRate: req.body.dailyRentalRate,
    },
    { new: true }
  );

  if (!movie)
    return res.status(404).send('The movie with the given ID was not found.');

  res.status(200).json({ result: true, data: movie });
});

//Creating,

router.post('/', async function (req, res) {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genreId = req.body.genreId;
  if (!mongoose.Types.ObjectId.isValid(genreId))
    return res.status(400).send('The genre objectId is invalid ');

  const genre = await Genre.findById(genreId);
  if (!genre)
    return res.status(400).send('The genre with the given id was not found.');

  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });
  movie = await movie.save();
  res.status(200).json({ result: true, data: movie });
});

//Delete,

router.delete('/:id', async function (req, res) {
  const movieId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(movieId))
    return res.status(400).send('Invalid objectId');

  const movie = await Movie.findByIdAndDelete(movieId);
  if (!movie)
    return res.status(404).send('The movie with the given ID was not found.');

  res
    .status(200)
    .json({ result: true, data: movie, message: 'Deleted successfully' });
});

module.exports = router;
