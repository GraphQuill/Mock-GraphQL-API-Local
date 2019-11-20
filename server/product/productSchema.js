/**
 * @module: productSchema.js
 * @author: Austin Ruby
 * @description: define schema for product data
 */

const Base = require('../baseSchema');

const Product = `
  # Product describes details about a product
  type Product {
    productId: Int!
    name: String!
    description: String!
    price: Float!
    weight: Float!
    productQty: Int
  }

  extend type Query {
    # Find a single product via its id (same as in PSQL table)
    product(productId: Int!): Product!

    # Return information on all products
    products: [Product!]!
  }

  extend type Mutation {
    # mutation to add a new product to the PSQL database
    addProduct(
      name: String!
      description: String!
      price: Float!
      weight: Float!
    ): Product!

    # mutation to update product information
    updateProduct(
      productId: Int!
      name: String
      description: String
      price: Float
      weight: Float
    ): Product!

    # mutation to delete a product
    deleteProduct(
      productId: Int!
    ): Product!
  }
`;

module.exports = () => [Product, Base];
