const Joi = require('joi');
const mongoose = require('mongoose');

//Schema,
const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 20,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
  phone: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 20,
  },
});

//Model,
const Customer = mongoose.model('Customer', customerSchema);

//Saving into database,
async function saveDocument() {
  const customer = new Customer({
    name: 'Customer 1',
    isGold: false,
    phone: '12345',
  });
  const results = await customer.save();
  console.log(results);
}

//Retrieving.

async function displayDocuments() {
  const results = await Customer.find().sort('name');
  console.log(results);
}

//Validating customers

function validateCustomer(customer) {
  const schema = Joi.object({
    name: Joi.string().min(4).max(20).required(),
    phone: Joi.string()
      .pattern(new RegExp('^[0-9]*$'))
      .min(4)
      .max(20)
      .required(),
    isGold: Joi.boolean(),
  });
  return schema.validate(customer);
}

module.exports = {
  Customer: Customer,
  validate: validateCustomer,
  saveDoc: saveDocument,
  displayDoc: displayDocuments,
};
