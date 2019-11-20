const mongoose = require('mongoose');

// require in models
const CartModel = require('./models/cartModel');

// export an async function that awaits the connection to the database,
// and returns all defined models
module.exports = async () => {
  // internal pool handling set to 5 connections?
  await mongoose.connect(
    'mongodb://localhost:27017/graphquillMock',
    {
      // these options are just to get rid of some deprecation warnings from mongo
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // poolSize: 5,
      socketTimeoutMS: 500,
      connectTimeoutMS: 3000,
    },
  )
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.log('\n\nERROR ON FIRST CONNECTION ATTEMPT TO MONGO:\n\n', err));
  // return an object with all the models on it
  return { CartModel };
};
