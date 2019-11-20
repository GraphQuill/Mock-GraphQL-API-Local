const faker = require('faker');
const Pool = require('./dbConnection');

// console.log(typeof Number(faker.address.zipCode()));
async function seedProducts() {
  // create an array of variables to be inserted into the database
  const values = [
    faker.commerce.productName(),
    faker.commerce.productAdjective() + faker.commerce.productMaterial(),
    Math.ceil(Math.random() * 100000),
    Math.ceil(Math.random() * 50),
  ];

  // console.log('full input array is', values);

  await Pool.query(`
    INSERT INTO products("name", "description", "price", "weight")
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `, values)
    .then((newRow) => console.log(`NEW PRODUCT ADDED: ${newRow.rows[0].name}`))
    .catch((err) => console.log('ERROR ADDING PRODUCT (THIS IS SOMEWHAT EXPECTED FOR SEEDING SCRIPT)', err));
}

// seed with a random number of inputs
// const random = Math.random() * 25;
// console.log(`Seeding ${Math.floor(random) + 1} values`);
console.log('Seeding products');

// // seems to be fixed:
// // EXPECT ERRORS HERE as js will create a lot of pool connections faster than they can be handled
// create the 25 customers in the database
for (let i = 0; i < 250; i++) {
  seedProducts();
}

// this isn't logging in the right spot because of async activity...
// TODO I can fix this with a promise all that's fed the seed function...
// TODO ...there are more important battles right now
// Note: this actually isn't too far off because seed runs asyncronously and each
// query is being awaited separately
Pool.query('SELECT COUNT(*) FROM products')
  .then((result) => console.log('The total product count is', result.rows[0].count));
