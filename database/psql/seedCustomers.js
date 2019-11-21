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

  // use pool connections to reduce connection timeout errors due to a full pool
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

console.log('Seeding customers and warehouses');

// create the 25 customers in the database
for (let i = 0; i < 25; i++) {
  seedCustomers();
}
