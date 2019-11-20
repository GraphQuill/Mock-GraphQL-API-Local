module.exports = {
  Query: {
    // query to lookup a cart by customerId
    cart: async (parent, args,
      // destructrue the CartModel out of the context parameter
      { mongo: { CartModel } }) => {
      // use findOne to return a single mongo document. Because the mongo document has the same
      // keys as the graphql Cart type, the default resolver will "coerce" this into a graphql type
      const queryResult = await CartModel.findOne({ customerId: args.customerId },
        // await is used to block further execution and set the queryResult variable to the data
        // that is returned from the findOne query
        (err, data) => {
          if (err) return console.log('ERROR IN MONOG QUERY cart Query: ', err);
          if (!data) {
            return console.log('cart does not exist');
          }
          // return console.log('the found cart is', data);
          return data; // I'm pretty sure this is doing nothing...
        });
      // console.log('findOne data is', queryResult);

      // defaultCart object made to be returned if the query returns null
      // not all users need to have carts so this is possible and avoids graphql type error
      const defaultCart = { customerId: args.customerId, products: [], wishlist: [] };

      // return the queryResult if it's truthy (i.e. not null), otherwise return the defaultCart
      return queryResult || defaultCart;
    },
  },

  Mutation: {
    // Mutation that updates a cart with a given item, or creates the cart if it doesn't exist
    createOrUpdateCart: async (parent, args,
      // destrucutre out the Cart Model
      { mongo: { CartModel } }) => CartModel.findOneAndUpdate({
      // first parameter of findOneAndUpdate: "lookup conditions"
      customerId: args.customerId,
    }, {
      // second parameter: "what to update"
      // used $addToSet instead which treats the products value as a set and doesn't allow
      // duplicates when "pushing" to the array.
      $addToSet: { products: args.newItem },
    }, {
      // third parameter: options
      lean: true, // reduces overhead of returning document (I think)
      new: true, // returns the modified document, instead of the document before changes
      upsert: true, // adds the docuemnt if one is not found (update/insert)
      useFindAndModify: false, // this has to do with some deprecation thing
    }, (err, data) => {
      if (err) return console.log('ERROR in addOrUpdateCart mutation', err);
      // return console.log('data is', data);
      return data; // I'm pretty sure this doesn't actually do anything...
    }),

    // mutation to remove items from a cart
    // inputted arguments are the customerId and itemsToRemove (an array of strings)
    removeItemsFromCart: (parent, args, { mongo: { CartModel } }) => CartModel.findOneAndUpdate({
      // conditions
      customerId: args.customerId,
    }, {
      // updateObject: pullAll removes all instances that match the argument
      $pullAll: { products: args.itemsToRemove },
    }, {
      // options
      new: true, // option to return the updated mongoose document (instead of before it updates)
      useFindAndModify: false,
    }, (err, data) => { // callback to error handle
      if (err) return console.log(err);
      // return console.log('data found is ', data);
      return data; // this really doesn't do anything...
    }),

    deleteCart: async (parent, args, { mongo: { CartModel } }) => {
      // initialize a variable that will hold the found document
      let document;

      // make this blocking, to set the value of document
      await CartModel.findOneAndRemove({
        // conditions
        customerId: args.customerId,
      }, {
        // options
        useFindAndModify: false,
        select: 'customerId', // select to only return the customerId field
      }, (err, data) => {
        // callback
        if (err) return console.log(err);
        // console.log(data);

        // set the value of document to the returned data from mongoose
        document = data;
        return data; // this also doesn't really do anything...
      });
      // console.log('document', document);

      // return the document to satisfy the 'Cart' output of this mutation in the schema
      return document;
    },
  },


};
