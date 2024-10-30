const { User, validate } = require('../models/user');
const _lodash = require('lodash');
const bcrypt = require('bcrypt');
const express = require('express');
const router = express.Router();

router.post('/', async function (req, res) {
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let user = await User.findOne({ email: req.body.email });
  if (user) return res.status(400).send('User already registerd.');

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });
  //Saving into database.
  await user.save();

  const lodashProp = _lodash.pick(user, ['_id', 'name', 'email']);
  res.status(200).json({ result: true, data: lodashProp });
});

module.exports = router;
