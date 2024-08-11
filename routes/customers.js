const { Customer, validate } = require('../models/customers');
const express = require('express');
const router = express.Router();

//1. Read or get,
router.get('/', async function (req, res) {
  const customers = await Customer.find().sort({ name: 1 });
  res.status(200).json({ result: true, data: customers });
});

//Getting with single id,
router.get('/:id', async function (req, res) {
  const id = req.params.id;
  if (id.length !== 24)
    return res.status(400).send('Id length should be 24 characters');

  const customer = await Customer.findById(id);
  if (!customer)
    return res.status(404).send('Customer with given Id not found');

  res.status(200).json({ result: true, data: customer });
});

//Update,
router.put('/:id', async function (req, res) {
  const id = req.params.id;
  if (id.length !== 24)
    return res.status(400).send('Id lenght sould be 24 characters');

  //Validations
  const { error } = validate(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findByIdAndUpdate(
    id,
    { name: req.body.name, isGold: req.body.isGold, phone: req.body.phone },
    { new: true }
  );
  if (!customer)
    return res.status(404).send('Customer with given id not found');

  res.status(200).json({ result: true, data: customer });
});

//Post,
router.post('/', async function (req, res) {
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

//Deleter,
router.delete('/:id', async function (req, res) {
  const id = req.params.id;
  if (id.length !== 24)
    return res.status(400).send('Id length should be 24 character long');

  //Delete directly.
  const customer = await Customer.findByIdAndDelete(id);
  if (!customer) return res.status(404).send('Given id does not exits');

  res.send('Succesfully deleted from database.');
});

module.exports = router;
