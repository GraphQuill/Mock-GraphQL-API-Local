/**
 * @module: orderResolver.js
 * @author: Austin Ruby
 * @description: define resolvers for order data
 */

module.exports = {
  Query: {
    order: (parent, args, context) => {
      const query = 'SELECT * FROM "customerOrders" WHERE "orderId" = $1';
      const values = [args.orderId];

      return context.psqlPool.query(query, values)
        .then((data) => data.rows[0])
        .catch((err) => console.log('ERROR LOOKING UP ORDER', err));
    },
    customerOrders: (parent, args, context) => {
      const query = 'SELECT * FROM "customerOrders" WHERE "customerId" = $1';
      const values = [args.customerId];

      return context.psqlPool.query(query, values)
        .then((data) => data.rows)
        .catch((err) => console.log('ERROR LOOKING UP ORDERS FOR ', err));
    },
  },
  Mutation: {
    addOrder: async (parent, args, context) => {
      console.log('addOrder args are: ', args);
      // query to insert row in customerOrders table with customerId provided
      const customerOrderQuery = 'INSERT INTO "customerOrders" ("customerId") VALUES ($1) RETURNING *';
      // query to add row/s to orderProducts table based on productIds, productQtys provided
      // and orderId created by customerOrderQuery
      const orderProductQuery = 'INSERT INTO "orderProducts" ("productId", "productQty", "orderId") VALUES ($1, $2, $3) RETURNING *';
      // destructure customerId and products array from args
      const { customerId, products } = args;

      // declare client outside of try block to enable calling release() in catch block
      let client;
      // wrapping all async in one try block
      // TODO: is there a better way to do this?
      try {
        // assign client to awaited returned value of invoking connect on psqlPool
        client = await context.psqlPool.connect();
        // await returned value of querying client to add customerOrder
        const customerOrderData = await client.query(customerOrderQuery, [customerId]);
        // destructure returned orderId off of customerOrderData
        const { orderId } = customerOrderData.rows[0];
        // await resolution of all promises before continuing thread of execution
        await Promise.all(
          // using map to return array of promises
          products.map((product) => {
          // destructure productId and productQty off of product
            const { productId, productQty } = product;
            const values = [productId, productQty, orderId];
            // insert into orderProducts for each product
            return client.query(orderProductQuery, values)
              // still using then here because it allows for more specific error messaging and isn't too nested
              // TODO: is this even necessary?
              .then((orderProductData) => {
                console.log(orderProductData.rows);
              })
              .catch((err) => console.log(`ERROR CREATING ORDERPRODUCT FOR PRODUCT ID ${productId}: `, err));
          }),
        );
        // release client after all orderProduct queries resolve and return orderId
        client.release();
        return orderId;
      } catch (err) { // handle errors in try block
        // if client is truthy, release it
        if (client) client.release();
        // log error
        console.log('ERROR WITH ASYNC IN ADD ORDER TWO', err);
      }
      // return null to keep eslint happy
      return null;
    },
  },
  Order: {
    customer: (parent, args, context) => {
      const query = 'SELECT * FROM customers WHERE id = $1 LIMIT 1';
      const values = [parent.customerId];

      return context.psqlPool.query(query, values)
        .then((data) => data.rows[0])
        .catch((err) => console.log('ERROR LOOKING UP CUSTOMER ON ORDER', err));
    },
    products: (parent, args, context) => {
      const query = `
      SELECT products."productId", products.name, products.description, products.price, products.weight, "orderProducts"."productQty"  FROM "customerOrders"
        JOIN "orderProducts" ON "customerOrders"."orderId" = "orderProducts"."orderId"
        JOIN products ON "orderProducts"."productId" = products."productId"
        WHERE "customerOrders"."orderId" = $1;
        `;
      const values = [parent.orderId];

      return context.psqlPool.query(query, values)
        .then((data) => data.rows)
        .catch((err) => console.log('ERROR LOOKING UP PRODUCTS FOR ORDER', err));
    },
  },
};
