const mongoose = require('mongoose');
const mongoConnection = require('./dbConnection');

// function def that is async to control the thread of execution
const reset = async () => {
  await mongoConnection();

  // drop the carts collection to wipe all data
  await mongoose.connection.dropCollection('carts', (err, result) => {
    if (err) return console.log(err);
    return console.log('collection deleted:', result);
  });

  await mongoose.disconnect();
};

reset();
