<p align="center">
  <img width="250px" src="./assets/graphquill-logo.png" />
</p>

# GraphQuill's Mock GraphQL API
This GraphQL API was created and used for testing during the development of [GraphQuill](https://github.com/oslabs-beta/GraphQuill). GraphQuill is a real-time GraphQL API exploration extension for VSCode.

In an effort to allow other engineers to test out GraphQuill on a mock GraphQL API, we've open-sourced this repo. This project uses local installations of **PostgreSQL's Core Distribution** and **MongoDB Community Edition**. If you need to install them, refer to [How to Install PostgresQL and MongoDb](#to-install-and-setup-postgresql-and-mongodb)

There is also a dockerized version here for users who prefer to use Docker, [repo here](https://github.com/GraphQuill/Mock-GraphQL-API-Docker)

---

## Using this GraphQL API
Clone this repo: 

```javascript
git clone https://github.com/GraphQuill/Mock-GraphQL-API.git
```

Within the cloned folder, install all npm packages:

```javascript
npm install
```

After installing npm packages, run the resetDbs script to seed the database (this script can also be used to reset the database to a "default"/predictable starting point, which is exactly what it was used for during GraphQuill's development):

```javascript
npm run resetDbs
```

Your GraphQL API has been setup now and seeded with data from [faker](https://www.npmjs.com/package/faker). Now you can use the [GraphQuill](https://github.com/oslabs-beta/GraphQuill) extension to view the API's schema, send queries or mutations and receive responses, all within VS Code 😀

---
## The Schema of this API

This API was built as the backend of an eCommerce store. Below is the GraphQL schema that describes GraphQL types, available queries and mutations.

```graphql
AVAILABLE QUERIES:
address (id: Int!): Address!
addresses: [Address]!
customer (id: Int!): Customer!
customers: [Customer]!
cart (customerId: Int!): Cart!
order (orderId: Int!): Order!
customerOrders (customerId: Int!): [Order]!
product (productId: Int!): Product!
products: [Product]!
warehouse (warehouseId: Int!): Warehouse!
warehouses: [Warehouse]!

AVAILABLE MUTATIONS:
createOrUpdateAddress (
  customerId: Int!, 
  address: String!, 
  address2: String, 
  city: String!, 
  state: String!, 
  zipCode: String!
  ): Int!
addCustomer (
  firstName: String!, 
  lastName: String!, 
  email: String!, 
  phoneNumber: String!
  ): Customer!
updateCustomer (
  id: Int!, 
  firstName: String, 
  lastName: String, 
  email: String, 
  phoneNumber: String
  ): Customer!
deleteCustomer (id: Int!): Int!
createOrUpdateCart (
  customerId: Int!, 
  newItem: String!
  ): Cart!
removeItemsFromCart (
  customerId: Int!, 
  itemsToRemove: String!
  ): Cart!
deleteCart (customerId: Int!): Cart!
addOrder (
  customerId: Int!, 
  products: OrderProduct!
  ): Int!
addProduct (
  name: String!, 
  description: String!, 
  price: Float!, 
  weight: Float!
  ): Product!
updateProduct (
  productId: Int!, 
  name: String, 
  description: String, 
  price: Float, 
  weight: Float
  ): Product!
deleteProduct (productId: Int!): Product!
addWarehouse (
  name: String!, 
  addressId: Int!
  ): Warehouse!
updateWarehouse (
  warehouseId: Int!, 
  name: String, 
  id: Int
  ): Warehouse!
deleteWarehouse (warehouseId: Int!): Warehouse!


TYPES: 
Address
  id: Int!,
  address: String!,
  address2: String,
  city: String!,
  state: String!,
  zipCode: String!
  
Customer
  id: Int!,
  firstName: String!,
  lastName: String!,
  email: String!,
  phoneNumber: String!,
  address: Address,
  cart: Cart
  
Cart
  customerId: Int!,
  products: [String!],
  wishlist: [String!]
  
Order
  orderId: Int!,
  customer: Customer,
  products: [Product!]
  
Product
  productId: Int!,
  name: String!,
  description: String!,
  price: Float!,
  weight: Float!,
  productQty: Int
  
Warehouse
  warehouseId: Int!,
  name: String!,
  address: Address
```

---

## To Install And Setup PostgreSQL and MongoDB: 
We recommend using homebrew for both installs if you are on macOs. Follows the links below to installation instructions. 
Install Postgres (we used v11.4 on macOs): https://www.postgresql.org/download/
Install MongoDB (we used v4.2.1 on macOs): https://docs.mongodb.com/manual/administration/install-community/

**1. After installing Postgres**, you'll need to create a user 'graphquill' with the password 'graphquill' which has access to the graphquillpsql database. 
You may need to start the Postgres database on your computer. For macOS:
  * first check if homebrew has it running with:
    
    ```javascript
    brew services list
    ```

  * if it is not running, start it using:
    
    ```javascript
    brew services start postgresql
    ```

  * Open the postgres terminal: 
    
    ```javascript
    psql postgres
    ```

  * Then create a user:
    
    ```javascript
    CREATE USER graphquill WITH PASSWORD 'graphquill';
    ```

  * Create the database:
    
    ```javascript
    CREATE DATABASE graphquillpsql;
    ```

  * Give the graphquill user access to modify the database:
    
    ```javascript
    GRANT ALL PRIVILEGES ON DATABASE graphquillpsql TO graphquill;
    ```
**2. After installing MongoDB** you will need to start the server. 

  * Again if you used homebrew you can check that using: 

    ```javascript
    brew services list
    ```

  * and start MongoDB using:
 
    ```javascript
    brew services start mongodb-community
    ```

After completing these database setups, you can continue along with using this repo. ([Instructions](#using-this-graphql-api))
