const mongoose = require('mongoose');
const genres = require('./routes/genres.js');
const morgan = require('morgan');
const express = require('express');
const app = express();

//Connecting to database.
mongoose
  .connect('mongodb://localhost/app-vidly')
  .then(() => console.log('Connected to database...'))
  .catch((error) => console.log('Something went wrong' + error));

app.use(express.json());
app.use(morgan('tiny'));
app.use('/api/genres', genres);

const port = global.process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});
