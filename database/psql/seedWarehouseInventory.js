const Pool = require('./dbConnection');

async function seedWarehouseInventory() {
  // create an array of variables to be inserted into the database
  const values = [
    Math.ceil(Math.random() * 250),
    Math.ceil(Math.random() * 25),
    Math.ceil(Math.random() * 2500),
  ];

  // console.log('full input array is', values);

  // use a connection client to prevent errors from a full pool & connection timeouts
  await Pool.connect()
    .then((client) => {
      client.query(`
        INSERT INTO "warehouseInventory"("productId", "warehouseId", quantity)
        VALUES ($1, $2, $3)
        RETURNING *
        `, values)
        .then((newRow) => console.log(`NEW INVENTORY ADDED FOR WAREHOUSE: ${newRow.rows[0].warehouseId}`))
        .catch((err) => console.log('ERROR ADDING WAREHOUSE INVENTORY', err, values))
        .finally(() => client.release());
    });
}

console.log('Seeding warehouse inventory');

// create the warehouse inventories for the 25 warehouses
for (let i = 0; i < 25; i++) {
  seedWarehouseInventory();
}
