const faker = require('faker');
const Pool = require('./dbConnection');

async function seedWarehouses() {
  // create an array of variables to be inserted into the database
  const values = [
    faker.address.streetAddress(),
    faker.address.secondaryAddress(),
    faker.address.city(),
    faker.address.state(),
    faker.address.zipCode(),
    faker.commerce.department(),
  ];

  // connect to a pool client to reduce chances of a full pool & connection errors
  await Pool.connect()
    .then(async (client) => {
      // send query to client to insert and address and warehouse
      await client.query(`
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
        .finally(() => client.release());
    })
    .catch((err) => console.log('ERROR ADDING WAREHOUSE', err));
}

console.log('Seeding warehouses');

// create the 25 warehouses in the database
for (let i = 0; i < 25; i++) {
  seedWarehouses();
}
