const faker = require('faker');
const Pool = require('./dbConnection');

async function seedWarehouses() {
  // create an array of variables to be inserted into the database
  const values = [
    faker.address.streetAddress(),
    faker.address.secondaryAddress(),
    faker.address.city(),
    faker.address.state(),
    faker.address.zipCode(), // this seems to sometimes throw an error when the column type is INT
    faker.commerce.department(),
  ];

  // console.log('full input array is', values);

  await Pool.query(`
    WITH newAddress AS (
      INSERT INTO addresses("address", "address2", "city", "state", "zipCode") 
      VALUES ($1, $2, $3, $4, $5)
      RETURNING *
    )
    INSERT INTO warehouses("name", "addressId")
    VALUES ($6, (SELECT id FROM newAddress))
    RETURNING *
    `, values)
    .then((newRow) => console.log(`NEW WAREHOUSE ADDED: ${newRow.rows[0].name}`))
    .catch((err) => console.log('ERROR ADDING CUSTOMER AND/OR ADDRESS (THIS IS SOMEWHAT EXPECTED FOR SEEDING SCRIPT)', err));
}

// seed with a random number of inputs
// const random = Math.random() * 25;
// console.log(`Seeding ${Math.floor(random) + 1} values`);
console.log('Seeding warehouses');

// // seems to be fixed:
// // EXPECT ERRORS HERE as js will create a lot of pool connections faster than they can be handled
// create the 25 customers in the database
for (let i = 0; i < 25; i++) {
  seedWarehouses();
}

// this isn't logging in the right spot because of async activity...
// TODO I can fix this with a promise all that's fed the seed function...
// TODO ...there are more important battles right now
// Note: this actually isn't too far off because seed runs asyncronously and each
// query is being awaited separately
// Pool.query('SELECT COUNT(*) FROM customers')
//   .then((result) => console.log('The total customer count is', result.rows[0].count));
