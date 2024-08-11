const customers = require('./routes/customers.js');
const genres = require('./routes/genres.js');
const mongoose = require('mongoose');
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
app.use('/api/customers', customers);

const port = global.process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});
