/**
 * This file exports a single object with keys of Query and Mutation
 * The values for those keys are objects themselves, where each key is the name of a
 * resolver function and the value is the corresponding resolver function.
 */

module.exports = {
  // the Query key sets all allowable queries that the user can make
  // queries are basically "Read" functionality
  Query: {
    // select a single address via id in the PSQL table
    address: (parent, args, context) => {
      // console.log('args: ', args);
      // set query text and values (id from arguments obj)
      const query = 'SELECT * FROM addresses WHERE id = $1 LIMIT 1';
      const values = [args.id];
      // return the async query to the d-base, parse out the only row that is returned
      return context.psqlPool.query(query, values)
        // the data.rows[0] is what actually gets returned because graphql plays nice with promises
        .then((data) => data.rows[0])
        .catch((err) => console.log('ERROR GETTING AN ADDRESS', err));
    },

    // returns all addresses, it's kind of useless but it was easy to make
    addresses: (parent, args, { psqlPool }) => {
      // alternatively, context can be destructured, but I find it less readable
      // console.log('addresses queried');
      const query = 'SELECT * FROM addresses';
      // return the promise of a query that resolves to the data.rows
      return psqlPool.query(query)
        .then((data) => data.rows)
        .catch((err) => console.log('ERROR LOOKING UP ADDRESSES', err));
    },
  },

  Mutation: {
    // mutation added that handles creating an address if the user doesn't have one, OR
    // updating their existing address
    createOrUpdateAddress: async (parent, args, { psqlPool }) => {
      // destrucutre the args
      const {
        customerId, address, address2, city, state, zipCode,
      } = args;

      // query for the addressId in the customers table based on args.customerId
      const query1 = `SELECT "addressId" FROM customers
        WHERE id = $1`;
      // the only value is the customerId (destructured from the args)
      const values1 = [customerId];
      // console.log(query1, values1);

      // querying the database is asyncronous, so use await to set the addressId to the resolved
      // value of the query
      const addressId = await psqlPool.query(query1, values1)
        .then((res) => {
          if (!res.rowCount) return null;
          return res.rows[0].addressId;
        });

      // if the returned addressId is null, insert a new address
      if (!addressId) {
        // the query inserts a new address into the addresses table, then places that
        // new id into the addressId column of the customers table
        const queryInsert = `WITH newAddress AS (
          INSERT INTO addresses ("address", "address2", "city", "state", "zipCode")
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *
          )
          UPDATE customers SET "addressId" = (SELECT id FROM newAddress)
          WHERE id = $6;
          `;
        // values are all of the things required for making an address, and the
        // customerId from the previous query
        const valuesInsert = [
          address, address2, city, state, zipCode, customerId,
        ];
        // console.log(queryInsert, valuesInsert);

        // return the result of the query promise (inserting the address)
        // becuase of how the above queries are setup, the return value is the count of
        // updated rows which the front end can use to determine if the address was added
        return psqlPool.query(queryInsert, valuesInsert)
          .then((res) => res.rowCount)
          .catch((err) => {
            console.log('ERROR INSERTING A NEW ADDRESS', err);
            return 0; // if there's an error, return a zero that the query failed
          });
      }
      // else there is an existing address that needs to be updated
      // this query will update the found address (and not change anything in the customers table)
      const queryUpdate = `WITH foundAddress AS (
          SELECT "addressId" AS id
          FROM customers
          WHERE id = $1
          )
          UPDATE addresses SET 
            "address" = $2, 
            "address2" = $3,
            "city" = $4,
            "state" = $5,
            "zipCode" = $6
          WHERE id = (SELECT id FROM foundAddress)
          RETURNING *;
          `;
      const valuesUpdate = [
        customerId, address, address2, city, state, zipCode,
      ];
      // console.log(queryUpdate, valuesUpdate);

      // return the result of the query promise
      return psqlPool.query(queryUpdate, valuesUpdate)
        .then((res) => res.rowCount)
        .catch((err) => console.log('ERROR updating customer address', err));
    },

    // ! DEPRECATED, but kept for reference of a simpler mutation
    updateAddress: (parent, args, { psqlPool }) => {
      // DEPRECATED FOR createOrUpdateAddress
      // initialize the query statement
      let query = `WITH foundAddress AS (
        SELECT "addressId" as id 
        FROM customers 
        WHERE id = $1
        )
        UPDATE addresses SET 
        `;

      // initialize the values array which will have the id as the first argument
      const values = [args.customerId];
      let count = 2; // count will track which item in the array needs to be referenced in SQL

      // iterate through each element in the arguments and add to the query and values variables
      Object.keys(args).forEach((e) => {
        if (e !== 'customerId' && args[e]) { // omit id and null arguments
          query += `"${e}"= $${count}, `;
          count += 1;
          values.push(args[e]);
        }
      });

      // remove the last comma off the query
      query = query.slice(0, query.length - 2);

      // add in selector w/ first item in array being the id from args
      query += ' WHERE id = (SELECT id FROM foundAddress) RETURNING *';

      // console.log(query, values);

      return psqlPool.query(query, values)
        .then((res) => res.rows[0])
        .catch((err) => console.log('ERROR WHILE UPDATING CUSTOMER\'S ADDRESS: updateAddress Mutation', err));
    }, // ! DEPRECATED ------------
  },
};
