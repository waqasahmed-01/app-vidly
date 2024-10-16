const { Rental, validate } = require('../models/rental');
const { Movie } = require('../models/movie');
const { Customer } = require('../models/customer');
const Fawn = require('fawn');
const express = require('express');
const router = express.Router();

Fawn.init('mongodb://localhost/app-vidly');

//Get Request,
router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut');
  res.status(200).json({ result: true, data: rentals });
});

//Single id,
router.get('/:id', async (req, res) => {
  const id = req.params.id;
  if (id.length !== 24)
    return res.status(400).send('Id length should be 24 characters');

  const rental = await Rental.findById(id);
  if (!rental)
    return res.status(404).send('The rental with the given ID was not found.');

  res.status(200).json({ result: true, data: rental });
});

//Post,
router.post('/', async (req, res) => {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send('Invalid customer.');

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.');

  if (movie.numberInStock === 0)
    return res.status(400).send('Movie not in stock.');

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    new Fawn.Task()
      .save('rentals', rental)
      .update('movies', { _id: movie._id }, { $inc: { numberInStock: -1 } })
      .run();

    res.status(200).json({ result: true, data: rental });
  } catch (exp) {
    res.status(500).json({ result: false, message: 'Something failed.' });
  }
});

module.exports = router;
