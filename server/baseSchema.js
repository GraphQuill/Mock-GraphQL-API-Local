// setup a base schema that will be combined with the others

// by deprecating the dummy Query and mutation, they're basically hidden in
// the GraphiQL documentation which is nice
const Base = `
directive @deprecated(
  reason: String = "No longer supported"
) on FIELD_DEFINITION | ENUM_VALUE

type Query {
  dummy: Boolean @deprecated (reason: "dummy query does nothing")
}

type Mutation {
  dummy: Boolean @deprecated (reason: "does nothing")
}
`;

// the export is a function that returns an array, it has something to do with
// circularly dependant schemas. It's more clear in schemas that are not the
// base.
module.exports = () => [Base];
