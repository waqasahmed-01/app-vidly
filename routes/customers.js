const auth = require('../middleware/authorization');
const admin = require('../middleware/admin');
const { Customer, validate } = require('../models/customer');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

//1. Read or get,
router.get('/', async function (req, res) {
  const customers = await Customer.find().sort({ name: 1 });
  res.status(200).json({ result: true, data: customers });
});

//Getting with single id,
router.get('/:id', async function (req, res) {
  const customerId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(customerId))
    return res.status(400).send('Invalid objectId');

  const customer = await Customer.findById(customerId);
  if (!customer)
    return res.status(404).send('Customer with given Id was not found');

  res.status(200).json({ result: true, data: customer });
});

//Update,
router.put('/:id', async function (req, res) {
  const customerId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(customerId))
    return res.status(400).send('Invalid objectId');

  //Validations
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    customerId,
    { name: req.body.name, isGold: req.body.isGold, phone: req.body.phone },
    { new: true }
  );
  if (!customer)
    return res.status(404).send('Customer with given id was not found');

  res.status(200).json({ result: true, data: customer });
});

//Post,
router.post('/', auth, async function (req, res) {
  const { error } = validate(req.body);
  if (error) return res.status(404).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    isGold: req.body.isGold,
    phone: req.body.phone,
  });
  customer = await customer.save();

  res.status(200).json({ result: true, data: customer });
});

//Delete,
router.delete('/:id', [auth, admin], async function (req, res) {
  const customerId = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(customerId))
    return res.status(400).send('Invalid objectId');

  //Delete directly.
  const customer = await Customer.findByIdAndDelete(customerId);
  if (!customer)
    return res.status(404).send('Customer with given id was not found.');

  res.send('Succesfully deleted from database.');
});

module.exports = router;
