const { makeExecutableSchema } = require('graphql-tools');

// Base Schema
const Base = require('./baseSchema');

// Schemas with information in Postgres
const Address = require('./address/addressSchema');
const Customer = require('./customer/customerSchema');
const Order = require('./order/orderSchema');
const Product = require('./product/productSchema');
const Warehouse = require('./warehouse/warehouseSchema');

// Schema with information in Mongo
const Cart = require('./cart/cartSchema');

// combined resolvers
const resolvers = require('./resolvers');

// The makeExecutableSchema in schema.js can handle duplicate schemas and will combine them
// I invoke the functions here to get an iterable (array) to spread into the typeDefs array
// There is a way to do this with just functions (which is what is exported).
module.exports = makeExecutableSchema({
  typeDefs: [
    ...Base(), ...Address(), ...Customer(), ...Order(),
    ...Product(), ...Warehouse(), ...Cart(),
  ],
  resolvers,
});
