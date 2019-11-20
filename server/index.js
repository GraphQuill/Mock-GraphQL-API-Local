const express = require('express');
const graphQLHTTP = require('express-graphql');

const app = express();
const PORT = 3000;

// import in the combined schema from schema.js
const schema = require('./schema');

// import the pool connection to pass into context
const psqlPool = require('../database/psql/dbConnection');

// import the mongo Models (they are on the export of dbConnection)
const mongoConnectionAndModels = require('../database/mongo/dbConnection');

// async function to start the server (to await the mongo connection)
const startServer = async () => {
  // this is asyncronous, so use await to avoid sending an unresolved promise to context in app.use

  // await the mongo connection to be passed into context only when it is connected
  const mongo = await mongoConnectionAndModels();

  console.log('--before graphql endpoint code');
  // setup the single graphql endpoint
  app.use('/graphql',
    graphQLHTTP({
      schema,
      graphiql: true,
      // best practice is to pass & control d-base connections and current user sessions via context
      context: {
        psqlPool,
        mongo,
      },
    }));

  console.log('-- before app.listen');
  // changed from PORT to 3000
  app.listen(PORT, () => console.log(`Listening on PORT ${PORT}`));
};

// example that is used to slow down the startup of the server for demonstration purposes only
// async function that delays how long until the server runs, for testing
// async function slowDownStuff() {
//   return new Promise((resolve) => {
//     setTimeout(() => { resolve(); }, 5000);
//   });
// }
// slowDownStuff().then(() => startServer());


// run the async function defined above to connect to mongo and run the server
startServer();
