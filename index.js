const genres = require('./routes/genres.js');
const customers = require('./routes/customers.js');
const movies = require('./routes/movies.js');
const rentals = require('./routes/rentals.js');
const users = require('./routes/users.js');
const login = require('./routes/login.js');
const config = require('config');
const morgan = require('morgan');
const mongoose = require('mongoose');
const express = require('express');
const app = express();

if (!config.get('jwtPrivateKey')) {
  console.error('FATAL ERROR: JwtPrivakeKey is not defined.');
  process.exit(1);
}

//Connecting to database.
mongoose
  .connect('mongodb://localhost/app-vidly')
  .then(() => console.log('Connected to database...'))
  .catch((error) => console.log('Something went wrong' + error));

app.use(express.json());
app.use(morgan('tiny'));

//Handling routes.
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/login', login);

const port = global.process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Listening on port http://localhost:${port}`);
});
