const {
  Query: { customer, customers },
  Mutation: {
    addCustomer, addCustomerAndAddress, updateCustomer, deleteCustomer,
  },
  Customer: { address, cart },
} = require('../server/customer/customerResolver');

describe('testing customer Query', () => {
  // it('should be equal', () => expect(1).toEqual(1));
  it('should be a function', () => {
    expect(typeof customer).toBe('function');
  });
  it('should return a customer when queried with an id in the argument', () => {
    const querySub = (q) => {
      if (q === 'SELECT * FROM customers WHERE id = $1 LIMIT 1') {
        return Promise.resolve({
          rows: [{
            firstName: 'bob',
            lastName: 'roberts',
            email: 'bob@bob.com',
            phoneNumber: '212-332-3094',
          }],
        });
      }
    };
    const args = { id: 3 };
    const context = { psqlPool: { query: querySub } };
    return customer(null, args, context).then((result) => {
      expect(result).toEqual({
        firstName: 'bob',
        lastName: 'roberts',
        email: 'bob@bob.com',
        phoneNumber: '212-332-3094',
      });
    });
  });
});
