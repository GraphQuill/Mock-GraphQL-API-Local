const faker = require('faker');
const Pool = require('./dbConnection');

// console.log(typeof Number(faker.address.zipCode()));
async function seedCustomers() {
  // create an array of variables to be inserted into the database
  const values = [
    faker.address.streetAddress(),
    faker.address.secondaryAddress(),
    faker.address.city(),
    faker.address.state(),
    faker.address.zipCode(), // this seems to sometimes throw an error when the column type is INT
    faker.name.firstName(),
    faker.name.lastName(),
    faker.internet.email(),
    faker.phone.phoneNumber(),
  ];

  // console.log('full input array is', values);

  await Pool.connect()
    .then((client) => {
      client.query(`
        WITH newAddress AS (
          INSERT INTO addresses("address", "address2", "city", "state", "zipCode") 
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
          )
          INSERT INTO customers("firstName", "lastName", "email", "addressId", "phoneNumber")
          VALUES ($6, $7, $8, (SELECT id FROM newAddress), $9)
          RETURNING *
      `, values)
        .then((newRow) => console.log(`NEW CUSTOMER ADDED: ${newRow.rows[0].firstName} ${newRow.rows[0].lastName}`))
        .catch((err) => console.log('ERROR ADDING CUSTOMER AND/OR ADDRESS (THIS IS SOMEWHAT EXPECTED FOR SEEDING SCRIPT)', err))
        .finally(() => {
          client.release();
        });
    });
}

// seed with a random number of inputs
// const random = Math.random() * 25;
// console.log(`Seeding ${Math.floor(random) + 1} values`);
console.log('Seeding customers and warehouses');

// // seems to be fixed:
// // EXPECT ERRORS HERE as js will create a lot of pool connections faster than they can be handled
// create the 25 customers in the database
for (let i = 0; i < 25; i++) {
  seedCustomers();
}

// this isn't logging in the right spot because of async activity...
// TODO I can fix this with a promise all that's fed the seed function...
// TODO ...there are more important battles right now
// Note: this actually isn't too far off because seed runs asyncronously and each
// query is being awaited separately
// Pool.query('SELECT COUNT(*) FROM customers')
//   .then((result) => console.log('The total customer count is', result.rows[0].count));
