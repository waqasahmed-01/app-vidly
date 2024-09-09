const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 0,
    maxLength: 255,
  },
});

const Movie = mongoose.model('Movie', movieSchema);
