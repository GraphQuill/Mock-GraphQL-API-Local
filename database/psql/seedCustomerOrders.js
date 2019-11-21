const Pool = require('./dbConnection');

async function seedCustomerOrders() {
  // create an array of variables to be inserted into the database
  const values = [
    Math.ceil(Math.random() * 25),
  ];

  // console.log('full input array is', values);

  await Pool.query(`
    INSERT INTO "customerOrders"("customerId")
    VALUES ($1)
    RETURNING *
    `, values)
    .then((newRow) => console.log(`NEW ORDER FOR CUSTOMER: ${newRow.rows[0].customerId}`))
    .catch((err) => console.log('ERROR ADDING ORDER', err));
}

// seed with a random number of inputs
// const random = Math.random() * 25;
// console.log(`Seeding ${Math.floor(random) + 1} values`);
console.log('Seeding customerOrders');

// // seems to be fixed:
// // EXPECT ERRORS HERE as js will create a lot of pool connections faster than they can be handled
// create the 25 customers in the database
for (let i = 0; i < 25; i++) {
  seedCustomerOrders();
}
