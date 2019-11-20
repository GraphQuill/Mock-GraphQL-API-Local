/**
 * @module : orderSchema.js
 * @author : Austin Ruby
 * @function : Define structure of orders and how the API will query for and mutate order data
 */

const Base = require('../baseSchema');
const Customer = require('../customer/customerSchema');
const Product = require('../product/productSchema');

const Order = `
  # The Order type reflects a row in the PSQL database except there is a special resolver that grabs the customer from the customers table for that nested information
  type Order {
    orderId: Int!
    customer: Customer
    products: [Product!]!
  }

  extend type Query {
    # Find a single order via its id (corresponds to orderId in PSQL)
    order(orderId: Int!): Order!

    # Find all orders for a given customer by the customer's id
    customerOrders(customerId: Int!): [Order!]!
  }

  input OrderProduct {
    productId: Int!
    productQty: Int!
  }
  
  extend type Mutation {
    # Create an order with a customer id and product ids
    addOrder(
      customerId: Int!
      products: [OrderProduct!]!
    ): Int!
  }
`;

module.exports = () => [Order, Customer, Product, Base];
