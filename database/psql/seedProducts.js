const faker = require('faker');
const Pool = require('./dbConnection');

async function seedProducts() {
  // create an array of variables to be inserted into the database
  const values = [
    faker.commerce.productName(),
    faker.commerce.productAdjective() + faker.commerce.productMaterial(),
    Math.ceil(Math.random() * 100000),
    Math.ceil(Math.random() * 50),
  ];

  // use pool connect clients to reduce instances of connection timeout errors from a full pool
  await Pool.connect()
    .then(async (client) => {
      await client.query(`
        INSERT INTO products("name", "description", "price", "weight")
        VALUES ($1, $2, $3, $4)
        RETURNING *
        `, values)
        .then((newRow) => console.log(`NEW PRODUCT ADDED: ${newRow.rows[0].name}`))
        .finally(() => client.release());
    })
    .catch((err) => console.log('ERROR ADDING PRODUCT', err));
}

console.log('Seeding products');

// create the 250 products in the database
for (let i = 0; i < 250; i++) {
  seedProducts();
}
