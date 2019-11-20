const mongoose = require('mongoose');

const { Schema } = mongoose;

// create the cart schema
const cartSchema = new Schema({
  customerId: { type: Number, required: true },
  products: { type: [String] },
  wishlist: { type: [String] },
});

// export out the generated collection, it will be used in the seeding file and
// as context in the GraphQL API
module.exports = mongoose.model('Cart', cartSchema);
