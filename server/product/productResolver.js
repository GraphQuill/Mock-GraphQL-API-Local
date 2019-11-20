/**
 * @module: productResolver.js
 * @author: Austin Ruby
 * @description: define resolvers for product data
 */

module.exports = {
  Query: {
    product: (parent, args, context) => {
      const query = 'SELECT * FROM products WHERE "productId"=$1 LIMIT 1';
      const values = [args.productId];

      return context.psqlPool.query(query, values)
        .then((data) => data.rows[0])
        .catch((err) => console.log('ERROR LOOKING UP PRODUCT', err));
    },
    products: (parent, args, context) => {
      const query = 'SELECT * FROM products';

      return context.psqlPool.query(query)
        .then((data) => data.rows)
        .catch((err) => console.log('ERROR LOOKING UP PRODUCTS', err));
    },
  },
  Mutation: {
    addProduct: (parent, args, context) => {
      const query = 'INSERT INTO products (name, description, price, weight) VALUES ($1, $2, $3, $4) RETURNING *';
      const values = [args.name, args.description, args.price, args.weight];

      return context.psqlPool.connect()
        .then((client) => client.query(query, values)
          .then((data) => {
            client.release();
            return data.rows[0];
          })
          .catch((err) => console.log('ERROR INSERTING PRODUCT', err)))
        .catch((err) => console.log('ERROR CONNECTING WHILE ADDING PRODUCT', err));
    },
    updateProduct: (parent, args, context) => {
      let query = 'UPDATE products SET ';
      const values = [args.productId];
      let count = 2;

      Object.keys(args).forEach((el) => {
        if (el !== 'productId' && args[el]) {
          query += `"${el}"= $${count}, `;
          count += 1;
          values.push(args[el]);
        }
      });

      query = query.slice(0, query.length - 2);
      query += ' WHERE "productId"=$1 RETURNING *';

      return context.psqlPool.connect()
        .then((client) => client.query(query, values)
          .then((data) => {
            client.release();
            return data.rows[0];
          })
          .catch((err) => console.log('ERROR UPDATING PRODUCT', err)))
        .catch((err) => console.log('ERROR CONNECTING WHILE UPDATING PRODUCT', err));
    },
    deleteProduct: (parent, args, context) => {
      const query = 'DELETE FROM products WHERE "productId"=$1 RETURNING *';
      const values = [args.productId];

      return context.psqlPool.connect()
        .then((client) => client.query(query, values)
          .then((data) => {
            client.release();
            return data.rows[0];
          })
          .catch((err) => console.log('ERROR DELETING PRODUCT', err)))
        .catch((err) => console.log('ERROR CONNECTING WHILE DELETING PRODUCT', err));
    },
  },
};
