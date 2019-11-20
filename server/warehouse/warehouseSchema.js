/**
 * @module: warehouseSchema.js
 * @author: Austin Ruby
 * @description: define schema for warehouse data
 */

// require in Base schema so we can add types, and
// so we can extend the Query and Mutation schemas
const Base = require('../baseSchema');
const Address = require('../address/addressSchema');

// actually defining warehouse schema
const Warehouse = `
  # Warehouse describes details about a warehouse
  type Warehouse {
    warehouseId: Int!
    name: String!
    address: Address # warehouses shouldn't exist without addresses. TODO: FIX THIS
  }

  extend type Query {
    # Find a single warehouse via its id (same id as in PSQL table)
    warehouse(warehouseId: Int!): Warehouse!

    # Return information on all warehouses
    warehouses: [Warehouse!]!
  }

  extend type Mutation {
    # mutation to add a new warehouse to the PSQL database
    addWarehouse(
      name: String!
      addressId: Int!
    ): Warehouse!

    # updates warehouse information (name or address_id)
    updateWarehouse(
      warehouseId: Int!,
      name: String,
      id: Int
    ): Warehouse!

    # deletes warehouse (and address???)
    deleteWarehouse(
      warehouseId: Int!
    ): Warehouse!
  }
`;

// export function that returns array of all schemas necessary to build this one, including base
module.exports = () => [Warehouse, Address, Base];
