const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//1, Read or Get.

router.get('/', async function (req, res) {
  const genres = await Genre.find().sort('name');
  res.status(200).json({
    results: true,
    data: genres,
    message: 'Data successfully fetched from database',
  });
});

//Getting with single id,
router.get('/:id', async function (req, res) {
  const id = req.params.id;
  if (id.length !== 24) {
    return res
      .status(400)
      .json({ code: 400, message: 'Id length should be 24 characters' });
  }
  const genre = await Genre.findById(id);
  if (!genre) {
    return res.status(404).json({
      error: {
        code: 404,
        message: 'Genre with given Id not found',
      },
    });
  } else {
    return res.status(200).json({
      code: 200,
      data: genre,
      message: 'Genre with given Id fetched successfully',
    });
  }
});

//2, Put or update.
router.put('/:id', async function (req, res) {
  //Updating.
  const id = req.params.id;
  if (id.length !== 24) {
    return res.status(400).json({
      code: 400,
      message: 'Id length should be 24 characters',
    });
  }

  //Validating input.
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const genre = await Genre.findByIdAndUpdate(
    id,
    { name: req.body.name },
    { new: true }
  );
  if (!genre) {
    return res.status(404).json({
      code: 404,
      data: false,
      message: 'Genre with given Id not found',
    });
  } else {
    return res.status(200).json({
      results: true,
      data: genre,
      message: 'Genre updated successfully.',
    });
  }
});

//3, Post or create.
router.post('/', async function (req, res) {
  //Validating.
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //Creating.
  let genre = new Genre({
    name: req.body.name,
  });
  genre = await genre.save();
  res.status(200).json({
    code: 200,
    data: genre,
    message: 'Genre posted in database',
  });
});

//Remove.
router.delete('/:id', async function (req, res) {
  const id = req.params.id;
  if (id.length !== 24)
    return res.status(400).send('Id length should be 24 character long');
  //Delete directly.
  const genre = await Genre.findByIdAndDelete(id);
  if (!genre) {
    res
      .status(404)
      .json({ result: false, message: 'Genre with given id not found.' });
    return;
  } else return res.send('Deleted Successfully');
});

module.exports = router;
