/**
 * This file is used as the first step of resetting the psql database.
 * It drops the two tables in the psql database.
 */

const Pool = require('./dbConnection');

// using an async function to ensure that these two drops occur before the next script is run.
async function resetDb() {
  console.log('resetting psql database...');
  await Pool.connect()
    .then(async (client) => {
      await client.query('DROP TABLE IF EXISTS customers CASCADE').then(() => {
        console.log('customers table dropped');
        client.release();
      });
    });
  await Pool.connect()
    .then(async (client) => {
      await client.query('DROP TABLE IF EXISTS addresses CASCADE').then(() => {
        console.log('addresses table dropped');
        client.release();
      });
    });
  await Pool.connect()
    .then(async (client) => {
      await client.query('DROP TABLE IF EXISTS "customerOrders" CASCADE').then(() => {
        console.log('customerOrders table dropped');
        client.release();
      });
    });

  await Pool.connect()
    .then(async (client) => {
      await client.query('DROP TABLE IF EXISTS "orderProducts" CASCADE').then(() => {
        console.log('orderProducts table dropped');
        client.release();
      });
    });

  await Pool.connect()
    .then(async (client) => {
      await client.query('DROP TABLE IF EXISTS "products" CASCADE').then(() => {
        console.log('products table dropped');
        client.release();
      });
    });

  await Pool.connect()
    .then(async (client) => {
      await client.query('DROP TABLE IF EXISTS "warehouses" CASCADE').then(() => {
        console.log('warehouses table dropped');
        client.release();
      });
    });

  await Pool.connect()
    .then(async (client) => {
      await client.query('DROP TABLE IF EXISTS "warehouseInventory" CASCADE').then(() => {
        console.log('warehouseInventory table dropped');
        client.release();
      });
    });

  // line break in console
  console.log('');
}

resetDb();
