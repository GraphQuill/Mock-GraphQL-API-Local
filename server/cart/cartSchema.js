const Base = require('../baseSchema');

const Cart = `
  # A Cart must have a customerId, the products and wishlist can both be empty Arrays or null
  type Cart {
    # The id associated with the customer in the customers PSQL table
    customerId: Int!

    # A null-able array containing strings of product names
    products: [String!]

    # Same as products, currently the mutations for this are not setup
    wishlist: [String!]
  }

  # Queries define what endpoints the user can query from
  # the keys inside of the parameters are arguments (which are used in the resolver functions)

  extend type Query {
    # cart returns a Cart type based on an argument of customerId
    cart(customerId: Int!): Cart! 
  }

  extend type Mutation {
    # Creates a cart in the mongodb if it doesn't exist, otherwise updates the existing cart
    # for the given customer
    createOrUpdateCart(customerId: Int!, newItem: String!): Cart!

    # Removes items (by name) from the cart of the given customer
    removeItemsFromCart(customerId: Int!, itemsToRemove: [String!]): Cart!

    # deletes an entire cart of a customer
    deleteCart(customerId: Int!): Cart!
  }
  `;

module.exports = () => [Cart, Base];
