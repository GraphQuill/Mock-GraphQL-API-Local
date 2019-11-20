/**
 * This file's purpose is to combine all of the resolvers, allowing for modular development
 * The result will be exported to the schema.js file to ultimately feed makeExecutableSchema
 */

// resolvers for the Customer type
const {
  // this syntax (I think) is destructuring the Query key of the exports from customerResolver,
  // as CustomerQuery
  Query: CustomerQuery,
  Mutation: CustomerMutation,
  // Customer is a type resolver is one of the "key" GraphQL benefits, creating a link from
  // customer to address (and in more complex scenarios, linking it to its graph connections)
  Customer,
} = require('./customer/customerResolver');

// resolvers for the Address type
const {
  Query: AddressQuery,
  Mutation: AddressMutation,
} = require('./address/addressResolver');

// resolvers for the Warehouse type
const {
  Query: WarehouseQuery,
  Mutation: WarehouseMutation,
  Warehouse,
} = require('./warehouse/warehouseResolver');

// resolvers for the Order type
const {
  Query: OrderQuery,
  Mutation: OrderMutation,
  Order,
} = require('./order/orderResolver');

// resolvers for the Product type
const {
  Query: ProductQuery,
  Mutation: ProductMutation,
} = require('./product/productResolver');

// resolvers for the Cart type
const {
  Query: CartQuery,
  Mutation: CartMutation,
} = require('./cart/cartResolver');

// export all of those combined (Query and Mutation are standard & build into gql, Customer
// is a type resolver)
module.exports = {
  Query: {
    ...CustomerQuery,
    ...AddressQuery,
    ...WarehouseQuery,
    ...OrderQuery,
    ...ProductQuery,
    ...CartQuery,
  },
  Mutation: {
    ...CustomerMutation,
    ...AddressMutation,
    ...WarehouseMutation,
    ...OrderMutation,
    ...ProductMutation,
    ...CartMutation,
  },
  Customer,
  Order,
  Warehouse,
};
