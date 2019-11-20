const faker = require('faker'); // npm package for making fake data
const mongoose = require('mongoose'); // disconnecting isn't working b/c of async shit
const mongoConnection = require('./dbConnection');

console.log('Seeding MongoDB with random carts for 25 customers');

// async function that will seed the mongo Cart collection
const seed = async (count) => {
  const { CartModel } = await mongoConnection();

  for (let i = 0; i < count; i++) {
    // create a products array of 1 - 5 items
    const productsArray = [
      faker.commerce.productName(),
      Math.random() > 0.5 ? faker.commerce.productName() : '',
      Math.random() > 0.5 ? faker.commerce.productName() : '',
      Math.random() > 0.5 ? faker.commerce.productName() : '',
      Math.random() > 0.5 ? faker.commerce.productName() : '',
    ];

    // eslint-disable-next-line no-await-in-loop
    await CartModel.create({
      customerId: i,
      // three random products
      products: productsArray,
    }, (err, data) => {
      if (err) console.log('ERROR CREATING CARTS: ', err);
      console.log('CART ADDED FOR CUSTOMER: ', data.customerId);
      if (i === count - 1) mongoose.disconnect(); // conditionally disconnect from database
    });
  }
  return 'resolved';
};

seed(25);
