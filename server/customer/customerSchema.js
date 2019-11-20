const Base = require('../baseSchema');
const Address = require('../address/addressSchema');
const Cart = require('../cart/cartSchema');

// NOTE: # (hashtags) are used as comments within the graphql schema

const Customer = `
  # types are similar to classes or schemas, they tell GQL what types to expect at each variable
  # they should reflect the database schema/setup VERY closely (if not identically)
  
  # The Customer type reflects a row in the PSQL database except there is a special resolver that
  # grabs the address from the addresses table for that nested information
  type Customer {
    id: Int!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String!
    address: Address # a customer doesn't NEED to have an address, i.e. you can sign up for amazon before giving them your address...
    cart: Cart
  }

  extend type Query {
    # Find a single customer via their id (same as id in PSQL table)
    customer(id: Int!): Customer!

    # Return information of all customers (this isn't very practical or useful, but it was easy to make and test)
    customers: [Customer!]!
  }

  extend type Mutation {
    # mutation to add a new customer to the PSQL database
    addCustomer(
      firstName: String!,
      lastName: String!,
      email: String!,
      phoneNumber: String!
    ): Customer!
    
    # Deprecated mutation that adds a customer and address simultaneously
    addCustomerAndAddress(
      firstName: String!, 
      lastName: String!, 
      email: String!, 
      phoneNumber: String!,

      # address details
      address: String!,
      address2: String,
      city: String,
      state: String!,
      zipCode: String!): Customer! @deprecated (reason: "Use \`addCustomer\` A user should be created without an address, and the address created separately.")

    # updates user information (name, email, phone no.)
    updateCustomer(
      id: Int!,
      firstName: String, 
      lastName: String, 
      email: String, 
      phoneNumber: String
      ): Customer!
      
    # deletes customer AND associated address
    deleteCustomer(
      id: Int! # customer id
    ): Int!
    }
`;

// export a function that returns the array of all the schemas that are necessary to build
// this one (and the base schema)
module.exports = () => [Customer, Address, Cart, Base];
