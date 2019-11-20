const {
  Query: { address, addresses },
  Mutation: { createOrUpdateAddress, updateAddress },
} = require('../server/address/addressResolver');

describe('testing address resolver', () => {
  it('should be a function', () => {
    expect(typeof address).toBe('function');
  });
  it('returns an address object', () => {
    // a mock promise generator that "mimics" expected database activity
    const querySubstitute = (q) => {
      if (q === 'SELECT * FROM addresses WHERE id = $1 LIMIT 1') {
        return Promise.resolve({
          rows: [{
            address: '68 White St',
            city: 'New York',
            state: 'NY',
            zipCode: '10013',
          }],
        });
      }
      return 'Error!!';
    };

    // create mock parent, args and context arguments as required by the resolver
    const args = { id: 1 };
    const context = { psqlPool: { query: querySubstitute } };

    // run the thenable promise and confirm the resolver is working as expected with these inputs
    // masking their actual functionality...
    address(null, args, context).then((results) => {
      expect(results).toEqual({
        address: '68 White St',
        city: 'New York',
        state: 'NY',
        zipCode: '10013',
      });
    });
  });
});

describe('testing addresses resolver', () => {
  it('should be a function', () => {
    expect(typeof addresses).toBe('function');
  });
  it('should return an array of addresses', () => {
    const querySubstitute = (q) => {
      if (q !== 'SELECT * FROM addresses') return 'Error!!';
      return Promise.resolve({
        rows: [
          {
            address: '68 White St', city: 'NY', state: 'NY', zipCode: '10013',
          }, {
            address: 'Not White St', city: 'Somewhere', state: 'IDK', zipCode: '88388',
          },
        ],
      });
    };
    const context = { psqlPool: { query: querySubstitute } };
    return addresses(null, null, context).then((result) => {
      expect(result).toEqual([
        {
          address: '68 White St', city: 'NY', state: 'NY', zipCode: '10013',
        }, {
          address: 'Not White St', city: 'Somewhere', state: 'IDK', zipCode: '88388',
        },
      ]);
    });
  });
});

describe('testing the createOrUpdateAddress mutation', () => {
  it('should be a function', () => {
    expect(typeof createOrUpdateAddress).toBe('function');
  });
  it('should return a value of 1 to signal a successful change if the addressId is found', () => {
    const querySubstitute = (qu) => {
      // console.log(qu);
      if (qu.includes('SELECT "addressId" FROM customers')) {
        // console.log('in if stateemnt');
        return Promise.resolve({
          rowCount: 1,
          rows: [{ addressId: 12 }],
        });
      }
      if (qu.includes('WITH foundAddress AS (')) {
        // console.log('in second if');
        return Promise.resolve({
          rowCount: 1,
        });
      }
      return Promise.resolve({
        rowCount: 'error with rowCount',
        addressId: 'error with addressId',
      });
    };
    const context = { psqlPool: { query: querySubstitute } };
    const args = {
      customerId: 'Rich dude',
      address: '1 Park Ave',
      address2: 'apt2',
      city: 'NYC',
      state: 'NY',
      zipCode: '10017',
    };
    return createOrUpdateAddress(null, args, context).then((result) => {
      expect(result).toEqual(1);
    });
  });

  it('should return a value of 1 to signal a successful change if the addressId is not found and needs to be created', () => {
    const querySubstitute = (qu) => {
      // console.log(qu);
      if (qu.includes('SELECT "addressId" FROM customers')) {
        // console.log('in if stateemnt');
        return Promise.resolve({
          rowCount: 0,
          rows: [],
        });
      }
      if (qu.includes('WITH newAddress AS (')) {
        // console.log('in second if');
        return Promise.resolve({
          rowCount: 1,
        });
      }
      return Promise.resolve({
        rowCount: 'error with rowCount',
        addressId: 'error with addressId',
      });
    };
    const context = { psqlPool: { query: querySubstitute } };
    const args = {
      customerId: 'Rich dude',
      address: '1 Park Ave',
      address2: 'apt2',
      city: 'NYC',
      state: 'NY',
      zipCode: '10017',
    };
    return createOrUpdateAddress(null, args, context).then((result) => {
      expect(result).toEqual(1);
    });
  });
});

describe('tests for deprecated updateAddress mutation', () => {
  it('should be a function', () => {
    expect(typeof updateAddress).toBe('function');
  });

  it('should return an address type', () => {
    const querySubstitute = (q) => {
      if (q.includes('WITH foundAddress AS (')) {
        return Promise.resolve({
          rows: [{
            address: '68White St',
            address2: 'Fl5',
            city: 'NYC',
            state: 'NY',
            zipCode: '10013',
          }],
        });
      }
    };
    const args = {
      customerId: 10,
    };
    const context = { psqlPool: { query: querySubstitute } };
    return updateAddress(null, args, context).then((result) => {
      expect(result).toEqual({
        address: '68White St',
        address2: 'Fl5',
        city: 'NYC',
        state: 'NY',
        zipCode: '10013',
      });
    });
  });
});
