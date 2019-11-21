const Pool = require('./dbConnection');

async function seedCustomerOrders() {
  // create an array of variables to be inserted into the database
  const values = [
    Math.ceil(Math.random() * 250),
    Math.ceil(Math.random() * 15),
    Math.ceil(Math.random() * 25),
  ];

  // use pool connection clients to reduce connection timeout errors from a full pool
  await Pool.connect()
    .then(async (client) => {
      await client.query(`
        INSERT INTO "orderProducts"("productId", "productQty", "orderId")
        VALUES ($1, $2, $3)
        RETURNING *
        `, values)
        .then((newRow) => console.log(`NEW PRODUCT FOR ORDER: ${newRow.rows[0].orderId}`))
        .finally(client.release());
    })
    .catch((err) => console.log('ERROR ADDING PRODUCT TO ORDER', err, '\n\n VALUES ARE \n', values));
}

console.log('Seeding customerOrders');

// create the 100 products in random orders in the database
for (let i = 0; i < 100; i++) {
  seedCustomerOrders();
}
