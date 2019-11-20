const Pool = require('./dbConnection');

// note: sql queries cannot have trailing commas for the last argument (like in js)
// function that will create each table and then add necessary constraints
async function setup() {
  // setup the customer table
  console.log('setting up customers table...');
  await Pool.connect()
    .then(async (client) => {
      await client.query(`
        CREATE TABLE IF NOT EXISTS customers (
          id SERIAL PRIMARY KEY, 
          "firstName" VARCHAR(255) NOT NULL, 
          "lastName" VARCHAR(255) NOT NULL,
          "email" VARCHAR(255) NOT NULL,
          "addressId" INT,
          "phoneNumber" VARCHAR(40)
        )
        `)
        .then(() => console.log('customers table made')) // notify the console on completion
        .finally(() => client.release());
    });

  // setup the addresses table
  console.log('setting up addresses table...');
  await Pool.connect()
    .then(async (client) => {
      await client.query(`
        CREATE TABLE IF NOT EXISTS addresses (
          id SERIAL PRIMARY KEY, 
          "address" VARCHAR(255) NOT NULL, 
          "address2" VARCHAR(255),
          "city" VARCHAR(255) NOT NULL,
          "state" VARCHAR(255) NOT NULL,
          "zipCode" VARCHAR(10) NOT NULL
        )
        `)
        .then(() => console.log('addresses table made')) // notify the console on completion
        .finally(() => client.release());
    });


  await Pool.connect()
    .then(async (client) => {
      client.query(`
        CREATE TABLE IF NOT EXISTS "customerOrders" (
          "orderId" SERIAL PRIMARY KEY, 
          "customerId" INT
        )`)
        .then(() => console.log('customerOrders table made')) // notify the console on completion
        .finally(() => client.release());
    });


  await Pool.connect()
    .then(async (client) => {
      await client.query(`
        CREATE TABLE IF NOT EXISTS "orderProducts" (
          "orderProductId" SERIAL PRIMARY KEY,
          "productId" INT,
          "productQty" INT,
          "orderId" INT
      )`)
        .then(() => console.log('orderProducts table created'))
        .finally(() => client.release());
    });

  await Pool.connect()
    .then(async (client) => {
      await client.query(`
        CREATE TABLE IF NOT EXISTS "products" (
          "productId" SERIAL PRIMARY KEY,
          "name" VARCHAR(255),
          "description" VARCHAR(255),
          "price" INT,
          "weight" INT
      )`)
        .then(() => console.log('products table created'))
        .finally(() => client.release());
    });

  await Pool.connect()
    .then(async (client) => {
      await client.query(`
        CREATE TABLE IF NOT EXISTS "warehouses" (
          "warehouseId" SERIAL PRIMARY KEY,
          "name" VARCHAR(255),
          "addressId" INT
      )`)
        .then(() => console.log('warehouses table created'))
        .finally(() => client.release());
    });

  await Pool.connect()
    .then(async (client) => {
      await client.query(`
        CREATE TABLE IF NOT EXISTS "warehouseInventory" (
          "id" SERIAL PRIMARY KEY,
          "productId" INT,
          "warehouseId" INT,
          "quantity" INT
      )`)
        .then(() => console.log('warehouseInventory table created'))
        .finally(() => client.release());
    });


  // add foregin key constraint, this will throw an error if the previous queries are not
  // awaited because the tables won't exist yet
  console.log('setting up addresses_customer constraint...');
  await Pool.connect()
    .then(async (client) => {
      await client.query(`
        ALTER TABLE customers
        ADD CONSTRAINT "addressConstraint"
        FOREIGN KEY ("addressId")
        REFERENCES addresses (id)
        ON DELETE CASCADE
        `)
        .then(() => console.log('constraint added for customers and addresses')) // shoot a message to the console
        .finally(() => client.release());
    });

  await Pool.connect()
    .then(async (client) => {
      await client.query(`
        ALTER TABLE "customerOrders"
        ADD CONSTRAINT "customerOrderConstraint"
        FOREIGN KEY ("customerId")
        REFERENCES customers (id)
        ON DELETE CASCADE
        `)
        .then(() => console.log('constraint added for customerOrders and customers')) // shoot a message to the console
        .finally(() => client.release());
    });

  await Pool.connect()
    .then(async (client) => {
      await client.query(`
        ALTER TABLE "orderProducts"
        ADD CONSTRAINT "customerOrderProductsConstraint"
        FOREIGN KEY ("orderId")
        REFERENCES "customerOrders" ("orderId")
        ON DELETE CASCADE
        `)
        .then(() => console.log('constraint added for customerOrders and orderProducts')) // shoot a message to the console
        .finally(() => client.release());
    });

  await Pool.connect()
    .then(async (client) => {
      await client.query(`
        ALTER TABLE "orderProducts"
        ADD CONSTRAINT "orderProductsToProductsConstraint"
        FOREIGN KEY ("productId")
        REFERENCES "products" ("productId")
        ON DELETE CASCADE
        `)
        .then(() => console.log('constraint added for products and orderProducts')) // shoot a message to the console
        .finally(() => client.release());
    });

  await Pool.connect()
    .then(async (client) => {
      await client.query(`
        ALTER TABLE "warehouseInventory"
        ADD CONSTRAINT "warehouseInventoryToProductsConstraint"
        FOREIGN KEY ("productId")
        REFERENCES "products" ("productId")
        ON DELETE CASCADE
        `)
        .then(() => console.log('constraint added for products and warehouseInventory')) // shoot a message to the console
        .finally(() => client.release());
    });

  await Pool.connect()
    .then(async (client) => {
      await client.query(`
      ALTER TABLE "warehouseInventory"
      ADD CONSTRAINT "warehouseInventoryToWarehouseConstraint"
      FOREIGN KEY ("warehouseId")
      REFERENCES "warehouses" ("warehouseId")
      ON DELETE CASCADE
      `)
        .then(() => console.log('constraint added for warehouse and warehouseInventory')) // shoot a message to the console
        .finally(() => client.release());
    });

  await Pool.connect()
    .then(async (client) => {
      await client.query(`
      ALTER TABLE "warehouses"
      ADD CONSTRAINT "warehousesToAddressesConstraint"
      FOREIGN KEY ("addressId")
      REFERENCES "addresses" ("id")
      ON DELETE CASCADE
      `)
        .then(() => console.log('constraint added for warehouse and warehouseInventory')) // shoot a message to the console
        .finally(() => client.release());
    });

  // line break in console
  console.log('');
} // setup functon def closing curly

// invoke setup function
setup();
