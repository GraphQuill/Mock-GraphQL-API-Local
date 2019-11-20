/**
 * @module: warehouseResolver.js
 * @author: Austin Ruby
 * @description: define resolvers for warehouse data
 */

module.exports = {
  Query: {
    warehouse: (parent, args, context) => {
      const query = 'SELECT * FROM warehouses WHERE "warehouseId" = $1 LIMIT 1';
      const values = [args.warehouseId];
      return context.psqlPool.query(query, values)
        .then((data) => data.rows[0])
        .catch((err) => console.log('ERROR LOOKING UP WAREHOUSE', err));
    },
    warehouses: (parent, args, context) => {
      const query = 'SELECT * FROM warehouses';
      return context.psqlPool.query(query)
        .then((data) => data.rows)
        .catch((err) => console.log('ERROR LOOKING UP WAREHOUSES', err));
    },
  },
  Mutation: {
    addWarehouse: (parent, args, context) => {
      const query = 'INSERT INTO warehouses (name, "addressId") VALUES ($1, $2) RETURNING *';
      const values = [args.name, args.addressId];

      return context.psqlPool.connect()
        .then((client) => client.query(query, values)
          .then((data) => {
            client.release();
            return data.rows[0];
          })
          .catch((err) => console.log('ERROR INSERTING WAREHOUSE', err)))
        .catch((err) => console.log('ERROR CONNECTING WHILE ADDING WAREHOUSE', err));
    },
    updateWarehouse: (parent, args, context) => {
      let query = 'UPDATE warehouses SET ';
      const values = [args.warehouseId];
      let count = 2;

      Object.keys(args).forEach((el) => {
        if (el !== 'warehouseId' && args[el]) {
          query += `"${el}"= $${count}, `;
          count += 1;
          values.push(args[el]);
        }
      });

      query = query.slice(0, query.length - 2);
      query += ' WHERE "warehouseId"=$1 RETURNING *';

      return context.psqlPool.connect()
        .then((client) => client.query(query, values)
          .then((data) => {
            client.release();
            return data.rows[0];
          })
          .catch((err) => console.log('ERROR UPDATING WAREHOUSE', err)))
        .catch((err) => console.log('ERROR CONNECTING WHILE UPDATING WAREHOUSE', err));
    },
    deleteWarehouse: (parent, args, context) => {
      const query = 'DELETE FROM warehouses WHERE "warehouseId"=$1 RETURNING *';
      const values = [args.warehouseId];

      return context.psqlPool.connect()
        .then((client) => client.query(query, values)
          .then((data) => {
            client.release();
            return data.rows[0];
          })
          .catch((err) => console.log('ERROR DELETING WAREHOUSE', err)))
        .catch((err) => console.log('ERROR CONNECTING WHILE DELETING WAREHOUSE', err));
    },
  },
  Warehouse: {
    address: (parent, args, context) => {
      const query = 'SELECT * FROM addresses WHERE id=$1 LIMIT 1';
      const values = [parent.addressId];

      return context.psqlPool.connect()
        .then((client) => client.query(query, values)
          .then((data) => {
            client.release();
            return data.rows[0];
          })
          .catch((err) => {
            client.release();
            console.log('ERROR GETTING CUSTOMER\'S ADDRESS', err);
          }))
        .catch((err) => console.log('ERROR IN WAREHOUSE TYPE RESOLVER', err));
    },
  },
};
