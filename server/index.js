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

// flow test (if needed)
// app.use(express.json()); // parse req.body to json
// app.use((req, res, next) => {
//   console.log(`METHOD: ${req.method}, \nURL: ${req.url}, \nBODY: ${JSON.stringify(req.body)}\n`);
//   return next();
// });

// massively helpful resource: https://marmelab.com/blog/2017/09/06/dive-into-graphql-part-iii-building-a-graphql-server-with-nodejs.html
// makeExe.Sch. is used to combine the typeDef and resolvers. this allows us to
// define type resolvers which are essential to relational data in my opinion...
// const schema = makeExecutableSchema({ typeDefs, resolvers });
const startServer = async () => {
  // this is asyncronous, so use await to avoid sending an unresolved promise to context in app.use

  const mongo = await mongoConnectionAndModels();

  // console.log(mongo); // contains { CartModel: Model { Cart } }

  // console.log('--before default / use');
  // THIS WAS THROWING ERRORS BECAUSE A FETCH TO ANY ENDPOINT HAS TO GO THROUGH HERE
  // app.use('/', (req, res) => res.send('hello'));


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

// async function that delays how long until the server runs, for testing
// async function breakShit() {
//   return new Promise((resolve) => {
//     setTimeout(() => { resolve(); }, 5000);
//   });
// }
// breakShit().then(() => startServer());


// run the async function defined above to connect to mongo and run the server
startServer();

/*
  * EXAMPLE QUERY FROM THE FRONT END (FETCH)
  fetch('/graphql', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ query: '{ addresses { address address2 city state zipCode } }'})
  })
  .then(res => res.json())
  .then(data => console.log(data))
  .catch(err => console.log('ERROR!!!', err));
  */

/*
  * EXAMPLE QUERY FROM THE FRONT END FOR A MUTATION
  fetch('/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      query: `mutation {
        addCustomer (
          firstName: "testing2"
          lastName: "testingLast"
          phoneNumber: "347-306-5701klhjkg"
          email: "alex@al,hjkhex.com"
        ) {
          #asking for what data we want back
          firstName
          lastName
          cart { products }
        }
      }`,
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data))
    .catch((err) => console.log('ERROR!!!', err));
*/

function graphQuill() {}
graphQuill(`
  {
    customer (id: 10) { 
      firstName 
      lastName
      email
      phoneNumber
      address {
        address
        address2
        city
        state
        zipCode
      }
    }
  }
`);

graphQuill(`{
  warehouse (warehouseId: 5) {
    name 
  }
}`);
