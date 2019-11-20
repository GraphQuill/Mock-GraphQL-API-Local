// the Base schema is required in so that we can add types (Address), and to
// extend the Query and Mutation schemas
const Base = require('../baseSchema');

// this file defines the address schema
const Address = `
  # Address describes an instance of a user's address
  type Address {
    # id corresponds to the id in PSQL
    id: Int!

    # Line 1 of an address
    address: String!

    # Optional line 2 of an address (no exclaimation point)
    address2: String 

    # The rest of these are fairly self explainatory
    city: String!
    state: String!
    # zipCode was made a string due to how faker (npm package) produces zipcodes
    zipCode: String! 
  }

  # Queries define what endpoints the user can query from
  # the keys inside of the parameters are arguments (which are used in the resolver functions)

  extend type Query {
    # The address query grabs an Address from the PSQL database with a corresponding id (NOT the addressId in the customers table)
    address(id: Int!): Address! 

    # The addresses query returns all addresses, it's not that useful...
    addresses: [Address!]! # iterable of addresses where no element can be null
  }

  extend type Mutation {
    # Deprecated mutation, functionality is replaced by createOrUpdateAddress
    updateAddress(
      customerId: Int!,
      address: String,
      address2: String,
      city: String,
      state: String,
      zipCode: String): Address! @deprecated (reason: "Use \`createOrUpdateAddress\`")

    # returns the number of created/updated addresses in the sql database (0 or 1)
    createOrUpdateAddress(
      # looks up an addressed by finding the addressId in the customers table (using the customerId)
      customerId: Int!,

      # first line of address
      address: String!,

      # second, optional, line of address
      address2: String,
      city: String!,
      state: String!,
      zipCode: String!): Int!
      
  }
  `;

// The address and base schemas are exported together because the address extends the base schema
module.exports = () => [Address, Base];
